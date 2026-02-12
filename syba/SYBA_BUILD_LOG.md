# SYBA.io — AI Sales Automation Build Log

## Date: 2026-02-12
## Built by: Claude Opus 4.6 for Agentic Engineering Consulting

---

## What Was Built

### 1. SYBA Context Document — `syba/context/SYBA_CONTEXT.md`
The AI agent "brain" — a comprehensive 110-line context document containing:
- Company overview (products, partnerships, recognition)
- 6 ICP segments with decision makers, pain points, hooks, and trigger events:
  1. Insurance Brokers (VP Sales, Benefits Director)
  2. Family Offices (COO, CTO, Operations Director)
  3. Corporate HR/Benefits (CHRO, VP Benefits)
  4. Law Firms (Managing Partner, CIO)
  5. Wealth Managers (Chief Compliance Officer)
  6. MSPs (CEO, VP Sales)
- 12 key statistics for outreach personalization
- Email template framework (subject → opening → problem → solution → credibility → CTA)
- Follow-up sequence structure (Day 3, Day 7, Day 14 break-up)
- Competitive landscape (Norton, Aura, IdentityForce vs SYBA)
- Tone guidelines (authoritative but approachable, data-driven, partnership-oriented)

### 2. `/syba` Slash Command — `.claude/commands/syba.md`
A 99-line Claude Code slash command with 5 operating modes:

| Mode | Command | What It Does |
|------|---------|-------------|
| **prospect** | `/syba` → prospect | Deep-research a specific company/person, generate full outreach package |
| **pipeline** | `/syba` → pipeline | Scan today's cyber news for trigger events, find 10-20 leads, score and prioritize |
| **content** | `/syba` → content | Generate 3 LinkedIn posts for Brigitte (thought leadership, educational, engagement) |
| **hubspot** | `/syba` → hubspot | Format and push prospect data to HubSpot CRM |
| **full** | `/syba` → full | Run pipeline + content + hubspot in sequence |

Uses: Firecrawl MCP (web scraping), web search, SYBA context doc.

### 3. n8n Workflow: SYBA Daily Intelligence Engine
**File:** `syba/workflows/syba-daily-intelligence-engine.json`
**Nodes:** 24 | **Connections:** 17

#### Flow Architecture:
```
Schedule Trigger (5AM ET daily)
  → Set Date & SYBA Context
  → Firecrawl: Search today's cyber news
  → AI: Extract 5 trigger events mapped to ICP segments
  → PARALLEL:
      ├── Apollo: Search Insurance Brokers (5 leads)
      ├── Apollo: Search Family Offices (5 leads)
      ├── Apollo: Search Corporate HR (5 leads)
      ├── Apollo: Search Law Firms (5 leads)
      └── AI: Generate LinkedIn Content (3 posts)
  → Merge All Leads (20 total)
  → Loop Through Each Lead:
      → Firecrawl: Scrape company website
      → AI (GPT-4o): Generate full outreach package
      → Set Outreach Data
      → HubSpot: Upsert Contact
      → HubSpot: Create Deal
      → [loop back]
  → AI: Compile Daily Summary Email
  → Gmail: Send briefing to Brigitte
```

#### What AI Generates Per Lead:
- Prospect brief with fit score (1-10)
- 3 cold email variants (direct, story, pain-point)
- 3-email follow-up sequence (Day 3, Day 7, Day 14)
- Sales call script (hook, discovery Qs, pitch, objections, close)
- LinkedIn connection request (<300 chars)

#### APIs/Credentials Required:
1. **Firecrawl** — HTTP Header Auth (`Authorization: Bearer fc-xxx`)
2. **OpenAI** — HTTP Header Auth (`Authorization: Bearer sk-xxx`)
3. **Apollo.io** — HTTP Header Auth (`X-Api-Key: xxx`)
4. **HubSpot** — Native n8n HubSpot credential
5. **Gmail** — Native n8n Gmail OAuth2 credential

### 4. n8n Workflow: SYBA Pipeline Sync (Simple)
**File:** `syba/workflows/syba-pipeline-sync.json`
**Nodes:** 9 | **Connections:** 7

#### Flow Architecture:
```
Schedule Trigger (6AM Mon-Fri)
  → Set Today
  → Apollo: Search All ICPs (10 leads)
  → Split People Array
  → Loop Each Lead:
      → AI (GPT-4o-mini): Generate cold email + follow-up + LinkedIn msg
      → PARALLEL:
          ├── HubSpot: Upsert Contact
          └── Gmail: Create Draft (review before sending)
      → [loop back]
```

Leaner version: fewer API calls, uses GPT-4o-mini instead of GPT-4o, creates Gmail drafts (not auto-send).

---

## Architecture Decisions

### Why Two Workflows?
- **Daily Intelligence Engine** = full-fat pipeline for active prospecting campaigns (comprehensive but higher API cost)
- **Pipeline Sync** = lean daily feeder for steady-state operation (cheaper, faster)
- "Two-speed automation" pattern: run the big one to fill pipeline, small one to keep it flowing

### Why Context Doc Is Separate?
- **Reusability** — consumed by both `/syba` command AND n8n AI Agent nodes
- **Maintainability** — update once, reflected everywhere
- **Token efficiency** — loaded on-demand, not bloating system prompts

### Why Apollo via HTTP Request (not native node)?
- n8n has no native Apollo node
- HTTP Request with Apollo REST API is the standard pattern
- Gives full control over search parameters per ICP segment

### Why Firecrawl for News (not RSS)?
- Firecrawl search returns fresh, ranked results with AI-friendly output
- RSS feeds are static and require maintaining feed lists
- Firecrawl's search API acts as a real-time cyber news radar

### SYBA's 6 ICP Segments & Why These Specifically:
1. **Insurance Brokers** — SYBA's Jencap partnership proves this channel works
2. **Family Offices** — HNWIs are 56% more targeted, $5M insurance is compelling
3. **Corporate HR** — 78% remote work = home networks are corporate attack surface
4. **Law Firms** — Handle most sensitive data, one breach = malpractice
5. **Wealth Managers** — Fiduciary duty extends to client cyber protection
6. **MSPs** — Bundle opportunity, can't get prevention + insurance elsewhere

---

## File Tree
```
syba/
├── SYBA_BUILD_LOG.md          ← This file
├── context/
│   └── SYBA_CONTEXT.md        ← AI agent context (110 lines)
└── workflows/
    ├── syba-daily-intelligence-engine.json  ← Full pipeline (24 nodes)
    └── syba-pipeline-sync.json              ← Simple pipeline (9 nodes)

.claude/commands/
└── syba.md                    ← /syba slash command (99 lines)
```

## Live n8n Workflows (Deployed 2026-02-12)

| Workflow | ID | Nodes | Status | URL |
|----------|-----|-------|--------|-----|
| SYBA Daily Intelligence Engine | `U6dgYvAblu0Vp1UG` | 24 | Inactive (needs credentials) | [Open in n8n](https://agenticengineeringllc.app.n8n.cloud/workflow/U6dgYvAblu0Vp1UG) |
| SYBA Pipeline Sync | `J4t8PZCcuACDwXwe` | 9 | Inactive (needs credentials) | [Open in n8n](https://agenticengineeringllc.app.n8n.cloud/workflow/J4t8PZCcuACDwXwe) |

## n8n MCP Configuration
Created `.mcp.json` in project root with:
- `n8n-native` — Direct MCP-over-HTTP connection to n8n cloud (for native tool calls)
- `n8n-mcp` — Community n8n-mcp package with REST API connection (for workflow CRUD)

Note: The n8n cloud MCP-over-HTTP transport supports validation/search but not CRUD.
Workflow creation was done via direct REST API (`POST /api/v1/workflows`). The `tags` field
is read-only in the n8n API and must be stripped before creation.

## v2 Upgrade — Daily Lead Intelligence Engine (2026-02-12)

### What Changed (v1 → v2)

| Aspect | v1 | v2 |
|--------|----|----|
| **Lead count** | 20 (US only, 4 ICP segments) | **40** (3 regions) |
| **Regions** | USA only | **Belgium (20) + Europe (10) + USA (10)** |
| **ICP coverage** | 4 segments | **All 6 segments** (21 title variants) |
| **Merge pattern** | Single merge (4→1) | **Chained 2-input merges** (avoids n8n bug) |
| **Website scraping** | Always scrape | **IF check** (skip if no URL) |
| **Data accumulation** | None (lost after loop) | **Workflow static data** (persists across loop) |
| **Briefing email** | Basic summary | **Comprehensive HTML** (top 10 cards, regional tables, action items) |
| **Recipients** | brigitte@syba.io only | **brigittev@syba.io + francis@syba.io** |
| **Regional messaging** | Generic | **Belgium=PwC, Europe=GDPR/NIS2, USA=Chubb/Jencap** |
| **Outreach per lead** | 3 email variants + 3 follow-ups | **1 cold email + 3 follow-ups + sales script + LinkedIn msg** |
| **LinkedIn content** | Generated in same workflow | Moved to `/syba content` mode |

### 5. n8n Workflow: SYBA Daily Lead Intelligence Engine v2
**File:** `syba/workflows/syba-daily-lead-engine-v2.json`
**Nodes:** 29 (24 functional + 5 sticky notes) | **Connections:** 22

#### Flow Architecture:
```
Schedule Trigger (5AM ET daily)
  → Set Date & SYBA Context
  → Firecrawl: Cyber News Search (today's news)
  → AI (GPT-4o-mini): Extract 5 Trigger Events
  → PARALLEL — 3 Regional Apollo Searches:
      ├── Apollo: Belgium (20 leads) → Process + Tag "Belgium"
      ├── Apollo: Europe ex-Belgium (10 leads) → Process + Tag "Europe"
      └── Apollo: USA (10 leads) → Process + Tag "USA"
  → Merge: Belgium + Europe (chained 2-input)
  → Merge: All Regions (BE+EU + USA)
  → Loop Through ~40 Leads (SplitInBatches, batch=1):
      → IF: Has Website URL?
          ├── YES → Firecrawl: Scrape Company Site
          └── NO  → Set: "No website available"
      → AI (GPT-4o): Generate Full Outreach Package (region-aware)
      → Code: Accumulate Lead Data (workflow static data)
      → HubSpot: Upsert Contact
      → HubSpot: Create Deal (with region tag)
      → [loop back]
  → (DONE) Code: Get All Processed Leads (read accumulated data)
  → AI (GPT-4o): Compile Master Briefing Email (HTML)
  → Gmail: Send to brigittev@syba.io + francis@syba.io
```

#### Regional Apollo Search Parameters:
- **Belgium (20):** `person_locations: ["Belgium"]`, all 6 ICP titles
- **Europe (10):** 13 countries (NL, FR, DE, UK, LU, CH, IE, ES, IT, SE, DK, NO, AT)
- **USA (10):** `person_locations: ["United States"]`

#### Regional Messaging (injected into AI outreach prompt):
- **Belgium:** PwC Scale-up Track, GDPR, Brigitte as fellow Belgian leader, NIS2
- **Europe:** Tokio Marine/Chubb credibility, GDPR, cross-border family protection, NIS2
- **USA:** $5M Chubb insurance, 78% remote work stat, Jencap HNWI distribution

#### Master Briefing Email Sections:
1. Header with date + lead count
2. Executive summary (regions, standouts, trigger events)
3. Top 10 highest-fit prospect cards (with ready-to-send emails)
4. Belgium leads table (20)
5. Europe leads table (10)
6. USA leads table (10)
7. Today's trigger events with conversation openers
8. Action items for Brigitte & Francis
9. Footer

### 6. `/syba` Slash Command v2 — `.claude/commands/syba.md`
Simplified from 5 modes to 3 focused modes:

| Mode | What It Does |
|------|-------------|
| **daily** | **(NEW — Primary)** Full 40-lead engine: 3-region search, deep research, outreach gen, HubSpot push, briefing email |
| **prospect** | (kept) Deep-research a specific company/person on demand |
| **content** | (kept) Generate LinkedIn posts for Brigitte |

Dropped: pipeline, hubspot, full — all absorbed into "daily" mode.
Fixed email to `brigittev@syba.io` (was `brigitte@syba.io`).

### 7. Reusable Skill: SYBA Outreach Generator
**File:** `.claude/skills/syba-outreach-generator/SKILL.md`
Invokable as `/syba-outreach-generator`. Contains:
- Full SYBA context (products, partnerships, 6 ICPs, stats)
- Regional messaging rules (Belgium / Europe / USA)
- Outreach package JSON schema
- Email framework (opening → stat → solution → partnership → CTA)
- Tone guidelines
- Calendly CTA: `https://calendly.com/with-francis-at-syba-io/15min`

## Live n8n Workflows (Deployed 2026-02-12)

| Workflow | ID | Nodes | Status | URL |
|----------|-----|-------|--------|-----|
| **SYBA Daily Lead Intelligence Engine v2** | `uPC8iGLipdld3xjW` | 29 | Inactive (needs credentials) | [Open in n8n](https://agenticengineeringllc.app.n8n.cloud/workflow/uPC8iGLipdld3xjW) |
| SYBA Daily Intelligence Engine (v1) | `U6dgYvAblu0Vp1UG` | 24 | Inactive (superseded by v2) | [Open in n8n](https://agenticengineeringllc.app.n8n.cloud/workflow/U6dgYvAblu0Vp1UG) |
| SYBA Pipeline Sync | `J4t8PZCcuACDwXwe` | 9 | Inactive (needs credentials) | [Open in n8n](https://agenticengineeringllc.app.n8n.cloud/workflow/J4t8PZCcuACDwXwe) |

## File Tree (Updated)
```
syba/
├── SYBA_BUILD_LOG.md          ← This file
├── context/
│   └── SYBA_CONTEXT.md        ← AI agent context (110 lines)
└── workflows/
    ├── syba-daily-lead-engine-v2.json      ← v2 3-region pipeline (29 nodes) ★
    ├── syba-daily-intelligence-engine.json  ← v1 US-only pipeline (24 nodes)
    └── syba-pipeline-sync.json              ← Simple pipeline (9 nodes)

.claude/commands/
└── syba.md                    ← /syba slash command v2 (daily/prospect/content)

.claude/skills/syba-outreach-generator/
└── SKILL.md                   ← Reusable outreach generation skill ★
```

## Next Steps
- [x] Import workflows into n8n cloud instance (DONE - deployed via REST API)
- [x] Build v2 3-region pipeline with 40 leads (DONE - ID: uPC8iGLipdld3xjW)
- [x] Update /syba command to daily/prospect/content modes (DONE)
- [x] Create reusable outreach generator skill (DONE)
- [ ] Configure all 5 API credentials in n8n (Firecrawl, OpenAI, Apollo, HubSpot, Gmail)
- [ ] Test v2 workflow with Manual Trigger before activating schedule
- [ ] Set up HubSpot pipeline stages matching SYBA's sales process
- [ ] Run `/syba daily` to test the full 3-region pipeline interactively
- [ ] Run `/syba prospect` to test single-prospect deep research
- [ ] Consider adding: Slack notifications, email open tracking, lead scoring refinement
