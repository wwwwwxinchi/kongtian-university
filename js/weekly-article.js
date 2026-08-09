(() => {
  const root = document.querySelector("[data-weekly-article]");
  if (!root || !window.WEEKLY_DATA) return;
  const id = new URLSearchParams(location.search).get("id") || "flight-test";
  const article = window.WEEKLY_DATA.articles.find((item) => item.id === id);
  if (!article) { root.innerHTML = '<h1>未找到文章</h1><p><a href="weekly.html">返回校园周报</a></p>'; return; }
  document.title = `${article.title} · 空天大学校园周报`;
  root.innerHTML = `<nav class="weekly-breadcrumb"><a href="weekly.html">校园周报</a><span>/</span><span>${article.category}</span></nav><article><header><p class="weekly-section-label">${article.category} · ${article.date}</p><h1>${article.title}</h1><p class="weekly-article-deck">${article.summary}</p><div class="weekly-article-byline">空天大学融媒体中心 · 本文为第一期占位稿</div></header><figure class="weekly-article-visual"><span class="weekly-aircraft"><i></i></span><figcaption>校园新闻图片占位 · 后续替换正式素材</figcaption></figure><div class="weekly-article-body"><p>本页面用于演示空天大学校园周报的正式文章阅读体验。后续接入新闻数据库后，可在不改变版式组件的前提下替换标题、摘要、正文、作者与图片字段。</p><p>相关教学与研究活动均依照校园安全规范开展。关于万有能场的实验数据，目前仍存在多种理论解释，学校鼓励不同学科团队以可复核的观测与公开讨论推进研究。</p><h2>编辑部说明</h2><p>新闻详情、图片说明、关联报道与附件下载区域已预留。正式内容发布前需经过院系与宣传部门审核。</p></div></article>`;
})();
