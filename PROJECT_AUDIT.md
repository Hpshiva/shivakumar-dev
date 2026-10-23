# Project Audit: shivakumar-dev.vercel.app

_Audited 2026-10-23 · branch `main` @ `3af3dff`_

> **Update (2026-10-23, branch `redesign-2026`):** the site has been rebuilt from scratch. All P0 and P1 items, and
> most P2/P3 items below, are resolved:
> - The Webflow template, third-party assets, fake testimonials/review schema, the insecure admin page and Firebase are gone.
> - Images went from 16 MB to about 1.3 MB (AVIF/WebP, responsive `srcset`, lazy loading), plus a 1200×630 JPG OG image.
> - The new stack is Vite + GSAP + Lenis + a lazy Three.js hero, with self-hosted fonts and no render-blocking third parties.
> - The contact form posts to a serverless endpoint and falls back to WhatsApp/email.
> - Lighthouse on the production build: **Desktop 100/100/100/100 · Mobile 99/100/100/100**.
>
> Still open: set the Resend env vars (see README), add **real** client testimonials when available, buy a custom
> domain, and add per-project case-study pages.

---

## 1. What this project is (the gist)

A **single-page personal portfolio / freelance lead-generation site** for Shiva Kumar, a frontend / software engineering consultant in Bengaluru.

- **Who it's for:** startups, agencies and businesses (mostly Indian, B2B) who want a premium, animated marketing site or web app.
- **What it does:** shows the hero, process, capabilities, selected work, services and pricing, testimonials, FAQs and contact. It turns visitors into leads through a WhatsApp CTA, mailto, and a contact form stored in Firebase.
- **Positioning:** "Fast, Fluid, Flawless": premium motion-heavy UI (GSAP + smooth scroll) + Technical SEO / Core Web Vitals.
- **Extra:** `/admin` is a small lead dashboard that lists, updates and deletes contact-form submissions.

**How it's built:** the HTML/CSS is an **exported Webflow template** (`index.html` is ~270 KB of Webflow markup, with `nesh-*` classes from the original template). Your own content in `public/data.js` is **injected at runtime** by `public/content-loader.js`, which overwrites the template text, images and links. Vite builds and Vercel hosts it.

---

## 2. Tech stack

| Layer | Tech | Where | Notes |
|---|---|---|---|
| Markup / styling | Webflow export (HTML + shared CSS from Webflow CDN) + custom `public/main.css` | `index.html`, `public/main.css` | 34 KB custom CSS, 256 `!important`s |
| Build tool | **Vite 8** (multi-page: `index` + `admin`) | `vite.config.js` | Only `main.js`/`admin` go through the bundler |
| Animation | **GSAP 3.15** + ScrollTrigger, Flip, SplitText, ScrollToPlugin, ScrollSmoother, MotionPath, DrawSVG | CDN `cdn.prod.website-files.com` | 8 separate `<script>` requests |
| Smooth scroll | **Lenis 1.1.18** | CDN unpkg | `package.json` says `^1.3.25` (unused) |
| Carousel | **Swiper 11** | CDN jsDelivr, **unpinned `@11`** | `package.json` says `^14` (unused) |
| Animation engine | Custom "Animation Engine v2.5" | `public/script.js` (112 KB, unminified) | |
| Content layer | Plain JS object `window.WEBSITE_DATA` + DOM-patching loader | `public/data.js`, `public/content-loader.js` | |
| Backend / DB | **Firebase Firestore 11.2** (CDN ESM imports) | `firebase-config.js` | `package.json` says `firebase ^12` (unused) |
| Admin | Static HTML + Firestore client SDK | `admin.html` | Client-side passcode only |
| Analytics | Google Tag Manager `GTM-N5WLVNMQ` | `index.html:47` | |
| SEO | Meta, OG/Twitter, JSON-LD (Person, LocalBusiness, Service, Reviews), sitemap, robots, manifest | `index.html`, `public/*` | |
| Hosting | **Vercel** (clean URLs, `/admin` rewrite, cache + security headers) | `vercel.json` | |
| Linting | oxlint (configured with **React** rules, but there is no React) | `.oxlintrc.json` | |

`npm run build` **succeeds** (190 ms). But the `public/` JS/CSS files are copied as-is: they are not minified, hashed or tree-shaken.

---

## 3. Issues, prioritised

### 🔴 P0: Fix immediately (security, trust, legal, broken features)

1. **The admin "login" is fake security, and the passcodes are public.**
   `firebase-config.js:186-190` hard-codes `"shiva@2026"`, `"admin123"`, `"shiva"`. That file ships to every visitor's browser. Anyone can open DevTools, read it, and open `/admin`. Also, `sessionStorage.setItem('shiva_admin_auth','true')` (`admin.html:547`) can simply be typed into the console.
   **Fix:** use **Firebase Auth** (Google sign-in restricted to your email) + **Firestore Security Rules**: `contact_leads` should allow `create` for everyone (with validation) and `read/update/delete` only when `request.auth.token.email == "you@…"`. Delete `verifyAdminPasscode` entirely.

2. **The Firebase config is a placeholder, so leads probably never reach you.**
   `firebase-config.js:20-27`: `apiKey: "AIzaSyDemoConfigKeyForShivaPortfolio2026"`, `appId: "...abcdef123456789"`. These are dummy values. Writes then fall back to **the visitor's own `localStorage`**, and you can't see a visitor's localStorage. Your `/admin` page only shows leads saved in *your* browser.
   **Fix:** create the real Firebase project and paste the real config (web API keys are fine to be public **if** rules are locked down per #1). Or drop Firebase and use a serverless function (Vercel `api/contact.js`) → Resend/Formspree/Telegram/WhatsApp Business notification. Test end-to-end from another device.

3. **Testimonials and the 5-star review schema look fabricated.**
   `public/data.js` testimonials ("Priya Sharma, VP of Product, Agan Health", etc.) use AI-style generated avatars (`avatar_*.png`). They are also published as `AggregateRating` + `Review` JSON-LD (`index.html:191+`). If these aren't real, verifiable quotes, this:
   - breaks Google's review-snippet policy (self-serving reviews can trigger a **manual action**),
   - names real companies and invented executives, which is a legal and reputation risk,
   - is the #1 thing that kills trust if a client checks LinkedIn.
   **Fix:** use only real testimonials (with permission, real photos or initials). Remove the `aggregateRating`/`review` schema either way.

4. **Leftover content from the original template / another designer.**
   `index.html` still references another designer's assets: `f1-assets.b-cdn.net/nesh-work/Portfolio Work/...` (Happy Ring, Semiconbio, Alosant, Lilipad, Omicron, RayAI…). There are also `nesh-*` logo/copyright classes, `data-wf-site` IDs, `<!-- This site was created in Webflow -->`, and `package.json` is named **`heyshiva-clone`**. `content-loader.js` hides some of this at runtime, but it is still in the source, crawlable, and visible before JS runs / with JS off. That is a copyright and credibility risk.
   **Fix:** remove every third-party asset URL and template branding from the HTML. Rename the package. Make sure the template licence allows commercial reuse.

5. **The contact form opens the user's mail app without asking.**
   `main.js:439-447` programmatically clicks a hidden `mailto:` link after submit. On mobile this throws people into Gmail/Mail unexpectedly, and on desktops without a mail client it does nothing. The success message then shows even when nothing was actually delivered.
   **Fix:** send it server-side (see #2). Only show success after a confirmed `200`, and show a real error state otherwise.

6. **Two submit handlers on the same form.**
   `main.js:405` *and* `public/content-loader.js:797` both listen for `submit` on `#contact-form`. They race to hide the form. One path only `console.log`s the data.
   **Fix:** delete the handler in `content-loader.js`.

### 🟠 P1: Performance (the site sells "Core Web Vitals", so it must ace them)

7. **Huge unoptimised images.** `public/images` is **~16 MB**: `mobile-pic.png` 4.0 MB, `myPic.png` 2.9 MB, `biopic.png` 1.8 MB, project shots 0.5–1.4 MB, avatars ~0.7 MB each.
   Worse: `data.js:9` sets `portraitUrl: '/images/myPic.png'`, and `content-loader.js:481-482` **removes the `srcset`**. So the 2.9 MB PNG replaces the 411 KB AVIF on every device, and it's the LCP image.
   **Fix:** convert everything to AVIF/WebP at 1x/2x widths (e.g. `sharp`/`squoosh`), target < 150 KB each. Use `<picture>` with `srcset`/`sizes`, `width`/`height`, `fetchpriority="high"` on the hero, and `loading="lazy"` elsewhere (currently **0** lazy images). Delete unused PNGs.

8. **Render-blocking script waterfall from 4 different CDNs.** 8 GSAP files + Lenis + Swiper + 3 local scripts, all classic `<script>`s with no `defer` (`index.html:3658-3672`). They are spread across Webflow CDN, unpkg and jsDelivr, so there's extra DNS/TLS per origin and a 3rd-party single point of failure.
   **Fix:** `npm i` is already done. Import `gsap`, `lenis`, `swiper` from `node_modules` in one entry module and let Vite bundle, minify and hash them. Load only the GSAP plugins you actually use (`ScrollSmoother` *and* Lenis are both loaded; pick one).

9. **Content is injected by JS after load (flash, CLS, SEO risk).** Google indexes the Webflow template text first, and users see it swap to your text (FOUC/CLS). `innerHTML` with data also opens an XSS hole if `data.js` ever comes from a CMS.
   **Fix:** render content into the HTML **at build time**: a tiny Vite plugin, or move to **Astro**, which is ideal for this (static HTML, zero JS by default, islands for animations). That removes `content-loader.js` entirely.

10. **`public/` assets bypass the build.** `script.js` (112 KB), `data.js`, `content-loader.js`, `main.css` are served raw: no minification and no content hash. So the `max-age=31536000, immutable` header can't be safely applied and users may get stale files.
    **Fix:** move them into `src/` and import from the entry so Vite processes them.

11. **270 KB HTML** of Webflow markup (8 hidden duplicate work cards and lots of unused classes). Strip unused sections, inline SVGs that repeat, and the Webflow shared CSS you don't use (PurgeCSS / Tailwind rewrite).

12. **Autoplaying background videos** (even after the swap) and no `prefers-reduced-motion` handling anywhere in `script.js` or `main.css`. Bad for battery, data, and vestibular-sensitive users.

### 🟡 P2: SEO & accessibility

13. **Sitemap lists `#hash` URLs** (`/#work`, `/#about`…). Google ignores fragments, so keep just `/`. `lastmod` is static.
14. **`robots.txt` `Disallow: /*.json$`** also blocks `site.webmanifest` validators. That's harmless but pointless, because `node_modules` isn't deployed. Simplify it.
15. **OG image is AVIF** (`og:image .../myPic.avif`). WhatsApp, LinkedIn and Facebook often can't render AVIF previews, which hurts you because WhatsApp is your main CTA. Use a 1200×630 JPG/PNG.
16. **Inconsistent positioning across title, JSON-LD and copy:** "Premium Software Engineering & Digital Solutions" vs "Creative Frontend Engineer & Technical SEO Specialist" vs "Software Engineering Consultant". Pick one niche and use it everywhere.
17. **Anchor-link hijack** (`main.js:203-213`) calls `history.replaceState(null, null, " ")`, which wipes the URL hash. People can't share deep links like `/#services`, and screen-reader focus isn't moved to the target.
18. **Accessibility:** custom cursor/magnetic effects, a custom menu, and Swiper drag with only ~26 ARIA attributes in 3.6k lines. Check keyboard navigation of the menu, FAQ accordion and slider; focus-visible styles; colour contrast on the dark theme; form labels (not just placeholders); and give the hamburger a `<button aria-expanded>`.
19. **`geo.position` / `LocalBusiness` with exact city-centre coordinates and opening hours** for a solo freelancer can look spammy. `Person` + `ProfessionalService` with `areaServed` is enough.

### 🔵 P3: Code quality & DX

20. **Dependency mismatch:** `package.json` declares `firebase ^12`, `gsap ^3.15`, `lenis ^1.3`, `swiper ^14`, but the code loads `firebase 11.2`, `lenis 1.1.18` and `swiper@11` from CDNs. Use one source of truth (npm).
21. **`.oxlintrc.json` enables React plugins** but this is vanilla JS. Use `oxlint` defaults + `eslint-plugin-compat`, and add `prettier`.
22. **Dead / duplicated logic:** the hover-video controller in `main.js:216-292` targets videos that `data.js` blanks out. `script.js` has 8+ "engines" in one IIFE. Split them into modules (`menu.js`, `textReveal.js`, `horizontalScroll.js`…).
23. **Noisy `console.log`s with emojis in production** (`firebase-config.js`, `main.js`, `content-loader.js`). Strip them in the build (`esbuild.drop: ['console']`).
24. **Empty `catch {}` blocks** (`firebase-config.js:54`) hide failures.
25. **No README, no tests, no CI.** Add a README (setup, deploy, how to edit content). Add a GitHub Action running `lint` + `build` + Lighthouse CI on PRs.
26. **Hard-coded phone/email in 4+ places** (`main.js:366`, `main.js:368`, `main.js:439`, `data.js`). Read from one config.
27. **`.DS_Store` files** exist on disk (they're git-ignored, so that's fine). `dist/` is also correctly ignored.
28. **Missing CSP header.** `vercel.json` has good basics (`nosniff`, `X-Frame-Options`, etc.). `X-XSS-Protection` is deprecated, so drop it. Add a `Content-Security-Policy` once scripts are self-hosted, plus `Strict-Transport-Security`.

---

## 4. "100x better" roadmap

**Week 1: Trust & function (P0)**
- [ ] Real Firebase config + Auth + Security Rules, or a Vercel serverless contact endpoint with an instant WhatsApp/Telegram/email notification to you
- [ ] Delete hard-coded passcodes and the `mailto` auto-open
- [ ] Replace or remove the testimonials and remove the review schema
- [ ] Purge all template/third-party assets and branding

**Week 2: Speed (P1)**
- [ ] Compress images (16 MB → < 1.5 MB total), `<picture>` + lazy loading, AVIF hero with `fetchpriority`
- [ ] Bundle GSAP/Lenis/Swiper via npm, use one scroll engine, `defer` everything
- [ ] Add `prefers-reduced-motion`
- [ ] Target: **Lighthouse 95+ on mobile**, LCP < 2.0 s, CLS < 0.05, and put the score on the site as proof

**Week 3: Re-platform (optional, biggest long-term win)**
- [ ] Rebuild on **Astro + Tailwind + GSAP**: content in Markdown/JSON content collections rendered at build time, no Webflow bloat, real per-project pages (`/work/agan-health`) with case studies, which are far better for SEO than hash sections
- [ ] Add a blog (`/blog`) for long-tail SEO ("Webflow to Next.js migration Bengaluru", "Core Web Vitals audit")

**Week 4: Conversion**
- [ ] Case studies with real metrics (before/after Lighthouse, conversion lift), screenshots and your role
- [ ] Clear single CTA (Cal.com booking *or* WhatsApp) + a short qualifying form (budget, timeline)
- [ ] GA4 events via GTM: CTA clicks, form submits, scroll depth
- [ ] Real GitHub/LinkedIn links in `sameAs` and the footer
- [ ] Custom domain (e.g. `shivakumar.dev`) instead of `*.vercel.app`, which builds a lot of credibility for a consultant

---

## 5. Quick wins you can do in under 1 hour

1. `data.js:9` → `portraitUrl: '/images/myPic.avif'` (cuts ~2.5 MB from the LCP image).
2. Delete `content-loader.js:793-806` (duplicate form handler).
3. Delete the `aggregateRating` + `review` block in the JSON-LD.
4. Remove `#…` entries from `sitemap.xml`.
5. Pin `swiper@11.x.x` to an exact version (or bundle it).
6. Rename `package.json` `name` to `shivakumar-portfolio`.
7. Swap the OG image to a 1200×630 JPG.
