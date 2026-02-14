# Prompt 005: Implement `/deep-outreach` Skill

**Purpose:** Create the production-ready `/deep-outreach` skill that implements all research findings and architectural decisions as a single Claude Code skill file.

**Inputs:**
- `research/cold-outreach-research-2026-02-13.md` (research findings)
- `research/deep-outreach-system-architecture-2026-02-13.md` (system architecture)
- `research/deep-outreach-system-map.html` (visual reference)
- `.claude/commands/drop.md` (existing /drop pattern to extend)
- `.claude/commands/serve.md` (existing /serve pattern to extend)
- `.claude/commands/activate.md` (client activation pattern)
- `.claude/skills/follow-up/SKILL.md` (follow-up pattern to integrate)
- `.claude/commands/revenue-engine.md` (PAS-SP framework, deep research)
- `supabase/migrations/001_initial_schema.sql` (existing DB schema)
- `outreach/templates/follow-up.md` (follow-up email templates)

**Output:** `.claude/skills/deep-outreach/SKILL.md` (1500-2500 lines)

**Estimated time:** 30-45 minutes

---

## Context

You are a production engineer for Agentic Engineering Consulting. You have three comprehensive documents: a research report, a system architecture, and an HTML visualization. Your job: implement everything as a single, production-ready Claude Code skill file.

**Read ALL input files first.** The skill must faithfully implement the architecture while incorporating every research-backed optimization.

---

## Skill File Structure

The output file `.claude/skills/deep-outreach/SKILL.md` must follow this exact structure:

```markdown
---
name: deep-outreach
description: "Scientific cold outreach system — 11 agents, A/B testing, lead scoring, verification gates, and analytics. Replaces /drop + /serve with research-backed optimization."
invokable: true
---

# /deep-outreach — Scientific Cold Outreach System

[CONTENT BELOW]
```

---

## Part 1: Header & Mode Selection

```markdown
# /deep-outreach — Scientific Cold Outreach System

You are the Deep Outreach engine for Agentic Engineering Consulting. You orchestrate 11 specialized agents to find leads, score them, craft research-backed emails, A/B test variants, verify quality, send via Gmail, detect replies, follow up, and analyze results.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com
**Calendly:** https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min
**Site:** https://agenticengineering.netlify.app
**Case Study:** https://agenticengineering.netlify.app/case-study

---

## Mode Selection

This skill operates in multiple modes. Ask the user which mode to run:

### Mode 1: Drop Mode (replaces /drop)
- **Target:** 50 local businesses (free value outreach)
- **Input:** Industry + City (or auto-rotate from leaddrop/ROTATION.md)
- **Output:** 50 scored, verified, A/B-tested emails sent via Gmail

### Mode 2: Serve Mode (replaces /serve {slug})
- **Target:** 20 leads for a specific paying client
- **Input:** Client slug
- **Output:** 20 scored leads + outreach packages + briefing + dashboard update

### Mode 3: Follow-Up Mode (replaces /follow-up)
- **Target:** All prospects due for Day 3/7/14 follow-ups
- **Input:** None (auto-detects from Supabase)
- **Output:** Follow-up emails sent with optimized timing

### Mode 4: Analytics Mode
- **Target:** Review campaign performance
- **Input:** Campaign ID or date range
- **Output:** A/B test results, conversion funnel, recommendations

### Mode 5: Draft Mode (safety testing)
- **Target:** Same as Mode 1 but creates Gmail drafts instead of sending
- **Input:** Industry + City + number of businesses (default 5)
- **Output:** Drafts in Gmail + Supabase logging (for validation)
```

---

## Part 2: Prerequisites & Database Setup

```markdown
## Prerequisites

### Required MCP Connections
- Supabase MCP (project `wghzabtkmntpclynntpp`)
- Google Workspace MCP (Gmail access for henry@agenticengineering.com)
- Apify MCP (for lead discovery)
- Firecrawl MCP (for website research)
- GitHub MCP (optional, for repo searches)

### Database Setup (Run Once)

On first run, check if the deep-outreach tables exist. If not, run this migration via Supabase MCP (`execute_sql`):

[INSERT THE COMPLETE SQL FROM THE ARCHITECTURE DOC — Section 7]

Include all 5 tables:
1. email_campaigns
2. email_variants
3. email_sends
4. lead_scores
5. verification_failures

Plus all indexes, RLS policies, and realtime subscriptions.

**Important:** Use `CREATE TABLE IF NOT EXISTS` so this is safe to re-run.
```

---

## Part 3: Agent 1 — Client Context Agent

```markdown
## Agent 1: Client Context Agent

### Purpose
Load and normalize client context for all downstream agents.

### For Drop Mode:
- Read `leaddrop/ROTATION.md` to determine next industry + city
- Load Agentic Engineering brand context (owner, email, calendly, links)
- Check `leaddrop_prospects` for previously contacted businesses (dedup)

### For Serve Mode:
- Read `clients/{slug}/context/{SLUG}_CONTEXT.md`
- Load from Supabase: `SELECT * FROM clients WHERE slug = '{slug}'`
- Check existing leads: `SELECT company FROM leads WHERE client_id = '{id}' AND created_date = CURRENT_DATE`

### Output: Context Object
Every downstream agent receives this normalized context:
- client_name, industry, city, brand_color
- icp_segments (array of target customer profiles)
- messaging_guidelines (tone, differentiators, proof points)
- previously_contacted (set of business names/emails to skip)
- calendly_url, case_study_url, site_url
- pricing_tier (for serve mode)
- active_ab_tests (from email_campaigns table)
```

---

## Part 4: Agent 2 — Lead Discovery Agent

```markdown
## Agent 2: Lead Discovery Agent

### Purpose
Find raw leads using the optimal Apify actor per industry.

### Actor Selection Matrix
[INSERT THE "BEST ACTOR BY INDUSTRY" TABLE FROM THE RESEARCH REPORT]

Use the primary actor first. If it returns < target count, use the secondary actor for remaining.

### For Drop Mode (50 businesses):
1. Use Apify MCP `call-actor` with the selected actor
2. Search query: "[industry] in [city]"
3. Target: 60 results (over-fetch to allow for filtering)
4. Extract: name, owner_name, phone, website, rating, review_count, address, categories

### For Serve Mode (20 leads):
1. Use Apify + Firecrawl per ICP segment from context
2. Distribute across segments proportionally
3. Extract: first_name, last_name, email, title, company, website_url

### Deduplication
```sql
-- Drop mode: check leaddrop_prospects
SELECT business_name FROM leaddrop_prospects
WHERE city = '{city}' AND industry = '{industry}';

-- Serve mode: check leads table
SELECT company FROM leads
WHERE client_id = '{id}';
```

Remove any matches from the raw lead list.

### Quality Filters
- Must have website (required for Firecrawl research)
- Must have some reviews (filters out fake/new listings)
- Not a large chain/franchise (review count < 500)
- In the target geographic area
```

---

## Part 5: Agent 3 — Deep Research Agent

```markdown
## Agent 3: Deep Research Agent

### Purpose
Enrich raw leads with website intelligence and trigger events.

### CRITICAL: Use Parallel Builder Agents
Split leads into batches and use parallel builder agents:
- **Drop Mode:** 5 batches of 10 businesses
- **Serve Mode:** 4 batches of 5 leads

Each builder agent does the following for each lead:

### 3a. Website Scrape (Firecrawl)
Use `firecrawl_scrape` on their website URL. Extract:
- **Services offered** (for personalization)
- **Target customers** (who THEY serve — the leads we find for them in Drop mode)
- **Geographic coverage** (local, regional, national)
- **Differentiators** (unique selling points)
- **Gap indicators:**
  - Online booking: Yes/No
  - Chat widget: Yes/No
  - Contact form: Yes/No
  - After-hours info: Yes/No
  - Blog/content: Yes/No
  - Mobile responsive: Yes/No
  - SSL certificate: Yes/No

### 3b. Trigger Event Search (WebSearch)
Search for: "[business name] [city] news OR expansion OR hiring OR opening"
Look for:
- New location opening
- Hiring surge
- Award/recognition
- Negative event (lawsuit, complaint, recall)
- Seasonal demand spike

### 3c. Competitive Context
Note how many competitors appear in the same Apify search. More competitors = more urgency messaging.

### 3d. Revenue Loss Calculation (Drop Mode Only)
Use industry benchmarks from the research report:
[INSERT THE REVENUE LOSS TABLE FROM /revenue-engine.md]

Calculate: missed_calls_per_month × avg_revenue_per_opportunity = monthly_loss

### 3e. Find Leads FOR Each Business (Drop Mode Only)
Use the industry-specific lead-finding strategies from /drop.md:
[REFERENCE THE EXISTING LEAD FINDING STRATEGIES PER INDUSTRY]

For each of the 5 leads found, capture:
- Name/company, title, connection reason, contact info

### Output per Lead:
Write results to temp file: `/tmp/deep_outreach_batch_{N}.json`
```

---

## Part 6: Agent 4 — Lead Scoring Agent

```markdown
## Agent 4: Lead Scoring Agent

### Purpose
Apply the 8-feature weighted scoring algorithm to every lead.

### Scoring Algorithm

[INSERT THE COMPLETE 8-FEATURE SCORING MODEL FROM THE ARCHITECTURE DOC]

For each lead, calculate:

#### Feature 1: Company Size
[scoring rules from architecture — e.g., review count as proxy]

#### Feature 2: Geography Match
[scoring rules]

#### Feature 3: Tech Stack Gaps
[scoring rules — count of missing: booking, chat, mobile, SSL]

#### Feature 4: Trigger Event Presence
[scoring rules]

#### Feature 5: Website Quality
[scoring rules]

#### Feature 6: Social Presence
[scoring rules]

#### Feature 7: Industry Match
[scoring rules]

#### Feature 8: Contact Findability
[scoring rules]

### Formula
```
raw_score = (f1 × w1) + (f2 × w2) + ... + (f8 × w8)
max_possible = 5 × (w1 + w2 + ... + w8)
normalized_score = round((raw_score / max_possible) × 9) + 1
```

### Store Scores in Supabase
```sql
INSERT INTO lead_scores (lead_id, campaign_id, company_size_score, geography_score,
  tech_gaps_score, trigger_score, website_quality_score, social_score,
  industry_match_score, contact_score, raw_total, normalized_total, feature_breakdown)
VALUES (...);
```

### Quality Gate 1: Lead Quality Threshold
If normalized_score < [threshold from research]:
- Skip this lead (do not craft email)
- Log to verification_failures: gate='lead_quality', reason='Score {X} below threshold {Y}'
- If >50% of leads fail this gate: PAUSE and alert user
```

---

## Part 7: Agent 5 — Email Crafting Agent

```markdown
## Agent 5: Email Crafting Agent

### Purpose
Generate research-backed email copy using the optimal psychology framework.

### Framework Selection (from research)
[INSERT THE "RECOMMENDED FRAMEWORK PER EMAIL POSITION" TABLE]

### Email Parameters (from research)
- **Optimal length:** [X]-[Y] words (from research findings)
- **Optimal subject length:** [X]-[Y] words (from research findings)
- **CTA count:** 1 (from research — single CTA outperforms multiple)
- **Personalization level:** [level from research] (specific insight about their business)
- **Social proof:** [type from research] (industry stat vs testimonial vs case study)

### Drop Mode Email Template

Based on the research-optimized framework, generate:

**Subject line format:** [from research — the format with highest open rate]

**Email body structure:**
```
[HOOK — 1 sentence, specific to their business, from Firecrawl data]
[RESEARCH REFERENCE — cite specific finding]

[LEADS — 5 researched leads for their business]
1. **[Lead Name]** — [Title] at [Company]
   → [Specific connection to their business]
... (5 total)

[VALUE QUANTIFICATION — from revenue loss calculation]
[RESEARCH REFERENCE — cite finding on value-first approaches]

[WHAT-IF — paint the picture of daily leads]

[PROOF — case study link, with specific metric]
[RESEARCH REFERENCE — cite finding on social proof placement]

[CTA — low friction, specific]
[RESEARCH REFERENCE — cite finding on CTA format]

[SIGNATURE + P.S.]
[RESEARCH REFERENCE — cite finding on P.S. effectiveness]
```

### Serve Mode Email Template
Similar structure but tailored to the client's ICP and messaging guidelines from context doc.

### Follow-Up Templates
[Implement research-optimized timing and framework per position]
- Follow-up 1: [day from research] — [framework from research]
- Follow-up 2: [day from research] — [framework from research]
- Follow-up 3: [day from research] — [framework from research]

### Quality Gate 2: Content Safety Check
Run ALL of these checks on every crafted email:
1. **Spam word scan:** Check against list: [INSERT SPAM WORDS FROM RESEARCH — free, guarantee, act now, limited time, etc.]
2. **Length check:** Email body between [X] and [Y] words
3. **Subject length check:** Subject between [X] and [Y] words
4. **CTA count:** Exactly 1 primary CTA (links allowed)
5. **Personalization completeness:** No `[Name]`, `{company}`, `{{placeholder}}` tokens remaining
6. **Professional tone:** No ALL CAPS words (except acronyms), no `!!!`, no `???`
7. **No broken links:** All URLs start with https:// and are well-formed
8. **Sender info present:** Email includes signature block
9. **Brand consistency:** Matches client messaging guidelines from context
10. **No competitor bashing:** No negative references to specific competitors
11. **Opt-out mechanism:** Contains "reply to unsubscribe" or similar

If ANY check fails:
- Log to verification_failures table
- Attempt to auto-fix (e.g., replace placeholder, shorten text)
- Re-check after fix
- If still failing: flag for manual review, do NOT send

**Batch halt:** If <80% of emails pass all checks → halt entire run and alert user
```

---

## Part 8: Agent 6 — A/B Variant Generator

```markdown
## Agent 6: A/B Variant Generator

### Purpose
Generate test variants for active A/B experiments.

### Active Test Selection
Check the current campaign's active_tests field:
```sql
SELECT active_tests FROM email_campaigns WHERE id = '{campaign_id}';
```

If no tests active, use the email as-is (control only).

### Predefined Tests
[INSERT THE 5 TEST DEFINITIONS FROM THE ARCHITECTURE DOC]

### Variant Generation Logic
For each email, if an A/B test is active:

1. **Determine assignment:** `hash(business_id + test_id) % 2`
   - 0 = control (use email as-is)
   - 1 = variant (generate alternative)

2. **Generate variant** based on test type:
   - **Subject line test:** Generate alternative subject using the variant format
   - **Email length test:** Shorten or lengthen to the variant word count
   - **CTA placement test:** Move CTA to the variant position
   - **Social proof test:** Add or change social proof element
   - **Framework test:** Rewrite using variant framework

3. **Tag the email:**
```json
{
  "test_id": "T001",
  "variant_id": "control" or "variant_a",
  "variable_tested": "subject_line",
  "control_value": "Quick question about {Business}'s phones?",
  "variant_value": "5 leads for {Business} — free"
}
```

### Quality Gate 3: A/B Variant Equivalence
- Control and variant must differ ONLY in the tested variable
- Word count delta for non-length tests must be < 20%
- Both must pass all content safety checks
- If check fails: regenerate variant, max 2 retries, then fall back to control

### Store Variant Assignment
```sql
INSERT INTO email_variants (campaign_id, test_id, lead_id, variant_id,
  variable_tested, control_value, variant_value)
VALUES (...);
```
```

---

## Part 9: Agent 7 — Verification Agent

```markdown
## Agent 7: Verification Agent

### Purpose
Final pre-send verification — the last checkpoint before emails go out.

### Comprehensive Check List (10+ checks)

Run ALL checks on every email in the batch:

1. **Duplicate check:** Has this business/email been contacted in the last 90 days?
   ```sql
   SELECT COUNT(*) FROM email_sends WHERE recipient_email = '{email}'
   AND sent_at > NOW() - INTERVAL '90 days';
   ```

2. **Email format validation:** RFC 5322 compliant email address
   - Has @ symbol, valid domain, no spaces

3. **Spam score estimation:**
   - Count spam trigger words in subject + body
   - If count > 3: flag

4. **Content length bounds:**
   - Subject: [min]-[max] characters
   - Body: [min]-[max] words

5. **CTA presence:** At least one link (Calendly or case study)

6. **Personalization completeness:** No unreplaced tokens

7. **Rate limit check:**
   ```sql
   SELECT COUNT(*) FROM email_sends
   WHERE sent_at > NOW() - INTERVAL '24 hours';
   ```
   If approaching Gmail daily limit (~500): halt

8. **OAuth token validity:** Check token expiry before batch

9. **Brand compliance:** Correct signature, correct Calendly link, correct email from address

10. **Reply-to address:** Set to henry@agenticengineering.com

11. **Unsubscribe mechanism:** "Reply 'stop' to unsubscribe" or equivalent

12. **Link validation:** All URLs resolve (quick HEAD request)

### Batch Verification Summary
```
VERIFICATION REPORT
═══════════════════
Total emails checked: [N]
Passed all checks:    [N] ([X]%)
Failed 1+ checks:     [N] ([X]%)

FAILURES BY CHECK:
• Spam score:         [N]
• Length bounds:       [N]
• Duplicate:          [N]
• [check]:            [N]

DECISION: [PROCEED / HALT]
```

If pass rate < 80%: **HALT** the entire batch. Do NOT send any emails. Alert the user with the verification report.

### Store Failures
```sql
INSERT INTO verification_failures (campaign_id, lead_id, gate, check_name,
  check_result, details)
VALUES (...);
```
```

---

## Part 10: Agent 8 — Sending Agent

```markdown
## Agent 8: Sending Agent

### Purpose
Send verified emails via Gmail API with rate limiting and error handling.

### Quality Gate 4: Rate Limit Check
Before starting the send batch:
1. Check Gmail API quota remaining
2. Verify OAuth token is valid (refresh if needed)
3. Calculate send time: (N emails × 0.5s delay) = [X] minutes

### OAuth Token Management
Extract OAuth token from macOS Keychain:
```bash
security find-generic-password -s "hardened-google-workspace-mcp" -a "henry@agenticengineering.com" -w
```
If token is expired: re-extract (the MCP server refreshes it automatically)

### Send Loop
For each verified email:

1. **Create Gmail draft** via Google Workspace MCP `draft_gmail_message`:
   - to: recipient email
   - subject: personalized subject (control or variant)
   - body: personalized email body (HTML format)
   - from: henry@agenticengineering.com

2. **Send the draft** via Gmail API:
   ```bash
   curl -s -X POST "https://gmail.googleapis.com/gmail/v1/users/me/drafts/send" \
     -H "Authorization: Bearer {TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{"id": "{DRAFT_ID}"}'
   ```

3. **Record the send:**
   ```sql
   INSERT INTO email_sends (campaign_id, lead_id, variant_id, test_id,
     recipient_email, subject, sent_at, gmail_message_id, status)
   VALUES (..., 'sent');
   ```

4. **Rate limit:** Sleep 0.5 seconds

5. **Error handling:**
   - If send fails with 429 (rate limit): wait 5s, retry once
   - If send fails with 401 (auth): refresh token, retry once
   - If send fails with other error: log to email_sends with status='failed', continue
   - If 3+ consecutive failures: HALT batch and alert user

### For Draft Mode (Mode 5):
Skip step 2 (don't send). Just create drafts in Gmail.
Set email_sends status to 'drafted' instead of 'sent'.

### Send Summary
After all sends complete:
```
SEND COMPLETE
═════════════
Sent:    [N] emails
Drafted: [N] emails
Failed:  [N] emails
Time:    [X] minutes
Rate:    [X] emails/minute
```
```

---

## Part 11: Agent 9 — Reply Detection Agent

```markdown
## Agent 9: Reply Detection Agent

### Purpose
Check Gmail for replies to previously sent emails and classify them.

### When to Run
- Automatically at the start of every /deep-outreach run
- On-demand via Mode 4 (Analytics)

### Detection Logic
1. Search Gmail for replies:
   Use Google Workspace MCP `search_gmail_messages`:
   - Query: "in:inbox is:unread from:-me subject:(one of our sent subjects)"
   - Or search by thread IDs of sent emails

2. For each reply found:
   - Read the reply content via `get_gmail_message_content`
   - Classify using this logic:

### Reply Classification
Classify each reply into one of these categories:
- **positive_interest:** Contains phrases like "interested", "tell me more", "sounds good", "let's talk", "when can we", "book a time"
- **question:** Contains `?` and asks about pricing, process, timeline, etc.
- **objection:** Contains "not interested", "already have", "too expensive", "don't need"
- **unsubscribe:** Contains "stop", "unsubscribe", "remove me", "don't contact"
- **bounce:** Contains "delivery failed", "undeliverable", "no such user"
- **other:** Anything else (auto-reply, out of office, etc.)

### Update Supabase
```sql
-- Update email_sends
UPDATE email_sends SET status = '{classification}', replied_at = NOW()
WHERE gmail_message_id = '{original_message_id}';

-- Update leaddrop_prospects (Drop mode)
UPDATE leaddrop_prospects SET status = '{classification}'
WHERE email_to = '{recipient}';

-- Update leads (Serve mode)
UPDATE leads SET ... WHERE email = '{recipient}';
```

### Immediate Actions
- **unsubscribe:** Never contact again. Set status to 'declined'.
- **bounce:** Remove from all future sends. Log the bad email.
- **positive_interest:** Flag for immediate follow-up by Henry.
- **question:** Flag for Henry's review with suggested response.
```

---

## Part 12: Agent 10 — Follow-Up Agent

```markdown
## Agent 10: Follow-Up Agent

### Purpose
Send follow-up emails at research-optimized intervals.

### Timing (from research — may differ from current Day 3/7/14)
[INSERT OPTIMIZED FOLLOW-UP TIMING FROM RESEARCH]

If research confirms Day 3/7/14, keep current timing. If research suggests different timing, implement the research-backed intervals.

### Which Prospects Need Follow-Up
```sql
-- Follow-up 1
SELECT es.*, lp.business_name, lp.owner_name, lp.industry, lp.city
FROM email_sends es
JOIN leaddrop_prospects lp ON lp.email_to = es.recipient_email
WHERE es.status = 'sent'
  AND es.sent_at <= NOW() - INTERVAL '[follow_up_1_days] days'
  AND NOT EXISTS (
    SELECT 1 FROM email_sends es2
    WHERE es2.recipient_email = es.recipient_email
    AND es2.status IN ('follow_up_1', 'follow_up_2', 'follow_up_3')
    AND es2.campaign_id = es.campaign_id
  );

-- Similar for follow-up 2 and 3
```

### Follow-Up Email Generation
Use the research-recommended framework per follow-up position:
[REFERENCE THE FRAMEWORK SELECTION TABLE]

Read templates from `outreach/templates/follow-up.md` as the base, then enhance with research findings.

### Follow-Up Rules (from outreach/templates/follow-up.md)
- **Stop immediately** if they responded (any classification)
- **Max 3 touches** per prospect
- **Update tracking** in both email_sends and leaddrop_prospects after each send
- **After final follow-up:** Set status to 'archived'
```

---

## Part 13: Agent 11 — Analytics Agent

```markdown
## Agent 11: Analytics Agent

### Purpose
Compute campaign metrics, analyze A/B tests, and generate optimization recommendations.

### Campaign Metrics Query
```sql
SELECT
  c.id,
  c.industry,
  c.city,
  COUNT(es.id) as total_sent,
  COUNT(CASE WHEN es.status = 'sent' THEN 1 END) as no_reply,
  COUNT(CASE WHEN es.status = 'positive_interest' THEN 1 END) as positive,
  COUNT(CASE WHEN es.status = 'question' THEN 1 END) as questions,
  COUNT(CASE WHEN es.status = 'objection' THEN 1 END) as objections,
  COUNT(CASE WHEN es.status = 'unsubscribe' THEN 1 END) as unsubscribes,
  COUNT(CASE WHEN es.status = 'bounce' THEN 1 END) as bounces,
  ROUND(COUNT(CASE WHEN es.status = 'positive_interest' THEN 1 END)::decimal
    / NULLIF(COUNT(es.id), 0) * 100, 1) as reply_rate
FROM email_campaigns c
JOIN email_sends es ON es.campaign_id = c.id
WHERE c.id = '{campaign_id}'
GROUP BY c.id;
```

### A/B Test Analysis
For each active test:
```sql
SELECT
  ev.test_id,
  ev.variant_id,
  COUNT(es.id) as sends,
  COUNT(CASE WHEN es.status IN ('positive_interest', 'question') THEN 1 END) as replies,
  ROUND(COUNT(CASE WHEN es.status IN ('positive_interest', 'question') THEN 1 END)::decimal
    / NULLIF(COUNT(es.id), 0) * 100, 2) as reply_rate
FROM email_variants ev
JOIN email_sends es ON es.lead_id = ev.lead_id AND es.campaign_id = ev.campaign_id
WHERE ev.campaign_id = '{campaign_id}'
GROUP BY ev.test_id, ev.variant_id;
```

### Chi-Square Significance Test
Calculate for each A/B test:
```
Observed: [control_replies, control_no_reply, variant_replies, variant_no_reply]
Expected: [(control_total + variant_total) * (control_replies + variant_replies) / total, ...]
χ² = Σ[(O - E)² / E]
p_value = 1 - chi_square_cdf(χ², df=1)
significant = p_value < 0.05 AND min(control_sends, variant_sends) >= [min_sample from research]
```

### Auto-Winner Selection
If a test is statistically significant:
1. Declare the variant with higher reply rate as winner
2. Log the decision:
```sql
UPDATE email_campaigns
SET active_tests = active_tests || '[{"test_id": "{id}", "winner": "{variant}", "p_value": {p}, "sample": {n}}]'
WHERE id = '{campaign_id}';
```
3. Future sends use the winning variant as the new control

### Lead Scoring Accuracy
Correlate scores with outcomes:
```sql
SELECT
  normalized_total as score,
  COUNT(*) as leads,
  COUNT(CASE WHEN es.status IN ('positive_interest', 'question') THEN 1 END) as replies,
  ROUND(COUNT(CASE WHEN es.status IN ('positive_interest', 'question') THEN 1 END)::decimal
    / NULLIF(COUNT(*), 0) * 100, 1) as reply_rate
FROM lead_scores ls
JOIN email_sends es ON es.lead_id = ls.lead_id
GROUP BY normalized_total
ORDER BY normalized_total DESC;
```

### Analytics Dashboard Output
```
╔══════════════════════════════════════════════════════════════╗
║                 DEEP OUTREACH ANALYTICS                      ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║ CAMPAIGN: {industry} in {city}                               ║
║ Date: {date}                                                 ║
║                                                              ║
║ FUNNEL:                                                      ║
║ Discovered:    [N] leads                                     ║
║ Scored:        [N] above threshold ([X]%)                    ║
║ Crafted:       [N] emails                                    ║
║ Verified:      [N] passed all checks ([X]%)                  ║
║ Sent:          [N] emails                                    ║
║ Replied:       [N] ([X]% reply rate)                         ║
║   Positive:    [N]                                           ║
║   Questions:   [N]                                           ║
║   Objections:  [N]                                           ║
║ Booked:        [N] ([X]% of replies)                         ║
║                                                              ║
║ A/B TESTS:                                                   ║
║ {test_name}: Control {X}% vs Variant {Y}% — {status}        ║
║ {test_name}: Control {X}% vs Variant {Y}% — {status}        ║
║                                                              ║
║ LEAD SCORING:                                                ║
║ Avg score:       [X]/10                                      ║
║ Score→Reply r²:  [X] (0=random, 1=perfect prediction)       ║
║ Threshold:       [X] (recommending {change if needed})       ║
║                                                              ║
║ RECOMMENDATIONS:                                             ║
║ 1. [specific actionable recommendation]                      ║
║ 2. [specific actionable recommendation]                      ║
║ 3. [specific actionable recommendation]                      ║
╚══════════════════════════════════════════════════════════════╝
```
```

---

## Part 14: Orchestration & Execution Flow

```markdown
## Execution Flow

### Mode 1: Drop Mode — Full Pipeline

Copy this checklist and track progress:
```
Deep Outreach — Drop Mode Progress:
- [ ] Step 1: Agent 1 — Load context + rotation state
- [ ] Step 2: Agent 9 — Check for replies to previous sends
- [ ] Step 3: Agent 2 — Discover 60+ businesses via Apify
- [ ] Step 4: Agent 3 — Deep research (5 parallel builders × 10 businesses)
- [ ] Step 5: Agent 4 — Score all leads (8-feature algorithm)
- [ ] GATE 1: Lead Quality Threshold — exclude low scores
- [ ] Step 6: Agent 5 — Craft emails (research-backed framework)
- [ ] Step 7: Agent 6 — Generate A/B variants (if test active)
- [ ] GATE 2: Content Safety Check — 10+ verification checks
- [ ] GATE 3: A/B Variant Equivalence Check
- [ ] Step 8: Agent 7 — Final verification sweep
- [ ] GATE 4: Rate Limit Check
- [ ] Step 9: Agent 8 — Send via Gmail (or draft in Mode 5)
- [ ] Step 10: Agent 10 — Send due follow-ups
- [ ] Step 11: Agent 11 — Compute analytics + A/B results
- [ ] Step 12: Update rotation tracker + Supabase campaign record
- [ ] Step 13: Print summary dashboard
```

### Parallel Execution Points
These steps can run in parallel:
- Agent 3 (Deep Research): 5 builders in parallel
- Agent 5 + Agent 4: Once research is done, craft emails in parallel with any remaining scoring
- Agent 9 (Reply Detection) can run at the same time as Agent 2 (Discovery)

### Error Recovery
If any step fails:
1. Log the error with full context
2. If the step is retriable (Firecrawl timeout, Apify rate limit): wait 5s, retry once
3. If the step is not retriable (Supabase schema error, auth failure): HALT and alert user
4. Never lose data: write intermediate results to /tmp/ files before Supabase inserts
5. If batch was partially sent: record exactly which emails were sent vs not sent
```

---

## Part 15: Summary Dashboard

```markdown
## Summary Dashboard

After every run, print:

### Drop Mode Summary
```
╔══════════════════════════════════════════════════════════════╗
║              DEEP OUTREACH — DROP COMPLETE                   ║
╠══════════════════════════════════════════════════════════════╣
║ Industry:    {industry}                                      ║
║ City:        {city}                                          ║
║ Date:        {date}                                          ║
║                                                              ║
║ PIPELINE:                                                    ║
║ Discovered:    {N} businesses                                ║
║ Researched:    {N} (Firecrawl + WebSearch)                   ║
║ Scored:        {N} above threshold (avg: {X}/10)             ║
║ Verified:      {N}/{N} passed ({X}%)                         ║
║ Sent:          {N} emails                                    ║
║ Free leads:    {N×5} delivered to {N} businesses             ║
║                                                              ║
║ A/B TEST:                                                    ║
║ Active test:  {test_name}                                    ║
║ Control:      {N} sends, {N} replies ({X}%)                  ║
║ Variant:      {N} sends, {N} replies ({X}%)                  ║
║ Status:       {needs more data / significant / winner}       ║
║                                                              ║
║ QUALITY:                                                     ║
║ Spam score:      avg {X} (max 3 allowed)                     ║
║ Personalization: {X}% have specific business insight         ║
║ Email length:    avg {X} words (target: {X}-{Y})             ║
║                                                              ║
║ PIPELINE PROJECTION:                                         ║
║ If {X}% reply:    {N} conversations                          ║
║ If {X}% close:    {N} clients × $200/mo                      ║
║ Projected MRR:    ${X,XXX}                                   ║
║                                                              ║
║ CUMULATIVE (all campaigns):                                  ║
║ Total businesses contacted: {N}                              ║
║ Total free leads delivered:  {N}                             ║
║ Total replies:               {N} ({X}%)                      ║
║ Total clients from /drop:    {N}                             ║
╚══════════════════════════════════════════════════════════════╝
```

### Serve Mode Summary
[Similar format but tailored for per-client metrics]

### Follow-Up Summary
[Similar format showing Day 3/7/14 follow-up counts and pipeline health]
```

---

## Part 16: Rotation & Campaign Management

```markdown
## Rotation Management

### After Drop Mode
Update `leaddrop/ROTATION.md` with:
```
## {date} — Deep Outreach Drop
- **Industry:** {industry}
- **City:** {city}
- **Businesses contacted:** {N}
- **Avg lead score:** {X}/10
- **A/B test:** {test_name} ({status})
- **Verification pass rate:** {X}%
- **Next in rotation:** {next industry} in {next city}
```

### Campaign Record
```sql
UPDATE email_campaigns
SET status = 'completed', completed_at = NOW(),
    actual_count = {N},
    metrics = '{
      "discovered": {N},
      "scored": {N},
      "verified": {N},
      "sent": {N},
      "avg_score": {X},
      "verification_pass_rate": {X},
      "reply_rate": {X}
    }'::jsonb
WHERE id = '{campaign_id}';
```
```

---

## Part 17: Configuration & Defaults

```markdown
## Configurable Parameters

These values can be adjusted per run. Defaults are from research.

| Parameter | Default | Range | Research Basis |
|-----------|---------|-------|---------------|
| Businesses per drop | 50 | 5-100 | [research finding] |
| Leads per business (drop) | 5 | 3-10 | [research finding] |
| Leads per serve | 20 | 10-30 | [research finding] |
| Score threshold | [X] | 1-10 | [research finding] |
| Verification pass threshold | 80% | 50-100% | Conservative default |
| Send delay (seconds) | 0.5 | 0.5-2.0 | Gmail rate limits |
| Max daily sends | 200 | 50-500 | Gmail sending limits |
| Email word count target | [X]-[Y] | 100-600 | [research finding] |
| Subject word count target | [X]-[Y] | 3-12 | [research finding] |
| A/B min sample per variant | [X] | 25-100 | [research finding] |
| Follow-up Day 1 delay | [X] days | 2-5 | [research finding] |
| Follow-up Day 2 delay | [X] days | 5-10 | [research finding] |
| Follow-up Day 3 delay | [X] days | 10-21 | [research finding] |
| Re-contact cool-off | 90 days | 30-180 | Industry best practice |
```

---

## Efficiency Rules

1. **Always use parallel builder agents** for research (Agent 3). Split batches as specified.
2. **Firecrawl is the bottleneck** — scrape in parallel batches, never sequentially.
3. **If a business has no website, skip it** — we need the website for research + scoring.
4. **Store everything in Supabase** — every decision, score, and send is tracked.
5. **0.5s sleep between Gmail sends** — prevents rate limiting.
6. **Check OAuth token before bulk sends** — refresh if needed.
7. **Write intermediate results to /tmp/** — never lose data on crash.
8. **Run Agent 9 (Reply Detection) at the start** — always check for replies first.
9. **Batch halt at <80% verification** — never send low-quality batches.
10. **Auto-select A/B winners at significance** — continuously improve.

---

## Related Commands

| Command | Relationship |
|---------|-------------|
| `/deep-outreach` | This skill — the complete pipeline |
| `/drop` | Legacy — replaced by `/deep-outreach --mode=drop` |
| `/serve {slug}` | Legacy — replaced by `/deep-outreach --mode=serve {slug}` |
| `/follow-up` | Legacy — replaced by `/deep-outreach --mode=followup` |
| `/activate` | Still independent — onboards new clients from /drop conversions |
| `/revenue-engine` | Legacy — subsumed by /deep-outreach (same research, full pipeline) |

*Run daily: `/deep-outreach`*
*Check analytics: `/deep-outreach --mode=analytics`*
*Safe test: `/deep-outreach --mode=draft --count=5`*
