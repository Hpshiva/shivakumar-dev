window.WEBSITE_DATA = {
  // Hero Section Configuration
  hero: {
    titleLine1: "Webflow,",
    titleLine2: "Applied",
    titleLine3: "Differently.",
    introTextLeft: "The Webflow Expert.\nThat's Nenad.",
    introTextRight: "Working closely with your team to deliver\nWebflow builds that merge creativity, technical\nexcellence, and long-term value.",
    portraitUrl: './src/assets/myPic.png',

    // Stats (counter numbers and label)
    projectsCount: "80", // Will animate counting up to this
    projectsLabel: "Projects",
    experienceYears: "7", // Will animate counting up to this
    experienceLabel: "experience",

    // CTAs
    ctaTextPrimary: "Book a Call",
    ctaUrlPrimary: "https://cal.com/nenad-popadic/intro-call",
    ctaTextSecondary: "About Me",
    ctaUrlSecondary: "#about"
  },

  // About / Journey Section Configuration
  about: {
    heading: "About Me (&)\nMy Journey",
    description: "Seven years ago I opened Webflow for the first time. What happened after that is easier to show than explain.",

    milestones: [
      {
        year: "'19",
        title: "Starting out with my brother",
        text: "My brother Stefan showed me Webflow. I bothered him with questions for three months straight. He probably regrets it.",
        handle: "@stefan",
        time: "7years ago",
        popupYear: "2019",
        popupText: "My brother Stefan, a UX designer, opened Webflow and created something right in front of me. I had no idea what I was doing but I couldn't close the laptop. No master plan, no career goal. Just a guy who found something and couldn't let go. Three months of late nights and annoying my brother with questions later, I knew this was it."
      },
      {
        year: "'20",
        title: "First freelance steps",
        text: "First real client. First real panic. Working for yourself and working for someone else are completely different.",
        handle: "@webflow",
        time: "6years ago",
        popupYear: "2020",
        popupText: "Practicing on my own was comfortable. Then someone trusted me with their project and suddenly every pixel mattered in a way it didn't before. That first year of client work taught me more than six months of practice ever did. Not because the projects were complex but because someone was counting on me to get it right."
      },
      {
        year: "'21",
        title: "Beyond what I knew",
        text: "A biotech project that made me think this isn't possible in Webflow. Turns out it was.",
        handle: "@fiftyseven",
        time: "5years ago",
        popupYear: "2021",
        popupText: "When FIFTYSEVEN sent me the brief for Roswell Biotech, my first thought was honestly this can't be done in Webflow. The design demanded pixel-perfect execution, the functionality was complex, and I had to teach myself JavaScript mid-project to make it work. Scariest project I ever took on. Also the one that changed how I approach everything after it."
      },
      {
        year: "'22",
        title: "Leveling up",
        text: "The year animations and CMS stopped being extras and started shaping how every project feels.",
        handle: "@gsap",
        time: "4years ago",
        popupYear: "2022",
        popupText: "GSAP went from something I used occasionally to something that shaped every project. Animations weren't decoration anymore, they were part of how a site communicates. On the CMS side I kept finding cleaner and smarter ways to structure content, setups that made managing a site effortless for clients. Everything I worked on this year started feeling more intentional."
      },
      {
        year: "'23",
        title: "From trust to referrals",
        text: "No pitch. No portfolio review. Just clients telling people 'work with Nenad.' That hit different.",
        handle: "@clients",
        time: "3years ago",
        popupYear: "2023",
        popupText: "Clients I'd worked with came back with new projects. Some recommended me to people I'd never met. No interview, no portfolio walkthrough, just 'work with Nenad, he delivers.' That kind of trust isn't something you can put in a case study. But it's the thing I'm most proud of."
      },
      {
        year: "'24",
        title: "A life-changing year",
        text: "I got married. My daughter Djina was born. Suddenly everything I do has a deeper reason behind it.",
        handle: "@family",
        time: "2years ago",
        popupYear: "2024",
        popupText: "Before this year I thought I understood what motivation meant. I had no idea. Nothing makes you sharper at work than knowing exactly who you're coming home to. Djina changed how I see everything, not just life, but how I show up for every single thing I do."
      },
      {
        year: "'26",
        title: "The journey continues",
        text: "Seven years in. Still obsessed. Now figuring out how AI fits into what I do.",
        handle: "@nenad",
        time: "2hours ago",
        popupYear: "2026",
        popupText: "The industry doesn't stand still and neither do I. After seven years of working, learning, and evolving, AI has opened up a whole new layer of what's possible. Same obsession, new tools. The best work is still ahead."
      }
    ]
  },

  // What You Get (Capabilities Overview) Section
  capabilities: {
    heading: "What\nYou Get?",
    subText: "Strategy, precision, and development combined - turning your vision into a powerful digital experience that feels effortless.",
    items: [
      {
        title: "Webflow Development",
        description: "Fast, scalable websites with clean structure and a CMS setup that puts you in full control."
      },
      {
        title: "Custom Integrations",
        description: "Expanding Webflow's capabilities with APIs, third-party tools, and tailored functionality."
      },
      {
        title: "SEO-Ready Setup",
        description: "Optimized site structure, speed, and on-page SEO to help your website rank higher and stay visible."
      },
      {
        title: "Creative & Interactive Motion",
        description: "Smooth animations and engaging user experiences powered by GSAP and custom interactions."
      },
      {
        title: "Performance & Technical Optimization",
        description: "Making your site faster, cleaner, and built to last with technical SEO and performance best practices."
      }
    ]
  },

  // Selected Work / Projects Configuration (All 9 Projects)
  projects: [
    {
      id: "01",
      title: "1910.ai",
      description: "A computational platform for drug discovery - design, simulate and optimize molecules at speed.",
      image: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693c6dc8e57f823bcb23eb4a_Client%20-%201910%20(Background).avif",
      tags: ["GSAP", "Three.js", "Performance"],
      link: "https://1910.ai/",
      videoBg: "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/1910-bg.webm",
      videoFgWebm: "1910.webm",
      videoFgMov: "1910-Transparent.mov"
    },
    {
      id: "02",
      title: "SemiconBio",
      description: "Platform combining semiconductor technology with biology to accelerate research and diagnostics.",
      image: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b4612f78cbd2eb83c3_Client%20-%20SemiconBio%20(Background).avif",
      tags: ["CMS", "GSAP", "Custom Code"],
      link: "https://semiconbio.com/",
      videoBg: "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/semicon-bg.webm",
      videoFgWebm: "semicon.webm",
      videoFgMov: "SemiconBio-Transparent.mov"
    },
    {
      id: "03",
      title: "Happy Ring",
      description: "With accuracy validated to strict standards and all-day comfort exceeding expectations.",
      image: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/694c7eb5236499ef6cefb635_Frame%201321314818.avif",
      tags: ["Interactions", "E-Commerce", "GSAP"],
      link: "https://www.happyring.com/",
      videoBg: "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/happyring-bg.webm",
      videoFgWebm: "Happy-Ring-Optimised.webm",
      videoFgMov: "Happy-Ring-Optimised.mov"
    },
    {
      id: "04",
      title: "PSSLTD",
      description: "With asset and inspection management purpose-built alongside UK councils for over 35 years, and a record every audit can stand behind.",
      image: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b45d5bf5df6ed763ff_Frame%20116046247.avif",
      tags: ["CMS", "GSAP", "Localization"],
      link: "https://pssltd.co.uk/",
      videoBg: "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/pss-bg.webm",
      videoFgWebm: "pss.webm",
      videoFgMov: "Client - PSSLTD-1.mov"
    },
    {
      id: "05",
      title: "Lilipad",
      description: "With libraries that come to children where they are, and a quiet place to belong when stability of any kind is rare.",
      image: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b45d5bf5df6ed763ff_Frame%20116046247.avif",
      tags: ["CMS", "GSAP", "SEO"],
      link: "https://www.lilipadlibrary.org/",
      videoBg: "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/lilipad-bg-optimised.webm",
      videoFgWebm: "lilipad-optimised.webm",
      videoFgMov: "Client - Lilipad_1-1.mov"
    },
    {
      id: "06",
      title: "Omicron",
      description: "Secure digital storage solutions built on next-gen decentralized blockchain technology.",
      image: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b4c7536983db8aa94b_Frame%20116046243.avif",
      tags: ["Blockchain", "GSAP", "Localization"],
      link: "https://omicronblockchain.com/",
      videoBg: "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/omicron-bg.webm",
      videoFgWebm: "omicron.webm",
      videoFgMov: "Client - Omicron-1.mov"
    },
    {
      id: "07",
      title: "Puck",
      description: "Inbound talent solution with personal automation - from podcasts to smarter screening.",
      image: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693fbeceeaae3de6028ef727_Frame%20116046252.avif",
      tags: ["Components", "CMS", "GSAP"],
      link: "https://www.usepuck.com/",
      videoBg: "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/puck-bg.webm",
      videoFgWebm: "puck.webm",
      videoFgMov: "Client - Puck-1.mov"
    },
    {
      id: "08",
      title: "Alosant",
      description: "The leading resident experience platform, elevates living by keeping residents and shoppers informed.",
      image: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b48a5e0c4375823c97_Frame%20116046251.avif",
      tags: ["Performance", "CMS", "API"],
      link: "https://www.alosant.com/",
      videoBg: "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/alosant-bg.webm",
      videoFgWebm: "alosant.webm",
      videoFgMov: "Client - Alosant-1.mov"
    },
    {
      id: "09",
      title: "RAY AI",
      description: "With a full-time human assistant handpicked from the top 0.03% of applicants, and the AI fluency to give you your time and energy back.",
      image: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/693a07b45d5bf5df6ed763ff_Frame%20116046247.avif",
      tags: ["CMS", "GSAP", "Performance"],
      link: "https://getray.ai/",
      videoBg: "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/rayai-bg.webm",
      videoFgWebm: "rayai.webm",
      videoFgMov: "Client - GetRay AI-1.mov"
    }
  ],

  // Services Configuration
  services: {
    heading: "Solutions\nThat Deliver",
    subText: "Same quality, same attention to detail. The only difference is the size of the project and what you need right now.",
    cards: [
      {
        title: "Ongoing Support",
        price: "$3,000",
        period: "/ 30hours",
        desc: "Your dedicated Webflow developer, 30 hours a month. Whatever your site needs, handled. Minimum 3 month commitment.",
        bullets: [
          "New pages, sections, and features",
          "Campaign-driven updates (modules, content blocks, assets)",
          "Maintenance, bug fixes, and content updates",
          "Technical SEO and performance optimization",
          "Unused hours roll over (up to 3 months)"
        ],
        footerText: "For brands that need continuous growth and long-term collaboration."
      },
      {
        title: "Starter Build",
        price: "$5,000",
        period: "",
        desc: "A clean Webflow site ready to launch in one to two weeks. Perfect for brands that need a solid online presence without the complexity.",
        bullets: [
          "Up to 6 pages",
          "CMS setup",
          "Mid-level animations and interactions",
          "Technical SEO setup",
          "Launch within one to two weeks",
          "Webflow Editor training after launch"
        ],
        footerText: "For new sites or migrations that need a fast, clean start"
      },
      {
        title: "Custom Project",
        price: "Book a Call",
        period: "",
        desc: "High-end Webflow development for complex projects. Every scope is different, so every project starts with a conversation.",
        bullets: [
          "Advanced interaction and animation systems",
          "Scalable CMS architecture with multi-collection setups",
          "Complex layouts, modular components and dynamic content",
          "Integration ready structure for external tools and API driven features",
          "14 days post-launch support included"
        ],
        footerText: "For complex projects that go beyond the basics and need a tailored approach."
      }
    ]
  },

  // Testimonials Configuration (Up to 8 Testimonials in original)
  testimonials: [
    {
      heading: "Trusted long-term collaborator.",
      text: "Nenad has been a fantastic partner to work with and continues to be an essential part of our team. He communicates clearly and promptly, and his work consistently exceeds expectations. He resolves technical challenges quickly and efficiently, always demonstrating skill, reliability, and a strong commitment to quality.",
      author: "Danette Beal",
      role: "VP of Marketing",
      agency: "Alosant.com",
      link: "https://www.alosant.com/",
      avatarUrl: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/694ea7da98bd68220e4f1d95_Danette%20Beal.avif"
    },
    {
      heading: "Thinks through the entire experience.",
      text: "Nenad doesn't just code Webflow—he thinks through the experience. Motion, pacing, narrative flow: all aligned with technical excellence. The result is sites that feel cohesive, intentional, complete. A true partner in execution. No gaps, no compromises.",
      author: "Petar Stojakovic",
      role: "Founder",
      agency: "fiftyseven.co",
      link: "https://www.fiftyseven.co/",
      avatarUrl: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/6985e810b5401268eec901f2_petar_s.jpeg"
    },
    {
      heading: "Reliable, skilled, and easy to work with.",
      text: "Nenad was great to work with! He delivered our websites on time, gave our design team helpful guidance, and suggested smarter solutions that really improved the final results. Super reliable and easy to collaborate with — highly recommend!",
      author: "Klemen Vute",
      role: "PM from Povio",
      agency: "Povio.com",
      link: "https://povio.com/",
      avatarUrl: "https://cdn.prod.website-files.com/691d7c9f14d0280ebe2d4108/694ea7da275434728f43945b_Klemen%20Vute.avif"
    }
  ],

  // FAQ Configuration
  faqs: [
    {
      question: "Why Webflow instead of custom code?",
      answer: "Webflow gives you the best of both worlds. A platform your team can manage after launch, with the flexibility to build things that feel fully custom. I extend it with custom code and integrations so the result looks and performs like a fully coded site without needing a developer for every small change. For most businesses, that balance of control and independence is exactly what makes it worth it."
    },
    {
      question: "Already have a Webflow site that needs work?",
      answer: "That's a big part of what I do. Whether your site needs a structural cleanup, better performance, new sections, or a CMS overhaul, I can step in and improve what's already there. I'll audit what you have, identify what's holding it back, and build a clear plan to get it where it should be. You don't need to start from scratch to get a site that feels fast, clean, and easy to manage."
    },
    {
      question: "What’s the process from start to launch?",
      answer: "It starts with a conversation about your goals, timeline, and what success looks like. From there I put together a clear scope and plan. Once we align, I build in stages and share progress as I go so nothing drifts and feedback stays easy. The goal is always a smooth handoff with a site you actually know how to use."
    },
    {
      question: "Do you work under NDA?",
      answer: "Yes. I've worked on projects that required strict confidentiality, from pre-launch products to internal tools, and I treat every client's work with the same level of discretion. I'm happy to sign an NDA before we even start talking details. Trust is a big part of why clients keep coming back, and that extends to how I handle sensitive information."
    }
  ],

  // Contact / General Footer Info Configuration
  contact: {
    email: "nenad@popadic.co",
    bookCallUrl: "https://cal.com/nenad-popadic/intro-call"
  }
};
