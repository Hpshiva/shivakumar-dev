window.loadWebsiteData = () => {
  const data = window.WEBSITE_DATA;
  if (!data) return;

  // Helper functions
  const updateHTML = (selector, html) => {
    const el = document.querySelector(selector);
    if (el) el.innerHTML = html;
  };

  const updateText = (selector, text) => {
    const el = document.querySelector(selector);
    if (el) el.textContent = text;
  };

  // 1. HERO & GENERAL
  if (data.hero) {
    updateHTML(".hero-heading", `${data.hero.titleLine1} <br />${data.hero.titleLine2} <br />${data.hero.titleLine3}`);
    updateHTML(".hero-left-text", data.hero.introTextLeft.replace(/\n/g, "<br />"));
    updateHTML(".hero-right-text", data.hero.introTextRight.replace(/\n/g, "<br />"));
    updateHTML(".nav-top-text", data.hero.introTextRight.replace(/\n/g, "<br />"));

    // Profile images (sidebar & mobile)
    document.querySelectorAll(".hero-profile-img").forEach(img => {
      img.src = data.hero.portraitUrl;
      img.removeAttribute("srcset");
    });

    // Sidebar Stats Card Text
    updateHTML(".nav-webflow-text", `${data.hero.projectsCount}+<br />${data.hero.projectsLabel}`);
    updateHTML(".nav-experience-text", `${data.hero.experienceLabel}`);

    // Update data-number-count for counter animations
    document.querySelectorAll("[data-number-count]").forEach(el => {
      if (el.closest(".about-card") || el.closest(".about-card-year")) return;
      
      const isProjects = el.closest("#stats_projects") || el.closest(".hero-card-2");
      if (isProjects) {
        el.setAttribute("data-number-count", data.hero.projectsCount);
        el.textContent = data.hero.projectsCount;
      } else if (data.hero.experienceYears) {
        el.setAttribute("data-number-count", data.hero.experienceYears);
        el.textContent = data.hero.experienceYears;
      }
    });

    // CTAs Setup
    const setupLink = (selector, text, url) => {
      const els = document.querySelectorAll(selector);
      els.forEach(el => {
        const textNode = el.querySelector(".button-text") || el;
        if (text && textNode !== el) textNode.textContent = text;

        el.style.cursor = "pointer";
        el.onclick = (e) => {
          e.preventDefault();
          if (url.startsWith("#")) {
            const target = document.querySelector(url);
            if (target) target.scrollIntoView({ behavior: "smooth" });
          } else {
            window.open(url, "_blank");
          }
        };
      });
    };

    setupLink(".hero-cta-button", data.hero.ctaTextPrimary, data.hero.ctaUrlPrimary);
    setupLink(".nav-button-mobile", data.hero.ctaTextPrimary, data.hero.ctaUrlPrimary);
    setupLink(".nav-button", data.hero.ctaTextPrimary, data.hero.ctaUrlPrimary);

    setupLink(".hero-button", data.hero.ctaTextSecondary, data.hero.ctaUrlSecondary);
    setupLink(".nav-button-secondary", data.hero.ctaTextSecondary, data.hero.ctaUrlSecondary);
  }

  // 2. ABOUT & MILESTONES
  if (data.about) {
    updateHTML("#about .h2-style", data.about.heading.replace(/\n/g, "<br />"));
    updateText("#about p.max-width-389", data.about.description);

    if (data.about.milestones) {
      const aboutCards = document.querySelectorAll(".about-card-wrap");
      aboutCards.forEach((cardWrap, index) => {
        const ms = data.about.milestones[index];
        if (!ms) return;

        // Year (e.g. '19 or '22)
        const yearEl = cardWrap.querySelector(".about-card-year span") || cardWrap.querySelector(".about-card-year");
        if (yearEl) {
          if (yearEl.hasAttribute("data-number-count")) {
            const cleanYearDigit = ms.year.replace(/['’]/g, "");
            yearEl.setAttribute("data-number-count", cleanYearDigit);
            yearEl.textContent = cleanYearDigit;
          } else {
            yearEl.textContent = ms.year;
          }
        }

        // Title
        const titleEl = cardWrap.querySelector(".about-card-heading");
        if (titleEl) titleEl.textContent = ms.title;

        // Short text
        const descEl = cardWrap.querySelector(".op80");
        if (descEl) descEl.textContent = ms.text;

        // Handle & time bottom layout
        const bottomText = cardWrap.querySelector(".about-card-bottom-text");
        if (bottomText) {
          bottomText.innerHTML = `${ms.handle}<br />${ms.time}`;
        }

        // Popup details
        const popupWrap = cardWrap.querySelector(".popup-card-wrap");
        if (popupWrap) {
          const popupYear = popupWrap.querySelector(".popup-card-top-item div:first-child");
          if (popupYear && ms.popupYear) popupYear.textContent = ms.popupYear;

          const popupHeading = popupWrap.querySelector(".popup-heading");
          if (popupHeading) popupHeading.innerHTML = ms.title.replace(/\s&\s/g, " & <br />");

          const popupDesc = popupWrap.querySelector(".popup-card-bottom-item p") || popupWrap.querySelector(".popup-card-bottom-item div p");
          if (popupDesc) popupDesc.innerHTML = ms.popupText || ms.text;
        }
      });
    }
  }

  // 3. CAPABILITIES / WHAT YOU GET
  if (data.capabilities) {
    updateHTML("#overview .h2-style", data.capabilities.heading.replace(/\n/g, "<br />"));
    updateText("#overview p.what_you_get-text", data.capabilities.subText);
    updateText("#overview p.what_you_get-text-mobile", data.capabilities.subText);

    if (data.capabilities.items) {
      const cards = document.querySelectorAll("#overview .capa-card");
      data.capabilities.items.forEach((item, index) => {
        const card = cards[index];
        if (!card) return;

        const heading = card.querySelector(".capa-card-heading");
        if (heading) heading.textContent = item.title;

        const desc = card.querySelector(".capa-card-text");
        if (desc) desc.textContent = item.description;
      });
    }
  }

  // 4. SELECTED WORK / PROJECTS
  if (data.projects) {
    const workCards = document.querySelectorAll(".work-card");
    data.projects.forEach((proj, index) => {
      const card = workCards[index];
      if (!card) return;

      // Update link href
      card.href = proj.link;

      // Heading
      const heading = card.querySelector(".work-card-heading");
      if (heading) heading.textContent = proj.title;

      // Description
      const desc = card.querySelector(".op80");
      if (desc) desc.textContent = proj.description;

      // Labels/Tags
      const labels = card.querySelectorAll(".work-label");
      if (proj.tags && labels.length > 0) {
        let tagIndex = 0;
        labels.forEach(label => {
          if (/^\d+$/.test(label.textContent.trim())) {
            label.textContent = proj.id || `0${index + 1}`;
          } else if (proj.tags[tagIndex]) {
            label.textContent = proj.tags[tagIndex];
            tagIndex++;
          }
        });
      }

      // Background video & hover video source (transparent overlays)
      const bgVideo = card.querySelector(".work-bg");
      if (bgVideo) {
        if (proj.videoBg) {
          bgVideo.setAttribute("data-src", proj.videoBg);
        } else {
          bgVideo.removeAttribute("data-src");
        }
        if (proj.image) {
          bgVideo.setAttribute("poster", proj.image);
        }
      }
      
      const fgVideo = card.querySelector(".work-video");
      if (fgVideo) {
        if (proj.videoFgWebm) {
          fgVideo.setAttribute("data-webm", proj.videoFgWebm);
        } else {
          fgVideo.removeAttribute("data-webm");
        }
        if (proj.videoFgMov) {
          fgVideo.setAttribute("data-mov", proj.videoFgMov);
        } else {
          fgVideo.removeAttribute("data-mov");
        }
        if (proj.image) {
          fgVideo.setAttribute("poster", proj.image);
        }
      }

      // Main static image src
      const staticImg = card.querySelector(".work-image");
      if (staticImg && proj.image) {
        staticImg.src = proj.image;
        staticImg.removeAttribute("srcset");
        // Ensure object-fit is cover for the static image so it looks like the poster
        staticImg.style.objectFit = "cover";
      }
    });
  }

  // 5. SERVICES
  if (data.services) {
    updateHTML("#services .h2-style", data.services.heading.replace(/\n/g, "<br />"));
    updateText("#services p.max-width-389", data.services.subText);

    if (data.services.cards) {
      const cards = document.querySelectorAll("#services .service-card");
      data.services.cards.forEach((cardData, index) => {
        const card = cards[index];
        if (!card) return;

        // Title
        const title = card.querySelector(".service-card-heading");
        if (title) title.textContent = cardData.title;

        // Price
        const price = card.querySelector(".service-price-item p");
        if (price) price.textContent = cardData.price;

        // Period
        const period = card.querySelector(".services-hours-text");
        if (period) period.textContent = cardData.period;

        // Description
        const desc = card.querySelector(".service-price-item + p");
        if (desc) desc.textContent = cardData.desc;

        // Bullets list
        const bullets = card.querySelectorAll(".service-list-item p");
        if (cardData.bullets && bullets.length > 0) {
          bullets.forEach((bullet, bIndex) => {
            if (cardData.bullets[bIndex]) bullet.textContent = cardData.bullets[bIndex];
          });
        }

        // Footer Text
        const footer = card.querySelector(".service-bottom-content p");
        if (footer) footer.textContent = cardData.footerText;
      });
    }
  }

  // 6. TESTIMONIALS
  if (data.testimonials) {
    const items = document.querySelectorAll(".swiper-slide");
    data.testimonials.forEach((test, index) => {
      const card = items[index];
      if (!card) return;

      // Heading
      const heading = card.querySelector(".swiper-heading");
      if (heading) heading.textContent = test.heading;

      // Text
      const text = card.querySelector(".swiper-card-top > p");
      if (text) text.textContent = test.text;

      // Author Info
      const author = card.querySelector(".client-info .text-weight-medium");
      if (author) author.textContent = test.author;

      const role = card.querySelector(".client-info .client-text-small");
      if (role) role.textContent = test.role;

      const link = card.querySelector(".client-info .client-text-link");
      if (link) {
        link.textContent = test.agency;
        link.href = test.link;
      }

      const avatar = card.querySelector(".client-img");
      if (avatar && test.avatarUrl) {
        avatar.src = test.avatarUrl;
        avatar.removeAttribute("srcset");
      }
    });
  }

  // 7. FAQS
  if (data.faqs) {
    const faqItems = document.querySelectorAll(".faq");
    data.faqs.forEach((faq, index) => {
      const item = faqItems[index];
      if (!item) return;

      const question = item.querySelector(".faq-heading");
      if (question) question.textContent = faq.question;

      const answer = item.querySelector(".faq-answer-item p");
      if (answer) answer.textContent = faq.answer;
    });
  }

  // 8. CONTACT INFO
  if (data.contact) {
    // Email Text
    updateText(".email-text", data.contact.email);

    // Update all mailto links
    document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
      link.href = `mailto:${data.contact.email}`;
      if (link.textContent.includes("@")) {
        link.textContent = data.contact.email;
      }
    });

    // Update book a call URLs
    document.querySelectorAll('a[href*="cal.com"]').forEach(link => {
      link.href = data.contact.bookCallUrl;
    });
  }

  // 9. CONTACT FORM HANDLER
  const contactForm = document.getElementById("contact-form");
  const successMsg = document.getElementById("contact-success-msg");
  if (contactForm && successMsg) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      console.log("Contact Form Submitted:", Object.fromEntries(formData.entries()));
      
      // Hide form and show success message
      contactForm.style.display = "none";
      successMsg.style.display = "flex";
    });
  }
};
document.addEventListener("DOMContentLoaded", window.loadWebsiteData);
