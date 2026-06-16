---
title: Deployment
description: Build and deploy the ResourcesJS docs site.
---

The docs app is a static Astro Starlight site located in `docs/`.

## Local Development

```bash
cd docs
npm install
npm run dev
```

The docs app uses Node.js `>=22.12.0`. This requirement applies only to the docs
site build tooling. The ResourcesJS package itself still supports Node.js
`>=18.18.0`.

## Production Build

```bash
cd docs
npm run build
```

The generated static site is written to:

```txt
docs/dist/
```

## GitHub Pages

This repository includes a GitHub Actions workflow that builds and deploys the
docs site from `main`.

To use `resourcesjs.amrachraf.cloud` with GitHub Pages:

1. In GitHub, set Pages source to GitHub Actions.
2. Point the DNS record for `resourcesjs.amrachraf.cloud` to GitHub Pages.
3. Keep `docs/public/CNAME` set to `resourcesjs.amrachraf.cloud`.

## Cloudflare Pages

Cloudflare Pages is also a good fit.

Recommended settings:

| Setting | Value |
| --- | --- |
| Root directory | `docs` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `22.12.0` or newer |

Then connect the custom domain `resourcesjs.amrachraf.cloud` in the Cloudflare
Pages dashboard.
