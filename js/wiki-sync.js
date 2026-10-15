(() => {
  const campus = 'https://campus.kongtian.university';
  const entries = window.WIKI_ENTRIES;
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const safeHtml = html => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const allowed = new Set(['P','H1','H2','H3','H4','H5','H6','UL','OL','LI','STRONG','EM','DEL','CODE','PRE','BLOCKQUOTE','A','IMG','TABLE','THEAD','TBODY','TR','TH','TD','HR','BR']);
    for (const el of [...doc.body.querySelectorAll('*')]) {
      if (!allowed.has(el.tagName)) { el.remove(); continue; }
      for (const attr of [...el.attributes]) {
        if (!['href','src','alt','title'].includes(attr.name)) el.removeAttribute(attr.name);
      }
      for (const name of ['href','src']) {
        if (!el.hasAttribute(name)) continue;
        try {
          const url = new URL(el.getAttribute(name), campus);
          if (!['https:','http:'].includes(url.protocol)) el.removeAttribute(name);
          else el.setAttribute(name, url.href);
        } catch { el.removeAttribute(name); }
      }
      if (el.tagName === 'IMG') el.setAttribute('loading', 'lazy');
    }
    return doc.body.innerHTML;
  };
  const status = document.querySelector('[data-wiki-sync-status]');
  if (status) status.textContent = '正在读取最新词条…';
  window.WIKI_READY = (async () => {
    window.WIKI_SYNC_AVAILABLE = false;
    try {
      const response = await fetch(`${campus}/api/wiki/public`, { credentials: 'omit', cache: 'no-store', signal: AbortSignal.timeout(5000) });
      if (!response.ok) throw new Error('unavailable');
      const feed = await response.json();
      if (feed.schemaVersion !== 1 || !Array.isArray(feed.entries) || feed.entries.length > 10000) throw new Error('invalid feed');
      const hashes = Object.fromEntries(await Promise.all(Object.entries(entries).map(async ([id, entry]) => {
        const data = { title: entry.title, summary: entry.summary || '', sections: entry.sections || [] };
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(data)));
        return [id, [...new Uint8Array(digest)].map(b => b.toString(16).padStart(2, '0')).join('')];
      })));
      const incoming = [];
      let officialPending = false;
      const seen = new Set();
      for (const entry of feed.entries) {
        if (!entry || typeof entry.id !== 'string' || !/^(?:(?:article|student|college|place):)?[a-z0-9-]{2,64}$/.test(entry.id)
          || seen.has(entry.id) || typeof entry.title !== 'string' || typeof entry.summary !== 'string'
          || entry.title.length > 100 || entry.summary.length > 4000 || !Array.isArray(entry.sections)
          || entry.sections.some(s => typeof s.html !== 'string' || typeof s.title !== 'string')) throw new Error('invalid entry');
        seen.add(entry.id);
        if (own(entries, entry.id) && hashes[entry.id] !== entry.officialHash) { officialPending = true; continue; }
        incoming.push([entry.id, { title: entry.title, summary: entry.summary, sections: entry.sections.map((s, i) => ({ id: `content-${i}`, title: s.title, html: safeHtml(s.html) })), version: entry.version }]);
      }
      for (const [id, entry] of incoming) {
        if (!own(entries, id)) {
          window.WIKI_CLOUD.push({ id, text: entry.title, weight: 2 });
        }
        entries[id] = entry;
      }
      const known = new Set();
      const walk = nodes => nodes.forEach(node => { if (node.id) { known.add(node.id); node.label = entries[node.id]?.title || node.label; } if (node.children) walk(node.children); });
      walk(window.WIKI_NAV);
      const extra = Object.entries(entries).filter(([id]) => !known.has(id));
      if (extra.length) window.WIKI_NAV.push({ label: '更多校园档案', children: extra.map(([id, e]) => ({ id, label: e.title })) });
      window.WIKI_SYNC_AVAILABLE = true;
      if (status) status.textContent = officialPending ? '已保留官网新修订，其余词条已更新。' : '已读取最新词条 · 修改请前往校园站';
    } catch {
      if (status) status.textContent = '最新词条暂时无法读取，当前显示官网存档。可稍后刷新重试。';
    }
  })();
})();
