(function () {
  'use strict';

  // --- Agent definitions ---
  var AGENTS = [
    { id: 'network',    name: 'Network Scanner',       icon: 'shield' },
    { id: 'vuln',       name: 'Vulnerability Detector', icon: 'alert' },
    { id: 'threat',     name: 'Threat Intelligence',    icon: 'eye' },
    { id: 'compliance', name: 'Compliance Checker',     icon: 'file' },
    { id: 'data',       name: 'Data Protection',        icon: 'lock' },
    { id: 'insurance',  name: 'Insurance Evaluator',    icon: 'umbrella' }
  ];

  var STATUS_MESSAGES = [
    'Initializing agent swarm...',
    'Scanning network perimeter...',
    'Checking for known vulnerabilities...',
    'Analyzing threat landscape...',
    'Evaluating compliance posture...',
    'Assessing data protection...',
    'Calculating insurance risk...',
    'Compiling results...'
  ];

  var RISK_TEMPLATES = {
    network: [
      { title: 'No Web Application Firewall Detected', desc: 'Your web application is directly exposed to the internet without a WAF layer to filter malicious traffic.', severity: 'High' },
      { title: 'DNS Records Expose Internal Infrastructure', desc: 'Several DNS records point to internal IP addresses, revealing your network topology to potential attackers.', severity: 'Medium' },
      { title: 'Open Ports Detected on Public IP', desc: 'Multiple non-essential ports are accessible from the public internet, increasing your attack surface.', severity: 'High' }
    ],
    vuln: [
      { title: 'Outdated TLS Configuration', desc: 'Your server supports TLS 1.0 and 1.1 which have known vulnerabilities. Only TLS 1.2+ should be enabled.', severity: 'Critical' },
      { title: 'Known CVEs in Web Server', desc: 'The detected web server version has 3 publicly disclosed vulnerabilities that could allow remote code execution.', severity: 'Critical' },
      { title: 'Missing Security Headers', desc: 'Content-Security-Policy and X-Frame-Options headers are not set, leaving you vulnerable to XSS and clickjacking.', severity: 'Medium' }
    ],
    threat: [
      { title: 'Domain Mentioned in Threat Feed', desc: 'Your domain appears in a recent threat intelligence feed associated with phishing campaign targets in your industry.', severity: 'High' },
      { title: 'Employee Credentials Found in Breach Database', desc: 'Multiple email addresses from your domain were found in known data breach databases.', severity: 'Critical' }
    ],
    compliance: [
      { title: 'Missing GDPR Consent Mechanism', desc: 'No cookie consent banner or privacy preference center detected. This is a GDPR compliance requirement.', severity: 'High' },
      { title: 'No Cookie Policy Detected', desc: 'Your website sets tracking cookies without a visible cookie policy, violating ePrivacy regulations.', severity: 'Medium' },
      { title: 'NIS2 Incident Reporting Gap', desc: 'No evidence of a 24-hour incident notification process as required by NIS2 directive.', severity: 'High' }
    ],
    data: [
      { title: 'No Content Security Policy', desc: 'Without CSP headers, your site is vulnerable to cross-site scripting attacks that can steal user data.', severity: 'High' },
      { title: 'Mixed Content Detected', desc: 'Some resources load over HTTP instead of HTTPS, potentially allowing man-in-the-middle attacks.', severity: 'Medium' }
    ],
    insurance: [
      { title: 'No Cyber Insurance Coverage Detected', desc: 'Based on your digital footprint, there is no evidence of active cyber insurance. A single breach could cost 10x your annual revenue.', severity: 'Critical' },
      { title: 'Insufficient Coverage for Business Size', desc: 'Your estimated company size suggests you need at minimum $1M in cyber liability coverage.', severity: 'High' }
    ]
  };

  // --- Utility: deterministic hash from string ---
  function hashString(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) & 0xFFFFFFFF;
    }
    return Math.abs(hash);
  }

  function seededRandom(seed) {
    var x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function randomFromSeed(seed, index, min, max) {
    return Math.floor(seededRandom(seed + index * 7919) * (max - min + 1)) + min;
  }

  function getGrade(score) {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  function getGradeColor(grade) {
    var colors = { A: '#22c55e', B: '#4ade80', C: '#f59e0b', D: '#f97316', F: '#ef4444' };
    return colors[grade] || '#a3a3a3';
  }

  function getRiskLevel(score) {
    if (score >= 80) return 'Low Risk';
    if (score >= 60) return 'Moderate Risk';
    if (score >= 40) return 'High Risk';
    return 'Critical Risk';
  }

  function getSeverityClass(sev) {
    return 'risk-card__severity--' + sev.toLowerCase();
  }

  // --- SVG icon helpers ---
  var ICONS = {
    shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    alert: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>',
    eye: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    file: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
    lock: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    umbrella: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-4V4a2 2 0 0 0-4 0v6H6l6 8 6-8z"/><line x1="6" y1="22" x2="18" y2="22"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
  };

  // --- Generate results from URL ---
  function generateResults(url) {
    var seed = hashString(url.toLowerCase().trim());
    var categories = {};
    var catKeys = ['Network Security', 'Vulnerability Management', 'Threat Exposure', 'Regulatory Compliance', 'Data Protection', 'Insurance Coverage'];
    var agentIds = ['network', 'vuln', 'threat', 'compliance', 'data', 'insurance'];

    for (var i = 0; i < catKeys.length; i++) {
      categories[catKeys[i]] = {
        score: randomFromSeed(seed, i, 25, 85),
        agentId: agentIds[i]
      };
    }

    // Insurance always lower to drive CTA
    categories['Insurance Coverage'].score = randomFromSeed(seed, 10, 10, 45);

    var total = 0;
    var keys = Object.keys(categories);
    for (var j = 0; j < keys.length; j++) {
      total += categories[keys[j]].score;
    }
    total = Math.round(total / keys.length);

    // Pick risks from lowest scoring categories
    var sorted = keys.slice().sort(function (a, b) { return categories[a].score - categories[b].score; });
    var risks = [];
    for (var k = 0; k < Math.min(4, sorted.length); k++) {
      var catAgentId = categories[sorted[k]].agentId;
      var templates = RISK_TEMPLATES[catAgentId];
      if (templates && templates.length > 0) {
        var riskIdx = randomFromSeed(seed, k + 20, 0, templates.length - 1);
        risks.push(templates[riskIdx]);
      }
    }

    return {
      total: total,
      grade: getGrade(total),
      categories: categories,
      risks: risks
    };
  }

  // --- DOM references ---
  var stageInput = document.getElementById('stageInput');
  var stageSwarm = document.getElementById('stageSwarm');
  var stageResults = document.getElementById('stageResults');
  var urlInput = document.getElementById('urlInput');
  var scanBtn = document.getElementById('scanBtn');
  var swarmStatus = document.getElementById('swarmStatus');
  var progressFill = document.getElementById('progressFill');
  var progressPct = document.getElementById('progressPct');
  var swarmNodes = document.getElementById('swarmNodes');
  var swarmLines = document.getElementById('swarmLines');
  var scoreRingFill = document.getElementById('scoreRingFill');
  var scoreNumber = document.getElementById('scoreNumber');
  var gradeLetter = document.getElementById('gradeLetter');
  var riskLevel = document.getElementById('riskLevel');
  var resultsDomain = document.getElementById('resultsDomain');
  var breakdownCards = document.getElementById('breakdownCards');
  var risksList = document.getElementById('risksList');
  var retakeBtn = document.getElementById('retakeBtn');

  // --- Show/hide stages ---
  function showStage(el) {
    stageInput.classList.add('demo__stage--hidden');
    stageSwarm.classList.add('demo__stage--hidden');
    stageResults.classList.add('demo__stage--hidden');
    el.classList.remove('demo__stage--hidden');
  }

  // --- Build swarm nodes ---
  function buildSwarmNodes() {
    swarmNodes.innerHTML = '';
    swarmLines.innerHTML = '';
    var swarmEl = document.getElementById('swarmContainer');
    var containerW = swarmEl.offsetWidth || 460;
    var containerH = swarmEl.offsetHeight || 340;
    var cx = containerW / 2;
    var cy = containerH / 2;
    var rx = containerW * 0.39;
    var ry = containerH * 0.38;

    for (var i = 0; i < AGENTS.length; i++) {
      var angle = (Math.PI * 2 / AGENTS.length) * i - Math.PI / 2;
      var x = cx + rx * Math.cos(angle);
      var y = cy + ry * Math.sin(angle);

      // Node
      var node = document.createElement('div');
      node.className = 'swarm__node';
      node.id = 'node-' + AGENTS[i].id;
      node.style.left = x + 'px';
      node.style.top = y + 'px';
      node.innerHTML = '<div class="swarm__node-circle">' + ICONS[AGENTS[i].icon] + '</div>' +
                        '<span class="swarm__node-label">' + AGENTS[i].name + '</span>';
      swarmNodes.appendChild(node);

      // SVG line
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', cx);
      line.setAttribute('y1', cy);
      line.setAttribute('x2', x);
      line.setAttribute('y2', y);
      line.setAttribute('class', 'swarm__line');
      line.id = 'line-' + AGENTS[i].id;
      swarmLines.appendChild(line);
    }
  }

  // --- Animate swarm ---
  function animateSwarm(callback) {
    buildSwarmNodes();
    var idx = 0;
    var statusIdx = 0;
    var progress = 0;
    var totalDuration = 5000;
    var startTime = Date.now();

    // Status message cycling
    var statusInterval = setInterval(function () {
      statusIdx = (statusIdx + 1) % STATUS_MESSAGES.length;
      swarmStatus.textContent = STATUS_MESSAGES[statusIdx];
    }, 700);

    // Progress bar
    var progressInterval = setInterval(function () {
      var elapsed = Date.now() - startTime;
      progress = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      progressFill.style.width = progress + '%';
      progressPct.textContent = progress + '%';

      if (progress >= 100) {
        clearInterval(progressInterval);
      }
    }, 50);

    // Node activation stagger
    function activateNext() {
      if (idx >= AGENTS.length) {
        setTimeout(function () {
          clearInterval(statusInterval);
          swarmStatus.textContent = 'Analysis complete.';

          // Mark all complete
          for (var c = 0; c < AGENTS.length; c++) {
            var n = document.getElementById('node-' + AGENTS[c].id);
            if (n) {
              n.classList.remove('swarm__node--active');
              n.classList.add('swarm__node--complete');
            }
          }

          setTimeout(callback, 600);
        }, 800);
        return;
      }

      var nodeEl = document.getElementById('node-' + AGENTS[idx].id);
      var lineEl = document.getElementById('line-' + AGENTS[idx].id);
      if (nodeEl) {
        nodeEl.classList.add('swarm__node--active');
        nodeEl.style.animationDelay = '0ms';
      }
      if (lineEl) {
        lineEl.classList.add('swarm__line--active');
      }

      idx++;
      setTimeout(activateNext, 600);
    }

    setTimeout(activateNext, 400);
  }

  // --- Animate score ring ---
  function animateScore(score, grade) {
    var circumference = 2 * Math.PI * 88;
    var color = getGradeColor(grade);
    scoreRingFill.style.stroke = color;
    scoreRingFill.style.strokeDasharray = circumference;
    scoreRingFill.style.strokeDashoffset = circumference;

    // Trigger animation
    requestAnimationFrame(function () {
      var offset = circumference - (score / 100) * circumference;
      scoreRingFill.style.transition = 'stroke-dashoffset 2s cubic-bezier(0.16, 1, 0.3, 1)';
      scoreRingFill.style.strokeDashoffset = offset;
    });

    // Count up number
    var current = 0;
    var duration = 2000;
    var start = Date.now();
    function tick() {
      var elapsed = Date.now() - start;
      var t = Math.min(elapsed / duration, 1);
      // Ease out cubic
      var eased = 1 - Math.pow(1 - t, 3);
      current = Math.round(eased * score);
      scoreNumber.textContent = current;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Grade letter
    gradeLetter.textContent = grade;
    gradeLetter.className = 'results__grade-letter results__grade-letter--' + grade.toLowerCase();
    gradeLetter.style.color = color;

    riskLevel.textContent = getRiskLevel(score);
    riskLevel.style.color = color;
  }

  // --- Render category breakdown ---
  function renderBreakdown(categories) {
    breakdownCards.innerHTML = '';
    var keys = Object.keys(categories);
    for (var i = 0; i < keys.length; i++) {
      var cat = categories[keys[i]];
      var score = cat.score;
      var grade = getGrade(score);
      var color = getGradeColor(grade);
      var statusDot = score >= 70 ? 'breakdown__dot--good' : score >= 50 ? 'breakdown__dot--warn' : 'breakdown__dot--bad';

      var card = document.createElement('div');
      card.className = 'breakdown__card';
      card.style.animationDelay = (i * 150) + 'ms';

      card.innerHTML =
        '<div class="breakdown__card-header">' +
          '<div class="breakdown__dot ' + statusDot + '"></div>' +
          '<span class="breakdown__card-name">' + keys[i] + '</span>' +
          '<span class="breakdown__card-score" style="color:' + color + '">' + score + '</span>' +
        '</div>' +
        '<div class="breakdown__bar-track">' +
          '<div class="breakdown__bar-fill" style="width:0%;background:' + color + '"></div>' +
        '</div>';

      breakdownCards.appendChild(card);

      // Animate bar
      (function (c, s) {
        setTimeout(function () {
          var fill = c.querySelector('.breakdown__bar-fill');
          if (fill) fill.style.width = s + '%';
        }, 300 + i * 150);
      })(card, score);
    }
  }

  // --- Render risks ---
  function renderRisks(risks) {
    risksList.innerHTML = '';
    for (var i = 0; i < risks.length; i++) {
      var risk = risks[i];
      var card = document.createElement('div');
      card.className = 'risk-card';
      card.style.animationDelay = (i * 120) + 'ms';

      card.innerHTML =
        '<div class="risk-card__header">' +
          '<span class="risk-card__severity ' + getSeverityClass(risk.severity) + '">' + risk.severity + '</span>' +
        '</div>' +
        '<h4 class="risk-card__title">' + risk.title + '</h4>' +
        '<p class="risk-card__desc">' + risk.desc + '</p>' +
        '<span class="risk-card__fix-tag">AI agent can fix automatically</span>';

      risksList.appendChild(card);
    }
  }

  // --- Start scan ---
  function startScan() {
    var url = urlInput.value.trim();
    if (!url) {
      urlInput.classList.add('demo__input--error');
      setTimeout(function () { urlInput.classList.remove('demo__input--error'); }, 1500);
      return;
    }

    showStage(stageSwarm);

    // Reset progress
    progressFill.style.width = '0%';
    progressFill.style.transition = 'none';
    requestAnimationFrame(function () {
      progressFill.style.transition = 'width 0.3s ease';
    });
    progressPct.textContent = '0%';

    animateSwarm(function () {
      var results = generateResults(url);

      // Set domain
      resultsDomain.textContent = url;

      // Show results stage
      showStage(stageResults);

      // Animate
      setTimeout(function () {
        animateScore(results.total, results.grade);
        renderBreakdown(results.categories);
        renderRisks(results.risks);
      }, 200);

      // Save to Supabase (fire and forget)
      saveResult(url, results);
    });
  }

  // --- Supabase save ---
  function saveResult(url, results) {
    try {
      if (!window.CONFIG || !CONFIG.supabaseUrl) return;
      var sb = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
      sb.from('cyber_scores').insert({
        website_url: url,
        total_score: results.total,
        letter_grade: results.grade,
        category_scores: results.categories,
        top_risks: results.risks.map(function (r) { return r.title; })
      }).then(function () {}).catch(function () {});
    } catch (e) {
      // Silently fail
    }
  }

  // --- Retake ---
  function resetDemo() {
    urlInput.value = '';
    scoreNumber.textContent = '0';
    scoreRingFill.style.transition = 'none';
    scoreRingFill.style.strokeDashoffset = 2 * Math.PI * 88;
    showStage(stageInput);
    urlInput.focus();
  }

  // --- Smooth scroll ---
  function smoothScroll(target) {
    var el = document.querySelector(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- Init ---
  document.addEventListener('DOMContentLoaded', function () {
    // Scan button
    scanBtn.addEventListener('click', startScan);

    // Enter key
    urlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') startScan();
    });

    // Retake
    retakeBtn.addEventListener('click', resetDemo);

    // Smooth scroll for anchor links
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href && href.length > 1) {
          e.preventDefault();
          smoothScroll(href);
        }
      });
    }

    // Nav scroll effect
    var nav = document.querySelector('.nav');
    window.addEventListener('scroll', function () {
      if (window.scrollY > 20) {
        nav.classList.add('nav--scrolled');
      } else {
        nav.classList.remove('nav--scrolled');
      }
    });
  });
})();
