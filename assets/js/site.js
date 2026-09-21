(() => {
  "use strict";
  const emit = (name) =>
    document.dispatchEvent(
      new CustomEvent("amanah:analytics", { detail: { name } }),
    );
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#navigation");
  if (toggle && nav) {
    toggle.hidden = false;
    nav.dataset.enhanced = "true";
    const close = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        close();
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 851px)").addEventListener("change", close);
  }
  document.addEventListener("click", (event) => {
    const link = event.target.closest("[data-event]");
    if (link) emit(link.dataset.event);
  });
  document.querySelectorAll("form[data-inquiry]").forEach((form) => {
    const kind = form.dataset.inquiry;
    const config = window.AMANAH_CONFIG || {};
    const id =
      config[kind === "physician" ? "physicianFormId" : "hospitalFormId"];
    const otherId =
      config[kind === "physician" ? "hospitalFormId" : "physicianFormId"];
    const configured =
      typeof id === "string" &&
      /^[a-zA-Z0-9]{6,32}$/.test(id) &&
      id !== otherId;
    const fieldset = form.querySelector("fieldset");
    const status = form.querySelector(".form-status");
    const button = form.querySelector('button[type="submit"]');
    const buttonContent = button.innerHTML;
    let pending = false;
    let sent = false;
    const showStatus = (message, state) => {
      status.textContent = message;
      status.dataset.state = state;
      status.focus();
    };
    if (configured) {
      form.action = `https://formspree.io/f/${id}`;
      fieldset.disabled = false;
      form.querySelector("[data-unavailable]").hidden = true;
    }
    if (kind === "physician") {
      form.addEventListener("input", () => emit("physician_form_start"), {
        once: true,
      });
    }
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (pending || sent) return;
      if (!configured) {
        showStatus(
          "Online inquiries are currently unavailable. Please email info@amanahmedicalcare.com. Nothing has been sent.",
          "error",
        );
        return;
      }
      if (!form.reportValidity()) return;
      if (form.elements.namedItem("_gotcha").value) {
        showStatus(
          "Unable to submit this inquiry. Please contact info@amanahmedicalcare.com.",
          "error",
        );
        return;
      }
      const data = new FormData(form);
      pending = true;
      button.disabled = true;
      button.textContent = "Sending…";
      form.setAttribute("aria-busy", "true");
      status.textContent = "Sending your inquiry…";
      status.removeAttribute("data-state");
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("server");
        const result = await response.json();
        if (result.ok !== true) throw new Error("unconfirmed");
        sent = true;
        emit(`${kind}_form_success`);
        form.reset();
        fieldset.disabled = true;
        showStatus(
          kind === "physician"
            ? "Thank you. Your interest has been received. The team can now contact you to discuss potential opportunities."
            : "Thank you. Your partnership inquiry has been received. The team can now contact you to discuss your institution’s interests.",
          "success",
        );
        button.textContent = "Inquiry received";
      } catch (error) {
        showStatus(
          error.name === "AbortError"
            ? "The request timed out and delivery could not be confirmed. Your entries are still here. Please retry or email info@amanahmedicalcare.com."
            : "We could not confirm delivery of your inquiry. Your entries are still here. Please retry or email info@amanahmedicalcare.com.",
          "error",
        );
      } finally {
        clearTimeout(timeout);
        pending = false;
        form.removeAttribute("aria-busy");
        if (!sent) {
          button.disabled = false;
          button.innerHTML = buttonContent;
        }
      }
    });
  });
})();
