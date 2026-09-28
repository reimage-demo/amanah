# Policy implementation and review — September 28, 2026

Published initial drafts: privacy.html, terms.html, legal.html, cookies.html, accessibility.html.

User provided mailing address: 980 N Michigan Ave Ste 1090 #733359, Chicago, Illinois, 60611. Brand used: Amanah Medical. Exact registered legal entity name is not yet available. Confirm legal entity, jurisdiction, formal retention schedule and processor arrangements before treating these drafts as finalized legal policies. No legal-compliance or accessibility-certification claim is made.

## Implemented behavior

- New physician inquiries default to private; explicit name-only opt-in is recorded with timestamp and version in Convex.
- Public GET /members returns only opted-in physician names and an opaque pagination cursor. Existing records are not backfilled as public. Hospital submissions remain private.
- Admin can remove a public listing; archiving unpublishes it. No admin control grants consent on a person's behalf.
- The current directory is an expression-of-interest community, not verification of credentials or completed onboarding.
- All fonts and photos are hosted with the frontend. No Google Fonts requests or advertising/analytics network integrations remain.
- Dismissing the public storage notice writes a timestamp to amanah.storageNotice.v1 for 180 days. The footer reopens it. Dismissal enables no optional tracking.
- Convex Auth uses browser storage on the admin portal. Private backend access remains restricted to authorized admins.
- No automatic database retention cutoff is configured; the privacy draft states this accurately. Removal/deletion requests are handled by the team, rather than a new self-service account flow.

## Drafting references

- [OPC Canada: Meaningful consent](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_consent/): inform visitors about disclosure and provide a separate public-name choice.
- [ICO: Cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/): distinguish necessary storage from optional tracking; do not imply dismissal authorizes unrelated purposes.
- [W3C WAI: Accessibility statements](https://www.w3.org/WAI/planning/statements/): describe actual features, limitations, feedback routes, and evaluation status.

These are drafting references, not a determination that any one jurisdiction's law applies or that all requirements are satisfied.
