"""Seasonal campus-card service. Standard-library only; run behind nginx."""
import hashlib
import hmac
import json
import os
from pathlib import Path
import re
import secrets
import shutil
import struct
import threading
import time
from http.cookies import SimpleCookie
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, quote, unquote, urlsplit
import zlib

DATA = Path(os.environ.get('CARD_DATA', './data')).resolve()
IMAGES = DATA / 'images'
IMAGES.mkdir(parents=True, exist_ok=True)
SETTINGS = DATA / 'settings.json'
PASSWORD = os.environ['CARD_PASSWORD_HASH']  # salt:PBKDF2-SHA256, 600000 rounds
ORIGINS = set(os.environ.get('CARD_ORIGINS', 'https://kongtian.university,https://www.kongtian.university').split(','))
SECURE = os.environ.get('CARD_SECURE_COOKIE', '1') == '1'
MAX_IMAGE = 4 * 1024 * 1024
QUOTA = int(os.environ.get('CARD_QUOTA', str(1024**3)))
MIN_FREE = int(os.environ.get('CARD_MIN_FREE', str(1024**3)))
LOCK = threading.RLock()
SESSIONS = {}
ATTEMPTS = {}
UPLOADS = {}
ACCEPTING = json.loads(SETTINGS.read_text()).get('accepting') is True if SETTINGS.exists() else False


def atomic_write(path, body):
    temporary = path.parent / ('.pending-' + secrets.token_hex(12))
    try:
        with temporary.open('xb') as output:
            output.write(body)
            output.flush()
            os.fsync(output.fileno())
        os.replace(temporary, path)
    finally:
        temporary.unlink(missing_ok=True)


def validate_png(body):
    if not body.startswith(b'\x89PNG\r\n\x1a\n'):
        raise ValueError('只接收校园卡 PNG 图片。')
    pos, compressed, channels, ended = 8, bytearray(), None, False
    seen = set()
    while pos + 12 <= len(body):
        length = struct.unpack('!I', body[pos:pos + 4])[0]
        kind = body[pos + 4:pos + 8]
        end = pos + 12 + length
        if end > len(body):
            raise ValueError('PNG 文件不完整。')
        content = body[pos + 8:end - 4]
        if zlib.crc32(kind + content) != struct.unpack('!I', body[end - 4:end])[0]:
            raise ValueError('PNG 校验失败。')
        if pos == 8 and kind != b'IHDR':
            raise ValueError('PNG 缺少尺寸信息。')
        if kind == b'IHDR':
            if kind in seen or len(content) != 13:
                raise ValueError('PNG 头无效。')
            w, h, depth, color, compression, filtering, interlace = struct.unpack('!IIBBBBB', content)
            if (w, h, depth, compression, filtering, interlace) != (1016, 638, 8, 0, 0, 0) or color not in (2, 6):
                raise ValueError('请使用制作页生成的 1016 × 638 校园卡。')
            channels = 3 if color == 2 else 4
        elif kind == b'IDAT':
            compressed.extend(content)
        elif kind == b'IEND':
            if length or end != len(body):
                raise ValueError('PNG 结尾无效。')
            ended = True
            break
        elif kind not in (b'pHYs', b'sRGB', b'gAMA', b'cHRM', b'iCCP', b'tEXt', b'iTXt'):
            raise ValueError('PNG 包含不支持的数据块。')
        seen.add(kind)
        pos = end
    if not ended or not channels or not compressed:
        raise ValueError('PNG 文件不完整。')
    stride = 1016 * channels + 1
    decoder = zlib.decompressobj()
    pixels = decoder.decompress(compressed, stride * 638 + 1)
    if len(pixels) != stride * 638 or not decoder.eof or decoder.unused_data or decoder.unconsumed_tail:
        raise ValueError('PNG 像素数据无效。')
    if any(pixels[row * stride] > 4 for row in range(638)):
        raise ValueError('PNG 像素过滤器无效。')


def filename(value):
    name = unquote(value, errors='strict')
    if (not name.endswith('.png') or len(name.encode('utf-8')) > 220
            or len(name) < 5
            or re.search(r'[<>:"/\\|?*\x00-\x1f\x7f]', name)):
        raise ValueError('图片文件名无效。')
    return name


class Handler(BaseHTTPRequestHandler):
    server_version = 'CampusCard'

    def setup(self):
        super().setup()
        self.connection.settimeout(20)

    def log_message(self, fmt, *args):
        # Never log cookies, credentials, or image filenames.
        pass

    def reply(self, code, data, cookie=None):
        body = json.dumps(data, ensure_ascii=False).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        if cookie:
            self.send_header('Set-Cookie', cookie)
        self.end_headers()
        self.wfile.write(body)

    def session(self):
        cookie = SimpleCookie()
        try:
            cookie.load(self.headers.get('Cookie', ''))
            token = cookie['campus_card_session'].value
        except (KeyError, ValueError):
            return None
        with LOCK:
            if SESSIONS.get(token, 0) > time.time():
                return token
        return None

    def authenticated(self):
        if self.session():
            return True
        self.reply(401, {'error': '请先登录管理员账号。'})
        return False

    def body(self, limit):
        if self.headers.get('Transfer-Encoding'):
            raise ValueError('不支持此上传方式。')
        size = int(self.headers.get('Content-Length', '0'))
        if size <= 0 or size > limit:
            raise ValueError('请求大小超出限制。')
        body = self.rfile.read(size)
        if len(body) != size:
            raise ValueError('上传未完成，请重试。')
        return body

    def do_GET(self):
        path = urlsplit(self.path)
        if path.path == '/api/campus-card/status':
            return self.reply(200, {'accepting': ACCEPTING})
        if not self.authenticated():
            return
        if path.path == '/api/campus-card/session':
            return self.reply(200, {'username': 'admin', 'accepting': ACCEPTING})
        if path.path == '/api/campus-card/images':
            query = parse_qs(path.query)
            search = query.get('q', [''])[0].casefold()[:220]
            try:
                page = max(1, int(query.get('page', ['1'])[0]))
            except ValueError:
                return self.reply(400, {'error': '页码无效。'})
            with LOCK:
                files = []
                for p in IMAGES.glob('*.png'):
                    if search in p.name.casefold():
                        stat = p.stat()
                        files.append({'name': p.name, 'size': stat.st_size, 'updated': stat.st_mtime_ns // 1000000})
            files.sort(key=lambda item: (-item['updated'], item['name']))
            return self.reply(200, {'items': files[(page - 1) * 24:page * 24], 'total': len(files), 'page': page, 'accepting': ACCEPTING})
        if path.path.startswith('/api/campus-card/images/'):
            try:
                name = filename(path.path.removeprefix('/api/campus-card/images/'))
                body = (IMAGES / name).read_bytes()
            except (ValueError, FileNotFoundError, UnicodeError):
                return self.reply(404, {'error': '图片不存在。'})
            self.send_response(200)
            self.send_header('Content-Type', 'image/png')
            self.send_header('Content-Length', str(len(body)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            disposition = 'attachment' if 'download' in parse_qs(path.query) else 'inline'
            self.send_header('Content-Disposition', disposition + "; filename*=UTF-8''" + quote(name))
            self.end_headers()
            return self.wfile.write(body)
        self.reply(404, {'error': '接口不存在。'})

    def do_POST(self):
        global ACCEPTING
        if self.headers.get('Origin') not in ORIGINS:
            return self.reply(403, {'error': '请从校园卡网站提交。'})
        path = urlsplit(self.path).path
        ip = self.headers.get('X-Real-IP', self.client_address[0])
        try:
            if path == '/api/campus-card/login':
                with LOCK:
                    now = time.time()
                    for key in list(ATTEMPTS):
                        ATTEMPTS[key] = [t for t in ATTEMPTS[key] if t > now - 300]
                        if not ATTEMPTS[key]:
                            del ATTEMPTS[key]
                    attempts = ATTEMPTS.setdefault(ip, [])
                    if len(attempts) >= 8:
                        return self.reply(429, {'error': '登录尝试过多，请 5 分钟后再试。'})
                    attempts.append(now)
                data = json.loads(self.body(4096))
                if not isinstance(data, dict):
                    raise ValueError('登录内容无效。')
                password = data.get('password', '')
                if not isinstance(password, str):
                    raise ValueError('账号或密码不正确。')
                salt, expected = PASSWORD.split(':', 1)
                actual = hashlib.pbkdf2_hmac('sha256', password.encode(), bytes.fromhex(salt), 600000).hex()
                if data.get('username') != 'admin' or not hmac.compare_digest(actual, expected):
                    return self.reply(401, {'error': '账号或密码不正确。'})
                token = secrets.token_urlsafe(32)
                with LOCK:
                    for key in list(SESSIONS):
                        if SESSIONS[key] <= now:
                            del SESSIONS[key]
                    SESSIONS[token] = now + 8 * 3600
                    ATTEMPTS.pop(ip, None)
                cookie = f'campus_card_session={token}; Path=/api/campus-card/; HttpOnly; SameSite=Strict; Max-Age=28800'
                return self.reply(200, {'ok': True}, cookie + ('; Secure' if SECURE else ''))
            if path == '/api/campus-card/logout':
                with LOCK:
                    SESSIONS.pop(self.session(), None)
                return self.reply(200, {'ok': True}, 'campus_card_session=; Path=/api/campus-card/; HttpOnly; SameSite=Strict; Max-Age=0' + ('; Secure' if SECURE else ''))
            if path == '/api/campus-card/settings':
                if not self.authenticated():
                    return
                data = json.loads(self.body(1024))
                if not isinstance(data, dict):
                    raise ValueError('开关状态无效。')
                if type(data.get('accepting')) is not bool:
                    raise ValueError('开关状态无效。')
                with LOCK:
                    atomic_write(SETTINGS, json.dumps({'accepting': data['accepting']}).encode())
                    ACCEPTING = data['accepting']
                return self.reply(200, {'accepting': ACCEPTING})
            if path == '/api/campus-card/upload':
                # Consume the bounded request before rejecting a closed activity.
                # Otherwise a TCP reset can hide the useful 403 response in browsers.
                body = self.body(MAX_IMAGE)
                if not ACCEPTING:
                    return self.reply(403, {'error': '打印提交暂未开放，你仍可下载校园卡。'})
                if self.headers.get('Content-Type') != 'image/png':
                    return self.reply(415, {'error': '只接收 PNG 图片。'})
                with LOCK:
                    now = time.time()
                    for key in list(UPLOADS):
                        UPLOADS[key] = [t for t in UPLOADS[key] if t > now - 60]
                        if not UPLOADS[key]:
                            del UPLOADS[key]
                    attempts = UPLOADS.setdefault(ip, [])
                    if len(attempts) >= 20:
                        return self.reply(429, {'error': '提交过于频繁，请稍后重试。'})
                    attempts.append(now)
                name = filename(self.headers.get('X-Card-Filename', ''))
                validate_png(body)
                with LOCK:
                    if not ACCEPTING:
                        return self.reply(403, {'error': '打印提交已关闭，本次图片未保存。'})
                    target = IMAGES / name
                    previous = target.stat().st_size if target.exists() else 0
                    total = sum(p.stat().st_size for p in IMAGES.glob('*.png'))
                    if total - previous + len(body) > QUOTA or shutil.disk_usage(DATA).free - len(body) < MIN_FREE:
                        return self.reply(507, {'error': '打印图片存储空间不足，请联系活动管理员。'})
                    atomic_write(target, body)
                return self.reply(200, {'ok': True, 'filename': name, 'replaced': previous > 0})
            self.reply(404, {'error': '接口不存在。'})
        except (ValueError, UnicodeError, zlib.error, struct.error):
            self.reply(400, {'error': '提交内容无效，请使用制作页重新生成后提交。'})
        except (OSError, TimeoutError):
            self.reply(503, {'error': '保存未完成，请稍后重试。'})


if __name__ == '__main__':
    # Only nginx can reach the service; uploads are stored outside the web root.
    ThreadingHTTPServer(('127.0.0.1', int(os.environ.get('CARD_PORT', '3118'))), Handler).serve_forever()
