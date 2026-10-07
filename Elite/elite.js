// =========================================
// ELITE — Header menu logic
// =========================================
const burger     = document.getElementById('eliteBurger');
const overlay    = document.getElementById('eliteOverlay');
const mobileMenu = document.getElementById('eliteMobileMenu');
const closeBtn   = document.getElementById('eliteClose');

function openMenu() {
  mobileMenu.classList.add('open');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

if (burger)    burger.addEventListener('click', openMenu);
if (closeBtn)  closeBtn.addEventListener('click', closeMenu);
if (overlay)   overlay.addEventListener('click', closeMenu);

document.querySelectorAll('.elite-mobile-link, .elite-mobile-cta a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeMenu();
});


// =========================================
// ELITE — Smooth scroll for nav links
// =========================================
(function () {
  const headerOffset = 90;   // ✅ header height ke hisaab se adjust karo

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      if (!href || href === '#') return;

      // "#top" → scroll to top
      if (href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        console.warn(`⚠️ Section not found for: ${href}`);
        return;
      }

      e.preventDefault();

      const elementTop = target.getBoundingClientRect().top + window.pageYOffset;
      const offsetTop = elementTop - headerOffset;

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth',
      });

      if (history.pushState) {
        history.pushState(null, '', href);
      }
    });
  });
})();


// =========================================
// ELITE — Hero auto-slider
// =========================================
const heroSlides = document.querySelectorAll('.elite-hero-slide');
const heroPrev   = document.getElementById('heroPrev');
const heroNext   = document.getElementById('heroNext');

let currentHero = 0;
let autoScrollTimer = null;
const AUTO_DELAY = 4000;

function showHeroSlide(index) {
  heroSlides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  currentHero = index;
}

function nextHero() {
  if (!heroSlides.length) return;
  showHeroSlide((currentHero + 1) % heroSlides.length);
}

function prevHero() {
  if (!heroSlides.length) return;
  showHeroSlide((currentHero - 1 + heroSlides.length) % heroSlides.length);
}

function startAutoScroll() {
  stopAutoScroll();
  autoScrollTimer = setInterval(nextHero, AUTO_DELAY);
}

function stopAutoScroll() {
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer);
    autoScrollTimer = null;
  }
}

if (heroNext) {
  heroNext.addEventListener('click', () => {
    nextHero();
    startAutoScroll();
  });
}

if (heroPrev) {
  heroPrev.addEventListener('click', () => {
    prevHero();
    startAutoScroll();
  });
}

if (heroSlides.length) startAutoScroll();


// =========================================
// ELITE — Amenities carousel
// =========================================
const amenityTrack = document.getElementById('amenityTrack');
const amenityPrev  = document.getElementById('amenityPrev');
const amenityNext  = document.getElementById('amenityNext');

let amenityIndex = 0;

function getAmenityVisibleCount() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 992) return 2;
  return 3;
}

const amenityCardsTotal = document.querySelectorAll('.elite-amenity-card').length;

function updateAmenityCarousel() {
  if (!amenityTrack) return;

  const visible = getAmenityVisibleCount();
  const maxIndex = Math.max(0, amenityCardsTotal - visible);

  if (amenityIndex < 0) amenityIndex = 0;
  if (amenityIndex > maxIndex) amenityIndex = maxIndex;

  const card = amenityTrack.querySelector('.elite-amenity-card');
  if (!card) return;

  const cardWidth = card.getBoundingClientRect().width;
  const gap = parseInt(getComputedStyle(amenityTrack).gap) || 24;
  const offset = (cardWidth + gap) * amenityIndex;

  amenityTrack.style.transform = `translateX(-${offset}px)`;
}

if (amenityNext) {
  amenityNext.addEventListener('click', () => {
    const visible = getAmenityVisibleCount();
    const maxIndex = amenityCardsTotal - visible;
    amenityIndex = amenityIndex >= maxIndex ? 0 : amenityIndex + 1;
    updateAmenityCarousel();
  });
}

if (amenityPrev) {
  amenityPrev.addEventListener('click', () => {
    const visible = getAmenityVisibleCount();
    const maxIndex = amenityCardsTotal - visible;
    amenityIndex = amenityIndex <= 0 ? maxIndex : amenityIndex - 1;
    updateAmenityCarousel();
  });
}

window.addEventListener('resize', () => {
  amenityIndex = 0;
  updateAmenityCarousel();
});

updateAmenityCarousel();


// =========================================
// ELITE — Floor Plan Lightbox
// =========================================
const planModal      = document.getElementById('planModal');
const planModalImg   = document.getElementById('planModalImage');
const planModalClose = document.getElementById('planModalClose');

// Open — on card click
document.querySelectorAll('.elite-plan-card').forEach((card) => {
  card.addEventListener('click', () => {
    const fullSrc = card.getAttribute('data-full');
    const altText = card.querySelector('img')?.alt || 'Floor Plan';

    if (fullSrc && planModal && planModalImg) {
      planModalImg.src = fullSrc;
      planModalImg.alt = altText;
      planModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeplanModal() {
  if (!planModal) return;
  planModal.classList.remove('open');
  document.body.style.overflow = '';
  if (planModalImg) {
    setTimeout(() => {
      planModalImg.src = '';
    }, 400);
  }
}

if (planModalClose) {
  planModalClose.addEventListener('click', closeplanModal);
}

if (planModal) {
  planModal.addEventListener('click', (e) => {
    if (e.target === planModal) {
      closeplanModal();
    }
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && planModal && planModal.classList.contains('open')) {
    closeplanModal();
  }
});


// =========================================
// ELITE — Showcase slider
// =========================================
const showcaseTrack = document.getElementById('showcaseTrack');
const showcasePrev  = document.getElementById('showcasePrev');
const showcaseNext  = document.getElementById('showcaseNext');

let showcaseIndex = 0;

function getShowcaseVisible() {
  if (window.innerWidth <= 640) return 1;
  if (window.innerWidth <= 992) return 2;
  return 3;
}

const showcaseTotal = document.querySelectorAll('.elite-showcase-slide').length;

function updateShowcase() {
  if (!showcaseTrack) return;

  const visible = getShowcaseVisible();
  const maxIndex = Math.max(0, showcaseTotal - visible);

  if (showcaseIndex < 0) showcaseIndex = 0;
  if (showcaseIndex > maxIndex) showcaseIndex = maxIndex;

  const slide = showcaseTrack.querySelector('.elite-showcase-slide');
  if (!slide) return;

  const slideWidth = slide.getBoundingClientRect().width;
  const gap = parseInt(getComputedStyle(showcaseTrack).gap) || 24;
  const offset = (slideWidth + gap) * showcaseIndex;

  showcaseTrack.style.transform = `translateX(-${offset}px)`;

  if (showcasePrev) showcasePrev.disabled = showcaseIndex <= 0;
  if (showcaseNext) showcaseNext.disabled = showcaseIndex >= maxIndex;

  // Active state — middle visible slide
  const slides = showcaseTrack.querySelectorAll('.elite-showcase-slide');
  slides.forEach((s) => s.classList.remove('active'));
  if (slides[showcaseIndex + 1]) {
    slides[showcaseIndex + 1].classList.add('active');
  }
}

if (showcaseNext) {
  showcaseNext.addEventListener('click', () => {
    const maxIndex = showcaseTotal - getShowcaseVisible();
    if (showcaseIndex < maxIndex) {
      showcaseIndex++;
      updateShowcase();
    }
  });
}

if (showcasePrev) {
  showcasePrev.addEventListener('click', () => {
    if (showcaseIndex > 0) {
      showcaseIndex--;
      updateShowcase();
    }
  });
}

window.addEventListener('resize', () => {
  showcaseIndex = 0;
  updateShowcase();
});

updateShowcase();


// =========================================
// ELITE — About Developer reveal animation
// =========================================
const devElements = document.querySelectorAll(
  '.elite-dev-logo, .elite-dev-eyebrow, .elite-dev-title, .elite-dev-desc, .elite-dev-website'
);

if (devElements.length) {
  const devObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          devObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px',
    }
  );

  devElements.forEach((el) => devObserver.observe(el));
}


// =========================================
// ELITE — Enquiry Modal
// =========================================
const enquiryModal      = document.getElementById('enquiryModal');
const enquiryModalClose = document.getElementById('enquiryModalClose');
const enquiryForm       = document.getElementById('eliteEnquiryForm');
const enquirySuccess    = document.getElementById('eliteEnquirySuccess');

// Open — "Click Here" links from config table
document.querySelectorAll('.elite-config-cta').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    if (!enquiryModal) return;

    // Optional pre-select
    const row = link.closest('tr');
    const rowText = row ? row.textContent.toLowerCase() : '';
    const select = enquiryForm?.querySelector('select[name="inventory"]');

    if (select) {
      if (rowText.includes('2 bhk')) select.value = '2bhk';
      else if (rowText.includes('3.5') || rowText.includes('master')) select.value = '3.5bhk';
      else if (rowText.includes('jodi')) select.value = 'jodi';
    }

    enquiryModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

// Close
function closeEnquiryModal() {
  if (!enquiryModal) return;
  enquiryModal.classList.remove('open');
  document.body.style.overflow = '';
  if (enquirySuccess) enquirySuccess.classList.remove('show');
}

if (enquiryModalClose) {
  enquiryModalClose.addEventListener('click', closeEnquiryModal);
}

const enquiryOverlay = enquiryModal?.querySelector('[data-close]');
if (enquiryOverlay) {
  enquiryOverlay.addEventListener('click', closeEnquiryModal);
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && enquiryModal && enquiryModal.classList.contains('open')) {
    closeEnquiryModal();
  }
});

// Submit
if (enquiryForm) {
  enquiryForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name      = enquiryForm.name.value.trim();
    const phone     = enquiryForm.phone.value.trim();
    const email     = enquiryForm.email.value.trim();
    const inventory = enquiryForm.inventory.value;

    if (!name || !phone || !email || !inventory) {
      alert('Please fill all fields.');
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number.');
      return;
    }

    console.log('Enquiry:', { name, phone, email, inventory });

    if (enquirySuccess) enquirySuccess.classList.add('show');
    enquiryForm.reset();

    setTimeout(closeEnquiryModal, 2500);
  });
}


// =========================================
// Footer year auto-update
// =========================================
const footerYear = document.getElementById('footerYear');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}