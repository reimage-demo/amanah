# Amanah Medical

Amanah’s public website, a deliberate three-step introduction to the movement, and a private React + Vite administration portal. Convex is the only backend, database, and authentication service.

- Website: https://reimage-demo.github.io/amanah/
- Administration: https://reimage-demo.github.io/amanah/admin/
- Convex project: https://dashboard.convex.dev/t/re-image-business-solutions/amanah
- Production deployment: `fast-roadrunner-39`

## Develop and verify

```sh
npm ci
npm run dev
npm test
node tests/verify.cjs
npm run build
npm run preview
```

Public pages remain HTML/CSS/JavaScript; the administration app lives in `admin/src/`. Vite builds both into `dist/`. The build copies the classic public-page scripts and source assets after bundling. Open `/admin/` for the administration app.

The checked-in `.env.production` contains only public production URLs. For local portal work set `VITE_CONVEX_URL` in `.env.local` to the intended deployment. `assets/js/config.js` configures the public form HTTP endpoint. Both must refer to the same Convex deployment when testing submissions and portal records together. The configured local preview currently connects to production; use synthetic data for testing.

## Data and workflow

Physician submissions appear under **Signees**; institutional inquiries appear under **Partnerships**. Every collected answer is retained, together with creation time, status, the data-use notice version, and an idempotency key. The portal offers live updates, paginated records, search across loaded answers, status filtering, full detail panels, and private team notes. Load more includes older records in counts and search.

Public forms have three steps: Your story, Your purpose, and Your first step (review). A personalized welcome appears only after Convex confirms persistence. Failed requests retain input; retries reuse the submission key to prevent duplicate records. No email is automatically sent. Use the portal’s email link for a personal follow-up.

## Authentication

The requested `amanahmedical1996` administrator is provisioned in production. The password is hashed by Convex Auth and is not present in source, frontend assets, or documentation. Public account creation is disabled. Every admin query and mutation checks membership in the server-side `admins` table. Convex Auth manages sessions, refresh tokens, and failed-login limits.

Production `JWT_PRIVATE_KEY`, `JWKS`, and `SITE_URL` are configured in Convex. To provision another deployment, set its signing keys, set `ADMIN_USERNAME` and a temporary `ADMIN_INITIAL_PASSWORD`, run the internal `setup:createAdmin` function, and remove `ADMIN_INITIAL_PASSWORD` immediately afterward. Never use a `VITE_` variable for credentials.

## Deployment

```sh
npx convex deploy --yes
```

This deploys the backend to the configured project’s production deployment. Run `npm run publish:pages` to build and publish the frontend to the `gh-pages` branch of `reimage-demo/amanah`. GitHub Pages serves that branch. The frontend build requires no private deploy key; it uses the public production URL. Backend deployment remains an explicit authenticated Convex CLI operation.

Do not publish the unbuilt source directory as the portal. Use `npm run publish:pages`. An optional GitHub Actions workflow template is in `docs/pages-workflow.yml`; enabling it requires GitHub workflow permission. The existing organization domain and DNS are unchanged.

## Verification

`npm test` covers submission validation, all physician and partnership fields, private access enforcement, status/notes, rate limiting, idempotency, multi-step review, welcome gating, and retry behavior. `tests/verify.cjs` checks public-page links, anchors, labels, and assets.

`python3 tests/mock-server.py` serves public pages at port 8001 with mocked success/error/network responses. It never submits to Convex. Production smoke testing uses only clearly marked synthetic details and removes test records afterward. See `VERIFICATION.md` for the completed checks.
