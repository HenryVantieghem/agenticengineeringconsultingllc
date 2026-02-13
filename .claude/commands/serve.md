---
description: "Serve a client — daily 20-lead intelligence, outreach generation, dashboard update, and email briefing"
argument-hint: "<client-slug>"
---

# /serve — Daily Client Lead Intelligence

You are the daily lead intelligence agent for Agentic Engineering Consulting clients. Given a client slug, you find 20 leads, research each, generate outreach, update their dashboard, and email a briefing. This runs daily for every paying client.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com

---

## Step 1: Load Client Context

### 1a. Identify Client
The client slug is provided as the argument: `$ARGUMENTS`

If no slug provided, list all active clients from Supabase:
```sql
SELECT slug, name, industry, accent_color, recipients FROM clients ORDER BY name;
```
Ask the user which client to serve.

### 1b. Load Context
Read the client context document: `clients/{slug}/context/{SLUG}_CONTEXT.md`

If the context file doesn't exist, check Supabase:
```sql
SELECT * FROM clients WHERE slug = '{slug}';
```

Extract from context:
- Client name, industry, location
- ICP segments with search strategies
- Target regions with lead allocation
- Messaging guidelines and tone
- Competitors to watch
- Calendly/CTA link
- Recipient emails

### 1c. Get Client ID
```sql
SELECT id FROM clients WHERE slug = '{slug}';
```

### 1d. Check Today's State
Avoid duplicate work:
```sql
SELECT COUNT(*) FROM leads WHERE client_id = '{client_id}' AND created_date = CURRENT_DATE;
```
If leads already exist for today, ask the user: "Found [N] leads already generated today. Generate more, or skip to briefing?"

---

## Step 2: Detect Trigger Events

Use Firecrawl MCP to search today's news relevant to the client's industry:
- Search 3-5 industry-specific queries based on the context doc
- Extract top 5 trigger events with: event_summary, icp_segment, email_hook, urgency_score (1-10)

Store in Supabase `trigger_events` table:
```sql
INSERT INTO trigger_events (client_id, event_summary, icp_segment, email_hook, urgency_score, event_date)
VALUES ('{client_id}', '...', '...', '...', N, CURRENT_DATE);
```

---

## Step 3: Lead Discovery (20 Leads)

Use the ICP segments from the context doc to find leads. Distribute across segments proportionally.

### Lead Sources by Industry Type

**For local service businesses (dental, HVAC, medical, vet, auto repair):**
- Use Apify Google Maps Scraper to find potential customers in their service area
- Use Firecrawl to search for businesses with matching needs
- Use web search for new businesses, relocations, construction permits
- Search for: companies hiring, expanding, opening new locations

**For professional services (law, real estate, property mgmt):**
- Use Apify LinkedIn Scraper for decision-makers matching ICP
- Use Firecrawl to research companies in relevant verticals
- Search for: recent incorporations, real estate transactions, permits filed

**For B2B/SaaS clients (like SYBA):**
- Use Firecrawl Agent for deep lead discovery across ICP segments
- Use Apify for enrichment (LinkedIn, company data)
- Search for: trigger events, industry news, regulatory changes

### For Each Lead, Capture:
- first_name, last_name, email (if findable)
- title, company, region, icp_segment
- website_url, source (where found)
- fit_score (1-10 based on ICP alignment + trigger relevance)
- phone, linkedin_url (if available)
- prospect_brief (3-4 sentence summary of why they're a fit)

---

## Step 4: Deep Research + Outreach Generation

For each of the 20 leads, generate a complete outreach package.

**Use parallel builder agents:** Split 20 leads into 4 batches of 5. Launch 4 builder agents.

Each builder does for each lead:

### 4a. Company Research
1. Firecrawl scrape their company website
2. Web search for recent news, social media, press releases
3. Extract: services, team size, recent milestones, potential pain points

### 4b. Outreach Package
Generate based on client's messaging guidelines from context doc:

```json
{
  "prospect_brief": {
    "summary": "3-4 sentences about the prospect",
    "fit_score": 8,
    "icp_segment": "segment name",
    "pain_points": ["point1", "point2", "point3"],
    "sales_strategy": "2-3 sentences"
  },
  "cold_email": {
    "subject": "Specific to prospect, never generic",
    "body": "Full email using client's framework"
  },
  "followup_day3": {
    "subject": "New angle",
    "body": "Full email"
  },
  "followup_day7": {
    "subject": "Insight share",
    "body": "Full email"
  },
  "followup_day14": {
    "subject": "Break-up with value",
    "body": "Full email"
  }
}
```

### 4c. Store in Supabase
Insert lead:
```sql
INSERT INTO leads (client_id, first_name, last_name, email, title, company,
  region, icp_segment, website_url, source, fit_score, phone, linkedin_url,
  prospect_brief, created_date)
VALUES (...);
```

Insert outreach package:
```sql
INSERT INTO outreach_packages (lead_id, client_id, email_subject, email_body,
  followup_1, followup_2, followup_3)
VALUES (...);
```

---

## Step 5: Compile Master Briefing

Create a comprehensive HTML briefing email:

### Briefing Structure:
1. **Executive Summary**
   - Date, client name, total leads, avg fit score
   - Top trigger events of the day

2. **TOP 5 HIGHEST-FIT LEADS**
   - Detailed cards for the 5 highest fit_score leads
   - Each with: name, company, title, fit score, ready-to-send email

3. **Full Lead Table**
   - All 20 leads: Name | Company | Title | Fit Score | ICP | Email Subject

4. **Today's Trigger Events**
   - 5 events with conversation openers

5. **Action Items**
   - Priority 1: Send outreach to top 5 today
   - Priority 2: Review remaining 15 leads
   - Priority 3: Follow up on previous leads (if any due)

6. **Dashboard Link**
   - Direct link to client dashboard

### Store Briefing
```sql
INSERT INTO briefings (client_id, title, content, content_html, created_date)
VALUES ('{client_id}', '{Name} Daily Leads — {date}', '{text_summary}', '{full_html}', CURRENT_DATE);
```

---

## Step 6: Email Briefing

Use Google Workspace MCP (`draft_gmail_message`) to create a Gmail draft:
- **From:** henry@agenticengineering.com
- **To:** {recipients from context doc}
- **Subject:** "{Name} Daily Leads — [DATE] — [COUNT] New Leads"
- **Body:** Full HTML briefing from Step 5
- **Format:** HTML

**For Premium tier clients:** After creating the draft, also send it using the Gmail API send pattern (extract OAuth token from Keychain).

**For Starter/Growth tier:** Draft only — Henry reviews and sends.

---

## Step 7: Summary Output

Print the daily summary:

```
╔══════════════════════════════════════════════╗
║   {NAME} — DAILY LEADS COMPLETE              ║
╠══════════════════════════════════════════════╣
║ Date:        {date}                          ║
║ Leads Found: {N}                             ║
║ Avg Fit:     {X.X}/10                        ║
║ Top Segment: {segment} ({N} leads)           ║
║                                              ║
║ TOP 3 LEADS:                                 ║
║ 1. {Name} — {Title} at {Company} (fit: {N})  ║
║ 2. {Name} — {Title} at {Company} (fit: {N})  ║
║ 3. {Name} — {Title} at {Company} (fit: {N})  ║
║                                              ║
║ DELIVERY:                                    ║
║ Dashboard: {slug}-leads.netlify.app ✓        ║
║ Email:     {draft/sent} ✓                    ║
║ Supabase:  {N} leads + {N} packages ✓       ║
║                                              ║
║ TRIGGER EVENTS:                              ║
║ • {event 1} (urgency: {N}/10)               ║
║ • {event 2} (urgency: {N}/10)               ║
╚══════════════════════════════════════════════╝
```

---

## Efficiency Rules

1. **Parallel builder agents for research** — Split 20 leads into 4 batches of 5
2. **Check for existing leads** — Don't duplicate today's work
3. **Firecrawl is the bottleneck** — Scrape in parallel batches
4. **Use trigger events in outreach** — Today's news makes emails timely
5. **0.5s sleep between sends** — If sending via Gmail API
6. **Store everything in Supabase** — Dashboard updates in real-time via Realtime
7. **Context doc is the source of truth** — All messaging comes from the client's context

---

## Serving Multiple Clients

To serve all active clients in one session, Henry can run:
```
/serve syba
/serve {client2}
/serve {client3}
```

Or ask Claude to query all clients and serve them sequentially:
```sql
SELECT slug FROM clients WHERE status = 'active' ORDER BY name;
```

---

## Tier-Based Features

| Feature | Starter ($497) | Growth ($997) | Premium ($1,497) |
|---------|---------------|---------------|------------------|
| Daily leads | 10 | 20 | 30 |
| Trigger events | 3 | 5 | 10 |
| Outreach emails | Subject only | Full email | Full + auto-send |
| Follow-up sequence | None | Day 3 only | Day 3, 7, 14 |
| Briefing delivery | Dashboard only | Dashboard + email | Dashboard + email + SMS |
| Competitor monitoring | None | Monthly | Weekly |

Adjust lead count and features based on the client's tier (stored in Supabase `clients` table).

*Serve a client: `/serve {slug}`*
*Activate a new client: `/activate`*
*Find new prospects: `/drop`*
