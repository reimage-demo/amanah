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
    const endpoint = window.AMANAH_CONFIG?.convexSiteUrl;
    const configured =
      typeof endpoint === "string" &&
      /^https:\/\/[a-z0-9-]+\.convex\.site$/.test(endpoint);
    const fieldset = form.querySelector("fieldset");
    const status = form.querySelector(".form-status");
    const submit = form.querySelector('button[type="submit"]');
    const grid = form.querySelector(".form-grid");
    const controls = [...grid.querySelectorAll("input,select,textarea")];
    controls.forEach((input) => {
      if (!input.maxLength || input.maxLength < 0) input.maxLength = 250;
    });
    let pending = false,
      sent = false,
      step = 0;
    const submissionKey = crypto.randomUUID();
    const showStatus = (message, state) => {
      status.textContent = message;
      status.dataset.state = state;
      status.focus();
    };
    if (!configured) return;
    form.action = endpoint + "/join";
    fieldset.disabled = false;
    form.querySelector("[data-unavailable]").hidden = true;
    const progress = document.createElement("div");
    progress.className = "join-progress";
    progress.innerHTML =
      "<span>01 <b>Your story</b></span><span>02 <b>Your purpose</b></span><span>03 <b>Your first step</b></span>";
    fieldset.prepend(progress);
    const intro = document.createElement("div");
    intro.className = "join-step-intro";
    intro.tabIndex = -1;
    progress.after(intro);
    const review = document.createElement("div");
    review.className = "join-review";
    grid.after(review);
    const navigation = document.createElement("div");
    navigation.className = "join-navigation";
    const back = document.createElement("button");
    back.type = "button";
    back.className = "join-back";
    back.textContent = "← Back";
    const next = document.createElement("button");
    next.type = "button";
    next.className = "button";
    next.textContent = "Continue →";
    submit.before(navigation);
    navigation.append(back, next, submit);
    const firstFields =
      kind === "physician"
        ? ["full_name", "email", "specialty", "country", "state"]
        : ["contact_name", "email", "organization", "role"];
    const inStep = (input) => (firstFields.includes(input.name) ? 0 : 1);
    const validate = () => {
      for (const input of controls.filter((input) => inStep(input) === step)) {
        if (!input.reportValidity()) return false;
      }
      return true;
    };
    const render = (focus = true) => {
      progress.querySelectorAll("span").forEach((el, i) => {
        el.classList.toggle("current", i === step);
        el.classList.toggle("complete", i < step);
        if (i === step) el.setAttribute("aria-current", "step");
        else el.removeAttribute("aria-current");
      });
      const copy = [
        [
          "Every story has a beginning.",
          "Tell us a little about the person behind the purpose.",
        ],
        [
          "A gift only you can bring.",
          "Help us understand where your experience and our mission meet.",
        ],
        [
          "A meaningful first step.",
          "Take a moment to review your details. This is the beginning of a conversation.",
        ],
      ][step];
      intro.replaceChildren();
      const heading = document.createElement("h3");
      heading.textContent = copy[0];
      const text = document.createElement("p");
      text.textContent = copy[1];
      intro.append(heading, text);
      for (const field of grid.children) {
        const input = field.querySelector("input,select,textarea");
        field.hidden = input ? inStep(input) !== step : step !== 0;
      }
      grid.hidden = step === 2;
      review.hidden = step !== 2;
      back.hidden = step === 0;
      next.hidden = step === 2;
      submit.hidden = step !== 2;
      if (step === 2) {
        review.replaceChildren();
        const dl = document.createElement("dl");
        for (const input of controls) {
          const row = document.createElement("div");
          const dt = document.createElement("dt");
          dt.textContent = input.labels[0].textContent.replace("*", "").trim();
          const dd = document.createElement("dd");
          dd.textContent = input.name === "public_directory" ? (input.value === "yes" ? "Yes, publish my name" : "Keep my name private") : input.value || "Not provided";
          row.append(dt, dd);
          dl.append(row);
        }
        review.append(dl);
      }
      if (focus) intro.focus();
    };
    back.addEventListener("click", () => {
      step--;
      render();
    });
    next.addEventListener("click", () => {
      if (validate()) {
        step++;
        render();
      }
    });
    form.noValidate = true;
    form.addEventListener("input", () => emit(`${kind}_form_start`), {
      once: true,
    });
    render(false);
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (pending || sent) return;
      if (step < 2) {
        if (validate()) {
          step++;
          render();
        }
        return;
      }
      for (const input of controls) {
        if (!input.checkValidity()) {
          step = inStep(input);
          render();
          input.reportValidity();
          return;
        }
      }
      const answers = Object.fromEntries(new FormData(form));
      if (answers._gotcha) return;
      pending = true;
      fieldset.disabled = true;
      form.setAttribute("aria-busy", "true");
      submit.textContent = "Making your introduction…";
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      try {
        const response = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, answers, submissionKey }),
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || result.ok !== true) throw new Error("unconfirmed");
        sent = true;
        emit(`${kind}_form_success`);
        fieldset.hidden = true;
        const welcome = document.createElement("section");
        welcome.className = "join-welcome";
        welcome.tabIndex = -1;
        const first = (answers.full_name || answers.contact_name)
          .trim()
          .split(/\s+/)[0];
        const eyebrow = document.createElement("span");
        eyebrow.className = "eyebrow";
        eyebrow.textContent = "YOUR FIRST STEP. OUR SHARED FUTURE.";
        const mark = document.createElement("div");
        mark.className = "welcome-mark";
        mark.textContent = "✦";
        const title = document.createElement("h2");
        title.textContent = `Welcome to the movement, ${first}.`;
        const message = document.createElement("p");
        message.textContent =
          "Changing the world begins with people who choose to care. Today, you took that first step. Thank you for bringing your purpose to Amanah.";
        const note = document.createElement("p");
        note.className = "welcome-next";
        note.textContent =
          "Your details have been received. Our team will be in touch to learn more about your story and explore how we can make a difference together.";
        const closing = document.createElement("p");
        closing.className = "welcome-signature";
        closing.textContent = "With gratitude, The Amanah team";
        const link = document.createElement("a");
        link.href = answers.public_directory === "yes" && kind === "physician" ? "members.html" : "about.html";
        link.className = "button button-outline";
        link.textContent = answers.public_directory === "yes" && kind === "physician" ? "Meet the movement →" : "Explore our shared purpose →";
        welcome.append(mark, eyebrow, title, message, note, closing, link);
        form.append(welcome);
        welcome.focus();
        status.textContent = "";
      } catch (error) {
        showStatus(
          error.name === "AbortError"
            ? "We could not confirm your submission yet. Your details are safe here. Please retry; the same submission will not be saved twice."
            : "We could not confirm your submission. Your details are still here. Please try again, or contact info@amanahmedicalcare.com.",
          "error",
        );
      } finally {
        clearTimeout(timeout);
        pending = false;
        form.removeAttribute("aria-busy");
        if (!sent) {
          fieldset.disabled = false;
          submit.textContent =
            kind === "physician"
              ? "Join the movement →"
              : "Begin our partnership →";
        }
      }
    });
  });
})();
