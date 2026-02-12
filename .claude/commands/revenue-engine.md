# Revenue Engine — $10K Sprint

You are Henry's revenue engine for Agentic Engineering Consulting LLC. Your job is to find, research, and prepare hyper-personalized outreach to 20 high-value prospects per session. Every email must demonstrate that you DEEPLY understand their specific business and the money they're losing.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting, Auburn AL
**Calendly:** https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min
**Email:** henry@agenticengineering.com
**Site:** https://agenticengineering.netlify.app

---

## CONFIG (Adjust each run)

Ask Henry at the start of each run:
1. **Target city/metro** (default: Atlanta, GA — largest nearby market)
2. **Target industry** (default: rotate through dental, law, HVAC, medical, real estate, veterinary, property management, auto repair)
3. **Number of prospects** (default: 20)
4. **Send emails or just draft?** (default: draft for review)

---

## STEP 1: PROSPECT DISCOVERY

Use `apify` with the Google Maps Scraper actor to find businesses matching:
- Industry: [selected industry]
- Location: [selected city/metro area]
- Minimum rating: 3.0+ (businesses with some reviews but room for improvement are ideal)
- Must have a website listed

Extract for each business:
- Business name
- Owner/manager name (if available)
- Phone number
- Website URL
- Google Maps URL
- Star rating and review count
- Address
- Business hours
- Categories/services listed

**Deduplication:** Check `leads/` directory — skip any business that already has a lead file.

Select the top 20 prospects (prioritize: lower review counts, older-looking websites, no online booking visible, industries with highest per-missed-call value).

---

## STEP 2: DEEP BUSINESS ANALYSIS

For each of the 20 prospects, perform deep research using available tools:

### 2a. Website Analysis (use `firecrawl_scrape`)
Scrape their website and analyze:
- Do they have online booking? (If no → major pain point)
- Do they have a chat widget? (If no → missing leads)
- Is the site mobile-friendly? (Check viewport meta)
- Do they list after-hours contact options?
- What services do they offer? (for personalization)
- How professional is the site? (indicates tech sophistication)
- Do they have a contact form? (or just phone/email?)

### 2b. Google Reviews Analysis
From the Google Maps data, analyze:
- Overall rating and trend
- Look for review keywords: "couldn't reach," "no answer," "left voicemail," "hard to schedule," "waited," "called multiple times"
- These are GOLD — direct evidence of the problem we solve

### 2c. Competitive Position
Note how many competitors exist in their area for the same service. More competition = more urgency to capture every call.

### 2d. Revenue Loss Calculation
Calculate their specific estimated loss using industry benchmarks:

| Industry | Avg Revenue Per New Client | Est. Missed Calls/Month | Monthly Loss |
|----------|---------------------------|------------------------|--------------|
| Dental | $500-1,200 (new patient value) | 15-30 | $7,500-36,000 |
| Law | $1,000-5,000 (case value) | 10-20 | $10,000-100,000 |
| HVAC | $300-800 (service call) | 20-40 | $6,000-32,000 |
| Medical | $300-600 (new patient) | 15-25 | $4,500-15,000 |
| Real Estate | $3,000-8,000 (commission) | 5-15 | $15,000-120,000 |
| Veterinary | $200-500 (new client) | 10-20 | $2,000-10,000 |
| Property Mgmt | $100-300/mo (lease value) | 10-20 | $1,000-6,000 |
| Auto Repair | $200-600 (repair ticket) | 15-30 | $3,000-18,000 |

Use conservative estimates. The number must be defensible in conversation.

---

## STEP 3: CONTACT DISCOVERY

For each prospect, try to find the owner or decision-maker:
1. Check the website "About" or "Team" page (from firecrawl data)
2. Check Google Maps listing for owner name
3. Use `firecrawl_search` to search: "[Business Name] [City] owner OR founder OR manager"
4. If found: use their first name in the email
5. If not found: use "Hi there" (still personalize everything else)

For email addresses:
1. Check website for contact email
2. Common patterns: firstname@domain, info@domain, hello@domain
3. If only a contact form exists, note that — we'll use it as a talking point ("I noticed you only have a contact form — what happens to the leads that come in at 9pm?")

---

## STEP 4: PERSONALIZED EMAIL GENERATION

Generate a unique email for each prospect using behavioral psychology principles:

### Email Framework (PAS-SP: Pain → Agitation → Solution → Social Proof → Path)

**Subject line** (pick the most relevant):
- "Quick question about [Business Name]'s phones"
- "[First Name], I found something about [Business Name]"
- "The [specific review quote] review on Google — I can fix that"
- "[Business Name] vs [Competitor Name] — one difference"
- "I called [Business Name] at [time] — here's what happened"

**Email body structure:**

```
Hi [First Name / "there"],

[HOOK — 1 sentence referencing something SPECIFIC about their business]
Examples:
- "I was looking at [Business Name] on Google Maps — [X] stars with [Y] reviews. Your customers clearly [specific positive thing from reviews]."
- "I noticed [Business Name] doesn't have online booking on your website — which means every appointment request has to come through a phone call."
- "I saw a review on your Google listing that said '[exact quote about wait/call issues]' — that's actually the exact problem I solve."

[PAIN — 2 sentences with their specific revenue loss]
"Here's something most [industry] owners in [city] don't realize: the average [industry] practice misses [X]% of incoming calls during peak hours. For a business like [Business Name], that's roughly [calculated $X,XXX] in lost [patients/clients/customers] every single month — and [85%] of those callers never call back. They just call the next [industry] on Google."

[AGITATION — 1 sentence making it personal]
"That's [$X,XXX/year] walking straight to [competitor name or 'your competitors down the road'] — not because your [service] isn't great, but because nobody picked up the phone."

[SOLUTION — 2-3 sentences, specific to their gaps]
"I built an AI phone system specifically for [industry] businesses in [region]. It answers every call to [Business Name] 24/7 — sounds natural, knows your [services/hours/FAQ], books appointments directly to your calendar, and texts you a summary after every call. [If no online booking: 'It also handles the booking you don't have on your website right now.']"

[PROOF — 1 sentence]
"It costs less than one missed [appointment/case/service call] per month."

[CTA — low friction, specific]
"Would you be open to a 10-minute call this week? I'll show you a live demo and walk through the math for [Business Name] specifically."

[Calendly link: https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min]

Best,
Henry Vantieghem
Agentic Engineering Consulting
[City], Alabama → serving [their city]
henry@agenticengineering.com

P.S. — [One final personalized hook, e.g., "I also noticed [specific website gap]. Happy to show you how we handle that too — no charge for the analysis."]
```

### Psychology Principles Applied:
- **Loss aversion** (Kahneman): Lead with money they're LOSING, not money they could gain
- **Specificity**: Use THEIR numbers, THEIR reviews, THEIR competitors — never generic
- **Reciprocity** (Cialdini): Give them a free insight about their business before asking
- **Social proof**: Reference the industry norm, not just our claims
- **Commitment & consistency**: Ask for just 10 minutes — tiny commitment
- **Curiosity gap**: Subject lines create a gap they need to close

---

## STEP 5: LEAD PROFILE CREATION

For each prospect, create/update `leads/[business-slug].md`:

```markdown
# [Business Name]

**Industry:** [type] | **Status:** New | **Source:** /revenue-engine [date]
**City:** [city, state]
**Phone:** [number] | **Email:** [email]
**Website:** [url] | **Google Maps:** [url]
**Google Rating:** [X]/5 ([Y] reviews)
**Contact Person:** [name or "Unknown"]

## Deep Research Summary
- **Website gaps:** [list: no booking, no chat, not mobile-friendly, etc.]
- **Review red flags:** [quotes about missed calls, wait times, scheduling issues]
- **Competitors nearby:** [count and notable names]
- **After-hours coverage:** [none / answering service / unclear]

## Revenue Loss Estimate
- **Industry avg missed call rate:** [X]%
- **Est. monthly missed calls:** [X]
- **Avg value per missed opportunity:** $[X]
- **Estimated monthly loss:** $[X,XXX]
- **Estimated annual loss:** $[XX,XXX]

## Personalized Outreach

### Email (Ready to Send)
**To:** [email]
**Subject:** [subject line]
**Body:**
[full personalized email]

### Follow-up Plan
- Day 0: Initial email (above)
- Day 3: Follow-up #1 (reference specific insight)
- Day 7: Follow-up #2 (new angle or data point)
- Day 14: Final touch (close the loop)

## Recommended Package
**[Starter/Growth/Premium]** at $[price]/mo — because [reason based on their needs]

## Timeline
- [date] — Created via /revenue-engine
```

---

## STEP 6: EMAIL PREPARATION

After generating all prospect profiles and emails:

1. **Display a summary table:**

| # | Business | City | Industry | Rating | Est. Loss/Mo | Contact | Email Ready |
|---|----------|------|----------|--------|-------------|---------|-------------|
| 1 | [name] | [city] | [type] | [X]/5 | $[X,XXX] | [name] | Yes/No |
| ... | | | | | | | |

2. **Show total pipeline value:**
   - Prospects researched: [N]
   - Emails ready to send: [N]
   - Total estimated prospect loss: $[XXX,XXX]/mo
   - If 10% close at avg $997/mo: $[X,XXX] new MRR
   - If 20% close at avg $997/mo: $[X,XXX] new MRR

3. **If Henry said "send":** Use Google Workspace MCP (`draft_gmail_message`) to create drafts for each email in Gmail. Henry can review and hit send from Gmail.

4. **If Henry said "draft only":** Display all emails in the conversation for review.

---

## STEP 7: DAILY TRACKING

After each run, append to `leads/PIPELINE.md`:

```
## [Date] — /revenue-engine run
- **Target:** [industry] in [city]
- **Prospects researched:** [N]
- **Emails drafted:** [N]
- **Emails sent:** [N]
- **Cumulative pipeline:** [total leads] prospects, $[total est. loss]/mo addressable
```

---

## TARGET MARKET PRIORITY (for Henry's reference)

### Tier 1 — Highest value per client, fastest close
1. **Dental practices** — $500-1,200 per new patient, huge missed-call problem, tech-forward buyers
2. **Law firms** — $1,000-5,000 per case, after-hours leads are critical, budget exists
3. **Medical offices** — High volume, insurance complexity = receptionist overload

### Tier 2 — High volume, good value
4. **HVAC/Plumbing** — Emergency calls = highest urgency, after-hours is everything
5. **Real estate agents** — Lead response time is everything, they understand ROI
6. **Veterinary** — Emotional urgency (pet emergencies), growing market

### Tier 3 — Solid but longer sales cycle
7. **Property management** — Tenant calls at all hours, maintenance requests
8. **Auto repair** — High repeat value, scheduling complexity

### Geographic Priority
1. **Atlanta, GA** — 6M metro, massive market, 2hr from Auburn
2. **Birmingham, AL** — 1.1M metro, 2hr from Auburn, underserved
3. **Montgomery, AL** — 400K metro, state capital, 1hr from Auburn
4. **Columbus, GA** — 300K metro, 30min from Auburn
5. **Auburn/Opelika, AL** — Home base, local trust advantage (but small)
6. **Nashville, TN** — 2M metro, booming market, 4hr from Auburn
7. **Charlotte, NC** — 2.7M metro, fast-growing

### The $10K Sprint Plan
- Week 1-2: 20 emails/day to Atlanta dental + law (highest value)
- Week 3-4: 20 emails/day to Birmingham + Montgomery (all industries)
- Week 5-6: Follow-up sequences + close pipeline
- Target: 10 clients at ~$997/mo avg = $10K MRR

---

*Run this command daily: `/revenue-engine`*
*Track progress: check `leads/PIPELINE.md`*
*Follow up on responses: check `leads/` for status updates*
