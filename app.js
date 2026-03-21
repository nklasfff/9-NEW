// Navigation scroll effect
const nav = document.querySelector('.nav');

const handleScroll = () => {
  if (window.scrollY > 80) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', handleScroll, { passive: true });

// Smooth reveal on scroll using CSS classes
document.addEventListener('DOMContentLoaded', () => {
  const revealElements = document.querySelectorAll('.phase-card, .intro-grid, .section-header, .cycles-content, .elements-row');

  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -20px 0px'
  };

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, i) => {
    el.classList.add('reveal-item');
    el.style.transitionDelay = `${(i % 9) * 0.06}s`;
    revealObserver.observe(el);
  });
});
