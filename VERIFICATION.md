# Verification record

Date: September 21, 2026.

## Automated checks

`NODE_PATH=/tmp/amanah-test/node_modules node tests/verify.cjs`: **213 checks passed** after final formatting.

Covered all four pages, unique titles/descriptions, one H1 per page, local links, section anchors, physician/hospital CTA destinations, asset existence, named/labeled controls, disabled unconfigured forms, required-field/email validation, missing endpoint safety, separate endpoint routing, duplicate request suppression, pending state, server errors, network errors, input preservation, retry, rejection of unconfirmed success responses, confirmed success, focus placement, once-only events, and no personal information in analytics payloads.

JavaScript syntax checks passed. Mock requests used synthetic data and did not contact Formspree.

## Browser checks

Used the requested browser skill to inspect the existing organization site and the rebuilt local site.

- All four pages visually inspected at 390px mobile and 1440px desktop widths.
- All four pages additionally checked at 320px narrow-phone and 768px tablet widths. `document.documentElement.scrollWidth` equaled `innerWidth` on every page at all tested sizes.
- Desktop navigation and mobile menu; correct expanded state, Escape closes the menu, focus returns to the toggle, and links navigate to their intended pages.
- Physician and hospital CTA anchors position their sections beneath the sticky header.
- Missing-endpoint forms visibly unavailable, disabled, with a working mailto contact alternative.
- Local browser QA server: native required-field validation blocked an empty physician form with zero requests; mocked server and network errors preserved input; retry succeeded; pending submit button disabled; confirmed success focused the status and disabled the sent form.
- Separate hospital form completed a mocked success flow.
- Source leadership images load locally; portrait proportions adjusted after visual review to avoid excessive cropping.
- No browser console warnings/errors observed during the local review.
- Native FAQ disclosures and real HTML navigation provide progressive enhancement. Static DOM checks confirm navigation/content exist without JavaScript; no-JavaScript real form delivery is intentionally unavailable and has an email fallback.

## Limits

No real inbox submission, email, call, credential verification, or clinical participation was performed. Formspree delivery, configured notification recipients, and CAPTCHA integration remain untested until real client configuration and authorized test submission. The client must approve final facts and privacy language. The existing live website was not changed.
