window.WIKI_READY.then(() => {
  const list = document.querySelector('[data-wiki-index]');
  const search = document.querySelector('[data-wiki-search]');
  const count = document.querySelector('[data-wiki-count]');
  if (!list || !search) return;
  const render = () => {
    const q = search.value.trim().toLocaleLowerCase();
    const items = Object.entries(window.WIKI_ENTRIES).filter(([, e]) => `${e.title} ${e.summary}`.toLocaleLowerCase().includes(q));
    list.replaceChildren();
    for (const [id, entry] of items) {
      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = `wiki-entry.html?id=${encodeURIComponent(id)}`;
      const title = document.createElement('strong'); title.textContent = entry.title;
      const summary = document.createElement('span'); summary.textContent = entry.summary;
      a.append(title, summary); li.append(a); list.append(li);
    }
    if (count) count.textContent = items.length ? `${items.length} 个词条` : '没有找到相关词条，请换一个关键词。';
  };
  search.addEventListener('input', render); render();
});
