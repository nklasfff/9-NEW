/* ══════════════════════════════════════════
   i18n — Language switching for De Ni Livsfaser
   ══════════════════════════════════════════ */
(function () {
  'use strict';

  const STORAGE_KEY = 'nineLives_lang';
  const DEFAULT_LANG = 'da';

  // Get saved language or default
  function getLang() {
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  }

  // Set language and update page
  function setLang(lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
  }

  // Apply translations to all data-i18n elements
  function applyLang(lang) {
    if (!window.TRANSLATIONS) return;
    const t = window.TRANSLATIONS[lang];
    if (!t) return;

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Translate all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (t[key] !== undefined) {
        // Check if the element has child elements we should preserve
        if (el.children.length === 0) {
          el.textContent = t[key];
        } else {
          // For elements with mixed content, only update if it's a simple text node replacement
          // Use innerHTML for elements marked with data-i18n-html
          if (el.hasAttribute('data-i18n-html')) {
            el.innerHTML = t[key];
          } else {
            el.textContent = t[key];
          }
        }
      }
    });

    // Update placeholder attributes
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (t[key] !== undefined) el.placeholder = t[key];
    });

    // Update aria-label attributes
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (t[key] !== undefined) el.setAttribute('aria-label', t[key]);
    });

    // Update title element
    if (t._title) document.title = t._title;

    // Update language switcher button text
    document.querySelectorAll('.lang-switch').forEach(btn => {
      btn.textContent = lang === 'da' ? 'EN' : 'DA';
      btn.setAttribute('aria-label', lang === 'da' ? 'Switch to English' : 'Skift til dansk');
    });

    // Dispatch event for app.js to react
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
  }

  // Toggle between da and en
  function toggleLang() {
    const current = getLang();
    setLang(current === 'da' ? 'en' : 'da');
  }

  // Expose globally
  window.i18n = { getLang, setLang, applyLang, toggleLang };

  // Auto-apply on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      applyLang(getLang());
      bindSwitchers();
    });
  } else {
    applyLang(getLang());
    bindSwitchers();
  }

  function bindSwitchers() {
    document.querySelectorAll('.lang-switch').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        toggleLang();
      });
    });
  }

})();
