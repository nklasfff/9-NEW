/* DE NI LIVSFASER — Interactions */
(function () {
  'use strict';

  // ── Top nav scroll ──
  const topnav = document.querySelector('.topnav');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        topnav.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const siblings = Array.from(reveals);
          const idx = siblings.indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), (idx % 5) * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );
  reveals.forEach(el => observer.observe(el));

})();
