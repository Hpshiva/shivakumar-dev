# Shiva Kumar — Portfolio

Personal portfolio and lead-generation site for Shiva Kumar, a frontend engineer in Bengaluru.
Live at **https://shivakumar-dev.vercel.app**.

## Stack

| Concern | Choice |
|---|---|
| Build | Vite 8 (static HTML + ES modules) |
| Motion | GSAP 3 (ScrollTrigger, SplitText) + Lenis smooth scroll |
| Hero | CSS 3D ring of the six live client sites (no WebGL, GPU-composited) |
| Fonts | Self-hosted Archivo (variable width, Expanded for display) + Doto dot-matrix, via Fontsource |
| Case studies | 6 pages at `/work/<slug>/`, generated from `src/data/projects.js` |
| Contact | Vercel serverless function (`api/contact.js`) → Resend email, with WhatsApp/email fallback |
| Hosting | Vercel |

Lighthouse (production build): **Desktop 100 / 100 / 100 / 100**, **Mobile ~97 / 100 / 100 / 100**.

## Editing projects & case studies

All work cards and case-study pages come from **`src/data/projects.js`**. Edit the text there, then:

```bash
npm run pages
```

(`dev` and `build` run it automatically.) To show real results on a case study, fill its `results` array —
only with numbers you can back up.

To refresh the screenshots of the live client sites (desktop scroll-through + phone screens):

```bash
npm run capture && npm run images && npm run pages
```

## Develop

```bash
npm install
npm run dev
```

```bash
npm run build && npm run preview
```

## Project structure

```
index.html              All page content and SEO metadata (edit copy here)
src/main.js             Smooth scroll, story chapters, parallax, pinned sections, work view modes
src/data/projects.js    Projects + case-study content (single source of truth)
work/<slug>/index.html  Generated case-study pages (don't edit by hand)
scripts/build-pages.mjs Generates work cards + case-study pages
scripts/capture-sites.mjs  Screenshots the live client sites with local Chrome
src/contact.js          Contact form + copy-email
src/styles.css          Design tokens and all styles
api/contact.js          Serverless contact endpoint (Vercel)
public/                 Static files served as-is (images, favicon, robots, sitemap)
source-images/          Original PNGs; not deployed
scripts/optimize-images.mjs  Generates AVIF/WebP + OG image into public/images
```

## Images

Put originals in `source-images/`, add them to the list in `scripts/optimize-images.mjs`, then run:

```bash
npm run images
```

## Contact form setup (one-time)

The form posts to `/api/contact`, which emails you through [Resend](https://resend.com) (free tier is plenty).
In Vercel → Project → Settings → Environment Variables, add:

| Variable | Example |
|---|---|
| `RESEND_API_KEY` | `re_...` |
| `CONTACT_TO_EMAIL` | `shivakumar.bfgi@gmail.com` |
| `CONTACT_FROM_EMAIL` (optional) | `Portfolio <hello@yourdomain.com>` (needs a verified domain in Resend) |

Until these are set, or in local dev, the form shows one-click **WhatsApp** and **email** links with the
visitor's message prefilled, so no lead is ever lost.

## Analytics

Google Tag Manager (`GTM-N5WLVNMQ`) is injected after the page becomes idle and never on localhost.
A successful form submission pushes a `generate_lead` event to `dataLayer`.
