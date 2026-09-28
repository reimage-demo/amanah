# Amanah public website

Public recruitment website and three-step join experience. This repository contains only the public frontend. The admin portal and Convex backend source are maintained independently in **[reimage-demo/amanah-admin](https://github.com/reimage-demo/amanah-admin)**.

- Public site: https://reimage-demo.github.io/amanah/
- Admin portal: https://reimage-demo.github.io/amanah-admin/

## Develop and publish

```sh
npm ci
npm run dev
npm test
node tests/verify.cjs
npm run build
npm run publish:pages
```

Vite builds the public HTML pages and assets into `dist/`. The publishing script deploys them to this repository’s `gh-pages` branch and preserves any custom domain already configured in GitHub Pages. GitHub Pages serves `gh-pages`, root directory.

This repository has its own Pages custom-domain field for the public domain. The separate `amanah-admin` repository has its own field for `admin.amanah.com`. Custom-domain and DNS configuration have not been changed.

The old `/admin/` URL is only a redirect to the new standalone portal; it contains no admin application or backend code.

## Forms and database

Convex remains the only database. `assets/js/config.js` contains the public production HTTP endpoint, `https://fast-roadrunner-39.convex.site`. Both physician and hospital forms post to `/join`. The endpoint and saved records are unchanged by the repository split.

The form presents three steps, a review, and a personalized welcome only after successful persistence. Failures preserve answers, and retries reuse an idempotency key. No email is automatically sent. Authorized administrators follow up in the separate portal.

All backend deployment and authentication management now happen from `amanah-admin`. This public repository needs no authentication secrets, database deploy credentials, or React dependencies.

## Verification

`npm test` checks form progression, complete review, confirmed-success welcomes, and retry behavior. `node tests/verify.cjs` checks public links, anchors, labels, and assets. `python3 tests/mock-server.py` runs a local mock-only form preview at port 8001.
