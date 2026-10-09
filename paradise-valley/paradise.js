/* =========================================
   PARADISE — Header + Drawer + Modal + Slider
========================================= */
(function () {
  "use strict";

  /* =========================================
     1. HEADER SCROLL EFFECT
  ========================================= */
  const header = document.getElementById("prdHeader");

  if (header) {
    let ticking = false;

    function onScroll() {
      if (window.scrollY > 40) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
      ticking = false;
    }

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    }, { passive: true });

    // Run on load
    onScroll();
  }


  /* =========================================
     2. SIDE DRAWER (Mobile Menu)
  ========================================= */
  const burger = document.getElementById("prdBurger");
  const drawer = document.getElementById("prdDrawer");

  if (burger && drawer) {
    const closeEls = drawer.querySelectorAll("[data-drawer-close]");
    const navLinks = drawer.querySelectorAll(".prd-drawer__link");

    function openDrawer() {
      drawer.classList.add("is-open");
      document.body.classList.add("prd-drawer-open");
    }

    function closeDrawer() {
      drawer.classList.remove("is-open");
      document.body.classList.remove("prd-drawer-open");
    }

    burger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (drawer.classList.contains("is-open")) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    closeEls.forEach(function (el) {
      el.addEventListener("click", closeDrawer);
    });

    navLinks.forEach(function (link) {
      link.addEventListener("click", closeDrawer);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && drawer.classList.contains("is-open")) {
        closeDrawer();
      }
    });
  }


  /* =========================================
     3. ENQUIRY MODAL
  ========================================= */
  const modal = document.getElementById("prdModal");
  const modalForm = document.getElementById("prdModalForm");

  if (modal) {
    const openBtns = document.querySelectorAll("[data-open-modal]");
    const closeEls = modal.querySelectorAll("[data-modal-close]");

    function openModal(e) {
      if (e) e.preventDefault();
      modal.classList.add("is-open");
      document.body.classList.add("prd-modal-open");

      setTimeout(function () {
        const first = modal.querySelector("input");
        if (first) first.focus();
      }, 400);
    }

    function closeModal() {
      modal.classList.remove("is-open");
      document.body.classList.remove("prd-modal-open");
    }

    openBtns.forEach(function (btn) {
      btn.addEventListener("click", openModal);
    });

    closeEls.forEach(function (el) {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) {
        closeModal();
      }
    });

    if (modalForm) {
      modalForm.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Form submitted");
        // API call yahan karo
        modalForm.reset();
        closeModal();
      });
    }
  }


  /* =========================================
     4. ABOUT IMAGE SLIDER
  ========================================= */
  const slidesContainer = document.getElementById("prdAboutSlides");

  if (slidesContainer) {
    const slides = slidesContainer.querySelectorAll(".prd-about__slide");
    const prevBtn = document.getElementById("prdAboutPrev");
    const nextBtn = document.getElementById("prdAboutNext");
    const currentEl = document.getElementById("prdAboutCurrent");
    const totalEl = document.getElementById("prdAboutTotal");

    if (slides.length) {
      let currentIndex = 0;
      let autoTimer;

      if (totalEl) totalEl.textContent = slides.length;

      function showSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        currentIndex = index;

        slides.forEach(function (slide, i) {
          slide.classList.toggle("is-active", i === currentIndex);
        });

        if (currentEl) currentEl.textContent = currentIndex + 1;
      }

      function nextSlide() { showSlide(currentIndex + 1); }
      function prevSlide() { showSlide(currentIndex - 1); }

      if (nextBtn) nextBtn.addEventListener("click", function () { nextSlide(); resetAuto(); });
      if (prevBtn) prevBtn.addEventListener("click", function () { prevSlide(); resetAuto(); });

      function startAuto() {
        autoTimer = setInterval(nextSlide, 4500);
      }

      function resetAuto() {
        clearInterval(autoTimer);
        startAuto();
      }

      const card = slidesContainer.closest(".prd-about__card");
      if (card) {
        card.addEventListener("mouseenter", function () { clearInterval(autoTimer); });
        card.addEventListener("mouseleave", startAuto);
      }

      showSlide(0);
      startAuto();
    }
  }

})();













/* =========================================
   PARADISE — Configuration Card Flip (Tap)
========================================= */
(function () {
  const cards = document.querySelectorAll(".prd-config__card");
  if (!cards.length) return;

  cards.forEach(function (card) {
    card.addEventListener("click", function (e) {
      // Enquire link pe click → modal khule, flip nahi
      if (e.target.closest("[data-open-modal]")) return;
      card.classList.toggle("is-flipped");
    });
  });
})();













/* =========================================
   PARADISE — Amenities Slider + Select
========================================= */
(function () {
  const track = document.getElementById("prdAmenitiesTrack");
  const slider = track ? track.parentElement : null;
  const prevBtn = document.getElementById("prdAmenitiesPrev");
  const nextBtn = document.getElementById("prdAmenitiesNext");

  if (!track || !slider) return;

  /* ---------- Duplicate for seamless loop ---------- */
  const originalHTML = track.innerHTML;
  track.innerHTML = originalHTML + originalHTML;

  /* ---------- Auto-scroll ---------- */
  let offset = 0;
  const speed = 0.6;
  let isPaused = false;

  function getSingleWidth() {
    return track.scrollWidth / 2;
  }

  function animate() {
    if (!isPaused) {
      offset -= speed;
      const single = getSingleWidth();
      if (Math.abs(offset) >= single) offset += single;
      track.style.transform = `translateX(${offset}px)`;
    }
    requestAnimationFrame(animate);
  }

  /* ---------- Pause on hover ---------- */
  slider.addEventListener("mouseenter", () => { isPaused = true; });
  slider.addEventListener("mouseleave", () => { isPaused = false; });

  /* ---------- Click to select ---------- */
  function bindItemClicks() {
    const items = track.querySelectorAll(".prd-amenities__item");

    items.forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        // Remove selection from all
        items.forEach((i) => i.classList.remove("is-selected"));

        // Add to clicked (both original + duplicate)
        const itemIndex = Array.from(items).indexOf(item);
        const originalIndex = itemIndex % (items.length / 2);

        items.forEach((i, idx) => {
          if (idx % (items.length / 2) === originalIndex) {
            i.classList.add("is-selected");
          }
        });

        // Pause auto-scroll while selected
        isPaused = true;
      });
    });

    // Click outside → deselect
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".prd-amenities__item")) {
        items.forEach((i) => i.classList.remove("is-selected"));
        isPaused = false;
      }
    });
  }

  /* ---------- Arrows ---------- */
  if (prevBtn) {
    prevBtn.addEventListener("click", function () {
      offset += 200;
      track.style.transform = `translateX(${offset}px)`;
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", function () {
      offset -= 200;
      track.style.transform = `translateX(${offset}px)`;
    });
  }

  /* ---------- Init ---------- */
  function init() {
    bindItemClicks();
    animate();
  }

  window.addEventListener("load", init);
})();





















/* =========================================
   PARADISE — Gallery Slider (3 cards visible)
========================================= */
(function () {
  const track = document.getElementById("prdGalleryTrack");
  const dotsContainer = document.getElementById("prdGalleryDots");
  if (!track || !dotsContainer) return;

  const cards = Array.from(track.querySelectorAll(".project-card"));
  const dots = Array.from(dotsContainer.querySelectorAll(".prd-gallery__dot"));

  if (!cards.length) return;

  let current = 0;
  let autoTimer;
  let visibleCount = 3;
  const total = cards.length;

  /* ---------- Visible cards based on screen width ---------- */
  function getVisibleCount() {
    const w = window.innerWidth;
    if (w <= 400) return 1;
    if (w <= 640) return 2;
    return 3;
  }

  /* ---------- Calculate max index ---------- */
  function getMaxIndex() {
    return Math.max(0, total - visibleCount);
  }

  /* ---------- Update ---------- */
  function update() {
    visibleCount = getVisibleCount();

    const maxIndex = getMaxIndex();
    if (current > maxIndex) current = maxIndex;

    const card = cards[0];
    const cardWidth = card.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 30;

    const offset = current * (cardWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    const dotIndex = Math.round(
      (current / Math.max(1, maxIndex)) * (dots.length - 1)
    );
    dots.forEach((d, i) => d.classList.toggle("is-active", i === dotIndex));
  }

  /* ---------- Nav ---------- */
  function next() {
    const maxIndex = getMaxIndex();
    current = current + 1 > maxIndex ? 0 : current + 1;
    update();
  }

  function prev() {
    const maxIndex = getMaxIndex();
    current = current - 1 < 0 ? maxIndex : current - 1;
    update();
  }

  /* ---------- Auto slide ---------- */
  function startAuto() {
    autoTimer = setInterval(next, 3500);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  /* ---------- Dots ---------- */
  dots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      const index = parseInt(dot.getAttribute("data-index"), 10);
      const maxIndex = getMaxIndex();
      current = Math.round((index / Math.max(1, dots.length - 1)) * maxIndex);
      update();
      resetAuto();
    });
  });

  /* ---------- Pause on hover ---------- */
  track.addEventListener("mouseenter", () => clearInterval(autoTimer));
  track.addEventListener("mouseleave", startAuto);

  /* ---------- Init ---------- */
  window.addEventListener("load", function () {
    visibleCount = getVisibleCount();
    update();
    startAuto();
  });

  /* ---------- Resize ---------- */
  let resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(update, 200);
  });
})();

















/* =========================================
   PARADISE — Location Accordion + Map Lightbox
========================================= */
(function () {
  "use strict";

  /* ---------- Accordion ---------- */
  const accordion = document.getElementById("prdLocationAcc");

  if (accordion) {
    const items = accordion.querySelectorAll(".prd-location__acc-item");

    items.forEach(function (item) {
      const head = item.querySelector("[data-acc-toggle]");
      if (!head) return;

      head.addEventListener("click", function () {
        const isOpen = item.classList.contains("is-open");

        items.forEach(function (i) {
          i.classList.remove("is-open");
        });

        if (!isOpen) {
          item.classList.add("is-open");
        }
      });
    });

    // First item open
    if (items.length) items[0].classList.add("is-open");
  }


  /* ---------- Map Lightbox ---------- */
  const mapBtn = document.querySelector("[data-map-open]");
  const lightbox = document.getElementById("prdMapLightbox");
  const lightboxImg = document.getElementById("prdMapLightboxImg");
  const closeEls = document.querySelectorAll("[data-map-close]");

  if (!mapBtn || !lightbox) return;

  function openLightbox() {
    const img = mapBtn.querySelector("img");
    if (!img) return;

    lightboxImg.src = img.src;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  mapBtn.addEventListener("click", openLightbox);

  closeEls.forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
})();