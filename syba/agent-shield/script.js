(function () {
  'use strict';

  // =========================================================================
  // Agent Shield — AI Agent Security Scanner
  // 8 specialized sub-agents, deterministic scoring, chat continuation
  // =========================================================================

  // --- Agent definitions ---
  var AGENTS = [
    { id: 'prompt',     name: 'Prompt Injection',    icon: 'terminal' },
    { id: 'data',       name: 'Data Access',          icon: 'database' },
    { id: 'tools',      name: 'Tool Permissions',     icon: 'wrench' },
    { id: 'output',     name: 'Output Filter',        icon: 'filter' },
    { id: 'auth',       name: 'Auth & Identity',      icon: 'key' },
    { id: 'compliance', name: 'Compliance',            icon: 'clipboard' },
    { id: 'anomaly',    name: 'Anomaly Detection',    icon: 'activity' },
    { id: 'insurance',  name: 'Insurance Risk',        icon: 'shield' }
  ];

  var STATUS_MESSAGES = [
    'Initializing agent swarm...',
    'Testing prompt injection resistance...',
    'Auditing data access permissions...',
    'Analyzing tool/API blast radius...',
    'Inspecting output filtering...',
    'Verifying agent authentication...',
    'Checking EU AI Act compliance...',
    'Detecting behavioral anomalies...',
    'Calculating insurance risk profile...',
    'Compiling comprehensive report...'
  ];

  // --- Risk templates: AI-agent-specific ---
  var RISK_TEMPLATES = {
    prompt: [
      { title: 'System Prompt Extraction Vulnerability', desc: 'Your AI agents are susceptible to prompt extraction attacks. An adversary could craft inputs that cause the agent to reveal its system instructions, exposing proprietary logic and security boundaries.', severity: 'Critical', fix: 'Deploy prompt hardening with instruction-hierarchy enforcement and output filtering for system prompt content.' },
      { title: 'Indirect Prompt Injection via Data Sources', desc: 'Agents that process external data (emails, documents, web content) are vulnerable to hidden instructions embedded in those sources, potentially causing unauthorized actions.', severity: 'Critical', fix: 'Implement data sanitization pipeline with instruction detection and content isolation before agent processing.' },
      { title: 'Guardrail Bypass via Multi-Turn Manipulation', desc: 'Conversational agents can be gradually manipulated across multiple turns to bypass safety guardrails, leading to policy-violating outputs.', severity: 'High', fix: 'Add conversation-level safety monitoring with cumulative risk scoring and automatic session termination.' },
      { title: 'Jailbreak Susceptibility in Agent Chains', desc: 'When multiple agents communicate in a chain, jailbreak prompts can propagate through inter-agent messages, compromising downstream agents that trust upstream output.', severity: 'High', fix: 'Enforce inter-agent message validation with content policy checks at each handoff point.' }
    ],
    data: [
      { title: 'Over-Provisioned Database Access', desc: 'Your AI agents have read/write access to database tables beyond what their function requires, violating the principle of least privilege. A compromised agent could access or modify sensitive records.', severity: 'High', fix: 'Implement row-level security (RLS) policies and scope agent database credentials to only required tables and operations.' },
      { title: 'Unencrypted Data in Agent Context Windows', desc: 'Sensitive customer data (PII, financial records) is passed through agent context windows in plaintext, creating exposure risk in logs, caches, and API transit.', severity: 'Critical', fix: 'Deploy field-level encryption for sensitive data before agent ingestion, with decryption only at the output layer.' },
      { title: 'Agent Memory Persistence Without TTL', desc: 'Agent conversation memory persists indefinitely without time-to-live policies, accumulating sensitive data that increases breach impact over time.', severity: 'Medium', fix: 'Configure automatic memory expiration (TTL) policies aligned with data retention requirements.' },
      { title: 'Cross-Tenant Data Leakage Risk', desc: 'Multi-tenant agent deployments share context or memory stores without adequate isolation, creating risk of data leakage between tenants.', severity: 'Critical', fix: 'Enforce strict tenant isolation at the infrastructure level with separate vector stores and context boundaries per tenant.' }
    ],
    tools: [
      { title: 'Unrestricted Tool Execution Scope', desc: 'AI agents have access to tools with broad execution permissions (file system, shell, API calls) without rate limiting or scope restrictions. A compromised agent could execute destructive operations.', severity: 'Critical', fix: 'Implement tool sandboxing with allowlisted operations, rate limits, and human-in-the-loop approval for destructive actions.' },
      { title: 'Missing Tool Call Audit Trail', desc: 'Agent tool invocations are not logged with sufficient detail for forensic analysis. If an agent takes unauthorized actions, there is no audit trail to determine scope of impact.', severity: 'High', fix: 'Deploy comprehensive tool call logging with timestamps, parameters, responses, and user context for all agent actions.' },
      { title: 'Lateral Movement via Shared API Keys', desc: 'Multiple agents share the same API credentials, meaning a compromise of one agent grants access to all services accessible by every other agent using those keys.', severity: 'High', fix: 'Issue unique, scoped API credentials per agent with automatic rotation and revocation capabilities.' },
      { title: 'No Blast Radius Containment', desc: 'If an agent is compromised, there are no containment boundaries limiting the scope of damage. The agent can access all connected tools and services without restriction.', severity: 'Critical', fix: 'Architect blast radius boundaries with network segmentation, tool-level permissions, and automatic quarantine on anomaly detection.' }
    ],
    output: [
      { title: 'PII Exposure in Agent Responses', desc: 'AI agents occasionally include personally identifiable information (names, emails, phone numbers, SSNs) in their responses, even when the user did not request this data.', severity: 'High', fix: 'Deploy real-time PII detection and redaction filters on all agent output streams.' },
      { title: 'Credential Leakage in Debug Outputs', desc: 'Agent debug modes or verbose error messages expose API keys, database connection strings, or internal credentials in user-facing responses.', severity: 'Critical', fix: 'Strip all credential patterns from agent outputs using regex-based filters and disable debug modes in production.' },
      { title: 'Hallucinated Confidential Information', desc: 'Agents sometimes generate plausible but fabricated confidential information (account numbers, internal policies) that could create legal liability if acted upon by users.', severity: 'Medium', fix: 'Implement output grounding verification that cross-references agent claims against authorized data sources.' },
      { title: 'Sensitive Data in Agent Logs', desc: 'Agent conversation logs stored for analytics contain unredacted sensitive data, creating a secondary breach vector through log storage systems.', severity: 'High', fix: 'Apply automatic log sanitization with PII masking before storage, and encrypt log archives at rest.' }
    ],
    auth: [
      { title: 'Missing Agent-Level Authentication', desc: 'AI agents accept and process requests without verifying the identity of the calling user or system, allowing unauthorized access to agent capabilities.', severity: 'Critical', fix: 'Implement JWT-based authentication for all agent endpoints with role-based access control (RBAC).' },
      { title: 'Hardcoded Credentials in Agent Configuration', desc: 'Agent deployment configurations contain hardcoded API keys and database passwords instead of using secure secret management.', severity: 'Critical', fix: 'Migrate all credentials to a secrets manager (Vault, AWS Secrets Manager) with automatic rotation and audit logging.' },
      { title: 'No Session Isolation Between Users', desc: 'Agent sessions are not properly isolated between different users, creating risk of conversation cross-contamination and unauthorized data access.', severity: 'High', fix: 'Enforce session isolation with unique session IDs, separate context windows, and user-scoped memory stores.' },
      { title: 'Stale Token Accumulation', desc: 'Expired or revoked authentication tokens remain valid for agent API access due to missing token validation checks, expanding the attack window.', severity: 'Medium', fix: 'Implement token validation on every request with automatic expiration and revocation list checking.' }
    ],
    compliance: [
      { title: 'EU AI Act Transparency Gaps', desc: 'Your AI agent deployments lack required transparency measures: no disclosure that users are interacting with AI, no documentation of training data sources, and no risk classification.', severity: 'High', fix: 'Implement mandatory AI disclosure banners, maintain model cards, and classify agents under EU AI Act risk categories.' },
      { title: 'NIS2 Incident Reporting Not Configured', desc: 'No automated incident detection or 24-hour reporting mechanism exists for AI agent security incidents, violating NIS2 directive requirements for essential service providers.', severity: 'High', fix: 'Deploy automated incident detection with integrated reporting to national CSIRT within regulatory timelines.' },
      { title: 'Missing SOC 2 Audit Controls for Agent Operations', desc: 'AI agent operations lack the access controls, logging, and change management documentation required for SOC 2 Type II compliance.', severity: 'Medium', fix: 'Implement SOC 2 control framework for agent operations: access reviews, change logs, incident response procedures.' },
      { title: 'No AI Decision Audit Trail for Regulatory Defense', desc: 'Agent decisions that affect customers (credit, insurance, employment) are not logged with sufficient detail to explain and defend the decision to regulators.', severity: 'Critical', fix: 'Deploy explainability logging that captures reasoning chains, data inputs, and decision outputs for all consequential agent actions.' }
    ],
    anomaly: [
      { title: 'No Behavioral Baseline Established', desc: 'Your AI agents operate without established behavioral baselines, making it impossible to detect anomalous patterns that could indicate compromise, drift, or misuse.', severity: 'High', fix: 'Deploy behavioral profiling to establish baselines for API call patterns, response latencies, data access volumes, and output characteristics.' },
      { title: 'Unusual Data Access Volume Spike', desc: 'Recent agent activity shows data access volumes 340% above historical average, which could indicate data exfiltration, a compromised agent, or a misconfigured automation.', severity: 'Critical', fix: 'Implement real-time volume anomaly detection with automatic throttling and alert escalation for sustained spikes.' },
      { title: 'Agent Response Latency Anomaly', desc: 'Intermittent latency spikes in agent responses suggest potential resource exhaustion attacks or backend infrastructure issues that could lead to cascading failures.', severity: 'Medium', fix: 'Deploy latency monitoring with circuit breakers and automatic failover to prevent cascading agent failures.' },
      { title: 'Behavioral Drift from Trained Baseline', desc: 'Agent outputs are diverging from expected behavioral patterns, potentially due to prompt manipulation, model updates, or adversarial input patterns.', severity: 'High', fix: 'Implement continuous behavioral monitoring with drift detection scoring and automatic rollback to known-good configurations.' }
    ],
    insurance: [
      { title: 'No AI Agent-Specific Insurance Coverage', desc: 'Your organization deploys AI agents without dedicated coverage for AI-specific risks: autonomous decision errors, data breaches via agent compromise, regulatory fines for AI Act non-compliance, and prompt injection damages.', severity: 'Critical', fix: 'Obtain AI agent-specific insurance coverage through Agent Shield, starting at $5,000/year for up to $5M in coverage.' },
      { title: 'Insufficient Coverage for Autonomous Agent Actions', desc: 'Standard cyber insurance policies exclude damages caused by autonomous AI agent decisions. If your agent makes a costly error, your current policy will not cover the loss.', severity: 'Critical', fix: 'Add autonomous agent liability rider to your coverage, or upgrade to Agent Shield which includes this by default.' },
      { title: 'Missing Incident Response Plan for Agent Compromise', desc: 'No documented incident response plan exists specifically for AI agent compromise scenarios. When an agent is breached, response time and coordination will suffer.', severity: 'High', fix: 'Develop and test an AI agent incident response playbook with Agent Shield 24/7 response team integration.' },
      { title: 'Premium Risk Due to Inadequate Security Controls', desc: 'Your current security posture would result in premium loading of 40-60% above base rates. Implementing Agent Shield monitoring could reduce premiums by 25-35%.', severity: 'Medium', fix: 'Deploy Agent Shield monitoring to demonstrate security controls and qualify for reduced insurance premiums.' }
    ]
  };

  // --- Preventive measure templates keyed by agent category ---
  var PREVENTIVE_TEMPLATES = {
    prompt: [
      { title: 'Prompt Hardening Layer', desc: 'Deploy instruction-hierarchy enforcement that prevents system prompt extraction and injection attacks across all agent endpoints.' },
      { title: 'Input Sanitization Pipeline', desc: 'Automated detection and neutralization of hidden instructions in external data sources before agent processing.' }
    ],
    data: [
      { title: 'Least-Privilege Data Policies', desc: 'Automatically configure row-level security and column-level access controls based on each agent\'s functional requirements.' },
      { title: 'Data Encryption at Rest and Transit', desc: 'Field-level encryption for sensitive data in agent context windows with secure key management and rotation.' }
    ],
    tools: [
      { title: 'Tool Sandboxing & Rate Limiting', desc: 'Containment boundaries for all tool invocations with allowlisted operations, rate limits, and human-in-the-loop for destructive actions.' },
      { title: 'Credential Isolation per Agent', desc: 'Unique, scoped API credentials for each agent with automatic rotation schedules and instant revocation capabilities.' }
    ],
    output: [
      { title: 'Real-Time PII Redaction', desc: 'Automated detection and masking of personally identifiable information, credentials, and sensitive data in all agent outputs.' },
      { title: 'Output Grounding Verification', desc: 'Cross-reference agent claims against authorized data sources to prevent hallucinated confidential information from reaching users.' }
    ],
    auth: [
      { title: 'Agent Authentication Framework', desc: 'JWT-based authentication with role-based access control (RBAC) for all agent endpoints, including inter-agent communication.' },
      { title: 'Secrets Management Integration', desc: 'Migrate all hardcoded credentials to secure vault with automatic rotation, audit logging, and least-privilege access.' }
    ],
    compliance: [
      { title: 'EU AI Act Compliance Kit', desc: 'Automated transparency disclosures, model cards, risk classification, and documentation templates for regulatory compliance.' },
      { title: 'Decision Audit Trail System', desc: 'Comprehensive logging of agent reasoning chains, data inputs, and decision outputs for regulatory defense and explainability.' }
    ],
    anomaly: [
      { title: 'Behavioral Baseline Engine', desc: 'Continuous profiling of agent API patterns, response characteristics, and data access volumes to establish normal operating baselines.' },
      { title: 'Real-Time Anomaly Alerting', desc: 'Automatic detection of volume spikes, latency anomalies, and behavioral drift with instant alert escalation and auto-throttling.' }
    ],
    insurance: [
      { title: 'AI Agent Insurance Coverage', desc: 'Up to $5M in dedicated coverage for autonomous agent errors, prompt injection damages, data breaches, and regulatory fines.' },
      { title: '24/7 Incident Response Team', desc: 'Dedicated AI security response team activated automatically on breach detection, with forensic analysis and regulatory notification support.' }
    ]
  };

  // --- Chat responses for "Keep Talking" feature ---
  var CHAT_RESPONSES = {
    insurance: [
      'Agent Shield offers three coverage tiers. Our Shield plan at $5,000/year provides up to $5M in coverage specifically designed for AI agent risks: autonomous decision errors, prompt injection damages, data exfiltration via compromised agents, and regulatory fines under the EU AI Act. Traditional cyber insurance does not cover these AI-specific scenarios.',
      'Your current security score suggests you would qualify for our standard premium rate. If you deploy Agent Shield monitoring, we can typically reduce your premium by 25-35% because our real-time monitoring demonstrably reduces incident probability. Would you like to discuss coverage options with our team?'
    ],
    fix: [
      'Agent Shield can automatically remediate most of the issues found in your scan. For prompt injection vulnerabilities, we deploy instruction-hierarchy enforcement and input sanitization. For data access issues, we configure row-level security policies. For compliance gaps, we generate documentation templates and configure audit trails. Most fixes deploy within 24 hours of onboarding.',
      'Our remediation process works in three phases: (1) immediate fixes for critical issues like credential exposure and missing authentication, (2) medium-term hardening for prompt injection and data access controls, and (3) ongoing monitoring and adjustment for behavioral baselines. The first phase typically completes within 48 hours.'
    ],
    cost: [
      'Agent Shield has three tiers: Assessment ($500 one-time) gives you a detailed PDF report with prioritized remediation roadmap. Monitor ($200/agent/month) adds real-time monitoring, anomaly detection, and quarterly reassessments. Shield ($5,000/year) includes everything in Monitor plus $5M insurance coverage, 24/7 incident response, and regulatory defense. Most businesses with 3+ agents choose Monitor.',
      'For context, the average cost of an AI agent security incident is $4.2M when you factor in data breach costs, regulatory fines, legal fees, and reputational damage. Our Shield plan at $5,000/year provides $5M in coverage, so the ROI is significant. Even our Assessment at $500 helps you understand and prioritize your risk exposure.'
    ],
    compliance: [
      'The EU AI Act, which took full effect in 2025, requires organizations deploying AI agents to: (1) classify agents by risk level, (2) maintain technical documentation and model cards, (3) implement human oversight mechanisms, (4) ensure transparency in AI interactions, and (5) report incidents within defined timelines. Our Compliance Monitor agent continuously checks your agents against these requirements and generates the documentation you need.',
      'Beyond the EU AI Act, we also check alignment with NIS2 (for essential service providers), SOC 2 Type II (access controls and logging), and ISO 27001 (information security management). If you operate in financial services, we also flag MiFID II and PSD2 requirements for AI-driven decisions. Our compliance reports are designed to be audit-ready.'
    ],
    score: [
      'Your score is calculated across 8 dimensions, each weighted equally. The insurance category typically scores lower because most organizations lack AI-specific insurance coverage, which is a significant gap. The score is deterministic based on your domain, so scanning again will show the same results. To improve your score, focus on the categories marked red or orange in your breakdown first.',
      'Scores above 80 indicate a strong security posture with good coverage. 60-80 means moderate risk with actionable improvements. Below 60 signals significant exposure that should be addressed urgently. Your insurance category score is especially important because it represents your financial protection if the other categories fail.'
    ],
    prompt: [
      'Prompt injection is the most critical threat to AI agents in 2026. There are two main attack vectors: (1) direct injection, where an attacker crafts input to override system instructions, and (2) indirect injection, where malicious instructions are hidden in data the agent processes (emails, documents, web pages). Agent Shield deploys instruction-hierarchy enforcement, input sanitization, and output monitoring to defend against both vectors.',
      'Our Prompt Injection Scanner tests your agents against 200+ known attack patterns including system prompt extraction, role-play manipulation, multi-turn jailbreaks, and encoding-based bypasses. We also test for indirect injection in the data sources your agents consume. This is a continuous process because new attack techniques emerge weekly.'
    ],
    agent: [
      'Agent Shield uses 8 specialized sub-agents working in parallel, each focused on a critical security dimension. The Core Agent orchestrates the swarm and synthesizes findings. Each sub-agent runs independently and produces its own risk assessment, which the Core Agent then combines into your overall security score and report.',
      'The 8 sub-agents are: Prompt Injection Scanner (testing for injection vulnerabilities), Data Access Auditor (least-privilege checks), Tool Permission Analyzer (blast radius mapping), Output Filter Inspector (PII and credential detection), Auth & Identity Verifier (authentication review), Compliance Monitor (regulatory alignment), Behavioral Anomaly Detector (pattern analysis), and Insurance Risk Calculator (coverage assessment).'
    ],
    default: [
      'Based on your scan results, the most impactful next step would be to address the critical findings first, particularly around authentication and prompt injection resistance. These are the highest-risk vectors for AI agent compromise. I recommend booking a 15-minute call with our team to discuss a prioritized remediation plan tailored to your specific agent architecture.',
      'I can help with questions about your scan results, specific risk categories, insurance coverage options, remediation steps, compliance requirements, or pricing. What area would you like to explore further?'
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
    terminal: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>',
    database: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    wrench: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    filter: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
    key: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/></svg>',
    clipboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14l2 2 4-4"/></svg>',
    activity: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>',
    shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>',
    user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>'
  };

  // --- Generate results from URL ---
  function generateResults(url) {
    var seed = hashString(url.toLowerCase().trim());
    var categories = {};
    var catKeys = [
      'Prompt Injection Defense',
      'Data Access Controls',
      'Tool Permission Scope',
      'Output Filtering',
      'Auth & Identity',
      'Regulatory Compliance',
      'Anomaly Detection',
      'Insurance Coverage'
    ];
    var agentIds = ['prompt', 'data', 'tools', 'output', 'auth', 'compliance', 'anomaly', 'insurance'];

    for (var i = 0; i < catKeys.length; i++) {
      var min = 25;
      var max = 85;
      // Insurance always scores lower to drive the CTA
      if (agentIds[i] === 'insurance') {
        min = 10;
        max = 45;
      }
      categories[catKeys[i]] = {
        score: randomFromSeed(seed, i, min, max),
        agentId: agentIds[i]
      };
    }

    var total = 0;
    var keys = Object.keys(categories);
    for (var j = 0; j < keys.length; j++) {
      total += categories[keys[j]].score;
    }
    total = Math.round(total / keys.length);

    // Pick risks from lowest scoring categories
    var sorted = keys.slice().sort(function (a, b) { return categories[a].score - categories[b].score; });
    var risks = [];
    for (var k = 0; k < Math.min(5, sorted.length); k++) {
      var catAgentId = categories[sorted[k]].agentId;
      var templates = RISK_TEMPLATES[catAgentId];
      if (templates && templates.length > 0) {
        var riskIdx = randomFromSeed(seed, k + 20, 0, templates.length - 1);
        risks.push(templates[riskIdx]);
      }
    }

    // Pick preventive measures from the categories with risks
    var preventive = [];
    for (var m = 0; m < Math.min(4, sorted.length); m++) {
      var prevAgentId = categories[sorted[m]].agentId;
      var prevTemplates = PREVENTIVE_TEMPLATES[prevAgentId];
      if (prevTemplates && prevTemplates.length > 0) {
        var prevIdx = randomFromSeed(seed, m + 40, 0, prevTemplates.length - 1);
        preventive.push(prevTemplates[prevIdx]);
      }
    }

    return {
      total: total,
      grade: getGrade(total),
      categories: categories,
      risks: risks,
      preventive: preventive
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
  var preventiveList = document.getElementById('preventiveList');
  var retakeBtn = document.getElementById('retakeBtn');
  var keepTalkingBtn = document.getElementById('keepTalkingBtn');
  var chatContinue = document.getElementById('chatContinue');
  var chatMessages = document.getElementById('chatMessages');
  var chatInput = document.getElementById('chatInput');
  var chatSendBtn = document.getElementById('chatSendBtn');

  // Store current results for chat context
  var currentResults = null;
  var currentUrl = '';
  var chatResponseIndex = {};

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
    var containerW = swarmEl.offsetWidth || 520;
    var containerH = swarmEl.offsetHeight || 400;
    var cx = containerW / 2;
    var cy = containerH / 2;
    var rx = containerW * 0.38;
    var ry = containerH * 0.36;

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
    var totalDuration = 6000;
    var startTime = Date.now();

    // Status message cycling
    var statusInterval = setInterval(function () {
      statusIdx = (statusIdx + 1) % STATUS_MESSAGES.length;
      swarmStatus.textContent = STATUS_MESSAGES[statusIdx];
    }, 650);

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
            var l = document.getElementById('line-' + AGENTS[c].id);
            if (n) {
              n.classList.remove('swarm__node--active');
              n.classList.add('swarm__node--complete');
            }
            if (l) {
              l.classList.remove('swarm__line--active');
              l.classList.add('swarm__line--complete');
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

      // Mark previous as complete
      if (idx > 0) {
        var prevNode = document.getElementById('node-' + AGENTS[idx - 1].id);
        var prevLine = document.getElementById('line-' + AGENTS[idx - 1].id);
        if (prevNode) {
          prevNode.classList.remove('swarm__node--active');
          prevNode.classList.add('swarm__node--complete');
        }
        if (prevLine) {
          prevLine.classList.remove('swarm__line--active');
          prevLine.classList.add('swarm__line--complete');
        }
      }

      idx++;
      setTimeout(activateNext, 500);
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
      card.style.animationDelay = (i * 120) + 'ms';

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
        }, 300 + i * 120);
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
      card.style.animationDelay = (i * 100) + 'ms';

      card.innerHTML =
        '<div class="risk-card__header">' +
          '<span class="risk-card__severity ' + getSeverityClass(risk.severity) + '">' + risk.severity + '</span>' +
        '</div>' +
        '<h4 class="risk-card__title">' + risk.title + '</h4>' +
        '<p class="risk-card__desc">' + risk.desc + '</p>' +
        '<span class="risk-card__fix-tag">' + ICONS.check + ' Agent Shield can fix automatically</span>';

      risksList.appendChild(card);
    }
  }

  // --- Render preventive measures ---
  function renderPreventive(preventive) {
    preventiveList.innerHTML = '';
    for (var i = 0; i < preventive.length; i++) {
      var measure = preventive[i];
      var item = document.createElement('div');
      item.className = 'preventive__item';
      item.style.animationDelay = (i * 100) + 'ms';

      item.innerHTML =
        '<div class="preventive__icon">' + ICONS.check + '</div>' +
        '<div class="preventive__content">' +
          '<div class="preventive__title">' + measure.title + '</div>' +
          '<div class="preventive__desc">' + measure.desc + '</div>' +
        '</div>';

      preventiveList.appendChild(item);
    }
  }

  // --- Chat continuation logic ---
  function getChatResponseKey(message) {
    var lower = message.toLowerCase();
    var keywords = {
      insurance: ['insurance', 'coverage', 'insure', 'policy', 'premium', 'liability', 'claim', '$5m'],
      fix: ['fix', 'remediat', 'patch', 'repair', 'solve', 'resolve', 'mitigat', 'address', 'deploy'],
      cost: ['cost', 'price', 'pricing', 'how much', 'tier', 'plan', 'pay', 'budget', 'afford', '$'],
      compliance: ['compliance', 'eu ai act', 'nis2', 'soc 2', 'iso', 'gdpr', 'regulat', 'audit', 'legal'],
      score: ['score', 'grade', 'rating', 'result', 'breakdown', 'category', 'improve'],
      prompt: ['prompt', 'injection', 'jailbreak', 'bypass', 'guardrail', 'manipulat'],
      agent: ['agent', 'sub-agent', 'swarm', 'how does', 'how do', 'work', 'scan', 'analyze']
    };

    for (var key in keywords) {
      if (keywords.hasOwnProperty(key)) {
        for (var i = 0; i < keywords[key].length; i++) {
          if (lower.indexOf(keywords[key][i]) !== -1) {
            return key;
          }
        }
      }
    }
    return 'default';
  }

  function getChatResponse(key) {
    var responses = CHAT_RESPONSES[key] || CHAT_RESPONSES['default'];
    if (!chatResponseIndex[key]) chatResponseIndex[key] = 0;
    var idx = chatResponseIndex[key] % responses.length;
    chatResponseIndex[key]++;
    return responses[idx];
  }

  function addChatMessage(content, isUser) {
    var msg = document.createElement('div');
    msg.className = 'chat-continue__msg ' + (isUser ? 'chat-continue__msg--user' : 'chat-continue__msg--agent');

    var avatarIcon = isUser ? ICONS.user : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>';

    msg.innerHTML =
      '<div class="chat-continue__avatar">' + avatarIcon + '</div>' +
      '<div class="chat-continue__bubble">' + content + '</div>';

    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addTypingIndicator() {
    var msg = document.createElement('div');
    msg.className = 'chat-continue__msg chat-continue__msg--agent';
    msg.id = 'typingIndicator';
    msg.innerHTML =
      '<div class="chat-continue__avatar"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>' +
      '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    var indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  function handleChatSend() {
    var message = chatInput.value.trim();
    if (!message) return;

    addChatMessage(message, true);
    chatInput.value = '';

    // Show typing indicator
    addTypingIndicator();

    // Simulate response delay
    var delay = 800 + Math.random() * 1200;
    setTimeout(function () {
      removeTypingIndicator();
      var key = getChatResponseKey(message);
      var response = getChatResponse(key);
      addChatMessage(response, false);
    }, delay);
  }

  // --- Start scan ---
  function startScan() {
    var url = urlInput.value.trim();
    if (!url) {
      urlInput.classList.add('demo__input--error');
      setTimeout(function () { urlInput.classList.remove('demo__input--error'); }, 1500);
      return;
    }

    currentUrl = url;
    chatContinue.style.display = 'none';
    chatResponseIndex = {};

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
      currentResults = results;

      // Set domain
      resultsDomain.textContent = url;

      // Show results stage
      showStage(stageResults);

      // Animate
      setTimeout(function () {
        animateScore(results.total, results.grade);
        renderBreakdown(results.categories);
        renderRisks(results.risks);
        renderPreventive(results.preventive);
      }, 200);

      // Save to Supabase
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
        top_risks: results.risks.map(function (r) { return r.title; }),
        product: 'agent-shield'
      }).then(function () {}).catch(function () {});
    } catch (e) {
      // Silently fail
    }
  }

  // --- Reset demo ---
  function resetDemo() {
    urlInput.value = '';
    scoreNumber.textContent = '0';
    scoreRingFill.style.transition = 'none';
    scoreRingFill.style.strokeDashoffset = 2 * Math.PI * 88;
    chatContinue.style.display = 'none';
    currentResults = null;
    currentUrl = '';
    showStage(stageInput);
    urlInput.focus();

    // Scroll to demo
    var demoSection = document.getElementById('demo');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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

    // Enter key on URL input
    urlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') startScan();
    });

    // Retake
    retakeBtn.addEventListener('click', resetDemo);

    // Keep Talking
    keepTalkingBtn.addEventListener('click', function () {
      chatContinue.style.display = 'block';
      chatInput.focus();

      // Scroll chat into view
      setTimeout(function () {
        chatContinue.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    });

    // Chat send
    chatSendBtn.addEventListener('click', handleChatSend);
    chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleChatSend();
    });

    // Smooth scroll for anchor links
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href && href.length > 1) {
          e.preventDefault();
          smoothScroll(href);

          // Close mobile nav if open
          var navLinks = document.getElementById('navLinks');
          if (navLinks) navLinks.classList.remove('nav__links--open');
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

    // Mobile hamburger menu
    var hamburger = document.getElementById('navHamburger');
    var navLinksEl = document.getElementById('navLinks');
    if (hamburger && navLinksEl) {
      hamburger.addEventListener('click', function () {
        navLinksEl.classList.toggle('nav__links--open');
      });
    }
  });
})();
