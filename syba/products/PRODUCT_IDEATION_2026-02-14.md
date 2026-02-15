# SYBA Product Development -- AI Agent Era Strategy

**Date:** 2026-02-14
**Author:** Henry Vantieghem, Agentic Engineering Consulting
**For:** Brigitte Vantieghem, SYBA.io
**Classification:** Internal / Strategic

---

## Executive Summary

SYBA's opportunity: become the cybersecurity company that protects not just families, but their AI agents too.

As AI agents proliferate -- enterprise deployments growing 300%+ year-over-year -- a massive gap exists in the market. Who insures and secures AI agents? No one. The category does not exist yet.

SYBA is uniquely positioned to own this category. The prevention-plus-insurance model that protects high-net-worth families today is the same model that will protect AI agent deployments tomorrow. The underwriting partnerships are in place (Chubb, Tokio Marine). The distribution channels are active (Jencap for HNWI, PwC Belgium Scale-up Track for enterprise credibility). The ICP segments -- insurance brokers, family offices, corporate HR, law firms, wealth managers, and MSPs -- are all deploying AI agents right now with zero security or insurance coverage.

This document outlines four products that take SYBA from "personal cybersecurity for families" to "the AI agent insurance company of the future" -- starting with a product that can ship today for zero cost.

**Current SYBA Products:**
- SYBA App (WiFi scanner, breach monitor)
- Router Security
- 24/7 Cyber Team
- Cyber Insurance ($5M coverage)
- Cybersecurity Training
- Desktop App

**Target ICP Segments (6):**
1. Insurance Brokers
2. Family Offices
3. Corporate HR
4. Law Firms
5. Wealth Managers
6. MSPs (Managed Service Providers)

---

## Product 1: SYBA Cyber Score

**Category:** Customer-Facing / Free Tool / Lead Magnet
**Priority:** SHIP IMMEDIATELY
**Cost to Build:** $0
**Time to Build:** 4 hours

### Overview

A free web-based tool where anyone can take a 2-minute cybersecurity assessment and receive a personalized "Cyber Score" from 0 to 100. The free tier shows the score and top three risks. The paid tier ($29/mo or bundled with a SYBA subscription) unlocks a detailed 20-page PDF report with remediation steps and quarterly re-assessments.

This is the single highest-leverage product SYBA can launch. It generates qualified leads from day one, costs nothing to operate, and gives every ICP segment a reason to engage with SYBA immediately.

### How It Works

**Step 1: User visits cyberscore.syba.io (or syba.io/cyber-score)**

**Step 2: User answers 15-20 questions across six categories:**

| Category | Example Questions | Weight |
|----------|------------------|--------|
| Home Network Security | WiFi password strength, router age, firmware update frequency, guest network enabled | 20% |
| Email Security | 2FA enabled on all accounts, breach history (checked via HaveIBeenPwned API), password manager usage, email encryption | 20% |
| Device Security | OS update cadence, antivirus/EDR installed, full-disk encryption enabled, biometric auth | 15% |
| Social Engineering Awareness | Deepfake recognition ability, phishing email identification, phone scam awareness, social media privacy settings | 15% |
| Financial Protection | Account monitoring active, credit freeze status, insurance coverage, transaction alerts enabled | 15% |
| Family Digital Hygiene | Children's device controls, shared account audit, family password sharing practices, IoT device inventory | 15% |

**Step 3: Instant Cyber Score (0-100) with letter grade (A through F)**

| Score | Grade | Risk Level | CTA |
|-------|-------|------------|-----|
| 90-100 | A | Excellent | "Great hygiene -- but are you insured? See SYBA Cyber Insurance." |
| 80-89 | B | Good | "You're doing well. Close the remaining gaps with SYBA Premium Report." |
| 60-79 | C | Fair | "You have real vulnerabilities. Unlock your full report to fix them." |
| 40-59 | D | Poor | "Your family is at significant risk. SYBA can protect you today." |
| 0-39 | F | Critical | "Immediate action needed. Talk to SYBA's Cyber Team now." |

**Step 4: Free tier receives:**
- Overall score and letter grade
- Top 3 risks identified (e.g., "Your router firmware is 3+ years old")
- Comparison to average score in their region/demographic
- Email capture required to see results

**Step 5: Paid tier ($29/mo) unlocks:**
- Full 20-page PDF report with all findings
- Category-by-category breakdown with specific remediation steps
- Priority-ranked action plan (fix these 5 things first)
- Quarterly automated re-assessments with trend tracking
- "Share your score" social card for viral distribution

### Tech Stack

| Component | Technology | Cost |
|-----------|-----------|------|
| Frontend | Static HTML/CSS/JS (SYBA dark theme, #e94560 accent) | $0 |
| Backend | Supabase (auth + assessment storage) | $0 (free tier) |
| Payments | Stripe Checkout ($29/mo subscription) | 2.9% + $0.30 per transaction |
| Deployment | Netlify | $0 (free tier) |
| Email | Supabase + Gmail API for drip sequences | $0 |
| Breach Check | HaveIBeenPwned API (optional, free tier available) | $0-$50/mo |
| Analytics | Supabase event tracking + Netlify Analytics | $0 |

**Total monthly cost to SYBA: $0** (Stripe takes a cut only on paid conversions)

### Revenue Model

| Tier | Price | Target |
|------|-------|--------|
| Free | $0 | Lead capture -- email required for score |
| Premium | $29/mo | Detailed reports + quarterly monitoring |
| Enterprise White-Label | $99/broker/mo | Insurance brokers offer to their own clients |
| Bundle | Included with SYBA subscription | Upsell from Cyber Score to full SYBA platform |

**Revenue projection (conservative):**
- Month 1: 500 free assessments, 25 premium conversions = $725/mo
- Month 6: 5,000 free assessments, 250 premium = $7,250/mo
- Month 12: 20,000 free assessments, 1,000 premium + 20 enterprise = $30,980/mo

### Lead Gen Flywheel

```
Score < 60  -->  "Your family is at risk"        -->  CTA: SYBA full platform
Score 60-80 -->  "Okay but you have gaps"        -->  CTA: Premium report ($29/mo)
Score 80+   -->  "Great hygiene, but insured?"    -->  CTA: SYBA Cyber Insurance ($5M)
```

Every single assessment is a qualified lead because:
1. They gave their email (required to see score)
2. They self-identified their risk level
3. They self-identified their category (questions reveal if they're HNWI, broker, etc.)
4. Their score determines the optimal sales conversation

**Viral mechanics:**
- Shareable score card: "I scored 73/100 on SYBA's Cyber Score. How do you compare?"
- Competitive element: families compare scores with each other
- Insurance brokers share with entire client book
- LinkedIn posts from thought leaders taking the assessment

### Why Build This First

1. Deployable in 1 day (static site + Supabase + Stripe)
2. Zero cost to SYBA (no hosting costs, no API costs)
3. Generates email list from day one
4. Every assessment is a qualified lead with self-identified risk profile
5. Insurance brokers can white-label it for their own client base
6. Creates content (scores generate social proof and discussion)
7. Demonstrates AI-powered product capability to investors
8. Data from assessments feeds into SYBA's risk models over time

---

## Product 2: SYBA Agent Shield

**Category:** AI Agent Cybersecurity + Insurance Product
**Priority:** BUILD Q1-Q2 2026
**Revenue Potential:** $50M+ ARR at scale

### Overview

The world's first cybersecurity plus insurance product specifically designed for AI agents. As companies deploy AI agents (Claude, GPT, custom LLMs) to handle business processes, those agents become attack vectors. No one is securing them. No one is insuring them. SYBA Agent Shield does both.

### The Problem

AI agents are being deployed at unprecedented speed across every industry:

| Problem | Impact | Who Feels It |
|---------|--------|-------------|
| AI agents have access to sensitive data (customer records, financial info, legal documents) | Data breach via agent exploitation | All 6 ICP segments |
| Prompt injection attacks can make agents leak data or take unauthorized actions | Unauthorized data exfiltration, financial fraud | Law Firms, Wealth Managers, Family Offices |
| No insurance product covers damages caused BY or TO AI agents | Uninsured liability gap | Insurance Brokers (they cannot sell what does not exist) |
| Enterprises deploying agents have zero visibility into agent security posture | Compliance violations, audit failures | Corporate HR, MSPs |
| EU AI Act and NIS2 require accountability for AI systems | Regulatory fines up to 7% of global turnover | All EU-operating companies |

The market gap is massive: companies are deploying AI agents today with the security posture of a 2005 web application. No authentication standards. No monitoring. No insurance. No accountability framework.

### Product Components

#### Component 1: Agent Security Assessment ($500 one-time per agent deployment)

An automated evaluation of AI agent configurations that produces a security report similar to a penetration test -- but for AI agents specifically.

**Assessment covers:**
- **Prompt injection vulnerability testing** -- Can the agent be tricked into leaking system prompts, executing unauthorized commands, or bypassing guardrails?
- **Data access permission audit** -- Does the agent follow least-privilege principles? Can it access data it should not?
- **Output filtering evaluation** -- Are agent outputs filtered for PII, credentials, or sensitive business data before reaching end users?
- **Tool/API access risk scoring** -- What tools does the agent have access to? What is the blast radius if compromised?
- **Authentication and authorization review** -- How is the agent authenticated? Can credentials be extracted?
- **Logging and audit trail verification** -- Are agent actions logged in a tamper-proof manner for compliance?

**Deliverable:** Agent Security Score (0-100) + detailed PDF report + remediation roadmap

#### Component 2: Runtime Monitoring Dashboard ($200/agent/month)

Real-time monitoring of deployed AI agents with alerting and compliance logging.

**Dashboard features:**
- **Anomaly detection** -- ML-based detection of unusual agent behavior (unexpected data access patterns, abnormal output volume, off-hours activity)
- **Data exfiltration alerts** -- Real-time detection when an agent attempts to send sensitive data to unauthorized destinations
- **Unauthorized tool usage alerts** -- Alerts when an agent calls tools or APIs outside its approved scope
- **Compliance logging** -- Immutable audit trail meeting NIS2 and EU AI Act requirements
- **Agent health metrics** -- Uptime, error rates, response latency, token usage anomalies
- **Incident response playbooks** -- Automated containment procedures when threats are detected

#### Component 3: Agent Insurance (First-of-Kind Coverage)

Insurance coverage specifically for AI agent deployments, underwritten by Chubb and Tokio Marine.

| Coverage Type | What It Covers | Premium Range |
|--------------|---------------|---------------|
| Agent Error Coverage | Damages caused by AI agent mistakes (incorrect financial advice, wrong legal research, faulty calculations) | $1,000-$5,000/yr |
| Data Breach Insurance | Costs from agent-related data leaks (notification, forensics, legal, regulatory fines) | $2,000-$10,000/yr |
| Business Interruption | Lost revenue when agent infrastructure fails or is compromised | $1,000-$5,000/yr |
| Cyber Extortion | Ransomware or threats targeting agent infrastructure specifically | $500-$3,000/yr |
| Regulatory Defense | Legal costs defending against EU AI Act or NIS2 enforcement actions | $1,000-$5,000/yr |

**Underwriting innovation:** SYBA's Agent Security Assessment score directly determines premium pricing. Higher security score = lower premium. This creates a flywheel: companies pay SYBA to improve their security, which lowers their SYBA insurance premium.

### ICP Mapping for Agent Shield

| ICP Segment | AI Agent Use Case | Risk Profile | Agent Shield Value |
|-------------|------------------|-------------|-------------------|
| Law Firms | Case research agents, client intake bots, document review AI | Privileged information leakage, malpractice liability | "If your AI agent leaks privileged client info, your firm is liable. Agent Shield covers that." |
| Wealth Managers | Portfolio communication agents, client reporting AI, market analysis bots | Fiduciary duty extends to AI tools, investment advice liability | "Your fiduciary duty doesn't stop at your AI agents. Agent Shield ensures it doesn't have to." |
| Family Offices | Personal affairs AI, estate planning agents, concierge bots | HNWI data exposure, identity theft via agent exploitation | "Your family's AI assistant knows everything. Agent Shield ensures no one else does." |
| MSPs | AI agents deployed for clients, automated IT management | Third-party liability, SLA compliance | "You're deploying AI agents for your clients. Who covers you when those agents fail?" |
| Insurance Brokers | Can SELL Agent Shield policies to their enterprise clients | New revenue stream, differentiated offering | "Your competitors can't offer AI agent insurance. You can." |
| Corporate HR | Recruitment AI, benefits administration, employee helpdesk bots | PII exposure, discrimination liability, GDPR/NIS2 compliance | "Your HR AI agent processes PII daily. Agent Shield monitors and insures every interaction." |

### Pricing Structure

| Package | Components | Price |
|---------|-----------|-------|
| Assessment Only | One-time security assessment per agent | $500 one-time |
| Monitor | Assessment + Runtime Monitoring | $200/agent/month |
| Shield | Assessment + Monitoring + Insurance | $5,000/year per organization |
| Enterprise | Custom assessment + monitoring + insurance + dedicated support | $10,000-$50,000/year |

### Go-to-Market Timeline

| Phase | Timeline | Deliverable |
|-------|----------|------------|
| Phase 1: Assessment Tool | Q1 2026 (NOW) | Free assessment for first 50 companies. Build the dataset. Prove the concept. |
| Phase 2: Monitoring Dashboard | Q2 2026 | Paid monitoring product. MRR begins. |
| Phase 3: Insurance Launch | Q3 2026 | Chubb/Tokio Marine underwritten Agent Insurance. Category creation moment. |
| Phase 4: Broker Distribution | Q4 2026 | Insurance brokers sell Agent Shield to their enterprise clients. Scale. |

### Marketing Messaging

**Headline:** "You insure your office. You insure your employees. Who insures your AI agents?"

**Subheadline:** "SYBA Agent Shield: The first cybersecurity + insurance product built for the AI agent era."

**Investor pitch:** "Every company will deploy AI agents. Every AI agent will need security and insurance. We're building the company that provides both."

---

## Product 3: SYBA Ops Agent

**Category:** Internal AI Agent for SYBA Team Operations
**Priority:** BUILD ALONGSIDE PRODUCTS 1 AND 2
**Impact:** 80% reduction in manual operational work

### Overview

A custom Claude Code agent built using the Anthropic Agent SDK that SYBA's team uses internally for daily operations. This agent automates lead research, content creation, compliance monitoring, and client onboarding -- replacing 80% of manual work currently done by Henry.

This is not a product SYBA sells. This is the engine that makes SYBA operate at 10x efficiency with a small team. It is also a powerful investor narrative: "We don't just sell cybersecurity for AI agents -- we ARE an AI-native company."

### Capability 1: Lead Intelligence Engine

**Daily automated workflow:**

1. **Scrape cybersecurity news** (Firecrawl MCP)
   - Monitor 20+ cybersecurity news sources daily
   - Identify breach announcements, regulatory updates, attack trends
   - Flag events that create sales triggers for each ICP segment

2. **Find decision-makers at target companies** (Apify MCP)
   - Search LinkedIn, company websites, industry directories
   - Identify CISOs, CIOs, GCs, CFOs, managing partners
   - Verify email addresses and phone numbers

3. **Score leads against ICP segments**
   - Apply scoring model: company size, industry, tech stack, recent events
   - Rank leads by likelihood to convert
   - Assign to appropriate ICP segment for tailored outreach

4. **Generate personalized outreach sequences**
   - Write custom emails referencing specific trigger events
   - Create LinkedIn connection request messages
   - Generate call scripts with company-specific talking points
   - Produce follow-up sequences (Day 1 / Day 3 / Day 7 / Day 14)

5. **Upload to Supabase dashboard**
   - All leads, scores, and outreach content synced to SYBA dashboard
   - Real-time pipeline visibility for SYBA team
   - Automated follow-up reminders

### Capability 2: Content Engine

**Automated content production:**

| Content Type | Frequency | Tools Used |
|-------------|-----------|-----------|
| LinkedIn posts (Brigitte's profile) | 3x/week | Claude + viral frameworks (PAS, AIDA, storytelling) |
| Marketing emails to prospect list | 2x/week | Claude + Gmail MCP |
| Blog posts / thought leadership | 1x/week | Claude + Firecrawl (research) |
| Video scripts | 1x/week | Claude + ElevenLabs (narration) + Kling AI (video) |
| Ad copy (LinkedIn, Google) | As needed | Claude + competitor research (Apify) |
| Case studies | Monthly | Claude + client data (Supabase) |

**Content calendar managed automatically.** Agent drafts content, Brigitte approves, agent posts.

### Capability 3: Compliance Monitor

**Continuous regulatory intelligence:**

- Track NIS2 updates and implementation timelines across EU member states
- Monitor EU AI Act enforcement actions and guidance documents
- Alert on relevant cyber incidents that create sales trigger events
- Watch competitor announcements (product launches, partnerships, funding)
- Generate weekly compliance briefings for SYBA clients
- Flag regulatory changes that affect insurance underwriting

### Capability 4: Client Onboarding Automation

**New client setup in under 15 minutes:**

1. Receive new client information (company name, URL, contacts, ICP segment)
2. Create branded client dashboard (white-label SYBA template)
3. Run initial lead research for client's target market
4. Generate first intelligence brief (50 qualified prospects)
5. Configure monitoring for client's industry and region
6. Create custom outreach templates tailored to client's ICP
7. Set up automated daily/weekly delivery schedule
8. Send welcome email with dashboard credentials and onboarding guide

### Tech Stack

| Component | Technology |
|-----------|-----------|
| Agent Framework | Claude Code Agent SDK (Anthropic) |
| Research | Firecrawl MCP (web scraping), Apify MCP (data extraction) |
| Data | Supabase MCP (read/write leads, briefs, client data) |
| Email | Gmail MCP (drafts + send), Google Workspace MCP |
| Content | ElevenLabs MCP (voice), Kling AI MCP (video), Remotion MCP (video editing) |
| Deployment | Runs as Claude Code custom agent on SYBA team machines |
| Scheduling | Daily cron via Claude Code commands (/syba-daily, /drop, /serve) |

### Why This Matters for SYBA

1. **Automates 80% of daily operations** that currently require manual work
2. **Scales from 1 client to 50+ without adding headcount** -- the agent does the work
3. **Creates a competitive moat** -- competitors need 20 people to do what SYBA does with 3
4. **Investor narrative** -- "SYBA is an AI-native cybersecurity company that uses AI agents to deliver cybersecurity for AI agents" (recursive competitive advantage)
5. **Proves the product** -- SYBA uses its own AI agent, so it deeply understands the security risks it insures

---

## Product 4: SYBA Partner Portal

**Category:** White-Label Platform for Insurance Brokers
**Priority:** BUILD Q2-Q3 2026
**Revenue Potential:** $500K+ ARR from broker channel alone

### Overview

A white-label version of the SYBA dashboard that insurance brokers can rebrand and offer to their own clients. Brokers get their own branded portal, their own Cyber Score tool, and earn commission on every SYBA subscription sold through their portal.

This turns SYBA's six ICP segments into distribution channels rather than just end customers. Insurance brokers alone represent access to thousands of HNWI families and enterprises.

### Features

| Feature | Description |
|---------|------------|
| Custom Branding | Broker's logo, colors, domain (portal.brokername.com) |
| Broker Cyber Score | White-labeled assessment tool with broker's branding |
| Client Management | Dashboard showing all broker's clients, their scores, subscription status |
| Commission Tracking | Real-time commission dashboard (20% on all SYBA subscriptions) |
| Co-Branded Materials | Marketing emails, PDFs, social media assets with broker + SYBA branding |
| CRM Integration | API hooks into broker's existing CRM (Salesforce, HubSpot, etc.) |
| Reporting | Monthly reports: new leads, conversions, revenue, client risk scores |
| Multi-User Access | Broker team members with role-based permissions |

### Revenue Model

| Revenue Stream | Price | Notes |
|---------------|-------|-------|
| Setup Fee | $2,500 one-time | Custom branding, domain setup, CRM integration |
| Monthly Platform Fee | $500/broker/month | Includes up to 100 clients |
| Additional Clients | $3/client/month | Over 100 clients |
| Broker Commission | 20% of SYBA subscriptions | Broker earns on every client they bring |

**Example broker economics:**
- Broker pays: $2,500 setup + $500/mo = $8,500 first year
- Broker brings 50 clients at avg $100/mo SYBA subscription = $60,000/yr revenue to SYBA
- Broker earns 20% commission = $12,000/yr
- SYBA net from one broker = $48,000/yr + $8,500 platform fees = $56,500/yr per broker

**At 50 brokers:** $2.8M ARR from partner channel alone.

### Go-to-Market

1. **Pilot with 3 brokers** -- Hand-pick from Jencap network, set up manually, gather feedback
2. **Automate onboarding** -- SYBA Ops Agent handles broker setup in under 1 hour
3. **Scale through Jencap** -- Leverage existing partnership to onboard broker network
4. **International expansion** -- PwC Belgium Scale-up Track provides EU broker introductions

---

## Competitive Positioning: The AI Agent Insurance Company of the Future

### Why SYBA Wins

| Advantage | Detail |
|-----------|--------|
| First-mover advantage | No company on Earth is offering AI agent insurance. SYBA creates the category. |
| Insurance DNA | Chubb + Tokio Marine backing gives instant underwriting credibility. No startup can replicate this. |
| Prevention + Insurance | The only company that prevents AND insures. Competitors do one or the other. |
| Jencap Distribution | Direct access to HNWI market through established insurance distribution channels. |
| PwC Recognition | Defence & Resilience validation from a Big Four firm. Enterprise trust signal. |
| AI-Native Operations | Uses AI agents internally to deliver cybersecurity services. Walks the talk. |
| Data Flywheel | Every Cyber Score assessment, every Agent Shield monitoring event feeds risk models that improve underwriting accuracy. |
| Regulatory Tailwinds | EU AI Act and NIS2 mandate exactly what SYBA provides: accountability, monitoring, and insurance for AI systems. |

### Competitive Landscape

| Competitor | What They Do | What They Don't Do |
|-----------|-------------|-------------------|
| Norton/McAfee | Consumer antivirus | No insurance, no AI agent security, no HNWI focus |
| Coalfire/Bishop Fox | Penetration testing | No insurance, no continuous monitoring, no family focus |
| Coalition (cyber insurance) | Cyber insurance for SMBs | No AI agent coverage, no prevention, no HNWI focus |
| Protect AI | AI/ML security tools | No insurance, no consumer product, enterprise-only |
| Robust Intelligence | AI model security | No insurance, no family/HNWI market, ML-focused only |

**SYBA's unique position:** The ONLY company at the intersection of personal cybersecurity, AI agent security, AND insurance -- with distribution partners already in place.

### 3-Year Vision

| Year | Milestone | Revenue Target |
|------|----------|---------------|
| 2026 | Launch Cyber Score (lead gen) + Agent Shield Assessment (revenue) + Partner Portal pilot | $500K ARR |
| 2027 | Agent Shield Insurance live with Chubb backing, 500+ enterprise clients, 50+ broker partners | $10M ARR |
| 2028 | Category leader for AI Agent Insurance, international expansion, IPO-ready | $50M ARR |

### What SYBA Should Tell Investors

> "We started by protecting families from cyber threats. Now we're protecting their AI agents too.
>
> In a world where every company will deploy AI agents, someone needs to insure those agents against errors, data leaks, and attacks. We're building that company -- with the only product that combines prevention, monitoring, AND insurance.
>
> Our underwriting partners (Chubb, Tokio Marine) are ready. Our distribution (Jencap, PwC) is in place. And our AI-native operations mean we can scale to 1,000 clients with a 10-person team.
>
> We're not asking whether AI agents need insurance. We're building the company that provides it before anyone else does."

---

## Immediate Action Plan: SYBA Cyber Score MVP -- Ship Today

This is the one product that can go live today for zero cost and start generating leads immediately.

### Build Sequence

| Step | Task | Time |
|------|------|------|
| 1 | Build quiz UI: 15-20 questions, dark theme (#0a0a0a bg, #e94560 accent), mobile-responsive | 1 hour |
| 2 | Implement scoring logic: weighted category scores, letter grade calculation, risk identification | 30 min |
| 3 | Build results page: score display, top 3 risks, CTA buttons, social share card | 30 min |
| 4 | Supabase schema: `cyber_scores` table (email, answers JSON, score, grade, created_at) | 15 min |
| 5 | Stripe Checkout integration: $29/mo premium subscription for full report access | 15 min |
| 6 | Deploy to Netlify (cyberscore.syba.io or syba.io/cyber-score) | 15 min |
| 7 | Test end-to-end: take assessment, verify score storage, test Stripe flow | 15 min |
| 8 | Send to SYBA team (Brigitte + Francis) for review and launch | 15 min |

**Total: 3-4 hours from start to live product.**

### Supabase Schema for Cyber Score

```sql
create table public.cyber_scores (
  id uuid default gen_random_uuid() primary key,
  email text not null,
  full_name text,
  answers jsonb not null,
  category_scores jsonb not null,
  total_score integer not null check (total_score >= 0 and total_score <= 100),
  letter_grade text not null check (letter_grade in ('A','B','C','D','F')),
  top_risks text[] not null,
  is_premium boolean default false,
  stripe_customer_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for email lookups
create index idx_cyber_scores_email on public.cyber_scores(email);

-- RLS: public insert (anyone can take assessment), restricted read
alter table public.cyber_scores enable row level security;

create policy "Anyone can insert scores"
  on public.cyber_scores for insert
  with check (true);

create policy "Users can read own scores"
  on public.cyber_scores for select
  using (email = current_setting('request.jwt.claims', true)::json->>'email');
```

### Assessment Questions (Draft)

**Category 1: Home Network Security (20%)**
1. How old is your WiFi router? (< 2 years / 2-5 years / 5+ years / I don't know)
2. Have you changed your WiFi password in the last 12 months? (Yes / No / I don't know)
3. Do you have a separate guest network for visitors? (Yes / No / I don't know)
4. Is your router firmware up to date? (Yes / No / I don't know)

**Category 2: Email Security (20%)**
5. Do you use two-factor authentication on your primary email? (Yes, app-based / Yes, SMS / No)
6. Do you use a password manager? (Yes / No, but unique passwords / No, I reuse passwords)
7. Have you ever been notified of a data breach involving your email? (Yes / No / I don't know)

**Category 3: Device Security (15%)**
8. How quickly do you install OS updates on your devices? (Same day / Within a week / Rarely / Never)
9. Do you use full-disk encryption on your laptop/desktop? (Yes / No / I don't know)
10. Do you have antivirus/endpoint protection on all devices? (Yes / Some / No)

**Category 4: Social Engineering Awareness (15%)**
11. Could you identify a deepfake video of a family member? (Confidently / Maybe / No / What is a deepfake?)
12. If you received an urgent email from your bank asking to verify your account, what would you do? (Call the bank directly / Click the link / Forward to IT / I don't know)
13. Do you share your location on social media in real-time? (Never / Sometimes / Often)

**Category 5: Financial Protection (15%)**
14. Do you have active monitoring on your financial accounts? (Yes, real-time alerts / Yes, monthly review / No)
15. Do you have cyber insurance? (Yes / No / I don't know what that is)
16. Have you placed a credit freeze with all three bureaus? (Yes / No / What is a credit freeze?)

**Category 6: Family Digital Hygiene (15%)**
17. Do you have parental controls on your children's devices? (Yes / No / Not applicable)
18. Do you share streaming/service account passwords with others outside your household? (Yes / No)
19. Do you have an inventory of all connected devices in your home? (Yes / Roughly / No)
20. Does your family have an agreed-upon plan for responding to a cyber incident? (Yes / No)

### Scoring Logic

```
Each answer maps to 0-10 points.
Category score = sum of question scores in category / max possible in category * 100
Total score = weighted average of category scores (weights defined above)
Letter grade: A (90-100), B (80-89), C (60-79), D (40-59), F (0-39)
Top risks = lowest-scoring categories, presented as actionable insights
```

### Post-Launch Metrics to Track

| Metric | Target (Month 1) |
|--------|-----------------|
| Assessments completed | 500 |
| Email addresses captured | 500 |
| Premium conversions ($29/mo) | 25 (5% conversion) |
| Average Cyber Score | 55-65 (most people score poorly = strong CTA) |
| Social shares | 50 |
| Broker white-label inquiries | 3 |

---

## Summary: The Four-Product Strategy

| # | Product | Type | Timeline | Revenue Model |
|---|---------|------|----------|--------------|
| 1 | SYBA Cyber Score | Free lead magnet + $29/mo premium | Ship today | Freemium + broker white-label |
| 2 | SYBA Agent Shield | AI agent cybersecurity + insurance | Q1-Q3 2026 | Assessment + monitoring + insurance |
| 3 | SYBA Ops Agent | Internal operations automation | Ongoing build | Cost savings (not revenue) |
| 4 | SYBA Partner Portal | White-label for insurance brokers | Q2-Q3 2026 | Platform fees + commissions |

**The narrative arc:**
1. Cyber Score proves SYBA can build and ship product fast (today)
2. Agent Shield positions SYBA as the category creator for AI agent insurance (Q2-Q3)
3. Ops Agent proves SYBA practices what it preaches -- AI-native operations (ongoing)
4. Partner Portal turns insurance brokers from customers into distribution partners (Q3-Q4)

**The end state:** SYBA is the company that protects families AND their AI agents, with the only product that combines prevention, monitoring, and insurance -- distributed through the world's largest insurance broker networks.

---

*Document prepared by Henry Vantieghem, Agentic Engineering Consulting*
*For: Brigitte Vantieghem, SYBA.io*
*Date: 2026-02-14*
*Version: 1.0*
