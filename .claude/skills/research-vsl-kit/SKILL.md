---
name: research-vsl-kit
description: "Deep competitive research on any industry → VSL script → HTML presentation deck → email the complete kit to a recipient. Full sales asset pipeline."
argument-hint: "[industry] [recipient-email]"
---

# /research-vsl-kit — Competitive Research + VSL + Presentation Kit

You are a competitive intelligence researcher and sales asset creator. Given an industry/niche and a recipient email, you will:

1. Deep-research the top 5 players in that space
2. Create a 90-second VSL script
3. Build an HTML presentation deck for screensharing
4. Email the complete kit to the recipient

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com
**Calendly:** https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min

---

## Step 1: Parse Input

Extract from `$ARGUMENTS`:
- **Industry/niche** (required) — e.g., "online tutoring", "dental practices", "SaaS founders"
- **Recipient email** (required) — where to send the finished kit
- **Angle** (optional) — specific positioning or focus

If missing, ask the user.

---

## Step 2: Deep Competitive Research

Launch a **researcher agent** (read-only) to find the top 5 highest-earning independent players in the given industry. For EACH player, research:

1. Name, niche, background
2. Website/landing page URL
3. Business model (how they make money)
4. Pricing structure
5. Revenue estimates (public data)
6. Content strategy (platforms, frequency, formats)
7. Lead generation approach
8. Tech stack
9. Key differentiator

Also research:
- Market size and growth rate
- Trending niches within the industry
- Best-performing content formats
- Typical conversion funnel
- AI disruption impact

**Search queries to use:**
- "highest earning [industry] 2025 2026 revenue"
- "top independent [industry] businesses making millions"
- "[industry] business model breakdown successful"
- "[industry] YouTube TikTok content strategy"
- "[industry] landing page conversion"
- "[industry] market size growth 2025 2026"

Use Firecrawl to scrape at least 3 landing pages for detailed analysis.

Save research to `research/{slug}-intelligence-brief.md`

---

## Step 3: Create VSL Script

Save to `research/{slug}-vsl-script.md`

Write a 90-second VSL script (~220 words) using this structure:

### HOOK (0-10 sec)
Bold opening stat or contrast. E.g., "The best [practitioners] make $X. The average makes $Y. Same skill — different system."

### PROBLEM (10-25 sec)
Agitate the pain: trading time for money, referral-dependent, no marketing system, capped income.

### SOLUTION (25-50 sec)
Introduce the system. Reference what top players do differently (from the research).

### PROOF (50-70 sec)
Quick stats from the research — revenue numbers, subscriber counts, market growth.

### CTA (70-90 sec)
"I built the exact system that does this. Book 15 minutes and I'll show you what yours looks like."
- Calendly: https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min

Include `[SCREEN: ...]` cues for each section and delivery notes at the end.

---

## Step 4: Build HTML Presentation Deck

Save to `research/{slug}-vsl-deck.html`

Create a multi-slide HTML presentation for screensharing during the VSL recording:

**Design specs:**
- Dark theme (#0a0a1a background, white text)
- Each "slide" is a full-viewport section (100vh)
- Clean sans-serif fonts (Inter or system-ui)
- Accent color: #6C63FF (purple-blue)
- Smooth scroll navigation
- Navigation dots on right side
- Responsive (works on any screen size)

**Slides:**
1. **Title**: "[Industry], Automated" + compelling subtitle
2. **The Gap**: Average vs top earners — what's different?
3. **The Problem**: Pain points specific to this industry
4. **The System**: 3 pillars — Content Engine, Lead Funnel, Automated Outreach
5. **Case Studies**: Top 3-5 players from research with key stats
6. **The Market**: Market size, growth rate, AI opportunity
7. **What You Get**: Daily scripts, presentations, captions, posting
8. **CTA**: "Book 15 Minutes" with Calendly link

---

## Step 5: Email the Kit

Send everything to the recipient email via Gmail API.

### Email 1: Research Brief
- **Subject:** [Industry] Competitive Intelligence Brief — [Month Year]
- **Body:** Full HTML-formatted research brief (all 5 players, tables, trends, sources)

### Email 2: VSL Recording Kit
- **Subject:** Your [Industry] Growth System — VSL Script + Presentation Deck
- **Body:** HTML email containing:
  - Brief intro
  - Full VSL script (formatted)
  - Recording instructions (open deck in browser, start Loom, read script, advance slides)
  - Note: HTML deck attached as inline content or link
  - CTA to book call

### Gmail API Pattern
Extract OAuth from macOS Keychain, refresh token, send — all in single Bash call:
```bash
CREDS=$(security find-generic-password -s "hardened-google-workspace-mcp" -a "henry@agenticengineering.com" -w)
REFRESH_TOKEN=$(echo "$CREDS" | python3 -c "import sys,json; print(json.load(sys.stdin)['refresh_token'])")
# ... refresh access token, build email, send
```

0.5s sleep between sends. Check token expiry first.

---

## Step 6: Summary

Print completion dashboard:

```
+================================================+
|    RESEARCH + VSL KIT — COMPLETE               |
+=================================================+
| Industry:     [industry]                        |
| Recipient:    [email]                           |
| Players:      [N] researched                    |
|                                                 |
| DELIVERABLES:                                   |
| Research:     research/{slug}-intelligence-brief.md |
| VSL Script:   research/{slug}-vsl-script.md     |
| Deck:         research/{slug}-vsl-deck.html     |
| Emails Sent:  [2] to [recipient]                |
|                                                 |
| NEXT STEPS:                                     |
| 1. Recipient opens deck in browser              |
| 2. Records Loom with script                     |
| 3. Sends Loom link back                         |
| 4. Run /content to cross-post                   |
+=================================================+
```

---

## Efficiency Rules

1. **Use parallel agents** — researcher + VSL writer + deck builder can run simultaneously once research is done
2. **Firecrawl specific prompts** — include names, companies, data points wanted
3. **Gmail in single bash call** — env vars don't persist between calls
4. **0.5s between sends** — prevents rate limiting
5. **Save everything locally** — `research/` directory is the permanent archive
