/* ═══════════════════════════════════════════════════
   JOURNAL — De Ni Livsfaser
   Save reflections to localStorage, tagged by theme
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'dnl_journal';

  // ── i18n helper ──
  function _t(key) {
    var lang = localStorage.getItem('nineLives_lang') || 'da';
    var dict = window.TRANSLATIONS && window.TRANSLATIONS[lang];
    return (dict && dict[key] !== undefined) ? dict[key] : key;
  }
  function _lang() {
    return localStorage.getItem('nineLives_lang') || 'da';
  }

  // ── Storage ──
  function getEntries() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }
  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  // ── Theme key mapping (stored theme → translation key) ──
  var themeKeys = {
    'deep': 'journal_theme_deep',
    'time': 'journal_theme_time',
    'relations': 'journal_theme_relations',
    'windows': 'journal_theme_windows'
  };
  function themeName(key) {
    return _t(themeKeys[key] || key);
  }

  // ── Init journal textareas ──
  document.querySelectorAll('.journal').forEach(function (journal) {
    var area = journal.querySelector('.journal__area');
    var saveBtn = journal.querySelector('.journal__save');
    var savedMsg = journal.querySelector('.journal__saved');
    var theme = journal.dataset.journalTheme || 'deep';

    if (!area || !saveBtn) return;

    // Set translated placeholder
    area.setAttribute('placeholder', _t('journal_placeholder'));

    // Activate on focus
    area.addEventListener('focus', function () {
      journal.classList.add('active');
    });

    // Deactivate on blur if empty
    area.addEventListener('blur', function () {
      setTimeout(function () {
        if (!area.value.trim() && document.activeElement !== saveBtn) {
          journal.classList.remove('active');
        }
      }, 200);
    });

    // Auto-resize textarea
    area.addEventListener('input', function () {
      area.style.height = 'auto';
      area.style.height = area.scrollHeight + 'px';
      saveBtn.disabled = !area.value.trim();
    });

    // Save
    saveBtn.addEventListener('click', function () {
      var text = area.value.trim();
      if (!text) return;

      var entries = getEntries();
      entries.unshift({
        id: Date.now(),
        text: text,
        theme: theme,
        date: new Date().toISOString()
      });
      saveEntries(entries);

      // Show confirmation
      savedMsg.textContent = _t('journal_saved');
      savedMsg.classList.add('visible');
      setTimeout(function () {
        savedMsg.classList.remove('visible');
      }, 2000);

      // Reset
      area.value = '';
      area.style.height = '';
      saveBtn.disabled = true;
      setTimeout(function () {
        journal.classList.remove('active');
      }, 2200);
    });
  });

  // ── Render categorized journal on Mere page ──
  var entriesContainer = document.getElementById('journal-entries');
  if (entriesContainer) {
    renderEntries();
    // Re-render on language change
    window.addEventListener('langchange', renderEntries);
  }

  function renderEntries() {
    var entries = getEntries();
    var lang = _lang();
    var locale = lang === 'en' ? 'en-GB' : 'da-DK';

    if (!entries.length) {
      entriesContainer.innerHTML = '<p class="journal-empty">' + _t('journal_empty') + '</p>';
      return;
    }

    // Group by theme
    var groups = {};
    var themeOrder = ['deep', 'time', 'relations', 'windows'];
    entries.forEach(function (e) {
      var key = e.theme || 'deep';
      if (!groups[key]) groups[key] = [];
      groups[key].push(e);
    });

    var html = '';
    themeOrder.forEach(function (key) {
      if (!groups[key] || !groups[key].length) return;
      var name = themeName(key);
      var count = groups[key].length;

      html += '<div class="dp-expand journal-group" data-expand="journal-' + key + '">';
      html += '<button class="dp-expand__btn">' + name + ' <span class="journal-group__count">(' + count + ')</span></button>';
      html += '<div class="dp-expand__body">';

      groups[key].forEach(function (entry) {
        var d = new Date(entry.date);
        var dateStr = d.toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' });
        html += '<div class="journal-entry" data-id="' + entry.id + '">';
        html += '<div class="journal-entry__header">';
        html += '<span class="journal-entry__date">' + dateStr + '</span>';
        html += '<span class="journal-entry__actions">';
        html += '<button class="journal-entry__share" title="' + _t('journal_share') + '">&#8599;</button>';
        html += '<button class="journal-entry__delete" title="' + _t('journal_delete') + '">&times;</button>';
        html += '</span>';
        html += '</div>';
        html += '<p class="journal-entry__text">' + escapeHtml(entry.text) + '</p>';
        html += '</div>';
      });

      html += '</div></div>';
    });

    entriesContainer.innerHTML = html;

    // Expand/collapse handlers
    entriesContainer.querySelectorAll('.dp-expand__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.closest('.dp-expand').classList.toggle('open');
      });
    });

    // Delete handlers
    entriesContainer.querySelectorAll('.journal-entry__delete').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var entryEl = btn.closest('.journal-entry');
        var id = parseInt(entryEl.dataset.id, 10);
        var entries = getEntries().filter(function (e) { return e.id !== id; });
        saveEntries(entries);
        renderEntries();
      });
    });

    // Share handlers
    entriesContainer.querySelectorAll('.journal-entry__share').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var entryEl = btn.closest('.journal-entry');
        var text = entryEl.querySelector('.journal-entry__text').textContent;
        var date = entryEl.querySelector('.journal-entry__date').textContent;
        var shareText = text + '\n— ' + _t('journal_share_attribution') + ', ' + date;

        if (navigator.share) {
          navigator.share({ text: shareText }).catch(function () {});
        } else {
          navigator.clipboard.writeText(shareText).then(function () {
            btn.textContent = '✓';
            setTimeout(function () { btn.innerHTML = '&#8599;'; }, 1500);
          });
        }
      });
    });
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
