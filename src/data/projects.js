// Single source of truth for the work section and every case-study page.
// Edit here, then run `npm run pages` (it also runs automatically before dev/build).
//
// `results` is intentionally empty: add only real, verifiable numbers, e.g.
//   results: [{ value: '1.2s', label: 'Largest Contentful Paint on 4G' }]
// When it has entries, the case study shows a Results section.

export const projects = [
  {
    slug: 'univassist',
    name: 'UnivAssist',
    url: 'https://www.univassist.com',
    domain: 'univassist.com',
    shotDomain: 'redeinspira.webifairs.com',
    capture: false, // screenshots come from the event work itself, not univassist.com
    industry: 'EdTech · Virtual events',
    location: 'Brazil & UAE',
    role: 'Frontend engineering & UI system',
    stack: ['Custom CSS', 'JavaScript', 'MutationObserver', 'jsDelivr CDN'],
    line: 'Six virtual university fairs, six brands, one locked SaaS platform, re-skinned with nothing but a CSS file and a JavaScript file.',
    intro:
      'UnivAssist has spent 15+ years connecting 500+ universities across 70 countries with students and counsellors. Its WebiFair events take that network online with live university booths, admissions chats and video rooms. My brief: make six of those fairs look and feel like premium, brand-owned experiences, on a platform whose code I could never touch.',
    context: [
      'Each fair is its own event. Rede Inspira Virtual College Fairs serves students in Brazil. Five GEMS Education Virtual University Fairs (Changemakers, Explorers, Innovators, Lumina and Visionaries) serve students in the UAE. Every fair hosts dozens of universities, from Canada and the UK to Hong Kong and Australia.',
      'The fairs run on Hubilo, a closed SaaS platform built with React and Material UI. Organisers get exactly two hooks: one custom CSS field and one custom JavaScript field. There are no templates, no components and no access to the source.',
    ],
    challenge: [
      'Out of the box, every fair looked identical: generic, dense and hard to scan. That is expensive when a 17-year-old has 60 universities to compare and about eight seconds of patience.',
      'The platform pushed back, too. React re-renders silently wiped changes. Auto-generated class names shifted between releases. Native modals swallowed clicks. The CDN serving the custom code kept handing visitors stale versions.',
      'So the real job was this: build a design system for six different brands on top of someone else’s application, without breaking a single registration, login or live room.',
    ],
    gallery: {
      title: 'One codebase. Six brands.',
      note: 'Same engine, six identities',
      items: [
        { img: 'cases/univassist-redeinspira', caption: 'Rede Inspira · Brazil' },
        { img: 'cases/univassist-changemakers', caption: 'Changemakers · GEMS Education' },
        { img: 'cases/univassist-explorers', caption: 'Explorers · GEMS Education' },
        { img: 'cases/univassist-innovators', caption: 'Innovators · GEMS Education' },
        { img: 'cases/univassist-lumina', caption: 'Lumina · GEMS Education' },
        { img: 'cases/univassist-visionaries', caption: 'Visionaries · GEMS Education' },
        { img: 'cases/univassist-lobby', caption: 'Virtual Lobby: scannable university cards' },
        { img: 'cases/univassist-search', caption: 'Instant search across universities' },
        { img: 'cases/univassist-filter', caption: 'Guided lobby with country filters' },
      ],
    },
    features: [
      { title: 'Event pass & live countdown', text: 'A sticky student pass with a real-time countdown, local date and timezone, and one-tap Register and Add-to-Calendar.', note: 'the page sells the event' },
      { title: 'A lobby built for scanning', text: 'Rebuilt university cards, a “how the lobby works” guide, country filters and a single search pill, so students reach their shortlist fast.', note: '60 booths, zero overwhelm' },
      { title: 'University profiles that get read', text: 'Academic programmes and majors as filterable chips, video banners and a clean About section, instead of a wall of text.', note: 'from data dump to dossier' },
      { title: 'Login & register takeover', text: 'A branded split-screen login with countdown and event perks, layered over Hubilo’s native React forms so validation and one-time codes never break.', note: 'native forms, new skin' },
      { title: 'A self-healing UI engine', text: 'A debounced MutationObserver re-applies every enhancement after each React render, with idempotency guards so nothing ever doubles up.', note: 'survives every re-render' },
      { title: 'A smart CDN loader', text: 'A tiny loader asks GitHub for the latest commit and pins the code to that exact version on jsDelivr. Every visitor gets the right build within minutes, with no cache purges and no unstyled flash.', note: 'push = deploy' },
    ],
    approach: [
      'Treat the platform like an API, not an enemy. I mapped Hubilo’s DOM like a contract: which elements stay stable, which re-render, and which carry native handlers that must never be intercepted (room buttons, meeting slots, one-time-code forms).',
      'Use theme tokens, not hard-coded colours. Each brand lives in one block of CSS custom properties, so a new fair is a copied folder, a palette and a config object, not a redesign.',
      'Write six self-contained JavaScript modules (login, register, lobby, embeds, booths and people). Each one is guarded, so a fix on one page can never leak into another.',
      'Verify, don’t hope. Headless Chrome audits across five viewports, from 1440px down to 360px, with a zero-horizontal-overflow check. A preview harness tests unreleased code against the live event without touching it.',
    ],
    delivered: ['Design system for 6 brands', 'Login & register takeover', 'Virtual Lobby redesign', 'University profile drawer', 'People directory polish', 'CDN loader & deploy pipeline', 'Responsive QA across 5 viewports'],
    results: [
      { value: '6', label: 'Branded virtual fairs from one codebase' },
      { value: '15k+', label: 'Lines of CSS & JS layered over a closed platform' },
      { value: '13 days', label: 'From first commit to six launch-ready fairs' },
      { value: '0', label: 'Horizontal overflow across 5 audited viewports' },
    ],
  },
  {
    slug: 'agan-health',
    name: 'Agan Health',
    url: 'https://www.aganhealth.com',
    domain: 'aganhealth.com',
    industry: 'Mental healthcare',
    location: 'Bengaluru & Trichy',
    role: 'Frontend development',
    stack: ['React', 'TypeScript', 'Redux Toolkit'],
    line: 'A calm, trustworthy front door for a mental-health clinic, so people can find the right therapist and book in minutes.',
    intro:
      'Agan Health offers therapy, counselling and psychiatric care from clinics in Bengaluru and Trichy. For many visitors the website is the very first step they take when they’re struggling, so it had to feel safe, simple and human.',
    context: [
      'Agan Health’s psychologists and psychiatrists support people of all ages through anxiety, depression, stress and trauma, using approaches such as CBT, DBT and family counselling, online and in person. They also run mental-health programmes for companies.',
    ],
    challenge: [
      'Asking for help is hard. Every extra click, slow page or confusing menu is a reason to close the tab.',
      'The site had to explain a wide range of services in plain language, help people find the right kind of support, and make booking a first consultation feel effortless on any phone and any connection.',
    ],
    features: [
      { title: 'Therapist matching', text: 'A guided flow that helps visitors find a specialist who fits their needs instead of scrolling a long list of names.', note: 'fewer dead ends' },
      { title: 'Video consultations', text: 'Integrations for online sessions, so care isn’t limited to people who can reach a clinic.', note: 'care from home' },
      { title: 'Instant booking', text: 'A short, focused booking engine with clear steps and no surprises.', note: 'fewest possible steps' },
      { title: 'A calm interface', text: 'Soft colours, generous spacing and plain-language copy that reassures instead of overwhelming.', note: 'designed to feel safe' },
    ],
    approach: [
      'I treated trust as the main feature: readable typography, honest copy and nothing that feels pushy.',
      'The booking and matching flows were built as typed React components with predictable state in Redux Toolkit, so they behave the same way every time.',
      'Pages were kept light and mobile-first, because many visitors arrive on a phone, late at night, on a slow connection.',
    ],
    delivered: ['Responsive website', 'Therapist matching flow', 'Video consultation integration', 'Booking engine', 'Reusable component library'],
    results: [],
  },
  {
    slug: 'trident-hyundai',
    name: 'Trident Hyundai',
    url: 'https://tridenthyundai.com',
    domain: 'tridenthyundai.com',
    industry: 'Automotive dealership',
    location: 'Bangalore',
    role: 'Frontend development',
    stack: ['React', 'Redux', 'Tailwind CSS'],
    line: 'Six showrooms, one fast website: browse the full Hyundai range, customise a car and book a test drive in a few taps.',
    intro:
      'Trident Hyundai has sold and serviced Hyundai cars in Bangalore since 1998, across six showrooms and ten service centres. Their website needed to work as hard as their best salesperson.',
    context: [
      'Beyond new cars, Trident offers test drives, exchange, body-shop repairs, insurance, finance and H-Promise certified pre-owned vehicles. Each of these is its own customer journey, and each one needs to end in a lead.',
    ],
    challenge: [
      'Car buyers research online long before they visit a showroom. If a model page is slow or a test-drive form is clumsy, they simply book with the next dealer.',
      'The goal was a site that makes it easy to explore the whole line-up, from hatchbacks to EVs, and turn that interest into test-drive bookings and enquiries.',
    ],
    features: [
      { title: 'Full model catalogue', text: 'Every Hyundai model with pricing, filters by body type and fuel, and a clear path from browsing to booking.', note: 'hatchback to EV' },
      { title: 'Vehicle customiser', text: 'Colours, variants and options visitors can explore before they ever walk into a showroom.', note: 'try before you visit' },
      { title: 'Real-time test-drive booking', text: 'A quick booking flow that captures the right details and routes them to the right showroom.', note: 'the money button' },
      { title: 'Exchange, finance & insurance', text: 'Dedicated journeys for every service, each ending in a focused enquiry form.', note: 'every page = a lead' },
    ],
    approach: [
      'I built the catalogue and customiser as reusable React components fed by structured vehicle data, so new models can be added without new code.',
      'Tailwind kept the UI consistent across dozens of pages, and Redux kept the customiser’s state predictable.',
      'Every page was designed around one clear next step: book a test drive, get a valuation or talk to the team.',
    ],
    delivered: ['Responsive website', 'Model catalogue & filters', 'Vehicle customiser', 'Test-drive booking', 'Service & finance enquiry flows'],
    results: [],
  },
  {
    slug: 'kinara-capital',
    name: 'Kinara Capital',
    url: 'https://kinaracapital.com',
    domain: 'kinaracapital.com',
    industry: 'Fintech · MSME lending',
    location: 'India',
    role: 'Frontend development',
    stack: ['React', 'GSAP', 'Tailwind CSS'],
    line: 'Campaign pages and loan tools that make collateral-free business loans feel simple, for small businesses across India.',
    intro:
      'Kinara Capital provides collateral-free business loans to small and medium businesses in more than 100 cities across six Indian states. Their campaigns need to reach business owners who are busy, cautious and often new to digital lending.',
    context: [
      'Kinara offers loans for working capital, supply-chain finance, machinery and a dedicated programme for women entrepreneurs, with cumulative disbursements of over $1 billion.',
    ],
    challenge: [
      'Lending is built on trust. A campaign page has seconds to explain an offer, prove credibility and get a business owner to start an application.',
      'The pages had to load fast on mid-range phones, explain products clearly and make the numbers easy to understand.',
    ],
    features: [
      { title: 'Campaign landing pages', text: 'Focused, story-led pages for each loan product and campaign, with dynamic media.', note: 'one offer, one page' },
      { title: 'Loan & EMI calculators', text: 'Fast, interactive calculators that let owners see what a loan would mean for their business.', note: 'numbers people trust' },
      { title: 'Lead-generation forms', text: 'Short, optimised forms that turn interest into applications without friction.', note: 'fewer fields, more leads' },
      { title: 'Purposeful motion', text: 'GSAP animations that guide attention to the key message, without slowing the page down.', note: 'motion with a job' },
    ],
    approach: [
      'Each campaign followed the same structure: the problem, the offer, proof, then one clear call to action.',
      'Calculators ran entirely in the browser for instant feedback, and animations were kept on the GPU so they stayed smooth on low-end devices.',
    ],
    delivered: ['Campaign landing pages', 'Loan & EMI calculators', 'Lead-generation forms', 'Motion system'],
    results: [],
  },
  {
    slug: 'pristine-renault',
    name: 'Pristine Renault',
    url: 'https://pristinerenault.com',
    domain: 'pristinerenault.com',
    industry: 'Automotive dealership',
    location: 'Goa',
    role: 'Frontend development',
    stack: ['React', 'Figma to code', 'REST APIs'],
    line: 'Model discovery, price calculators and instant trade-in valuation for an authorised Renault dealer in Goa.',
    intro:
      'Pristine Renault is an authorised Renault dealer in Goa, selling and servicing models like the Kwid, Triber and Kiger. The website is where most of their customers start the journey.',
    context: [
      'Alongside sales, Pristine offers test drives at home or in the showroom, exchange with instant valuation, body-shop repairs, service, insurance and flexible finance.',
    ],
    challenge: [
      'Dealer websites often feel like brochures. Pristine needed a site that helps people compare models, understand real prices and act on it.',
      'The designs came from Figma, and they had to be translated pixel-for-pixel into a fast, responsive site connected to live data.',
    ],
    features: [
      { title: 'Catalogue & filtering', text: 'Quick comparisons across the Renault range by price, variant and fuel.', note: 'compare in seconds' },
      { title: 'Price calculator', text: 'Clear on-road pricing and finance estimates, so buyers know where they stand.', note: 'no hidden maths' },
      { title: 'Trade-in valuation', text: 'An exchange flow that captures vehicle details and gives buyers a reason to upgrade now.', note: 'old car → new car' },
      { title: 'Test drive at home', text: 'Booking for showroom or doorstep test drives, routed straight to the sales team.', note: 'Goa-wide' },
    ],
    approach: [
      'I translated the Figma designs into a component system with matching spacing and typography, so every page stays consistent.',
      'Vehicle and pricing data come from REST APIs, keeping the site accurate without manual updates.',
    ],
    delivered: ['Figma-to-code build', 'Model catalogue', 'Price & finance calculator', 'Trade-in workflow', 'Test-drive booking'],
    results: [],
  },
  {
    slug: 'design-esthetics',
    name: 'Design Esthetics',
    url: 'https://www.designesthetics.com',
    domain: 'designesthetics.com',
    industry: 'Digital agency',
    location: 'India',
    role: 'Frontend development',
    stack: ['React', 'Framer Motion', 'Custom CSS'],
    line: 'An agency website with smooth transitions, micro-interactions and case-study galleries that sell the work.',
    intro:
      'Design Esthetics has built websites, CRMs, WhatsApp automation and custom software for growing businesses since 2009. Their own website is their most important case study.',
    context: [
      'The agency works with businesses in healthcare, aviation, automotive, education and real estate. Its site has to show both craft and credibility to very different kinds of clients.',
    ],
    challenge: [
      'An agency site is judged twice: on what it says, and on how it feels. Any stutter or awkward transition undermines the pitch.',
      'The site needed rich motion and image-heavy galleries that still load quickly and work on every screen size.',
    ],
    features: [
      { title: 'Page transitions', text: 'Smooth, choreographed transitions between pages using Framer Motion.', note: 'feels like an app' },
      { title: 'Micro-interactions', text: 'Small, considered hover and scroll details that reward curiosity.', note: 'details = craft' },
      { title: 'Case-study galleries', text: 'Responsive galleries that let the agency’s projects do the talking.', note: 'show, don’t tell' },
      { title: 'Custom CSS system', text: 'A hand-written styling system with no heavy UI frameworks, built for speed and control.', note: 'no bloat' },
    ],
    approach: [
      'Motion was planned like choreography: every animation has a purpose and a timing curve that matches the brand.',
      'Galleries load images progressively and only animate what’s on screen, so the site stays responsive.',
    ],
    delivered: ['Agency website', 'Page transition system', 'Case-study galleries', 'Custom CSS architecture'],
    results: [],
  },
  {
    slug: 'pristine-isuzu',
    name: 'Pristine Isuzu',
    url: 'https://www.pristineisuzu.com',
    domain: 'pristineisuzu.com',
    industry: 'Commercial vehicles',
    location: 'Bangalore',
    role: 'Frontend development',
    stack: ['React', 'Bootstrap', 'API integrations'],
    line: 'Pickup and SUV discovery, a dealer locator and smart enquiry routing for an authorised Isuzu dealer in Bangalore.',
    intro:
      'Pristine Isuzu is an authorised Isuzu dealer in Bangalore for the D-Max, V-Cross, Hi-Lander, S-CAB and mu-X. Its buyers range from fleet operators to adventure-SUV owners.',
    context: [
      'Besides sales, the dealership offers test drives, exchange, body-shop repairs, finance and insurance, and each of those enquiries needs to reach the right person quickly.',
    ],
    challenge: [
      'Commercial-vehicle buyers ask very practical questions: payload, variants, price, where to see one. The site needed to answer those fast and route every enquiry correctly.',
    ],
    features: [
      { title: 'Model discovery', text: 'Clear pages for every pickup and SUV with variants, specs and pricing.', note: 'work truck → weekend SUV' },
      { title: 'Dealer locator', text: 'Maps and directions to showrooms and service centres across the city.', note: 'find us fast' },
      { title: 'Smart enquiry routing', text: 'Forms that send sales, service and finance enquiries to the right team automatically.', note: 'no lost leads' },
      { title: 'Service & finance journeys', text: 'Simple flows for test drives, exchange, insurance and finance.', note: 'one place for it all' },
    ],
    approach: [
      'I built a responsive layout on Bootstrap’s grid for speed of delivery, then customised it to match the brand.',
      'Enquiry forms were wired to the dealership’s systems through APIs, so leads arrive with the context the sales team needs.',
    ],
    delivered: ['Responsive website', 'Model pages', 'Dealer locator', 'Enquiry routing', 'Service & finance flows'],
    results: [],
  },
]
