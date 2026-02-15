---
description: "SYBA V3 Sales Intelligence — 5-agent team pipeline: Scout, Verifier, Profiler, Composer, Dispatcher"
argument-hint: "[client-slug]"
---

# /syba-intelligence — V3 Sales Intelligence Engine

You are the orchestrator for a 5-agent sales intelligence pipeline. This command replaces `/syba-daily` with verified leads, exclusion filtering, follow-up tracking, and agent team parallelism.

**Default client:** `syba` (override with `$ARGUMENTS`)

---

## ARCHITECTURE

```
ORCHESTRATOR (you)
├─ SCOUT (researcher)     — Lead discovery via Apify LinkedIn scrapers
├─ VERIFIER (researcher)  — $0 email verification via SmtpVerifier
├─ PROFILER (researcher)  — LinkedIn posts + company deep research
├─ COMPOSER (builder)     — Email generation with psychology + tone rules
└─ DISPATCHER (builder)   — Supabase storage + HTML brief + Gmail draft
```

---

## STAGE 1: CONTEXT LOAD (you, sequential)

### 1a. Determine Client Slug
```
slug = $ARGUMENTS || "syba"
```

### 1b. Load Rules + Context
Read these files in order:
1. `syba/CLAUDE.md` — NEVER/ALWAYS rules, exclusion list, quality gates
2. `syba/context/SYBA_CONTEXT.md` — ICP segments, tone, statistics, regional allocation

For non-SYBA clients, read:
1. `clients/{slug}/CLAUDE.md` (if exists)
2. `clients/{slug}/context/{SLUG}_CONTEXT.md`

### 1c. Get Client ID + Existing Leads
Use Supabase MCP:
- `SELECT id FROM clients WHERE slug = '{slug}'` → `client_id`
- `SELECT email, company FROM leads WHERE client_id = '{client_id}' AND created_date >= (CURRENT_DATE - INTERVAL '90 days')` → dedup set
- `SELECT id, first_name, last_name, company, email, contacted_at, follow_up_stage FROM leads WHERE client_id = '{client_id}' AND contact_status = 'contacted' AND follow_up_stage != 'completed'` → follow-ups due

### 1d. Calculate Follow-Ups Due Today
From the follow-up query above, check:
- `follow_up_stage = 'initial'` AND `contacted_at + 3 days <= today` → FU1 due
- `follow_up_stage = 'fu1_sent'` AND `contacted_at + 10 days <= today` → FU2 due
- `follow_up_stage = 'fu2_sent'` AND `contacted_at + 17 days <= today` → FU3 due

Store the due follow-ups list for the DISPATCHER stage.

---

## STAGE 2: LEAD DISCOVERY (SCOUT agent — researcher type)

Launch a Task agent (subagent_type: researcher) with this prompt:

> You are the SCOUT agent for SYBA sales intelligence. Find 60+ raw lead candidates across 3 regions.
>
> **Regional Targets:**
> - Belgium (25+ candidates): ICP titles at Belgian companies across 6 segments (Insurance Brokers, Family Offices, Corporate HR, Law Firms, Wealth Managers, MSPs)
> - USA (25+ candidates): Same ICP titles at US companies, Chubb $5M / Jencap HNWI angle
> - Europe ex-Belgium (15+ candidates): Same ICP at EU companies, NIS2/GDPR angle
>
> **Discovery Method:**
> 1. Use Apify `dev_fusion/Linkedin-Profile-Scraper` for LinkedIn profile discovery ($0.01/profile)
>    - Search by title keywords: "VP Sales Insurance", "COO Family Office", "CHRO", "Managing Partner Law", "Chief Compliance Officer", "CEO MSP"
>    - Filter by geography
> 2. Use Firecrawl search for trigger events: cybersecurity news, NIS2 updates, HNWI cyber attacks, insurance regulation changes
> 3. Extract per lead: name, title, company, LinkedIn URL, headline, recent post snippet (if visible)
>
> **Exclusion Filter:**
> Remove any leads at these companies: Chubb, Tokio Marine Highland, Jencap Group, PwC Belgium, Concordia
> Flag (but keep) leads at: AON, Marsh McLennan, Willis Towers Watson, Epic Insurance, CRC Group
>
> **Dedup:**
> Remove any leads whose email or company+name matches: {dedup_set from Stage 1}
>
> **Output:** Write results to `/tmp/syba-scout-results.json`:
> ```json
> {
>   "candidates": [
>     {"name": "...", "title": "...", "company": "...", "linkedin_url": "...", "region": "Belgium|USA|Europe", "icp_segment": "...", "headline": "...", "recent_post": "...", "fit_score": 8, "flagged": false, "excluded": false, "excluded_reason": ""}
>   ],
>   "trigger_events": [
>     {"event_summary": "...", "icp_segment": "...", "email_hook": "...", "urgency_score": 8}
>   ]
> }
> ```
> Select the top 50 by fit_score.

---

## STAGE 3: EMAIL VERIFICATION (VERIFIER agent — researcher type)

**Depends on:** Stage 2 output (`/tmp/syba-scout-results.json`)

Launch a Task agent (subagent_type: researcher):

> You are the VERIFIER agent. For each of 50 lead candidates, find and verify their email for $0.
>
> **Verification Waterfall:**
> 1. Guess email from pattern: `{first}.{last}@{domain}` (extract domain from company website or LinkedIn)
> 2. Call Clay Waterfall MCP `verify_email` with the guessed email → SmtpVerifier runs first ($0)
> 3. If invalid, try alternate patterns: `{first}{last}@`, `{f}{last}@`, `{first}@`
> 4. If SmtpVerifier can't verify AND paid API keys are configured, try `waterfall_find_email`
> 5. If all fail → mark as unverified (still include with LinkedIn URL)
>
> **For each lead, output:**
> - `email`: the found/guessed email
> - `email_verified`: true/false
> - `email_verification_source`: "smtp-verifier" | "hunter" | "pattern-guess" | "none"
> - `verification_score`: 0-100
>
> Read `/tmp/syba-scout-results.json`, add verification data to each candidate.
> Write results to `/tmp/syba-verified-results.json`.

---

## STAGE 4: DEEP PERSONALIZATION (PROFILER agent — researcher type)

**Runs in PARALLEL with Stage 3** (doesn't need verification results)

Launch a Task agent (subagent_type: researcher):

> You are the PROFILER agent. For the top 30 candidates (by fit_score), do deep personalization research.
>
> **For each lead:**
> 1. Scrape their LinkedIn profile for recent posts, articles, activity (use Apify if needed)
> 2. Firecrawl scrape their company website → services, team, news, tech stack
> 3. Firecrawl web search → trigger events specific to their company, regulatory news
>
> **Extract 1-2 personalization hooks per lead:**
> - A specific LinkedIn post they wrote (with date and topic)
> - A company milestone (funding, hire, expansion, award)
> - An industry trend affecting their specific role
> - A regulatory event relevant to their company
>
> **Output:** Write to `/tmp/syba-profiler-results.json`:
> ```json
> {
>   "profiles": {
>     "Name at Company": {
>       "linkedin_post_hook": "Your recent post about NIS2 compliance challenges...",
>       "company_insight": "Company just expanded to 3 new EU markets...",
>       "pain_points": ["remote workforce security", "compliance burden"],
>       "tech_stack": ["Microsoft 365", "Fortinet"],
>       "recent_news": "..."
>     }
>   }
> }
> ```
>
> Read candidate list from `/tmp/syba-scout-results.json`.

---

## STAGE 5: EMAIL COMPOSITION (COMPOSER agent — builder type)

**Depends on:** Stage 3 (verified) + Stage 4 (profiled)

Launch a Task agent (subagent_type: builder):

> You are the COMPOSER agent. Generate personalized outreach for each verified lead.
>
> **Read:**
> - `/tmp/syba-verified-results.json` (verified leads)
> - `/tmp/syba-profiler-results.json` (personalization hooks)
> - `syba/CLAUDE.md` (tone rules, NEVER/ALWAYS)
> - `syba/context/SYBA_CONTEXT.md` (ICP segments, stats, email framework)
>
> **For each verified lead, generate:**
> 1. **Cold email** (50-125 words, 4-7 word subject, question-based)
> 2. **3 follow-ups** (Day 3 new angle, Day 10 case study, Day 17 break-up)
> 3. **LinkedIn connection request** (under 300 characters)
>
> **Tone Rules (CRITICAL):**
> - NO dashes or bullet points in email body
> - NO "I hope this finds you well" or generic openers
> - Open with genuine compliment referencing specific LinkedIn post (from profiler data)
> - One cybersecurity insight as free value (use relevant stat from context)
> - SYBA solution in 1-2 sentences max
> - Soft CTA: "15-min conversation" → https://calendly.com/with-francis-at-syba-io/15min
> - Sign off: Francis (Belgium/Europe) or Brigitte (USA)
>
> **Regional Messaging:**
> - Belgium: PwC Scale-up Track recognition, Belgian market expertise
> - USA: Chubb $5M coverage, Jencap HNWI distribution, 78% remote work stat
> - Europe: NIS2 compliance, GDPR cyber requirements, Tokio Marine credibility
>
> **Psychology (Cialdini):**
> - Reciprocity: give a free cybersecurity insight
> - Social proof: mention partnerships (Chubb, PwC)
> - Authority: PwC recognition, $5M coverage
>
> **Content Safety Gate (all 11 must pass):**
> 1. No competitor badmouthing
> 2. No false urgency or pressure
> 3. No misleading claims about coverage
> 4. No unauthorized partner name usage in endorsements
> 5. No personal health/financial assumptions
> 6. Subject line matches body content
> 7. CTA is a question, not a command
> 8. Unsubscribe/opt-out respect
> 9. No all-caps words (except acronyms)
> 10. Professional greeting (no "Hey" for C-suite)
> 11. Accurate statistics with attributable sources
>
> **Output:** Write to `/tmp/syba-composer-results.json`:
> ```json
> {
>   "outreach": [
>     {
>       "lead_name": "...",
>       "email": "...",
>       "region": "...",
>       "email_subject": "...",
>       "email_body": "...",
>       "followup_1": "...",
>       "followup_2": "...",
>       "followup_3": "...",
>       "linkedin_message": "...",
>       "sales_script": "...",
>       "prospect_brief": "...",
>       "safety_gate_passed": true
>     }
>   ]
> }
> ```

---

## STAGE 6: STORAGE + DELIVERY (DISPATCHER agent — builder type)

**Depends on:** Stage 5 output

Launch a Task agent (subagent_type: builder):

> You are the DISPATCHER agent. Store all leads in Supabase, compile the HTML brief, and create Gmail draft.
>
> **Read:**
> - `/tmp/syba-verified-results.json` (verification data)
> - `/tmp/syba-composer-results.json` (outreach packages)
> - `/tmp/syba-profiler-results.json` (personalization data)
>
> **6a. Store Leads in Supabase**
> For each lead, use Supabase MCP `execute_sql`:
> ```sql
> INSERT INTO leads (client_id, first_name, last_name, email, title, company,
>   region, icp_segment, website_url, source, fit_score, phone, linkedin_url,
>   prospect_brief, created_date, email_verified, email_verification_source,
>   linkedin_post_hook, contact_status, follow_up_stage)
> VALUES (...);
> ```
>
> For each outreach package:
> ```sql
> INSERT INTO outreach_packages (lead_id, email_subject, email_body,
>   followup_1, followup_2, followup_3, linkedin_message, sales_script)
> VALUES (...);
> ```
>
> Store trigger events:
> ```sql
> INSERT INTO trigger_events (client_id, event_summary, icp_segment, email_hook,
>   urgency_score, date)
> VALUES (...);
> ```
>
> **6b. Compile HTML Brief**
> Create a professional HTML brief with these sections:
> 1. Executive Summary (date, lead counts by region, avg fit score)
> 2. Follow-Ups Due Today (from orchestrator's Stage 1d data, stored at /tmp/syba-followups-due.json)
> 3. Belgium Verified Leads — Francis (20 leads with outreach)
> 4. USA Verified Leads — Brigitte (20 leads with outreach)
> 5. Europe Verified Leads — Francis (10 leads with outreach)
> 6. Unverified Leads (with LinkedIn URLs for manual lookup)
> 7. Excluded/Flagged Companies
> 8. Trigger Events (with conversation openers)
> 9. Action Items
>
> Use inline CSS. Professional dark-on-white design. SYBA accent color: #e94560.
>
> **6c. Store Briefing**
> ```sql
> INSERT INTO briefings (client_id, title, content, content_html, date)
> VALUES ('{client_id}', 'SYBA Intelligence Brief — {date}', '{text}', '{html}', CURRENT_DATE);
> ```
>
> **6d. Gmail Draft**
> Use Google Workspace MCP `draft_gmail_message`:
> - To: francis@syba.io, brigittev@syba.io
> - Subject: "SYBA Intelligence Brief — {DATE} — {N} Verified Leads"
> - Body: Full HTML brief
>
> **6e. Pre-Send Gate (CRITICAL — all must pass):**
> - All Calendly links resolve
> - No {{placeholder}} text remains
> - Correct Francis/Brigitte sign-off per region
> - Email subject under 50 characters
> - All included emails have email_verified = true (or are in unverified section)

---

## ORCHESTRATION FLOW

Execute stages in this order:

```
1. CONTEXT LOAD (sequential, you)
2. SCOUT (Task agent — researcher)
   ↓ wait for completion
3. VERIFIER + PROFILER (two Task agents in PARALLEL)
   ↓ wait for both
4. COMPOSER (Task agent — builder)
   ↓ wait for completion
5. DISPATCHER (Task agent — builder)
   ↓ wait for completion
6. SUMMARY (you)
```

### Between Stages:
- After Scout: verify `/tmp/syba-scout-results.json` exists with 50+ candidates
- After Verifier: count verified vs unverified, log ratio
- After Profiler: check profile coverage (aim for 60%+ with hooks)
- After Composer: run content safety gate count
- After Dispatcher: verify Supabase row counts match, Gmail draft created

### Stage 6.5: FOLLOW-UP PROCESSING
If follow-ups were due (from Stage 1d), also:
- Include them in the brief under "Follow-Ups Due Today"
- For each, include the appropriate follow-up template from `outreach_packages`
- Save the follow-up due list to `/tmp/syba-followups-due.json` before launching DISPATCHER

---

## SUMMARY OUTPUT (you, after all agents complete)

```
╔══════════════════════════════════════════════════╗
║   SYBA V3 INTELLIGENCE COMPLETE                  ║
╠══════════════════════════════════════════════════╣
║ Date:         {date}                             ║
║ Client:       {slug}                             ║
║                                                  ║
║ LEADS:                                           ║
║  Belgium:     {N} verified / {N} total           ║
║  USA:         {N} verified / {N} total           ║
║  Europe:      {N} verified / {N} total           ║
║  Excluded:    {N}                                ║
║  Unverified:  {N} (LinkedIn URLs included)       ║
║                                                  ║
║ VERIFICATION:                                    ║
║  SmtpVerifier: {N} verified ($0.00)              ║
║  Pattern guess: {N} unverified                   ║
║  Total cost: ~${X.XX}                            ║
║                                                  ║
║ FOLLOW-UPS DUE:                                  ║
║  FU1 (Day 3):  {N} leads                        ║
║  FU2 (Day 10): {N} leads                        ║
║  FU3 (Day 17): {N} leads                        ║
║                                                  ║
║ QUALITY GATES:                                   ║
║  Verification: PASS ({N}/{N})                    ║
║  Exclusion:    PASS ({N} filtered)               ║
║  Content:      PASS ({N}/{N} safe)               ║
║  Pre-Send:     PASS                              ║
║                                                  ║
║ DELIVERY:                                        ║
║  Dashboard:   syba-leads.netlify.app             ║
║  Gmail:       Draft created                      ║
║  Supabase:    {N} leads + {N} packages           ║
║                                                  ║
║ TOP 3 LEADS:                                     ║
║  1. {Name} — {Title} at {Company} (fit: {N})    ║
║  2. {Name} — {Title} at {Company} (fit: {N})    ║
║  3. {Name} — {Title} at {Company} (fit: {N})    ║
╚══════════════════════════════════════════════════╝
```

---

## REUSABILITY

This command works for any client by parameterizing the slug:
- `/syba-intelligence` → runs for SYBA (default)
- `/syba-intelligence {slug}` → reads `clients/{slug}/context/` and `clients/{slug}/CLAUDE.md`

The client's context doc must include: ICP segments, regional allocation, messaging tone, exclusion list, and recipient emails.

---

## COST BREAKDOWN

| Component | Cost | Method |
|-----------|------|--------|
| Email verification | $0 | SmtpVerifier (DNS + SMTP) |
| Email finding | $0 | Pattern guess + SmtpVerifier |
| Lead discovery | ~$0.50 | Apify LinkedIn scraper |
| Deep research | ~$0.00 | Firecrawl (included) |
| **Total per run** | **~$0.50** | |
| **Monthly (daily)** | **~$15** | |
