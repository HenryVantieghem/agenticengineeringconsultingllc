# Deep Outreach System Architecture

**Date:** 2026-02-13
**Architect:** Claude Code (Agentic Engineering)
**Based on:** Deep Outreach Research Report (2026-02-13)
**Version:** 2.0
**Status:** Design Complete — Ready for Implementation

## Executive Summary

- **11 specialized agents** replace the current monolithic `/drop`, `/serve`, `/follow-up`, and `/revenue-engine` commands with a single unified `/deep-outreach` pipeline
- **12-stage data pipeline** flows from client context through lead discovery, deep research, scoring, email crafting, A/B testing, verification, sending, reply detection, follow-up, and analytics
- **4 verification gates** ensure lead quality, content safety, A/B variant equivalence, and rate limit compliance before any email leaves the system
- **A/B testing framework** with chi-square significance testing enables continuous optimization of subject lines, email bodies, CTAs, send times, and follow-up cadences
- **Lead scoring algorithm** uses 8 weighted features (review signals, website quality, tech stack gaps, social presence, trigger events, decision-maker availability, ICP fit, and competitive density) to produce a 0-100 score with calibrated thresholds

## Table of Contents

1. [System Overview](#1-system-overview)
2. [11-Agent Architecture](#2-11-agent-architecture)
3. [12-Stage Data Pipeline](#3-12-stage-data-pipeline)
4. [Verification Gates](#4-verification-gates)
5. [A/B Testing Framework](#5-ab-testing-framework)
6. [Lead Scoring Algorithm](#6-lead-scoring-algorithm)
7. [New Supabase Tables](#7-new-supabase-tables)
8. [KPI Dashboard Specification](#8-kpi-dashboard-specification)
9. [Integration with Existing System](#9-integration-with-existing-system)
10. [Implementation Roadmap](#10-implementation-roadmap)

---

## 1. System Overview

### 1.1 Before/After Comparison

| Dimension | BEFORE (Current System) | AFTER (Deep Outreach v2) |
|-----------|------------------------|--------------------------|
| **Entry points** | 4 separate commands (`/drop`, `/serve`, `/follow-up`, `/revenue-engine`) | 1 unified command (`/deep-outreach`) with mode flags |
| **Agent count** | 5 inline agents within `/drop` (SCOUT, ENRICH, QUALIFY, COMPOSE, DISPATCH) | 11 specialized agents with defined interfaces |
| **Lead scoring** | 1-10 `fit_score` in `/serve`, no scoring in `/drop` | 0-100 weighted algorithm with 8 features, calibrated thresholds |
| **Email verification** | None — emails bounce silently | Hunter.io MCP verification + catch-all detection |
| **A/B testing** | None — single template per campaign | 5+ simultaneous tests with chi-square significance |
| **Follow-up cadence** | Fixed Day 3/7/14 in separate `/follow-up` skill | Adaptive 3-7-7 cadence (Day 0/3/10/17) driven by research data |
| **Reply detection** | Manual — check Gmail inbox | Automated Gmail polling + Supabase status updates |
| **Analytics** | Summary printout at end of run | Persistent KPI tracking in Supabase with trend analysis |
| **Content safety** | None — trust the LLM output | 10-point verification gate before sending |
| **Personalization depth** | Website scrape + Google reviews | Website + reviews + tech stack + social + news + trigger events + competitor analysis |
| **Email infrastructure** | Single domain, no warming | Separate outreach domain, SPF/DKIM/DMARC, variable send volume |
| **Data pipeline** | Linear (find → research → email → send) | 12-stage with parallel execution, waterfall enrichment, and feedback loops |
| **Supabase tables** | 5 tables (clients, leads, outreach_packages, briefings, trigger_events) + leaddrop_prospects | 5 existing + 5 new tables (email_campaigns, email_variants, email_sends, lead_scores, verification_failures) |

### 1.2 Key Design Decisions

| Decision | Rationale | Research Basis |
|----------|-----------|----------------|
| **11 agents instead of 5** | Separation of concerns enables parallel execution and independent testing | Research Section 5.2: Claude Code native architecture supports subagents via Task tool |
| **0-100 scoring instead of 1-10** | Finer granularity enables meaningful A/B test comparisons and threshold tuning | Research Section 6.2: ML-based scoring models significantly improve lead prioritization (Frontiers in AI, 2025) |
| **3-7-7 cadence (Day 0/3/10/17)** | Captures 93% of total replies by Day 10; 4th follow-up risks 1.6% spam rate | Research Section 3.5: SalesBread/Snov.io data from 85K+ emails |
| **Hunter.io for verification** | 99% accuracy on non-catch-all; eliminates bounce-related deliverability damage | Research Section 2.2: Hunter.io recommended for finding + ZeroBounce for verification |
| **Batch size <= 50** | Campaigns with 1-200 prospects get 18% reply rate vs 8% for 1,000+ | Research Section 3.2: Martal 2025 / Snov.io 2026 cohort analysis |
| **50-125 word emails** | 6-8 sentences = highest reply rate (6.9%) + 42.67% open rate | Research Section 3.1: Belkins 2025 Study |
| **Question-based subject lines** | 46% open rate — top performer across all studies | Research Section 3.3: Belkins 2025 / EmailAnalytics data |
| **Tuesday 6-9 AM send time** | Highest reply rate in 85K email study | Research Section 3.4: Martal / B2BRocket data |
| **Reciprocity-first model** | Personalized + unexpected free value = strongest persuasion trigger | Research Section 4.1: Cialdini Principle #1, CXL/Gong analysis |
| **Waterfall enrichment** | Try Provider A -> B -> C, like Clay.com's 100+ provider model | Research Section 6.4: Clay.com waterfall pattern replicated with MCPs |
| **Separate outreach domain** | SPF/DKIM/DMARC on dedicated domain protects main domain reputation | Research Section 7.3: Instantly/Mailshake deliverability best practices |

---

## 2. 11-Agent Architecture

### 2.0 System Diagram

```
/deep-outreach (Orchestrator)
  |
  +-- PHASE 1: CONTEXT & DISCOVERY
  |   |
  |   +-- Agent 1: CLIENT CONTEXT AGENT
  |   |   Loads client config, ICP, rotation state
  |   |   Output: ClientContext object
  |   |
  |   +-- Agent 2: LEAD DISCOVERY AGENT
  |       Apify Google Maps + Firecrawl + Apollo
  |       Output: RawLead[] (50-100 candidates)
  |
  +-- PHASE 2: ENRICHMENT & SCORING
  |   |
  |   +-- Agent 3: DEEP RESEARCH AGENT (parallel x5)
  |   |   Website scrape + reviews + news + tech stack
  |   |   Output: EnrichedLead[]
  |   |
  |   +-- Agent 4: LEAD SCORING AGENT
  |       8-feature weighted scoring algorithm
  |       Output: ScoredLead[] (top 50 with scores 0-100)
  |
  +-- PHASE 3: CONTENT GENERATION
  |   |
  |   +-- Agent 5: EMAIL CRAFTING AGENT (parallel x5)
  |   |   PAS framework + Cialdini principles
  |   |   Output: EmailDraft[]
  |   |
  |   +-- Agent 6: A/B VARIANT GENERATOR
  |       Generates test variants for active experiments
  |       Output: EmailVariant[]
  |
  +-- PHASE 4: VERIFICATION & DELIVERY
  |   |
  |   +-- Agent 7: VERIFICATION AGENT
  |   |   4 gates: quality + safety + equivalence + rate limit
  |   |   Output: VerifiedEmail[] + RejectedEmail[]
  |   |
  |   +-- Agent 8: SENDING AGENT
  |       Gmail API with variable timing
  |       Output: SentEmail[] + SendFailure[]
  |
  +-- PHASE 5: POST-SEND
      |
      +-- Agent 9: REPLY DETECTION AGENT
      |   Gmail inbox polling + classification
      |   Output: Reply[] (positive/negative/question/bounce)
      |
      +-- Agent 10: FOLLOW-UP AGENT
      |   3-7-7 cadence engine
      |   Output: FollowUpEmail[]
      |
      +-- Agent 11: ANALYTICS AGENT
          KPI computation + trend analysis
          Output: CampaignReport
```

### 2.1 Agent 1: Client Context Agent

**Role:** Load and validate all client configuration, ICP segments, rotation state, and campaign history before any work begins.

**Inputs:**
- Client slug (from user or rotation matrix)
- Mode flag: `prospect` (free LeadDrop) or `client` (paying client daily serve)
- Override parameters (city, industry, count)

**Outputs:**
- `ClientContext` object containing:
  - Client identity (name, slug, industry, location)
  - ICP segments with search strategies
  - Current rotation position
  - Campaign history (last 30 days)
  - Active A/B tests
  - Rate limit state (emails sent today)
  - Excluded businesses (already contacted)

**Tools Used:**
- Supabase MCP (`execute_sql`) — query clients, email_campaigns, email_sends
- Filesystem — read `leaddrop/ROTATION.md`, client context docs

**Research Basis:**
- Research Section 5.2: Slash commands as entry points, CLAUDE.md as persistent configuration
- Research Section 6.3: ICP framework defines ideal profile dimensions

**Pseudocode:**
```
function loadClientContext(slug, mode, overrides):
    # Load client record
    client = supabase.query("SELECT * FROM clients WHERE slug = $1", slug)
    if not client:
        raise ClientNotFoundError(slug)

    # Load or detect rotation state
    if mode == "prospect":
        rotation = read_file("leaddrop/ROTATION.md")
        target = overrides.city or rotation.next_city
        industry = overrides.industry or rotation.next_industry
    else:
        target = client.context.regions
        industry = client.industry

    # Load exclusion list (already contacted)
    excluded = supabase.query("""
        SELECT DISTINCT business_name FROM email_sends
        WHERE client_id = $1 AND sent_at > NOW() - INTERVAL '90 days'
    """, client.id)

    # Load active A/B tests
    active_tests = supabase.query("""
        SELECT * FROM email_campaigns
        WHERE client_id = $1 AND status = 'active'
        AND test_type IS NOT NULL
    """, client.id)

    # Load rate limit state
    sent_today = supabase.query("""
        SELECT COUNT(*) FROM email_sends
        WHERE client_id = $1 AND sent_at::date = CURRENT_DATE
    """, client.id)

    return ClientContext(client, target, industry, excluded, active_tests, sent_today)
```

**Error Handling:**
- `ClientNotFoundError` — prompt user to run `/activate` first
- `RotationFileNotFound` — create default rotation from matrix
- `RateLimitExceeded` — report daily limit reached, suggest scheduling for tomorrow
- `SupabaseConnectionError` — retry 3x with exponential backoff, then fail with instructions

---

### 2.2 Agent 2: Lead Discovery Agent

**Role:** Find raw business leads using a waterfall of data sources (Apify Google Maps -> Firecrawl search -> Apollo enrichment -> Bright Data fallback), deduplicate against existing contacts, and return the best candidates.

**Inputs:**
- `ClientContext` from Agent 1
- Target count (default: 50 for `/drop` mode, 20 for `/serve` mode)
- Industry and city parameters

**Outputs:**
- `RawLead[]` — array of 50-100 candidate businesses with:
  - business_name, address, phone, website_url
  - google_rating, review_count, categories
  - owner_name (if available)
  - google_maps_url
  - source (which tool found it)

**Tools Used:**
- Apify MCP (`call-actor`) — Google Maps Scraper actor
- Firecrawl MCP (`firecrawl_search`) — supplemental discovery
- Apollo MCP (`organization_search`) — B2B enrichment
- Bright Data MCP (`search_engine`) — fallback search
- Supabase MCP — deduplication queries

**Research Basis:**
- Research Section 2.1: Apify Google Maps Scraper is #1 most-used actor (270K+ users, 100% success rate)
- Research Section 6.4: Clay.com waterfall enrichment pattern replicated with MCPs
- Research Section 9.1: Priority 1 tools = Hunter.io + Apollo.io + Bright Data

**Pseudocode:**
```
function discoverLeads(context, target_count):
    candidates = []

    # Primary: Apify Google Maps
    maps_results = apify.call_actor("compass/crawler-google-places", {
        search_terms: [f"{context.industry} in {context.city}"],
        max_results: target_count * 2  # overfetch for filtering
    })
    candidates.extend(parse_maps_results(maps_results))

    # Secondary: Firecrawl search (fills gaps)
    if len(candidates) < target_count:
        firecrawl_results = firecrawl.search(
            f"best {context.industry} {context.city} -yelp -yellowpages"
        )
        candidates.extend(parse_firecrawl_results(firecrawl_results))

    # Tertiary: Apollo (B2B mode only)
    if context.mode == "client" and len(candidates) < target_count:
        apollo_results = apollo.organization_search({
            industry: context.industry,
            location: context.city
        })
        candidates.extend(parse_apollo_results(apollo_results))

    # Deduplicate against existing contacts
    candidates = [c for c in candidates if c.business_name not in context.excluded]

    # Filter: must have website (required for research)
    candidates = [c for c in candidates if c.website_url]

    # Prioritize: mid-range reviews, no visible automation, owner name available
    candidates.sort(key=lambda c: score_candidate_priority(c), reverse=True)

    return candidates[:target_count]
```

**Error Handling:**
- `ApifyActorTimeout` — fall back to Firecrawl search + Bright Data
- `InsufficientResults` — widen geographic radius by 10 miles, retry
- `DuplicateDetectionFailure` — log warning, proceed with potential duplicates flagged
- `WebsiteUrlMissing` — skip lead, do not include in pipeline

---

### 2.3 Agent 3: Deep Research Agent

**Role:** For each raw lead, perform deep website analysis, review mining, tech stack detection, news/trigger event discovery, and competitive positioning. Runs in parallel (5 instances, 10 leads each for a batch of 50).

**Inputs:**
- `RawLead` — single business to research
- `ClientContext` — for ICP matching context

**Outputs:**
- `EnrichedLead` — the original lead plus:
  - website_analysis: services, ICP, differentiators, gaps (booking, chat, mobile, after-hours)
  - review_analysis: sentiment, keywords, pain_quotes, trend
  - tech_stack: CMS, analytics, booking system, CRM, chat widget
  - trigger_events: hiring, funding, news, reviews, website changes
  - competitor_context: nearby competitors count, comparative positioning
  - leads_for_them: 5 potential customers found for this business (LeadDrop mode)
  - revenue_estimate: estimated CLV of leads provided

**Tools Used:**
- Firecrawl MCP (`firecrawl_scrape`) — website content extraction
- Firecrawl MCP (`firecrawl_search`) — news and competitor discovery
- Apify MCP — tech stack detection, review scraping
- Bright Data MCP — fallback for blocked sites

**Research Basis:**
- Research Section 2.3: Wappalyzer-based tech stack detection for "I see you're using WordPress..." personalization
- Research Section 3.6: Trigger-based selling gets 20-35% response vs 5-10% for cold (UserGems/Boomerang)
- Research Section 6.1: Tier 1/2/3 data points define what to collect per prospect
- Research Section 4.5: Loss aversion framing requires specific revenue calculations

**Pseudocode:**
```
function deepResearch(raw_lead, context):
    enriched = EnrichedLead(raw_lead)

    # 1. Website Analysis
    try:
        site_data = firecrawl.scrape(raw_lead.website_url, {
            formats: ["markdown"],
            include_tags: ["main", "nav", "footer", "meta"]
        })
        enriched.website_analysis = analyze_website(site_data)
    except ScrapeError:
        # Fallback to Bright Data
        site_data = brightdata.scrape_as_markdown(raw_lead.website_url)
        enriched.website_analysis = analyze_website(site_data)

    # 2. Review Analysis
    enriched.review_analysis = analyze_reviews(raw_lead.google_rating,
        raw_lead.review_count, raw_lead.google_maps_url)

    # 3. Tech Stack Detection
    enriched.tech_stack = detect_tech_stack(raw_lead.website_url)

    # 4. Trigger Events
    news = firecrawl.search(f"{raw_lead.business_name} {raw_lead.city} news 2026")
    hiring = firecrawl.search(f"{raw_lead.business_name} hiring OR careers OR jobs")
    enriched.trigger_events = extract_triggers(news, hiring)

    # 5. Competitor Context
    competitors = firecrawl.search(
        f"{context.industry} near {raw_lead.address} -site:{raw_lead.website_url}"
    )
    enriched.competitor_context = analyze_competitors(competitors)

    # 6. Find Leads FOR Them (LeadDrop mode)
    if context.mode == "prospect":
        enriched.leads_for_them = find_leads_for_business(
            raw_lead, context.industry, context.city
        )
        enriched.revenue_estimate = calculate_lead_value(
            enriched.leads_for_them, context.industry
        )

    return enriched
```

**Error Handling:**
- `ScrapeBlocked` — try Bright Data MCP (76.8% success rate with proxy rotation)
- `WebsiteDown` — mark lead as `website_unreachable`, reduce score, skip tech stack
- `NoReviewsFound` — set review_analysis to neutral baseline, do not penalize
- `TriggerSearchTimeout` — proceed without triggers, note in enrichment metadata

---

### 2.4 Agent 4: Lead Scoring Agent

**Role:** Apply the 8-feature weighted scoring algorithm to each enriched lead, producing a 0-100 score. Filter leads below the quality threshold (Gate 1). Rank and select the top N for email crafting.

**Inputs:**
- `EnrichedLead[]` — all enriched leads from Agent 3
- `ClientContext` — ICP criteria for fit scoring
- Quality threshold (default: 40)

**Outputs:**
- `ScoredLead[]` — leads with scores 0-100, sorted descending
- `RejectedLead[]` — leads below threshold with rejection reasons
- Score distribution statistics

**Tools Used:**
- None (pure computation — Claude analysis)
- Supabase MCP — store scores in `lead_scores` table

**Research Basis:**
- Research Section 6.2: 7-feature weighted model (expanded to 8 features)
- Research Section 3.7: Frontiers in AI 2025 — ML-based scoring significantly improves prioritization
- Research Section 6.3: ICP framework dimensions define scoring criteria

**Pseudocode:**
```
function scoreLeads(enriched_leads, context, threshold=40):
    scored = []
    rejected = []

    for lead in enriched_leads:
        score = calculate_lead_score(lead, context)

        if score >= threshold:
            lead.score = score
            lead.tier = classify_tier(score)  # HOT/WARM/COOL
            scored.append(lead)

            # Store score breakdown in Supabase
            supabase.insert("lead_scores", {
                lead_id: lead.id,
                client_id: context.client.id,
                total_score: score,
                review_score: lead.scores.review,
                website_quality: lead.scores.website,
                tech_stack_gap: lead.scores.tech_gap,
                social_presence: lead.scores.social,
                trigger_events: lead.scores.triggers,
                decision_maker: lead.scores.dm_found,
                icp_fit: lead.scores.icp,
                competitive_density: lead.scores.competition
            })
        else:
            rejected.append({lead: lead, score: score, reason: get_rejection_reason(lead)})

    scored.sort(key=lambda l: l.score, reverse=True)

    stats = {
        total_scored: len(scored),
        total_rejected: len(rejected),
        avg_score: mean([l.score for l in scored]),
        score_distribution: histogram(scored),
        tier_breakdown: count_by_tier(scored)
    }

    return scored, rejected, stats
```

**Error Handling:**
- `AllLeadsBelowThreshold` — lower threshold by 10, log warning, alert operator
- `MissingFeatureData` — use neutral baseline (50/100) for missing features, flag in metadata
- `ScoreCalculationError` — log error, assign manual review flag, score as 50 (neutral)

---

### 2.5 Agent 5: Email Crafting Agent

**Role:** Generate hyper-personalized emails for each scored lead using the PAS framework, Cialdini persuasion principles, and all enrichment data. Runs in parallel (5 instances, 10 leads each for a batch of 50).

**Inputs:**
- `ScoredLead` — single lead with all enrichment data
- `ClientContext` — messaging guidelines, brand voice, CTA links
- Mode: `prospect` (LeadDrop free value) or `client` (paid client outreach)
- Active A/B test assignments

**Outputs:**
- `EmailDraft` containing:
  - subject_line (primary)
  - body (HTML and plaintext)
  - personalization_tokens used
  - psychology_principles applied
  - word_count, sentence_count
  - variant_id (if part of A/B test)

**Tools Used:**
- None (pure LLM generation — Claude crafts the email)

**Research Basis:**
- Research Section 3.1: 50-125 words, 6-8 sentences = highest reply rate
- Research Section 3.3: Question-based subjects (46% open rate), 4-7 words optimal
- Research Section 4.1: Cialdini reciprocity — personalized + unexpected = strongest trigger
- Research Section 4.2: PAS framework (Problem-Agitate-Solution)
- Research Section 4.4: Pattern interrupt — no "I hope this finds you well"
- Research Section 4.5: Loss aversion framing (2x stronger than gain framing)

**Pseudocode:**
```
function craftEmail(lead, context, mode, ab_test):
    # Select email framework based on mode
    if mode == "prospect":
        framework = LEADDROP_TEMPLATE  # Free 5 leads format
    else:
        framework = PAS_SP_TEMPLATE  # Pain-Agitate-Solution-Proof

    # Build personalization context
    personalization = {
        owner_name: lead.owner_name or "there",
        business_name: lead.business_name,
        city: lead.city,
        industry: context.industry,
        specific_insight: select_best_insight(lead),
        revenue_loss: lead.revenue_estimate,
        competitor_name: lead.competitor_context.top_competitor,
        review_quote: lead.review_analysis.best_pain_quote,
        tech_gap: lead.tech_stack.biggest_gap,
        trigger: lead.trigger_events.most_recent,
        leads_for_them: format_leads(lead.leads_for_them) if mode == "prospect" else None
    }

    # Select subject line pattern (respecting A/B test if active)
    if ab_test and ab_test.test_type == "subject_line":
        subject_pattern = ab_test.get_assigned_variant(lead.id)
    else:
        subject_pattern = select_best_subject(lead, personalization)

    # Generate email body
    subject = render_subject(subject_pattern, personalization)
    body = render_body(framework, personalization, context.cta_links)

    # Validate constraints
    word_count = count_words(body)
    sentence_count = count_sentences(body)
    assert 50 <= word_count <= 150, f"Email too {'short' if word_count < 50 else 'long'}: {word_count} words"
    assert 4 <= sentence_count <= 10, f"Bad sentence count: {sentence_count}"

    return EmailDraft(subject, body, personalization, word_count, sentence_count)
```

**Error Handling:**
- `EmailTooLong` — regenerate with stricter word limit instruction
- `PersonalizationMissing` — use generic fallback tokens, flag for review
- `SubjectLineTooLong` — truncate or regenerate at 4-7 words
- `TemplateRenderError` — log error, fall back to base PAS template without advanced personalization

---

### 2.6 Agent 6: A/B Variant Generator

**Role:** For leads assigned to active A/B tests, generate the alternate variant (control already generated by Agent 5). Ensure statistical validity of test allocation.

**Inputs:**
- `EmailDraft[]` — primary emails from Agent 5
- Active A/B test definitions from `email_campaigns`
- Allocation ratio (default: 50/50)

**Outputs:**
- `EmailVariant[]` — variant B emails for test-assigned leads
- Updated test allocation records

**Tools Used:**
- Supabase MCP — read/write test allocations to `email_variants`

**Research Basis:**
- Research Section 7.1: Woodpecker.co and Smartlead.ai A/B testing as industry standard
- Research Section 3.3: Subject line patterns have measurable open rate differences (21-46%)
- Research Section 3.1: Email length directly correlates with reply rate

**Pseudocode:**
```
function generateVariants(drafts, active_tests, allocation_ratio=0.5):
    variants = []

    for test in active_tests:
        # Get leads allocated to variant B
        eligible_leads = [d for d in drafts if test.matches_segment(d.lead)]
        variant_b_count = int(len(eligible_leads) * allocation_ratio)
        variant_b_leads = random.sample(eligible_leads, variant_b_count)

        for draft in variant_b_leads:
            if test.test_type == "subject_line":
                variant = draft.clone()
                variant.subject = generate_alt_subject(draft, test.variant_b_spec)
                variant.variant_id = test.variant_b_id
            elif test.test_type == "email_body":
                variant = draft.clone()
                variant.body = generate_alt_body(draft, test.variant_b_spec)
                variant.variant_id = test.variant_b_id
            elif test.test_type == "cta":
                variant = draft.clone()
                variant.body = swap_cta(draft.body, test.variant_b_spec)
                variant.variant_id = test.variant_b_id
            elif test.test_type == "send_time":
                variant = draft.clone()
                variant.scheduled_time = test.variant_b_spec.send_time
                variant.variant_id = test.variant_b_id
            elif test.test_type == "follow_up_cadence":
                variant = draft.clone()
                variant.follow_up_schedule = test.variant_b_spec.cadence
                variant.variant_id = test.variant_b_id

            variants.append(variant)

            # Record allocation
            supabase.insert("email_variants", {
                campaign_id: test.campaign_id,
                variant_label: "B",
                lead_id: draft.lead.id,
                subject_line: variant.subject,
                body_preview: variant.body[:200]
            })

    return variants
```

**Error Handling:**
- `InsufficientSampleSize` — pause test, log warning (need 100+ per variant for significance)
- `VariantGenerationFailed` — fall back to control variant, exclude from test analysis
- `AllocationImbalance` — rebalance by assigning next N leads to underrepresented variant

---

### 2.7 Agent 7: Verification Agent

**Role:** Run all emails through 4 verification gates before they can be sent. Any failure at any gate blocks the email and routes it to the appropriate remediation path.

**Inputs:**
- `EmailDraft[]` and `EmailVariant[]` — all emails ready for verification
- `ScoredLead[]` — for quality gate cross-reference
- Rate limit state from `ClientContext`

**Outputs:**
- `VerifiedEmail[]` — emails that passed all 4 gates
- `RejectedEmail[]` — emails that failed with gate ID, failure reason, remediation action
- Verification report

**Tools Used:**
- Hunter.io MCP — email address verification
- Supabase MCP — log failures to `verification_failures`

**Research Basis:**
- Research Section 2.2: Hunter.io 99% accuracy on non-catch-all addresses
- Research Section 7.3: Bounce rate under 2% required for deliverability
- Research Section 3.3: "RE:" or "FW:" fakes kill deliverability
- Research Section 7.3: Gmail spam complaints under 0.1% required

**Pseudocode:**
```
function verifyEmails(drafts, variants, scored_leads, context):
    all_emails = drafts + variants
    verified = []
    rejected = []

    for email in all_emails:
        failures = []

        # Gate 1: Lead Quality Threshold
        lead_score = get_score(email.lead_id, scored_leads)
        if lead_score < 40:
            failures.append(Gate1Failure("Score below threshold", lead_score))

        # Gate 2: Content Safety Check (10 checks)
        safety_result = content_safety_check(email)
        if not safety_result.passed:
            failures.append(Gate2Failure(safety_result.violations))

        # Gate 3: A/B Variant Equivalence
        if email.variant_id:
            equiv_result = check_variant_equivalence(email, get_control(email))
            if not equiv_result.passed:
                failures.append(Gate3Failure(equiv_result.reason))

        # Gate 4: Rate Limit Check
        rate_result = check_rate_limits(context, len(verified))
        if not rate_result.passed:
            failures.append(Gate4Failure(rate_result.reason))

        if failures:
            rejected.append({email: email, failures: failures})
            for f in failures:
                supabase.insert("verification_failures", {
                    email_id: email.id,
                    gate_number: f.gate,
                    failure_reason: f.reason,
                    remediation: f.remediation
                })
        else:
            verified.append(email)

    return verified, rejected
```

**Error Handling:**
- `HunterApiDown` — proceed with warning, log for manual verification later
- `AllEmailsRejected` — alert operator, do not send anything, provide remediation report
- `GateCheckTimeout` — retry once, then proceed with caution flag

---

### 2.8 Agent 8: Sending Agent

**Role:** Send verified emails via Gmail API with variable timing, proper authentication, and comprehensive delivery tracking. Implements warming-safe send patterns.

**Inputs:**
- `VerifiedEmail[]` — emails that passed all verification gates
- Send mode: `send` or `draft` (user preference)
- OAuth token from macOS Keychain

**Outputs:**
- `SentEmail[]` — successfully sent/drafted emails with Gmail message IDs
- `SendFailure[]` — emails that failed to send with error details

**Tools Used:**
- Google Workspace MCP (`draft_gmail_message`) — create drafts
- Gmail API (direct) — send drafts
- Supabase MCP — record sends in `email_sends`

**Research Basis:**
- Research Section 7.3: Variable sending volume (don't send exactly 25/day, send 22-28 randomly)
- Research Section 7.3: 0.5s sleep between sends prevents rate limits
- Research Section 7.3: Week 1-2: 5-10/day, Week 3-4: 15-20/day warming schedule
- Research Section 3.4: Tuesday 6-9 AM = highest reply rate

**Pseudocode:**
```
function sendEmails(verified_emails, mode, context):
    sent = []
    failures = []

    # Extract OAuth token
    oauth_token = extract_keychain_token("hardened-google-workspace-mcp")
    if not oauth_token:
        raise OAuthTokenError("Token expired or missing. Run /mcp to re-authenticate.")

    # Determine send order (randomize to avoid pattern detection)
    send_order = shuffle(verified_emails)

    # Calculate variable delay (0.3-0.8s, not exactly 0.5s)
    for email in send_order:
        try:
            if mode == "draft":
                result = gmail.draft_message(
                    to=email.lead.email,
                    subject=email.subject,
                    body=email.body,
                    from_="henry@agenticengineering.com"
                )
                status = "drafted"
            else:
                draft_id = gmail.draft_message(...)
                result = gmail.send_draft(draft_id, oauth_token)
                status = "sent"

            # Record in Supabase
            supabase.insert("email_sends", {
                campaign_id: context.campaign_id,
                lead_id: email.lead.id,
                variant_id: email.variant_id,
                subject_line: email.subject,
                gmail_message_id: result.message_id,
                status: status,
                sent_at: now()
            })
            sent.append(result)

        except GmailRateLimitError:
            sleep(5)  # Back off 5 seconds
            # Retry once
            try:
                result = gmail.send_draft(draft_id, oauth_token)
                sent.append(result)
            except:
                failures.append({email: email, error: "Rate limit after retry"})

        except Exception as e:
            failures.append({email: email, error: str(e)})

        # Variable delay between sends
        sleep(random.uniform(0.3, 0.8))

    return sent, failures
```

**Error Handling:**
- `OAuthTokenExpired` — re-extract from Keychain; if still expired, prompt user for `/mcp`
- `GmailRateLimitError` — back off 5s, retry once, then queue remaining for next batch
- `InvalidRecipient` — log to `verification_failures`, skip
- `DraftCreationFailed` — retry with simplified HTML, then plaintext fallback

---

### 2.9 Agent 9: Reply Detection Agent

**Role:** Poll the Gmail inbox for replies to sent outreach emails, classify reply intent (positive/negative/question/out-of-office/bounce), and update pipeline status accordingly.

**Inputs:**
- `SentEmail[]` — emails to monitor (from `email_sends` table)
- Monitoring window (default: last 30 days of active campaigns)

**Outputs:**
- `Reply[]` — classified replies with:
  - original_send_id
  - reply_type: positive | negative | question | out_of_office | bounce | unsubscribe
  - reply_content (summary)
  - recommended_action
- Updated `email_sends` statuses in Supabase

**Tools Used:**
- Google Workspace MCP (`search_gmail_messages`, `get_gmail_message_content`) — inbox polling
- Supabase MCP — update statuses

**Research Basis:**
- Research Section 3.5: 60% of total replies come from follow-ups — must detect replies to stop sequences
- Research Section 7.3: Gmail spam complaints under 0.1% — must honor unsubscribes immediately

**Pseudocode:**
```
function detectReplies(monitoring_window_days=30):
    replies = []

    # Get all active sends within window
    active_sends = supabase.query("""
        SELECT es.*, ec.campaign_name
        FROM email_sends es
        JOIN email_campaigns ec ON es.campaign_id = ec.id
        WHERE es.status IN ('sent', 'follow_up_1', 'follow_up_2')
        AND es.sent_at > NOW() - INTERVAL '$1 days'
    """, monitoring_window_days)

    # Search Gmail for replies
    for send in active_sends:
        gmail_replies = gmail.search(
            query=f"in:inbox subject:{send.subject_line} from:{send.lead_email}",
            after=send.sent_at
        )

        for reply in gmail_replies:
            content = gmail.get_message_content(reply.id)

            # Classify reply intent
            classification = classify_reply(content)

            # Update pipeline status
            new_status = map_classification_to_status(classification)
            supabase.update("email_sends",
                {id: send.id},
                {status: new_status, reply_detected_at: now(), reply_classification: classification}
            )

            # Update lead status
            if classification == "positive":
                supabase.update("leads", {id: send.lead_id}, {status: "replied"})
            elif classification == "unsubscribe":
                supabase.update("leads", {id: send.lead_id}, {status: "declined"})

            replies.append(Reply(send, classification, content.summary))

    return replies
```

**Error Handling:**
- `GmailSearchTimeout` — retry with narrower date range
- `ClassificationUncertain` — flag for human review, do not auto-update status
- `BounceDetected` — mark email as invalid in `lead_scores`, exclude from future sends

---

### 2.10 Agent 10: Follow-Up Agent

**Role:** Execute the 3-7-7 follow-up cadence (Day 3, Day 10, Day 17) for sent emails that have not received replies. Generate contextually aware follow-ups that reference the original email and add new value.

**Inputs:**
- Active email sends from `email_sends` with no reply detected
- Follow-up templates from `outreach/templates/follow-up.md`
- A/B test assignments for follow-up cadence tests

**Outputs:**
- `FollowUpEmail[]` — personalized follow-up emails ready for verification
- Updated follow-up status in `email_sends`

**Tools Used:**
- Supabase MCP — query due follow-ups, update tracking
- Filesystem — read follow-up templates

**Research Basis:**
- Research Section 3.5: Follow-up 1 increases reply rate by +49%; 60% of replies come from follow-ups
- Research Section 3.5: 3-7-7 cadence captures 93% of replies by Day 10
- Research Section 3.5: Max 3 follow-ups (4th risks 1.6% spam rate, 2% unsubscribe)
- Research Section 4.3: Benjamin Franklin effect — ask small favor before asking for business

**Pseudocode:**
```
function generateFollowUps():
    follow_ups = []

    # Day 3 follow-ups
    day3_due = supabase.query("""
        SELECT es.*, l.business_name, l.owner_name, l.city, l.industry
        FROM email_sends es
        JOIN leads l ON es.lead_id = l.id
        WHERE es.status = 'sent'
        AND es.sent_at <= NOW() - INTERVAL '3 days'
        AND es.followup_1_sent_at IS NULL
        AND es.reply_detected_at IS NULL
    """)

    for send in day3_due:
        template = load_template("follow-up", "day3")
        email = personalize_followup(template, send, {
            name: send.owner_name or "there",
            day: day_of_week(send.sent_at),
            city: send.city,
            business_name: send.business_name
        })
        email.followup_number = 1
        follow_ups.append(email)

    # Day 10 follow-ups (was Day 7 in old system — updated per research)
    day10_due = supabase.query("""
        SELECT es.*, l.*
        FROM email_sends es JOIN leads l ON es.lead_id = l.id
        WHERE es.status = 'sent'
        AND es.sent_at <= NOW() - INTERVAL '10 days'
        AND es.followup_1_sent_at IS NOT NULL
        AND es.followup_2_sent_at IS NULL
        AND es.reply_detected_at IS NULL
    """)

    for send in day10_due:
        template = load_template("follow-up", "day10")
        email = personalize_followup(template, send, {
            name: send.owner_name or "there",
            industry: send.industry,
            city: send.city
        })
        email.followup_number = 2
        follow_ups.append(email)

    # Day 17 follow-ups (was Day 14 — updated per research)
    day17_due = supabase.query("""
        SELECT es.*, l.*
        FROM email_sends es JOIN leads l ON es.lead_id = l.id
        WHERE es.status = 'sent'
        AND es.sent_at <= NOW() - INTERVAL '17 days'
        AND es.followup_2_sent_at IS NOT NULL
        AND es.followup_3_sent_at IS NULL
        AND es.reply_detected_at IS NULL
    """)

    for send in day17_due:
        template = load_template("follow-up", "day17")
        email = personalize_followup(template, send, {
            name: send.owner_name or "there",
            industry: send.industry,
            city: send.city,
            business_name: send.business_name
        })
        email.followup_number = 3
        follow_ups.append(email)

    return follow_ups
```

**Error Handling:**
- `NoFollowUpsDue` — log "Pipeline healthy, no follow-ups due" and show lookahead
- `TemplateNotFound` — generate follow-up from scratch using PAS framework
- `LeadStatusChanged` — skip (they replied, booked, or declined since query)
- `FollowUpAfterDay17` — archive lead, set status to "exhausted", eligible for re-drop in 90 days

---

### 2.11 Agent 11: Analytics Agent

**Role:** Compute KPIs, analyze A/B test results, generate trend reports, and provide actionable optimization recommendations. Runs after every send batch and on-demand.

**Inputs:**
- All data from `email_campaigns`, `email_variants`, `email_sends`, `lead_scores`
- Date range (default: last 30 days)
- Comparison period (default: previous 30 days)

**Outputs:**
- `CampaignReport` containing:
  - Overall KPIs (open rate, reply rate, booking rate, conversion rate)
  - A/B test results with statistical significance
  - Lead score distribution and accuracy
  - Follow-up effectiveness by stage
  - Recommendations for next iteration
- Updated `email_campaigns` statistics

**Tools Used:**
- Supabase MCP — aggregate queries across all campaign tables
- None (pure computation for statistics)

**Research Basis:**
- Research Section 3.2: Personalization yields +133% reply rate improvement — must measure it
- Research Section 7.1: Regie.ai optimizes sequences based on performance data — our analytics enables this
- Research Section 3.7: ML-based scoring models require feedback loops for calibration

**Pseudocode:**
```
function generateAnalytics(date_range, comparison_range):
    report = CampaignReport()

    # Overall KPIs
    report.kpis = supabase.query("""
        SELECT
            COUNT(*) as total_sent,
            COUNT(CASE WHEN reply_detected_at IS NOT NULL THEN 1 END) as total_replies,
            COUNT(CASE WHEN reply_classification = 'positive' THEN 1 END) as positive_replies,
            COUNT(CASE WHEN status = 'booked' THEN 1 END) as bookings,
            COUNT(CASE WHEN status = 'converted' THEN 1 END) as conversions,
            ROUND(COUNT(CASE WHEN reply_detected_at IS NOT NULL THEN 1 END)::numeric
                / NULLIF(COUNT(*), 0) * 100, 2) as reply_rate,
            ROUND(COUNT(CASE WHEN status = 'booked' THEN 1 END)::numeric
                / NULLIF(COUNT(*), 0) * 100, 2) as booking_rate
        FROM email_sends
        WHERE sent_at BETWEEN $1 AND $2
    """, date_range.start, date_range.end)

    # A/B Test Results
    for test in get_active_tests():
        test_data = supabase.query("""
            SELECT
                ev.variant_label,
                COUNT(*) as sends,
                COUNT(CASE WHEN es.reply_detected_at IS NOT NULL THEN 1 END) as replies,
                COUNT(CASE WHEN es.status = 'booked' THEN 1 END) as bookings
            FROM email_variants ev
            JOIN email_sends es ON ev.lead_id = es.lead_id AND ev.campaign_id = es.campaign_id
            WHERE ev.campaign_id = $1
            GROUP BY ev.variant_label
        """, test.campaign_id)

        # Chi-square significance test
        significance = chi_square_test(test_data)
        report.ab_tests.append({
            test: test,
            data: test_data,
            significant: significance.p_value < 0.05,
            p_value: significance.p_value,
            winner: determine_winner(test_data) if significance.p_value < 0.05 else "inconclusive"
        })

    # Lead Score Accuracy (did high-scoring leads actually convert more?)
    report.score_accuracy = supabase.query("""
        SELECT
            CASE
                WHEN ls.total_score >= 80 THEN 'HOT (80-100)'
                WHEN ls.total_score >= 60 THEN 'WARM (60-79)'
                WHEN ls.total_score >= 40 THEN 'COOL (40-59)'
                ELSE 'COLD (0-39)'
            END as tier,
            COUNT(*) as total,
            COUNT(CASE WHEN es.reply_classification = 'positive' THEN 1 END) as positive_replies,
            ROUND(AVG(ls.total_score), 1) as avg_score
        FROM lead_scores ls
        JOIN email_sends es ON ls.lead_id = es.lead_id
        WHERE ls.scored_at BETWEEN $1 AND $2
        GROUP BY tier ORDER BY avg_score DESC
    """, date_range.start, date_range.end)

    # Generate recommendations
    report.recommendations = generate_recommendations(report)

    return report
```

**Error Handling:**
- `InsufficientData` — return partial report with confidence warnings
- `ABTestIncomplete` — report current state but flag as "needs more data"
- `ScoreAccuracyPoor` — recommend recalibration of scoring weights

---

## 3. 12-Stage Data Pipeline

### 3.1 Pipeline Overview

```
STAGE 1          STAGE 2           STAGE 3          STAGE 4
CONTEXT          DISCOVERY         ENRICHMENT       SCORING
LOAD             (Parallel)        (Parallel x5)    (Sequential)
  |                |                 |                 |
  v                v                 v                 v
+---------+   +-----------+   +----------+   +--------+
| Client  |-->| Apify     |-->| Website  |-->| 8-feat |
| Config  |   | Firecrawl |   | Reviews  |   | Algo   |
| ICP     |   | Apollo    |   | TechStack|   | 0-100  |
| Rotation|   | BrightData|   | News     |   | Rank   |
| History |   |           |   | Triggers |   | Filter |
+---------+   +-----------+   +----------+   +--------+
  Agent 1       Agent 2         Agent 3        Agent 4
                                                 |
                 +-------------------------------+
                 |
                 v
STAGE 5          STAGE 6           STAGE 7          STAGE 8
EMAIL            A/B VARIANT       VERIFICATION     SENDING
CRAFTING         GENERATION        (4 Gates)        (Gmail API)
(Parallel x5)   (Sequential)      (Sequential)     (Sequential)
  |                |                 |                 |
  v                v                 v                 v
+---------+   +-----------+   +----------+   +--------+
| PAS     |-->| Subject   |-->| Gate 1:  |-->| Draft  |
| Cialdini|   | Body      |   | Quality  |   | Send   |
| Pattern |   | CTA       |   | Gate 2:  |   | Track  |
| Interrupt|  | SendTime  |   | Safety   |   | Sleep  |
| Loss    |   | Cadence   |   | Gate 3:  |   | Log    |
| Aversion|   |           |   | Equiv    |   |        |
+---------+   +-----------+   | Gate 4:  |   +--------+
  Agent 5       Agent 6       | RateLimit|     Agent 8
                              +----------+
                                Agent 7
                                   |
                 +-----------------+
                 |
                 v
STAGE 9          STAGE 10          STAGE 11         STAGE 12
REPLY            FOLLOW-UP         ANALYTICS        FEEDBACK
DETECTION        ENGINE            COMPUTATION      LOOP
(Polling)        (Scheduled)       (On-demand)      (Continuous)
  |                |                 |                 |
  v                v                 v                 v
+---------+   +-----------+   +----------+   +--------+
| Gmail   |-->| Day 3     |-->| KPIs     |-->| Score  |
| Search  |   | Day 10    |   | A/B Test |   | Recal  |
| Classify|   | Day 17    |   | Chi-sq   |   | Templ  |
| Update  |   | Breakup   |   | Trends   |   | Optim  |
| Route   |   | Archive   |   | Recomm   |   | ICP    |
+---------+   +-----------+   +----------+   | Refine |
  Agent 9       Agent 10        Agent 11      +--------+
                                               All Agents
```

### 3.2 Stage-by-Stage Data Flow

#### Stage 1: Context Load
- **Input:** Client slug + mode flag + overrides
- **Process:** Query Supabase for client record, load rotation state, fetch exclusion list, load active A/B tests, check daily rate limit
- **Output:** `ClientContext` object
- **Data Size:** ~2KB JSON
- **Duration:** ~2 seconds

#### Stage 2: Lead Discovery
- **Input:** `ClientContext` (city, industry, target count)
- **Process:** Waterfall: Apify Google Maps (primary) -> Firecrawl search (secondary) -> Apollo org search (tertiary) -> Bright Data (fallback). Deduplicate. Filter for website_url required. Prioritize by candidate scoring heuristic.
- **Output:** `RawLead[]` (50-100 candidates)
- **Data Size:** ~50KB JSON (100 leads x 500 bytes each)
- **Duration:** ~30-60 seconds (Apify actor run)

#### Stage 3: Deep Enrichment
- **Input:** `RawLead[]` (top 50 candidates)
- **Process:** 5 parallel agents, each researching 10 leads. Per lead: Firecrawl website scrape, review analysis, tech stack detection, news/trigger search, competitor context, find-leads-for-them (LeadDrop mode).
- **Output:** `EnrichedLead[]` (50 enriched)
- **Data Size:** ~500KB JSON (50 leads x 10KB each)
- **Duration:** ~3-5 minutes (parallel, Firecrawl bottleneck)

#### Stage 4: Scoring
- **Input:** `EnrichedLead[]`
- **Process:** Apply 8-feature weighted algorithm. Score 0-100. Filter below threshold (40). Classify tiers (HOT/WARM/COOL). Store in `lead_scores`. Generate distribution stats.
- **Output:** `ScoredLead[]` (typically 35-45 of 50 pass threshold)
- **Data Size:** ~400KB JSON
- **Duration:** ~5 seconds (computation only)

#### Stage 5: Email Crafting
- **Input:** `ScoredLead[]` + `ClientContext`
- **Process:** 5 parallel agents, each crafting 10 emails. Per email: select framework (LeadDrop or PAS-SP), build personalization tokens, select subject pattern, generate body, validate word/sentence count.
- **Output:** `EmailDraft[]`
- **Data Size:** ~200KB (50 emails x 4KB each)
- **Duration:** ~2-3 minutes (parallel LLM generation)

#### Stage 6: A/B Variant Generation
- **Input:** `EmailDraft[]` + active A/B tests
- **Process:** For each active test, identify eligible leads, allocate 50/50 to control/variant, generate variant B emails, record allocations.
- **Output:** `EmailVariant[]` (typically 15-25 variants if 1-2 tests active)
- **Data Size:** ~100KB
- **Duration:** ~1-2 minutes

#### Stage 7: Verification
- **Input:** `EmailDraft[]` + `EmailVariant[]`
- **Process:** Run 4 gates sequentially: (1) lead quality threshold, (2) content safety 10-point check, (3) A/B variant equivalence, (4) rate limit compliance. Log failures. Route verified to Stage 8, rejected to remediation.
- **Output:** `VerifiedEmail[]` + `RejectedEmail[]`
- **Data Size:** ~300KB
- **Duration:** ~10-30 seconds (Hunter.io API calls for verification)

#### Stage 8: Sending
- **Input:** `VerifiedEmail[]` + send mode
- **Process:** Extract OAuth token. Shuffle send order. For each: create draft, send if mode=send, record in `email_sends`, variable delay 0.3-0.8s.
- **Output:** `SentEmail[]` + `SendFailure[]`
- **Data Size:** ~50KB metadata
- **Duration:** ~2-5 minutes (50 emails x 0.5s avg delay)

#### Stage 9: Reply Detection
- **Input:** Active sends from last 30 days
- **Process:** Poll Gmail inbox for replies matching sent subjects/recipients. Classify intent (positive/negative/question/OOO/bounce/unsubscribe). Update `email_sends` and `leads` statuses.
- **Output:** `Reply[]` with classifications
- **Data Size:** ~10KB per run
- **Duration:** ~30-60 seconds

#### Stage 10: Follow-Up Execution
- **Input:** Unreplied sends past cadence thresholds
- **Process:** Query Day 3/10/17 due sends. Load templates. Personalize. Route through Stages 7-8 (verification + sending).
- **Output:** `FollowUpEmail[]`
- **Data Size:** ~50KB
- **Duration:** ~2-3 minutes

#### Stage 11: Analytics Computation
- **Input:** All campaign data for date range
- **Process:** Compute KPIs. Run chi-square on A/B tests. Analyze score accuracy. Generate trend comparisons. Produce recommendations.
- **Output:** `CampaignReport`
- **Data Size:** ~20KB
- **Duration:** ~10 seconds

#### Stage 12: Feedback Loop
- **Input:** `CampaignReport` + historical data
- **Process:** Recalibrate scoring weights based on actual conversion data. Update email template effectiveness rankings. Refine ICP criteria. Adjust send time optimization.
- **Output:** Updated weights, templates, ICP criteria
- **Data Size:** Configuration updates
- **Duration:** ~5 seconds

### 3.3 Total Pipeline Execution Time

| Phase | Stages | Duration | Parallelism |
|-------|--------|----------|-------------|
| Context & Discovery | 1-2 | ~1 minute | Sequential |
| Enrichment & Scoring | 3-4 | ~4 minutes | 5x parallel (Stage 3) |
| Content Generation | 5-6 | ~3 minutes | 5x parallel (Stage 5) |
| Verification & Sending | 7-8 | ~5 minutes | Sequential |
| Post-Send | 9-11 | ~2 minutes | Sequential |
| Feedback | 12 | ~5 seconds | Sequential |
| **TOTAL** | **1-12** | **~15 minutes** | |

---

## 4. Verification Gates

### 4.1 Gate 1: Lead Quality Threshold

**Purpose:** Ensure only leads meeting minimum quality standards enter the email pipeline.

**Threshold:** Score >= 40 (COOL tier or above)

**Checks:**
1. Total score >= 40
2. Has valid email address (not empty/null)
3. Has business name
4. Has website URL (required for personalization verification)
5. Not in exclusion list (already contacted within 90 days)
6. Not marked as "declined" or "unsubscribed" in any table

**Pass Criteria:** All 6 checks pass

**Failure Action:** Route to `RejectedLead[]` with specific check that failed. If score is 35-39, flag as "borderline" for manual review.

---

### 4.2 Gate 2: Content Safety Check (10 Checks)

**Purpose:** Ensure no email content damages deliverability, brand reputation, or legal compliance.

**10 Content Safety Checks:**

| # | Check | Rule | Failure Example |
|---|-------|------|-----------------|
| 1 | **No deceptive subjects** | Subject must not contain "RE:", "FW:", "FWD:", or fake reply indicators | "RE: Your inquiry" when no prior email exists |
| 2 | **No urgency spam words** | Subject must not contain "URGENT", "ASAP", "ACT NOW", "LIMITED TIME", "LAST CHANCE" | "URGENT: Your business needs this NOW" |
| 3 | **Word count range** | Body must be 50-150 words (research optimal: 50-125) | 200+ word email that will not be read |
| 4 | **Sentence count range** | Body must be 4-10 sentences (research optimal: 6-8) | 15-sentence email (3.8% response rate per Belkins) |
| 5 | **No broken personalization** | No literal `[placeholder]` tokens remaining in subject or body | "Hi [Name], I found leads for [Business Name]" |
| 6 | **CTA present** | Email must contain exactly one clear CTA (Calendly link or reply prompt) | Email with no call-to-action |
| 7 | **Unsubscribe mechanism** | Email must include opt-out language or mechanism | Missing "reply STOP to unsubscribe" |
| 8 | **No competitor disparagement** | Body must not contain negative claims about named competitors | "Unlike [Competitor] which has terrible reviews..." |
| 9 | **No false claims** | No unverifiable statistics or fabricated social proof | "We helped 500 businesses" when client count is 2 |
| 10 | **Link safety** | All URLs must be valid and not shortened (no bit.ly etc.) | Broken Calendly link or suspicious short URL |

**Pass Criteria:** All 10 checks pass

**Failure Action:** Log violation(s), return email to Agent 5 for regeneration with specific fix instructions. After 2 regeneration failures, flag for human review.

---

### 4.3 Gate 3: A/B Variant Equivalence

**Purpose:** Ensure A/B test variants differ ONLY in the tested dimension, so results are attributable to the intended variable.

**Checks:**
1. **Single variable difference** — Control and variant differ in exactly one dimension (subject OR body OR CTA OR send time OR cadence)
2. **Comparable length** — Variant word count within +/-20% of control
3. **Same personalization depth** — Same number of personalization tokens used
4. **Same CTA type** — Unless CTA is the tested variable, both must use same CTA
5. **Same tone** — Sentiment analysis scores within 0.1 of each other (unless body is tested variable)

**Pass Criteria:** All applicable checks pass (some checks are skipped when that dimension is the tested variable)

**Failure Action:** Regenerate variant with explicit constraints. If regeneration fails, exclude lead from A/B test (assign to control).

---

### 4.4 Gate 4: Rate Limit Check

**Purpose:** Prevent sending volume that would damage domain reputation or trigger Gmail rate limits.

**Checks:**
1. **Daily limit not exceeded** — Total sends today < configured daily max (varies by warming phase)
   - Week 1-2: max 10/day
   - Week 3-4: max 20/day
   - Week 5-6: max 40/day
   - Week 7+: max 50/day per inbox
2. **Hourly limit** — Sends in last hour < 15
3. **Per-recipient domain limit** — Max 3 emails to same domain in 24h
4. **Bounce rate check** — If bounce rate in last 7 days > 2%, pause all sending
5. **Spam complaint check** — If complaint rate > 0.1%, pause all sending

**Pass Criteria:** All 5 checks pass

**Failure Action:**
- Daily/hourly limit: Queue remaining emails for next available window
- Domain limit: Defer to next day
- Bounce/complaint rate: HALT ALL SENDING, alert operator, recommend domain audit

---

## 5. A/B Testing Framework

### 5.1 Test Registry

| Test ID | Test Type | Variable | Control (A) | Variant (B) | Min Sample | Target Metric |
|---------|-----------|----------|-------------|-------------|------------|---------------|
| T001 | `subject_line` | Question vs Statement | "5 leads for [Business] — free" | "Quick question about [Business]'s growth?" | 100/variant | Open rate |
| T002 | `subject_line` | Short vs Medium | "[Name], 5 leads" (3 words) | "5 people looking for [service] in [city] right now" (9 words) | 100/variant | Open rate |
| T003 | `email_body` | PAS vs Direct Value | Full PAS framework email | Lead-with-value (leads first, pitch second) | 100/variant | Reply rate |
| T004 | `cta` | Calendly vs Reply | "Book 15 min: [Calendly link]" | "Just reply 'interested' and I'll send details" | 100/variant | Conversion rate |
| T005 | `send_time` | Morning vs Afternoon | 7:00 AM recipient time | 1:30 PM recipient time | 100/variant | Reply rate |
| T006 | `follow_up_cadence` | 3-7-7 vs 3-5-5 | Day 3, Day 10, Day 17 | Day 3, Day 8, Day 13 | 50/variant | Total reply rate |
| T007 | `personalization_depth` | Standard vs Deep | Website + reviews | Website + reviews + tech stack + news + triggers | 100/variant | Reply rate |

### 5.2 Allocation Algorithm

```
function allocateToTest(lead, active_tests):
    for test in active_tests:
        # Check eligibility
        if not test.matches_segment(lead):
            continue
        if test.is_full():  # Both variants have reached max sample
            continue

        # Deterministic allocation based on lead ID hash
        # This ensures same lead always gets same variant (idempotent)
        hash_value = md5(lead.id + test.id)
        variant = "A" if hash_value % 2 == 0 else "B"

        # Check balance — switch if one variant is >55% of allocations
        counts = get_variant_counts(test.id)
        if counts[variant] / (counts["A"] + counts["B"] + 1) > 0.55:
            variant = "A" if variant == "B" else "B"

        return TestAllocation(test_id=test.id, variant=variant)

    return None  # No active test applies
```

### 5.3 Chi-Square Significance Testing

```
function chiSquareTest(test_data):
    """
    Test whether the difference between variant A and B
    is statistically significant (p < 0.05).

    test_data format:
    {
        "A": {sends: 120, replies: 14},
        "B": {sends: 118, replies: 22}
    }
    """
    # Build contingency table
    #              Reply    No Reply    Total
    # Variant A:   14       106         120
    # Variant B:   22       96          118
    # Total:       36       202         238

    a_reply = test_data["A"]["replies"]
    a_no_reply = test_data["A"]["sends"] - a_reply
    b_reply = test_data["B"]["replies"]
    b_no_reply = test_data["B"]["sends"] - b_reply
    total = test_data["A"]["sends"] + test_data["B"]["sends"]
    total_reply = a_reply + b_reply
    total_no_reply = a_no_reply + b_no_reply

    # Expected values
    e_a_reply = (test_data["A"]["sends"] * total_reply) / total
    e_a_no_reply = (test_data["A"]["sends"] * total_no_reply) / total
    e_b_reply = (test_data["B"]["sends"] * total_reply) / total
    e_b_no_reply = (test_data["B"]["sends"] * total_no_reply) / total

    # Chi-square statistic
    chi2 = (
        (a_reply - e_a_reply)**2 / e_a_reply +
        (a_no_reply - e_a_no_reply)**2 / e_a_no_reply +
        (b_reply - e_b_reply)**2 / e_b_reply +
        (b_no_reply - e_b_no_reply)**2 / e_b_no_reply
    )

    # p-value (1 degree of freedom)
    # chi2 > 3.841 => p < 0.05 (significant)
    # chi2 > 6.635 => p < 0.01 (highly significant)
    # chi2 > 10.828 => p < 0.001 (very highly significant)
    significant = chi2 > 3.841

    # Determine winner
    a_rate = a_reply / test_data["A"]["sends"]
    b_rate = b_reply / test_data["B"]["sends"]
    winner = "B" if b_rate > a_rate else "A"
    lift = abs(b_rate - a_rate) / a_rate * 100  # % improvement

    return {
        chi2: chi2,
        p_value: lookup_p_value(chi2),
        significant: significant,
        winner: winner if significant else "inconclusive",
        lift: lift,
        a_rate: a_rate,
        b_rate: b_rate,
        confidence_level: "95%" if chi2 > 3.841 else ("99%" if chi2 > 6.635 else "N/S")
    }
```

### 5.4 A/B Test Supabase Schema

See Section 7 for the complete `email_campaigns` and `email_variants` table definitions which support the A/B testing framework.

### 5.5 Test Lifecycle

1. **Create** — Define test via Analytics Agent or manual entry in `email_campaigns`
2. **Activate** — Set `status = 'active'`, Agent 6 starts generating variants
3. **Collect** — Data accumulates as emails are sent and replies detected
4. **Analyze** — Agent 11 runs chi-square test after minimum sample reached
5. **Conclude** — If significant: declare winner, set `status = 'concluded'`, `winner_variant` recorded
6. **Apply** — Winning variant becomes new default for that dimension
7. **Archive** — Test data retained for historical analysis

---

## 6. Lead Scoring Algorithm

### 6.1 8-Feature Weighted Model

```
LEAD_SCORE = (
    review_score          * 0.12 +   # Google rating quality signal
    review_volume          * 0.08 +   # Business establishment signal
    website_quality        * 0.12 +   # Investment-in-growth signal
    tech_stack_gap         * 0.15 +   # Need-for-our-service signal
    social_presence        * 0.08 +   # Growth-mindedness signal
    trigger_events         * 0.20 +   # Buying-window signal
    decision_maker_found   * 0.10 +   # Reachability signal
    icp_fit                * 0.15     # Target-match signal
)
```

**Total weights: 1.00**

### 6.2 Feature Scoring Rules

#### Feature 1: Review Score (weight: 0.12)

| Google Rating | Raw Score (0-100) | Rationale |
|--------------|-------------------|-----------|
| 4.5-5.0 | 70 | Good business but may feel they don't need help |
| 4.0-4.4 | 100 | Sweet spot — established, room to grow |
| 3.5-3.9 | 90 | Needs improvement — high motivation |
| 3.0-3.4 | 60 | Significant issues — may be defensive |
| < 3.0 | 30 | May not have budget or willingness |
| No rating | 50 | Unknown — neutral baseline |

**Research basis:** Section 6.3 ICP Framework — "3.5-4.5 stars, 20+ reviews (established but room to grow)"

#### Feature 2: Review Volume (weight: 0.08)

| Review Count | Raw Score (0-100) | Rationale |
|-------------|-------------------|-----------|
| 200+ | 60 | Likely corporate/chain — harder to reach owner |
| 50-199 | 100 | Sweet spot — established, active, reachable |
| 20-49 | 90 | Growing business, decision-maker accessible |
| 5-19 | 70 | Newer business, might not have budget yet |
| < 5 | 40 | Too new or inactive |
| 0 | 30 | Suspicious — may not be real business |

**Research basis:** Section 6.3 — "Revenue $500K-$5M/year (big enough to afford $200/mo, small enough to need us)"

#### Feature 3: Website Quality (weight: 0.12)

| Signal | Score Modifier | Detection Method |
|--------|---------------|------------------|
| Modern design (responsive, fast) | +25 | Firecrawl scrape analysis |
| Has blog/content | +15 | Page count > 5 |
| Professional photography | +10 | Image analysis |
| SSL certificate | +10 | HTTPS check |
| Mobile responsive | +10 | Viewport meta tag |
| Has contact form | +10 | Form element detection |
| Custom domain email | +10 | Not @gmail/@yahoo |
| Outdated design (table layout, Flash) | -20 | HTML analysis |
| No SSL | -15 | HTTP only |
| Under construction / placeholder | -30 | Content analysis |

**Max: 100, Min: 0**

**Research basis:** Section 6.1 Tier 1 data — website quality indicates investment in growth

#### Feature 4: Tech Stack Gap (weight: 0.15)

| Gap Detected | Score Modifier | Rationale |
|-------------|---------------|-----------|
| No CRM/marketing automation | +30 | Core need we fill |
| No online booking system | +25 | Major pain point for service businesses |
| No chat widget | +20 | Missing lead capture |
| No analytics (no GA/GTM) | +15 | Not tracking — needs help |
| No email marketing tool | +10 | Growth opportunity |
| Has Salesforce/HubSpot | -20 | Already invested in tooling |
| Has full marketing stack | -30 | Low need for our services |

**Max: 100, Min: 0. Higher score = bigger gap = more need for us.**

**Research basis:** Section 2.3 — Wappalyzer-based detection, "I see you're using WordPress..." personalization. Section 6.3 — "Digital maturity: Has website, NO marketing automation/CRM"

#### Feature 5: Social Presence (weight: 0.08)

| Signal | Raw Score (0-100) | Rationale |
|--------|-------------------|-----------|
| Active on 3+ platforms (posts within 30 days) | 100 | Growth-minded, invests in marketing |
| Active on 1-2 platforms | 80 | Some marketing awareness |
| Has profiles but inactive (>90 days) | 50 | Aware but not executing |
| No social presence | 30 | May not value digital marketing |

**Research basis:** Section 6.1 Tier 2 data — "Social media presence (Facebook, Instagram activity)"

#### Feature 6: Trigger Events (weight: 0.20)

| Trigger Type | Score Modifier | Rationale |
|-------------|---------------|-----------|
| New job posting (hiring) | +25 | Expanding — has budget |
| New location opening | +25 | Growth phase — maximum need |
| Website recently redesigned | +20 | Investing in growth |
| Negative Google review (last 30 days) | +20 | Pain is fresh |
| Competitor opened nearby | +15 | Competitive pressure |
| Seasonal timing match | +15 | Buying window |
| Recent news mention | +10 | Active/visible business |
| No triggers detected | 0 | Cold — no buying window |

**Max: 100, Min: 0. Multiple triggers stack.**

**Research basis:** Section 3.6 — "Trigger-based selling: 20-35% response rate vs 5-10% for cold"

#### Feature 7: Decision Maker Found (weight: 0.10)

| Signal | Raw Score (0-100) | Rationale |
|--------|-------------------|-----------|
| Owner name + direct email found | 100 | Maximum reachability |
| Owner name found, generic email | 80 | Can personalize, email may reach |
| Owner name found, no email | 60 | Can personalize but need to find email |
| No owner name, has email | 40 | Email works but no personalization |
| No owner name, no email (contact form only) | 20 | Low reachability |

**Research basis:** Section 6.2 — "decision_maker_found * 0.15" (adjusted weight to 0.10 to make room for ICP fit)

#### Feature 8: ICP Fit (weight: 0.15)

| Dimension | Score Modifier | Rationale |
|-----------|---------------|-----------|
| Revenue $500K-$5M estimated | +25 | Sweet spot — can afford us |
| Team size 2-20 | +25 | Owner still makes decisions |
| Mid-size city location | +20 | Less competition for leads |
| Matching industry segment | +15 | Direct ICP match |
| Pain indicators in reviews | +15 | Evidence of problem we solve |
| Revenue < $200K estimated | -20 | May not have budget |
| Revenue > $10M estimated | -10 | Likely has existing vendors |
| 50+ employees | -15 | Procurement process, longer sales cycle |

**Max: 100, Min: 0**

**Research basis:** Section 6.3 — Complete ICP Framework table

### 6.3 Score Formula (Complete)

```
function calculateLeadScore(lead, context):
    # Calculate raw scores for each feature
    f1 = score_review_rating(lead.google_rating)              # 0-100
    f2 = score_review_volume(lead.review_count)               # 0-100
    f3 = score_website_quality(lead.website_analysis)         # 0-100
    f4 = score_tech_stack_gap(lead.tech_stack)                # 0-100
    f5 = score_social_presence(lead.social_analysis)          # 0-100
    f6 = score_trigger_events(lead.trigger_events)            # 0-100
    f7 = score_decision_maker(lead.owner_name, lead.email)    # 0-100
    f8 = score_icp_fit(lead, context.icp_criteria)            # 0-100

    # Apply weights
    total = (
        f1 * 0.12 +
        f2 * 0.08 +
        f3 * 0.12 +
        f4 * 0.15 +
        f5 * 0.08 +
        f6 * 0.20 +
        f7 * 0.10 +
        f8 * 0.15
    )

    # Clamp to 0-100
    return max(0, min(100, round(total)))
```

### 6.4 Qualification Tiers

| Tier | Score Range | Action | Expected Reply Rate |
|------|------------|--------|-------------------|
| **HOT** | 80-100 | Send immediately, prioritize in batch | 15-25% (trigger-based) |
| **WARM** | 60-79 | Include in batch, standard send | 8-15% |
| **COOL** | 40-59 | Include if batch needs volume | 5-8% |
| **SKIP** | 0-39 | Do not email, log rejection reason | N/A |

### 6.5 Calibration Plan

**Week 1-2:** Use initial weights (above). Track actual reply rates by score tier.

**Week 3-4:** Compare predicted tier performance vs actual. Adjust weights:
- If HOT tier reply rate < 15%, increase trigger_events weight
- If COOL tier reply rate > 10%, lower threshold to 35
- If tech_stack_gap shows no correlation, reduce weight, redistribute

**Monthly:** Full recalibration using actual conversion data. Agent 11 generates calibration report.

**Calibration query:**
```sql
SELECT
    CASE
        WHEN ls.total_score >= 80 THEN 'HOT'
        WHEN ls.total_score >= 60 THEN 'WARM'
        WHEN ls.total_score >= 40 THEN 'COOL'
        ELSE 'SKIP'
    END as tier,
    COUNT(*) as total_leads,
    COUNT(CASE WHEN es.reply_detected_at IS NOT NULL THEN 1 END) as replies,
    COUNT(CASE WHEN es.status = 'booked' THEN 1 END) as bookings,
    COUNT(CASE WHEN es.status = 'converted' THEN 1 END) as conversions,
    ROUND(AVG(ls.review_score), 1) as avg_review,
    ROUND(AVG(ls.trigger_events), 1) as avg_trigger,
    ROUND(AVG(ls.tech_stack_gap), 1) as avg_tech_gap
FROM lead_scores ls
LEFT JOIN email_sends es ON ls.lead_id = es.lead_id
WHERE ls.scored_at > NOW() - INTERVAL '30 days'
GROUP BY tier
ORDER BY MIN(ls.total_score) DESC;
```

---

## 7. New Supabase Tables

### 7.1 Table: email_campaigns

```sql
-- ============================================================
-- email_campaigns: Track outreach campaigns and A/B tests
-- ============================================================

CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

    -- Campaign identity
    campaign_name TEXT NOT NULL,
    campaign_type TEXT NOT NULL CHECK (campaign_type IN ('leaddrop', 'client_serve', 'follow_up', 'manual')),
    industry TEXT,
    city TEXT,

    -- A/B test configuration (NULL if not a test)
    test_type TEXT CHECK (test_type IN ('subject_line', 'email_body', 'cta', 'send_time', 'follow_up_cadence', NULL)),
    variant_a_spec JSONB,          -- Control specification
    variant_b_spec JSONB,          -- Variant specification
    winner_variant TEXT CHECK (winner_variant IN ('A', 'B', NULL)),
    significance_p_value NUMERIC(6,4),

    -- Campaign metrics (denormalized for fast reads)
    total_sent INTEGER DEFAULT 0,
    total_opened INTEGER DEFAULT 0,
    total_replied INTEGER DEFAULT 0,
    total_booked INTEGER DEFAULT 0,
    total_converted INTEGER DEFAULT 0,
    total_bounced INTEGER DEFAULT 0,
    total_unsubscribed INTEGER DEFAULT 0,

    -- Status
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'paused', 'concluded', 'archived')),

    -- Timestamps
    started_at TIMESTAMPTZ DEFAULT NOW(),
    concluded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_campaigns_client_id ON email_campaigns(client_id);
CREATE INDEX idx_campaigns_status ON email_campaigns(status);
CREATE INDEX idx_campaigns_type ON email_campaigns(campaign_type);
CREATE INDEX idx_campaigns_test_type ON email_campaigns(test_type) WHERE test_type IS NOT NULL;
CREATE INDEX idx_campaigns_started_at ON email_campaigns(started_at DESC);

-- RLS
ALTER TABLE email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own campaigns" ON email_campaigns
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients
            WHERE slug = (auth.jwt()->'user_metadata'->>'client_id')
        )
    );

CREATE POLICY "Service role full access campaigns" ON email_campaigns
    FOR ALL USING (auth.role() = 'service_role');

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_campaigns_updated_at
    BEFORE UPDATE ON email_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 7.2 Table: email_variants

```sql
-- ============================================================
-- email_variants: A/B test variant allocations and content
-- ============================================================

CREATE TABLE email_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,

    -- Variant assignment
    variant_label TEXT NOT NULL CHECK (variant_label IN ('A', 'B')),

    -- Variant content
    subject_line TEXT,
    body_preview TEXT,           -- First 500 chars of body for quick comparison
    body_hash TEXT,              -- MD5 hash of full body for equivalence checking

    -- Personalization metadata
    personalization_tokens JSONB DEFAULT '{}',
    psychology_principles TEXT[],

    -- Tracking
    opened BOOLEAN DEFAULT FALSE,
    opened_at TIMESTAMPTZ,
    replied BOOLEAN DEFAULT FALSE,
    replied_at TIMESTAMPTZ,
    reply_classification TEXT CHECK (reply_classification IN (
        'positive', 'negative', 'question', 'out_of_office', 'bounce', 'unsubscribe', NULL
    )),
    booked BOOLEAN DEFAULT FALSE,
    converted BOOLEAN DEFAULT FALSE,

    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Unique constraint: one variant per lead per campaign
    UNIQUE(campaign_id, lead_id)
);

-- Indexes
CREATE INDEX idx_variants_campaign_id ON email_variants(campaign_id);
CREATE INDEX idx_variants_lead_id ON email_variants(lead_id);
CREATE INDEX idx_variants_label ON email_variants(variant_label);
CREATE INDEX idx_variants_campaign_label ON email_variants(campaign_id, variant_label);

-- RLS
ALTER TABLE email_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own variants" ON email_variants
    FOR SELECT USING (
        campaign_id IN (
            SELECT ec.id FROM email_campaigns ec
            JOIN clients c ON ec.client_id = c.id
            WHERE c.slug = (auth.jwt()->'user_metadata'->>'client_id')
        )
    );

CREATE POLICY "Service role full access variants" ON email_variants
    FOR ALL USING (auth.role() = 'service_role');
```

### 7.3 Table: email_sends

```sql
-- ============================================================
-- email_sends: Individual email delivery tracking
-- ============================================================

CREATE TABLE email_sends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID NOT NULL REFERENCES email_campaigns(id) ON DELETE CASCADE,
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES email_variants(id) ON DELETE SET NULL,

    -- Email content
    subject_line TEXT NOT NULL,
    body_text TEXT,              -- Plaintext version
    body_html TEXT,              -- HTML version
    word_count INTEGER,
    sentence_count INTEGER,

    -- Delivery metadata
    gmail_message_id TEXT,       -- Gmail API message ID for tracking
    gmail_thread_id TEXT,        -- Gmail thread ID for reply matching
    recipient_email TEXT NOT NULL,
    sender_email TEXT DEFAULT 'henry@agenticengineering.com',

    -- Status tracking
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN (
        'queued', 'drafted', 'sent',
        'follow_up_1', 'follow_up_2', 'follow_up_3',
        'replied', 'booked', 'converted', 'declined',
        'bounced', 'unsubscribed', 'archived', 'exhausted'
    )),

    -- Reply tracking
    reply_detected_at TIMESTAMPTZ,
    reply_classification TEXT CHECK (reply_classification IN (
        'positive', 'negative', 'question', 'out_of_office', 'bounce', 'unsubscribe', NULL
    )),
    reply_content_summary TEXT,   -- Brief summary of reply content

    -- Follow-up tracking
    followup_1_sent_at TIMESTAMPTZ,
    followup_2_sent_at TIMESTAMPTZ,
    followup_3_sent_at TIMESTAMPTZ,

    -- Scheduled sending
    scheduled_send_at TIMESTAMPTZ,  -- For send-time A/B tests

    -- Timestamps
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sends_campaign_id ON email_sends(campaign_id);
CREATE INDEX idx_sends_lead_id ON email_sends(lead_id);
CREATE INDEX idx_sends_variant_id ON email_sends(variant_id);
CREATE INDEX idx_sends_status ON email_sends(status);
CREATE INDEX idx_sends_sent_at ON email_sends(sent_at DESC);
CREATE INDEX idx_sends_recipient ON email_sends(recipient_email);
CREATE INDEX idx_sends_gmail_thread ON email_sends(gmail_thread_id);
CREATE INDEX idx_sends_followup_due ON email_sends(status, sent_at)
    WHERE status = 'sent' AND followup_1_sent_at IS NULL;
CREATE INDEX idx_sends_scheduled ON email_sends(scheduled_send_at)
    WHERE scheduled_send_at IS NOT NULL AND status = 'queued';

-- RLS
ALTER TABLE email_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own sends" ON email_sends
    FOR SELECT USING (
        campaign_id IN (
            SELECT ec.id FROM email_campaigns ec
            JOIN clients c ON ec.client_id = c.id
            WHERE c.slug = (auth.jwt()->'user_metadata'->>'client_id')
        )
    );

CREATE POLICY "Service role full access sends" ON email_sends
    FOR ALL USING (auth.role() = 'service_role');

-- Realtime for live dashboard updates
ALTER publication supabase_realtime ADD TABLE email_sends;

-- Trigger for updated_at
CREATE TRIGGER trigger_sends_updated_at
    BEFORE UPDATE ON email_sends
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 7.4 Table: lead_scores

```sql
-- ============================================================
-- lead_scores: Detailed scoring breakdown per lead
-- ============================================================

CREATE TABLE lead_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

    -- Total score
    total_score INTEGER NOT NULL CHECK (total_score BETWEEN 0 AND 100),
    tier TEXT NOT NULL CHECK (tier IN ('HOT', 'WARM', 'COOL', 'SKIP')),

    -- Individual feature scores (0-100 each)
    review_score INTEGER CHECK (review_score BETWEEN 0 AND 100),
    review_volume INTEGER CHECK (review_volume BETWEEN 0 AND 100),
    website_quality INTEGER CHECK (website_quality BETWEEN 0 AND 100),
    tech_stack_gap INTEGER CHECK (tech_stack_gap BETWEEN 0 AND 100),
    social_presence INTEGER CHECK (social_presence BETWEEN 0 AND 100),
    trigger_events INTEGER CHECK (trigger_events BETWEEN 0 AND 100),
    decision_maker INTEGER CHECK (decision_maker BETWEEN 0 AND 100),
    icp_fit INTEGER CHECK (icp_fit BETWEEN 0 AND 100),

    -- Weights used (for calibration tracking)
    weights_version TEXT DEFAULT 'v1.0',
    weights_json JSONB DEFAULT '{
        "review_score": 0.12,
        "review_volume": 0.08,
        "website_quality": 0.12,
        "tech_stack_gap": 0.15,
        "social_presence": 0.08,
        "trigger_events": 0.20,
        "decision_maker": 0.10,
        "icp_fit": 0.15
    }'::jsonb,

    -- Enrichment metadata
    triggers_detected TEXT[],     -- List of trigger types found
    tech_gaps_detected TEXT[],    -- List of tech gaps found
    rejection_reason TEXT,        -- If scored below threshold

    -- Timestamps
    scored_at TIMESTAMPTZ DEFAULT NOW(),

    -- One score per lead (latest wins)
    UNIQUE(lead_id)
);

-- Indexes
CREATE INDEX idx_scores_lead_id ON lead_scores(lead_id);
CREATE INDEX idx_scores_client_id ON lead_scores(client_id);
CREATE INDEX idx_scores_total ON lead_scores(total_score DESC);
CREATE INDEX idx_scores_tier ON lead_scores(tier);
CREATE INDEX idx_scores_scored_at ON lead_scores(scored_at DESC);
CREATE INDEX idx_scores_version ON lead_scores(weights_version);

-- RLS
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own scores" ON lead_scores
    FOR SELECT USING (
        client_id IN (
            SELECT id FROM clients
            WHERE slug = (auth.jwt()->'user_metadata'->>'client_id')
        )
    );

CREATE POLICY "Service role full access scores" ON lead_scores
    FOR ALL USING (auth.role() = 'service_role');

-- Realtime for dashboard
ALTER publication supabase_realtime ADD TABLE lead_scores;
```

### 7.5 Table: verification_failures

```sql
-- ============================================================
-- verification_failures: Log of all verification gate failures
-- ============================================================

CREATE TABLE verification_failures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE SET NULL,
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,

    -- Gate identification
    gate_number INTEGER NOT NULL CHECK (gate_number BETWEEN 1 AND 4),
    gate_name TEXT NOT NULL CHECK (gate_name IN (
        'lead_quality', 'content_safety', 'ab_equivalence', 'rate_limit'
    )),

    -- Failure details
    failure_reason TEXT NOT NULL,
    failure_details JSONB DEFAULT '{}',   -- Structured details of what failed
    check_number INTEGER,                  -- Which specific check within the gate

    -- Remediation
    remediation_action TEXT,               -- What was done to fix it
    remediation_status TEXT DEFAULT 'pending' CHECK (remediation_status IN (
        'pending', 'auto_fixed', 'manual_review', 'skipped', 'resolved'
    )),

    -- Context
    email_subject TEXT,
    email_body_preview TEXT,               -- First 200 chars
    lead_score INTEGER,

    -- Timestamps
    failed_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_failures_campaign_id ON verification_failures(campaign_id);
CREATE INDEX idx_failures_lead_id ON verification_failures(lead_id);
CREATE INDEX idx_failures_gate ON verification_failures(gate_number);
CREATE INDEX idx_failures_gate_name ON verification_failures(gate_name);
CREATE INDEX idx_failures_status ON verification_failures(remediation_status);
CREATE INDEX idx_failures_failed_at ON verification_failures(failed_at DESC);

-- RLS
ALTER TABLE verification_failures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own failures" ON verification_failures
    FOR SELECT USING (
        campaign_id IN (
            SELECT ec.id FROM email_campaigns ec
            JOIN clients c ON ec.client_id = c.id
            WHERE c.slug = (auth.jwt()->'user_metadata'->>'client_id')
        )
    );

CREATE POLICY "Service role full access failures" ON verification_failures
    FOR ALL USING (auth.role() = 'service_role');
```

### 7.6 Migration File Reference

These 5 tables should be added via a new migration file:
`supabase/migrations/002_deep_outreach_schema.sql`

The `update_updated_at_column()` function is shared and should be created once (with `CREATE OR REPLACE` for idempotency).

### 7.7 Relationship to Existing Tables

```
EXISTING TABLES              NEW TABLES
===============              ==========

clients (id, slug, ...)
    |
    +-- leads (client_id)
    |       |
    |       +-- outreach_packages (lead_id)  [existing — keep for /serve]
    |       |
    |       +-- lead_scores (lead_id)        [NEW]
    |       |
    |       +-- email_variants (lead_id)     [NEW]
    |       |
    |       +-- email_sends (lead_id)        [NEW]
    |       |
    |       +-- verification_failures (lead_id) [NEW]
    |
    +-- email_campaigns (client_id)          [NEW]
    |       |
    |       +-- email_variants (campaign_id) [NEW]
    |       |
    |       +-- email_sends (campaign_id)    [NEW]
    |       |
    |       +-- verification_failures (campaign_id) [NEW]
    |
    +-- briefings (client_id)               [existing — keep]
    |
    +-- trigger_events (client_id)          [existing — keep]


STANDALONE TABLE
================
leaddrop_prospects  [existing — will be migrated to email_sends over time]
```

---

## 8. KPI Dashboard Specification

### 8.1 Campaign Metrics

| Metric | Formula | Target | Source Table |
|--------|---------|--------|-------------|
| **Total Sent** | `COUNT(*) FROM email_sends WHERE status != 'queued'` | 50/day | email_sends |
| **Open Rate** | Not directly trackable without pixel (future) | 40%+ | N/A |
| **Reply Rate** | `(replies / total_sent) * 100` | 8-15% | email_sends |
| **Positive Reply Rate** | `(positive_replies / total_sent) * 100` | 5-10% | email_sends |
| **Booking Rate** | `(bookings / total_sent) * 100` | 2-5% | email_sends |
| **Conversion Rate** | `(conversions / total_sent) * 100` | 1-3% | email_sends |
| **Bounce Rate** | `(bounces / total_sent) * 100` | < 2% | email_sends |
| **Unsubscribe Rate** | `(unsubscribes / total_sent) * 100` | < 0.5% | email_sends |
| **Follow-Up Effectiveness** | `(follow_up_replies / follow_up_sent) * 100` | 5-10% | email_sends |
| **Pipeline Value** | `SUM(pipeline_value) FROM leads WHERE status IN ('replied', 'booked')` | $10K+ MRR | leads |
| **Cost Per Acquisition** | `total_tool_cost / conversions` | < $50 | Manual calc |
| **Emails Per Conversion** | `total_sent / conversions` | < 100 | email_sends |

### 8.2 A/B Test Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **Active Tests** | `COUNT(*) FROM email_campaigns WHERE test_type IS NOT NULL AND status = 'active'` | 2-3 concurrent |
| **Sample Size Per Variant** | `COUNT(*) FROM email_variants GROUP BY campaign_id, variant_label` | 100+ per variant |
| **Statistical Significance** | `chi2 > 3.841 (p < 0.05)` | Yes, for concluded tests |
| **Lift (Winner vs Loser)** | `(winner_rate - loser_rate) / loser_rate * 100` | 20%+ |
| **Time to Significance** | Days from test start to p < 0.05 | < 14 days |
| **Tests Concluded/Month** | Count of `status = 'concluded'` per 30 days | 2+ |

### 8.3 Lead Scoring Metrics

| Metric | Formula | Target |
|--------|---------|--------|
| **Avg Score** | `AVG(total_score) FROM lead_scores` | 55-70 |
| **HOT Tier %** | `(hot_count / total) * 100` | 15-25% |
| **WARM Tier %** | `(warm_count / total) * 100` | 30-40% |
| **COOL Tier %** | `(cool_count / total) * 100` | 20-30% |
| **SKIP Rate** | `(skip_count / total_scored) * 100` | 10-25% |
| **Score-to-Reply Correlation** | Pearson correlation between score and reply | > 0.3 |
| **HOT Tier Reply Rate** | `(hot_replies / hot_sent) * 100` | 15-25% |
| **WARM Tier Reply Rate** | `(warm_replies / warm_sent) * 100` | 8-15% |
| **COOL Tier Reply Rate** | `(cool_replies / cool_sent) * 100` | 5-8% |
| **Score Calibration Error** | Deviation from expected reply rate per tier | < 5% |

### 8.4 Dashboard Queries

**Daily Summary Query:**
```sql
SELECT
    DATE(es.sent_at) as send_date,
    COUNT(*) as total_sent,
    COUNT(CASE WHEN es.reply_detected_at IS NOT NULL THEN 1 END) as replies,
    COUNT(CASE WHEN es.reply_classification = 'positive' THEN 1 END) as positive,
    COUNT(CASE WHEN es.status = 'booked' THEN 1 END) as booked,
    COUNT(CASE WHEN es.status = 'converted' THEN 1 END) as converted,
    COUNT(CASE WHEN es.status = 'bounced' THEN 1 END) as bounced,
    ROUND(COUNT(CASE WHEN es.reply_detected_at IS NOT NULL THEN 1 END)::numeric
        / NULLIF(COUNT(*), 0) * 100, 1) as reply_rate_pct
FROM email_sends es
WHERE es.sent_at > NOW() - INTERVAL '30 days'
GROUP BY DATE(es.sent_at)
ORDER BY send_date DESC;
```

**Follow-Up Pipeline Query:**
```sql
SELECT
    CASE
        WHEN followup_1_sent_at IS NULL AND sent_at <= NOW() - INTERVAL '3 days' THEN 'Day 3 DUE'
        WHEN followup_2_sent_at IS NULL AND followup_1_sent_at IS NOT NULL
            AND sent_at <= NOW() - INTERVAL '10 days' THEN 'Day 10 DUE'
        WHEN followup_3_sent_at IS NULL AND followup_2_sent_at IS NOT NULL
            AND sent_at <= NOW() - INTERVAL '17 days' THEN 'Day 17 DUE'
        WHEN followup_1_sent_at IS NULL AND sent_at > NOW() - INTERVAL '3 days' THEN 'Waiting (Day 3)'
        WHEN followup_2_sent_at IS NULL AND sent_at > NOW() - INTERVAL '10 days' THEN 'Waiting (Day 10)'
        WHEN followup_3_sent_at IS NULL AND sent_at > NOW() - INTERVAL '17 days' THEN 'Waiting (Day 17)'
        ELSE 'Complete'
    END as pipeline_stage,
    COUNT(*) as count
FROM email_sends
WHERE status = 'sent'
    AND reply_detected_at IS NULL
GROUP BY pipeline_stage
ORDER BY pipeline_stage;
```

**A/B Test Status Query:**
```sql
SELECT
    ec.campaign_name,
    ec.test_type,
    ev.variant_label,
    COUNT(*) as sends,
    COUNT(CASE WHEN es.reply_detected_at IS NOT NULL THEN 1 END) as replies,
    ROUND(COUNT(CASE WHEN es.reply_detected_at IS NOT NULL THEN 1 END)::numeric
        / NULLIF(COUNT(*), 0) * 100, 1) as reply_rate_pct,
    COUNT(CASE WHEN es.status = 'booked' THEN 1 END) as bookings
FROM email_campaigns ec
JOIN email_variants ev ON ec.id = ev.campaign_id
JOIN email_sends es ON ev.lead_id = es.lead_id AND ev.campaign_id = es.campaign_id
WHERE ec.status = 'active' AND ec.test_type IS NOT NULL
GROUP BY ec.campaign_name, ec.test_type, ev.variant_label
ORDER BY ec.campaign_name, ev.variant_label;
```

---

## 9. Integration with Existing System

### 9.1 Command Mapping

| Current Command | Replacement | Migration Path |
|----------------|-------------|----------------|
| `/drop` | `/deep-outreach --mode=prospect` | Phase 1: `/drop` calls deep-outreach internally. Phase 2: `/drop` becomes alias. Phase 3: `/drop` deprecated. |
| `/serve {slug}` | `/deep-outreach --mode=client --slug={slug}` | Phase 1: `/serve` continues as-is. Phase 2: `/serve` uses deep-outreach pipeline. Phase 3: `/serve` becomes alias. |
| `/follow-up` | Agent 10 (automated within pipeline) | Phase 1: `/follow-up` continues. Phase 2: Agent 10 handles new sends, `/follow-up` handles legacy. Phase 3: `/follow-up` retired. |
| `/revenue-engine` | `/deep-outreach --mode=prospect --framework=pas-sp` | Phase 1: Continue parallel. Phase 2: Merge PAS-SP framework into Agent 5. Phase 3: `/revenue-engine` deprecated. |

### 9.2 Data Migration

#### leaddrop_prospects -> email_sends

The existing `leaddrop_prospects` table has a different schema than `email_sends`. Migration path:

```sql
-- Phase 2 migration: Copy leaddrop_prospects data into email_sends
-- First, create a "legacy" campaign for each unique city+industry combo

INSERT INTO email_campaigns (client_id, campaign_name, campaign_type, industry, city, status)
SELECT
    (SELECT id FROM clients WHERE slug = 'agentic-engineering'),
    'LeadDrop Legacy: ' || industry || ' — ' || city,
    'leaddrop',
    industry,
    city,
    'archived'
FROM leaddrop_prospects
GROUP BY industry, city;

-- Then migrate individual records
INSERT INTO email_sends (
    campaign_id, lead_id, subject_line, recipient_email,
    status, sent_at, followup_1_sent_at, followup_2_sent_at, followup_3_sent_at
)
SELECT
    ec.id,
    NULL,  -- No lead_id in legacy data
    lp.email_subject,
    lp.email_to,
    CASE
        WHEN lp.status = 'archived' THEN 'exhausted'
        WHEN lp.status = 'declined' THEN 'declined'
        WHEN lp.status = 'booked' THEN 'booked'
        WHEN lp.status = 'converted' THEN 'converted'
        WHEN lp.status = 'replied' THEN 'replied'
        ELSE 'sent'
    END,
    lp.email_sent_at,
    lp.followup_1_sent_at,
    lp.followup_2_sent_at,
    lp.followup_3_sent_at
FROM leaddrop_prospects lp
JOIN email_campaigns ec ON ec.industry = lp.industry AND ec.city = lp.city
    AND ec.campaign_type = 'leaddrop';
```

#### outreach_packages Integration

The existing `outreach_packages` table remains for `/serve` clients. In Phase 2, when `/serve` migrates to deep-outreach, outreach content moves to `email_sends.body_text` and follow-ups to the `followup_*_sent_at` tracking columns.

### 9.3 Backward Compatibility

During the migration period (Phases 1-2):
- All existing commands continue to work unchanged
- New `/deep-outreach` command runs in parallel
- Data is written to both old and new tables where applicable
- Dashboard shows combined data from both systems

### 9.4 Skill File Structure

```
.claude/
  commands/
    deep-outreach.md         # NEW — main entry point
    drop.md                  # EXISTING — updated to call deep-outreach
    serve.md                 # EXISTING — updated in Phase 2
    follow-up.md             # EXISTING — retired in Phase 3
    revenue-engine.md        # EXISTING — retired in Phase 3
  skills/
    deep-outreach/
      SKILL.md               # NEW — auto-invocable skill definition
      agents/
        client-context.md    # Agent 1 spec
        lead-discovery.md    # Agent 2 spec
        deep-research.md     # Agent 3 spec
        lead-scoring.md      # Agent 4 spec
        email-crafting.md    # Agent 5 spec
        ab-variant.md        # Agent 6 spec
        verification.md      # Agent 7 spec
        sending.md           # Agent 8 spec
        reply-detection.md   # Agent 9 spec
        follow-up.md         # Agent 10 spec
        analytics.md         # Agent 11 spec
    follow-up/
      SKILL.md               # EXISTING — updated to delegate to Agent 10
```

### 9.5 MCP Dependencies

| MCP Server | Status | Used By Agents | Priority |
|------------|--------|---------------|----------|
| Apify | ACTIVE | Agent 2, 3 | Required |
| Firecrawl | ACTIVE | Agent 2, 3 | Required |
| Supabase | ACTIVE | All agents | Required |
| Google Workspace | ACTIVE | Agent 8, 9 | Required |
| Apollo | ACTIVE | Agent 2, 3 | Recommended |
| Bright Data | ACTIVE | Agent 2, 3 | Recommended (fallback) |
| Hunter.io | TO INSTALL | Agent 7 | Priority 1 — install Week 1 |
| Context7 | ACTIVE | Agent 5 (template lookup) | Optional |

---

## 10. Implementation Roadmap

### 10.1 Phase 1: Foundation (Week 1)

**Goal:** Core infrastructure — new tables, basic pipeline, Agent 1-4

| Day | Task | Deliverable | Milestone |
|-----|------|-------------|-----------|
| Mon | Create `002_deep_outreach_schema.sql` migration | 5 new tables in Supabase | DB ready |
| Mon | Install Hunter.io MCP | Email verification available | Tooling ready |
| Tue | Implement Agent 1 (Client Context) | `ClientContext` loader | Context loading works |
| Tue | Implement Agent 2 (Lead Discovery) | Waterfall discovery with dedup | Leads flow |
| Wed | Implement Agent 3 (Deep Research) | Parallel enrichment (5 workers) | Enrichment works |
| Wed | Implement Agent 4 (Lead Scoring) | 8-feature scoring algorithm | Scoring works |
| Thu | Write `/deep-outreach` command (Phase 1 subset) | Command entry point | Can run Stages 1-4 |
| Thu | Integration test: Stages 1-4 end-to-end | 50 scored leads from Atlanta Dental | E2E test passes |
| Fri | Scoring calibration baseline | Initial score distribution analysis | Baseline recorded |

**Phase 1 Exit Criteria:**
- 5 new Supabase tables created with RLS policies
- Hunter.io MCP installed and functional
- Stages 1-4 produce 50 scored leads from a single `/deep-outreach` run
- Lead scores stored in `lead_scores` table with full feature breakdown

### 10.2 Phase 2: Content & Delivery (Week 2)

**Goal:** Email generation, verification, sending — Agent 5-8

| Day | Task | Deliverable | Milestone |
|-----|------|-------------|-----------|
| Mon | Implement Agent 5 (Email Crafting) | PAS + LeadDrop email generation | Emails generated |
| Mon | Implement Agent 6 (A/B Variant Generator) | Subject line A/B test (T001) | Variants created |
| Tue | Implement Agent 7 (Verification) | 4 gates with all checks | Verification works |
| Tue | Implement Gate 2 content safety checks | 10-point safety system | Safety validated |
| Wed | Implement Agent 8 (Sending) | Gmail send with variable timing | Emails send |
| Wed | End-to-end test: Stages 1-8 | Full pipeline through sending | Pipeline works |
| Thu | Migrate `/drop` to use deep-outreach pipeline | `/drop` becomes wrapper | Migration started |
| Thu | First live `/deep-outreach --mode=prospect` run | 50 real emails sent | LIVE |
| Fri | Monitor deliverability | Bounce rate, complaint tracking | Deliverability baseline |

**Phase 2 Exit Criteria:**
- Full pipeline (Stages 1-8) runs end-to-end
- A/B test T001 (subject line) is active and collecting data
- `/drop` uses deep-outreach pipeline internally
- First live batch of 50 emails sent with <2% bounce rate

### 10.3 Phase 3: Intelligence (Week 3)

**Goal:** Reply detection, follow-up automation, analytics — Agent 9-11

| Day | Task | Deliverable | Milestone |
|-----|------|-------------|-----------|
| Mon | Implement Agent 9 (Reply Detection) | Gmail polling + classification | Replies detected |
| Mon | Implement reply-to-status pipeline | Auto-update leads/email_sends | Statuses sync |
| Tue | Implement Agent 10 (Follow-Up) | 3-7-7 cadence engine | Follow-ups automated |
| Tue | Migrate `/follow-up` to use Agent 10 | Legacy follow-up deprecated | Migration done |
| Wed | Implement Agent 11 (Analytics) | KPI computation + chi-square | Analytics works |
| Wed | First A/B test analysis | T001 interim results | Data flowing |
| Thu | Migrate `/serve` to deep-outreach | Client mode functional | `/serve` migrated |
| Thu | First `/deep-outreach --mode=client --slug=syba` | SYBA daily using new pipeline | Client pipeline live |
| Fri | Dashboard integration | KPI metrics visible in client dashboard | Dashboard updated |

**Phase 3 Exit Criteria:**
- Reply detection catches >90% of replies within 24h
- Follow-up emails sent automatically on correct cadence
- Analytics agent produces daily KPI report
- `/serve syba` uses deep-outreach pipeline
- A/B test T001 has interim results

### 10.4 Phase 4: Optimization (Week 4)

**Goal:** Calibration, advanced tests, performance tuning, full migration

| Day | Task | Deliverable | Milestone |
|-----|------|-------------|-----------|
| Mon | Score calibration round 1 | Adjusted weights based on Week 1-3 data | Weights v1.1 |
| Mon | Launch A/B tests T002-T004 | 3 new tests active | Testing expanded |
| Tue | Implement feedback loop (Stage 12) | Auto-calibration based on outcomes | Learning loop |
| Tue | Performance optimization | Pipeline execution < 15 minutes | Performance target |
| Wed | Deprecate `/revenue-engine` | PAS-SP framework merged into Agent 5 | Full migration |
| Wed | Data migration: leaddrop_prospects -> email_sends | Legacy data migrated | Data unified |
| Thu | Full system stress test | 100 leads through complete pipeline | Stress test passes |
| Thu | Documentation finalization | All agent specs updated with lessons | Docs current |
| Fri | Phase 4 retrospective | Lessons learned, v2.1 planning | System stable |

**Phase 4 Exit Criteria:**
- All 4 legacy commands migrated or deprecated
- 3+ A/B tests active simultaneously
- Score calibration improved from v1.0 baseline
- Pipeline consistently executes in <15 minutes
- System stable for daily production use

### 10.5 Success Metrics (End of Week 4)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Pipeline execution time | < 15 minutes for 50 leads | Timer on `/deep-outreach` runs |
| Reply rate | > 8% (up from estimated 3-5% baseline) | email_sends analytics |
| Bounce rate | < 2% | email_sends.status = 'bounced' |
| A/B tests concluded | 1+ with significance | email_campaigns.status = 'concluded' |
| Score-to-reply correlation | > 0.3 Pearson | Analytics agent report |
| Daily automation | < 5 min manual effort per day | Operator time tracking |
| Commands consolidated | 4 -> 1 unified pipeline | Command audit |

---

## Appendix A: Research Source Cross-References

| Architecture Element | Research Section(s) | Key Finding |
|---------------------|--------------------|-----------:|
| 11 agents | 5.1, 5.2, 5.3 | 72% of enterprise AI uses multi-agent; Claude Code native is optimal |
| Waterfall enrichment | 6.4, 2.1, 2.2 | Clay.com pattern: Provider A -> B -> C for maximum coverage |
| 50-125 word emails | 3.1 | 6.9% reply rate + 42.67% open rate (Belkins 2025) |
| Question subjects | 3.3 | 46% open rate (top performer) |
| 3-7-7 cadence | 3.5 | 93% of replies by Day 10; max 3 follow-ups |
| Tuesday 6-9 AM | 3.4 | Highest reply rate in 85K email study |
| Batch <= 50 | 3.2 | 18% reply rate (1-200 contacts) vs 8% (1,000+) |
| Trigger-based timing | 3.6 | 20-35% response vs 5-10% cold |
| Reciprocity first | 4.1 | Cialdini #1: personalized + unexpected = strongest |
| Loss aversion | 4.5 | 2x stronger than gain framing (Kahneman) |
| PAS framework | 4.2 | Problem-Agitate-Solution email structure |
| Pattern interrupt | 4.4 | No "hope this finds you well" — lead with value |
| Hunter.io verification | 2.2 | 99% accuracy on non-catch-all |
| Separate outreach domain | 7.3 | SPF/DKIM/DMARC on dedicated domain |
| Variable send volume | 7.3 | 22-28/day randomly, not exactly 25 |
| Lead scoring ML | 3.7 | Frontiers in AI 2025: ML scoring improves prioritization |
| ICP framework | 6.3 | Revenue $500K-$5M, team 2-20, mid-size city |

---

## Appendix B: Glossary

| Term | Definition |
|------|-----------|
| **LeadDrop** | Free-value outreach model: 5 researched leads per business, no strings attached |
| **PAS-SP** | Pain-Agitate-Solution-Social Proof email framework |
| **3-7-7 cadence** | Follow-up schedule: Day 0 (initial), Day 3, Day 10, Day 17 |
| **Gate** | Verification checkpoint that must pass before email proceeds to next stage |
| **Waterfall enrichment** | Try data sources in priority order until data is found |
| **Chi-square test** | Statistical test for A/B significance (p < 0.05 = significant) |
| **ICP** | Ideal Customer Profile — target business characteristics |
| **HOT/WARM/COOL/SKIP** | Lead qualification tiers based on 0-100 score |
| **MCP** | Model Context Protocol — tool integration standard for Claude |
| **RLS** | Row Level Security — Supabase data access control |

---

*Document generated by Claude Code for Agentic Engineering Consulting.*
*Next steps: Prompt 004 (HTML visualization) and Prompt 005 (skill implementation).*
