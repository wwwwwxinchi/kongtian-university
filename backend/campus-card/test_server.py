import hashlib
import http.client
import importlib.util
import json
import os
from pathlib import Path
import struct
import tempfile
import threading
import unittest
from urllib.parse import quote
import zlib


def png(color):
    def chunk(kind, data):
        return struct.pack('!I', len(data)) + kind + data + struct.pack('!I', zlib.crc32(kind + data))
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('!IIBBBBB', 1016, 638, 8, 2, 0, 0, 0)) + chunk(b'IDAT', zlib.compress((b'\0' + bytes(color) * 1016) * 638)) + chunk(b'IEND', b'')


class ServiceTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.directory = tempfile.TemporaryDirectory()
        salt = bytes.fromhex('12' * 16)
        cls.password = 'local-test-only'
        os.environ.update(CARD_DATA=cls.directory.name, CARD_PASSWORD_HASH=salt.hex() + ':' + hashlib.pbkdf2_hmac('sha256', cls.password.encode(), salt, 600000).hex(), CARD_SECURE_COOKIE='0', CARD_ORIGINS='http://localhost', CARD_MIN_FREE='0')
        spec = importlib.util.spec_from_file_location('card_server', Path(__file__).with_name('server.py'))
        cls.module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(cls.module)
        cls.server = cls.module.ThreadingHTTPServer(('127.0.0.1', 0), cls.module.Handler)
        threading.Thread(target=cls.server.serve_forever, daemon=True).start()

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.directory.cleanup()

    def req(self, method, path, body=None, cookie='', origin='http://localhost', image=False, name='测试001.png'):
        headers = {'Origin': origin, 'Cookie': cookie}
        if body is not None:
            headers['Content-Type'] = 'image/png' if image else 'application/json'
            headers['X-Card-Filename'] = quote(name)
            if not image:
                body = json.dumps(body).encode()
        client = http.client.HTTPConnection('127.0.0.1', self.server.server_port)
        client.request(method, '/api/campus-card/' + path, body, headers)
        response = client.getresponse()
        result = response.status, dict(response.getheaders()), response.read()
        client.close()
        return result

    def test_complete_lifecycle(self):
        self.assertFalse(json.loads(self.req('GET', 'status')[2])['accepting'])
        self.assertEqual(self.req('POST', 'upload', png((0, 0, 0)), image=True)[0], 403)
        self.assertEqual(self.req('GET', 'images')[0], 401)
        self.assertEqual(self.req('POST', 'settings', {'accepting': True})[0], 401)
        self.assertEqual(self.req('POST', 'login', {'username': 'admin', 'password': 'bad'})[0], 401)
        self.assertEqual(self.req('POST', 'login', [1])[0], 400)
        result = self.req('POST', 'login', {'username': 'admin', 'password': self.password})
        self.assertEqual(result[0], 200)
        self.assertIn('HttpOnly', result[1]['Set-Cookie'])
        self.assertIn('SameSite=Strict', result[1]['Set-Cookie'])
        cookie = result[1]['Set-Cookie'].split(';')[0]
        self.assertEqual(self.req('POST', 'settings', {'accepting': True}, cookie, origin='https://evil.example')[0], 403)
        self.assertEqual(self.req('POST', 'settings', {'accepting': True}, cookie)[0], 200)
        self.assertTrue(json.loads(self.module.SETTINGS.read_text())['accepting'])
        first, second = png((20, 80, 200)), png((80, 20, 200))
        self.assertEqual(self.req('POST', 'upload', first, image=True, name='../escape.png')[0], 400)
        self.assertEqual(self.req('POST', 'upload', b'fake', image=True)[0], 400)
        self.assertEqual(self.req('POST', 'upload', first[:-20], image=True)[0], 400)
        self.assertEqual(self.req('POST', 'upload', first, image=True, origin='https://evil.example')[0], 403)
        self.assertEqual(self.req('POST', 'upload', first, image=True)[0], 200)
        self.assertEqual(self.req('GET', 'images/' + quote('测试001.png'))[0], 401)
        result = self.req('POST', 'upload', second, image=True)
        self.assertTrue(json.loads(result[2])['replaced'])
        self.assertEqual(len(list(self.module.IMAGES.glob('*.png'))), 1)
        result = self.req('GET', 'images/' + quote('测试001.png') + '?download=1', cookie=cookie)
        self.assertEqual(result[2], second)
        self.assertIn(quote('测试001.png'), result[1]['Content-Disposition'])
        self.assertEqual(json.loads(self.req('GET', 'images?q=001', cookie=cookie)[2])['total'], 1)
        self.assertEqual(json.loads(self.req('GET', 'images?q=missing', cookie=cookie)[2])['total'], 0)
        self.assertEqual(self.req('POST', 'settings', {'accepting': False}, cookie)[0], 200)
        self.assertFalse(json.loads(self.module.SETTINGS.read_text())['accepting'])
        self.assertEqual(self.req('POST', 'upload', first, image=True)[0], 403)
        self.assertEqual((self.module.IMAGES / '测试001.png').read_bytes(), second)
        self.assertEqual(self.req('POST', 'logout', {}, cookie)[0], 200)
        self.assertEqual(self.req('GET', 'images', cookie=cookie)[0], 401)

    def test_webkit_significant_bits(self):
        source = png((20, 80, 200))
        def with_bits(bits):
            kind = b'sBIT'
            chunk = struct.pack('!I', len(bits)) + kind + bits + struct.pack('!I', zlib.crc32(kind + bits))
            return source[:33] + chunk + source[33:]
        self.module.validate_png(with_bits(bytes([8, 8, 8])))
        for bits in (bytes([8, 8]), bytes([8, 8, 8, 8]), bytes([0, 8, 8]), bytes([9, 8, 8])):
            with self.subTest(bits=bits), self.assertRaises(ValueError):
                self.module.validate_png(with_bits(bits))

    def test_ipad_exif_metadata(self):
        source = png((20, 80, 200))
        metadata = b'II\x2a\x00\x08\x00\x00\x00\x00\x00\x00\x00\x00\x00'
        kind = b'eXIf'
        chunk = struct.pack('!I', len(metadata)) + kind + metadata + struct.pack('!I', zlib.crc32(kind + metadata))
        self.module.validate_png(source[:33] + chunk + source[33:])
        corrupt = bytearray(source[:33] + chunk + source[33:])
        corrupt[42] ^= 1
        with self.assertRaises(ValueError):
            self.module.validate_png(bytes(corrupt))


if __name__ == '__main__':
    unittest.main()
