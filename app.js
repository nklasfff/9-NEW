/* ═══════════════════════════════════════════════════
   DE NI LIVSFASER — Interactions & Animations
   Scroll reveals · Nav effects · Mobile menu · Card entrance
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Navigation scroll effect ──
  const nav = document.querySelector('.nav');
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 60);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Mobile burger menu ──
  const burger = document.querySelector('.nav__burger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  // ── Scroll reveal — sections ──
  const revealSections = document.querySelectorAll('.reveal');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          sectionObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  revealSections.forEach(el => sectionObserver.observe(el));

  // ── Staggered card entrance ──
  const cards = document.querySelectorAll('.portal');

  const cardObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger based on position in grid
          const index = Array.from(cards).indexOf(entry.target);
          const delay = (index % 3) * 80; // 80ms stagger per column
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);
          cardObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );

  cards.forEach(el => cardObserver.observe(el));

})();
