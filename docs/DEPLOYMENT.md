# Production deployment

Updated September 29, 2026. One local source project; two GitHub Pages repositories.

| Component | Repository | Domain |
| --- | --- | --- |
| Public | reimage-demo/amanah | www.amanahmedicalcare.com |
| Admin | reimage-demo/amanah-admin | admin.amanahmedicalcare.com |

Both repositories serve `gh-pages` from `/`. Run `npm run publish:pages` and `npm run admin:publish` from the project root. Unified source is in `reimage-demo/amanah:main`.

Wix DNS has CNAME records for `www` and `admin`, both targeting `reimage-demo.github.io`, with a one-hour TTL. The previous `www` target was `cdn3.wixdns.net`; there was no previous `admin` CNAME. The apex A records now target GitHub Pages: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`, enabling the bare domain to redirect to `www`. Previous apex values were `185.230.63.107`, `185.230.63.186`, and `185.230.63.171`. Google Workspace MX, TXT and nameserver records were left intact.

GitHub custom domains are saved for both repositories. HTTPS certificate provisioning must complete before HTTPS enforcement can be enabled. Verify with the GitHub Pages settings or API and request both HTTPS URLs before declaring the cutover fully live.
