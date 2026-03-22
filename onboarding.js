/* ═══════════════════════════════════════════════════
   ONBOARDING — De Ni Livsfaser
   Birthday → Phase calculation → localStorage → Redirect
   ═══════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── Redirect if already onboarded ──
  if (localStorage.getItem('dnl_birthday')) {
    window.location.replace('index.html');
    return;
  }

  // ── Phase data ──
  var phases = [
    { num: 1, name: 'Spiring',         element: 'Træ',   char: '木', range: '0 – 7 år',   color: 'rgba(90,138,106,0.70)',  text: 'Du er frøet der sprænger jorden. Alt er nyt, alt er muligt.' },
    { num: 2, name: 'Vækst',           element: 'Træ',   char: '木', range: '7 – 14 år',  color: 'rgba(90,138,106,0.55)',  text: 'Træets kraft presser opad. Du finder din retning, din vilje.' },
    { num: 3, name: 'Flammen',         element: 'Ild',   char: '火', range: '14 – 21 år', color: 'rgba(160,96,80,0.70)',   text: 'Ilden vækker hjertet. Forbindelse, identitet, lidenskab — alt brænder.' },
    { num: 4, name: 'Det Åbne Hjerte', element: 'Ild',   char: '火', range: '21 – 28 år', color: 'rgba(160,96,80,0.55)',   text: 'Ilden modnes til varme. Du vover dig ud i verden med åbent hjerte.' },
    { num: 5, name: 'Fundament',       element: 'Jord',  char: '土', range: '28 – 35 år', color: 'rgba(138,122,96,0.70)',  text: 'Jordens kraft samler dig. Du bygger det der skal bære dit liv.' },
    { num: 6, name: 'Modning',         element: 'Jord',  char: '土', range: '35 – 42 år', color: 'rgba(138,122,96,0.55)',  text: 'Frugten modnes. Du høster fra det du har plantet — og planter nyt.' },
    { num: 7, name: 'Høsten',          element: 'Metal', char: '金', range: '42 – 49 år', color: 'rgba(122,154,181,0.70)', text: 'Metallets gave til dig er evnen til at skelne det væsentlige fra det overflødige.' },
    { num: 8, name: 'Stilheden',       element: 'Vand',  char: '水', range: '49 – 56 år', color: 'rgba(80,112,160,0.70)',  text: 'Vandets dybde kalder. Du finder visdom i stilheden, styrke i roen.' },
    { num: 9, name: 'Det Andet Forår', element: 'Træ',   char: '木', range: '56+ år',     color: 'rgba(90,138,106,0.80)',  text: 'Cirklen lukker sig — og åbner igen. Et nyt forår, fri af forventning.' }
  ];

  // ── Element ring colors ──
  var elementColors = {
    'Træ':   { r1: 'rgba(90,138,106,0.55)',  r2: 'rgba(90,138,106,0.45)',  r3: 'rgba(90,138,106,0.60)',  c: 'rgba(144,196,162,0.75)' },
    'Ild':   { r1: 'rgba(160,96,80,0.55)',    r2: 'rgba(160,96,80,0.45)',   r3: 'rgba(160,96,80,0.60)',   c: 'rgba(210,150,130,0.75)' },
    'Jord':  { r1: 'rgba(138,122,96,0.55)',   r2: 'rgba(138,122,96,0.45)',  r3: 'rgba(138,122,96,0.60)',  c: 'rgba(188,172,146,0.75)' },
    'Metal': { r1: 'rgba(122,154,181,0.55)',   r2: 'rgba(122,154,181,0.45)', r3: 'rgba(122,154,181,0.60)', c: 'rgba(196,213,226,0.75)' },
    'Vand':  { r1: 'rgba(80,112,160,0.55)',    r2: 'rgba(80,112,160,0.45)',  r3: 'rgba(80,112,160,0.60)',  c: 'rgba(140,172,210,0.75)' }
  };

  // ── DOM refs ──
  var steps = document.querySelectorAll('.ob-step');
  var dots = document.querySelectorAll('.ob-progress__dot');
  var dayInput = document.getElementById('ob-day');
  var monthInput = document.getElementById('ob-month');
  var yearInput = document.getElementById('ob-year');
  var birthdayBtn = document.getElementById('ob-birthday-btn');
  var errorEl = document.getElementById('ob-error');
  var enterBtn = document.getElementById('ob-enter-btn');

  var currentStep = 1;

  // ── Step transitions ──
  function goToStep(n) {
    var current = document.querySelector('.ob-step--active');
    if (current) {
      current.classList.remove('ob-step--active');
    }

    currentStep = n;

    // Update progress dots
    dots.forEach(function (dot) {
      var dotN = parseInt(dot.dataset.dot, 10);
      dot.classList.toggle('ob-progress__dot--active', dotN === n);
    });

    // Small delay for exit transition
    setTimeout(function () {
      var next = document.querySelector('[data-step="' + n + '"]');
      if (next) {
        next.classList.add('ob-step--active');
        // Re-trigger animations
        next.querySelectorAll('.anim-fade').forEach(function (el) {
          el.style.animation = 'none';
          el.offsetHeight; // reflow
          el.style.animation = '';
        });
      }
    }, 400);
  }

  // ── Navigation buttons ──
  document.querySelectorAll('[data-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (btn.disabled) return;
      var next = parseInt(btn.dataset.next, 10);
      if (next === 3) {
        // Validate birthday before moving to step 3
        if (!validateAndStore()) return;
      }
      if (next === 4) {
        // Calculate and reveal phase
        revealPhase();
      }
      goToStep(next);
    });
  });

  // ── Birthday validation ──
  function checkInputs() {
    var d = dayInput.value.trim();
    var m = monthInput.value.trim();
    var y = yearInput.value.trim();
    birthdayBtn.disabled = !(d && m && y && y.length === 4);
  }

  [dayInput, monthInput, yearInput].forEach(function (input) {
    input.addEventListener('input', function () {
      errorEl.textContent = '';
      checkInputs();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!birthdayBtn.disabled) birthdayBtn.click();
      }
    });
  });

  // Auto-advance between fields
  dayInput.addEventListener('input', function () {
    if (dayInput.value.length >= 2) monthInput.focus();
  });
  monthInput.addEventListener('input', function () {
    if (monthInput.value.length >= 2) yearInput.focus();
  });

  function validateAndStore() {
    var d = parseInt(dayInput.value, 10);
    var m = parseInt(monthInput.value, 10);
    var y = parseInt(yearInput.value, 10);

    if (isNaN(d) || isNaN(m) || isNaN(y)) {
      errorEl.textContent = 'Udfyld venligst alle felter';
      return false;
    }
    if (m < 1 || m > 12) {
      errorEl.textContent = 'Måneden skal være mellem 1 og 12';
      return false;
    }
    if (d < 1 || d > 31) {
      errorEl.textContent = 'Dagen skal være mellem 1 og 31';
      return false;
    }
    if (y < 1920 || y > new Date().getFullYear()) {
      errorEl.textContent = 'Indtast et gyldigt fødselsår';
      return false;
    }

    // Validate actual date
    var date = new Date(y, m - 1, d);
    if (date.getDate() !== d || date.getMonth() !== m - 1) {
      errorEl.textContent = 'Denne dato findes ikke';
      return false;
    }
    if (date > new Date()) {
      errorEl.textContent = 'Fødselsdatoen kan ikke være i fremtiden';
      return false;
    }

    // Store
    var isoStr = y + '-' + String(m).padStart(2, '0') + '-' + String(d).padStart(2, '0');
    localStorage.setItem('dnl_birthday', isoStr);
    return true;
  }

  // ── Phase calculation ──
  function getPhase(birthday) {
    var now = new Date();
    var age = now.getFullYear() - birthday.getFullYear();
    var monthDiff = now.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthday.getDate())) {
      age--;
    }

    if (age < 7)  return phases[0];
    if (age < 14) return phases[1];
    if (age < 21) return phases[2];
    if (age < 28) return phases[3];
    if (age < 35) return phases[4];
    if (age < 42) return phases[5];
    if (age < 49) return phases[6];
    if (age < 56) return phases[7];
    return phases[8];
  }

  function revealPhase() {
    var bday = localStorage.getItem('dnl_birthday');
    if (!bday) return;

    var parts = bday.split('-');
    var birthday = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
    var phase = getPhase(birthday);
    var colors = elementColors[phase.element];

    // Store phase info
    localStorage.setItem('dnl_phase', JSON.stringify(phase));

    // Update reveal UI
    document.getElementById('ob-reveal-char').textContent = phase.char;
    document.getElementById('ob-reveal-title').textContent = phase.element + ' · ' + phase.name;
    document.getElementById('ob-reveal-meta').textContent = 'Fase ' + phase.num + ' · ' + phase.range;
    document.getElementById('ob-reveal-text').textContent = phase.text;

    // Color the rings
    var rings = document.querySelectorAll('.ob-reveal-ring');
    if (rings[0]) rings[0].setAttribute('stroke', colors.r1);
    if (rings[1]) rings[1].setAttribute('stroke', colors.r2);
    if (rings[2]) rings[2].setAttribute('stroke', colors.r3);
    if (rings[3]) rings[3].setAttribute('fill', colors.c);
  }

  // ── Enter app ──
  enterBtn.addEventListener('click', function () {
    localStorage.setItem('dnl_onboarded', 'true');
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 800);
  });

})();
