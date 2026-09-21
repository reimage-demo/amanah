// npm install --prefix /tmp/amanah-test jsdom
// NODE_PATH=/tmp/amanah-test/node_modules node tests/verify.cjs
const { JSDOM } = require("jsdom");
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const script = fs.readFileSync("assets/js/site.js", "utf8");
let checks = 0;
function check(condition, message) {
  assert.ok(condition, message);
  checks++;
}
const pages = ["index", "physicians", "partners", "about"];
const docs = Object.fromEntries(
  pages.map((p) => [
    p,
    new JSDOM(fs.readFileSync(`${p}.html`, "utf8")).window.document,
  ]),
);
for (const [name, doc] of Object.entries(docs)) {
  check(doc.querySelectorAll("h1").length === 1, `${name}: one h1`);
  check(
    doc.querySelector("meta[name=description]").content.length > 40,
    `${name}: description`,
  );
  for (const link of doc.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href");
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const [file, hash] = href.split("#");
    const dest = file ? file.replace(".html", "") : name;
    check(!!docs[dest], `${name}: page ${href}`);
    if (hash)
      check(!!docs[dest].getElementById(hash), `${name}: anchor ${href}`);
  }
  for (const el of doc.querySelectorAll(
    "[src],link[rel=stylesheet],link[rel=icon]",
  )) {
    const asset = el.getAttribute("src") || el.getAttribute("href");
    check(fs.existsSync(asset), `${name}: asset ${asset}`);
  }
  for (const link of doc.querySelectorAll("[data-event]"))
    check(
      link.getAttribute("href") ===
        (link.dataset.event.startsWith("physician")
          ? "physicians.html#volunteer"
          : "partners.html#partner-inquiry"),
      "CTA destination",
    );
  for (const input of doc.querySelectorAll(
    "input:not(.honeypot),select,textarea",
  )) {
    check(!!input.name, "named control");
    check(!!doc.querySelector(`label[for="${input.id}"]`), "labeled control");
  }
  check(
    doc.querySelector("fieldset")?.disabled !== false,
    "unconfigured forms safe without JS",
  );
}
check(
  new Set(Object.values(docs).map((d) => d.title)).size === 4,
  "unique titles",
);
async function fixture(kind, configured = true) {
  const dom = new JSDOM(
    fs.readFileSync(
      kind === "physician" ? "physicians.html" : "partners.html",
      "utf8",
    ),
    { url: "http://localhost/", runScripts: "outside-only" },
  );
  const w = dom.window;
  w.matchMedia = () => ({ addEventListener() {} });
  w.AMANAH_CONFIG = configured
    ? { physicianFormId: "testphys", hospitalFormId: "testhosp" }
    : {};
  const events = [];
  w.document.addEventListener("amanah:analytics", (e) => events.push(e.detail));
  let calls = 0;
  let resolve;
  w.fetch = () => {
    calls++;
    return new Promise((r) => {
      resolve = r;
    });
  };
  w.eval(script);
  const form = w.document.querySelector("form");
  const button = form.querySelector("button");
  const status = form.querySelector(".form-status");
  const fill = () => {
    for (const e of form.querySelectorAll(
      "input:not(.honeypot),select,textarea",
    ))
      e.value =
        e.tagName === "SELECT"
          ? e.options[1].value
          : e.type === "email"
            ? "test@example.invalid"
            : "Test";
  };
  const submit = () =>
    form.dispatchEvent(
      new w.Event("submit", { bubbles: true, cancelable: true }),
    );
  const settle = () => new Promise((r) => setTimeout(r, 0));
  return {
    dom,
    w,
    form,
    button,
    status,
    events,
    fill,
    submit,
    settle,
    calls: () => calls,
    resolve: (r) => resolve(r),
  };
}
(async () => {
  for (const kind of ["physician", "hospital"]) {
    let t = await fixture(kind, false);
    t.submit();
    check(t.calls() === 0, "missing endpoint: no request");
    check(t.status.dataset.state === "error", "missing endpoint: honest error");
    t.dom.window.close();
    t = await fixture(kind);
    t.submit();
    check(t.calls() === 0, "required fields prevent request");
    t.fill();
    t.form.elements.email.value = "invalid";
    t.submit();
    check(t.calls() === 0, "email validation");
    t.form.elements.email.value = "test@example.invalid";
    t.form.elements.email.dispatchEvent(
      new t.w.Event("input", { bubbles: true }),
    );
    t.form.elements.email.dispatchEvent(
      new t.w.Event("input", { bubbles: true }),
    );
    if (kind === "physician")
      check(
        t.events.filter((e) => e.name === "physician_form_start").length === 1,
        "form start once",
      );
    t.submit();
    t.submit();
    check(t.calls() === 1, "duplicate suppressed");
    check(t.button.disabled, "pending button disabled");
    check(t.form.getAttribute("aria-busy") === "true", "busy status");
    check(t.status.dataset.state !== "success", "no premature success");
    t.resolve({ ok: false });
    await t.settle();
    check(t.status.dataset.state === "error", "server error");
    check(
      t.form.elements.email.value === "test@example.invalid",
      "preserve input",
    );
    check(!t.button.disabled, "retry enabled");
    t.w.fetch = async () => {
      throw new TypeError("network");
    };
    t.submit();
    await t.settle();
    check(t.status.dataset.state === "error", "network error");
    check(!t.button.disabled, "network retry enabled");
    t.w.fetch = async () => ({ ok: true, json: async () => ({}) });
    t.submit();
    await t.settle();
    check(
      t.status.dataset.state === "error",
      "unconfirmed response is not success",
    );
    let posted;
    t.w.fetch = async (url, options) => {
      posted = { url, options };
      return { ok: true, json: async () => ({ ok: true }) };
    };
    t.submit();
    await t.settle();
    check(t.status.dataset.state === "success", "confirmed success");
    check(
      posted.url ===
        `https://formspree.io/f/${kind === "physician" ? "testphys" : "testhosp"}`,
      "separate endpoint",
    );
    check(
      posted.options.headers.Accept === "application/json",
      "JSON response requested",
    );
    check(t.form.querySelector("fieldset").disabled, "sent form disabled");
    check(t.w.document.activeElement === t.status, "status focused");
    check(
      t.events.filter((e) => e.name === `${kind}_form_success`).length === 1,
      "success event once",
    );
    check(
      t.events.every((e) => Object.keys(e).join() === "name"),
      "no PII analytics",
    );
    t.dom.window.close();
  }
  console.log(
    `PASS: ${checks} checks covering pages, links, anchors, assets, controls, unavailable forms, validation, duplicate requests, retries, network/server failures, unconfirmed responses, success, focus, and analytics.`,
  );
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
