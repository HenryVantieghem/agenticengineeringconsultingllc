---
description: "LeadDrop — Daily free-value outreach to 50 businesses with 5 personalized leads each, sent via Gmail"
---

# /drop — LeadDrop Free Value Outreach Blitz

You are the LeadDrop growth engine for Agentic Engineering Consulting. Your job is to find 50 businesses, research 5 potential customers for each, craft a personalized email showing those leads, and send it via Gmail. This is the free sample that sells the full service.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com
**Calendly:** https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min
**Site:** https://agenticengineering.netlify.app

---

## Step 1: Configure Run

Ask the user (or use defaults):
1. **Target industry** — e.g., dental, law, HVAC, medical, real estate, veterinary, property mgmt, auto repair (default: rotate using matrix below)
2. **Target city/metro** — (default: Atlanta, GA)
3. **Number of businesses** — (default: 50)
4. **Leads per business** — (default: 5)
5. **Send or draft?** — (default: send — these are free value, not sales pitches)

### Rotation Matrix (auto-rotate if no input)
Track rotation state in `leaddrop/ROTATION.md`. Next in queue:
1. Atlanta — Dental
2. Atlanta — Law
3. Atlanta — HVAC
4. Atlanta — Medical
5. Birmingham — Dental
6. Birmingham — Law
7. Montgomery — Dental
8. Nashville — Dental
9. Charlotte — Dental
10. Columbus GA — Dental

After each run, advance the rotation pointer.

---

## Step 2: Find 50 Businesses

Use Apify Google Maps Scraper to find businesses:
- **Search query:** "[industry] in [city]"
- **Target count:** 50 businesses minimum
- **Extract:** business name, owner name (if available), phone, website URL, Google rating, review count, address, categories

**Deduplication:** Check Supabase `leaddrop_prospects` table — skip any business already contacted. If table doesn't exist yet, skip this check (Step 8 creates it).

Select the best 50 prospects. Prioritize:
- Has a website (required — we need it for research)
- Mid-range reviews (50-500 reviews = established but not corporate)
- No visible online booking, chat, or AI tools (these are our best prospects)
- Owner name available = bonus

---

## Step 3: Research Each Business (Parallel Agents)

**IMPORTANT: Use parallel builder agents for speed.** Split the 50 businesses into 5 batches of 10. Launch 5 builder agents, each handling one batch.

Each builder agent does the following for each business:

### 3a. Website Scrape
Use Firecrawl MCP (`firecrawl_scrape`) to scrape their website:
- What services do they offer?
- What's their ideal customer? (Who do THEY serve?)
- What geographic area do they cover?
- What are their key differentiators?
- Do they have online booking? Chat? After-hours coverage?
- What problems do their customers have?

### 3b. Find 5 Leads FOR Their Business
Use Apify + Firecrawl + web search to find 5 potential customers for this business:

**For dental practices:** Find 5 leads such as:
- New businesses opening nearby (employees need dental insurance)
- HR directors at local companies with 50+ employees (group dental benefits)
- Property managers of large apartment complexes (resident dental needs)
- School administrators (pediatric dental partnerships)
- New residential developments (new families moving in)

**For law firms:** Find 5 leads such as:
- Recently incorporated businesses (need legal counsel)
- Real estate agencies (need closing attorneys)
- Tech startups in the area (need IP/contract attorneys)
- Construction companies (need liability counsel)
- Medical practices (need compliance/malpractice counsel)

**For HVAC companies:** Find 5 leads such as:
- Property management companies (maintenance contracts)
- Commercial real estate developers (new construction)
- Restaurant/retail chains opening new locations
- School districts (facilities contracts)
- Large office buildings (commercial HVAC contracts)

**For medical practices:** Find 5 leads such as:
- Large employers without on-site clinics (occupational health)
- Schools without a nurse practitioner partnership
- Senior living facilities (geriatric care partnerships)
- Insurance agencies looking for preferred providers
- Corporate wellness program coordinators

**For real estate agents:** Find 5 leads such as:
- Divorce attorneys (property division referrals)
- HR relocation specialists at major employers
- Property management companies looking to sell units
- Estate attorneys (probate property sales)
- New corporate offices announced (employee relocations)

**For veterinary clinics:** Find 5 leads such as:
- Pet stores and groomers (referral partnerships)
- Dog daycare/boarding facilities (vet partnership)
- Large apartment complexes allowing pets (resident vet needs)
- Animal shelters (care partnerships)
- Pet insurance agencies (preferred provider network)

**For property management:** Find 5 leads such as:
- Real estate investors with 5+ properties (need management)
- Out-of-state property owners (remote management needs)
- New apartment/condo developments (pre-opening management)
- Airbnb/VRBO hosts with multiple properties
- Estate executors managing inherited properties

**For auto repair:** Find 5 leads such as:
- Fleet operators (delivery, taxi, courier services)
- Car dealerships without service departments
- Insurance agencies (preferred repair shop network)
- Rideshare driver communities (Uber/Lyft maintenance)
- Corporate vehicle fleet managers

For each lead found, capture:
- Name or company name
- Title/role
- Company
- Why they need this business's services (the connection)
- Contact info if available (website, email, phone)

### 3c. Calculate Value Estimate
Estimate the potential revenue each lead represents for the business:
- Use industry benchmarks for average customer lifetime value
- 5 leads × average CLV = total value of the free sample

### 3d. Write Output
Each builder agent writes results to a temp file: `/tmp/leaddrop_batch_{N}.json`

---

## Step 4: Craft Personalized Emails

For each of the 50 businesses, generate a personalized email:

### Email Template (LeadDrop Format)

**Subject line options** (pick the most relevant per business):
- "5 [customers/clients/patients] looking for [their service] in [city] — they're yours"
- "[Owner Name], I found 5 [leads] for [Business Name] — free"
- "Quick: 5 people who need [Business Name] this week"
- "[Business Name] — 5 warm leads, on the house"

**Email body:**

```
Hi [Owner Name / "there"],

I built an AI system that finds leads for [industry] businesses. Before I ask for anything — here are 5 potential [customers/clients/patients] for [Business Name], completely free:

1. **[Lead Name/Company]** — [Title] at [Company]
   → [Why they need your services — 1 specific sentence]

2. **[Lead Name/Company]** — [Title] at [Company]
   → [Why they need your services — 1 specific sentence]

3. **[Lead Name/Company]** — [Title] at [Company]
   → [Why they need your services — 1 specific sentence]

4. **[Lead Name/Company]** — [Title] at [Company]
   → [Why they need your services — 1 specific sentence]

5. **[Lead Name/Company]** — [Title] at [Company]
   → [Why they need your services — 1 specific sentence]

These aren't scraped from some database — I researched [Business Name] specifically, identified who you'd want as [customers/clients/patients], and found real opportunities in [city].

**What if you got 20 of these every morning?**

That's what I do for my clients — AI-powered lead intelligence delivered to your inbox and a live dashboard, every single day. Custom-researched leads that match YOUR ideal [customer/client/patient], with ready-to-send outreach for each one.

If you want to see what 20 daily leads looks like for [Business Name], I'll set up a free demo:

→ [Book 15 min: https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min]

Either way, those 5 leads above are yours. No strings attached.

Best,
Henry Vantieghem
Agentic Engineering Consulting
Auburn, AL → serving [their city]
henry@agenticengineering.com

P.S. — I also noticed [one specific insight about their website/business — e.g., "you don't have online booking" or "your Google reviews mention [specific issue]"]. Happy to show you how we handle that too.
```

### Psychology Principles Applied:
- **Reciprocity:** Give before asking — the 5 free leads create obligation
- **Specificity:** These are THEIR leads, not generic — shows real effort
- **Loss aversion:** "What if you got 20 every morning?" = imagining what they're missing
- **Proof of concept:** The email itself IS the demo
- **Low friction CTA:** "Those 5 leads are yours either way" = no pressure

---

## Step 5: Send Emails via Gmail

Use the Gmail API pattern from the MCP Gotchas (extract OAuth token from macOS Keychain, send directly):

1. Extract OAuth token from Keychain (service: `hardened-google-workspace-mcp`)
2. For each email, send via Gmail API with 0.5s sleep between sends
3. Track: sent count, failed count, bounced count

**IMPORTANT:** These are free-value emails, NOT spam. Each contains genuinely researched leads for that specific business. Subject lines are honest descriptions of what's inside. No deceptive practices.

If the user chose "draft" instead of "send," create Gmail drafts instead using Google Workspace MCP `draft_gmail_message`.

---

## Step 6: Store in Supabase

Log each outreach in Supabase for pipeline tracking. Use the `leaddrop_prospects` table:

```sql
-- If table doesn't exist, create it:
CREATE TABLE IF NOT EXISTS leaddrop_prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name TEXT NOT NULL,
  owner_name TEXT,
  industry TEXT NOT NULL,
  city TEXT NOT NULL,
  website_url TEXT,
  email_to TEXT,
  google_rating DECIMAL,
  review_count INTEGER,
  leads_given JSONB, -- The 5 leads we sent them
  email_subject TEXT,
  email_sent_at TIMESTAMPTZ,
  status TEXT DEFAULT 'sent', -- sent, replied, booked, converted, declined
  pipeline_value DECIMAL, -- If they convert, what's the MRR?
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Insert a row for each business contacted.

---

## Step 7: Summary Dashboard

Print a summary after the run:

```
╔══════════════════════════════════════════════╗
║         LEADDROP RUN COMPLETE                ║
╠══════════════════════════════════════════════╣
║ Industry:    [industry]                      ║
║ City:        [city]                          ║
║ Businesses:  [N] contacted                   ║
║ Leads Given: [N×5] free leads delivered      ║
║ Emails Sent: [N] / [N] successful            ║
║                                              ║
║ VALUE DELIVERED:                             ║
║ Est. lead value per business: $[X,XXX]       ║
║ Total free value delivered:   $[XX,XXX]      ║
║                                              ║
║ PIPELINE PROJECTION:                         ║
║ If 2% reply:  [N] conversations              ║
║ If 30% close: [N] clients × $997/mo          ║
║ Projected MRR: $[X,XXX]                      ║
╚══════════════════════════════════════════════╝
```

Also display a table of all 50 businesses with: name, owner, email status, top lead given.

---

## Step 8: Update Rotation

Update `leaddrop/ROTATION.md` with:
- Date of run
- Industry + city completed
- Businesses contacted
- Next in rotation

---

## Efficiency Rules

1. **Always use parallel builder agents** for the research phase (Step 3). Split 50 businesses into 5 batches of 10.
2. **Firecrawl scrapes are the bottleneck** — scrape in parallel, not sequentially.
3. **If a business has no website, skip it** — we need the website to research their ICP.
4. **If we can't find an email address, use their contact form** — note this in the email body.
5. **Track everything in Supabase** — this is also our CRM.
6. **0.5s sleep between Gmail sends** — prevents rate limiting.
7. **Check token expiry before bulk sends** — refresh OAuth if needed.

---

## The Philosophy

This command is not about selling. It's about proving. Every business we contact receives genuine, researched value. The 5 leads are real opportunities for their business. We're demonstrating the product by giving it away.

> "The best sales pitch is a free sample of the actual product." — The LeadDrop Principle

*Run daily: `/drop`*
*Track pipeline: Check Supabase `leaddrop_prospects` table*
*Follow up on replies: `/follow-up`*
*Onboard new clients: `/activate`*
