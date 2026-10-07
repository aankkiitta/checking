/* =========================================
   PALM — Header scroll effect
   ========================================= */
(function () {
  const header = document.getElementById("palmHeader");
  if (!header) return;

  let ticking = false;

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  onScroll();
})();

/* =========================================
   PALM — Mobile menu open/close
   ========================================= */
(function () {
  const burger   = document.getElementById("palmBurger");
  const closeBtn = document.getElementById("palmClose");
  const overlay  = document.getElementById("palmOverlay");
  const menu     = document.getElementById("palmMobileMenu");

  if (!burger || !closeBtn || !overlay || !menu) {
    console.warn("⚠️ Mobile menu elements missing");
    return;
  }

  function openMenu() {
    menu.classList.add("open");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menu.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  burger.addEventListener("click", openMenu);
  closeBtn.addEventListener("click", closeMenu);
  overlay.addEventListener("click", closeMenu);

  document.querySelectorAll(".palm-mobile-link").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
})();

/* =========================================
   PALM — Active nav link on scroll
   ========================================= */
(function () {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".palm-nav-link");

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === `#${id}`
            );
          });
        }
      });
    },
    { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
})();

/* =========================================
   BOTTOM OFFER STRIP — Rotating text
   ========================================= */
(function () {
  const items = document.querySelectorAll(".palm-bottom-strip__item");

  if (!items.length) {
    console.warn("⚠️ Bottom strip items missing");
    return;
  }

  let currentIndex = 0;
  const ROTATE_DELAY = 3500;

  function showItem(index) {
    items.forEach((item, i) => {
      item.classList.toggle("is-active", i === index);
    });
  }

  function nextItem() {
    currentIndex = (currentIndex + 1) % items.length;
    showItem(currentIndex);
  }

  showItem(0);
  setInterval(nextItem, ROTATE_DELAY);
})();

/* =========================================
   PALM — Enquiry Modal open/close
   ========================================= */
(function () {
  const modal = document.getElementById("enquiryModal");
  if (!modal) {
    console.warn("⚠️ Enquiry modal missing");
    return;
  }

  const openBtns  = document.querySelectorAll("[data-open-modal]");
  const closeBtns = modal.querySelectorAll("[data-close-modal]");

  function openModal(e) {
    if (e) e.preventDefault();
    modal.classList.add("open");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-open");
  }

  openBtns.forEach((btn) => {
    btn.addEventListener("click", openModal);
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", closeModal);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeModal();
    }
  });

  const form = modal.querySelector("form");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      console.log("✅ Form submitted");
      form.reset();
      closeModal();
    });
  }
})();

/* =========================================
   PALM — Lightbox (Floor Plans + Config Icons)
========================================= */
(function () {
  const mediaEls = document.querySelectorAll("[data-lightbox]");
  const lightbox = document.getElementById("palmLightbox");

  if (!mediaEls.length || !lightbox) return;

  const lightboxImg = lightbox.querySelector(".palm-lightbox__img");
  const closeBtn    = lightbox.querySelector("[data-lightbox-close]");

  function openLightbox(src) {
    lightboxImg.src = src;
    lightbox.classList.add("open");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.classList.remove("lightbox-open");
    setTimeout(() => { lightboxImg.src = ""; }, 350);
  }

  mediaEls.forEach((el) => {
    el.addEventListener("click", () => {
      const src = el.getAttribute("data-lightbox");
      if (src) openLightbox(src);
    });
  });

  if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
})();

/* =========================================
   PALM — Video Toggle Switcher (Local Files)
========================================= */
(function () {
  const toggles = document.querySelectorAll(".palm-video__toggle");
  const video   = document.getElementById("videoFrame");
  const source  = document.getElementById("videoSource");
  const titleEl = document.getElementById("videoTitle");
  const descEl  = document.getElementById("videoDesc");

  if (!toggles.length || !video || !source) return;

  const VIDEO_DATA = {
    outside: {
      src:   "img/palminterior.mp4",
      title: "From Outside — Project Walkthrough",
      desc:  "Take a look at the stunning architecture, landscaped podium, and tower elevation from the outside."
    },
    inside: {
      src:   "img/palminterior.mp4",
      title: "From Inside — Sample Flat Tour",
      desc:  "Step inside the sample flat and explore spacious interiors, premium finishes, and expansive decks."
    }
  };

  function setVideo(view) {
    const data = VIDEO_DATA[view];
    if (!data) return;

    video.pause();
    source.src = data.src;
    video.load();

    titleEl.textContent = data.title;
    descEl.textContent  = data.desc;

    toggles.forEach((t) => {
      t.classList.toggle("is-active", t.dataset.view === view);
    });

    const info = document.querySelector(".palm-video__info");
    if (info) {
      info.style.borderColor = "#475569";
      setTimeout(() => { info.style.borderColor = ""; }, 600);
    }
  }

  toggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      setVideo(toggle.dataset.view);
    });
  });
})();

/* =========================================
   PALM — Gallery Tabs + Center Carousel
========================================= */
(function () {
  const tabs = document.querySelectorAll(".palm-gallery__tab");
  const panels = document.querySelectorAll(".palm-carousel");

  if (!tabs.length || !panels.length) return;

  function initCarousel(carousel) {
    const track = carousel.querySelector(".palm-carousel__track");
    const items = Array.from(carousel.querySelectorAll(".palm-carousel__item"));
    const prevBtn = carousel.querySelector("[data-carousel-prev]");
    const nextBtn = carousel.querySelector("[data-carousel-next]");

    if (!track || !items.length) return;

    let activeIndex = 1;

    function getGap() {
      const style = window.getComputedStyle(track);
      return parseInt(style.columnGap || style.gap) || 30;
    }

    function centerItem(index) {
      if (index < 0) index = items.length - 1;
      if (index >= items.length) index = 0;
      activeIndex = index;

      const itemWidth = items[0].offsetWidth;
      const gap = getGap();
      const totalItemWidth = itemWidth + gap;

      const viewportWidth = track.parentElement.offsetWidth;
      const itemCenter = index * totalItemWidth + (itemWidth / 2);
      const viewportCenter = viewportWidth / 2;
      const translateX = viewportCenter - itemCenter;

      track.style.transform = `translateX(${translateX}px)`;

      items.forEach((item, i) => {
        item.classList.toggle("is-active", i === index);
      });
    }

    if (prevBtn) prevBtn.addEventListener("click", () => centerItem(activeIndex - 1));
    if (nextBtn) nextBtn.addEventListener("click", () => centerItem(activeIndex + 1));

    items.forEach((item, i) => {
      item.addEventListener("click", () => centerItem(i));
    });

    carousel._centerItem = centerItem;
    carousel._getActiveIndex = () => activeIndex;
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const key = tab.dataset.tab;

      tabs.forEach((t) => t.classList.toggle("is-active", t === tab));
      panels.forEach((p) => p.classList.toggle("is-active", p.dataset.panel === key));

      const activePanel = document.querySelector(`.palm-carousel[data-panel="${key}"]`);
      if (activePanel && activePanel._centerItem) {
        setTimeout(() => activePanel._centerItem(1), 60);
      }
    });
  });

  function initAll() {
    panels.forEach((panel) => initCarousel(panel));

    const activePanel = document.querySelector(".palm-carousel.is-active");
    if (activePanel && activePanel._centerItem) {
      setTimeout(() => activePanel._centerItem(1), 100);
    }
  }

  if (document.readyState === "complete") {
    initAll();
  } else {
    window.addEventListener("load", initAll);
  }

  setTimeout(initAll, 500);

  window.addEventListener("resize", () => {
    const activePanel = document.querySelector(".palm-carousel.is-active");
    if (activePanel && activePanel._centerItem) {
      activePanel._centerItem(activePanel._getActiveIndex());
    }
  });
})();

/* =========================================
   PALM — Universal Scroll Reveal
   Auto-detects all [data-reveal] elements
========================================= */
(function () {
  const elements = document.querySelectorAll("[data-reveal]");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -60px 0px",
    }
  );

  elements.forEach((el) => observer.observe(el));
})();