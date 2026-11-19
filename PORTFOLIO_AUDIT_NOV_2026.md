# Portfolio audit & redesign brief: shivakumar-dev.vercel.app

_Audited 6 November 2026 against the live production site (commit `6b49c1b`)._

**Method.** I scraped all 9 public pages: home, 7 case studies and the privacy policy. I also tested a random invalid URL, response headers, `robots.txt`, `sitemap.xml`, `site.webmanifest` and the icons, then ran scripted browser checks:
- **axe-core 4.10** accessibility scan on home, a case study and the privacy page.
- **Keyboard:** tab order and the mobile-menu focus model.
- **Form behaviour:** submitting the empty form and reading back the error state.
- **`prefers-reduced-motion`.**
- **Mobile:** touch-target sizes and how much of the screen the consent banner covers.
- **Viewports** from 320 to 2560px.
- **Copy-to-clipboard and new-tab link labelling.**
- **Lighthouse 12:** mobile and desktop, 4 runs.

**Evidence labels.** "Verified" means I measured it. "Needs verification" means it can't be confirmed from public signals.

**Scores measured today (live)**

| Page | Lighthouse (Perf / A11y / Best practices / SEO) | FCP | LCP | TBT | CLS | Transfer |
|---|---|---|---|---|---|---|
| Home, desktop | 100 / 100 / 100 / 100 | 0.4 s | 0.6 s | 20 ms | 0 | 284 KB |
| Home, mobile | 88 / 100 / 100 / 100 | 2.7 s | 2.9 s | 160 ms | 0 | 284 KB |
| /work/univassist/, mobile | 93 / 100 / 100 / 100 | 1.7 s | 2.2 s | 240 ms | 0 | 401 KB |
| /privacy/, mobile | 99 / 100 / 100 / 100 | 1.3 s | 2.0 s | 40 ms | 0 | 176 KB |

Bundles: `main.js` is 169 KB (63 KB gzipped). The Three.js toolkit chunk is 484 KB (120 KB gzipped) and only loads when you scroll near it. Mobile performance swung between 86 and 95 across runs this week. The variance comes from main-thread JavaScript (one run spent 2.2 s scripting `main.js` on a throttled CPU).

---

# Executive summary

1. **The site already proves the craft, but it doesn't yet prove the outcomes.** Seven real, live projects, detailed case studies, 100/100/100/100 on desktop, clean metadata and consent-first analytics put this above most freelance portfolios. But only one of seven case studies (UnivAssist) has any measured result. None has a date, team context or before/after. Clients and engineering leads both want "what changed because of you", and right now the page mostly says "what I built".
2. **The hiring audience has no path at all.** There's no résumé, no LinkedIn, no preferred role, no notice period or location preference, and no "for hiring managers" anchor. GitHub only appears in the footer. Every CTA is a client CTA ("Start a project", pricing, budget dropdown). A recruiter arriving from a job application has to infer everything.
3. **The pricing undersells the positioning.** "Websites built to be remembered", premium motion and a 100-score build sit next to "$25–35/hr" and "from $1,000". For the US, UK and Australian buyers your outreach targets, that reads as junior or offshore-budget, and it caps every deal. It also lists no inclusions, payment terms, revision policy or GST/currency details.
4. **A handful of real accessibility and trust gaps sit below an otherwise strong baseline:**
   - **Accessibility:** the mobile menu doesn't trap focus, form errors aren't tied to their fields, 50 mobile tap targets are under 44px, 3 of the 10 links that open a new tab don't say so, and the copy-email feedback isn't announced to screen readers.
   - **Trust and polish:** there's no branded 404 (you get Vercel's plain-text `NOT_FOUND`), no `favicon.ico` or Apple touch icon, and no Terms page for paid work.
   - **Claims to check:** "35+ websites / 20+ brands / 10+ industries" and "2+ years" can't be verified, and they conflict with other public signals (see §25).
5. **Keep the identity; sharpen the narrative.** The dark-plus-orange system, the wide Archivo type, the dot-matrix HUD and the chapter structure are distinctive and fast. Don't make it generic. Instead:
   - **Split the conversion paths:** "Hire me" versus "Start a project".
   - **Lead with outcomes:** put dated, measurable proof in front of the visual spectacle.
   - **Tighten the middle of the page:** sections 1, 2, 4 and 6 do overlapping trust work.

---

# What is already working

- **Real, verifiable work.** Seven live client sites with outbound links (all 10 external links use `target="_blank" rel="noopener"`, verified). The work is real and checkable, which is the strongest trust signal any portfolio can have.
- **Case-study pages exist, are crawlable and share well.** Each has a unique title (54–60 characters), a unique description (106–129 characters), a self-referencing canonical, its own 1200×630 OG image, one H1, six or seven H2s, and Article and BreadcrumbList schema. All verified.
- **Performance discipline.** Desktop scores 100. CLS is 0 on every page. Fonts are self-hosted and preloaded, images are AVIF/WebP with `srcset` (11 of 13 lazy-loaded, with one `fetchpriority="high"`), hashed assets are cached immutably, and HSTS, `X-Frame-Options`, `nosniff`, a referrer policy and a permissions policy are all set. Verified.
- **Consent-first analytics, done correctly.** Before a visitor chooses, the site makes zero Google requests. Decline is remembered, Accept loads Tag Manager, and withdrawing consent clears the `_ga` cookies. Accept and Decline carry equal visual weight. A plain-language privacy policy is linked from every footer and from the form. All verified (19 of 19 scripted checks pass).
- **Reduced motion is respected.** With `prefers-reduced-motion`, the ring and ticker animations stop and Lenis smooth scrolling turns off. Verified.
- **The skip link and focus styles work.** The first Tab lands on "Skip to content", and every focused element shows a 2px solid outline. Verified.
- **The voice is right.** "You talk to the person writing your code", "No black boxes", "the other kind" and "Real sites. Real customers. All live." are personal, specific and free of buzzwords. Keep this voice.
- **The pricing is transparent.** Most freelance portfolios hide price. Showing it pre-qualifies leads, and the budget dropdown now matches the pricing.
- **Machine-readable discoverability.** There's a Person, ProfessionalService, ItemList and FAQPage graph, plus `llms.txt` and `llms-full.txt`, an explicit AI-crawler `robots.txt`, and a 9-URL sitemap.
- **The UnivAssist case study is the model to copy.** It has a constraint (a locked SaaS platform), a clear role, specific decisions, a six-brand gallery and four quantified results.

---

# Critical findings

| # | Finding | Evidence | Audience | Why it matters | Severity | Recommended change | Implementation direction | How to verify |
|---|---|---|---|---|---|---|---|---|
| 1 | No hiring path | No résumé or LinkedIn, no role or location preference; GitHub is only in the footer; every CTA is "Start a project" | Employers | Recruiters skim for about 30 seconds; with no role signal and no CV, applications stall | **Critical** (for the hiring goal) | Add "For hiring teams" to the nav, a short `/hire/` page or homepage band, and a dated PDF CV | New route generated like `/privacy/`; links in nav and footer; PDF in `public/` | A recruiter finds the CV in two clicks or fewer |
| 2 | Outcomes are missing from 6 of 7 case studies | `results` is empty for every project except UnivAssist; no dates or team size anywhere | Both | "Built X" without "which led to Y" is the main gap between good and hireable | **High** | Add date, duration, team, your exact scope and at least one measured outcome per project (Lighthouse before/after, launch date, pages shipped). Never invent | Fill `projects.js` fields: `year`, `duration`, `team`, `results` | Every card shows a year, and each case study has at least one metric or an explicit "no public metric" note |
| 3 | Pricing anchors low for a premium position | "$25–35/hr", "from $1,000" | Clients | Western buyers read the rate as low-skill. It caps revenue and contradicts the premium copy | **High** | Price fixed-scope packages from outcomes; show "from" anchors and inclusions; drop the public hourly rate or raise it (see Pricing) | Edit the pricing section, the `OFFERS` in `seo.mjs`, and Harvey's config together | Average deal size and lead quality, before versus after |
| 4 | Unverifiable stat claims | "35+ websites, 20+ brands, 10+ industries, 2+ years". The page names 7 brands and about 5 industries. Your outreach notes say "freelancing since 2020" (about 6 years) | Both | Numbers that can't be traced invite doubt, and the conflicting tenure is a credibility risk | **High** | Either show the evidence ("20+ brands, including…" with a link to a full list) or use only traceable numbers. Reconcile the 2-year and 6-year signals | Change the stats copy, or add a `/work/all/` list | Every stat on the page can be traced |
| 5 | Mobile menu doesn't trap focus | After opening the menu, 14 Tabs moved focus outside it (Escape closes it and focus returns to the toggle, which does work) | Keyboard and screen-reader users | Users tab into page content hidden behind the open menu | **High** (WCAG 2.4.3) | Trap focus while open; mark background content `inert` | In `setMenu()`: `main.inert = open; footer.inert = open` | Tab cycles only through menu items |
| 6 | Form errors aren't programmatic | On empty submit, the three fields get `aria-invalid`, but `aria-describedby` is null and there's one shared message | Screen-reader users and all users | Users don't learn which field failed or why | **High** (WCAG 3.3.1/3.3.3) | Add a per-field error message, linked with `aria-describedby`, plus visible required markers | Add `<span id="err-email">`; set its text on validation | axe and VoiceOver announce the specific field error |
| 7 | No branded 404 | A random URL returns HTTP 404 with Vercel's plain-text `NOT_FOUND` | Both | A dead end loses the visitor, often one who followed an old or mistyped link | **Medium** | Add a `404.html` with nav, a one-line message, and links to Work and Contact | Generated in the build; Vercel serves `404.html` automatically | A random URL shows the branded page with status 404 |
| 8 | Tap targets are too small | 50 targets under 44px on a 390px screen, such as "Live site ↗" (64×23), toolkit project links (92×15) and the logo (160×38) | Mobile users | Mis-taps, and fails WCAG 2.5.8 (24px minimum) in places | **Medium** | Give inline links at least 44px of hit area through padding | CSS: `.card__live, .toolkit__projects a { padding-block: 12px; }` | The same script reports 0 targets under 24px and few under 44px |
| 9 | Missing icon pack | `favicon.ico` 404, `apple-touch-icon.png` 404; the manifest has an SVG only | Both | Generic icons on iOS home screens, some RSS readers and older browser tabs | **Low** | Add `.ico`, 180px Apple, 192 and 512 maskable PNGs | Generate them from `favicon.svg` with sharp | All return 200 and the manifest validates |
| 10 | No Terms of service | You sell paid work, but there are no published terms for payment, scope, IP or liability | Clients | Ambiguity at the contract stage; lost leverage in disputes | **Medium** | A plain-language `/terms/` page plus a proposal template | Same generator as the privacy page | Linked from pricing and footer |

---

# Employer-facing audit

**What a hiring manager sees today.** A strong visual first impression and a credible engineering signal: performance scores, reduced-motion support, a CDN loader, a MutationObserver engine. But the page is written entirely to clients.

| Gap | Evidence | Recommendation |
|---|---|---|
| Role and target unclear | Hero: "frontend engineer… websites for brands". No target title | State the target: "Frontend Engineer, React/TypeScript, open to full-time roles (Bengaluru or remote)", but only in the hiring route, so the client hero stays clean |
| No CV | No PDF link | `/Shiva-Kumar-Frontend-Engineer-CV-2026-11.pdf`: one page, dated, linked from nav, footer and `/hire/` |
| No LinkedIn | Footer has GitHub and WhatsApp only | Add LinkedIn, if you have a profile you keep current |
| Collaboration evidence | Every case says "Frontend development" with no team context | Add "Team: me + designer + backend dev", "Worked with: agency X / in-house team", and who you reported to (needs verification per project) |
| Engineering depth beyond UnivAssist | The other six cases are short and feature-level | For two projects, add a "Technical decisions" module covering trade-offs, a code excerpt or architecture diagram, and before/after Lighthouse |
| Seniority signals | Absent | Ownership, systems built (the UnivAssist loader and module system), mentoring, if true |
| Availability | "Booking new projects" is client-only | In `/hire/`: notice period, start date, location or relocation, remote preference |
| Public writing | None | One technical post, such as "Re-skinning a locked SaaS with 1 CSS + 1 JS file", is the cheapest credibility multiplier |

**Employer-useful proof:** the UnivAssist architecture (6 guarded modules, a self-healing MutationObserver, a version-pinned CDN loader), the 100/100/100/100 portfolio itself, accessibility work (reduced motion, consent), a commit-history link if the repo is public, and a dated CV.

---

# Client-facing audit

**What a founder or marketing lead sees today.** Clear offers, live proof, prices, direct WhatsApp, and a fast, beautiful site. That's a strong base.

| Gap | Evidence | Recommendation |
|---|---|---|
| Outcomes | Feature lists, not business results | Lead each card with one outcome line: "Launched in N weeks", "LCP 4.1 s → 1.6 s", "Lead form now on every model page". Only use real numbers |
| Social proof | No testimonials (the earlier fabricated ones were rightly removed) | Ask 2–3 real clients for one sentence plus permission; use names only with consent |
| Process timeline vs FAQ | The process tags say weeks 0–3, and the FAQ says marketing sites take 2–4 weeks | Consistent. Keep it, and state it once in the pricing section |
| Inclusions and exclusions | Not stated for the custom app; the landing page lists inclusions, but not revisions, hosting or content | Add "Includes / Not included / You'll need to provide" to each tier |
| Payment terms | Absent | "50% to start, 50% on launch. Invoiced in USD or INR (+18% GST for Indian businesses, if registered)." GST registration needs verification |
| Risk reversal | Absent | Offer a paid discovery sprint, or "Fixed price, 2 rounds of revisions, launch date in writing" |
| Response promise | The form says "I'll get back to you shortly"; "24 hours" appears nowhere | Promise something you can keep: "Reply within 1 working day (IST)" |
| Qualification depth | The form captures need, budget and message only | Add a timeline, a company URL (optional) and "Are you the decision-maker?" (optional) |

---

# Section-by-section audit

| Section | Working | Issue (evidence) | Change |
|---|---|---|---|
| **Header/nav** | Seven clear links; blurred glass bar (fixed); a CTA pill | Case-study and privacy pages omit "Toolkit" (5 links versus 6 on home), so the nav is inconsistent. No hiring link | Same nav everywhere; add "Hire me" as a quiet text link next to "Start a project" |
| **Hero** | The headline is memorable; LCP is the lead paragraph (fast, stable) | "Websites built to be remembered" says nothing about who it's for or what you do until the second line. On mobile the HUD bar wraps to 2 lines before the H1 | Keep the line, but add a role eyebrow above the H1: "Frontend engineer · Bengaluru". Shorten the mobile HUD to "Available · IST 14:05" |
| **3D project ring** | Real work above the fold; CSS 3D; respects reduced motion; pauses on hover | Screens rotate continuously, so you can't read them and they can't be clicked through to case studies. Decorative but meaningful | Make each screen a link to its case study; pause on focus; add visible labels; consider a static grid on touch devices |
| **Stats** | Count-up is subtle | Unverifiable numbers (see Critical #4); "Years in production 2+" conflicts with other signals | Use traceable stats, or link them to the work list |
| **Problem (Ch 1)** | Strong copy; the scroll-linked ink-in effect is memorable | Pinned for about 140% of the viewport, so impatient scrollers stall. The `<aside>` is nested inside a section (axe: landmark-complementary-is-top-level) | Shorten the pin to about 80%; change `aside` to `div` |
| **Process (Ch 2)** | Clear 5 steps with outputs and weeks; 2 columns on tablet (fixed) | Horizontal pin on desktop hides steps 4–5 until you scroll | Fine. Add "What you get at each step" links |
| **Trusted ticker** | Names in text, not logos, which is low trademark risk | Animated and pauses on hover, but not on focus. Its label overlaps the stats claim | Add `:focus-within` pause. Only list clients who've agreed to be named (needs verification) |
| **Work (Ch 3)** | Stacked sticky cards; full-width screenshots (cropping fixed); case study plus live link | No year or outcome on cards. The "Live site" link is 23px tall. Cards don't link the screenshot for keyboard users (`tabindex -1`; acceptable, since the CTA exists) | Add a year and one outcome line per card; bigger hit areas |
| **Toolkit (Ch 4)** | Honest (only real tools); keyboard chips with `aria-pressed` and a `polite` live region; the canvas is `aria-hidden` | Costs 120 KB gzipped of Three.js for a skills list. Project links are 15px tall. On touch you can only drag and tap | Keep it as the one "show-off" moment, but drop the scroll-trigger preload distance and add a "skip toolkit" anchor. Consider a 2D fallback on low-end devices (`navigator.hardwareConcurrency <= 4`) |
| **Pricing (Ch 5)** | Transparent; the middle tier is highlighted; the light chapter adds rhythm | Low anchors; no terms; the "Custom quote" tier has no anchor at all | See Pricing |
| **Promises** | Good risk-reducers ("You own 100% of the code") | They read as a tag cloud | Turn them into 3 numbered guarantees with one line each |
| **About (Ch 6)** | "You talk to the person writing your code" is the best line on the site | No photo now (removed at your request); no LinkedIn | Optional: a small real photo builds trust with clients and recruiters. Your call |
| **FAQ (Ch 7)** | Four useful questions; native `<details>`; FAQPage schema matches | Missing: payment, revisions, NDAs, time zone, "Do you work with agencies?" | Add 4 questions (see Revised messaging) |
| **Contact (Ch 8)** | WhatsApp, copy email, a short form, a privacy note | No field-level errors; no response-time promise; no timeline field | See §14 |
| **Footer** | Privacy and Cookie settings links | No LinkedIn or CV link; no Terms | Add them |
| **Case-study pages** | Excellent structure (meta, cover, context, challenge, features, approach, delivered, next) | No date, team or results (6 of 7); no "Back to work" at the bottom, only "next case study"; the nav omits "Toolkit" | Add the modules in the Case-study system below |
| **Privacy** | Clear and accurate, with no axe violations (verified) | No "last reviewed by" or grievance-officer wording for DPDP (see §13) | Minor additions |
| **404** | — | Plain text (verified) | Branded page |

---

# Recommended information architecture

**One homepage, two clearly signposted paths, plus one short hiring route.** Don't split into two sites, because the case studies serve both audiences.

1. Hero: role eyebrow, headline, two CTAs ("See the work" and "Start a project"), plus a quiet "Hiring? → CV" link.
2. Selected work (moved up: work is the proof, so it should come before the philosophy).
3. Problem + process (merged, so Chapter 1 flows straight into "here's how I avoid that").
4. Pricing and packages.
5. Toolkit (the "how I build" deep dive, for technical visitors).
6. About + guarantees.
7. FAQ.
8. Contact.
9. Footer: Work · Pricing · Hire me (CV) · GitHub · LinkedIn · Privacy · Terms · Cookie settings.

**Routes:** `/` · `/work/<slug>/` · **`/hire/`** (new) · **`/terms/`** (new) · `/privacy/` · **`404.html`** (new) · optional `/notes/` for technical writing.

**Nav:** Work · Process · Pricing · About · FAQ · Hire me · **Start a project** (CTA). Keep the Toolkit link inside the page flow rather than in the nav, to save space.

---

# Revised messaging

### Headline options

| # | Headline | Audience | Strength | Risk | Placement |
|---|---|---|---|---|---|
| 1 | Websites built to be remembered. (keep, plus eyebrow "Frontend engineer · Bengaluru") | Both | Memorable, on-brand | Abstract without the eyebrow | Hero H1 |
| 2 | Fast websites that make people trust your brand. | Clients | Outcome-first | Less distinctive | A/B test against #1 |
| 3 | I design and hand-code websites people remember, and buy from. | Clients | Personal, outcome | Long | Hero |
| 4 | Frontend engineer for story-driven, high-performance websites. | Employers | Role-explicit, searchable | Plain | `/hire/` H1 |
| 5 | Remembered for the story. Chosen for the speed. | Both | Rhythmic | Slightly clever | Section or OG title |

### Supporting copy options

1. "I'm Shiva, a frontend engineer in Bengaluru. I plan, design and hand-code fast, story-driven websites, then make sure they bring you business." (current; tightened)
2. "Seven live client sites, from mental-health clinics to car dealers, all built and shipped by me. You'll work with me directly, start to finish."
3. "React and TypeScript, motion that earns its place, and pages that load fast on any phone. Built by one engineer who answers your messages."
4. "For founders and marketing teams who want a site that feels premium and actually converts, without an agency's overhead."
5. (Employer) "Frontend engineer with production React/TypeScript work across healthcare, automotive, fintech and EdTech. Open to full-time frontend roles."

### CTA pairs

- **Employer:** "Download CV" / "See engineering case studies" · "View CV" / "Read how I built UnivAssist" · "Hiring? Start here" / "GitHub".
- **Client:** "Start a project" / "See the work" · "Get a quote in 24h" / "See pricing" (only if you can keep the 24h promise) · "Book a free 15-min call" / "WhatsApp me".
- **Combined systems:**
  - A. Primary "Start a project", secondary "See the work", tertiary text link "Hiring? View CV".
  - B. Two equal pills, "I'm hiring" and "I have a project", that scroll to tailored bands (risk: adds a decision up front).
  - C. Primary "See the work" (both audiences), with the sticky nav holding "Start a project" plus "Hire me".
  - **Recommendation: A.** Clients are the revenue path, and recruiters only need one visible door.

### Availability treatments

1. "Booking projects for December · IST 14:05" (dated, credible; update it monthly).
2. "Taking 2 new projects this month" (scarcity; only if true).
3. "Open to full-time roles & freelance projects" (dual; put it in `/hire/` and the footer).

### Section intros

- **Work:** "Real sites. Real customers. All live. Here's what I built, and what changed." (keep; add the second sentence once outcomes exist)
- **Process:** "Five steps from first call to launch day. You'll see every step, and each one ends with something you can review."
- **Toolkit:** "Tools I've shipped real client work with. Pick one to see where."
- **Pricing:** "Clear scope, a fixed price, and one person accountable from the first call to launch."
- **About:** keep "You talk to the person writing your code." and add one concrete line on how you work, such as "I send a progress link every Friday" (only if true).
- **Contact:** "Tell me what you're building. I reply personally within one working day (IST)."
- **Cookie banner:** "I use Google Analytics to see which pages help people, only if you agree." (current wording is fine)

### Rewritten project card (Agan Health; verified facts only, placeholders in brackets)

> **02 · Mental healthcare · Bengaluru & Trichy · [Year]**
> **Agan Health**
> A calm, trustworthy front door for a mental-health clinic: find the right therapist and book in minutes.
> [Outcome: e.g. "Mobile LCP 1.8 s" or "Booking flow cut to 3 steps". Add only if measured]
> Role: frontend development · React · TypeScript
> **Read the case study →**   Live site ↗

### Rewritten FAQ answer

> **How long does a project take?**
> A landing page or marketing site usually takes 2–4 weeks. A web app with dashboards and a backend takes 6–12 weeks. You'll get a written timeline before we start and a preview link to review each week.

(The "weekly preview link" is an assumption. Keep it only if it's true.)

**Suggested new FAQs:** How do payments work? · How many revisions are included? · Do you sign NDAs and work with agencies (white-label)? · Which time zones do you work with?

---

# Case-study system

**Required modules:**
1. Header: client, industry, location, **year and duration**, **role and team**, stack, live link.
2. One-sentence outcome hook.
3. Context.
4. Problem: the business problem plus the user problem.
5. Constraints.
6. Key decisions and trade-offs (2–4).
7. What I built, as a feature grid.
8. Visuals: cover, scroll-through and phones (these already exist).
9. **Outcome**: metrics, or an explicit "No public metrics; client-confidential" line.
10. What I'd do next / lessons.
11. Next case study **plus "← All work"**.

**Optional modules:** a code excerpt, an architecture diagram, before/after Lighthouse, a client quote (with consent), an accessibility notes panel.

**Rewritten opening (UnivAssist; verified from your repo and worklog):**

> **UnivAssist · EdTech · Brazil & UAE · Oct 2026 · 13 days · Solo frontend engineer**
> Six virtual university fairs, six brands, one platform I couldn't change. I rebuilt the experience with one CSS file and one JavaScript file: about 15k lines, zero broken registrations.
> **Constraint:** Hubilo exposes only a custom CSS and a custom JS field. React re-renders wiped changes, class names shifted between releases, and the CDN served stale code.
> **Decisive call:** a self-healing MutationObserver engine plus a loader that pins each visitor to the latest commit, so every push deploys safely within minutes.

("Zero broken registrations" needs verification. Use it only if no registration incidents were reported.)

---

# Accessibility and usability checklist

**Blockers (fix first)**
- [ ] Trap focus in the mobile menu and set background content `inert`. *(verified failure)*
- [ ] Add per-field form errors with `aria-describedby`, plus visible required markers (`*` and "Required"). *(verified missing)*

**High priority**
- [ ] Give all interactive targets at least 44×44px, at minimum 24px. 50 are currently under 44px on mobile *(verified)*.
- [ ] Mark every link that opens a new tab, visually and for screen readers. 3 of 10 don't say so, in the footer (GitHub, WhatsApp) and the WhatsApp contact card *(verified)*.
- [ ] Announce copy-email success in a live region (`aria-live="polite"` on the label) *(verified missing)*.
- [ ] Change the nested `<aside class="problem__stat">` to `div` *(axe moderate)*.
- [ ] Pause the ticker on `:focus-within`, not just on hover.
- [ ] Make 3D ring screens either links with names, or `aria-hidden` with an adjacent text list (needs verification for screen readers).

**Polish**
- [ ] Re-test the contrast of the problem-statement words and HUD captions in their resting state. axe flagged 22 and 9 nodes mid-animation; the resting colour `#7b7b81` on `#070708` is about 4.8:1, which passes, so this is likely an animation-state artefact (needs verification).
- [ ] Re-check caption contrast at the end of the gallery reveal.
- [ ] Give the consent banner `role="region"` plus a heading, and return focus after a choice made from Cookie settings.
- [ ] Reduce the problem-section pin length; long pins frustrate keyboard and assistive-technology users.

---

# Responsive checklist

- **Mobile (390px):**
  - The hero CTA is in the first viewport (verified).
  - There's no horizontal overflow at 320px (verified).
  - The consent banner covers 16% of the screen and doesn't block the CTA (verified).
  - The HUD bar wraps to 2 lines; shorten it.
  - Touch targets are too small (see above).
  - The toolkit canvas uses `touch-action: pan-y` (good); add a "tap a chip" hint.
- **Tablet (768px):** process cards show 2 per row (fixed this week). Check the pinned sections on iPad landscape (needs verification).
- **Desktop (1440px):** solid. The stacked cards are about 74vh tall; the 1440×900 screenshots show the full screenshot width (fixed).
- **Wide screen (2560px):** the container caps at 1360px with no overflow (verified). That leaves about 600px of empty side margin. Consider letting hero type and the ring scale to about 1600px.

---

# Performance and technical checklist

**Measure in the field, not only the lab:** enable Vercel Speed Insights or a web-vitals beacon, only after consent, to collect real LCP, INP and CLS from visitors.

**Risks (measured):**
- Mobile main-thread JavaScript (TBT 160–300 ms; one run had 2.2 s of `main.js` scripting): GSAP, ScrollTrigger, SplitText and Lenis setup.
- Mobile FCP of 2.7 s (font preload of 90 KB Archivo plus CSS).
- The privacy page loads the full 63 KB (gzipped) motion bundle it barely uses.

**Priorities:**
1. Split motion code into a separate chunk, so pages without pinned sections (privacy, 404, terms) skip GSAP.
2. Subset Archivo to the glyphs you use, or swap in the static `wdth=125` instance (could cut about 60% of the font weight); keep `font-display: swap`.
3. Defer `SplitText` and the scroll triggers to idle (partly done).
4. Keep Three.js lazy (it is) and consider a low-end-device bail-out.

**Already good:** immutable asset caching, AVIF/WebP, CLS 0, no render-blocking third parties, and analytics loads only after consent.

---

# SEO, metadata, and privacy checklist

| Page | Recommended title (≤60 characters) | Recommended description (≤155 characters) |
|---|---|---|
| Home | Shiva Kumar — Frontend Engineer, Bengaluru · React & GSAP | Fast, story-driven websites and web apps, designed and hand-coded by Shiva Kumar. 7 live case studies, clear pricing, direct contact. |
| /work/univassist/ | UnivAssist case study · 6 virtual fairs on a locked SaaS | How I re-skinned six university fairs on Hubilo with one CSS and one JS file: 15k lines, 13 days, zero layout overflow. |
| /work/agan-health/ | Agan Health case study · Mental-health clinic website | A calm, fast website for a Bengaluru and Trichy clinic, with therapist matching, video consults and instant booking. |
| /work/trident-hyundai/ | Trident Hyundai case study · Dealer website, 6 showrooms | Model catalogue, vehicle customiser and real-time test-drive booking for a Hyundai dealer in Bangalore. |
| /work/kinara-capital/ | Kinara Capital case study · Fintech campaign pages | Loan calculators and lead-generation landing pages for an MSME lender active in 100+ Indian cities. |
| /work/pristine-renault/ | Pristine Renault case study · Renault dealer, Goa | Model discovery, price calculators and trade-in valuation for an authorised Renault dealer in Goa. |
| /work/design-esthetics/ | Design Esthetics case study · Agency website & motion | An agency website with page transitions, micro-interactions and case-study galleries. |
| /work/pristine-isuzu/ | Pristine Isuzu case study · Commercial-vehicle dealer | Pickup and SUV discovery, a dealer locator and enquiry routing for an Isuzu dealer in Bangalore. |
| /hire/ (new) | Hire Shiva Kumar — Frontend Engineer (React, TypeScript) | Frontend engineer open to full-time roles. CV, case studies, stack and availability. Bengaluru or remote. |
| /privacy/ | Privacy policy — Shiva Kumar | (current is fine) |

- **Current titles** are unique and 54–74 characters. The home title (74) truncates in Google; use the recommendation above.
- **The home description** is 206 characters, which truncates; trim it to 155 or fewer.
- **Structured data:** keep Person, ProfessionalService, ItemList, FAQPage, and Article plus BreadcrumbList on the case pages.
  - **Don't add `WebSite` `SearchAction`.** The site has no search, so it would be invalid.
  - Add `datePublished` and `dateModified` to case studies once you have real dates.
  - Add `sameAs` LinkedIn when you have it.
- **hreflang:** not needed (single English locale).
- **The trailing-slash policy** is consistent: a 308 redirects to the slashed URL (verified), and the sitemap uses slashes (verified).
- **`/work/` itself returns 404** (verified). Either add a work index page, or keep it unlinked (it is unlinked now, so this is low priority).
- **Privacy:** the analytics disclosure is accurate, consent-first and withdrawable (verified). See the DPDP note below.

---

# Trust, legal, and policy checklist

- **Privacy policy (current):** plain-language and accurate. For India's DPDP Act, consider:
  - naming yourself as the contact for grievances, with a response time;
  - stating that consent can be withdrawn as easily as it was given (already true for cookies);
  - a line on data-processor locations.
  - (A lawyer's review is recommended; this is not legal advice.)
- **Cookie consent:** a single analytics category is enough, because there are no marketing or ad cookies. Granularity is appropriate.
- **Client names and screenshots:** names appear in text (good). Screenshots of client sites and naming clients as "trusted with launches by" imply endorsement. **Needs verification:** written permission from each client, especially UnivAssist and GEMS Education (their fair pages are shown) and Kinara Capital. Use the exact capitalization from each client's own site.
- **Attribution:**
  - Fonts are Archivo and Doto (SIL OFL, attribution optional).
  - GSAP is free under its standard license since 3.13 (verify against your usage), and Three.js and Lenis are MIT.
  - Consider a "Colophon" line in the footer: "Set in Archivo & Doto · Built with Vite, GSAP, Three.js".
- **Form abuse protection:** there's a client-side honeypot (verified in markup). Gaps:
  - FormSubmit is called with `_captcha: false` from the browser, so there's no server-side rate limit.
  - The `/api/contact` server validation exists but returns 503 in production (Resend isn't configured), so the validated path is never used.
  - **Recommendation:** configure Resend, or add a Vercel KV or Upstash rate limit (for example, 5 per hour per IP) to `/api/contact`, and make it the only path.
- **Email exposure:** the address appears in plain text 6 times on the home page (verified), which invites scraper spam. Acceptable for conversion. If spam grows, render it with JavaScript and keep the copy button.
- **WhatsApp link:** the prefill reads "Hi Shiva! I saw your website and would love to discuss a project.", which is friendly and appropriate. It opens in a new tab (good).
- **Terms page:** missing. Add payment, IP transfer on final payment, revisions, scope change and liability cap.

---

# Pricing and offer recommendations

**The problem.** $25–35/hr and "from $1,000" undercut the premium positioning, anchor every negotiation low, and invite comparison with marketplace freelancers. For India-based clients those numbers are mid-market. For US, UK and Australian clients they read as junior.

**Recommended model: fixed-scope packages with "from" anchors, no public hourly rate.**

| Offer | Outcome | Includes | Timeline | Anchor (suggested; set your own) |
|---|---|---|---|---|
| **Launch page** | One high-converting landing page | Story, design-to-code, motion, SEO, analytics, 2 revision rounds | 1–2 weeks | from $1,500 |
| **Story-driven website** | 4–8 page marketing site | Everything above, plus CMS or editable content, Core Web Vitals pass, 14-day support | 3–5 weeks | from $4,000 |
| **Speed & SEO sprint** (new, productized) | Measurably faster site | Audit, fixes, before/after Lighthouse report | 1 week | from $900 |
| **Figma to production** (new) | A designer's file, built pixel-perfect | Responsive build, motion, handover | per page or project | from $600/page |
| **Engineering partner** | Ongoing capacity | 20 or 40 hrs/month, priority turnaround | monthly | from $1,200/month |

**Terms to publish:**
- 50% deposit, 50% at launch.
- Invoiced in USD for overseas clients, or INR plus GST if applicable (needs verification).
- Two revision rounds per milestone.
- Scope changes quoted in writing first.
- Code and IP transfer on final payment.

**Risk reversal:** "If the first design round doesn't feel right, you can stop and only pay for the discovery week."

**Trade-off:** higher anchors lower lead volume but raise lead quality and protect your time. Keep India-specific pricing for referrals, off-page.

**Before changing anything:** update the website, the `OFFERS` in `scripts/seo.mjs`, `llms.txt`, and Harvey's pricing in one pass, so they never contradict each other.

---

# Brand system note

- **Name and mark:** "SK" in a white circle, at least 32px, on dark surfaces only. Never stretched or recolored.
- **Colour tokens:**
  - Ink `#070708`, panel `#111113`, text `#F4F4F1`, soft `#C9C9C4`, muted `#8D8D92`.
  - **Signal orange `#FF5A1F`** for accents and highlights only. Use `#C93D08` on light surfaces and for any text on orange.
  - Orange covers at most about 10% of any viewport.
- **Type:** Archivo Expanded (125% width) for headlines and Archivo 100% for body. **Doto** is for HUD labels, counters and numbers only. Never use it for body text.
- **Labels:** `[ 03 ] The work` format; the brackets are always orange.
- **Texture:** 6% grain, plus a 120px grid in the hero only.
- **Imagery:** real client screenshots in browser frames, at full width and never cropped sideways. No stock photos.
- **Voice:** first person, calm, specific, numbers only when they're real.
  - Banned: "world-class", "cutting-edge", "synergy", "pixel-perfect" (unless literal), "10x", "rockstar", "guru".
  - Prefer: "I built", "you'll get", "here's what changed".

---

# Motion system note

| Primitive | Duration | Easing | Use |
|---|---|---|---|
| `rise` | 1.2 s | `cubic-bezier(.22,1,.36,1)` (expo-out) | Headline lines and section titles |
| `fade-up` | 1.0 s, 0.08 s stagger | same | Cards and paragraphs on reveal |
| `press` | 0.35–0.45 s | same | Buttons, chips, link underlines |
| `scrub` | scroll-linked | linear | Parallax, pinned chapters (use sparingly; about 80% viewport maximum) |
| `ambient` | 38–60 s loops | linear | Ticker and ring only. Must pause on hover, focus and reduced motion |

**Rules:**
- Hover always has a matching focus state.
- No animation hides content longer than 1.2 s.
- Reduced motion disables all `scrub` and `ambient` effects (already true).
- Three.js stays in one section only.

---

# Analytics and measurement plan

**Current:** Tag Manager loads only after consent (verified), and one `generate_lead` event (project type and budget, no personal data) fires on form success.

**Add these events** through `dataLayer` and the consent gate:
- `cta_click` with `{location, label}`
- `whatsapp_click`
- `email_copy`
- `case_study_open` with `{slug}`
- `live_site_click` with `{slug}`
- `pricing_tier_click` with `{tier}`
- `cv_download`
- `scroll_depth` at 50 and 90%
- `form_error` with `{field}`

**UTM strategy:**
- Outreach links: `?utm_source=harvey&utm_medium=email&utm_campaign=<cohort>`.
- Outbound client-site links: `?ref=shivakumar` only if clients agree.

**KPIs (monthly):** qualified enquiries (budget ≥ the lowest tier), reply time, CV downloads, case-study views per visit, field Core Web Vitals (p75 LCP < 2.5 s, INP < 200 ms).

**Privacy:** no personal data in events, GA4 IP truncation is the default, and consent applies before any tag loads.

---

# Hiring-track plan

- **Placement:** a quiet "Hire me" link in the nav, a "Hiring? View CV →" text link under the hero CTAs, and a footer link. These lead to `/hire/`.
- **The `/hire/` page** (one screen, plus links):
  - target roles (Frontend Engineer, Senior Frontend Engineer, Product Engineer; choose what's accurate);
  - stack and depth;
  - three engineering-heavy case studies (UnivAssist first);
  - collaboration style;
  - location: Bengaluru, open to remote or hybrid, relocation stance (your call);
  - availability and notice period;
  - CV PDF (one page, dated);
  - GitHub, LinkedIn;
  - "References on request".
- **Don't** put compensation publicly unless you want to filter. Mention it only if asked.
- The client homepage stays client-first; recruiters get one obvious door.

---

# Prioritized roadmap

## Urgent fixes

| Item | Priority | Audience | Effort | Implementation | Success metric |
|---|---|---|---|---|---|
| Mobile menu focus trap and `inert` background | P0 | Accessibility | S | Toggle `inert` on `main` and `footer` in `setMenu()` | Tab stays inside the menu |
| Per-field form errors and required markers | P0 | All | S | `aria-describedby` error spans | axe and VoiceOver pass; fewer form errors |
| Branded 404 | P1 | All | S | Generate `404.html` | A random URL shows the branded page with a 404 status |
| Tap targets ≥ 44px | P1 | Mobile | S | Padding on inline links and chips | The script reports 0 targets under 24px |
| New-tab labelling, live copy feedback, nested aside | P1 | Accessibility | S | Small markup edits | axe is clean |
| Icon pack (ico, 180, 192, 512 maskable) | P2 | All | S | sharp from the SVG | All return 200 |
| Reconcile stats and tenure ("2+ yrs" vs "since 2020") | P1 | Both | S | Copy edit | Every stat can be traced |

## High-value improvements

| Item | Priority | Audience | Effort | Implementation | Success metric |
|---|---|---|---|---|---|
| `/hire/` page plus CV and LinkedIn | P0 for hiring | Employers | M | New generated route | Recruiter replies and CV downloads |
| Outcomes, dates and team on every case study | P0 | Both | M (your data) | `projects.js` fields plus template modules | Every case shows a year and outcome |
| Pricing redesign and Terms page | P1 | Clients | M | Pricing section, `/terms/`, sync with Harvey | Average deal size and qualified-lead ratio |
| Move Work above the problem and process sections | P1 | Both | S | Reorder sections; update the chapter numbers | Case-study opens per visit |
| Resend plus rate limiting; make `/api/contact` the only path | P1 | Trust | S–M | Env vars plus Upstash limit | Spam rate; delivery success |
| Analytics event plan | P2 | You | S | `dataLayer` pushes behind consent | A working conversion funnel |

## Optional polish

| Item | Priority | Audience | Effort | Implementation | Success metric |
|---|---|---|---|---|---|
| Ring screens become links; static grid on touch | P2 | Both | M | Link wrapper; media query | Clicks from the hero |
| Split the motion bundle; subset fonts | P2 | Performance | M | Dynamic import; static `wdth` instance | Mobile performance ≥ 95 consistently |
| One technical article | P2 | Employers | M | `/notes/` route | Shares and recruiter mentions |
| Client quotes (with consent) | P2 | Clients | S (outreach) | Quote module in case studies | Conversion rate |
| "What I shipped this quarter" changelog | P3 | Both | S | Footer link or page | Return visits |

---

# Final recommended direction

**Keep the cinematic one-person studio identity, and turn it into an evidence-first portfolio with two doors.** Lead with dated, measured work. Give recruiters a single `/hire/` route with a CV. Re-anchor pricing to fixed-scope packages. Fix the five small accessibility gaps, so the site's quality claims hold up under scrutiny.

---

# Claude-ready redesign brief

**Goal:** turn more visits into qualified client enquiries and recruiter conversations, without losing the distinctive dark, orange, wide-type, dot-matrix identity or the one-person voice.

**Do not change:** colour tokens, Archivo/Doto, the chapter labels, live links, the case-study pages, the consent behaviour, CLS 0, or desktop Lighthouse 100.

**Build in this order:**
1. **Accessibility fixes:**
   - Mobile menu: focus trap plus `inert` background.
   - Form: per-field `aria-describedby` errors plus visible required markers.
   - Tap targets of 44px or more.
   - New-tab text on all `target=_blank` links.
   - `aria-live` on the copy-email label.
   - `aside.problem__stat` changed to `div`.
2. **Missing pages:** a branded `404.html`, an icon pack, and `/terms/`, all generated by `scripts/build-pages.mjs` like `/privacy/`.
3. **`/hire/` route:** target roles, a stack summary, the top three engineering case studies, availability, a CV PDF in `public/`, GitHub and LinkedIn.
   - Add "Hire me" to the nav and footer, and "Hiring? View CV →" under the hero CTAs.
4. **Case-study data** in `src/data/projects.js`:
   - New fields: `year`, `duration`, `team`, `scope`, `results[]`.
   - Template modules: outcome hook, decisions and trade-offs, outcome (or an explicit "no public metric"), and "← All work".
   - Card: add the year plus one outcome line.
   - **Never invent numbers.**
5. **Homepage reorder:** hero → work → problem + process → pricing → toolkit → about + guarantees → FAQ → contact. Add a role eyebrow above the H1 and verifiable stats only.
6. **Pricing:**
   - Packages: Launch page, Story-driven website, Speed & SEO sprint, Figma to production, Engineering partner.
   - Each with "from" anchors, inclusions and terms.
   - Sync with `scripts/seo.mjs` `OFFERS`, `llms.txt` and Harvey's config.
7. **Contact form:**
   - Add timeline and company URL fields.
   - Promise "Reply within 1 working day (IST)".
   - Make `/api/contact` (Resend plus rate limit) the only path.
8. **Analytics events** (listed above), pushed only after consent.
9. **Performance:**
   - Split GSAP and the motion code from pages that don't need them.
   - Subset Archivo.
   - Target: mobile Lighthouse performance of 95 or more on home.

**Verify with:** the axe scan, the keyboard script, Lighthouse (mobile and desktop, 3 runs each), the 320/390/768/1440/2560px overflow check, the consent test suite, and the link checker. All of these already exist in this session.

**Before → after summary:**
- **Messaging:** from a beautiful client-only showcase with feature-level case studies and low price anchors, to an evidence-led portfolio with two clear doors (Start a project, Hire me), dated and measured case studies, and premium fixed-scope packages.
- **Unchanged:** the same speed, the same visual identity, and the same honest one-person voice.
