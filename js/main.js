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
          [".hero-copy > *", ".hero-cast-art", ".module", ".panel", ".page-hero > *", "[data-reveal]"],
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

      // Scroll reveal — each card once (avoid nested .modules + .stack double-binding)
      const cards = gsap.utils.toArray(".module, .panel, [data-reveal]");
      cards.forEach((el) => {
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

      gsap.utils.toArray(".section-head").forEach((head) => {
        gsap.from(head, {
          autoAlpha: 0,
          y: 10,
          duration: 0.35,
          ease: "power1.out",
          scrollTrigger: {
            trigger: head,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        });
      });

      // Soft hover lift via GSAP quickTo for modules (pointer devices)
      if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        gsap.utils.toArray("a.module, .module").forEach((card) => {
          const yTo = gsap.quickTo(card, "y", { duration: 0.28, ease: "power2.out" });
          card.addEventListener("pointerenter", () => yTo(-4));
          card.addEventListener("pointerleave", () => yTo(0));
        });
      }

      return () => {
        document.documentElement.classList.remove("has-motion");
      };
    }
  );
})();
