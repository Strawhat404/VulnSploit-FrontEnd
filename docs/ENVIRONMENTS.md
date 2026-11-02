# Environments and branches

| Branch    | Environment | API it talks to          |
|-----------|-------------|--------------------------|
| `main`    | Production  | the production backend   |
| `develop` | Staging     | the staging backend      |

Workflow: feature branch → PR into `develop` (CI must pass; merging deploys staging) → test →
PR `develop` → `main` (merging deploys production). Never push straight to either branch.
The backend repo's `docs/ENVIRONMENTS.md` describes the matching backend side.

## The one thing that differs per environment: `VITE_API_URL`

Vite reads `VITE_API_URL` at **build time** and bakes it into the JavaScript. So staging and
production must be two **separate builds** with different values; one build cannot serve both.

| Environment | `VITE_API_URL`                           |
|-------------|------------------------------------------|
| Production  | `https://<production-api>.onrender.com`  |
| Staging     | `https://vulnsploit-staging-api.onrender.com` (or whatever Render assigns) |

Set it in your frontend host's environment-variable settings, not in the repo. The backend
must list the matching frontend origin in `CORS_ALLOWED_ORIGINS`.

## Hosting setup (one time)

Create **two projects** on your frontend host, both pointing at this repo:

1. **Production**: tracks branch `main`, `VITE_API_URL` = production API.
2. **Staging**: tracks branch `develop`, `VITE_API_URL` = staging API.

The build is `npm run build`; output directory `dist`. Single-page-app routing needs a fallback
to `index.html` (the Docker/nginx build already has it; on Vercel/Netlify add a rewrite rule).
Then give the staging frontend URL to the backend as `CORS_ALLOWED_ORIGINS` and `SITE_URL`.

## CI

`.github/workflows/frontend-build.yml` runs `npm ci` and `npm run build` on Node 18 (the version
the Dockerfile uses) for every PR and push to `develop`/`main`. Lint is not enforced yet because of
existing lint errors.
