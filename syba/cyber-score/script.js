/* ==========================================================================
   SYBA Cyber Score — Application Logic
   Pure vanilla JS, no frameworks
   ========================================================================== */

(function () {
  'use strict';

  /* --------------------------------------------------------------------------
     Quiz Data
     -------------------------------------------------------------------------- */

  const CATEGORIES = [
    {
      id: 'network',
      name: 'Network Security',
      icon: 'wifi',
      questions: [
        {
          id: 'q1',
          text: 'How old is your home WiFi router?',
          options: [
            { text: 'Less than 1 year', points: 10 },
            { text: '1\u20133 years', points: 7 },
            { text: '3\u20135 years', points: 4 },
            { text: 'More than 5 years', points: 1 },
            { text: "I don\u2019t know", points: 0 }
          ]
        },
        {
          id: 'q2',
          text: "Have you changed your router\u2019s default admin password?",
          options: [
            { text: 'Yes', points: 10 },
            { text: 'No', points: 0 },
            { text: "What\u2019s that?", points: 0 }
          ]
        },
        {
          id: 'q3',
          text: 'Do you use a VPN on your home network?',
          options: [
            { text: 'Always', points: 10 },
            { text: 'Sometimes', points: 5 },
            { text: 'Never', points: 0 },
            { text: "What\u2019s a VPN?", points: 0 }
          ]
        }
      ]
    },
    {
      id: 'email',
      name: 'Email & Account Security',
      icon: 'shield',
      questions: [
        {
          id: 'q4',
          text: 'Do you use two-factor authentication (2FA) on your main email?',
          options: [
            { text: 'Hardware key (YubiKey, etc.)', points: 10 },
            { text: 'Authenticator app', points: 8 },
            { text: 'SMS codes', points: 4 },
            { text: 'No', points: 0 }
          ]
        },
        {
          id: 'q5',
          text: 'Do you use a password manager?',
          options: [
            { text: 'Yes, for everything', points: 10 },
            { text: 'Yes, for some accounts', points: 6 },
            { text: 'No, I reuse passwords', points: 0 },
            { text: 'No, I write them down', points: 2 }
          ]
        },
        {
          id: 'q6',
          text: 'Have you checked if your email has appeared in a data breach?',
          options: [
            { text: 'Yes, recently', points: 10 },
            { text: 'Yes, a while ago', points: 5 },
            { text: 'No', points: 0 },
            { text: 'How do I check?', points: 0 }
          ]
        }
      ]
    },
    {
      id: 'device',
      name: 'Device Security',
      icon: 'laptop',
      questions: [
        {
          id: 'q7',
          text: 'Are your devices (phone, laptop, tablet) set to auto-update?',
          options: [
            { text: 'All of them', points: 10 },
            { text: 'Most of them', points: 7 },
            { text: 'Some', points: 3 },
            { text: 'None', points: 0 }
          ]
        },
        {
          id: 'q8',
          text: 'Do you use antivirus/endpoint protection on all personal devices?',
          options: [
            { text: 'Yes, paid solution', points: 10 },
            { text: 'Yes, free solution', points: 6 },
            { text: 'Only on some devices', points: 3 },
            { text: 'No', points: 0 }
          ]
        },
        {
          id: 'q9',
          text: 'Is your laptop/desktop hard drive encrypted?',
          options: [
            { text: 'Yes', points: 10 },
            { text: "I don\u2019t know", points: 2 },
            { text: 'No', points: 0 }
          ]
        }
      ]
    },
    {
      id: 'social',
      name: 'Social Engineering Awareness',
      icon: 'users',
      questions: [
        {
          id: 'q10',
          text: 'Could you identify a deepfake video call of someone you know?',
          options: [
            { text: "Yes, I\u2019ve been trained", points: 10 },
            { text: 'Maybe', points: 4 },
            { text: 'Probably not', points: 1 },
            { text: "What\u2019s a deepfake?", points: 0 }
          ]
        },
        {
          id: 'q11',
          text: 'If you received an urgent wire transfer request via email from your spouse, what would you do?',
          options: [
            { text: 'Call them on a different channel to verify', points: 10 },
            { text: 'Check the email carefully', points: 5 },
            { text: 'Send it if it looks legit', points: 0 }
          ]
        },
        {
          id: 'q12',
          text: 'Does your family have a code word for verifying large financial requests?',
          options: [
            { text: 'Yes', points: 10 },
            { text: 'No but good idea', points: 3 },
            { text: 'No', points: 0 }
          ]
        }
      ]
    },
    {
      id: 'financial',
      name: 'Financial & Insurance Protection',
      icon: 'dollar',
      questions: [
        {
          id: 'q13',
          text: 'Do you have personal cyber insurance (separate from homeowners)?',
          options: [
            { text: 'Yes, with $1M+ coverage', points: 10 },
            { text: 'Yes, basic coverage', points: 6 },
            { text: 'No', points: 0 },
            { text: "I didn\u2019t know that existed", points: 0 }
          ]
        },
        {
          id: 'q14',
          text: 'Do you monitor your credit/identity for unauthorized activity?',
          options: [
            { text: 'Yes, real-time monitoring', points: 10 },
            { text: 'Yes, periodic checks', points: 5 },
            { text: 'No', points: 0 }
          ]
        },
        {
          id: 'q15',
          text: 'Do you have a documented incident response plan for your family?',
          options: [
            { text: 'Yes, written and practiced', points: 10 },
            { text: 'Somewhat', points: 4 },
            { text: 'No', points: 0 }
          ]
        }
      ]
    }
  ];

  const MAX_POINTS = 150;
  const TOTAL_QUESTIONS = 15;

  /* --------------------------------------------------------------------------
     State
     -------------------------------------------------------------------------- */

  const state = {
    currentCategory: 0,
    currentQuestion: 0,  // within category
    answers: {},         // { q1: { optionIndex, points }, q2: ... }
    email: '',
    score: 0,
    submitted: false
  };

  /* --------------------------------------------------------------------------
     DOM References
     -------------------------------------------------------------------------- */

  const dom = {};

  function cacheDom() {
    dom.heroSection = document.getElementById('heroSection');
    dom.heroCta = document.getElementById('heroCta');
    dom.assessmentSection = document.getElementById('assessmentSection');
    dom.assessmentCard = document.getElementById('assessmentCard');
    dom.resultsSection = document.getElementById('resultsSection');

    // Progress
    dom.progressSegments = document.querySelectorAll('.progress__segment');
    dom.progressLabel = document.getElementById('progressLabel');
    dom.progressCount = document.getElementById('progressCount');

    // Quiz
    dom.quizArea = document.getElementById('quizArea');
    dom.btnBack = document.getElementById('btnBack');
    dom.btnNext = document.getElementById('btnNext');

    // Email gate
    dom.emailGate = document.getElementById('emailGate');
    dom.emailInput = document.getElementById('emailInput');
    dom.emailSubmit = document.getElementById('emailSubmit');
    dom.emailError = document.getElementById('emailError');

    // Results
    dom.scoreNumber = document.getElementById('scoreNumber');
    dom.scoreRingFill = document.getElementById('scoreRingFill');
    dom.scoreRingGlow = document.getElementById('scoreRingGlow');
    dom.gradeLetter = document.getElementById('gradeLetter');
    dom.riskLevel = document.getElementById('riskLevel');
    dom.breakdownContainer = document.getElementById('breakdownContainer');
    dom.risksContainer = document.getElementById('risksContainer');
    dom.shareBtn = document.getElementById('shareBtn');
    dom.premiumBtn = document.getElementById('premiumBtn');
  }

  /* --------------------------------------------------------------------------
     Initialization
     -------------------------------------------------------------------------- */

  function init() {
    cacheDom();
    bindEvents();
    renderQuestion();
    updateProgress();
  }

  document.addEventListener('DOMContentLoaded', init);

  /* --------------------------------------------------------------------------
     Event Binding
     -------------------------------------------------------------------------- */

  function bindEvents() {
    // Hero CTA
    dom.heroCta.addEventListener('click', function (e) {
      e.preventDefault();
      dom.assessmentSection.scrollIntoView({ behavior: 'smooth' });
    });

    // Navigation
    dom.btnBack.addEventListener('click', goBack);
    dom.btnNext.addEventListener('click', goNext);

    // Email gate
    dom.emailSubmit.addEventListener('click', handleEmailSubmit);
    dom.emailInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleEmailSubmit();
      }
    });
    dom.emailInput.addEventListener('input', function () {
      dom.emailInput.classList.remove('email-gate__input--error');
      dom.emailError.classList.remove('email-gate__error--visible');
    });

    // Share
    dom.shareBtn.addEventListener('click', handleShare);

    // Premium
    dom.premiumBtn.addEventListener('click', function () {
      if (CONFIG.stripePaymentLink && CONFIG.stripePaymentLink !== 'STRIPE_PAYMENT_LINK_HERE') {
        window.open(CONFIG.stripePaymentLink, '_blank');
      } else {
        window.open(CONFIG.calendlyUrl, '_blank');
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
  }

  /* --------------------------------------------------------------------------
     Question Rendering
     -------------------------------------------------------------------------- */

  function renderQuestion() {
    var cat = CATEGORIES[state.currentCategory];
    var q = cat.questions[state.currentQuestion];
    var globalIndex = getGlobalQuestionIndex();

    var existingAnswer = state.answers[q.id];

    var html = '<div class="quiz__step quiz__step--active" role="group" aria-labelledby="questionText">';
    html += '<div class="quiz__category">' + escapeHtml(cat.name) + '</div>';
    html += '<div class="quiz__question-number">Question ' + (globalIndex + 1) + ' of ' + TOTAL_QUESTIONS + '</div>';
    html += '<h2 class="quiz__question" id="questionText">' + escapeHtml(q.text) + '</h2>';
    html += '<div class="quiz__options" role="radiogroup" aria-label="Answer options">';

    for (var i = 0; i < q.options.length; i++) {
      var opt = q.options[i];
      var selected = existingAnswer && existingAnswer.optionIndex === i;
      html += '<button class="quiz__option' + (selected ? ' quiz__option--selected' : '') + '" ';
      html += 'role="radio" aria-checked="' + (selected ? 'true' : 'false') + '" ';
      html += 'tabindex="' + (i === 0 ? '0' : '-1') + '" ';
      html += 'data-question="' + q.id + '" data-index="' + i + '" data-points="' + opt.points + '">';
      html += '<span class="quiz__option-radio" aria-hidden="true"></span>';
      html += '<span class="quiz__option-text">' + escapeHtml(opt.text) + '</span>';
      html += '</button>';
    }

    html += '</div></div>';

    dom.quizArea.innerHTML = html;

    // Bind option clicks
    var options = dom.quizArea.querySelectorAll('.quiz__option');
    for (var j = 0; j < options.length; j++) {
      options[j].addEventListener('click', handleOptionSelect);
    }

    // Arrow key navigation within options
    for (var k = 0; k < options.length; k++) {
      options[k].addEventListener('keydown', handleOptionKeydown);
    }

    // Update nav buttons
    updateNavButtons();
  }

  function handleOptionSelect(e) {
    var btn = e.currentTarget;
    var questionId = btn.getAttribute('data-question');
    var optionIndex = parseInt(btn.getAttribute('data-index'), 10);
    var points = parseInt(btn.getAttribute('data-points'), 10);

    // Store answer
    state.answers[questionId] = { optionIndex: optionIndex, points: points };

    // Update visual state
    var allOptions = dom.quizArea.querySelectorAll('.quiz__option');
    for (var i = 0; i < allOptions.length; i++) {
      allOptions[i].classList.remove('quiz__option--selected');
      allOptions[i].setAttribute('aria-checked', 'false');
    }
    btn.classList.add('quiz__option--selected');
    btn.setAttribute('aria-checked', 'true');

    // Auto-advance after 500ms
    setTimeout(function () {
      goNext();
    }, 500);
  }

  function handleOptionKeydown(e) {
    var options = dom.quizArea.querySelectorAll('.quiz__option');
    var idx = Array.prototype.indexOf.call(options, e.currentTarget);

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      var next = (idx + 1) % options.length;
      options[next].focus();
      options[next].setAttribute('tabindex', '0');
      e.currentTarget.setAttribute('tabindex', '-1');
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      var prev = (idx - 1 + options.length) % options.length;
      options[prev].focus();
      options[prev].setAttribute('tabindex', '0');
      e.currentTarget.setAttribute('tabindex', '-1');
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.currentTarget.click();
    }
  }

  /* --------------------------------------------------------------------------
     Navigation
     -------------------------------------------------------------------------- */

  function goBack() {
    if (state.currentQuestion > 0) {
      state.currentQuestion--;
    } else if (state.currentCategory > 0) {
      state.currentCategory--;
      state.currentQuestion = CATEGORIES[state.currentCategory].questions.length - 1;
    }
    renderQuestion();
    updateProgress();
  }

  function goNext() {
    var cat = CATEGORIES[state.currentCategory];
    var q = cat.questions[state.currentQuestion];

    // Must have answered
    if (!state.answers[q.id]) return;

    if (state.currentQuestion < cat.questions.length - 1) {
      state.currentQuestion++;
    } else if (state.currentCategory < CATEGORIES.length - 1) {
      state.currentCategory++;
      state.currentQuestion = 0;
    } else {
      // All done -- show email gate
      showEmailGate();
      return;
    }
    renderQuestion();
    updateProgress();
  }

  function updateNavButtons() {
    var isFirst = state.currentCategory === 0 && state.currentQuestion === 0;
    dom.btnBack.disabled = isFirst;
    if (isFirst) {
      dom.btnBack.classList.add('quiz__nav-btn--hidden');
    } else {
      dom.btnBack.classList.remove('quiz__nav-btn--hidden');
    }

    var cat = CATEGORIES[state.currentCategory];
    var q = cat.questions[state.currentQuestion];
    var answered = !!state.answers[q.id];
    dom.btnNext.disabled = !answered;

    var isLast = state.currentCategory === CATEGORIES.length - 1 &&
                 state.currentQuestion === cat.questions.length - 1;
    dom.btnNext.textContent = isLast ? 'See My Score' : 'Next';
  }

  function handleKeyboard(e) {
    // Don't interfere with email input
    if (e.target.tagName === 'INPUT') return;

    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      // Only if we're in quiz mode
      if (!dom.emailGate.classList.contains('email-gate--active') &&
          !dom.resultsSection.classList.contains('results--active')) {
        goNext();
      }
    } else if (e.key === 'ArrowLeft') {
      if (!dom.emailGate.classList.contains('email-gate--active') &&
          !dom.resultsSection.classList.contains('results--active')) {
        goBack();
      }
    }
  }

  /* --------------------------------------------------------------------------
     Progress Bar
     -------------------------------------------------------------------------- */

  function updateProgress() {
    var globalIndex = getGlobalQuestionIndex();

    for (var i = 0; i < dom.progressSegments.length; i++) {
      var seg = dom.progressSegments[i];
      var fill = seg.querySelector('.progress__segment-fill');
      seg.classList.remove('progress__segment--complete', 'progress__segment--active');

      if (i < state.currentCategory) {
        seg.classList.add('progress__segment--complete');
        fill.style.width = '100%';
      } else if (i === state.currentCategory) {
        var pct = ((state.currentQuestion + 1) / CATEGORIES[i].questions.length) * 100;
        // If user hasn't answered the current question yet, show partial
        var q = CATEGORIES[i].questions[state.currentQuestion];
        if (!state.answers[q.id]) {
          pct = (state.currentQuestion / CATEGORIES[i].questions.length) * 100;
        }
        if (pct >= 100) {
          seg.classList.add('progress__segment--complete');
        } else {
          seg.classList.add('progress__segment--active');
        }
        fill.style.width = Math.min(pct, 100) + '%';
      } else {
        fill.style.width = '0%';
      }
    }

    dom.progressLabel.textContent = CATEGORIES[state.currentCategory].name;
    dom.progressCount.textContent = (globalIndex + 1) + ' / ' + TOTAL_QUESTIONS;
  }

  function getGlobalQuestionIndex() {
    var idx = 0;
    for (var i = 0; i < state.currentCategory; i++) {
      idx += CATEGORIES[i].questions.length;
    }
    idx += state.currentQuestion;
    return idx;
  }

  /* --------------------------------------------------------------------------
     Email Gate
     -------------------------------------------------------------------------- */

  function showEmailGate() {
    dom.quizArea.style.display = 'none';
    document.querySelector('.quiz__nav').style.display = 'none';
    document.querySelector('.progress').style.display = 'none';
    dom.emailGate.classList.add('email-gate--active');
    dom.emailInput.focus();
  }

  function handleEmailSubmit() {
    var email = dom.emailInput.value.trim();

    if (!isValidEmail(email)) {
      dom.emailInput.classList.add('email-gate__input--error');
      dom.emailError.textContent = 'Please enter a valid email address.';
      dom.emailError.classList.add('email-gate__error--visible');
      dom.emailInput.focus();
      return;
    }

    state.email = email;
    dom.emailSubmit.disabled = true;
    dom.emailSubmit.textContent = 'Calculating...';

    // Calculate score
    calculateScore();

    // Save to Supabase (fire and forget)
    saveToSupabase();

    // Show results after brief delay for dramatic effect
    setTimeout(function () {
      dom.emailGate.classList.remove('email-gate--active');
      dom.assessmentSection.style.display = 'none';
      showResults();
    }, 800);
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /* --------------------------------------------------------------------------
     Score Calculation
     -------------------------------------------------------------------------- */

  function calculateScore() {
    var total = 0;
    var keys = Object.keys(state.answers);
    for (var i = 0; i < keys.length; i++) {
      total += state.answers[keys[i]].points;
    }
    state.score = Math.round((total / MAX_POINTS) * 100);
  }

  function getLetterGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  function getRiskLevel(score) {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Moderate Risk';
    if (score >= 40) return 'High Risk';
    return 'Critical Risk';
  }

  function getGradeColor(grade) {
    var colors = { A: '#22C55E', B: '#4ADE80', C: '#F59E0B', D: '#F97316', F: '#EF4444' };
    return colors[grade] || '#EF4444';
  }

  function getCategoryScore(categoryId) {
    var cat = null;
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === categoryId) { cat = CATEGORIES[i]; break; }
    }
    if (!cat) return 0;

    var total = 0;
    var max = cat.questions.length * 10;
    for (var j = 0; j < cat.questions.length; j++) {
      var answer = state.answers[cat.questions[j].id];
      if (answer) total += answer.points;
    }
    return Math.round((total / max) * 100);
  }

  /* --------------------------------------------------------------------------
     Results Rendering
     -------------------------------------------------------------------------- */

  function showResults() {
    dom.resultsSection.classList.add('results--active');
    dom.resultsSection.scrollIntoView({ behavior: 'smooth' });

    var grade = getLetterGrade(state.score);
    var risk = getRiskLevel(state.score);
    var color = getGradeColor(grade);

    // Animate score number counting up
    animateCounter(dom.scoreNumber, 0, state.score, 2000);

    // Animate score ring
    setTimeout(function () {
      var circumference = 628.3; // 2 * PI * 100
      var offset = circumference - (state.score / 100) * circumference;
      dom.scoreRingFill.style.stroke = color;
      dom.scoreRingFill.style.strokeDashoffset = offset;
      dom.scoreRingGlow.style.stroke = color;
      dom.scoreRingGlow.style.strokeDashoffset = offset;
    }, 200);

    // Grade letter
    dom.gradeLetter.textContent = grade;
    dom.gradeLetter.className = 'results__grade-letter results__grade-letter--' + grade.toLowerCase();

    // Risk level
    dom.riskLevel.textContent = risk;
    dom.riskLevel.style.color = color;

    // Category breakdown
    renderBreakdown();

    // Top risks
    renderRisks();
  }

  function animateCounter(el, start, end, duration) {
    var startTime = null;
    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      var current = Math.round(start + (end - start) * eased);
      el.textContent = current;
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  function renderBreakdown() {
    var html = '';
    for (var i = 0; i < CATEGORIES.length; i++) {
      var cat = CATEGORIES[i];
      var score = getCategoryScore(cat.id);
      var color = getGradeColor(getLetterGrade(score));
      html += '<div class="breakdown__item" data-delay="' + (i * 150) + '">';
      html += '<span class="breakdown__label">' + escapeHtml(cat.name) + '</span>';
      html += '<div class="breakdown__bar-track">';
      html += '<div class="breakdown__bar-fill" data-width="' + score + '" style="background:' + color + '"></div>';
      html += '</div>';
      html += '<span class="breakdown__score" style="color:' + color + '">' + score + '%</span>';
      html += '</div>';
    }
    dom.breakdownContainer.innerHTML = html;

    // Animate bars in sequence
    var items = dom.breakdownContainer.querySelectorAll('.breakdown__item');
    for (var j = 0; j < items.length; j++) {
      (function (item, delay) {
        setTimeout(function () {
          item.classList.add('breakdown__item--visible');
          var fill = item.querySelector('.breakdown__bar-fill');
          fill.style.width = fill.getAttribute('data-width') + '%';
        }, 600 + delay);
      })(items[j], parseInt(items[j].getAttribute('data-delay'), 10));
    }
  }

  function renderRisks() {
    // Get category scores and sort ascending
    var scored = [];
    for (var i = 0; i < CATEGORIES.length; i++) {
      scored.push({
        category: CATEGORIES[i],
        score: getCategoryScore(CATEGORIES[i].id)
      });
    }
    scored.sort(function (a, b) { return a.score - b.score; });

    // Take top 3 lowest
    var risks = scored.slice(0, 3);

    var riskDescriptions = {
      network: 'Your home network may be vulnerable to intrusion. An outdated router or weak configuration is often the first entry point for attackers.',
      email: 'Email accounts are the #1 attack vector for families. Without strong authentication and breach monitoring, your accounts are exposed.',
      device: 'Unpatched devices and missing encryption leave your personal data at risk of theft or ransomware.',
      social: 'Social engineering attacks, including deepfakes, are rising fast. Without awareness training and verification protocols, your family is a target.',
      financial: 'Without cyber insurance and identity monitoring, a single incident could cause devastating financial damage with no safety net.'
    };

    var html = '';
    for (var j = 0; j < risks.length; j++) {
      var r = risks[j];
      html += '<div class="risk-card">';
      html += '<div class="risk-card__icon">';
      html += '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';
      html += '</div>';
      html += '<div class="risk-card__content">';
      html += '<div class="risk-card__title">' + escapeHtml(r.category.name) + ' \u2014 ' + r.score + '%</div>';
      html += '<div class="risk-card__desc">' + escapeHtml(riskDescriptions[r.category.id]) + '</div>';
      html += '</div></div>';
    }
    dom.risksContainer.innerHTML = html;
  }

  /* --------------------------------------------------------------------------
     Supabase Integration
     -------------------------------------------------------------------------- */

  function saveToSupabase() {
    try {
      if (typeof supabase === 'undefined' || !window.supabase) return;

      var client = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);

      var categoryScores = {};
      for (var i = 0; i < CATEGORIES.length; i++) {
        categoryScores[CATEGORIES[i].id] = getCategoryScore(CATEGORIES[i].id);
      }

      client.from('cyber_scores').insert({
        email: state.email,
        score: state.score,
        grade: getLetterGrade(state.score),
        risk_level: getRiskLevel(state.score),
        answers: state.answers,
        category_scores: categoryScores,
        created_at: new Date().toISOString()
      }).then(function (result) {
        if (result.error) {
          console.warn('Supabase save error:', result.error.message);
        }
      });
    } catch (err) {
      console.warn('Supabase not available:', err.message);
    }
  }

  /* --------------------------------------------------------------------------
     Share Functionality
     -------------------------------------------------------------------------- */

  function handleShare() {
    var text = 'I scored ' + state.score + '/100 on the SYBA Cyber Score. ' +
               'How safe is YOUR family? Take the free assessment: ' +
               window.location.href.split('?')[0];

    if (navigator.share) {
      navigator.share({
        title: 'My SYBA Cyber Score',
        text: text,
        url: window.location.href.split('?')[0]
      }).catch(function () {
        copyToClipboard(text);
      });
    } else {
      copyToClipboard(text);
    }
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        showToast('Score copied to clipboard');
      }).catch(function () {
        fallbackCopy(text);
      });
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showToast('Score copied to clipboard');
    } catch (e) {
      showToast('Could not copy');
    }
    document.body.removeChild(ta);
  }

  /* --------------------------------------------------------------------------
     Toast Notification
     -------------------------------------------------------------------------- */

  function showToast(message) {
    var container = document.querySelector('.toast-container');
    if (!container) return;

    var toast = document.createElement('div');
    toast.className = 'toast toast--success';
    toast.textContent = message;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(function () {
      toast.classList.add('toast--visible');
    });

    // Remove after 3s
    setTimeout(function () {
      toast.classList.remove('toast--visible');
      setTimeout(function () {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, 3000);
  }

  /* --------------------------------------------------------------------------
     Utilities
     -------------------------------------------------------------------------- */

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

})();
