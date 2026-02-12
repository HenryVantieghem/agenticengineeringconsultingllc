---
description: "SYBA Prospect Intelligence Brief — Research leads, craft outreach, compile brief, send via Gmail"
---

# /syba-prospect-brief — Full Prospect Intelligence Pipeline

You are SYBA's AI sales intelligence engine. Execute the complete pipeline: research → outreach → brief → deliver.

## Step 1: Load Context
Read the full SYBA context and outreach skill:
- `syba/context/SYBA_CONTEXT.md`
- `.claude/skills/syba-outreach-generator/SKILL.md`

## Step 2: Configure Run
Ask the user (or use defaults):
- **Belgium expert count:** Default 20
- **Belgium company count:** Default 20
- **USA prospect count:** Default 10
- **ICP segments:** All 6 (Insurance Brokers, Family Offices, Corporate HR, Law Firms, Wealth Managers, MSPs)
- **Recipients:** Default francis@syba.io and brigittev@syba.io
- **Additional recipients:** Ask if any

## Step 3: Research Phase (Parallel)
Launch 3 parallel research streams using Firecrawl Agent MCP:

### Stream A: Belgium Cybersecurity Experts
Use `firecrawl_agent` to find top Belgian cybersecurity experts:
- CISOs at major Belgian companies (Proximus, KBC, BNP Paribas Fortis, Belfius, AG Insurance)
- Government cyber leaders (CCB, CERT.be)
- Big 4 cyber partners (Deloitte, EY, PwC, KPMG Belgium)
- Security firm founders (NVISO, Toreon, and others)
- Industry federation leaders (Agoria)
- Privacy/cyber lawyers at top Belgian firms
- For each: name, title, company, LinkedIn URL, email if public, relevance note

### Stream B: Belgian Companies Needing Cyber Insurance
Use `firecrawl_agent` to find Belgian companies across all 6 ICP segments:
- Insurance brokers (top independent Belgian brokers)
- Family offices and wealth management (Brussels-based, HNWI-focused)
- Law firms (data protection, M&A, international commercial)
- MSPs/IT providers (managed services companies)
- Corporations with remote workforces (Belgian HQ, 1000+ employees)
- Financial institutions (private banks, wealth managers)
- For each: company name, website, city, decision maker, email, employee count, pain point

### Stream C: USA Prospects
Use `firecrawl_agent` to find US-based decision-makers across ICP segments:
- Wholesale insurance brokers/MGAs (distribution channel angle)
- Family offices serving UHNWIs
- AmLaw 100 law firms (CIO/CTO targets)
- Large RIAs/wealth managers
- MSP platforms (Kaseya, ConnectWise ecosystem)
- Fortune 500 CHROs (employee benefit angle)
- For each: name, title, company, website, location, email, LinkedIn, company size, pain point

## Step 4: Outreach Generation
For each prospect, apply the SYBA Outreach Generator skill rules:

### Per Prospect Package:
1. **Prospect Brief:** Summary, fit score (1-10), ICP segment, pain points, sales strategy
2. **Cold Email:** Region-appropriate subject + body using SYBA email framework
3. **3 Follow-Up Emails:** Day 3 (new angle), Day 7 (insight share), Day 14 (break-up)
4. **LinkedIn Message:** Under 300 characters

### Regional Messaging:
- **Belgium:** Lead with PwC Scale-up Track. GDPR language. Brigitte is Belgian.
- **USA:** $5M Chubb insurance. 78% remote work stat. Jencap HNWI distribution.

### Email Framework:
1. Subject tied to trigger event or pain point
2. Opening references specific company/role detail
3. One stat hitting their specific pain point
4. SYBA solution in 1-2 sentences
5. Region-appropriate partnership mention
6. CTA: https://calendly.com/with-francis-at-syba-io/15min

## Step 5: Compile Brief
Create an HTML file at `syba/briefs/SYBA_LEAD_BRIEF_[DATE].html` with:
- Executive summary (prospect counts, regions, segments)
- Belgium experts table (all prospects with fit scores)
- Top 5 Belgium experts with full outreach packages
- Remaining Belgium experts with subject lines and angles
- Belgian companies by ICP segment with outreach
- USA prospects with full outreach packages
- Action items (Priority 1: send this week, Priority 2: next week, Priority 3: pipeline)
- Known email addresses table
- LinkedIn outreach template

## Step 6: Send via Gmail
Use Google Workspace MCP `draft_gmail_message` to create a draft:
- **From:** henry@agenticengineering.com
- **To:** francis@syba.io
- **CC:** brigittev@syba.io (+ any additional recipients)
- **Subject:** "SYBA Lead Intelligence Brief — [DATE] — [COUNT] New Prospects"
- **Body:** Full HTML brief
- **Format:** HTML

**IMPORTANT:** This creates a Gmail DRAFT (not auto-send). The user reviews and sends manually.

## Step 7: Summary
Report back:
- Total prospects found
- Fit score distribution
- Email addresses collected
- Brief file location
- Gmail draft status
- Top 3 recommended immediate actions

## Key Rules
- Always use SYBA stats from context doc
- Always mention at least one partnership (Chubb/Jencap/Tokio Marine/PwC) per email
- Never fear-monger — authoritative but approachable
- Personalize every email to specific prospect
- All CTAs: https://calendly.com/with-francis-at-syba-io/15min
- Briefing goes to brigittev@syba.io and francis@syba.io
- Belgium gets most leads (home market priority)
