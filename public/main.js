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

    /* ============================================
       CONNECTION FLOW WIDGET LOGIC
       ============================================ */
    (function () {
      function initConnectionFlow() {
        const techNodes = document.querySelectorAll(".tech-node");
        if (!techNodes.length) return;

        techNodes.forEach(function (node) {
          const pathId = "path-" + node.dataset.path;
          const dotId = "dot-" + node.dataset.path;
          const targetId = "node-" + node.dataset.target;

          const pathEl = document.getElementById(pathId);
          const dotEl = document.getElementById(dotId);
          const targetEl = document.getElementById(targetId);

          let tween = null;

          // Desktop Hover Animations
          node.addEventListener("mouseenter", function () {
            if (pathEl) pathEl.classList.add("active");
            if (targetEl) targetEl.classList.add("highlight");

            if (dotEl && pathEl) {
              dotEl.style.display = "block";
              gsap.set(dotEl, { x: 0, y: 0 });
              
              if (tween) tween.kill();
              tween = gsap.to(dotEl, {
                duration: 1.6,
                repeat: -1,
                ease: "power1.inOut",
                motionPath: {
                  path: pathEl,
                  autoRotate: false
                }
              });
            }
          });

          node.addEventListener("mouseleave", function () {
            if (pathEl) pathEl.classList.remove("active");
            if (targetEl) targetEl.classList.remove("highlight");
            if (dotEl) dotEl.style.display = "none";
            if (tween) {
              tween.kill();
              tween = null;
            }
          });

          // Mobile Tap Interactions
          node.addEventListener("click", function (e) {
            const isTouch = window.matchMedia("(pointer: coarse)").matches;
            if (isTouch) {
              e.preventDefault();
              if (pathEl) pathEl.classList.add("active");
              if (targetEl) targetEl.classList.add("highlight");

              if (dotEl && pathEl) {
                dotEl.style.display = "block";
                gsap.set(dotEl, { x: 0, y: 0 });
                
                gsap.to(dotEl, {
                  duration: 0.8,
                  ease: "power2.out",
                  motionPath: {
                    path: pathEl
                  },
                  onComplete: function () {
                    // Trigger link
                    if (node.dataset.target === "wa") {
                      window.open("https://wa.me/916283937782?text=Hello!%20I%20saw%20your%20website%20and%20would%20love%20to%20build%20something%20amazing%20together.", "_blank");
                    } else {
                      window.location.href = "mailto:shivakumar.bfgi@gmail.com";
                    }

                    // Reset states after navigation delay
                    setTimeout(function () {
                      if (pathEl) pathEl.classList.remove("active");
                      if (targetEl) targetEl.classList.remove("highlight");
                      dotEl.style.display = "none";
                    }, 500);
                  }
                });
              }
            }
          });
        });
      }

      document.addEventListener("DOMContentLoaded", function () {
        initConnectionFlow();
      });

      // Fallback if readyState is already loaded
      if (document.readyState === "complete" || document.readyState === "interactive") {
        initConnectionFlow();
      }
    })();
