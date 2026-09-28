import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
import { expect, test, vi } from "vitest";
const script = readFileSync("assets/js/site.js", "utf8");
function fixture(kind = "physician") {
  const dom = new JSDOM(
    readFileSync(
      kind === "physician" ? "physicians.html" : "partners.html",
      "utf8",
    ),
    { runScripts: "outside-only", url: "https://example.com" },
  );
  const w = dom.window as any;
  w.matchMedia = () => ({ addEventListener() {} });
  w.AMANAH_CONFIG = { convexSiteUrl: "https://test-amanah.convex.site" };
  w.fetch = vi
    .fn()
    .mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
  w.eval(script);
  const form = w.document.querySelector("form");
  const fill = () => {
    for (const input of form.querySelectorAll(
      ".form-grid input,.form-grid select,.form-grid textarea",
    )) {
      input.value =
        input.tagName === "SELECT"
          ? input.options[1].value
          : input.type === "email"
            ? "qa@example.invalid"
            : "QA Test";
    }
  };
  const next = () =>
    form.querySelector(".join-navigation button:nth-child(2)").click();
  const submit = () =>
    form.dispatchEvent(
      new w.Event("submit", { bubbles: true, cancelable: true }),
    );
  return { w, form, fill, next, submit };
}
test("required answers prevent progression", () => {
  const f = fixture();
  f.next();
  expect(f.form.querySelector(".join-step-intro").textContent).toContain(
    "Every story",
  );
  expect(f.w.fetch).not.toHaveBeenCalled();
});
test.each(["physician", "hospital"])(
  "%s review preserves every answer and welcomes only after receipt",
  async (kind) => {
    const f = fixture(kind);
    f.fill();
    f.next();
    f.next();
    const count = f.form.querySelectorAll(
      ".form-grid input,.form-grid select,.form-grid textarea",
    ).length;
    expect(f.form.querySelectorAll(".join-review dd")).toHaveLength(count);
    f.submit();
    await vi.waitFor(() =>
      expect(f.form.querySelector(".join-welcome")).not.toBeNull(),
    );
    const body = JSON.parse(f.w.fetch.mock.calls[0][1].body);
    expect(body.kind).toBe(kind);
    expect(body.answers.email).toBe("qa@example.invalid");
    expect(f.form.querySelector(".join-welcome").textContent).toContain(
      "Welcome to the movement, QA.",
    );
    f.submit();
    expect(f.w.fetch).toHaveBeenCalledTimes(1);
  },
);
test("failed submission retains answers and retry uses the same idempotency key", async () => {
  const f = fixture();
  f.fill();
  f.next();
  f.next();
  f.w.fetch.mockRejectedValueOnce(new Error("network"));
  f.submit();
  await vi.waitFor(() =>
    expect(f.form.querySelector(".form-status").dataset.state).toBe("error"),
  );
  expect(f.form.querySelector("[name=email]").value).toBe("qa@example.invalid");
  expect(f.form.querySelector(".join-welcome")).toBeNull();
  f.submit();
  await vi.waitFor(() =>
    expect(f.form.querySelector(".join-welcome")).not.toBeNull(),
  );
  expect(JSON.parse(f.w.fetch.mock.calls[0][1].body).submissionKey).toBe(
    JSON.parse(f.w.fetch.mock.calls[1][1].body).submissionKey,
  );
});
test.each(["no", "yes"])("directory choice %s is explicit and preserved in the submission", async (choice) => {
  const f=fixture();
  const input=f.form.querySelector('[name="public_directory"]');
  expect(input.value).toBe('no');
  f.fill(); input.value=choice; f.next(); f.next(); f.submit();
  await vi.waitFor(()=>expect(f.form.querySelector('.join-welcome')).not.toBeNull());
  expect(JSON.parse(f.w.fetch.mock.calls[0][1].body).answers.public_directory).toBe(choice);
  expect(f.form.querySelector('.join-welcome a').getAttribute('href')).toBe(choice==='yes'?'members.html':'about.html');
});
