---
description: "SYBA Daily Lead Intelligence — Find leads, generate outreach, store in Supabase, email briefing to Brigitte & Francis"
---

# /syba-daily — SYBA Daily Lead Intelligence Engine

You are SYBA's daily lead generation agent. Your job is to find 40 qualified leads, generate personalized outreach for each, store everything in Supabase, and email a briefing to the SYBA team.

## Step 1: Load Context
Read the SYBA context document: `syba/context/SYBA_CONTEXT.md`

Also read the Supabase config from .env:
- SUPABASE_URL=https://wghzabtkmntpclynntpp.supabase.co
- SUPABASE_ANON_KEY (from .env)

Get the SYBA client_id by querying Supabase: `SELECT id FROM clients WHERE slug = 'syba'`

## Step 2: Detect Trigger Events
Use Firecrawl MCP to search today's cybersecurity news:
- Search queries: "cybersecurity breach today", "ransomware attack 2026", "HNWI cyber attack", "GDPR NIS2 regulation update", "cyber insurance news"
- Extract the top 5 trigger events, each with:
  - event_summary: What happened
  - icp_segment: Which SYBA ICP this maps to
  - email_hook: How to use this in outreach
  - urgency_score: 1-10

Store each trigger event in Supabase `trigger_events` table with the SYBA client_id.

## Step 3: Lead Discovery (40 leads across 3 regions)

### Belgium (20 leads) — Home Market Priority
Use Firecrawl MCP + Apify MCP + web search to find decision-makers across all 6 ICP segments:
- Insurance Brokers: VP Sales, VP Distribution, Benefits Director at Belgian insurance firms
- Family Offices: COO, CTO at Belgian family offices and wealth management firms
- Corporate HR: CHRO, VP Benefits at Belgian enterprises (500+ employees)
- Law Firms: Managing Partner, CIO at Belgian law firms
- Wealth Managers: Chief Compliance Officer, Wealth Manager at Belgian financial advisors
- MSPs: CEO, VP Sales at Belgian managed service providers

### Europe ex-Belgium (10 leads)
Countries: Netherlands, France, Germany, UK, Luxembourg, Switzerland, Ireland
Same ICP segments, focus on GDPR/NIS2 angle

### USA (10 leads)
Focus on: Chubb $5M insurance angle, Jencap HNWI distribution
Same ICP segments, ROI-focused messaging

For each lead found, capture:
- first_name, last_name, email (if findable), title, company, region, icp_segment
- website_url, source (where you found them)
- fit_score (1-10 based on ICP alignment + trigger event relevance)

## Step 4: Deep Research + Outreach Generation (per lead)
For each of the 40 leads:

1. Use Firecrawl MCP to scrape their company website
2. Use web search for recent news, LinkedIn activity, cyber incidents about their company
3. Generate a full outreach package following the SYBA Outreach Generator skill format:

```json
{
  "prospect_brief": {"summary": "...", "fit_score": N, "icp_segment": "...", "pain_points": [...], "sales_strategy": "..."},
  "cold_email": {"subject": "...", "body": "..."},
  "followup_day3": {"subject": "...", "body": "..."},
  "followup_day7": {"subject": "...", "body": "..."},
  "followup_day14": {"subject": "...", "body": "..."},
  "sales_script": {"opening_hook": "...", "discovery_questions": [...], "pitch": "...", "objection_handles": [...], "close": "..."},
  "linkedin_message": "Under 300 chars"
}
```

4. Apply regional messaging rules:
   - Belgium: PwC Scale-up Track, GDPR language, Brigitte is Belgian
   - Europe: Tokio Marine/Chubb credibility, GDPR angle, NIS2
   - USA: $5M Chubb insurance, 78% remote work stat, Jencap HNWI distribution

5. Store in Supabase:
   - Insert lead row in `leads` table
   - Insert outreach_package row in `outreach_packages` table (linked to lead_id)

## Step 5: Compile Master Briefing
Create a comprehensive HTML briefing email containing:

1. **Executive Summary:**
   - Date, total leads found, regions covered
   - Top trigger events of the day

2. **TOP 10 HIGHEST-FIT PROSPECTS:**
   - Detailed cards for the 10 highest fit_score leads
   - Each with: name, company, title, region, fit score, ready-to-send email draft

3. **Regional Lead Tables:**
   - Belgium (20 leads): Name | Company | Title | Fit Score | ICP | Email Subject
   - Europe (10 leads): Same format
   - USA (10 leads): Same format

4. **Today's Trigger Events:**
   - 5 events with conversation openers for each

5. **Action Items for Brigitte & Francis**

Store the briefing in Supabase `briefings` table.

## Step 6: Email Briefing
Use Google Workspace MCP (`draft_gmail_message`) to create a Gmail draft:
- To: brigittev@syba.io, francis@syba.io
- Subject: "SYBA Daily Lead Intelligence — [TODAY'S DATE] — [COUNT] New Leads"
- Body: The full HTML briefing from Step 5

## Step 7: Summary Output
Print a summary:
- Total leads found (by region)
- Average fit score
- Top trigger events
- Dashboard link: https://syba-leads.netlify.app
- Gmail draft status

## Important Rules
- This does NOT auto-send emails to leads — it creates DRAFTS for Brigitte & Francis
- Always use region-appropriate messaging (Belgium/Europe/USA rules from context)
- Include Calendly link in all email CTAs: https://calendly.com/with-francis-at-syba-io/15min
- Score each prospect 1-10 on SYBA fit
- Belgium gets 20 leads (home market priority), Europe and USA get 10 each
- Use all available MCPs: Firecrawl for web scraping, Apify for lead enrichment, Google Workspace for email drafts
