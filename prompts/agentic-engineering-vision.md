# Agentic Engineering Consulting — Founder Vision
> Saved: 2026-02-12
> Tags: vision, strategy, $10K-sprint, outreach, automation, behavioral-psychology
> Use: Reference for strategic direction, onboarding new tools/sessions, grounding any Claude conversation

## Vision Prompt

Build the command center for an AI automation consulting agency targeting local businesses. The core insight: local businesses (dental, law, HVAC, medical, real estate, etc.) lose thousands per month to missed calls, manual scheduling, and after-hours dead zones. We solve this with AI phone systems and workflow automation at $497-$1,497/month.

### The System

Use Claude Code + MCPs as a one-person revenue engine:

1. **Deep prospect research at scale** — Apify scrapes Google Maps for target businesses. Firecrawl scrapes their websites. Google Workspace reads their online presence. Playwright screenshots their sites. We know more about their business than they do.

2. **Revenue loss calculation** — For each prospect, calculate exactly how much money they're losing to missed calls using industry benchmarks. Dental: $500-1,200 per missed new patient. Law: $1,000-5,000 per missed case. Make the math undeniable.

3. **Hyper-personalized outreach** — Every email references their specific Google reviews, their missing online booking, their competitor down the street. Use Kahneman's loss aversion ("you're losing $8K/month") not gain framing. Use Cialdini's reciprocity (give them a free analysis). Use specificity (their name, their numbers, their gaps).

4. **Automated follow-up** — 3-touch email sequence. Day 0: initial research-backed email. Day 3: follow-up with new angle. Day 7: final value-add. Day 14: close the loop.

5. **Pipeline management** — Every lead tracked in `leads/` with status, outreach history, and next actions. Daily dashboard shows pipeline health and revenue projections.

6. **Client delivery** — n8n workflow templates for common automations (lead capture, missed-call textback, appointment reminders). Slash commands that run daily for each client.

### The $10K Math

- 20 deeply personalized emails/day to Atlanta + Birmingham + Montgomery
- Target dental + law first (highest value per client)
- 5-10% reply rate (vs 1-2% for generic cold email)
- 1.5-3 closes per week at $997/mo average
- $10K MRR in 4-7 weeks

### Key Principles

- **Loss aversion over gain framing** — "You're losing $8K" beats "You could gain $8K"
- **Specificity is the moat** — Anyone can send 1,000 generic emails. We send 20 that feel hand-written because they ARE researched individually.
- **The tool IS the product** — Claude Code + MCPs running daily is both the sales engine AND the delivery mechanism
- **Geography is leverage** — Auburn is too small. Atlanta has 50,000+ target businesses. Go wide, stay specific.
- **Daily consistency compounds** — 20 emails/day × 5 days × 7 weeks = 700 prospects. At 2% close rate = 14 clients = $14K MRR.

### Tools & Infrastructure

| Tool | Purpose |
|------|---------|
| Claude Code | Orchestration, research, email generation, client delivery |
| Apify | Google Maps scraping, structured business data |
| Firecrawl | Website scraping, content analysis |
| Google Workspace MCP | Gmail drafts/sending, Calendar, Sheets CRM |
| Playwright | Visual site analysis, screenshots |
| n8n | Client-facing workflow automation |
| Netlify | Landing page hosting |
| Calendly | Booking integration |

## When to Use

- Starting a new Claude session for Agentic Engineering work
- Onboarding a new tool or MCP server
- Recalibrating strategy or market focus
- Training a new slash command or agent
- Reminding yourself of the north star: $10K MRR as fast as possible

## Example Output

A successful `/revenue-engine` run produces:
- 20 lead profiles in `leads/` with deep research
- 20 personalized emails ready to send
- Pipeline dashboard showing cumulative progress
- Clear action items for the day (calls, emails, follow-ups)
- Revenue projection tracking toward $10K goal
