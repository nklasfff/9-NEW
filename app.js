/* ═══════════════════════════════════════════════════
   DE NI LIVSFASER — Interactions
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger sibling reveals
          const siblings = Array.from(reveals);
          const idx = siblings.indexOf(entry.target);
          const delay = (idx % 4) * 100;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.06, rootMargin: '0px 0px -30px 0px' }
  );

  reveals.forEach(el => observer.observe(el));
})();
