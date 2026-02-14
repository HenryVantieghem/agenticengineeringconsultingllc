# Prompt 004: Deep Outreach System — Interactive HTML Visualization

**Purpose:** Build a single-file interactive HTML page that visualizes the entire Deep Outreach system — all 11 agents, 12 pipeline stages, 4 verification gates, A/B testing, lead scoring, and KPI dashboard.

**Inputs:**
- `research/cold-outreach-research-2026-02-13.md` (research findings)
- `research/deep-outreach-system-architecture-2026-02-13.md` (system architecture)

**Output:** `research/deep-outreach-system-map.html`

**Estimated time:** 20-30 minutes

---

## Context

You are a frontend visualization engineer for Agentic Engineering Consulting. You have two comprehensive documents: a research report and a system architecture. Your job: build a single, beautiful, interactive HTML page that a non-technical client (or Henry himself) could scroll through and immediately understand the entire Deep Outreach system.

**Read BOTH input files first.** Extract all data points, metrics, agent definitions, pipeline stages, and test configurations from them.

---

## Design System

### Brand
- **Primary color:** `#E8533F` (Agentic Engineering brand red-orange)
- **Dark background:** `#0F1419` (near-black)
- **Card background:** `#1A1F2E` (dark navy)
- **Card border:** `#2A3142` (medium slate)
- **Text primary:** `#E8EAED` (off-white)
- **Text secondary:** `#9AA0A6` (muted gray)
- **Success green:** `#34A853`
- **Warning amber:** `#FBBC04`
- **Error red:** `#EA4335`
- **Info blue:** `#4285F4`

### Typography
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```
- Hero title: 48px, bold
- Section title: 32px, bold
- Subsection: 24px, semibold
- Body: 16px, regular
- Small/label: 14px, medium
- Monospace: `'SF Mono', 'Fira Code', 'Cascadia Code', monospace`

### Layout
- Max width: 1200px, centered
- Section padding: 80px vertical
- Card padding: 24px
- Border radius: 12px (cards), 8px (buttons), 6px (badges)
- Grid: CSS Grid, responsive (1 col mobile, 2-3 col desktop)

---

## Section 1: Hero Overview

### Content:
```html
<!-- Full-width hero with gradient background -->
<section id="hero">
  <h1>Deep Outreach System</h1>
  <p class="subtitle">AI-Powered Scientific Cold Outreach for Local Businesses</p>

  <!-- 4 key stat cards in a row -->
  <div class="stat-grid">
    <div class="stat-card">
      <span class="stat-number">11</span>
      <span class="stat-label">Specialized Agents</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">12</span>
      <span class="stat-label">Pipeline Stages</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">4</span>
      <span class="stat-label">Quality Gates</span>
    </div>
    <div class="stat-card">
      <span class="stat-number">8</span>
      <span class="stat-label">Scoring Features</span>
    </div>
  </div>

  <!-- Before/After headline stats -->
  <div class="comparison-banner">
    <div class="before">Before: 1 template, gut-feel scoring, 0% tested</div>
    <div class="after">After: A/B tested, algorithmically scored, 10+ quality checks</div>
  </div>
</section>
```

### Design:
- Gradient background: linear-gradient from `#0F1419` to `#1A1F2E`
- Stat cards: glass morphism effect (semi-transparent, backdrop blur)
- Numbers animate up on scroll (countUp animation)
- Comparison banner: split left (red/muted) / right (green/bold)

---

## Section 2: Data Pipeline Flowchart

### Content:
Build an animated, interactive flowchart showing all 12 pipeline stages.

### Implementation:
```html
<section id="pipeline">
  <h2>12-Stage Data Pipeline</h2>

  <!-- SVG flowchart -->
  <svg id="pipeline-chart" viewBox="0 0 1200 800">
    <!-- Stage nodes (rounded rectangles) -->
    <!-- Verification gates (diamond shapes, colored amber) -->
    <!-- Arrows connecting stages (animated dash pattern) -->
    <!-- Click a stage to expand details panel below -->
  </svg>

  <!-- Detail panel (shows when a stage is clicked) -->
  <div id="stage-detail" class="detail-panel hidden">
    <h3 id="stage-name"></h3>
    <p id="stage-description"></p>
    <div id="stage-io">
      <div class="io-in"><strong>Input:</strong> <span id="stage-input"></span></div>
      <div class="io-out"><strong>Output:</strong> <span id="stage-output"></span></div>
    </div>
    <div id="stage-agent"><strong>Agent:</strong> <span></span></div>
    <div id="stage-tables"><strong>Supabase:</strong> <span></span></div>
  </div>
</section>
```

### Interactivity:
- **Click** any stage node → detail panel slides open below with full info
- **Hover** over a stage → highlight its connections (incoming + outgoing arrows)
- **Verification gates** (diamonds) → amber color, clicking shows the specific checks
- **Animated arrows** → CSS `stroke-dashoffset` animation showing data flow direction
- **Responsive:** On mobile, flowchart becomes a vertical list

### Data (populate from architecture doc):
```javascript
const stages = [
  { id: 1, name: "Client Onboarding", agent: "Client Context Agent", ... },
  { id: 2, name: "Context Loading", ... },
  // ... all 12 stages
];

const gates = [
  { id: "G1", name: "Lead Quality Threshold", position: "after-scoring", ... },
  { id: "G2", name: "Content Safety Check", position: "after-crafting", ... },
  { id: "G3", name: "A/B Variant Equivalence", position: "after-variants", ... },
  { id: "G4", name: "Rate Limit Check", position: "before-send", ... },
];
```

---

## Section 3: Agent Orchestration Diagram

### Content:
A node-link diagram showing all 11 agents and their relationships.

### Implementation:
```html
<section id="agents">
  <h2>11-Agent Architecture</h2>

  <!-- Agent grid (CSS Grid, 4 columns) -->
  <div class="agent-grid">
    <!-- Each agent is a card -->
    <div class="agent-card" data-agent="1">
      <div class="agent-icon"><!-- SVG icon --></div>
      <h3>Client Context</h3>
      <p class="agent-role">Loads client profile and pipeline state</p>
      <div class="agent-tools">
        <span class="tool-badge">Supabase</span>
        <span class="tool-badge">Filesystem</span>
      </div>
    </div>
    <!-- ... repeat for all 11 agents -->
  </div>

  <!-- Connection lines between agents (SVG overlay or CSS borders) -->
  <!-- Hover effect: highlight agent + its connections -->
</section>
```

### Design:
- Each agent card has a unique icon (SVG, simple line art)
- Cards arranged in a flow-like grid (not just a flat grid — show pipeline direction)
- **Hover** any agent → card expands with: inputs, outputs, tools, pseudocode snippet
- **Color coding:** agents grouped by phase (Discovery=blue, Processing=purple, Delivery=green, Analytics=amber)

### Agent Data (from architecture):
```javascript
const agents = [
  {
    id: 1, name: "Client Context", phase: "setup",
    role: "Loads client profile, ICP segments, messaging guidelines",
    tools: ["Supabase MCP", "Read"],
    inputs: "Client slug or URL",
    outputs: "Normalized context object",
    color: "#4285F4"
  },
  // ... all 11 agents
];
```

---

## Section 4: A/B Testing Dashboard

### Content:
A mock dashboard showing example A/B tests with variant comparison.

### Implementation:
```html
<section id="ab-testing">
  <h2>A/B Testing Framework</h2>

  <!-- Active tests grid -->
  <div class="test-grid">
    <!-- Test card 1: Subject Line -->
    <div class="test-card">
      <div class="test-header">
        <h3>T001: Subject Line Format</h3>
        <span class="test-status running">Running</span>
      </div>
      <div class="variant-comparison">
        <div class="variant control">
          <h4>Control: Question Format</h4>
          <p class="example">"Quick question about [Business]'s phones?"</p>
          <div class="metrics">
            <div class="metric">Sends: <strong>127</strong></div>
            <div class="metric">Replies: <strong>4</strong></div>
            <div class="metric">Rate: <strong>3.1%</strong></div>
          </div>
        </div>
        <div class="vs-divider">VS</div>
        <div class="variant test">
          <h4>Variant: Direct Value</h4>
          <p class="example">"5 leads for [Business] — free"</p>
          <div class="metrics">
            <div class="metric">Sends: <strong>131</strong></div>
            <div class="metric">Replies: <strong>7</strong></div>
            <div class="metric">Rate: <strong>5.3%</strong></div>
          </div>
        </div>
      </div>
      <div class="significance">
        <div class="significance-bar" style="width: 72%"></div>
        <span>72% confidence (need 95% — 48 more sends)</span>
      </div>
    </div>

    <!-- Test cards 2-4 (similar structure with different data) -->
  </div>

  <!-- Significance explainer -->
  <div class="explainer-card">
    <h3>How It Works</h3>
    <p>Chi-square test with p < 0.05 threshold. Minimum 50 sends per variant.
    Auto-selects winner when significance reached.</p>
  </div>
</section>
```

### Design:
- Variant comparison: side-by-side cards with colored borders (control=blue, variant=amber)
- Significance bar: animated progress toward 95% threshold
- Winner indicator: green crown icon when a test reaches significance
- Example data should be realistic for our use case (50 sends/day, 2-5% reply rate)

---

## Section 5: Lead Scoring Visualization

### Content:
Interactive visualization of the 8-feature scoring algorithm.

### Implementation:
```html
<section id="scoring">
  <h2>Lead Scoring Algorithm</h2>

  <!-- Weighted bar chart -->
  <div class="scoring-chart">
    <!-- 8 horizontal bars showing feature weights -->
    <div class="feature-bar" data-feature="company-size">
      <span class="feature-name">Company Size</span>
      <div class="bar-track">
        <div class="bar-fill" style="width: [weight]%"></div>
      </div>
      <span class="feature-weight">[weight]</span>
    </div>
    <!-- ... repeat for all 8 features -->
  </div>

  <!-- Interactive calculator -->
  <div class="score-calculator">
    <h3>Try It: Score a Lead</h3>
    <div class="calculator-inputs">
      <label>Company Size (reviews):
        <select id="calc-size">
          <option value="3">0-50 reviews</option>
          <option value="5">50-200 reviews</option>
          <option value="4">200-500 reviews</option>
          <option value="2">500+ reviews</option>
        </select>
      </label>
      <!-- ... dropdowns for all 8 features -->
    </div>
    <div class="calculated-score">
      <span class="score-number" id="calc-result">7.2</span>
      <span class="score-label">/10</span>
      <div class="score-tier" id="calc-tier">High Priority</div>
    </div>
  </div>
</section>
```

### Interactivity:
- **Bar chart:** bars animate in on scroll, tooltips show scoring rules on hover
- **Calculator:** changing any dropdown instantly recalculates the score
- **Score tiers:** 8-10 = "High Priority" (green), 5-7 = "Medium" (amber), 1-4 = "Low" (red)
- **Feature weights** from the architecture document

---

## Section 6: Verification Gates Checklist

### Content:
Visual checklist showing all verification checks with pass/fail indicators.

### Implementation:
```html
<section id="verification">
  <h2>Quality Verification Gates</h2>

  <div class="gates-grid">
    <!-- Gate 1 -->
    <div class="gate-card">
      <div class="gate-header">
        <span class="gate-icon diamond">◇</span>
        <h3>Gate 1: Lead Quality</h3>
      </div>
      <ul class="checks-list">
        <li class="check pass">Score >= threshold ✓</li>
        <li class="check pass">Email address present ✓</li>
        <li class="check pass">Not previously contacted ✓</li>
        <li class="check fail">Website accessible ✗</li>
      </ul>
      <div class="gate-stats">
        <span class="pass-rate">Pass Rate: 92%</span>
        <span class="gate-action">Halt if < 50%</span>
      </div>
    </div>

    <!-- Gates 2-4 (similar) -->
  </div>
</section>
```

### Design:
- Each gate is a card with a diamond icon (amber)
- Checks have toggle animation (pass=green checkmark, fail=red X)
- Pass rate shown as a circular progress indicator
- Example data: realistic pass/fail distribution

---

## Section 7: KPI Metrics Dashboard

### Content:
A metrics dashboard with progress bars and sparklines.

### Implementation:
```html
<section id="kpis">
  <h2>KPI Dashboard</h2>

  <div class="kpi-grid">
    <!-- Metric card with progress bar -->
    <div class="kpi-card">
      <h4>Send Rate</h4>
      <div class="kpi-value">96%</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: 96%"></div>
      </div>
      <div class="kpi-target">Target: >95%</div>
    </div>

    <!-- Metric card with sparkline -->
    <div class="kpi-card">
      <h4>Reply Rate</h4>
      <div class="kpi-value">3.2%</div>
      <svg class="sparkline" viewBox="0 0 100 30">
        <polyline points="0,25 15,22 30,20 45,23 60,18 75,15 90,12 100,10" />
      </svg>
      <div class="kpi-trend up">↑ 0.8% vs last week</div>
    </div>

    <!-- 6-8 more KPI cards -->
  </div>
</section>
```

### Metrics to display (from architecture):
- Send rate, verification pass rate, open rate, reply rate
- Positive reply rate, booking rate, close rate
- A/B tests running, leads scored today, avg fit score

---

## Section 8: Before/After Comparison

### Content:
Side-by-side comparison of current system vs Deep Outreach.

### Implementation:
```html
<section id="comparison">
  <h2>Before vs After</h2>

  <div class="comparison-table">
    <div class="comparison-row">
      <div class="dimension">Lead Discovery</div>
      <div class="before-cell">
        <span class="before-value">1 source (Google Maps)</span>
      </div>
      <div class="delta-cell">
        <span class="delta positive">+4 sources</span>
      </div>
      <div class="after-cell">
        <span class="after-value">5 sources (Maps + LinkedIn + Yelp + directories + enrichment)</span>
      </div>
    </div>
    <!-- ... rows for all 8+ dimensions from architecture -->
  </div>
</section>
```

### Design:
- Before column: muted, gray-toned
- After column: vibrant, brand-colored
- Delta column: green badges with +/improvement indicators
- Hover rows to highlight

---

## Section 9: Research Summary Cards

### Content:
Key findings from the research report, displayed as citation cards.

### Implementation:
```html
<section id="research">
  <h2>Research Highlights</h2>

  <div class="research-grid">
    <div class="research-card">
      <div class="finding-number">#1</div>
      <h3>Optimal Email Length</h3>
      <p class="finding">[key finding from research]</p>
      <div class="citation">
        <span class="source">[Source Name]</span>
        <span class="sample">n = [sample size]</span>
      </div>
    </div>
    <!-- 8-12 research cards -->
  </div>
</section>
```

### Design:
- Cards with numbered badges
- Each card has: finding title, key stat, source citation
- Grid layout: 3 columns on desktop, 1 on mobile

---

## Section 10: Implementation Roadmap

### Content:
4-phase Gantt-style timeline.

### Implementation:
```html
<section id="roadmap">
  <h2>Implementation Roadmap</h2>

  <div class="gantt-chart">
    <!-- Phase 1 bar -->
    <div class="gantt-row">
      <div class="phase-label">Phase 1: Foundation</div>
      <div class="gantt-bar-track">
        <div class="gantt-bar phase-1" style="left: 0%; width: 25%">
          <span>Week 1</span>
        </div>
      </div>
      <div class="phase-milestone">50 scored leads sent</div>
    </div>
    <!-- Phases 2-4 -->
  </div>

  <!-- Phase detail cards (expand on click) -->
  <div class="phase-details">
    <div class="phase-card" data-phase="1">
      <h3>Phase 1: Foundation</h3>
      <ul class="task-list">
        <li>Create 5 new Supabase tables</li>
        <li>Implement Client Context Agent</li>
        <li>Implement Lead Discovery Agent</li>
        <li>Implement Lead Scoring Agent</li>
        <li>Basic pipeline test</li>
      </ul>
    </div>
    <!-- ... phases 2-4 -->
  </div>
</section>
```

### Design:
- Gantt bars: colored by phase, with timeline markers
- Click a phase bar → expands task list below
- Milestone markers: diamond icons at the end of each phase
- Timeline: 4 weeks total

---

## Technical Requirements

### Single File
- Everything in ONE `.html` file (no external CSS/JS/images)
- CSS in `<style>` tag
- JavaScript in `<script>` tag
- SVG inline (no external SVG files)
- Images as data URIs if needed (avoid images — use CSS/SVG)

### Responsive
- Mobile-first CSS with media queries
- Flowchart simplifies to vertical list on mobile
- Grid layouts collapse to single column
- Touch-friendly: tap targets >= 44px

### Print-Friendly
```css
@media print {
  /* Remove interactive elements */
  /* Show all collapsed content */
  /* Black and white friendly (add patterns to colored elements) */
  /* Page break controls */
  body { background: white; color: black; }
  .dark-bg { background: white; }
}
```

### Performance
- No external dependencies (no CDN libraries)
- CSS animations use `transform` and `opacity` only (GPU-accelerated)
- Intersection Observer for scroll-triggered animations
- Debounced scroll handlers

### Accessibility
- Semantic HTML (`<section>`, `<nav>`, `<article>`, `<figure>`)
- ARIA labels on interactive elements
- Keyboard navigation for all interactive components
- Color contrast >= 4.5:1 for all text
- `prefers-reduced-motion` media query to disable animations

---

## JavaScript Behavior

### Scroll Animations
```javascript
// IntersectionObserver to trigger animations when sections enter viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

### Interactive Flowchart
```javascript
// Click handler for pipeline stages
document.querySelectorAll('.stage-node').forEach(node => {
  node.addEventListener('click', (e) => {
    const stageId = e.currentTarget.dataset.stageId;
    showStageDetail(stageId);
    highlightConnections(stageId);
  });
});
```

### Lead Score Calculator
```javascript
// Real-time score calculation
document.querySelectorAll('.calculator-inputs select').forEach(select => {
  select.addEventListener('change', calculateScore);
});

function calculateScore() {
  // Read all feature values
  // Apply weights from architecture
  // Normalize to 1-10
  // Update display
}
```

### Count-Up Animation
```javascript
// Animate numbers on hero stat cards
function countUp(element, target, duration = 2000) {
  let start = 0;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    element.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
```

---

## Navigation

### Sticky Nav
```html
<nav class="sticky-nav">
  <a href="#hero">Overview</a>
  <a href="#pipeline">Pipeline</a>
  <a href="#agents">Agents</a>
  <a href="#ab-testing">A/B Tests</a>
  <a href="#scoring">Scoring</a>
  <a href="#verification">Gates</a>
  <a href="#kpis">KPIs</a>
  <a href="#comparison">Before/After</a>
  <a href="#research">Research</a>
  <a href="#roadmap">Roadmap</a>
</nav>
```

- Fixed at top of page
- Active section highlighted on scroll
- Smooth scroll behavior
- Collapses to hamburger on mobile

---

## File Size Target

- Target: < 100KB total (HTML + CSS + JS + SVG)
- No minification needed (readability > compression)
- Avoid large inline data — keep SVGs simple

---

## Success Criteria Checklist

Before considering this prompt complete, verify:

- [ ] All 10 sections present and populated with real data from research + architecture docs
- [ ] All 11 agents represented in the agent diagram
- [ ] All 12 pipeline stages in the flowchart with clickable detail
- [ ] All 4 verification gates with check lists
- [ ] A/B testing section shows 4+ tests with variant comparison
- [ ] Lead scoring calculator works (change inputs → score updates)
- [ ] Responsive: looks correct on 375px, 768px, and 1200px widths
- [ ] Print: Cmd+P produces readable black-and-white output
- [ ] Smooth scroll navigation works
- [ ] Animations trigger on scroll (not on page load)
- [ ] File is a single .html file with no external dependencies
- [ ] Color contrast meets WCAG AA (4.5:1)
