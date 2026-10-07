// =========================================
// ELITE — SCROLL REVEAL ANIMATIONS
// Standalone module — import anywhere, works everywhere
// Usage: sirf HTML mein data-reveal="up/left/right" lagao
// =========================================

(function () {
  'use strict';

  // ---------------------------------------------
  // CONFIG
  // ---------------------------------------------
  const CONFIG = {
    threshold: 0.15,                    // Trigger when 15% visible
    rootMargin: '0px 0px -80px 0px',    // Trigger slightly before fully in view
    once: true,                         // Animation plays once, then unobserve
  };

  // ---------------------------------------------
  // INIT — setup observer
  // ---------------------------------------------
  function initScrollReveal() {
    // Grab all elements with data-reveal
    const elements = document.querySelectorAll('[data-reveal]');

    // If browser doesn't support IntersectionObserver, reveal everything
    if (!('IntersectionObserver' in window)) {
      elements.forEach((el) => el.classList.add('revealed'));
      return;
    }

    // Create observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add revealed class → CSS transitions from shifted → normal
            entry.target.classList.add('revealed');

            // Stop observing once revealed (one-time animation)
            if (CONFIG.once) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: CONFIG.threshold,
        rootMargin: CONFIG.rootMargin,
      }
    );

    // Observe each element
    elements.forEach((el) => observer.observe(el));

    return observer;
  }

  // ---------------------------------------------
  // RE-SCAN — call this when new elements are added to DOM
  // (e.g., after dynamic content loads)
  // ---------------------------------------------
  function rescan() {
    initScrollReveal();
  }

  // ---------------------------------------------
  // AUTO-INIT on DOM ready
  // ---------------------------------------------
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initScrollReveal);
  } else {
    initScrollReveal();
  }

  // ---------------------------------------------
  // EXPOSE — global API for manual control
  // ---------------------------------------------
  window.EliteAnimations = {
    init: initScrollReveal,
    rescan: rescan,
    config: CONFIG,
  };

})();