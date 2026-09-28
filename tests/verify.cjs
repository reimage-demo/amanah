// Static-page checks; run npm test for form and backend behavior.
const { JSDOM } = require("jsdom");
const fs = require("node:fs");
const assert = require("node:assert/strict");
const pages = ["index", "physicians", "partners", "about", "members", "privacy", "terms", "legal", "cookies", "accessibility"];
const docs = Object.fromEntries(
  pages.map((p) => [
    p,
    new JSDOM(fs.readFileSync(`${p}.html`, "utf8")).window.document,
  ]),
);
let checks = 0;
for (const [name, doc] of Object.entries(docs)) {
  assert.equal(doc.querySelectorAll("h1").length, 1);
  checks++;
  for (const link of doc.querySelectorAll("a[href]")) {
    const href = link.getAttribute("href");
    if (/^(https?:|mailto:|tel:)/.test(href)) continue;
    const [file, hash] = href.split("#");
    const target = file ? file.replace(".html", "") : name;
    assert.ok(docs[target], href);
    if (hash) assert.ok(docs[target].getElementById(hash), href);
    checks++;
  }
  for (const input of doc.querySelectorAll(
    "input:not(.honeypot),select,textarea",
  )) {
    assert.ok(input.name);
    assert.ok(doc.querySelector(`label[for="${input.id}"]`));
    checks++;
  }
  for (const el of doc.querySelectorAll(
    "[src],link[rel=stylesheet],link[rel=icon]",
  )) {
    assert.ok(fs.existsSync(el.getAttribute("src") || el.getAttribute("href")));
    checks++;
  }
}
console.log(`${checks} static page checks passed.`);
