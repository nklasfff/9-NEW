/* ═══════════════════════════════════════════════════
   SLIDE MENU — De Ni Livsfaser
   Injects menu panel HTML, handles open/close
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── i18n helper ──
  function _mt(key) {
    var lang = localStorage.getItem('nineLives_lang') || 'da';
    var dict = window.TRANSLATIONS && window.TRANSLATIONS[lang];
    return (dict && dict[key] !== undefined) ? dict[key] : key;
  }

  // ── Inject menu HTML ──
  var menuHTML =
    '<div class="menu-overlay" id="menu-overlay"></div>' +
    '<aside class="menu-panel" id="menu-panel">' +
      '<div class="menu-panel__header">' +
        '<p class="menu-panel__brand" id="menu-brand">' + _mt('menu_brand') + '</p>' +
        '<p class="menu-panel__sub" id="menu-sub">' + _mt('menu_sub') + '</p>' +
      '</div>' +
      '<nav class="menu-panel__nav">' +
        '<a href="index.html" class="menu-link" data-page="index">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg></span>' +
          '<span class="menu-link__label" data-menu-key="menu_now">' + _mt('menu_now') + '</span>' +
        '</a>' +
        '<a href="tidsrejse.html" class="menu-link" data-page="tidsrejse">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4,12 Q8,4 12,12 Q16,20 20,12"/><circle cx="12" cy="12" r="1.5"/></svg></span>' +
          '<span class="menu-link__label" data-menu-key="menu_time">' + _mt('menu_time') + '</span>' +
        '</a>' +
        '<a href="relationer.html" class="menu-link" data-page="relationer">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="9" cy="12" r="5"/><circle cx="15" cy="12" r="5"/></svg></span>' +
          '<span class="menu-link__label" data-menu-key="menu_rel">' + _mt('menu_rel') + '</span>' +
        '</a>' +
        '<a href="vinduer.html" class="menu-link" data-page="vinduer">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="8" stroke-dasharray="2 3"/><circle cx="12" cy="12" r="3"/></svg></span>' +
          '<span class="menu-link__label" data-menu-key="menu_win">' + _mt('menu_win') + '</span>' +
        '</a>' +
        '<a href="mere.html" class="menu-link" data-page="mere">' +
          '<span class="menu-link__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/></svg></span>' +
          '<span class="menu-link__label" data-menu-key="menu_more">' + _mt('menu_more') + '</span>' +
        '</a>' +
      '</nav>' +
      '<div class="menu-panel__footer">' +
        '<p id="menu-footer">' + _mt('menu_footer') + '</p>' +
      '</div>' +
    '</aside>';

  document.body.insertAdjacentHTML('afterbegin', menuHTML);

  // ── Update menu text on language change ──
  function updateMenuText() {
    var brand = document.getElementById('menu-brand');
    var sub = document.getElementById('menu-sub');
    var footer = document.getElementById('menu-footer');
    if (brand) brand.textContent = _mt('menu_brand');
    if (sub) sub.textContent = _mt('menu_sub');
    if (footer) footer.textContent = _mt('menu_footer');
    document.querySelectorAll('[data-menu-key]').forEach(function (el) {
      el.textContent = _mt(el.getAttribute('data-menu-key'));
    });
  }

  window.addEventListener('langchange', updateMenuText);

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
