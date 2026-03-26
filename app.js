/* DE NI LIVSFASER — Living Mirror */
(function () {
  'use strict';

  // ── Helper: get current translation ──
  function t(key) {
    var lang = (window.i18n && window.i18n.getLang) ? window.i18n.getLang() : 'da';
    var dict = window.TRANSLATIONS && window.TRANSLATIONS[lang];
    return (dict && dict[key] !== undefined) ? dict[key] : key;
  }

  // ── Map Danish element names to translation keys ──
  const elemKeyMap = { 'Træ': 'wood', 'Ild': 'fire', 'Jord': 'earth', 'Metal': 'metal', 'Vand': 'water' };
  const organKeyMap = {
    'Lever': 'organ_liver', 'Lunger': 'organ_lungs', 'Tyktarm': 'organ_large_intestine',
    'Mave': 'organ_stomach', 'Milt': 'organ_spleen', 'Hjerte': 'organ_heart',
    'Tyndtarm': 'organ_small_intestine', 'Blære': 'organ_bladder', 'Nyrer': 'organ_kidneys',
    'Perikardium': 'organ_pericardium', 'Trippelvarmer': 'organ_triple_heater', 'Galdeblære': 'organ_gallbladder'
  };
  const seasonKeyMap = { 'Forår': 'season_spring', 'Sommer': 'season_summer', 'Sensommer': 'season_late_summer', 'Efterår': 'season_autumn', 'Vinter': 'season_winter' };
  const dayKeys = ['day_sun', 'day_mon', 'day_tue', 'day_wed', 'day_thu', 'day_fri', 'day_sat'];

  function tOrgan(dkName) { return t(organKeyMap[dkName] || dkName); }
  function tElem(dkName) { return t('elem_' + (elemKeyMap[dkName] || dkName)); }
  function tQual(dkName) { return t('qual_' + (elemKeyMap[dkName] || dkName)); }
  function tSeason(dkName) { return t(seasonKeyMap[dkName] || dkName); }

  // ── Organ clock (TCM 2-hour periods) — data stays Danish as internal keys ──
  const organClock = [
    { start: 1, end: 3, organ: 'Lever', element: 'Træ', char: '木' },
    { start: 3, end: 5, organ: 'Lunger', element: 'Metal', char: '金' },
    { start: 5, end: 7, organ: 'Tyktarm', element: 'Metal', char: '金' },
    { start: 7, end: 9, organ: 'Mave', element: 'Jord', char: '土' },
    { start: 9, end: 11, organ: 'Milt', element: 'Jord', char: '土' },
    { start: 11, end: 13, organ: 'Hjerte', element: 'Ild', char: '火' },
    { start: 13, end: 15, organ: 'Tyndtarm', element: 'Ild', char: '火' },
    { start: 15, end: 17, organ: 'Blære', element: 'Vand', char: '水' },
    { start: 17, end: 19, organ: 'Nyrer', element: 'Vand', char: '水' },
    { start: 19, end: 21, organ: 'Perikardium', element: 'Ild', char: '火' },
    { start: 21, end: 23, organ: 'Trippelvarmer', element: 'Ild', char: '火' },
    { start: 23, end: 1, organ: 'Galdeblære', element: 'Træ', char: '木' }
  ];

  // ── Life phase from stored birthday ──
  const phaseData = [
    { num: 1, name: 'Spiring',         nameKey: 'phase_1', element: 'Træ',   char: '木', range: '0 – 7 år' },
    { num: 2, name: 'Vækst',           nameKey: 'phase_2', element: 'Træ',   char: '木', range: '7 – 14 år' },
    { num: 3, name: 'Flammen',         nameKey: 'phase_3', element: 'Ild',   char: '火', range: '14 – 21 år' },
    { num: 4, name: 'Det Åbne Hjerte', nameKey: 'phase_4', element: 'Ild',   char: '火', range: '21 – 28 år' },
    { num: 5, name: 'Fundament',       nameKey: 'phase_5', element: 'Jord',  char: '土', range: '28 – 35 år' },
    { num: 6, name: 'Modning',         nameKey: 'phase_6', element: 'Jord',  char: '土', range: '35 – 42 år' },
    { num: 7, name: 'Høsten',          nameKey: 'phase_7', element: 'Metal', char: '金', range: '42 – 49 år' },
    { num: 8, name: 'Stilheden',       nameKey: 'phase_8', element: 'Vand',  char: '水', range: '49 – 56 år' },
    { num: 9, name: 'Det Andet Forår', nameKey: 'phase_9', element: 'Træ',   char: '木', range: '56+ år' }
  ];

  let userPhase = phaseData[6]; // default: phase 7
  const bdayStr = localStorage.getItem('dnl_birthday');
  if (bdayStr) {
    const p = bdayStr.split('-');
    const bday = new Date(parseInt(p[0],10), parseInt(p[1],10)-1, parseInt(p[2],10));
    const now = new Date();
    let age = now.getFullYear() - bday.getFullYear();
    if (now.getMonth() < bday.getMonth() || (now.getMonth() === bday.getMonth() && now.getDate() < bday.getDate())) age--;
    if (age < 7) userPhase = phaseData[0];
    else if (age < 14) userPhase = phaseData[1];
    else if (age < 21) userPhase = phaseData[2];
    else if (age < 28) userPhase = phaseData[3];
    else if (age < 35) userPhase = phaseData[4];
    else if (age < 42) userPhase = phaseData[5];
    else if (age < 49) userPhase = phaseData[6];
    else if (age < 56) userPhase = phaseData[7];
    else userPhase = phaseData[8];
  }

  // ── Helper: translate phase name ──
  function tPhase(phase) {
    return t(phase.nameKey) !== phase.nameKey ? t(phase.nameKey) : phase.name;
  }

  const seasons = [
    { months: [2, 3, 4], name: 'Forår', element: 'Træ' },
    { months: [5, 6], name: 'Sommer', element: 'Ild' },
    { months: [7], name: 'Sensommer', element: 'Jord' },
    { months: [8, 9, 10], name: 'Efterår', element: 'Metal' },
    { months: [11, 0, 1], name: 'Vinter', element: 'Vand' }
  ];

  const dayElementsDk = ['Jord', 'Metal', 'Vand', 'Træ', 'Træ', 'Ild', 'Jord'];

  // ── Core render function ──
  function renderDynamic() {
    const hour = new Date().getHours();
    const month = new Date().getMonth();
    const today = new Date().getDay();

    // Find current organ
    const currentOrgan = organClock.find(o => {
      if (o.start > o.end) return hour >= o.start || hour < o.end;
      return hour >= o.start && hour < o.end;
    }) || organClock[0];

    // Find current season
    const currentSeason = seasons.find(s => s.months.includes(month)) || seasons[0];

    // ── Greeting ──
    const greetEl = document.getElementById('greeting');
    if (greetEl) {
      if (hour < 5) greetEl.textContent = t('greet_night');
      else if (hour < 10) greetEl.textContent = t('greet_morning');
      else if (hour < 13) greetEl.textContent = t('greet_forenoon');
      else if (hour < 17) greetEl.textContent = t('greet_afternoon');
      else if (hour < 21) greetEl.textContent = t('greet_evening');
      else greetEl.textContent = t('greet_late');
    }

    // ── Life phase display ──
    const cyclePhaseEl = document.getElementById('cyclePhase');
    if (cyclePhaseEl) cyclePhaseEl.textContent = t('phase_prefix') + ' ' + userPhase.num + ' · ' + tPhase(userPhase);

    // ── Organ display ──
    const organEl = document.getElementById('cycleOrgan');
    const organTimeEl = document.getElementById('cycleOrganTime');
    if (organEl) organEl.textContent = tOrgan(currentOrgan.organ) + ' · ' + tElem(currentOrgan.element);
    if (organTimeEl) {
      const end = currentOrgan.end < 10 ? '0' + currentOrgan.end : currentOrgan.end;
      const start = currentOrgan.start < 10 ? '0' + currentOrgan.start : currentOrgan.start;
      organTimeEl.textContent = t('time_prefix') + start + '–' + end;
    }

    // ── Element character and name — use life phase element ──
    const charEl = document.getElementById('elementChar');
    const nameEl = document.getElementById('elementName');
    const qualEl = document.getElementById('elementQuality');
    if (charEl) charEl.textContent = userPhase.char;
    if (nameEl) nameEl.textContent = tElem(userPhase.element);
    if (qualEl) qualEl.textContent = tQual(userPhase.element);

    // ── Season display ──
    const seasonEl = document.getElementById('cycleSeason');
    if (seasonEl) seasonEl.textContent = tSeason(currentSeason.name) + ' · ' + tElem(currentSeason.element);

    // ── Weekday display ──
    const dayEl = document.getElementById('cycleDay');
    if (dayEl) dayEl.textContent = t(dayKeys[today]) + ' · ' + tElem(dayElementsDk[today]);

    // ── Sensommer detail ──
    const senEl = document.getElementById('cycleSensommer');
    if (senEl) {
      const lang = (window.i18n && window.i18n.getLang) ? window.i18n.getLang() : 'da';
      senEl.textContent = lang === 'en' ? 'Late summer energy' : 'Sensommerens energi';
    }

    // ── Climate text — use life phase element ──
    const climateEl = document.getElementById('climateText');
    if (climateEl) {
      const sElem = currentSeason.element;
      const pElem = userPhase.element;
      if (sElem === pElem) {
        climateEl.textContent = t('climate_resonance') + tElem(sElem).toLowerCase() + t('climate_resonance_suffix');
      } else {
        climateEl.textContent = tSeason(currentSeason.name) + t('climate_meets') + tElem(pElem).toLowerCase() +
          ' — ' + (Math.random() > 0.5 ? t('climate_tension_a') : t('climate_tension_b')) +
          t('climate_between') + tElem(sElem).toLowerCase() + t('climate_and') + tElem(pElem).toLowerCase() + '.';
      }
    }

    // ── Deep bars ──
    const deepOrganEl = document.getElementById('deepOrgan');
    if (deepOrganEl) {
      const end = currentOrgan.end < 10 ? '0' + currentOrgan.end : currentOrgan.end;
      const start = currentOrgan.start < 10 ? '0' + currentOrgan.start : currentOrgan.start;
      deepOrganEl.textContent = tOrgan(currentOrgan.organ) + ' · ' + tElem(currentOrgan.element) + ' · ' + t('time_prefix') + start + '–' + end;
    }

    const deepSeasonEl = document.getElementById('deepSeason');
    if (deepSeasonEl) deepSeasonEl.textContent = tSeason(currentSeason.name) + t('climate_meets') + tElem(userPhase.element);

    const deepClimateEl = document.getElementById('deepClimate');
    if (deepClimateEl) {
      if (currentSeason.element === userPhase.element) {
        deepClimateEl.textContent = t('deep_resonance_prefix') + tElem(userPhase.element).toLowerCase();
      } else {
        deepClimateEl.textContent = t('deep_tension_prefix') + tElem(currentSeason.element).toLowerCase() + t('climate_and') + tElem(userPhase.element).toLowerCase();
      }
    }

    const deepPhaseEl = document.getElementById('deepPhase');
    if (deepPhaseEl) deepPhaseEl.textContent = t('phase_prefix') + ' ' + userPhase.num + ' · ' + tPhase(userPhase) + ' · ' + tElem(userPhase.element);
  }

  // ── Run on load ──
  renderDynamic();

  // ── Re-render when language changes ──
  window.addEventListener('langchange', renderDynamic);

  // ── Top nav scroll ──
  const topnav = document.querySelector('.topnav');
  if (topnav) {
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
  }

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = Array.from(reveals).indexOf(entry.target);
          setTimeout(() => entry.target.classList.add('visible'), (idx % 6) * 70);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
  );
  reveals.forEach(el => observer.observe(el));

})();
