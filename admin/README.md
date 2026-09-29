# Amanah Admin

React + Vite administration portal in the shared Amanah project for Amanah, with a centered logo and sign-in form. Owned by **reimage-demo**. Convex is the only database and authentication backend.

- Repository: https://github.com/reimage-demo/amanah-admin
- Portal: https://admin.amanahmedicalcare.com/
- Public website repository: https://github.com/reimage-demo/amanah
- Production Convex project: https://dashboard.convex.dev/t/re-image-business-solutions/amanah
- Production deployment: `fast-roadrunner-39`

## Local use

Run these commands inside `amanah/admin/`, after installing root dependencies.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

Set `VITE_CONVEX_URL` in `.env.local` for development. The checked-in `.env.production` contains only public production endpoints. `VITE_PUBLIC_SITE_URL` controls links back to the public website; it defaults to the existing Amanah preview. Set it to `https://www.amanahmedicalcare.com` when that public domain is live.

The existing administrator credentials and all production data are preserved. Credentials are hashed by Convex Auth, never embedded in frontend code. Public registration is disabled. All record queries and mutations enforce server-side admin authorization.

## Independent publishing and domain

```sh
npm run publish:pages
```

This builds only this portal and publishes `dist/` to this repository’s `gh-pages` branch. GitHub Pages must use that branch, root directory. The public website deploys independently from `reimage-demo/amanah`.

GitHub Pages is configured for `admin.amanahmedicalcare.com`. Wix DNS points the `admin` CNAME to `reimage-demo.github.io`. The public repository independently uses `www.amanahmedicalcare.com`. `public/CNAME` preserves the portal domain in every build. Enable HTTPS enforcement after GitHub issues the certificate.

The Vite base is relative, so the same build supports the GitHub Pages preview and the custom-domain root. The portal imports the generated API from `../convex/`. Develop both frontends and the backend in the parent Amanah project; the two GitHub repositories are independent publishing destinations.

## Convex backend ownership

The parent Amanah project owns `convex/` and the backend tests. Deploy backend changes from the project root with `npm run convex:deploy`, using your authenticated Convex CLI. The public website posts to the existing production HTTP endpoint; moving this source does not move or reset the database.
