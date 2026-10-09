(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const api = '/api/campus-card/';
  let currentPage = 1, total = 0, revision = 0, timer;
  function message(text) { $('message').textContent = text; }
  function signedIn(value) { $('login').hidden = value; $('dashboard').hidden = !value; $('logout').hidden = !value; if (!value) $('images').replaceChildren(); }
  async function request(path, body) {
    const response = await fetch(api + path, {cache:'no-store', ...(body === undefined ? {} : {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})});
    const result = await response.json();
    if (!response.ok) { if (response.status === 401) signedIn(false); throw new Error(result.error || '操作失败，请重试。'); }
    return result;
  }
  function switchState(accepting) { $('accepting').checked = accepting; $('switch-hint').textContent = accepting ? '正在接收打印图片。同名提交会替换原图。' : '接收已关闭。新图片不会保存，已提交图片仍可下载。'; }
  async function load() {
    const version = ++revision;
    const data = await request(`images?page=${currentPage}&q=${encodeURIComponent($('search').value.trim())}`);
    if (version !== revision) return;
    total = data.total; switchState(data.accepting); $('images').replaceChildren();
    $('count').textContent = `共 ${total} 张校园卡 · 每个文件名仅保留最新一张`;
    $('empty').hidden = total !== 0;
    for (const item of data.items) {
      const url = api + 'images/' + encodeURIComponent(item.name);
      const article = document.createElement('article'); article.className = 'image-item';
      const preview = document.createElement('a'); preview.href = url; preview.target = '_blank'; preview.rel = 'noopener'; preview.setAttribute('aria-label', '查看 ' + item.name);
      const image = document.createElement('img'); image.src = `${url}?v=${item.updated}`; image.alt = item.name; image.loading = 'lazy'; preview.append(image);
      const meta = document.createElement('div'); meta.className = 'image-meta';
      const heading = document.createElement('h2'); heading.textContent = item.name;
      const detail = document.createElement('p'); detail.textContent = `${new Date(item.updated).toLocaleString('zh-CN')} · ${(item.size / 1024).toFixed(0)} KB`;
      const download = document.createElement('a'); download.href = url + '?download=1'; download.download = item.name; download.textContent = '下载校园卡 ↓';
      meta.append(heading, detail, download); article.append(preview, meta); $('images').append(article);
    }
    $('page-number').textContent = `${currentPage} / ${Math.max(1,Math.ceil(total/24))}`;
    $('previous').disabled = currentPage <= 1; $('next').disabled = currentPage * 24 >= total;
  }
  function reload() { load().catch(error => message(error.message)); }
  $('login').addEventListener('submit', async event => {
    event.preventDefault(); const button = $('login').querySelector('button'); button.disabled = true;
    try { await request('login', {username:$('username').value,password:$('password').value}); $('password').value = ''; signedIn(true); message(''); await load(); }
    catch(error) { message(error.message); } finally { button.disabled = false; }
  });
  $('logout').addEventListener('click', async () => { try { await request('logout', {}); signedIn(false); message('已退出登录。'); } catch(error) { message(error.message); } });
  $('accepting').addEventListener('change', async () => {
    const checkbox = $('accepting'), requested = checkbox.checked; checkbox.disabled = true;
    try { const result = await request('settings', {accepting:requested}); switchState(result.accepting); message(result.accepting ? '已开启，开始接收打印图片。' : '已关闭，不再接收打印图片。'); }
    catch(error) { checkbox.checked = !requested; message(error.message); } finally { checkbox.disabled = false; }
  });
  $('refresh').addEventListener('click', reload);
  $('search').addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(() => { currentPage = 1; reload(); }, 250); });
  $('previous').addEventListener('click', () => { currentPage--; reload(); });
  $('next').addEventListener('click', () => { currentPage++; reload(); });
  request('session').then(() => { signedIn(true); reload(); }).catch(error => { signedIn(false); if (!error.message.includes('先登录')) message(error.message); });
})();
