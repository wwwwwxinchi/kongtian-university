(() => {
  const map = document.querySelector("[data-campus-map]");
  if (!map) return;
  const cap = map.querySelector("[data-map-cap]");
  const regions = map.querySelectorAll(".cm-region");
  const defaultText = cap ? cap.textContent : "指针停在地图上，这里会显示地标说明。";

  const show = (el) => {
    const name = el.getAttribute("data-name") || "";
    const desc = el.getAttribute("data-desc") || "";
    regions.forEach((r) => r.classList.remove("is-active"));
    el.classList.add("is-active");
    if (cap) cap.textContent = `${name}：${desc}`;
  };
  const reset = () => {
    regions.forEach((r) => r.classList.remove("is-active"));
    if (cap) cap.textContent = defaultText;
  };

  regions.forEach((el) => {
    el.setAttribute("tabindex", "0");
    el.setAttribute("role", "button");
    el.addEventListener("mouseenter", () => show(el));
    el.addEventListener("focus", () => show(el));
    el.addEventListener("mouseleave", reset);
    el.addEventListener("blur", reset);
  });
})();
