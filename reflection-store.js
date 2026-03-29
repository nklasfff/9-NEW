/* ═══════════════════════════════════════════════════
   REFLECTION STORE — De Ni Livsfaser
   Shared data layer for reflections, guided journals,
   and timeline tracking
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  var REFLECTIONS_KEY = 'dnl_reflections';
  var GUIDED_KEY = 'dnl_guided_journal';

  // ── Reflections (interactive questions on Dit Dybe Billede) ──

  function getReflections() {
    try { return JSON.parse(localStorage.getItem(REFLECTIONS_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveReflection(entry) {
    // entry: { id, section, questionKey, choiceKey, choiceText, date, phase, element }
    var entries = getReflections();
    // Replace if same section+questionKey exists on same date (allow re-answer)
    var today = new Date().toISOString().slice(0, 10);
    entries = entries.filter(function (e) {
      return !(e.section === entry.section && e.questionKey === entry.questionKey && e.date.slice(0, 10) === today);
    });
    entry.id = Date.now();
    entry.date = new Date().toISOString();
    entries.unshift(entry);
    localStorage.setItem(REFLECTIONS_KEY, JSON.stringify(entries));
    return entries;
  }

  function getReflectionsBySection(section) {
    return getReflections().filter(function (e) { return e.section === section; });
  }

  function getLatestReflection(section, questionKey) {
    var all = getReflections();
    for (var i = 0; i < all.length; i++) {
      if (all[i].section === section && all[i].questionKey === questionKey) return all[i];
    }
    return null;
  }

  // ── Guided Journal (step-by-step reflection tracks) ──

  function getGuidedEntries() {
    try { return JSON.parse(localStorage.getItem(GUIDED_KEY)) || []; }
    catch (e) { return []; }
  }

  function saveGuidedEntry(entry) {
    // entry: { id, theme, steps: [{question, answer}], date, phase, element, summary }
    var entries = getGuidedEntries();
    entry.id = Date.now();
    entry.date = new Date().toISOString();
    entries.unshift(entry);
    localStorage.setItem(GUIDED_KEY, JSON.stringify(entries));
    return entries;
  }

  function getGuidedByTheme(theme) {
    return getGuidedEntries().filter(function (e) { return e.theme === theme; });
  }

  // ── Timeline helpers ──

  function getAllTimelineData() {
    var reflections = getReflections();
    var guided = getGuidedEntries();
    // Merge and sort by date, newest first
    var all = [];
    reflections.forEach(function (r) {
      all.push({ type: 'reflection', data: r, date: r.date });
    });
    guided.forEach(function (g) {
      all.push({ type: 'guided', data: g, date: g.date });
    });
    all.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    return all;
  }

  function getTimelineGroupedByWeek() {
    var all = getAllTimelineData();
    var weeks = {};
    all.forEach(function (item) {
      var d = new Date(item.date);
      // Week key: year + week number
      var jan1 = new Date(d.getFullYear(), 0, 1);
      var weekNum = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
      var key = d.getFullYear() + '-W' + (weekNum < 10 ? '0' : '') + weekNum;
      if (!weeks[key]) weeks[key] = { key: key, items: [], startDate: item.date };
      weeks[key].items.push(item);
    });
    // Return sorted array of weeks
    return Object.keys(weeks).sort().reverse().map(function (k) { return weeks[k]; });
  }

  // ── Compare reflections over time for a section ──
  function getReflectionHistory(section, questionKey) {
    return getReflections().filter(function (e) {
      return e.section === section && e.questionKey === questionKey;
    }).reverse(); // oldest first
  }

  // ── Public API ──
  window.ReflectionStore = {
    // Reflections
    getReflections: getReflections,
    saveReflection: saveReflection,
    getReflectionsBySection: getReflectionsBySection,
    getLatestReflection: getLatestReflection,
    getReflectionHistory: getReflectionHistory,
    // Guided journal
    getGuidedEntries: getGuidedEntries,
    saveGuidedEntry: saveGuidedEntry,
    getGuidedByTheme: getGuidedByTheme,
    // Timeline
    getAllTimelineData: getAllTimelineData,
    getTimelineGroupedByWeek: getTimelineGroupedByWeek
  };

})();
