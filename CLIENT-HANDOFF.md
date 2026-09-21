# Amanah Medical — client handoff

Prepared September 21, 2026.

## What changed and why

Replaced a long, mixed-purpose homepage with four focused static pages. The primary journey is a physician expression of interest; a separate hospital page and form support institutional inquiries. The homepage explains the proposed partnership chain, three contribution paths, participation steps, leadership, and practical questions.

The revised editorial design retains navy branding and the existing logo, with serif headings, readable body typography, restrained green links, simple rules, compact portraits, mobile navigation, keyboard focus, and reduced-motion support. The hero is text-led; the proposed model is explained in prose. Numbered sequences, icon-decorated buttons, floating panels, repeated cards, and decorative backgrounds were removed. No fabricated hospital imagery, testimonials, operating results, or endorsements are used.

The copy treats the initiative as developing. It omits unverified telehealth functionality, coverage targets, response promises, tax status, and clinical arrangements. An interest form is explicitly not membership, credentialing, or permission to provide care.

## Content and asset sources

The existing https://www.amanahmedicalcare.com/ was inspected directly in the browser on September 21, 2026, including lazy-loaded leadership information.

- Dr. Ahmed Abbasi: published as Founder and CEO; internal medicine, outpatient practice, academic hospital medicine. The rebuild omits potentially changing location, employer, and board-certification claims.
- Dr. Nabil Madhun: published as Advisory Board; endocrinology and private practice, with academic/business contributions.
- Dr. Toufik Madhun: published as Advisory Board; pulmonary/critical care, medical leadership, and hospital administration.
- Public contact: info@amanahmedicalcare.com; +1 505-218-7319; 980 N Michigan Ave Ste 1090 #733359, Chicago, Illinois 60611. Verified as published, not by sending a message or calling.
- Logo source: Wix media `89f82a_500a7681fbd0496a80ea258d2551b2c6~mv2.jpg`.
- Ahmed portrait: Wix media `89f82a_b215ce92fa234e8c90ec2d78cff7b530~mv2.jpg`.
- Nabil portrait: Wix media `89f82a_0029e0bf1a984da3a31555e26e4c60dc~mv2.jpg`.
- Toufik portrait: Wix media `89f82a_29697627937642759f355b7cd025d32f~mv2.jpg`.

Assets were reused from the existing organization website within the requested rebuild. Leadership images were resized for web use; the favicon derives from the existing logo. Portraits were not generated. The remaining founding physician profiles were omitted to keep the preview concise and avoid placeholder portraits and time-sensitive fellowship claims. Full leadership source URLs use `https://static.wixstatic.com/media/` followed by the media identifier above.

## Facts needing client confirmation

- Confirm all three leadership roles, biographies, and continued permission to republish the existing portraits/logo. Source verification does not establish independent credential verification.
- Confirm the published email, phone, and mailing address remain current and monitored.
- The original website describes **North America and Africa, the Middle East, and Asia**. This brief focuses on **U.S. Muslim physician recruitment and the Middle East**. Confirm how that recruitment focus relates to the wider organizational scope.
- Confirm current program readiness, actual partner institutions (none named in the rebuild), specialties, eligibility including physicians in training, time expectations, remote/travel options, and onboarding ownership.
- Confirm clinical review, licensing, credentialing, supervision, local responsibilities, and approved systems before any clinical participation. None are promised by this website.
- Confirm the hospital fee model, reduced-rate terms, what services fees support, and use of funds. The site says these are discussed individually and does not allocate costs or claim volunteer expertise means free hospital services.
- Confirm legal organizational identity and any approved nonprofit/tax status claims before adding them. The rebuild makes no tax-exempt claim.
- Approve the inquiry data-use language; determine internal access, retention, deletion, and privacy request practices. No unsupported retention or security promises were added.

## Launch requirements

The GitHub Pages preview can be reviewed immediately. Before launching online recruitment collection:

1. Supply two distinct Formspree IDs in `assets/js/config.js`.
2. Configure/verify separate recipient workflows and spam protection in an Amanah-owned Formspree account.
3. Name a physician recruitment follow-up owner and a hospital partnership follow-up owner; confirm access and escalation arrangements. These roles are not yet assigned.
4. Approve the content facts and privacy language listed above.
5. Authorize and complete the real end-to-end test procedure in README. Local mocks do not prove notification delivery.

Until configuration is complete, both forms are disabled and the verified public contact email is offered. The website never displays a fabricated success message.

## Follow-up and measurement

The physician owner should review specialty, location, interest, and availability, then arrange the appropriate eligibility/onboarding process. The hospital owner should discuss institutional needs, collaboration expectations, responsibilities, and fees. No response-time commitment is stated.

The client should record qualified applicants, completed onboarding, and active volunteers in its own follow-up system. The site includes anonymous event hooks but no installed tracker or applicant database.

## Hosting and optional improvements

The latest editorial redesign and transparent logo are published to the reimage-demo account at https://reimage-demo.github.io/amanah/, following the subsequent deployment request. No change is made to the existing website, DNS, or Wix configuration. Do not move the production domain without separate authorization.

Optional later work: licensed self-hosted fonts, a client-approved analytics provider, translation/localization, a fuller privacy policy, additional verified leadership profiles, and verified partner stories once available. These are not prerequisites to reviewing the rebuilt site.

## Transparent logo update

`assets/images/amanah-logo-transparent.png` is the transparent navy version used by the header, footer, and favicon. The original JPEG remains available as a reference. Produced with the built-in image editing tool from that original; prompt: extract the existing calligraphy, circular outline, and AMANAH wordmark, remove the navy background and shadows, recolor foreground to the source background navy (approximately #1c2474), preserve letterforms/proportions, and output a transparent PNG. PNG alpha and desktop/mobile rendering were checked locally. This update is included in the reimage-demo deployment.
