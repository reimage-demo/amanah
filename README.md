# Amanah

One local project contains the public website, admin portal, and Convex backend, following the Empire Elite Rides layout:

```text
amanah/
  index.html, physicians.html, partners.html, ...
  assets/
  admin/       # React + Vite portal
  convex/      # Shared backend and generated API
  tests/       # Public form and backend tests
```

## Local development

```sh
npm ci
npm --prefix admin ci
npm run dev          # Public website
npm run admin:dev    # Admin portal on port 5174 (separate terminal)
npm run convex:dev  # Backend development, when needed
```

The root `.env.local` configures Convex. `admin/.env.local` configures the portal's local endpoint; `admin/.env.production` contains public production endpoints only. Production secrets stay in Convex environment variables.

## Verify

```sh
npm test
node tests/verify.cjs
npm run typecheck
npm run build
npm run admin:build
```

## Publish to two repositories

```sh
npm run publish:pages  # Public dist/ → reimage-demo/amanah:gh-pages
npm run admin:publish  # admin/dist/ → reimage-demo/amanah-admin:gh-pages
```

These are separate publishing destinations built from this single local project. Each repository keeps independent GitHub Pages and custom-domain settings. Publishing preserves existing CNAME files. The public build includes an `/admin/` redirect to the deployed portal; the local `admin/` directory contains the actual application.

- Public site: https://www.amanahmedicalcare.com/
- Admin portal: https://admin.amanahmedicalcare.com/

Run `npm run convex:deploy` from this project root to deploy backend changes. Moving the source does not change the production database, collected records, authentication, or endpoints. Public forms still post to `https://fast-roadrunner-39.convex.site/join`.
