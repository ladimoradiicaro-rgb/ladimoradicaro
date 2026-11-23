/* Site motion layer.
   - Lenis smooth scrolling (with header-aware anchor links and scroll lock for menu/lightbox)
   - Vanilla ports of React Bits patterns: BlurText, CountUp, AnimatedContent
   Everything degrades to the static page when JS is off or reduced motion is requested. */
(() => {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.classList.add("motion-ready");

  // The home opens on the logo: don't let the browser restore a mid-tour scroll position.
  if ("scrollRestoration" in history && !window.location.hash && document.querySelector("[data-tour-lead]")) {
    history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }

  /* ---------------- Lenis ---------------- */
  const headerOffset = () => {
    const pad = parseFloat(getComputedStyle(root).scrollPaddingTop);
    return Number.isFinite(pad) ? pad : 112;
  };

  if (window.Lenis && !reduceMotion) {
    const lenis = new window.Lenis({
      lerp: 0.075, // soft inertia: every scroll glides to a stop
      smoothWheel: true,
      wheelMultiplier: 0.9,
      syncTouch: true, // phones get the same gliding feel as the wheel
      syncTouchLerp: 0.08,
      touchInertiaMultiplier: 28,
      touchMultiplier: 1.1,
    });
    window.lenis = lenis;

    const raf = (time) => {
      lenis.raf(time);
      window.requestAnimationFrame(raf);
    };
    window.requestAnimationFrame(raf);

    // Pause smooth scroll while the mobile menu or the photo lightbox is open.
    const syncLock = () => {
      const locked = document.body.classList.contains("menu-open") || document.body.classList.contains("lightbox-open");
      if (locked) lenis.stop();
      else lenis.start();
    };
    new MutationObserver(syncLock).observe(document.body, { attributes: true, attributeFilter: ["class"] });

    // In-page anchors: glide to the section and respect the floating header.
    document.addEventListener("click", (event) => {
      const link = event.target.closest('a[href^="#"]');
      if (!link || event.defaultPrevented) return;
      const hash = link.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      // The menu closes in this same click; resume before scrolling so start() can't cancel it.
      syncLock();
      lenis.scrollTo(target, { offset: -headerOffset(), duration: 1.3, force: true });
      history.pushState(null, "", hash);
    });

    // Arriving from another page with a #hash: settle on the section with the right offset.
    if (window.location.hash.length > 1) {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) window.addEventListener("load", () => lenis.scrollTo(target, { offset: -headerOffset(), immediate: true, force: true }));
    }
  }

  if (reduceMotion) return;

  /* ---------------- BlurText (React Bits) ----------------
     Splits a heading into words that blur/lift in when it enters the viewport.
     Headings are re-split after a language switch replaces their text. */
  const blurTargets = Array.from(document.querySelectorAll("main h2, .scopri-hero h1"))
    .filter((el) => !el.closest(".tour-stage") && !el.closest(".visually-hidden"));

  const splitWords = (el, alreadyIn) => {
    if (el.children.length && !el.querySelector(":scope > .bt-word")) return; // keep rich markup intact
    const text = el.textContent.trim().replace(/\s+/g, " ");
    if (!text) return;
    el.textContent = "";
    text.split(" ").forEach((word, i, words) => {
      const span = document.createElement("span");
      span.className = "bt-word";
      span.style.setProperty("--i", String(i));
      span.textContent = word;
      el.appendChild(span);
      if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
    el.classList.add("bt");
    el.classList.toggle("is-in", Boolean(alreadyIn));
  };

  const blurObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      blurObserver.unobserve(entry.target);
    });
  }, { threshold: 0.35, rootMargin: "0px 0px -8% 0px" });

  const textObserver = new MutationObserver((mutations) => {
    const touched = new Set(mutations.map((m) => m.target));
    textObserver.disconnect();
    touched.forEach((el) => {
      if (!(el instanceof HTMLElement) || !blurTargets.includes(el)) return;
      if (el.querySelector(":scope > .bt-word")) return; // our own split, nothing to do
      splitWords(el, true);
    });
    blurTargets.forEach((el) => textObserver.observe(el, { childList: true }));
  });

  blurTargets.forEach((el) => {
    splitWords(el, false);
    blurObserver.observe(el);
    textObserver.observe(el, { childList: true });
  });

  /* ---------------- CountUp (React Bits) ---------------- */
  const countTargets = Array.from(document.querySelectorAll(".arrival-grid b, [data-count-up]"));
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const el = entry.target;
      const match = el.textContent.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/s);
      if (!match) return;
      const [, before, number, after] = match;
      const to = parseFloat(number.replace(",", "."));
      const decimals = (number.split(/[.,]/)[1] || "").length;
      const start = performance.now();
      const duration = 1400;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 4);
        el.textContent = `${before}${(to * eased).toFixed(decimals)}${after}`;
        if (t < 1) window.requestAnimationFrame(tick);
      };
      window.requestAnimationFrame(tick);
    });
  }, { threshold: 0.6 });
  countTargets.forEach((el) => countObserver.observe(el));

  /* ---------------- AnimatedContent (React Bits) ----------------
     Cards rise and fade in, staggered within their group. */
  const groups = [
    ".homes-grid > *",
    ".services-grid > *",
    ".location-section .map-panel, .location-section .route-card, .location-section .timeline > *",
    ".faq-list > *",
    ".booking-section form, .booking-section aside",
    ".guide-summary-card, .concierge-card, .guide-list-panel, .guide-route-panel, .guide-final-card",
  ];
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  groups.forEach((selector) => {
    const items = Array.from(document.querySelectorAll(selector));
    items.forEach((item, i) => {
      if (item.closest(".tour-stage") || item.classList.contains("ac")) return;
      item.classList.add("ac");
      item.style.setProperty("--ac-delay", `${(i % 4) * 90}ms`);
      revealObserver.observe(item);
    });
  });

  // SpotlightCard and Magnet were removed in the polish pass: decorative motion that
  // competed with the photos. Hover feedback is now a quiet colour/border change (polish.css).
})();
