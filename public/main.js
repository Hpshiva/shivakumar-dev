// GSAP Plugins Registration
    gsap.registerPlugin(
      ScrollTrigger,
      Flip,
      SplitText,
      ScrollToPlugin,
      ScrollSmoother,
      MotionPathPlugin,
      DrawSVGPlugin,
    );

// Smooth scroll hijack for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
          history.replaceState(null, null, " ");
        }
      });
    });

// Hover video preview controls
    (function () {
      // Folder where the transparent foreground videos live:
      var FG_BASE = "https://f1-assets.b-cdn.net/nesh-work/Portfolio%20Work/";

      var ua = navigator.userAgent;
      var isSafari =
        /^((?!chrome|chromium|crios|fxios|edg|opr|android).)*safari/i.test(
          ua,
        ) || /iP(ad|hone|od)/.test(ua);
      var canHover = window.matchMedia("(hover: hover)").matches;

      // Background MP4: full URL already in data-src
      function loadBg(v) {
        if (v.src || !v.dataset.src) return;
        v.src = v.dataset.src;
        v.load();
      }

      // Foreground transparent video: filename + FG_BASE. Safari → .mov, others → .webm
      function loadFg(v) {
        if (v.src) return;
        var file = isSafari && v.dataset.mov ? v.dataset.mov : v.dataset.webm;
        if (!file) return;
        v.src = FG_BASE + encodeURIComponent(file);
        v.load();
      }

      var cards = document.querySelectorAll(".work-card");

      // Desktop: foreground plays on hover, resets on leave.
      if (canHover) {
        cards.forEach(function (card) {
          var fg = card.querySelector(".work-video");
          if (!fg) return;
          card.addEventListener("mouseenter", function () {
            loadFg(fg);
            fg.play().catch(function () { });
          });
          card.addEventListener("mouseleave", function () {
            fg.pause();
            fg.currentTime = 0;
          });
        });
      }

      // Load + play only when a card is on screen.
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              var card = entry.target;
              var bg = card.querySelector(".work-bg");
              var fg = card.querySelector(".work-video");

              if (entry.isIntersecting) {
                if (bg) {
                  loadBg(bg);
                  bg.play().catch(function () { }); // background autoplays
                }
                if (fg) {
                  loadFg(fg); // warm up so hover is instant
                  if (!canHover) fg.play().catch(function () { }); // mobile: also autoplay
                }
              } else {
                if (bg) bg.pause();
                if (fg) fg.pause();
              }
            });
          },
          { rootMargin: "300px" },
        );

        cards.forEach(function (card) {
          io.observe(card);
        });
      }
    })();
