# Prompt 002: Deep Outreach Research — Cold Email Science & Tool Discovery

**Purpose:** Research-validated frameworks, tool comparisons, and quantitative benchmarks for building a scientific cold outreach system.

**Output:** `research/cold-outreach-research-2026-02-13.md`

**Estimated time:** 20-30 minutes (heavy MCP usage)

---

## Context

You are a research agent for Agentic Engineering Consulting. The business runs a daily cold outreach system (`/drop`) that contacts 50 local businesses per day with 5 free researched leads each. The system works but lacks scientific backing — email copy uses one template, lead scoring is gut-feel, and there's no A/B testing or verification.

Your job: conduct deep research across 7 domains to produce a structured report with 15+ citations, quantitative benchmarks, and ranked recommendations. This report will feed into the system architecture (Prompt 003).

**Current system files to reference for context:**
- `.claude/commands/drop.md` — Current /drop command (50 businesses, 5 leads each, Gmail sending)
- `.claude/commands/serve.md` — Daily client operations (20 leads, parallel agents, Supabase logging)
- `.claude/commands/revenue-engine.md` — Deep prospect research, PAS-SP email framework
- `.claude/skills/follow-up/SKILL.md` — Day 3/7/14 follow-up sequences
- `outreach/templates/follow-up.md` — Follow-up email templates

Read these files first to understand what exists today. Then research what's optimal.

---

## Research Domain 1: Cold Email Effectiveness Studies

### What to find:
- Academic or industry studies on cold email open rates, reply rates, and conversion rates
- How these rates vary by: subject line length, email length, personalization level, send time, industry
- The "golden ratios" — what word count, CTA count, and paragraph count produce best results
- Deliverability science: what triggers spam filters, what improves inbox placement

### Tools to use:
1. **WebSearch** — Search for:
   - "cold email open rate study 2024 2025"
   - "B2B cold email reply rate benchmark by industry"
   - "cold email deliverability best practices research"
   - "email subject line length optimal open rate study"
   - "cold email word count conversion rate"
   - "personalized vs generic cold email AB test results"
   - "cold email send time optimization study"

2. **Firecrawl** (`firecrawl_scrape` or `firecrawl_search`) — Scrape published benchmarks from:
   - Smartlead.ai blog/benchmarks page
   - Instantly.ai blog/benchmarks page
   - Lemlist blog/case studies
   - Woodpecker.co cold email statistics
   - HubSpot email marketing benchmarks
   - Mailchimp email benchmark reports

3. **WebSearch** for academic sources:
   - "cold email effectiveness academic study"
   - "email outreach conversion rate meta-analysis"

### Output format for this section:
```markdown
## 1. Cold Email Effectiveness Research

### Key Findings
| Metric | Benchmark | Source | Sample Size |
|--------|-----------|--------|-------------|
| Open rate (cold B2B) | X% | [source] | N emails |
| Reply rate (cold B2B) | X% | [source] | N emails |
| Conversion rate | X% | [source] | N emails |
| Optimal subject length | X words | [source] | N tested |
| Optimal email length | X words | [source] | N tested |
| Best send time | X:XX AM | [source] | N tested |
| Personalization delta | +X% reply rate | [source] | N tested |

### Subject Line Research
[findings with data]

### Email Length Research
[findings with data]

### Personalization Impact
[findings with data — first name, company name, specific insight, pain point]

### Send Time Optimization
[findings with data — day of week, time of day, timezone considerations]

### Deliverability Factors
[spam trigger words to avoid, domain warming, authentication (SPF/DKIM/DMARC)]
```

---

## Research Domain 2: Apify Actor Comparison

### What to find:
- Compare 5+ Apify actors for B2B lead discovery beyond Google Maps Scraper
- Evaluate: data quality, speed, cost per lead, fields returned, rate limits
- Identify the best actor per industry (dental needs different data than law firms)

### Tools to use:
1. **Apify MCP** (`search-actors`) — Search for:
   - "Google Maps scraper" (compare alternatives)
   - "LinkedIn scraper" (for professional services leads)
   - "Yellow Pages scraper" (backup lead source)
   - "business directory scraper"
   - "B2B lead generation"
   - "email finder" (for contact discovery)
   - "company enrichment"
   - "Yelp scraper" (reviews + business data)
   - "website scraper" (for tech stack detection)

2. **Apify MCP** (`fetch-actor-details`) — For each promising actor, get:
   - Full README (capabilities)
   - Input schema (what parameters it accepts)
   - Pricing model
   - Rating and usage count

3. **WebSearch** — Search for:
   - "best Apify actors for lead generation 2025"
   - "Apify Google Maps Scraper alternatives comparison"

### Output format for this section:
```markdown
## 2. Apify Actor Comparison Matrix

### Actor Comparison Table
| Actor | Use Case | Fields Returned | Speed | Cost/1K | Rating | Monthly Runs |
|-------|----------|-----------------|-------|---------|--------|-------------|
| [actor1] | [use] | [fields] | [speed] | $[X] | [X]/5 | [N] |
| [actor2] | ... | ... | ... | ... | ... | ... |
| [actor3] | ... | ... | ... | ... | ... | ... |
| [actor4] | ... | ... | ... | ... | ... | ... |
| [actor5] | ... | ... | ... | ... | ... | ... |

### Best Actor by Industry
| Industry | Primary Actor | Secondary Actor | Why |
|----------|--------------|-----------------|-----|
| Dental | [actor] | [actor] | [reason] |
| Law | [actor] | [actor] | [reason] |
| HVAC | [actor] | [actor] | [reason] |
| Medical | [actor] | [actor] | [reason] |
| Real Estate | [actor] | [actor] | [reason] |
| Veterinary | [actor] | [actor] | [reason] |
| Property Mgmt | [actor] | [actor] | [reason] |
| Auto Repair | [actor] | [actor] | [reason] |

### New Actor Integrations Recommended
[actors we should add to the pipeline that we don't currently use]
```

---

## Research Domain 3: Sales Psychology Frameworks

### What to find:
- Cialdini's 6 Principles of Influence applied specifically to cold email
- Other frameworks: PAS (Pain-Agitation-Solution), AIDA, BAB (Before-After-Bridge)
- Which framework produces best results for different email positions (first touch vs follow-up)
- Psychological triggers that increase response rates in B2B cold outreach

### Tools to use:
1. **WebSearch** — Search for:
   - "Cialdini 6 principles applied cold email"
   - "sales psychology framework cold outreach"
   - "PAS vs AIDA cold email conversion comparison"
   - "before after bridge email framework results"
   - "psychological triggers B2B email marketing"
   - "loss aversion cold email copy"
   - "social proof in cold email examples"
   - "reciprocity principle email outreach"

2. **Firecrawl** — Scrape detailed articles from:
   - Any in-depth blog posts found via WebSearch
   - Sales psychology research sites

### Output format for this section:
```markdown
## 3. Sales Psychology Frameworks

### Framework Comparison
| Framework | Best For | Structure | Avg Reply Rate | Source |
|-----------|----------|-----------|----------------|--------|
| PAS | [use case] | [steps] | X% | [source] |
| AIDA | [use case] | [steps] | X% | [source] |
| BAB | [use case] | [steps] | X% | [source] |
| PAS-SP (current) | [use case] | [steps] | X% | [internal] |

### Cialdini's 6 Principles — Cold Email Application
1. **Reciprocity:** [how to apply + example + measured impact]
2. **Commitment/Consistency:** [how to apply + example + measured impact]
3. **Social Proof:** [how to apply + example + measured impact]
4. **Authority:** [how to apply + example + measured impact]
5. **Liking:** [how to apply + example + measured impact]
6. **Scarcity:** [how to apply + example + measured impact]

### Recommended Framework per Email Position
| Position | Framework | Why | Key Principle |
|----------|-----------|-----|---------------|
| First touch (/drop) | [framework] | [reason] | [principle] |
| Follow-up Day 3 | [framework] | [reason] | [principle] |
| Follow-up Day 7 | [framework] | [reason] | [principle] |
| Follow-up Day 14 | [framework] | [reason] | [principle] |

### Top 10 Psychological Triggers Ranked by Impact
[ranked list with measured conversion deltas where available]
```

---

## Research Domain 4: MCP Servers & GitHub Repos for Lead Gen

### What to find:
- Claude Code MCP servers that could enhance our pipeline
- GitHub repositories for lead gen automation, email verification, contact enrichment
- Open-source tools we could integrate via MCP

### Tools to use:
1. **GitHub MCP** (`search_repositories`) — Search for:
   - "cold email automation"
   - "lead generation AI"
   - "email verification API"
   - "B2B contact enrichment"
   - "outreach automation Claude"
   - "MCP server email"
   - "MCP server lead generation"

2. **GitHub MCP** (`search_code`) — Search for:
   - "mcp server" in YAML/JSON configs related to email or leads
   - "firecrawl" + "lead" in Python/TypeScript files

3. **WebSearch** — Search for:
   - "Claude Code MCP servers list 2025"
   - "best MCP servers for sales automation"
   - "email verification MCP server"
   - "lead scoring open source"

4. **Context7** — Query for:
   - MCP server development patterns
   - Claude Code agent orchestration patterns

### Output format for this section:
```markdown
## 4. MCP Servers & GitHub Tools

### New MCP Servers to Consider
| Server | Purpose | Status | Integration Effort | Impact |
|--------|---------|--------|-------------------|--------|
| [server1] | [purpose] | [available/needs-build] | [low/med/high] | [low/med/high] |
| ... | ... | ... | ... | ... |

### GitHub Repositories
| Repo | Stars | Purpose | Useful Components |
|------|-------|---------|-------------------|
| [repo1] | [N] | [purpose] | [what we'd use] |
| ... | ... | ... | ... |

### Recommended Integrations (Top 3)
1. **[tool/server]** — [why + how it fits our pipeline]
2. **[tool/server]** — [why + how it fits our pipeline]
3. **[tool/server]** — [why + how it fits our pipeline]
```

---

## Research Domain 5: Email Personalization Techniques

### What to find:
- Personalization levels: first name, company name, industry, specific insight, pain point, trigger event
- Measured conversion delta for each personalization level
- Scalable personalization techniques (AI-generated vs manual)
- Dynamic content blocks vs fully custom emails

### Tools to use:
1. **WebSearch** — Search for:
   - "email personalization levels conversion rate study"
   - "AI personalized cold email results"
   - "dynamic email personalization B2B benchmark"
   - "hyper-personalization cold email ROI"
   - "cold email personalization at scale techniques"

2. **Firecrawl** — Scrape any detailed case studies found

### Output format for this section:
```markdown
## 5. Email Personalization Techniques

### Personalization Level Impact
| Level | Example | Reply Rate Delta | Effort | Scalable? |
|-------|---------|-----------------|--------|-----------|
| None (generic) | "Hi there" | baseline | none | yes |
| First name | "Hi Sarah" | +X% | low | yes |
| Company name | "at Bright Smile Dental" | +X% | low | yes |
| Industry insight | "dental practices in Atlanta avg..." | +X% | medium | yes (AI) |
| Specific pain point | "no online booking on your site" | +X% | high | yes (Firecrawl) |
| Trigger event | "saw you just opened a 2nd location" | +X% | high | partially |
| Full custom | unique email per prospect | +X% | very high | no |

### Our Current Level vs Optimal
[analysis of where /drop sits today and where the biggest gains are]

### AI-Scalable Personalization Techniques
[techniques we can implement with Firecrawl + Claude that don't require manual effort]
```

---

## Research Domain 6: Lead Scoring Algorithms

### What to find:
- Which signals best predict B2B lead conversion
- Weighted scoring models (what features, what weights)
- Machine learning vs rule-based scoring comparison
- How to calibrate scores against actual conversion data

### Tools to use:
1. **WebSearch** — Search for:
   - "B2B lead scoring algorithm features weights"
   - "predictive lead scoring model variables"
   - "lead scoring best practices 2025"
   - "which signals predict B2B conversion"
   - "lead scoring for local businesses"
   - "ICP fit score calculation method"

2. **Firecrawl** — Scrape detailed guides from sales intelligence platforms

### Output format for this section:
```markdown
## 6. Lead Scoring Algorithms

### Signal Importance Ranking
| Signal | Weight (0-1) | Data Source | Ease of Collection | Predictive Power |
|--------|-------------|-------------|-------------------|------------------|
| Company size | [X] | [source] | [easy/med/hard] | [low/med/high] |
| Industry match | [X] | [source] | [easy/med/hard] | [low/med/high] |
| Geography | [X] | [source] | [easy/med/hard] | [low/med/high] |
| Tech stack | [X] | [source] | [easy/med/hard] | [low/med/high] |
| Trigger event | [X] | [source] | [easy/med/hard] | [low/med/high] |
| Website quality | [X] | [source] | [easy/med/hard] | [low/med/high] |
| Social presence | [X] | [source] | [easy/med/hard] | [low/med/high] |
| Contact findability | [X] | [source] | [easy/med/hard] | [low/med/high] |
| Review sentiment | [X] | [source] | [easy/med/hard] | [low/med/high] |
| Gap indicators | [X] | [source] | [easy/med/hard] | [low/med/high] |

### Recommended 8-Feature Scoring Model
[specific algorithm with weights, normalized to 1-10 scale]

### Score Calibration Method
[how to validate scores against actual conversion data once we have it]
```

---

## Research Domain 7: A/B Testing for Cold Outreach

### What to find:
- Statistical methodology for A/B testing cold emails
- Minimum sample sizes for significance
- Which variables to test first (highest expected impact)
- How to run multivariate tests in a sequential outreach pipeline

### Tools to use:
1. **WebSearch** — Search for:
   - "AB testing cold email methodology"
   - "email AB test sample size calculator"
   - "cold email AB test variables priority"
   - "chi-square test email marketing"
   - "sequential AB testing cold outreach"
   - "multivariate email test design"

### Output format for this section:
```markdown
## 7. A/B Testing Methodology

### Variables to Test (Priority Order)
| Variable | Expected Impact | Min Sample/Variant | Test Duration | Ease |
|----------|----------------|-------------------|---------------|------|
| Subject line | [high/med/low] | [N] | [X days] | [easy/med/hard] |
| Email length | [high/med/low] | [N] | [X days] | [easy/med/hard] |
| CTA placement | [high/med/low] | [N] | [X days] | [easy/med/hard] |
| Social proof | [high/med/low] | [N] | [X days] | [easy/med/hard] |
| Send time | [high/med/low] | [N] | [X days] | [easy/med/hard] |
| Framework (PAS vs AIDA) | [high/med/low] | [N] | [X days] | [easy/med/hard] |
| Personalization level | [high/med/low] | [N] | [X days] | [easy/med/hard] |

### Statistical Framework
- **Test type:** Chi-square test for proportions (reply rate)
- **Significance level:** p < 0.05
- **Minimum sample size formula:** [formula with explanation]
- **How to handle:** sequential testing, stopping rules, multiple comparison correction

### Recommended First 4 Tests
1. [test 1 — full spec: hypothesis, variants, sample size, success metric]
2. [test 2 — full spec]
3. [test 3 — full spec]
4. [test 4 — full spec]

### Multi-armed Bandit vs Fixed-Split
[comparison + recommendation for our use case (50 sends/day)]
```

---

## Output File Structure

Write the complete research report to `research/cold-outreach-research-2026-02-13.md` with this structure:

```markdown
# Deep Outreach Research Report
**Date:** 2026-02-13
**Researcher:** Claude Code (Agentic Engineering)
**Purpose:** Research-validated frameworks for scientific cold outreach system

## Executive Summary
[5-7 bullet points of the highest-impact findings]

## Table of Contents
1. Cold Email Effectiveness Research
2. Apify Actor Comparison Matrix
3. Sales Psychology Frameworks
4. MCP Servers & GitHub Tools
5. Email Personalization Techniques
6. Lead Scoring Algorithms
7. A/B Testing Methodology

## 1-7. [Each section as specified above]

## 8. Synthesis: Top 10 Recommendations
[Ranked by expected impact on conversion rate, with implementation difficulty]

## 9. Citations
[All 15+ sources with URLs, titles, dates, and what data was extracted]
```

---

## Success Criteria Checklist

Before considering this prompt complete, verify:

- [ ] 15+ cited sources with URLs
- [ ] Quantitative benchmarks for: open rate, reply rate, conversion rate, optimal email length, optimal subject length, best send time
- [ ] 5+ Apify actors compared with feature matrix
- [ ] Cialdini's 6 principles mapped to specific email techniques
- [ ] 3+ new tool/MCP integrations identified
- [ ] 8+ lead scoring features with recommended weights
- [ ] 4+ A/B test specifications with sample size requirements
- [ ] All data tables populated with real numbers (not placeholders)
- [ ] Executive summary captures the 5 highest-impact findings
- [ ] Synthesis section ranks all recommendations by ROI

---

## Execution Notes

- **Parallelism:** Use WebSearch for multiple queries simultaneously where possible
- **Firecrawl rate limits:** Space scrapes 2-3 seconds apart
- **Depth over breadth:** It's better to have 15 deeply researched sources than 30 shallow ones
- **Data quality:** If a source doesn't provide specific numbers, note "qualitative" and keep looking for quantitative sources
- **Current system awareness:** Always evaluate findings against what `/drop`, `/serve`, and `/revenue-engine` already do — the goal is to identify GAPS and UPGRADES, not reinvent from scratch
