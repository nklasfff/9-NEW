/* ═══════════════════════════════════════════════════
   I18N — De Ni Livsfaser / The Nine Life Phases
   Two languages: da (default in HTML), en
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'dnl_lang';
  var currentLang = localStorage.getItem(STORAGE_KEY) || 'da';

  // Expose globally for other JS files
  window.DNL_LANG = currentLang;

  // Translation helper — returns English if available, otherwise fallback
  window.t = function (key, fallback) {
    if (currentLang === 'da') return fallback || key;
    var val = window.I18N_EN && window.I18N_EN[key];
    return val || fallback || key;
  };

  // Apply translations to DOM after load
  document.addEventListener('DOMContentLoaded', function () {
    if (currentLang === 'en') applyTranslations();
  });

  function applyTranslations() {
    if (!window.I18N_EN) return;
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      var val = window.I18N_EN[key];
      if (val) el.textContent = val;
    });
    // HTML content (for elements with markup inside)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      var val = window.I18N_EN[key];
      if (val) el.innerHTML = val;
    });
    // Placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-ph');
      var val = window.I18N_EN[key];
      if (val) el.placeholder = val;
    });
    // Aria labels
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria');
      var val = window.I18N_EN[key];
      if (val) el.setAttribute('aria-label', val);
    });
    // Title
    var titleKey = document.documentElement.getAttribute('data-i18n-title');
    if (titleKey && window.I18N_EN[titleKey]) {
      document.title = window.I18N_EN[titleKey];
    }
  }

  // Switch language function (used by settings)
  window.switchLang = function (lang) {
    localStorage.setItem(STORAGE_KEY, lang);
    window.location.reload();
  };
})();
