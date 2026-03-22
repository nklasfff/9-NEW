/* DE NI LIVSFASER — Living Mirror */
(function () {
  'use strict';

  // ── Time-based greeting ──
  const hour = new Date().getHours();
  const greetEl = document.getElementById('greeting');
  if (greetEl) {
    if (hour < 5) greetEl.textContent = 'Stille nat';
    else if (hour < 10) greetEl.textContent = 'God morgen';
    else if (hour < 13) greetEl.textContent = 'God formiddag';
    else if (hour < 17) greetEl.textContent = 'God eftermiddag';
    else if (hour < 21) greetEl.textContent = 'God aften';
    else greetEl.textContent = 'Stille aften';
  }

  // ── Organ clock (TCM 2-hour periods) ──
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

  const elementQualities = {
    'Træ': 'Vækst & Retning',
    'Ild': 'Hjerte & Forbindelse',
    'Jord': 'Næring & Fundament',
    'Metal': 'Klarhed & Skelnen',
    'Vand': 'Dybde & Stilhed'
  };

  // ── Life phase from stored birthday ──
  const phaseData = [
    { num: 1, name: 'Spiring',         element: 'Træ',   char: '木', range: '0 – 7 år' },
    { num: 2, name: 'Vækst',           element: 'Træ',   char: '木', range: '7 – 14 år' },
    { num: 3, name: 'Flammen',         element: 'Ild',   char: '火', range: '14 – 21 år' },
    { num: 4, name: 'Det Åbne Hjerte', element: 'Ild',   char: '火', range: '21 – 28 år' },
    { num: 5, name: 'Fundament',       element: 'Jord',  char: '土', range: '28 – 35 år' },
    { num: 6, name: 'Modning',         element: 'Jord',  char: '土', range: '35 – 42 år' },
    { num: 7, name: 'Høsten',          element: 'Metal', char: '金', range: '42 – 49 år' },
    { num: 8, name: 'Stilheden',       element: 'Vand',  char: '水', range: '49 – 56 år' },
    { num: 9, name: 'Det Andet Forår', element: 'Træ',   char: '木', range: '56+ år' }
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

  // Update phase display
  const cyclePhaseEl = document.getElementById('cyclePhase');
  if (cyclePhaseEl) cyclePhaseEl.textContent = 'Fase ' + userPhase.num + ' · ' + userPhase.name;

  // Find current organ
  const currentOrgan = organClock.find(o => {
    if (o.start > o.end) return hour >= o.start || hour < o.end; // midnight crossing
    return hour >= o.start && hour < o.end;
  }) || organClock[0];

  // Update organ display
  const organEl = document.getElementById('cycleOrgan');
  const organTimeEl = document.getElementById('cycleOrganTime');
  if (organEl) organEl.textContent = currentOrgan.organ + ' · ' + currentOrgan.element;
  if (organTimeEl) {
    const end = currentOrgan.end < 10 ? '0' + currentOrgan.end : currentOrgan.end;
    const start = currentOrgan.start < 10 ? '0' + currentOrgan.start : currentOrgan.start;
    organTimeEl.textContent = 'kl. ' + start + '–' + end;
  }

  // Update element character and name — use life phase element
  const charEl = document.getElementById('elementChar');
  const nameEl = document.getElementById('elementName');
  const qualEl = document.getElementById('elementQuality');
  if (charEl) charEl.textContent = userPhase.char;
  if (nameEl) nameEl.textContent = userPhase.element;
  if (qualEl) qualEl.textContent = elementQualities[userPhase.element] || '';

  // ── Season detection ──
  const month = new Date().getMonth(); // 0-indexed
  const seasons = [
    { months: [2, 3, 4], name: 'Forår', element: 'Træ' },
    { months: [5, 6], name: 'Sommer', element: 'Ild' },
    { months: [7], name: 'Sensommer', element: 'Jord' },
    { months: [8, 9, 10], name: 'Efterår', element: 'Metal' },
    { months: [11, 0, 1], name: 'Vinter', element: 'Vand' }
  ];
  const currentSeason = seasons.find(s => s.months.includes(month)) || seasons[0];

  const seasonEl = document.getElementById('cycleSeason');
  if (seasonEl) seasonEl.textContent = currentSeason.name + ' · ' + currentSeason.element;

  // ── Weekday element ──
  const dayNames = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
  const dayElements = ['Jord', 'Metal', 'Vand', 'Træ', 'Træ', 'Ild', 'Jord'];
  const today = new Date().getDay();
  const dayEl = document.getElementById('cycleDay');
  if (dayEl) dayEl.textContent = dayNames[today] + ' · ' + dayElements[today];

  // ── Climate text ──
  const climateEl = document.getElementById('climateText');
  if (climateEl) {
    const seasonEl2 = currentSeason.element;
    const phaseEl2 = userPhase.element;
    if (seasonEl2 === phaseEl2) {
      climateEl.textContent = 'Fuld resonans — ' + seasonEl2.toLowerCase() + '-energien pulserer i alt omkring dig lige nu. Mærk den.';
    } else {
      climateEl.textContent = currentSeason.name + ' møder ' + phaseEl2.toLowerCase() + ' i dig lige nu — en ' +
        (Math.random() > 0.5 ? 'sjælden spænding' : 'poetisk dialog') +
        ' mellem ' + seasonEl2.toLowerCase() + ' og ' + phaseEl2.toLowerCase() + '.';
    }
  }

  // ── Deep bars — update with live data ──
  const deepOrganEl = document.getElementById('deepOrgan');
  if (deepOrganEl) {
    const end = currentOrgan.end < 10 ? '0' + currentOrgan.end : currentOrgan.end;
    const start = currentOrgan.start < 10 ? '0' + currentOrgan.start : currentOrgan.start;
    deepOrganEl.textContent = currentOrgan.organ + ' · ' + currentOrgan.element + ' · kl. ' + start + '–' + end;
  }

  const deepSeasonEl = document.getElementById('deepSeason');
  if (deepSeasonEl) deepSeasonEl.textContent = currentSeason.name + ' møder ' + userPhase.element;

  const deepClimateEl = document.getElementById('deepClimate');
  if (deepClimateEl) {
    if (currentSeason.element === userPhase.element) {
      deepClimateEl.textContent = 'Fuld resonans i ' + userPhase.element.toLowerCase();
    } else {
      deepClimateEl.textContent = 'Kreativ spænding — ' + currentSeason.element.toLowerCase() + ' og ' + userPhase.element.toLowerCase();
    }
  }

  const deepPhaseEl = document.getElementById('deepPhase');
  if (deepPhaseEl) deepPhaseEl.textContent = 'Fase ' + userPhase.num + ' · ' + userPhase.name + ' · ' + userPhase.element;

  // ── Top nav scroll ──
  const topnav = document.querySelector('.topnav');
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
