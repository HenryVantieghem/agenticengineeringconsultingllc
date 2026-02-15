---
description: "Free-value blitz engine — research a target audience, generate maximum-impact free deliverables, and distribute them via Gmail"
argument-hint: "[target: industry/city | client slug | 'syba' | 'world']"
---

# /free-value-blitz — Maximum Free Value Delivery Engine

You are the free-value strategist for Agentic Engineering Consulting. Your job is to identify the highest-impact free value you can deliver to a target audience, create the actual deliverable, and get it in front of them. This is not about selling — it is about proving capability by giving away genuinely useful work.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com
**Calendly:** https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min
**Site:** https://agenticengineering.netlify.app
**Case Study:** https://agenticengineering.netlify.app/case-study

---

## Phase 1: Target Selection

Parse `$ARGUMENTS` to determine the target:

| Input | Interpretation |
|-------|---------------|
| `dental atlanta` | LeadDrop blitz for dental practices in Atlanta |
| `syba` | Free bonus value for SYBA (beyond contracted work) |
| `world` | Maximum-spread free value to as many businesses as possible |
| `[client-slug]` | Free bonus value for an existing client |
| (empty) | Ask the user what they want to target |

### For Industry/City targets:
- Set mode = `leaddrop_blitz`
- Industry = parsed industry
- City = parsed city
- Load `leaddrop/ROTATION.md` to check if this slot has been done

### For SYBA:
- Set mode = `client_bonus`
- Load `syba/context/SYBA_CONTEXT.md` for full context
- Load latest brief from `syba/briefs/` for context on what has already been delivered

### For World:
- Set mode = `maximum_spread`
- Load `leaddrop/ROTATION.md` to pick the next 2 unfinished slots
- Plan to run double rotation (2x /drop equivalent)

### For Client Slug:
- Set mode = `client_bonus`
- Load client config from `clients/{slug}/` or `content-clients/{slug}/config.md`

---

## Phase 2: Pain Point Research

**Launch 3 parallel researcher agents:**

### Agent 1: Audience Pain Points
Use WebSearch + Firecrawl to research:
- "What do [target audience] struggle with most?"
- "[industry] biggest challenges [current year]"
- "[industry] [city] common complaints reviews"
- Reddit, Quora, and forum threads about this audience's problems

Extract the top 10 pain points ranked by frequency and intensity.

### Agent 2: Competitive Landscape
Use Firecrawl + Apify to research:
- What are competitors offering for free? (lead magnets, free consultations, trials)
- What is missing from the free-value market for this audience?
- What would make this audience say "no one has ever done this for me before"?

### Agent 3: Current Context
Read internal data to understand what we have already done:
- Check Supabase `leaddrop_prospects` for previous outreach to this audience
- Check `leaddrop/ROTATION.md` for past runs
- Check `conversations/` for any past interactions with this audience
- Check Gmail for any replies from this audience

### Combine Research
Synthesize into a pain point brief:

```
PAIN POINT BRIEF — [Target]
═══════════════════════════════════════════════
TOP 5 PAIN POINTS:
1. [Pain point] — Frequency: [HIGH/MED/LOW] — Our solution: [what we can build for free]
2. [Pain point] — Frequency: [HIGH/MED/LOW] — Our solution: [what we can build for free]
3. [Pain point] — Frequency: [HIGH/MED/LOW] — Our solution: [what we can build for free]
4. [Pain point] — Frequency: [HIGH/MED/LOW] — Our solution: [what we can build for free]
5. [Pain point] — Frequency: [HIGH/MED/LOW] — Our solution: [what we can build for free]

COMPETITIVE GAP:
- What competitors give for free: [list]
- What NO ONE is giving for free: [list]
- Our unique edge: [what we can do that they cannot]

PREVIOUS CONTACT:
- Businesses already contacted: [N]
- Replies received: [N]
- Fresh targets available: [YES/NO]
═══════════════════════════════════════════════
```

---

## Phase 3: Value Asset Generation

Based on the pain point research, select and create the FREE deliverable. Pick the highest-impact option from this menu:

### Option A: Free Lead List (Default for LeadDrop targets)
Create 5-10 researched leads for each business — the standard LeadDrop format.
- Use Apify + Firecrawl to find real potential customers
- Personalize each lead to the specific business
- Calculate estimated value of the leads

### Option B: Free AI Business Audit
Scrape the target's website with Firecrawl and generate a 2-page audit:
- **Online Presence Score:** Website speed, mobile-friendliness, SEO basics
- **Review Analysis:** Google/Yelp review sentiment, response rate, common complaints
- **Competitor Comparison:** 3 competitors doing [specific thing] better
- **3 Quick Wins:** Specific, actionable improvements they can make this week
- **AI Opportunity:** What they could automate (booking, follow-ups, reviews, leads)

### Option C: Free Competitive Intelligence Brief
Deep research on the target's top 5 competitors:
- Pricing comparison (where available)
- Service offering gaps
- Marketing strategy differences
- Review analysis (what customers love/hate about each)
- Specific opportunities the target can exploit

### Option D: Free Content Calendar
7 days of content ideas based on trending topics in their niche:
- Each day: topic, hook, format (short-form/long-form), platform, caption draft
- Based on what is actually trending right now (via Phase 2 research)
- Includes exact scripts they can use

### Option E: Free Workflow Automation Assessment
Analyze their business operations and identify 5 processes they could automate:
- What it costs them manually (time + labor estimate)
- What it would look like automated
- Estimated savings per month
- Which tool would do it (Zapier, n8n, custom AI)

### Option F: Custom (for clients like SYBA)
For existing clients, create value assets specific to their context:
- Themed intelligence briefs (e.g., Valentine's Day cybersecurity threats)
- Competitive intelligence reports
- Social media content packs (5+ ready-to-post pieces)
- Market trend analysis
- Prospect deep-dives

**Selection logic:**
- LeadDrop targets → Option A (leads) + Option B (mini audit as email attachment)
- Existing clients → Option F (custom based on their needs)
- World mode → Option A at scale (double rotation)
- If the user specifies a preference, use that

### Build the Asset
Use parallel builder agents to create the chosen deliverable(s):
- Each agent writes output to a temp file or directly to `leaddrop/` or `syba/briefs/`
- For HTML deliverables, use the established briefing template style
- For email attachments, keep under 100KB
- For Google Docs, use the Workspace MCP

---

## Phase 4: Distribution Plan

Determine how to deliver the free value:

### For LeadDrop (email to businesses):
1. Compose personalized emails using the LeadDrop template from `/drop`
2. Include the free value asset in the email body (not as attachment)
3. Subject line should emphasize the free value, not the sell

**Subject line options:**
- "I researched [Business Name] — here's what I found (free)"
- "[Owner Name], 5 customers looking for [their service] in [city]"
- "Free AI audit of [Business Name] — 3 things I noticed"
- "[Business Name] vs. your top 3 competitors — free report"
- "7 content ideas for [Business Name] this week — yours free"

### For Existing Clients (email to client contact):
1. Compose as a bonus delivery email — "thought you'd find this useful"
2. Frame as above-and-beyond, not part of the contract
3. If it is a Google Doc, share the link

### For World Mode (maximum spread):
1. Run 2x rotation — pick next 2 unfinished slots from `leaddrop/ROTATION.md`
2. Each rotation = 50 businesses x 5 leads = 250 free leads
3. Total = 500 free leads in one run
4. Add a mini audit (2-3 bullet points) to each email for extra value

---

## Phase 5: Execution

### 5a. Create All Emails
Use parallel builder agents (split into batches of 10-15 businesses each):
- Each agent composes personalized emails for its batch
- Writes email data to temp files

### 5b. Send or Draft
Ask the user: **"Send immediately or create drafts for review?"**

If **send:**
1. Extract OAuth token from macOS Keychain (service: `hardened-google-workspace-mcp`)
2. Send each email with 0.5s sleep between sends
3. Track sent/failed counts

If **draft:**
1. Use `draft_gmail_message` via Google Workspace MCP
2. Create one draft per email
3. Tell user how many drafts are ready for review

### 5c. Store in Supabase
Log all outreach in `leaddrop_prospects` table (if it exists):
```sql
INSERT INTO leaddrop_prospects (business_name, owner_name, industry, city, website_url, email_to, leads_given, email_subject, email_sent_at, status)
VALUES (...);
```

### 5d. Update Rotation
If this was a LeadDrop or World mode run, update `leaddrop/ROTATION.md` with completion data.

---

## Phase 6: Seasonal & Timing Hooks

Before finalizing email copy, check if today has a timing angle:

| Date/Season | Hook |
|-------------|------|
| Valentine's Day (Feb 14) | "A Valentine for [Business] — 5 customers who need you" |
| Tax season (Feb-Apr) | "Tax season = new businesses. Here are 5 looking for [service]" |
| New Year (Jan) | "New year, new customers — 5 leads to start [year] strong" |
| Back to School (Aug-Sep) | "Families are settling in — here are 5 who need [service]" |
| Holiday season (Nov-Dec) | "Year-end rush: 5 customers looking for [service] before [holiday]" |
| Monday | "Monday motivation: 5 fresh leads for your week" |
| Friday | "Weekend reading: 5 customers who need [Business Name]" |

If a seasonal hook applies, use it in the subject line and opening. If not, use the standard LeadDrop format.

---

## Summary Dashboard

```
╔══════════════════════════════════════════════╗
║         FREE VALUE BLITZ — COMPLETE          ║
╠══════════════════════════════════════════════╣
║ Target:     [audience description]           ║
║ Mode:       [leaddrop/client/world]          ║
║ Assets:     [what was created]               ║
║                                              ║
║ DISTRIBUTION:                                ║
║ Emails:     [N] sent / [N] drafted           ║
║ Businesses: [N] received free value          ║
║ Leads:      [N] free leads delivered         ║
║ Audits:     [N] free audits included         ║
║                                              ║
║ VALUE DELIVERED:                             ║
║ Est. value per business: $[X,XXX]            ║
║ Total free value:        $[XX,XXX]           ║
║                                              ║
║ PIPELINE PROJECTION:                         ║
║ If 3% reply:  [N] conversations              ║
║ If 30% close: [N] clients x $200/mo          ║
║ Projected MRR increase: $[X,XXX]             ║
║                                              ║
║ Timing hook: [seasonal angle used or "none"] ║
╚══════════════════════════════════════════════╝
```

---

## Rules

1. **Free means free.** Every deliverable must be genuinely useful with zero strings attached. The email must make it clear there is no catch.
2. **Research before creating.** Phase 2 research drives Phase 3 creation. Never create generic value — always personalize based on actual data.
3. **Parallel agents for speed.** Split research and email creation into parallel batches.
4. **Supabase logging is mandatory.** Every outreach must be tracked for follow-up and pipeline management.
5. **Seasonal hooks are optional but powerful.** Only use them if they feel natural, not forced.
6. **Quality over quantity.** 50 deeply researched emails beat 200 generic ones. Each business should feel like we spent 30 minutes on them (even though the AI did it in seconds).
7. **0.5s sleep between Gmail sends.** Rate limiting protection.
8. **Check token expiry before bulk sends.** Refresh OAuth if needed.
9. **If a business has no website, skip it.** We need the website for research.
10. **Always offer drafts as the safe default.** Only send directly if the user explicitly confirms.

---

## Free Value Ideas Reference (for any industry)

When brainstorming what to give away, draw from this menu:

| Deliverable | Effort | Impact | Best For |
|-------------|--------|--------|----------|
| 5 researched leads | Medium | Very High | Any B2C/B2B business |
| AI business audit | Low | High | Businesses with websites |
| Competitive intel brief | Medium | Very High | Businesses in competitive markets |
| 7-day content calendar | Low | Medium | Businesses wanting social growth |
| Workflow automation assessment | Low | High | Businesses with manual processes |
| Review response templates | Very Low | Medium | Businesses with Google reviews |
| Email sequence templates | Low | Medium | Businesses doing email marketing |
| Local SEO checklist | Very Low | Medium | Businesses with Google Business Profile |
| Customer persona document | Medium | High | Businesses unsure of their ICP |
| Pricing analysis vs. competitors | Medium | Very High | Businesses in price-sensitive markets |

**The best free value is the one that makes the recipient say: "Wait, you did this for FREE?"**

*Run on demand: `/free-value-blitz [target]`*
*Pair with: `/compound` (to see what has been delivered so far)*
*Follow up with: `/follow-up` (3-7-14 day cadence)*
