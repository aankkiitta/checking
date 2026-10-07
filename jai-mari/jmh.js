/* =========================================
   JAI MARI HOME — Header scroll effect
========================================= */
(function () {
  const header = document.getElementById("jmhHeader");
  if (!header) return;

  let ticking = false;

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    ticking = false;
  }

  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  onScroll();
})();

/* =========================================
   JAI MARI HOME — Side Drawer
========================================= */
(function () {
  const burger = document.getElementById("jmhBurger");
  const drawer = document.getElementById("jmhDrawer");
  if (!burger || !drawer) return;

  const closeEls = drawer.querySelectorAll("[data-drawer-close]");
  const navLinks = drawer.querySelectorAll(".jmh-drawer__link");

  function openDrawer() {
    drawer.classList.add("is-open");
    document.body.classList.add("jmh-drawer-open");
  }

  function closeDrawer() {
    drawer.classList.remove("is-open");
    document.body.classList.remove("jmh-drawer-open");
  }

  burger.addEventListener("click", openDrawer);
  closeEls.forEach((el) => el.addEventListener("click", closeDrawer));
  navLinks.forEach((link) => link.addEventListener("click", closeDrawer));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("is-open")) {
      closeDrawer();
    }
  });
})();















/* =========================================
   JAI MARI HOME — Enquiry Modal
========================================= */
(function () {
  const modal = document.getElementById("jmhModal");
  const form  = document.getElementById("jmhModalForm");
  if (!modal) return;

  const openBtns  = document.querySelectorAll("[data-open-modal]");
  const closeEls  = modal.querySelectorAll("[data-modal-close]");

  /* ---------- OPEN ---------- */
  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add("is-open");
    document.body.classList.add("jmh-modal-open");
    // Focus first input after animation
    setTimeout(() => {
      const first = modal.querySelector("input");
      if (first) first.focus();
    }, 400);
  }

  /* ---------- CLOSE ---------- */
  function closeModal() {
    modal.classList.remove("is-open");
    document.body.classList.remove("jmh-modal-open");
  }

  /* ---------- TRIGGERS ---------- */
  openBtns.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  closeEls.forEach((el) => {
    el.addEventListener("click", closeModal);
  });

  /* ---------- ESC KEY ---------- */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) {
      closeModal();
    }
  });

  /* ---------- FORM SUBMIT ---------- */
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // ✅ Collect form data (API call yahan karo)
      const data = {
        name:   document.getElementById("jmhName").value.trim(),
        mobile: document.getElementById("jmhMobile").value.trim(),
        email:  document.getElementById("jmhEmail").value.trim(),
        config: document.getElementById("jmhConfig").value,
      };

      console.log("📩 Enquiry Submitted:", data);

      // 👉 API call example:
      // fetch("/api/enquiry", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // })
      //   .then(() => showSuccess())
      //   .catch((err) => console.error(err));

      // ✅ Show success message
      showSuccess();

      // Reset form
      form.reset();
    });
  }

  /* ---------- SUCCESS MESSAGE ---------- */
  function showSuccess() {
    const box = modal.querySelector(".jmh-modal__box");

    // Replace content with success state
    box.innerHTML = `
      <button class="jmh-modal__close" data-modal-close aria-label="Close" type="button">✕</button>
      <div class="jmh-modal__success">
        <span class="jmh-modal__success-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
        <h3 class="jmh-modal__success-title">Thank You!</h3>
        <p class="jmh-modal__success-text">
          Your enquiry has been submitted successfully.<br>
          Our team will get in touch with you shortly.
        </p>
      </div>
    `;

    // Rebind close button
    const newClose = box.querySelector("[data-modal-close]");
    if (newClose) newClose.addEventListener("click", closeModal);

    // Auto close after 3 seconds
    setTimeout(() => {
      closeModal();
      // Reload page state after close (restores form)
      setTimeout(() => location.reload(), 400);
    }, 3500);
  }
})();



















/* =========================================
   JAI MARI HOME — Project Gallery Slider
========================================= */
(function () {
  const track = document.querySelector(".jmh-gallery__track");
  const prevBtn = document.querySelector("[data-gallery-prev]");
  const nextBtn = document.querySelector("[data-gallery-next]");

  if (!track) return;

  const cards = Array.from(track.querySelectorAll(".jmh-gallery__card"));
  if (!cards.length) return;

  let currentIndex = 0;

  /* ---------- Visible cards per view ---------- */
  function getVisibleCards() {
    const w = window.innerWidth;
    if (w <= 640) return 1;
    if (w <= 768) return 2;
    return 3;
  }

  function getTotalSlides() {
    return Math.max(1, cards.length - getVisibleCards() + 1);
  }

  /* ---------- Update active card ---------- */
  function updateActive() {
    cards.forEach((card, i) => {
      card.classList.toggle("is-active", i === currentIndex);
    });
  }

  /* ---------- Move slider ---------- */
  function goTo(index) {
    const total = getTotalSlides();

    if (index < 0) index = 0;
    if (index >= total) index = total - 1;

    currentIndex = index;

    const cardWidth = cards[0].offsetWidth;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.columnGap || style.gap) || 24;

    const translate = currentIndex * (cardWidth + gap);
    track.style.transform = `translateX(-${translate}px)`;

    updateActive();
  }

  /* ---------- Buttons ---------- */
  if (prevBtn) prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  /* ---------- Resize ---------- */
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      goTo(Math.min(currentIndex, getTotalSlides() - 1));
    }, 200);
  });

  /* ---------- Init ---------- */
  window.addEventListener("load", () => goTo(0));

  /* ---------- Touch swipe ---------- */
  let startX = 0;
  let endX = 0;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  }, { passive: true });

  track.addEventListener("touchend", (e) => {
    endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) goTo(currentIndex + 1);
      else goTo(currentIndex - 1);
    }
  }, { passive: true });
})();