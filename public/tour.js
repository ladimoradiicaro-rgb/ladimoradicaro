/* Scroll-driven walkthrough.
   Each [data-tour] is a tall track with a full-screen sticky stage holding a
   sequence of photos (frames) grouped into rooms (data-room).
   Scrolling stacks the photos like cards: each one holds for a moment, then the
   next slides up from the bottom and covers it while the one underneath dims and
   drifts up slightly. Everything is scrubbed by scroll position; nothing zooms.
   Captions, counter and progress follow the room of the photo on screen.
   A tour with data-tour-lead="N" reserves N photo-lengths of scroll at the start
   for its intro (the big logo that blurs away), exposed to CSS as --intro (0 → 1). */
(() => {
  const tours = Array.from(document.querySelectorAll("[data-tour]"));
  if (!tours.length) return;

  const HOLD = 0.3; // share of each photo's stretch where it simply stays on screen
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const pad = (n) => String(n).padStart(2, "0");
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

  const states = tours.map((el) => {
    const shots = Array.from(el.querySelectorAll("[data-tour-shot]"));
    shots.forEach((shot, i) => { shot.style.zIndex = String(i + 1); }); // each card above the previous
    const rooms = shots.map((shot) => Number(shot.dataset.room) || 0);
    const roomCount = Math.max(...rooms) + 1;
    const roomStart = Array.from({ length: roomCount }, (_, r) => rooms.indexOf(r));
    const roomLength = roomStart.map((start, r) => (r + 1 < roomCount ? roomStart[r + 1] : shots.length) - start);
    const lead = Math.max(0, Number(el.dataset.tourLead) || 0);
    return {
      el,
      lead,
      units: shots.length + lead,
      shots,
      images: shots.map((shot) => shot.querySelector("img")),
      rooms,
      roomStart,
      roomLength,
      captions: Array.from(el.querySelectorAll("[data-tour-caption]")),
      segments: Array.from(el.querySelectorAll("[data-tour-seg]")),
      buttons: Array.from(el.querySelectorAll("[data-tour-go]")),
      current: el.querySelector("[data-tour-current]"),
      room: -1,
      frame: -1,
    };
  });

  const metrics = (state) => {
    const rect = state.el.getBoundingClientRect();
    const total = Math.max(1, state.el.offsetHeight - window.innerHeight);
    return { top: rect.top + window.scrollY, total, progress: clamp(-rect.top / total, 0, 1), visible: rect.bottom > 0 && rect.top < window.innerHeight };
  };

  const setRoom = (state, room) => {
    state.room = room;
    state.captions.forEach((caption, i) => caption.classList.toggle("is-active", i === room));
    state.segments.forEach((seg, i) => seg.classList.toggle("is-done", i < room));
    state.buttons.forEach((button, i) => {
      if (i === room) button.setAttribute("aria-current", "step");
      else button.removeAttribute("aria-current");
    });
    if (state.current) state.current.textContent = pad(room + 1);
  };

  const setFrame = (state, index) => {
    state.frame = index;
    // Warm up the next few photos before we reach them.
    for (let i = index + 1; i <= index + 3 && i < state.shots.length; i += 1) {
      if (state.images[i]?.loading === "lazy") state.images[i].loading = "eager";
    }
  };

  const paint = (state, index, slide) => {
    state.shots.forEach((shot, i) => {
      let visible = false;
      let y = 0;
      let dim = 0;
      let radius = 0;
      if (i === index) {
        visible = true;
        y = -slide * 7;          // drifts up a little as it gets covered
        dim = slide * 0.6;       // and darkens underneath
      } else if (i === index + 1) {
        visible = slide > 0;
        y = (1 - slide) * 100;   // next card rises from the bottom
        radius = (1 - slide) * 28;
      } else if (i > index + 1) {
        y = 100;
      }
      shot.style.visibility = visible ? "visible" : "hidden";
      shot.style.transform = `translate3d(0, ${y.toFixed(3)}%, 0)`;
      shot.style.setProperty("--dim", dim.toFixed(3));
      shot.style.setProperty("--r", `${radius.toFixed(1)}px`);
      shot.classList.toggle("is-incoming", i === index + 1 && slide > 0 && slide < 1);
    });
  };

  const tourSection = document.getElementById("tour");

  const update = () => {
    // The floating WhatsApp button stays away until the whole tour is behind us.
    if (tourSection) {
      document.body.classList.toggle("in-tour", tourSection.getBoundingClientRect().bottom > window.innerHeight * 0.6);
    }

    // Only the opening logo hides the header — computed even when the first tour is
    // off screen, so jumping away from the logo (menu link, skip) always brings it back.
    const opening = states[0];
    if (opening.lead) {
      const openingRaw = metrics(opening).progress * opening.units;
      document.body.classList.toggle("tour-intro", openingRaw < opening.lead * 0.85);
    }

    states.forEach((state) => {
      const { progress, visible } = metrics(state);
      if (!visible && state.frame !== -1) return;

      const count = state.shots.length;
      const rawAll = progress * state.units;
      const raw = Math.max(0, rawAll - state.lead);
      if (state.lead) {
        state.el.style.setProperty("--intro", clamp(rawAll / state.lead, 0, 1).toFixed(4));
      }
      const index = Math.min(count - 1, Math.floor(raw));
      if (index !== state.frame) setFrame(state, index);

      const local = clamp(raw - index, 0, 1);
      const slide = index < count - 1 ? ease(clamp((local - HOLD) / (1 - HOLD), 0, 1)) : 0;
      paint(state, index, slide);

      const shownIndex = slide > 0.5 ? index + 1 : index;
      const room = state.rooms[shownIndex];
      if (room !== state.room) setRoom(state, room);

      state.segments.forEach((seg, r) => {
        const fill = clamp((raw - state.roomStart[r]) / state.roomLength[r], 0, 1);
        seg.style.setProperty("--seg", fill.toFixed(4));
      });

      // Room captions and the HUD arrive once the intro (logo) has mostly blurred away.
      state.el.classList.toggle("is-started", state.lead ? rawAll > state.lead * 0.8 : progress > 0.01);
    });
  };

  let ticking = false;
  const requestUpdate = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(() => {
      ticking = false;
      update();
    });
  };

  // With Lenis, repaint inside its own frame so the cards move in lockstep with the scroll.
  if (window.lenis) window.lenis.on("scroll", update);
  else window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();

  // Gentle settle: when scrolling stops with a card half-way, finish (or undo) the move.
  if (window.lenis) {
    let idle;
    window.lenis.on("scroll", () => {
      window.clearTimeout(idle);
      idle = window.setTimeout(() => {
        states.forEach((state) => {
          const { top, total, progress, visible } = metrics(state);
          if (!visible || progress <= 0 || progress >= 1) return;
          const toY = (unit) => top + ((unit + state.lead) / state.units) * total;
          const raw = progress * state.units - state.lead;
          if (raw < 0) {
            // Stopped half-way through the logo blur: finish it or go back to the logo.
            const intro = (raw + state.lead) / state.lead;
            if (intro > 0.04 && intro < 0.96) {
              window.lenis.scrollTo(toY(intro > 0.5 ? 0.02 : -state.lead), { duration: 0.9, easing: (t) => 1 - Math.pow(1 - t, 3) });
            }
            return;
          }
          const index = Math.floor(raw);
          const local = raw - index;
          if (local <= HOLD + 0.03 || local >= 0.985 || index >= state.shots.length - 1) return;
          const slide = (local - HOLD) / (1 - HOLD);
          const target = slide > 0.45 ? index + 1 + 0.02 : index + HOLD * 0.5;
          window.lenis.scrollTo(toY(target), {
            duration: 0.75,
            easing: (t) => 1 - Math.pow(1 - t, 3),
          });
        });
      }, 180);
    });
  }

  const scrollToY = (y) => {
    if (window.lenis) window.lenis.scrollTo(y, { duration: 1.6, force: true });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  states.forEach((state) => {
    state.buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const room = Number(button.dataset.tourGo) || 0;
        const { top, total } = metrics(state);
        scrollToY(top + ((state.roomStart[room] + 0.05 + state.lead) / state.units) * total);
      });
    });

    // Clicking the photo opens the site lightbox on this home's photos.
    state.shots.forEach((shot, index) => {
      shot.addEventListener("click", () => {
        if (typeof openLightbox === "function") openLightbox(state.images, index);
      });
    });
  });
})();
