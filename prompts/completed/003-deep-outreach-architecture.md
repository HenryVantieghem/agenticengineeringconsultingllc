# Prompt 003: Deep Outreach System Architecture

**Purpose:** Design the optimal multi-agent orchestration system based on research findings from Prompt 002.

**Inputs:**
- `research/cold-outreach-research-2026-02-13.md` (output from Prompt 002)
- `.claude/commands/drop.md` (current /drop pattern)
- `.claude/commands/serve.md` (current /serve pattern)
- `.claude/commands/activate.md` (current /activate pattern)
- `.claude/skills/follow-up/SKILL.md` (current follow-up system)
- `.claude/commands/revenue-engine.md` (PAS-SP framework, deep research pattern)
- `supabase/migrations/001_initial_schema.sql` (existing DB schema)
- `outreach/templates/follow-up.md` (follow-up email templates)

**Output:** `research/deep-outreach-system-architecture-2026-02-13.md`

**Estimated time:** 15-20 minutes

---

## Context

You are a systems architect for Agentic Engineering Consulting. You've just received a comprehensive research report on cold email science (Prompt 002 output). Your job: design the optimal multi-agent system that implements those findings while building on the existing `/drop`, `/serve`, `/activate`, and `/follow-up` infrastructure.

**Read ALL input files first.** The architecture must:
1. Implement every high-impact research finding
2. Build on existing patterns (don't reinvent — extend)
3. Be implementable as a single Claude Code skill file
4. Use only tools available: Supabase MCP, Firecrawl MCP, Apify MCP, Google Workspace MCP, WebSearch, GitHub MCP

---

## Section 1: System Overview

Design a high-level overview with:

### 1a. Before vs After Comparison

```markdown
## Before (Current /drop + /serve)
| Dimension | Current State | Limitation |
|-----------|--------------|------------|
| Lead discovery | Google Maps Scraper only | Single source, no enrichment |
| Lead scoring | Gut-feel 1-10 | No algorithm, not calibrated |
| Email copy | One template per position | No variant testing |
| Personalization | First name + company + city | No website-specific insights |
| Verification | None | Spam words, broken emails possible |
| A/B testing | None | Can't optimize what you can't measure |
| Analytics | Basic count (sent/replied) | No conversion funnel, no significance testing |
| Follow-up | Fixed Day 3/7/14 | No trigger-based timing |

## After (Deep Outreach System)
| Dimension | New State | Improvement |
|-----------|----------|-------------|
| Lead discovery | [from research] | [specific] |
| Lead scoring | [from research] | [specific] |
| Email copy | [from research] | [specific] |
| ... | ... | ... |
```

### 1b. Key Design Decisions

For each decision, reference the specific research finding that justifies it:

```markdown
### Decision 1: [decision]
- **Research basis:** [cite specific finding from Prompt 002 report]
- **Alternatives considered:** [what else could work]
- **Why this choice:** [reasoning]
```

---

## Section 2: 11-Agent Architecture

Design 11 specialized agents that work in a pipeline. For each agent:

```markdown
### Agent [N]: [Name]
**Role:** [one sentence]
**Inputs:** [what data it receives]
**Outputs:** [what data it produces]
**Tools used:** [specific MCP tools]
**Research basis:** [which finding(s) from Prompt 002 drive this agent's design]

**Pseudocode:**
[10-20 lines of pseudocode showing the agent's logic]

**Error handling:**
- [error case 1] → [recovery action]
- [error case 2] → [recovery action]
```

### The 11 Agents:

1. **Client Context Agent** — Loads client profile, ICP segments, messaging guidelines, and current pipeline state from Supabase + context files. Outputs a normalized context object used by all downstream agents.

2. **Lead Discovery Agent** — Uses optimal Apify actors per industry (from research) to find raw leads. Implements multi-source strategy: primary actor + fallback actor. Deduplicates against existing Supabase leads.

3. **Deep Research Agent** — Takes raw leads and enriches with Firecrawl website scrapes + WebSearch for trigger events. Extracts: services, team size, gaps (no booking, no chat), tech stack, recent news.

4. **Lead Scoring Agent** — Applies the 8-feature weighted scoring algorithm from research. Normalizes to 1-10 scale. Flags leads below threshold for exclusion. Stores scores and feature breakdown in Supabase.

5. **Email Crafting Agent** — Applies the optimal psychology framework per email position (from research). Uses research-backed email length, subject line format, and CTA placement. Generates the "control" version.

6. **A/B Variant Generator** — Takes the control email and generates variant(s) based on the active A/B test. Implements 50/50 split allocation. Tags each email with test_id + variant_id for tracking.

7. **Verification Agent** — Runs 10+ pre-send checks on every email: spam word scan, email format validation, deduplication, rate limit check, content length bounds, CTA presence, personalization completeness, opt-out link, professional tone, brand consistency.

8. **Sending Agent** — Sends verified emails via Gmail API with 0.5s rate limiting. Handles OAuth token management, batch halting at <80% verification pass rate, and retry logic.

9. **Reply Detection Agent** — Checks Gmail for replies to sent emails. Classifies: positive interest, question, objection, unsubscribe request, bounce. Updates Supabase status accordingly.

10. **Follow-Up Agent** — Triggers follow-up sequences at research-optimized intervals (may differ from current Day 3/7/14 if research suggests better timing). Uses different psychology framework per follow-up position.

11. **Analytics Agent** — Computes campaign metrics: open rate, reply rate, conversion rate per variant. Runs chi-square significance tests on A/B experiments. Generates insights and auto-selects winning variants.

---

## Section 3: 12-Stage Data Pipeline

Design the complete data pipeline showing how data flows from input to output:

```markdown
## Pipeline Stages

### Stage 1: Client Onboarding
**Trigger:** /deep-outreach {slug} or /deep-outreach --new {url}
**Data in:** Client slug or website URL
**Data out:** Normalized client context object
**Agent:** Client Context Agent
**Supabase tables:** clients (read)

### Stage 2: Context Loading
...

### Stage 3: Lead Discovery
...

[Continue through all 12 stages]

### Stage 12: Analytics & Optimization
**Trigger:** After sending complete or on-demand
**Data in:** All send data, reply data, A/B variant assignments
**Data out:** Campaign report, winning variants, recommendations
**Agent:** Analytics Agent
**Supabase tables:** email_campaigns, email_variants, email_sends (read), lead_scores (read)
```

### Pipeline Diagram (ASCII)

```
Client Input
    │
    ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ 1. Onboard  │────▶│ 2. Context  │────▶│ 3. Discover │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ 5. Craft    │◀────│ 4. Research │
                    └─────────────┘     └─────────────┘
                          │                   │
                          ▼                   ▼
                    ┌─────────────┐     ┌─────────────┐
                    │ 6. Variants │     │ 4b. Score   │
                    └─────────────┘     └─────────────┘
                          │
                     ◇ GATE 1 ◇ ─── Lead Quality Threshold
                          │
                          ▼
                    ┌─────────────┐
                    │ 7. Verify   │
                    └─────────────┘
                          │
                     ◇ GATE 2 ◇ ─── Content Safety Check
                          │
                     ◇ GATE 3 ◇ ─── A/B Variant Equivalence
                          │
                          ▼
                    ┌─────────────┐
                    │ 8. Send     │
                    └─────────────┘
                          │
                     ◇ GATE 4 ◇ ─── Rate Limit Check
                          │
                          ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ 11. Analyze │◀────│10. FollowUp │◀────│ 9. Replies  │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## Section 4: Verification Gates

Design 4 verification gates that prevent quality issues:

### Gate 1: Lead Quality Threshold
```markdown
**Position:** After scoring, before email crafting
**Rule:** Exclude leads with score < [threshold from research]
**Threshold:** [X]/10 (justify from research data)
**Action on fail:** Skip lead, log to verification_failures table
**Batch halt:** If >50% of leads fail → pause and alert
```

### Gate 2: Content Safety Check
```markdown
**Position:** After email crafting, before sending
**Checks (10+):**
1. No spam trigger words (list from research)
2. Email length within optimal range (from research)
3. Subject line length within optimal range (from research)
4. Contains exactly 1 CTA (from research)
5. All personalization tokens replaced (no [Name] or {company})
6. Professional tone (no ALL CAPS, no excessive punctuation)
7. No broken links or placeholder URLs
8. Sender name and contact info present
9. Content matches client brand guidelines
10. No competitor names in negative context
11. Opt-out/unsubscribe mechanism present

**Action on fail:** Flag for manual review, do not send
**Batch halt:** If <80% pass rate → halt entire batch and alert
```

### Gate 3: A/B Variant Equivalence
```markdown
**Position:** After variant generation, before sending
**Rule:** Variants must differ only in the tested variable
**Check:** Compare control vs variant — only [tested element] should differ
**Action on fail:** Regenerate variant
```

### Gate 4: Rate Limit Check
```markdown
**Position:** Before each send
**Checks:**
- Gmail API quota not exceeded
- OAuth token not expired
- 0.5s minimum between sends
- Daily send limit not exceeded
**Action on fail:** Wait/refresh/halt as appropriate
```

---

## Section 5: A/B Testing Framework

Design the A/B testing system:

### 5a. Test Registry

```markdown
### Predefined Tests
| Test ID | Variable | Control | Variant | Hypothesis | Min Sample |
|---------|----------|---------|---------|------------|-----------|
| T001 | Subject line | Question format | Direct value | Questions get +X% open | [N/variant] |
| T002 | Email length | Short (150 words) | Long (400 words) | [hypothesis] | [N/variant] |
| T003 | CTA placement | Bottom | Middle | [hypothesis] | [N/variant] |
| T004 | Social proof | None | Industry stat | [hypothesis] | [N/variant] |
| T005 | Framework | PAS | AIDA | [hypothesis] | [N/variant] |
```

### 5b. Allocation Algorithm

```markdown
**Method:** [Fixed 50/50 split vs multi-armed bandit — choose based on research]
**Assignment:** Hash(business_id + test_id) mod 2 → deterministic, reproducible
**Tracking:** Each send logged with: campaign_id, test_id, variant_id, sent_at
```

### 5c. Significance Testing

```markdown
**Test:** Chi-square test for proportions
**Formula:** χ² = Σ[(O - E)² / E]
**Significance level:** p < 0.05
**Minimum observations:** [from research — both total and per-variant]
**Auto-winner selection:** When p < 0.05 AND sample >= minimum, declare winner and switch all traffic
```

### 5d. Supabase Schema for A/B Testing

```sql
-- Design the email_campaigns, email_variants, and email_sends tables
-- Include all columns needed for the A/B testing framework
-- Follow the existing schema patterns from 001_initial_schema.sql
-- Include RLS policies matching the existing pattern
```

---

## Section 6: Lead Scoring Algorithm

Design the 8-feature weighted scoring model:

### 6a. Feature Definitions

```markdown
| # | Feature | Weight | Data Source | Scoring Rules |
|---|---------|--------|-------------|---------------|
| 1 | Company size | [X] | Google Maps (reviews as proxy) | 0-50 reviews=3, 50-200=5, 200-500=4, 500+=2 |
| 2 | Geography match | [X] | Google Maps location | Same metro=5, adjacent=3, remote=1 |
| 3 | Tech stack gaps | [X] | Firecrawl (no booking, no chat) | Each gap=+1 point, max 5 |
| 4 | Trigger event | [X] | WebSearch/Firecrawl news | Recent event=5, none=1 |
| 5 | Website quality | [X] | Firecrawl (mobile, SSL, speed) | Poor=5 (needs us), Good=2 |
| 6 | Social presence | [X] | Firecrawl/search | Low social=4 (needs help), high=2 |
| 7 | Industry match | [X] | Client ICP segments | Primary ICP=5, secondary=3, tertiary=1 |
| 8 | Contact findability | [X] | Apify/Firecrawl | Email found=5, only form=3, no contact=1 |
```

### 6b. Scoring Formula

```markdown
raw_score = Σ(feature_score × weight) for all 8 features
normalized_score = round((raw_score / max_possible_score) × 9) + 1  # Maps to 1-10
```

### 6c. Calibration Plan

```markdown
**Phase 1 (First 500 sends):** Use initial weights from research, log all feature values
**Phase 2 (After 500 sends):** Correlate feature scores with actual reply rates → adjust weights
**Phase 3 (After 2000 sends):** Build simple regression model → replace rule-based scoring
```

### 6d. Supabase Schema for Scoring

```sql
-- Design the lead_scores table
-- Include columns for each feature score, raw total, normalized total
-- Include the feature breakdown as JSONB for analytics
-- Follow existing schema patterns
```

---

## Section 7: New Supabase Tables

Design 5 new tables that extend the existing schema:

### 7a. Table Schemas

```sql
-- 1. email_campaigns: tracks each /deep-outreach run
CREATE TABLE email_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  campaign_type TEXT NOT NULL, -- 'drop', 'serve', 'deep-outreach'
  industry TEXT,
  city TEXT,
  target_count INTEGER,
  actual_count INTEGER,
  active_tests JSONB DEFAULT '[]', -- [{test_id, variable, control, variant}]
  status TEXT DEFAULT 'running', -- running, completed, paused, failed
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  metrics JSONB DEFAULT '{}' -- {sent, delivered, opened, replied, converted}
);

-- 2. email_variants: A/B test variant definitions
-- [design this table]

-- 3. email_sends: individual send records with variant tracking
-- [design this table]

-- 4. lead_scores: feature-level scoring breakdown
-- [design this table]

-- 5. verification_failures: pre-send check failures
-- [design this table]
```

### 7b. Indexes

```sql
-- Design indexes for common query patterns:
-- Campaign lookup by client + date
-- Send lookup by campaign + variant
-- Score lookup by lead
-- Failure lookup by campaign + gate
```

### 7c. RLS Policies

```sql
-- Follow the existing pattern from 001_initial_schema.sql:
-- JWT user_metadata.client_id (slug) for client access
-- Service role full access for Henry's Claude Code
```

### 7d. Realtime

```sql
-- Enable realtime on tables that the client dashboard would display
```

---

## Section 8: KPI Dashboard Specification

Design the metrics that the Analytics Agent computes:

### 8a. Campaign-Level Metrics

```markdown
| Metric | Formula | Target | Alert Threshold |
|--------|---------|--------|----------------|
| Send rate | sent / target_count | >95% | <80% |
| Verification pass rate | passed / total_checked | >90% | <80% |
| Open rate | opened / sent | [from research] | [from research] |
| Reply rate | replied / sent | [from research] | [from research] |
| Positive reply rate | positive / replied | >50% | <30% |
| Booking rate | booked / replied | >30% | <15% |
| Close rate | signed / booked | >30% | <15% |
```

### 8b. A/B Test Metrics

```markdown
| Metric | Formula |
|--------|---------|
| Variant reply rate | variant_replies / variant_sends |
| Lift | (variant_rate - control_rate) / control_rate |
| Chi-square statistic | Σ[(O - E)² / E] |
| P-value | 1 - CDF(χ², df=1) |
| Confidence | 1 - p_value |
| Winner | variant with higher rate IF p < 0.05 AND n >= min_sample |
```

### 8c. Lead Scoring Metrics

```markdown
| Metric | Formula |
|--------|---------|
| Score distribution | histogram of normalized scores |
| Score-to-reply correlation | correlation(score, replied) |
| Feature importance | correlation(feature_score, replied) per feature |
| Threshold accuracy | precision at current threshold |
```

---

## Section 9: Integration with Existing System

Describe exactly how /deep-outreach replaces and extends the existing commands:

```markdown
### Backward Compatibility
| Existing Command | Relationship to /deep-outreach |
|-----------------|-------------------------------|
| /drop | /deep-outreach --mode=drop replaces it (adds scoring, A/B, verification) |
| /serve {slug} | /deep-outreach --mode=serve {slug} replaces it (adds same improvements) |
| /follow-up | /deep-outreach --mode=followup integrates it (uses research-optimized timing) |
| /activate | Unchanged — /deep-outreach feeds into /activate when prospects convert |
| /revenue-engine | /deep-outreach subsumes it — same deep research but with full pipeline |

### Migration Path
1. Phase 1: Run /deep-outreach alongside existing commands (parallel, compare results)
2. Phase 2: Retire /drop once /deep-outreach shows >= results
3. Phase 3: Retire /serve once per-client mode validates
4. Phase 4: Full cutover
```

---

## Section 10: Implementation Roadmap

```markdown
### Phase 1: Foundation (Week 1)
- [ ] Create 5 new Supabase tables (migration)
- [ ] Implement Client Context Agent + Lead Discovery Agent
- [ ] Implement Lead Scoring Agent with 8 features
- [ ] Basic pipeline: discover → score → craft → send
- **Milestone:** 50 scored, verified leads sent in one run

### Phase 2: Intelligence (Week 2)
- [ ] Implement Deep Research Agent (Firecrawl enrichment)
- [ ] Implement Verification Agent (10+ checks)
- [ ] Implement Email Crafting Agent with psychology frameworks
- [ ] Add verification gates 1 and 2
- **Milestone:** All emails pass 10+ quality checks before sending

### Phase 3: Optimization (Week 3)
- [ ] Implement A/B Variant Generator
- [ ] Implement Analytics Agent with chi-square testing
- [ ] Implement verification gates 3 and 4
- [ ] Add auto-winner selection for A/B tests
- **Milestone:** First A/B test runs with statistical analysis

### Phase 4: Full Pipeline (Week 4)
- [ ] Implement Reply Detection Agent
- [ ] Implement Follow-Up Agent with optimized timing
- [ ] Build KPI dashboard output
- [ ] Integration testing with all 11 agents
- [ ] Run parallel with existing /drop for validation
- **Milestone:** Complete pipeline running daily with analytics
```

---

## Output File Structure

Write the complete architecture document to `research/deep-outreach-system-architecture-2026-02-13.md` with this structure:

```markdown
# Deep Outreach System Architecture
**Date:** 2026-02-13
**Architect:** Claude Code (Agentic Engineering)
**Based on:** Deep Outreach Research Report (2026-02-13)

## Executive Summary
[3-5 bullet points of the architecture's key innovations]

## Table of Contents
1. System Overview (Before/After + Key Decisions)
2. 11-Agent Architecture
3. 12-Stage Data Pipeline
4. Verification Gates
5. A/B Testing Framework
6. Lead Scoring Algorithm
7. New Supabase Tables (complete SQL)
8. KPI Dashboard Specification
9. Integration with Existing System
10. Implementation Roadmap

## 1-10. [Each section as specified above]
```

---

## Success Criteria Checklist

Before considering this prompt complete, verify:

- [ ] All 11 agents fully defined with inputs/outputs/pseudocode/error handling
- [ ] All 12 pipeline stages documented with data flow
- [ ] 4 verification gates with specific check lists
- [ ] A/B framework supports 5+ test types
- [ ] Lead scoring algorithm has 8+ weighted features with formulas
- [ ] 5 new Supabase tables with complete SQL (CREATE TABLE + indexes + RLS)
- [ ] KPI metrics defined with formulas and targets
- [ ] Clear migration path from existing commands
- [ ] 4-phase implementation roadmap with milestones
- [ ] Every major design decision references a specific research finding
- [ ] Complete pipeline has no gaps (data flows end-to-end without breaks)
