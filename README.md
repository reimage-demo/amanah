# Amanah Medical

A four-page, responsive physician recruitment website built with semantic HTML, reusable CSS, and vanilla JavaScript. No framework, application backend, or build step is needed.

Live website: https://reimage-demo.github.io/amanah/

Repository: https://github.com/reimage-demo/amanah

## Local preview

```sh
python3 -m http.server 8000
```

Open http://localhost:8000. The four pages are `index.html`, `physicians.html`, `partners.html`, and `about.html`. Navigation, content, FAQ disclosures, and contact alternatives work without JavaScript. The enhanced mobile menu and online form submission require JavaScript. Without it, the email alternative remains available and forms remain safely disabled.

## Hosting

Upload the four HTML files and `assets/` to any static host. Keep their relative layout. `.nojekyll` supports direct GitHub Pages hosting. This repository uses GitHub Pages from the root of `main`; pushing changes to that branch republishes the preview. Do not add a CNAME, change DNS, or replace the existing amanahmedicalcare.com site without a separate instruction. If the hosting URL changes, update `og:url` and `og:image` in each page.

## Enable the two Formspree forms

The only endpoint configuration file is **`assets/js/config.js`**. Both IDs are intentionally empty. The visitor sees a clear unavailable message and the email address published on Amanah's existing site. No invented endpoint is used.

1. An Amanah-owned Formspree account should create two separate forms: Physician Interest and Hospital Partnership Inquiry.
2. Configure and verify the intended notification recipient for each in Formspree. Assign a staff member to monitor both dashboards and inboxes. Do not rely only on email delivery.
3. Copy each actual form ID (the final segment of `https://formspree.io/f/...`) into the matching key:

```js
window.AMANAH_CONFIG = Object.freeze({
  physicianFormId: 'ACTUAL_PHYSICIAN_ID',
  hospitalFormId: 'ACTUAL_HOSPITAL_ID'
});
```

Use actual IDs, not the illustrative strings above. The IDs must be distinct. No API secret belongs in the site. Once valid IDs are supplied, the appropriate fieldset and submit button are enabled automatically.

4. Review each form's notification workflow and spam settings. The HTML includes Formspree's `_gotcha` honeypot. Restrict accepted domains where your plan supports it, including the deployed GitHub Pages hostname. Configure Formspree filtering; check the spam folder as part of follow-up. If enabling a CAPTCHA, implement its documented token flow in the custom vanilla submission handler and verify it before launch. Do not assume dashboard-only CAPTCHA activation is compatible with this handler. The honeypot is only one layer and is not a guarantee against spam.
5. Approve the short data-use language on both inquiry pages and `about.html#data-use`. Agree on who can access submissions and how requests about submitted information are handled.
6. Complete the authorized end-to-end delivery test below before treating the forms as launched.

Formspree references reviewed on September 21, 2026:

- [Building an HTML form](https://help.formspree.io/articles/building-your-form/building-an-html-form)
- [AJAX submissions](https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax)
- [Honeypot spam filtering](https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering)
- [Spam prevention](https://help.formspree.io/articles/troubleshooting/how-to-prevent-spam)

The implementation uses native `fetch` with `Accept: application/json`. A successful HTTP response and a JSON `ok: true` are both required for success. Pending requests disable the submit button; failures retain input and permit retry. A 20-second timeout reports uncertain delivery rather than claiming success. A successful form stays disabled to prevent accidental resubmission. A timeout can still mean the server received a request; review Formspree before retrying a questionable delivery.

## Verification

The website needs no Node dependencies. The optional development test suite uses jsdom:

```sh
npm install --prefix /tmp/amanah-test jsdom
NODE_PATH=/tmp/amanah-test/node_modules node tests/verify.cjs
```

A local-only browser QA server enables the actual forms with entirely mocked `fetch` responses:

```sh
python3 tests/mock-server.py
```

Open http://127.0.0.1:8001/physicians.html or `/partners.html`. Use the bottom-right Mock response selector to choose success, server error, or network error. All fetch requests in this QA page are intercepted; none reach Formspree. This server is for local development only. It is not part of the production runtime.

Check native required-field and email validation, preserved values after errors, retry, status focus, pending button state, and confirmed success. Check the ordinary port-8000 site separately for unavailable-form behavior. Browser QA covers all four pages at desktop and mobile widths, mobile menu expansion and Escape behavior, anchor positions, overflow, assets, and console errors. See `VERIFICATION.md` for the recorded results.

## Authorized end-to-end submission test procedure

**Real inbox delivery has not been tested.** No real inquiries were sent. After client authorization identifies the two endpoints, test recipient, and permitted synthetic test message:

1. Configure verified endpoints and notification recipients; deploy the updated config.
2. Submit one clearly labeled synthetic QA inquiry per form, using an authorized test email, no patient data, and no real applicant details.
3. Confirm the expected Formspree dashboard entry, correct recipient inbox delivery, separate form routing, and reply-to address.
4. Verify the browser success message and failure/retry behavior. Check spam filtering with a client-approved test, and confirm legitimate inquiries remain deliverable.
5. Have the follow-up owner acknowledge access and the handoff process. Remove test entries according to the client's chosen practice.

Do not perform this procedure without explicit permission to send those real submissions.

## Measurement

The site dispatches `amanah:analytics` DOM events with only `{ name }`. No tracker is installed, no provider is contacted, and no personal data or form answers are included. Available names:

- `physician_cta_click`
- `physician_form_start` (once per page instance)
- `physician_form_success` (confirmed server response only)
- `hospital_cta_click`
- `hospital_form_success` (confirmed server response only)

A future approved provider can listen to `document.addEventListener('amanah:analytics', handler)`. Do not attach form data, URLs containing personal information, or identifiers. Qualified applicants, onboarding completion, and active volunteers must be tracked in the organization's follow-up process; website events cannot establish those outcomes.

## Assets and external dependencies

Logo and three leadership photographs are stored locally, sourced from Amanah's current public website for this authorized rebuild. Source details and facts for review are in `CLIENT-HANDOFF.md`. CSS currently loads DM Sans from Google Fonts and uses the system Georgia serif for headings; system sans-serif fallbacks keep the content available if blocked. Google Fonts is an external font request, not an analytics integration. Self-hosting licensed font files is an optional privacy/performance improvement.
