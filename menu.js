/* ═══════════════════════════════════════════════════
   SLIDE MENU — De Ni Livsfaser
   Injects menu panel HTML, handles open/close
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Inject menu HTML ──
  var menuHTML =
    '<div class="menu-overlay" id="menu-overlay"></div>' +
    '<aside class="menu-panel" id="menu-panel">' +
      '<div class="menu-panel__header">' +
        '<p class="menu-panel__brand">De Ni Livsfaser</p>' +
        '<p class="menu-panel__sub">Baseret på kinesisk medicins visdom</p>' +
      '</div>' +
      '<nav class="menu-panel__nav">' +
        '<a href="index.html" class="menu-link" data-page="index">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg></span>' +
          '<span class="menu-link__label">Lige Nu</span>' +
        '</a>' +
        '<a href="tidsrejse.html" class="menu-link" data-page="tidsrejse">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4,12 Q8,4 12,12 Q16,20 20,12"/><circle cx="12" cy="12" r="1.5"/></svg></span>' +
          '<span class="menu-link__label">Tidsrejse</span>' +
        '</a>' +
        '<a href="relationer.html" class="menu-link" data-page="relationer">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg></span>' +
          '<span class="menu-link__label">Relationer</span>' +
        '</a>' +
        '<a href="vinduer.html" class="menu-link" data-page="vinduer">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/><circle cx="12" cy="12" r="3"/></svg></span>' +
          '<span class="menu-link__label">Vinduer</span>' +
        '</a>' +
        '<a href="mere.html" class="menu-link" data-page="mere">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></span>' +
          '<span class="menu-link__label">Mere</span>' +
        '</a>' +
      '</nav>' +
      '<div class="menu-panel__footer">' +
        '<p>De Ni Livsfaser · Fem elementer · Dit liv</p>' +
      '</div>' +
    '</aside>';

  document.body.insertAdjacentHTML('afterbegin', menuHTML);

  // ── Highlight current page ──
  var path = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
  var activeLink = document.querySelector('.menu-link[data-page="' + path + '"]');
  if (activeLink) activeLink.classList.add('active');

  // ── Open / close ──
  var overlay = document.getElementById('menu-overlay');
  var panel = document.getElementById('menu-panel');
  var menuBtn = document.querySelector('[aria-label="Menu"]');

  function openMenu() {
    overlay.classList.add('open');
    panel.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    overlay.classList.remove('open');
    panel.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      if (panel.classList.contains('open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  overlay.addEventListener('click', closeMenu);

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && panel.classList.contains('open')) {
      closeMenu();
    }
  });
})();
