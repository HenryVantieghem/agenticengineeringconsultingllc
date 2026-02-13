---
description: "Activate a new client — scrape their website, auto-build context + dashboard + daily command, deploy everything in one shot"
---

# /activate — One-Shot Client Activation

You are the Agentic Engineering client activation agent. Given a business URL and basic info, you build their entire lead intelligence system: context, dashboard, database, daily command, first lead batch, and deployment. One command, zero-to-live.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com
**Supabase Project:** wghzabtkmntpclynntpp

---

## Step 1: Gather Minimum Input

Ask the user for ONLY what can't be auto-detected:
1. **Website URL** — (required) their business website
2. **Contact email** — (required) who gets the daily briefing
3. **Pricing tier** — Starter ($497/mo) / Growth ($997/mo) / Premium ($1,497/mo)

Everything else gets auto-detected from their website. Ask the user to confirm the auto-detected values before proceeding.

---

## Step 2: Deep Website Intelligence

Use Firecrawl MCP (`firecrawl_scrape`) to deeply analyze their website. Extract:

### Business Identity
- **Business name** — from title tag, logo, about page
- **Industry** — inferred from services, content, keywords
- **Location** — from address, footer, contact page, Google Maps embed
- **Phone** — from contact page or header
- **Owner/founder name** — from about page, team page
- **Founded year** — if available
- **Slug** — auto-generate from business name (lowercase, hyphens, no spaces)

### Brand
- **Primary color** — extract from CSS, header, buttons (hex code)
- **Secondary color** — extract from accents, links
- **Logo URL** — if findable on the page
- **Tone** — professional, friendly, technical, casual (inferred from copy)

### Services & ICP
- **Services offered** — full list from services page
- **Target customers** — who do THEY serve? (their ICP)
- **Geographic coverage** — local, regional, national, international
- **Differentiators** — what makes them unique (from about/why-us pages)
- **Pain points they solve** — for their customers

### Current Gaps (for our value prop)
- **Has online booking?** — Yes/No
- **Has chat widget?** — Yes/No
- **Has lead capture form?** — Yes/No
- **Has after-hours info?** — Yes/No
- **Has blog/content marketing?** — Yes/No
- **Has testimonials/reviews?** — Yes/No
- **Mobile responsive?** — Yes/No

### Competitive Intelligence
Use Firecrawl search to find 3-5 competitors in their area and industry. For each:
- Competitor name, website, rating
- What they do differently
- Gaps the client could exploit

### Print Auto-Detected Summary
Show the user everything detected and ask for confirmation:

```
AUTO-DETECTED CLIENT PROFILE
═══════════════════════════════════
Business:    [name]
Slug:        [slug]
Industry:    [industry]
Location:    [city, state]
Owner:       [name]
Phone:       [phone]
Brand Color: [hex] ██████
Services:    [list]
ICP:         [who they serve]
Coverage:    [geographic]

GAPS DETECTED:
☐ No online booking
☐ No chat widget
☒ Has contact form
☐ No after-hours coverage

Confirm? (or provide corrections)
```

---

## Step 3: Generate Client Context Document

Write `clients/{slug}/context/{SLUG}_CONTEXT.md` with:

```markdown
# {Name} — Client Context Document
Generated: {date} | Industry: {industry} | Tier: {tier}

## Company Overview
{3-5 sentences from website analysis}

## Services
{Bulleted list of all services}

## Ideal Customer Profile (ICP)
{Who THEIR customers are — the leads we'll find for them}

### ICP Segments (auto-generated from industry analysis)
{For each segment:}
- **Segment Name**
  - Titles: {decision-maker titles}
  - Pain points: {why they need this client's services}
  - Hooks: {messaging angles}
  - Search queries: {how to find these leads via Apify/Firecrawl}

## Target Regions
{Geographic areas based on their coverage}
- Primary: {city/metro} — {lead allocation}
- Secondary: {expanded area} — {lead allocation}

## Competitive Landscape
{Top 3-5 competitors with differentiators}

## Messaging Guidelines
- Tone: {detected tone}
- Key differentiators to emphasize: {from website}
- Stats/proof points: {from website, reviews}
- Avoid: {generic claims, competitor bashing}

## Calendly / CTA
{Use Henry's Calendly for now, switch to client's if they have one}

## Dashboard Access
- URL: {slug}-leads.netlify.app
- Users: {contact email}
```

---

## Step 4: Create Supabase Records

### 4a. Insert Client
Use Supabase MCP (`execute_sql`) to insert the client:

```sql
INSERT INTO clients (slug, name, industry, accent_color, recipients, calendly_url, context)
VALUES (
  '{slug}',
  '{name}',
  '{industry}',
  '{hex_color}',
  ARRAY['{email}'],
  'https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min',
  '{context_json}'
)
RETURNING id;
```

Save the returned `id` as `client_id`.

### 4b. Create Auth User
Create a Supabase auth user for the client contact:

```bash
curl -X POST "https://wghzabtkmntpclynntpp.supabase.co/auth/v1/signup" \
  -H "apikey: {SUPABASE_ANON_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "{contact_email}",
    "password": "{auto_generated_password}",
    "data": {"client_id": "{slug}"}
  }'
```

**Password rules:** 12+ chars, alphanumeric + special (no `!` — causes JSON parse issues). Generate a memorable password like `{Slug}Leads2026#`.

---

## Step 5: Customize & Deploy Dashboard

### 5a. Copy Template
Copy all files from `clients/template/` to `clients/{slug}/`.

### 5b. Customize Config
Edit `clients/{slug}/js/config.js` — replace placeholders:
- `{{SLUG}}` → client slug
- `{{NAME}}` → client name
- `{{COLOR}}` → accent color hex
- `{{ANON_KEY}}` → Supabase anon key (from .env)

### 5c. Customize HTML (Optional)
If brand colors were detected, update CSS custom properties in the dashboard HTML to match the client's brand.

### 5d. Deploy to Netlify
Use Netlify MCP to deploy `clients/{slug}/` as a new Netlify site:
- Site name: `{slug}-leads`
- Resulting URL: `https://{slug}-leads.netlify.app`

**Note:** Use `netlify api createSite --data '{"body":{"name":"{slug}-leads"}}'` to avoid the interactive team selection prompt.

---

## Step 6: Generate Daily Command

Write `.claude/commands/serve-{slug}.md`:

```markdown
---
description: "{Name} daily lead intelligence — 20 leads + outreach + dashboard update"
---

# /serve-{slug} — {Name} Daily Lead Intelligence

You are {Name}'s AI lead intelligence agent. Find 20 qualified leads, research each, generate outreach, update the dashboard, and email a briefing.

## Context
Read the client context: `clients/{slug}/context/{SLUG}_CONTEXT.md`
Client ID: {client_id} (Supabase UUID)
Dashboard: https://{slug}-leads.netlify.app
Recipients: {emails}

## Step 1: Load Context & Check State
Read the context doc. Check Supabase for existing leads to avoid duplicates:
`SELECT company FROM leads WHERE client_id = '{client_id}' AND created_date = CURRENT_DATE`

## Step 2: Find 20 Leads
Use Apify + Firecrawl to find 20 leads matching the ICP segments in the context doc.

### Lead Sources by Segment:
{Auto-generated from ICP analysis — specific Apify actors and Firecrawl searches per segment}

For each lead, capture:
- first_name, last_name, email, title, company
- region, icp_segment, website_url, source
- fit_score (1-10), phone, linkedin_url

## Step 3: Deep Research + Outreach
For each lead:
1. Firecrawl scrape their company website
2. Web search for recent news
3. Generate: prospect_brief, cold_email, followup_day3/7/14
4. Store lead + outreach_package in Supabase

## Step 4: Compile Briefing
Create HTML briefing with: executive summary, top 10 leads, full lead table, action items.
Store in Supabase `briefings` table.

## Step 5: Email Briefing
Use Google Workspace MCP to draft email:
- To: {emails}
- Subject: "{Name} Daily Leads — [DATE] — [COUNT] New Leads"
- Body: Full HTML briefing

## Step 6: Summary
Print: leads found, avg fit score, dashboard link, draft status.

## Rules
- Creates DRAFTS for outreach (client sends manually or auto-send if Premium tier)
- Use messaging from context doc
- Include Calendly in CTAs
- Score each prospect 1-10
```

**IMPORTANT:** The generated command must be customized to the specific industry. Don't just use generic ICP segments — use the ones extracted from their website in Step 2.

---

## Step 7: Generate Outreach Skill

Write `.claude/skills/{slug}-outreach-generator/SKILL.md`:

```markdown
---
name: "{slug}-outreach-generator"
description: "Generate outreach packages for {Name} — personalized to their ICP, services, and brand voice"
invokable: true
---

# {Name} Outreach Generator

{Auto-generated outreach skill based on their industry, ICP, services, and brand voice.
Follow the same structure as the SYBA outreach generator but customized for this client.}
```

---

## Step 8: Run First Lead Batch (Welcome Gift)

Immediately execute the newly created `/serve-{slug}` command logic to deliver the first batch of 20 leads. This serves as:
1. Proof the system works
2. Immediate value delivery
3. Dashboard population so they see real data on first login

---

## Step 9: Send Welcome Email

Use Google Workspace MCP to draft a welcome email to the client:

**To:** {contact_email}
**Subject:** "Your AI Lead Engine is Live — {Name}"
**Body:**

```html
Hi {owner_name},

Your personalized AI lead intelligence system is live. Here's everything you need:

🔗 YOUR DASHBOARD
{slug}-leads.netlify.app
Login: {email} / {password}

📊 WHAT'S ALREADY THERE
I just ran your first batch — 20 researched leads are waiting in your dashboard right now.

📅 WHAT HAPPENS DAILY
Every morning, your system finds 20 new leads matching your ideal customer profile, researches each one, and delivers:
- Full prospect intelligence briefs
- Ready-to-send outreach emails
- Follow-up sequences (Day 3, 7, 14)
- Everything searchable in your dashboard

🎯 YOUR FIRST ACTION
Log into your dashboard, review the top 10 leads, and send the first 3 outreach emails today.

Questions? Reply to this email or book time:
https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min

— Henry
Agentic Engineering Consulting
```

---

## Step 10: Activation Summary

Print the complete activation report:

```
╔══════════════════════════════════════════════════╗
║         CLIENT ACTIVATED SUCCESSFULLY            ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║ Client:      {name}                              ║
║ Slug:        {slug}                              ║
║ Industry:    {industry}                          ║
║ Tier:        {tier} (${price}/mo)                ║
║ Client ID:   {uuid}                              ║
║                                                  ║
║ CREATED:                                         ║
║ ✓ Context doc   clients/{slug}/context/          ║
║ ✓ Dashboard     {slug}-leads.netlify.app         ║
║ ✓ Supabase      client + auth user               ║
║ ✓ Daily command /serve-{slug}                    ║
║ ✓ Outreach skill /{slug}-outreach-generator      ║
║ ✓ First batch   20 leads delivered               ║
║ ✓ Welcome email drafted in Gmail                 ║
║                                                  ║
║ LOGIN:                                           ║
║ URL:      {slug}-leads.netlify.app               ║
║ Email:    {contact_email}                        ║
║ Password: {generated_password}                   ║
║                                                  ║
║ NEXT STEPS:                                      ║
║ 1. Review & send welcome email from Gmail        ║
║ 2. Run /serve-{slug} daily                       ║
║ 3. Schedule follow-ups with /follow-up           ║
╚══════════════════════════════════════════════════╝
```

---

## Key Differences from /setup-client

| Feature | /setup-client | /activate |
|---------|--------------|-----------|
| Input required | 8 manual questions | URL + email only |
| Context generation | Manual | Auto-scraped from website |
| ICP segments | User provides | Auto-detected from industry |
| Brand colors | User provides | Auto-extracted from CSS |
| First lead batch | Not included | 20 leads on activation |
| Welcome email | Not included | Auto-drafted |
| Competitor intel | Not included | Auto-researched |
| Time to live | 15-20 min | 10-15 min |

*Activate a new client: `/activate`*
*Run their daily leads: `/serve-{slug}`*
*Track all clients: Check Supabase `clients` table*
