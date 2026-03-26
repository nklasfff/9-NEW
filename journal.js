/* ═══════════════════════════════════════════════════
   JOURNAL — De Ni Livsfaser
   Save reflections to localStorage, tagged by theme
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var STORAGE_KEY = 'dnl_journal';

  function getEntries() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  // ── Init journal textareas on deep pages ──
  document.querySelectorAll('.journal').forEach(function (journal) {
    var area = journal.querySelector('.journal__area');
    var saveBtn = journal.querySelector('.journal__save');
    var savedMsg = journal.querySelector('.journal__saved');
    var theme = journal.dataset.theme || 'Refleksion';

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

  // ── Render journal entries on Mere page ──
  var entriesContainer = document.getElementById('journal-entries');
  if (entriesContainer) {
    renderEntries();
  }

  function renderEntries() {
    var entries = getEntries();
    if (!entries.length) {
      entriesContainer.innerHTML = '<p class="journal-empty">Ingen journalindlæg endnu. Skriv din første refleksion på en af de dybe sider.</p>';
      return;
    }

    var html = '';
    entries.forEach(function (entry) {
      var d = new Date(entry.date);
      var dateStr = d.toLocaleDateString('da-DK', { day: 'numeric', month: 'short', year: 'numeric' });
      html += '<div class="journal-entry" data-id="' + entry.id + '">' +
        '<div class="journal-entry__header">' +
          '<span class="journal-entry__theme">' + escapeHtml(entry.theme) + '</span>' +
          '<span class="journal-entry__date">' + dateStr +
            ' <button class="journal-entry__delete" title="Slet">✕</button>' +
          '</span>' +
        '</div>' +
        '<p class="journal-entry__text">' + escapeHtml(entry.text) + '</p>' +
      '</div>';
    });
    entriesContainer.innerHTML = html;

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
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
})();
