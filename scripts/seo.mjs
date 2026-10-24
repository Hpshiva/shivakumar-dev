// SEO + AI-discoverability files, all generated from src/data/projects.js and
// the homepage HTML so nothing drifts out of sync:
//   - JSON-LD (homepage graph, per-case-study graph)
//   - public/llms.txt, public/llms-full.txt (https://llmstxt.org)
//   - public/sitemap.xml
import fs from 'node:fs'
import { projects } from '../src/data/projects.js'
import { buildToolData } from '../src/toolkit-data.js'

export const SITE = 'https://shivakumar-dev.vercel.app'
const today = new Date().toISOString().slice(0, 10)

export const PERSON = {
  name: 'Shiva Kumar',
  jobTitle: 'Frontend Engineer',
  email: 'shivakumar.frontend@gmail.com',
  phone: '+91-6283937782',
  whatsapp: 'https://wa.me/916283937782',
  github: 'https://github.com/Hpshiva',
  city: 'Bengaluru',
  region: 'Karnataka',
  country: 'IN',
  summary:
    'Independent frontend engineer in Bengaluru, India who plans, designs and hand-codes fast, story-driven websites and web apps with React, Next.js, TypeScript and GSAP, with Core Web Vitals and technical SEO built in.',
  stats: { websites: '35+', brands: '20+', industries: '10+' },
}

// Must match the Pricing section on the homepage
export const OFFERS = [
  {
    name: 'Landing page or website',
    description:
      'A fast, animated landing page or marketing website that tells your story, ranks on Google and converts. Most land between $1,000 and $2,000; multi-page sites are quoted after a short call.',
    price: { min: 1000, max: 2000, unit: null },
  },
  {
    name: 'Custom web application',
    description: 'End-to-end development of a secure, scalable web application shaped around your business logic.',
    price: null,
  },
  {
    name: 'Ongoing support',
    description: 'New pages, campaign modules, fixes and performance work on your existing site. Billed hourly, no minimum commitment.',
    price: { min: 25, max: 35, unit: 'HOUR' },
  },
]

const stripTags = (html) =>
  html
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/\s+/g, ' ')
    .trim()

/** FAQ exactly as rendered on the page (Google requires schema to match visible text). */
export function readFaq(indexHtml) {
  const items = []
  const re = /<summary>([\s\S]*?)<span class="faq__icon"[\s\S]*?<div class="faq__answer">([\s\S]*?)<\/div>/g
  let m
  while ((m = re.exec(indexHtml))) items.push({ q: stripTags(m[1]), a: stripTags(m[2]) })
  return items
}

const personNode = () => {
  const { tools } = buildToolData()
  return {
    '@type': 'Person',
    '@id': `${SITE}/#person`,
    name: PERSON.name,
    givenName: 'Shiva',
    familyName: 'Kumar',
    jobTitle: PERSON.jobTitle,
    description: PERSON.summary,
    url: `${SITE}/`,
    image: `${SITE}/images/og-image.jpg`,
    email: `mailto:${PERSON.email}`,
    telephone: PERSON.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: PERSON.city,
      addressRegion: PERSON.region,
      addressCountry: PERSON.country,
    },
    homeLocation: { '@type': 'Place', name: 'Bengaluru, India' },
    sameAs: [PERSON.github],
    knowsLanguage: ['en'],
    knowsAbout: [
      ...tools.map((t) => t.name),
      'Next.js',
      'Core Web Vitals',
      'Technical SEO',
      'Web performance',
      'Web accessibility',
      'Scroll storytelling',
    ],
    hasOccupation: {
      '@type': 'Occupation',
      name: 'Frontend Engineer',
      occupationLocation: { '@type': 'City', name: 'Bengaluru' },
      skills: 'React, Next.js, TypeScript, GSAP, Three.js, Core Web Vitals, technical SEO, accessibility',
    },
  }
}

function offerNode(o) {
  const node = { '@type': 'Offer', itemOffered: { '@type': 'Service', name: o.name, description: o.description } }
  if (o.price) {
    node.priceSpecification = {
      '@type': o.price.unit ? 'UnitPriceSpecification' : 'PriceSpecification',
      priceCurrency: 'USD',
      minPrice: o.price.min,
      maxPrice: o.price.max,
      ...(o.price.unit ? { unitCode: 'HUR', unitText: 'per hour' } : {}),
    }
  }
  return node
}

export function homeJsonLd(indexHtml) {
  const faq = readFaq(indexHtml)
  const graph = [
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: `${SITE}/`,
      name: 'Shiva Kumar',
      description: PERSON.summary,
      inLanguage: 'en',
      publisher: { '@id': `${SITE}/#person` },
    },
    {
      '@type': 'ProfilePage',
      '@id': `${SITE}/#webpage`,
      url: `${SITE}/`,
      name: 'Shiva Kumar — Frontend Engineer in Bengaluru',
      isPartOf: { '@id': `${SITE}/#website` },
      mainEntity: { '@id': `${SITE}/#person` },
      primaryImageOfPage: `${SITE}/images/og-image.jpg`,
      inLanguage: 'en',
    },
    personNode(),
    {
      '@type': 'ProfessionalService',
      '@id': `${SITE}/#service`,
      name: 'Shiva Kumar — Frontend Engineering',
      url: `${SITE}/`,
      description:
        'Fast, story-driven websites, landing pages and web apps, engineered for Core Web Vitals, technical SEO and conversion.',
      image: `${SITE}/images/og-image.jpg`,
      email: PERSON.email,
      telephone: PERSON.phone,
      founder: { '@id': `${SITE}/#person` },
      employee: { '@id': `${SITE}/#person` },
      priceRange: '$25–35/hr · landing pages from $1,000',
      currenciesAccepted: 'USD, INR',
      address: {
        '@type': 'PostalAddress',
        addressLocality: PERSON.city,
        addressRegion: PERSON.region,
        addressCountry: PERSON.country,
      },
      areaServed: ['Worldwide', 'United States', 'United Kingdom', 'Canada', 'Australia', 'India'],
      knowsAbout: ['Website development', 'Landing pages', 'Web applications', 'Web performance', 'Technical SEO'],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Engagements',
        itemListElement: OFFERS.map(offerNode),
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: PERSON.email,
        telephone: PERSON.phone,
        availableLanguage: ['English'],
        url: `${SITE}/#contact`,
      },
    },
    {
      '@type': 'ItemList',
      '@id': `${SITE}/#work`,
      name: 'Case studies',
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: projects.length,
      itemListElement: projects.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE}/work/${p.slug}/`,
        name: `${p.name} — ${p.industry}`,
      })),
    },
  ]
  if (faq.length) {
    graph.push({
      '@type': 'FAQPage',
      '@id': `${SITE}/#faq`,
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

export function caseJsonLd(p, og) {
  const url = `${SITE}/work/${p.slug}/`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${url}#article`,
        headline: `${p.name} case study: ${p.line}`.slice(0, 110),
        description: p.intro,
        url,
        image: og,
        inLanguage: 'en',
        author: { '@type': 'Person', '@id': `${SITE}/#person`, name: PERSON.name, url: `${SITE}/` },
        publisher: { '@type': 'Person', '@id': `${SITE}/#person`, name: PERSON.name },
        isPartOf: { '@id': `${SITE}/#website` },
        about: { '@type': 'Organization', name: p.name, url: p.url },
        keywords: [p.industry, ...p.stack].join(', '),
        articleSection: 'Case study',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
          { '@type': 'ListItem', position: 2, name: 'Work', item: `${SITE}/#work` },
          { '@type': 'ListItem', position: 3, name: p.name, item: url },
        ],
      },
    ],
  }
}

/* ---------------------------------------------------------
   llms.txt — concise, link-first summary for AI assistants
   --------------------------------------------------------- */
export function llmsTxt() {
  const priced = OFFERS.map((o) => {
    const price = o.price
      ? o.price.unit
        ? `$${o.price.min}–${o.price.max}/hour`
        : `from $${o.price.min.toLocaleString('en-US')}`
      : 'custom quote'
    return `- **${o.name}** (${price}): ${o.description}`
  }).join('\n')

  return `# Shiva Kumar — Frontend Engineer (Bengaluru, India)

> ${PERSON.summary} ${PERSON.stats.websites} websites shipped for ${PERSON.stats.brands} brands across ${PERSON.stats.industries} industries. Works directly with clients worldwide; no hand-offs, account managers or templates.

Key facts:
- Name: Shiva Kumar · Role: independent frontend engineer · Based in Bengaluru, India (IST, UTC+5:30)
- Core stack: React, Next.js, TypeScript, GSAP, Three.js, Tailwind, CSS architecture, REST APIs
- Strengths: scroll storytelling and motion, Core Web Vitals and performance, technical SEO, accessibility, re-skinning locked SaaS platforms with custom CSS/JS
- Typical timelines: marketing site 2–4 weeks; web app with dashboards and backend 6–12 weeks
- Every project includes full code ownership, documentation and handover, and 14 days of post-launch support
- Contact: ${PERSON.email} · WhatsApp ${PERSON.whatsapp} · ${SITE}/#contact

## Services and pricing

${priced}

## Case studies

${projects.map((p) => `- [${p.name}](${SITE}/work/${p.slug}/): ${p.line} (${p.industry}, ${p.location}; ${p.stack.join(', ')})`).join('\n')}

## Pages

- [Home](${SITE}/): story-led portfolio — process, work, toolkit, pricing, about, FAQ and contact
- [Pricing](${SITE}/#pricing): engagements and rates
- [Contact](${SITE}/#contact): project enquiry form, WhatsApp and email

## Optional

- [Full case-study text](${SITE}/llms-full.txt): every case study in plain text
- [Sitemap](${SITE}/sitemap.xml)
`
}

export function llmsFullTxt(indexHtml) {
  const faq = readFaq(indexHtml)
  const block = (p) => {
    const out = [`## ${p.name} — ${p.industry} (${p.location})`, '', `URL: ${SITE}/work/${p.slug}/`, `Client site: ${p.url}`, `Role: ${p.role}`, `Stack: ${p.stack.join(', ')}`, '', p.intro, '']
    out.push('### Context', '', ...p.context.flatMap((t) => [t, '']))
    out.push('### Challenge', '', ...p.challenge.flatMap((t) => [t, '']))
    out.push('### What was built', '', ...p.features.map((f) => `- **${f.title}**: ${f.text}`), '')
    out.push('### Approach', '', ...p.approach.flatMap((t) => [t, '']))
    if (p.results?.length) out.push('### Results', '', ...p.results.map((r) => `- ${r.value}: ${r.label}`), '')
    out.push('### Delivered', '', p.delivered.join(' · '), '')
    return out.join('\n')
  }
  return `${llmsTxt()}
---

# Case studies (full text)

${projects.map(block).join('\n---\n\n')}
---

# Frequently asked questions

${faq.map((f) => `**${f.q}**\n${f.a}`).join('\n\n')}
`
}

export function sitemapXml() {
  const urls = [`${SITE}/`, ...projects.map((p) => `${SITE}/work/${p.slug}/`)]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u, i) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod><priority>${i === 0 ? '1.0' : '0.8'}</priority></url>`).join('\n')}
</urlset>
`
}

export function writeSeoFiles(indexHtml) {
  fs.writeFileSync('public/llms.txt', llmsTxt())
  fs.writeFileSync('public/llms-full.txt', llmsFullTxt(indexHtml))
  fs.writeFileSync('public/sitemap.xml', sitemapXml())
}
