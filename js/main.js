(() => {
  const nav = document.querySelector("[data-nav]");
  const toggle = document.querySelector("[data-nav-toggle]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (typeof gsap === "undefined") return;

  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  const mm = gsap.matchMedia();

  mm.add(
    {
      motion: "(prefers-reduced-motion: no-preference)",
      reduce: "(prefers-reduced-motion: reduce)",
    },
    (context) => {
      const { reduce } = context.conditions;

      if (reduce) {
        gsap.set(
          [".hero-copy > *", ".hero-cast-art", ".module", ".panel", ".page-hero > *", "[data-reveal]", "[data-home-signal] > *"],
          { clearProps: "all" }
        );
        return;
      }

      document.documentElement.classList.add("has-motion");

      // Hero entrance — one choreographed moment
      const heroCopy = document.querySelector(".hero-copy");
      const heroArt = document.querySelector(".hero-cast-art");
      if (heroCopy) {
        const parts = heroCopy.querySelectorAll(":scope > *");
        const tl = gsap.timeline({
          defaults: { ease: "power2.out", duration: 0.55 },
        });
        if (heroArt) {
          tl.from(heroArt, { autoAlpha: 0, scale: 1.04, duration: 0.9, ease: "power1.out" }, 0);
        }
        tl.from(
          parts,
          { autoAlpha: 0, y: 18, stagger: 0.07, duration: 0.5, ease: "power2.out" },
          0.12
        );
      }

      // Inner page hero
      const pageHero = document.querySelector(".page-hero");
      if (pageHero) {
        gsap.from(pageHero.children, {
          autoAlpha: 0,
          y: 14,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
        });
      }

      // Opt-in scroll reveal only. Core content stays visible without JS and in full-page captures.
      const reveals = gsap.utils.toArray("[data-reveal]");
      reveals.forEach((el) => {
        gsap.from(el, {
          autoAlpha: 0,
          y: 16,
          duration: 0.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      });

      // Directory cards arrive as one orbital sequence instead of unrelated effects.
      gsap.utils.toArray("[data-reveal-group]").forEach((group) => {
        gsap.from(group.children, {
          autoAlpha: 0,
          y: 22,
          scale: 0.975,
          duration: 0.48,
          stagger: 0.055,
          ease: "power2.out",
          scrollTrigger: {
            trigger: group,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        });
      });

      const homeSignal = document.querySelector("[data-home-signal]");
      if (homeSignal) {
        const signalArt = homeSignal.querySelector(".home-signal-art");
        const signalCopy = homeSignal.querySelector(":scope > div:last-child");
        gsap.from([signalArt, signalCopy], {
          autoAlpha: 0,
          y: 20,
          duration: 0.55,
          stagger: 0.08,
          ease: "power2.out",
          scrollTrigger: { trigger: homeSignal, start: "top 86%", toggleActions: "play none none none" },
        });
        if (signalArt) {
          gsap.to(signalArt, {
            yPercent: -7,
            ease: "none",
            scrollTrigger: { trigger: homeSignal, start: "top bottom", end: "bottom top", scrub: 0.55 },
          });
        }
      }

      // Soft hover lift via GSAP quickTo for modules (pointer devices)
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        gsap.utils.toArray("a.module, .module").forEach((card) => {
          const yTo = gsap.quickTo(card, "y", { duration: 0.28, ease: "power2.out" });
          card.addEventListener("pointerenter", () => yTo(-4));
          card.addEventListener("pointerleave", () => yTo(0));
        });

        const hero = document.querySelector(".hero");
        const heroImage = hero?.querySelector(".hero-cast-art img");
        const heroMark = hero?.querySelector(".hero-mark");
        if (hero && heroImage && heroMark) {
          const imageX = gsap.quickTo(heroImage, "x", { duration: 0.6, ease: "power2.out" });
          const imageY = gsap.quickTo(heroImage, "y", { duration: 0.6, ease: "power2.out" });
          const markX = gsap.quickTo(heroMark, "x", { duration: 0.45, ease: "power2.out" });
          const markY = gsap.quickTo(heroMark, "y", { duration: 0.45, ease: "power2.out" });
          hero.addEventListener("pointermove", (event) => {
            const rect = hero.getBoundingClientRect();
            const nx = event.clientX / rect.width - 0.5;
            const ny = (event.clientY - rect.top) / rect.height - 0.5;
            imageX(nx * 9);
            imageY(ny * 7);
            markX(nx * -4);
            markY(ny * -3);
          });
          hero.addEventListener("pointerleave", () => {
            imageX(0); imageY(0); markX(0); markY(0);
          });
        }
      }

      return () => {
        document.documentElement.classList.remove("has-motion");
      };
    }
  );
})();
