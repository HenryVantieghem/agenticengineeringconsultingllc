# Session Context — Daily Ops + Deep Research + System Blueprint

> **Date**: 2026-02-14 (continued from 2026-02-13 session that ran out of context)
> **Duration**: ~90 minutes across both sessions
> **Primary Goal**: Execute daily LeadDrop/SYBA operations, deep research best-in-world lead gen system, build interactive blueprint
> **Outcome**: Completed — all 12 tasks done

## Summary
Completed the 7-phase daily workflow plan from Feb 13: sent SYBA 45-lead briefing to Francis + Brigitte, sent 15 HVAC LeadDrop emails, checked responses (Fabulous Smiles = hot lead), ran deep research across 44 web searches covering MCP servers, scientific studies, marketing psychology, and competitor platforms. Built an 809-line research document and a 2,238-line interactive HTML system blueprint. Installed 3 new MCP servers (Hunter.io, Apollo.io, Bright Data) at user scope. Drafted reply to Fabulous Smiles (warmest prospect).

## Decisions Made
| Decision | Rationale | Alternatives Considered |
|----------|-----------|------------------------|
| Install Hunter.io, Apollo.io, Bright Data MCPs | Top 3 from research — email verification, 275M contacts, fallback scraping | SerpAPI (deferred), HubSpot MCP (evaluate later), Explorium (evaluate later) |
| User scope for new MCPs | Available across all projects, not just this repo | Project scope (was initially done, then moved) |
| 5-agent pipeline architecture (SCOUT→ENRICH→QUALIFY→COMPOSE→DISPATCH) | Maps cleanly to MCP tools, each agent has clear responsibility | LangGraph multi-agent (overkill), single monolithic agent (too complex) |
| Day 3/10/17 follow-up cadence (3-7-7) | Research shows 93% of replies captured by Day 10, optimal based on 85K email study | Current Day 3/7/14 cadence (suboptimal — Day 7 too early) |
| Reciprocity-first model as core differentiator | Cialdini Principle #1 — give 5 free leads before asking. No competitor does this. | Standard cold outreach (lower conversion), freemium SaaS model (different business) |
| Update Fabulous Smiles status to 'replied' in Supabase | They engaged — need to track pipeline progression | Leave as 'sent' (would miss the engagement signal) |

## Work Completed

### Files Created
- `research/deep-research-lead-gen-system.md` (809 lines) — Comprehensive research: MCP servers, scraping tools, cold email science, marketing psychology, agent orchestration, lead scoring, competitor analysis, open-source repos, synthesized strategy
- `research/leaddrop-system-blueprint.html` (2,238 lines, 76.8KB) — Interactive dark-themed HTML blueprint with 11 sections: architecture diagram, MCP ecosystem grid, lead scoring algorithm, marketing psychology framework, competitor comparison, daily ops timeline, priority MCP matrix, scientific references, formula visualization
- `syba/briefs/SYBA_LEAD_BRIEF_2026-02-13.html` — Full HTML briefing with 45 leads for Francis + Brigitte

### Files Modified
- `leaddrop/ROTATION.md` — Position advanced to 3 (Atlanta HVAC done, next: Atlanta Medical #4)
- `~/.claude.json` — Added 3 MCP servers at user scope (hunter, apollo, brightdata), removed project-scope duplicates

### Supabase Changes
- `leads` table: 45 new SYBA leads inserted (Feb 13, avg fit 8.6)
- `briefings` table: New briefing row with full metadata
- `trigger_events` table: 5 cybersecurity trigger events inserted
- `leaddrop_prospects` table: Fabulous Smiles status → 'replied', email → office@myfabuloussmile.com
- `leaddrop_prospects` table: Follow-up tracking columns added (followup_1/2/3_sent_at)

### MCP Servers Installed (User Scope)
- **Hunter.io** — HTTP remote server at `https://mcp.hunter.io/mcp`, needs `HUNTER_API_KEY`
- **Apollo.io** — stdio Python server at `~/mcp-servers/apollo-mcp-server`, needs `APOLLO_API_KEY`
- **Bright Data** — stdio npx `@brightdata/mcp`, needs `BRIGHTDATA_API_TOKEN`

### Emails Sent
- **SYBA Briefing**: Sent to francis@syba.io + brigittev@syba.io (Message ID: 19c59840d5ebfa72)
- **15 HVAC LeadDrop emails**: All Atlanta HVAC businesses from /drop rotation #3
- **Gmail draft created**: Fabulous Smiles reply (Draft ID: r-1039967657000266761) — awaiting Henry's review

## Research & Findings

### Key Findings
- **Trigger-based outreach gets 20-35% response rate** vs 5-10% for standard cold email
- **Personalized emails get 2-3x higher replies** — Claude generates better personalization than any fine-tuned small model (SmartWriter, Lyne.ai, Nureply)
- **Optimal email length: 50-125 words, 6-8 sentences** — 6.9% reply rate at this length
- **Best send time: Tuesday 6-9 AM** recipient's timezone
- **Follow-up cadence: Day 3, Day 10, Day 17** (3-7-7 pattern) captures 93% of replies
- **Subject lines: 4-7 words, question format** → 46% open rate
- **80% of deals need 5+ touches** — max 3 follow-ups per lead
- **Lead scoring algorithm**: 7 weighted factors (trigger_events=0.20, website_quality=0.15, tech_stack_gap=0.15, decision_maker_found=0.15, review_score=0.15, social_presence=0.10, review_volume=0.10)
- **Clay.com waterfall pattern** can be replicated with Apify → Firecrawl → Hunter.io → Claude → Supabase at near-zero cost
- **Scrapus paper (Frontiers in AI 2025)**: Reinforcement learning + NLP + knowledge graphs = 3x higher relevant lead yield
- **B2B Lead Scoring paper (Frontiers in AI 2025)**: ML-based scoring models outperform manual prioritization

### 5 Unfair Advantages Identified
1. **Reciprocity-first** — Give 5 free leads before asking (no competitor does this)
2. **Claude-quality personalization** — Full website + reviews + news + tech stack context
3. **MCP ecosystem** — 37+ servers (34 existing + 3 new) rival Clay's 100+ enrichment providers
4. **Local business blue ocean** — Enterprise AI SDRs target SaaS, nobody serves dental/law/HVAC
5. **Behavioral science foundation** — Cialdini + Kahneman, not blog "best practices"

### Sources Referenced
- [Frontiers AI: B2B Lead Scoring with ML](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1554325/full)
- [Frontiers AI: Scrapus Lead Gen Case Study](https://www.frontiersin.org/journals/artificial-intelligence/articles/10.3389/frai.2025.1606431/full)
- [awesome-mcp-servers (wong2)](https://github.com/wong2/awesome-mcp-servers)
- [Hunter.io MCP](https://github.com/hunter-io/hunter-mcp) (archived → remote at mcp.hunter.io)
- [Apollo.io MCP](https://github.com/BlockchainRev/apollo-mcp-server) (34+ tools)
- [Bright Data MCP](https://github.com/brightdata/brightdata-mcp) (5K free requests/mo)
- [SerpAPI MCP](https://github.com/serpapi/serpapi-mcp)
- [SalesGPT](https://github.com/filip-michalsky/SalesGPT) (2.2K stars)
- [n8n Lead Gen Templates](https://n8n.io/workflows/categories/lead-generation/) (529+ workflows)
- [Hugging Face: Top 30 Lead Gen Projects](https://huggingface.co/blog/samihalawa/automating-lead-generation-with-ai)
- 80+ total sources in the research document

## Insights
- **OAuth token refresh pattern confirmed**: Keychain stores JSON with refresh_token, client_id, client_secret. Must POST to oauth2.googleapis.com/token to get access_token. Raw credential as Bearer token fails with 401.
- **Draft keyword search is fragile**: Searching HVAC drafts by keyword missed "Rutledge Maintenance" and "Indoor Experts" — search by date range + sender instead.
- **Hunter.io MCP repo is archived** — they moved to a hosted remote server at `https://mcp.hunter.io/mcp` (HTTP transport, no local install needed)
- **Apollo free tier has API restrictions** — full programmatic/MCP access may require Organization plan ($149/user/mo)
- **Bright Data free tier** gives 5,000 requests/mo with search + scrape only (no browser automation)
- **Follow-up cadence mismatch**: Our templates say Day 3/7/14 but research says Day 3/10/17 is optimal — needs updating

## Self-Critique (captured for improvement)

### What Henry could do better
- Set up dedicated outreach domain (e.g., outreach.agenticengineering.com) with SPF/DKIM/DMARC
- Verify emails before sending (Hunter.io would catch bounces like Southwest OMS)
- Warm the sending domain (5-10/day week 1, ramp to 50/day by week 7)
- Add open/click tracking for A/B testing
- Consolidate pipeline tracking to Supabase only (eliminate leads/*.md fragmentation)

### What Claude could do better
- Verify emails before sending (MX record checks at minimum)
- Use date-based draft search instead of keyword matching
- Flag follow-up cadence mismatch proactively
- Recommend outreach domain setup on Day 1, not after 37+ sends
- Verify SYBA lead email quality (how many are "not found"?)

## Unfinished / Next Steps
- [ ] **Send Fabulous Smiles reply** — Draft ID r-1039967657000266761 in Gmail drafts. HOTTEST lead.
- [ ] **Get API keys** — Hunter.io (hunter.io/api-keys), Apollo.io (Settings > API), Bright Data (brightdata.com)
- [ ] **Add keys to .env** — HUNTER_API_KEY, APOLLO_API_KEY, BRIGHTDATA_API_TOKEN
- [ ] **Run /follow-up Feb 15** — Day 3 follow-ups due for 22 dental + law prospects from Feb 12
- [ ] **Run /follow-up Feb 16** — Day 3 follow-ups due for 14 HVAC prospects from Feb 13
- [ ] **Update follow-up cadence** — Change templates from Day 3/7/14 to Day 3/10/17 (research-backed)
- [ ] **Set up outreach domain** — outreach.agenticengineering.com with SPF/DKIM/DMARC
- [ ] **Update /drop skill** — Integrate Hunter.io email verification step
- [ ] **Update /serve skill** — Add Apollo.io enrichment to daily pipeline
- [ ] **Implement lead scoring** — Add 0-100 weighted algorithm to qualification step
- [ ] **Record VSL with Loom** — HTML deck at leaddrop/VSL_DECK.html is ready to record
- [ ] **Next /drop rotation** — Atlanta Medical (#4 in ROTATION.md)
- [ ] **Remove Southwest OMS** — Mark as bounced, remove from pipeline

## Responses Received
| Prospect | Industry | Response | Action Needed |
|----------|----------|----------|---------------|
| **Fabulous Smiles** | Dental (Atlanta) | Asked to update email to office@myfabuloussmile.com | **HOT LEAD** — reply draft ready, send ASAP |
| **Storm Trooper/Bart** | SYBA client fwd | "SUPER PROFESSIONAL AND COOL! You understand them well." | Positive validation — share with Francis |
| **Southwest OMS** | Dental (Atlanta) | Bounced (undeliverable) | Remove from pipeline |

## Context for Future Sessions
- **MCP count is now 37** (34 existing + hunter + apollo + brightdata at user scope)
- **Apollo.io MCP** is installed at `~/mcp-servers/apollo-mcp-server` with venv — needs `uv run` to start
- **Research document** at `research/deep-research-lead-gen-system.md` is the strategic bible — reference it for any lead gen decisions
- **Blueprint** at `research/leaddrop-system-blueprint.html` visualizes the full system — open in browser
- **Pipeline state**: 37 total prospects contacted (22 dental/law Feb 12 + 15 HVAC Feb 13), 1 replied (Fabulous Smiles), 1 bounced (Southwest OMS), 55 SYBA leads in dashboard
- **The Formula**: BEST-IN-WORLD = Claude Personalization + Reciprocity Model + MCP Pipeline + Behavioral Science + Blue Ocean + $200/mo
- **Critical fix needed**: Follow-up templates use Day 3/7/14 cadence but research proves Day 3/10/17 is optimal
