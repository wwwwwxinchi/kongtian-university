(() => {
  const form = document.querySelector("[data-admissions-form]");
  const select = document.querySelector("[data-faculty-select]");
  const hint = document.querySelector("[data-admissions-hint]");
  const success = document.querySelector("[data-admissions-success]");
  const successText = document.querySelector("[data-admissions-success-text]");
  if (!form || !select) return;

  (window.FACULTIES || []).forEach((f) => {
    const opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = f.name;
    select.appendChild(opt);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const faculty = (window.FACULTIES || []).find((f) => f.id === data.faculty);
    const record = {
      ...data,
      facultyName: faculty ? faculty.name : data.faculty,
      at: new Date().toISOString(),
    };
    try {
      const key = "kongtian-admissions";
      const prev = JSON.parse(localStorage.getItem(key) || "[]");
      prev.push(record);
      localStorage.setItem(key, JSON.stringify(prev));
    } catch (_) {
      /* ignore quota */
    }
    form.hidden = true;
    if (success) success.hidden = false;
    if (successText) {
      successText.textContent = `${record.name}，意向「${record.facultyName}」的档案已记下。欢迎继续阅读校园维基与院系介绍。`;
    }
    if (hint) hint.textContent = "演示提交完成。";
  });
})();
