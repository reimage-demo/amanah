# Amanah verification — September 27, 2026

- Production Convex project: `re-image-business-solutions/amanah`.
- Production deployment: `fast-roadrunner-39`.
- Convex schema/functions/auth deployment passed TypeScript checks.
- Requested administrator created; browser login succeeded. Temporary bootstrap password removed from Convex environment after account provisioning.
- 10 automated tests passed: field validation/preservation, all physician and hospital fields, duplicate protection, anonymous and non-admin access denial, admin updates/notes, rate limits, form step validation, confirmed-success welcome, and retry preservation.
- 108 static link/anchor/label/asset checks passed.
- Vite production build passed. Public-page classic scripts are intentionally copied unchanged; Vite emits informational non-module bundling warnings for them.
- Production end-to-end smoke test: completed physician form using `QA Amanah Test` / `amanah-qa@example.invalid`; verified personalized welcome, immediate appearance in Signees, all eight field values, saved Contacted status, and saved team note. No email was sent. Synthetic record and note were removed afterward; cleanup function removed from deployed code.
- Desktop login, dashboard, signee list/detail, and welcome screens inspected in the browser.
- Mobile welcome and admin portal layouts checked at 390px with no horizontal overflow.

The database and authentication use Convex exclusively. The frontend is hosted through the existing GitHub Pages preview site, built with Vite. Automated email notifications are not part of this implementation.

## Repository split — September 28, 2026

Admin application, Convex source, and backend tests moved to `reimage-demo/amanah-admin`. The public repository retains public pages and public form tests. Old `/admin/` links redirect to the independent portal. The login now uses one centered logo and sign-in card.

## Blue/white palette and biographies — September 28, 2026

- All four public pages, public form stages, and welcome states updated to the consultation reference’s navy/white palette.
- Seven homepage profiles link to seven complete About biographies, including medical school, residency, and additional training as published.
- Original portraits/placeholders load successfully. Full profiles and training sections verified in the browser.
- Four public form tests and 124 static page checks passed; production Vite build passed.
