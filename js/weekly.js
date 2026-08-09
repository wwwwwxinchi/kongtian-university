(() => {
  const root = document.querySelector("[data-weekly-app]");
  if (!root || !window.WEEKLY_DATA) return;
  const data = window.WEEKLY_DATA;
  const params = new URLSearchParams(location.search);
  let issueId = params.get("issue") || data.issues[0].id;
  let category = "全部";

  const link = (article, className = "") => `<a class="${className}" href="weekly-article.html?id=${encodeURIComponent(article.id)}">
    <span class="weekly-meta">${article.date.slice(5).replace("-", ".")} · ${article.category}</span>
    <strong>${article.title}</strong><span>${article.summary}</span>
  </a>`;

  const render = () => {
    const issue = data.issues.find((item) => item.id === issueId) || data.issues[0];
    issueId = issue.id;
    const articles = data.articles.filter((item) => item.issueId === issue.id);
    const feature = articles.find((item) => item.featured) || articles[0];
    const news = articles.filter((item) => !item.featured && (category === "全部" || item.category === category));
    const research = articles.filter((item) => item.category === "科研动态");
    const life = articles.filter((item) => item.category === "校园生活");

    root.innerHTML = `
      <section class="weekly-masthead wrap">
        <div><p class="weekly-overline">KONGTIAN UNIVERSITY WEEKLY</p><h1>空天大学校园周报</h1><p>${issue.description}</p></div>
        <label class="weekly-issue-picker">浏览期数<select data-issue-select>${data.issues.map((item) => `<option value="${item.id}" ${item.id === issue.id ? "selected" : ""}>${item.label} · ${item.dateLabel}</option>`).join("")}</select></label>
      </section>
      <div class="wrap weekly-rule"><span>${issue.label} · ${issue.dateLabel}</span><time datetime="${issue.publishedAt}">PUBLICATION ${issue.publishedAt}</time></div>
      <section class="weekly-feature wrap">
        <div class="weekly-feature-copy"><p class="weekly-section-label">本期头条 / COVER STORY</p><h2><a href="weekly-article.html?id=${feature.id}">${feature.title}</a></h2><p>${feature.summary}</p><a class="weekly-read" href="weekly-article.html?id=${feature.id}">阅读报道 <span aria-hidden="true">→</span></a></div>
        <a class="weekly-feature-art" href="weekly-article.html?id=${feature.id}" aria-label="阅读本期头条">
          <span class="weekly-aircraft" aria-hidden="true"><i></i></span><span class="weekly-art-caption">空天试验区 · 概念图占位</span>
        </a>
      </section>
      <section class="weekly-news wrap">
        <header class="weekly-section-head"><div><p class="weekly-section-label">CAMPUS NEWS</p><h2>校园新闻</h2></div><div class="weekly-filters" role="group" aria-label="新闻分类">${["全部","校园新闻","科研动态","校园生活"].map((item) => `<button type="button" data-category="${item}" class="${item === category ? "is-active" : ""}">${item}</button>`).join("")}</div></header>
        <div class="weekly-news-list">${news.length ? news.map((item, index) => link(item, index === 0 ? "is-lead" : "")).join("") : "<p>本期暂无该分类新闻。</p>"}</div>
      </section>
      <section class="weekly-research"><div class="wrap"><header class="weekly-section-head"><div><p class="weekly-section-label">RESEARCH NOTES</p><h2>科研动态</h2></div><p>来自实验室、试验场与学术讨论会的客观记录。</p></header><div class="weekly-research-grid">${research.map((item) => link(item)).join("")}</div></div></section>
      <section class="weekly-life wrap"><header class="weekly-section-head"><div><p class="weekly-section-label">LIFE ON CAMPUS</p><h2>校园生活</h2></div><p>课表之外，校园仍在继续生长。</p></header><div class="weekly-life-grid">${life.map((item, index) => `<article><span class="weekly-life-no">0${index + 1}</span>${link(item)}</article>`).join("")}</div></section>
      <section class="weekly-utility wrap"><div><header class="weekly-section-head"><div><p class="weekly-section-label">THIS WEEK</p><h2>本周日历</h2></div></header><ol class="weekly-calendar">${data.events.map((event) => `<li><time>${event.day}<small>${event.date}</small></time><div><strong>${event.title}</strong><span>${event.note}</span></div></li>`).join("")}</ol></div><aside><header class="weekly-section-head"><div><p class="weekly-section-label">NOTICES</p><h2>通知</h2></div></header><ul class="weekly-notices">${data.notices.map((notice) => `<li><strong>${notice.title}</strong><p>${notice.text}</p></li>`).join("")}</ul></aside></section>`;

    root.querySelector("[data-issue-select]")?.addEventListener("change", (event) => { issueId = event.target.value; history.replaceState(null, "", `?issue=${issueId}`); category = "全部"; render(); });
    root.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => { category = button.dataset.category; render(); }));
  };
  render();
})();
