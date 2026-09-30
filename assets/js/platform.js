(() => {
  "use strict";
  const tour = document.querySelector(".platform-tour");
  if (!tour) return;
  const controls = [...tour.querySelectorAll("[data-chapter]")];
  const panels = [...tour.querySelectorAll("[data-panel]")];
  const select = (chapter) => {
    controls.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.chapter === chapter)));
    panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== chapter; });
  };
  controls.forEach((button, index) => {
    button.addEventListener("click", () => select(button.dataset.chapter));
    button.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % controls.length;
      if (event.key === "ArrowLeft") next = (index - 1 + controls.length) % controls.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = controls.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      controls[next].focus();
      select(controls[next].dataset.chapter);
    });
  });
  select(controls[0].dataset.chapter);
  tour.classList.add("tour-enhanced");
  const dialog = document.querySelector(".platform-lightbox");
  const expanded = dialog.querySelector("img");
  const viewport = dialog.querySelector(".lightbox-scroll");
  const zoom = dialog.querySelector("[data-zoom]");
  let opener;
  tour.querySelectorAll("[data-expand]").forEach((button) => button.addEventListener("click", () => {
    const panel = button.closest(".tour-panel");
    const source = panel.querySelector("img");
    opener = button;
    expanded.src = source.src;
    expanded.alt = source.alt;
    dialog.querySelector("h2").textContent = panel.querySelector("h3").textContent;
    viewport.classList.remove("is-zoomed");
    zoom.setAttribute("aria-pressed", "false");
    zoom.textContent = "Actual size";
    dialog.showModal();
    viewport.scrollTo(0, 0);
    dialog.querySelector("[data-close]").focus();
  }));
  zoom.addEventListener("click", () => {
    const enlarged = viewport.classList.toggle("is-zoomed");
    zoom.setAttribute("aria-pressed", String(enlarged));
    zoom.textContent = enlarged ? "Fit to screen" : "Actual size";
  });
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener("close", () => opener?.focus());
})();
