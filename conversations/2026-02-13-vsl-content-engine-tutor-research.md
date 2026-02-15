# VSL Assets, Content Engine, & Tutor Intelligence Brief
**Date:** 2026-02-13
**Duration:** ~2 hours (continued from 2026-02-12 session)
**Status:** In Progress (2 background agents running)

## Goal
Pull mobile Claude Code changes from GitHub, create VSL/case study sales assets, build a reusable `/content` daily content engine, deep-research top online tutors, create tutor VSL + presentation deck, and email everything to relevant recipients.

## What Was Built

### Files Created
| File | Lines | Purpose |
|------|-------|---------|
| `site/case-study.html` | ~1304 | SYBA case study page (dark theme, 8 sections, Stripe links, Calendly) |
| `leaddrop/VSL_SCRIPT.md` | 96 | 90-second Loom VSL recording script (PAS framework, 219 words) |
| `.claude/commands/content.md` | 620 | `/content` — daily content engine for any business type |
| `research/tutor-intelligence-brief.md` | ~350 | Competitive intelligence on top 5 online tutors |
| `research/tutor-vsl-script.md` | TBD | Tutor-specific VSL script (background agent creating) |
| `research/tutor-vsl-deck.html` | TBD | HTML presentation deck for tutor VSL (background agent creating) |
| `mobile-app-generator/` | (dir) | 11-phase mobile app factory (pulled from GitHub) |
| `marketing-department/` | (dir) | 8-phase AI marketing system (pulled from GitHub) |

### Files Modified
| File | Change |
|------|--------|
| `.claude/commands/drop.md` | Added Loom VSL + case study links to email template |
| `.mcp.json` | Added Remotion MCP server (`@remotion/mcp@latest`) |

## Architecture Decisions
- **`/content` is business-agnostic**: Stores client configs in `content-clients/{slug}/config.md`, works for any industry
- **7-phase content pipeline**: Research → Script → Presentation → Email Brief → Post-Production → Cross-Post → Track
- **Parallel builder agents for research**: Split research across 5 source clusters (TikTok, YouTube, X, industry, performance)
- **HTML email as deliverable**: Client receives script + presentation + captions in one email — just hits record
- **Text fallback for no-record days**: Scripts become LinkedIn posts, X threads, or carousel concepts
- **Remotion MCP for video editing**: Added to `.mcp.json` for future Loom/video post-processing capability

## Deployments & Services
- **Case study page**: https://agenticengineering.netlify.app/case-study (deployed via Netlify MCP)
- **Gmail sends**: VSL script → henry@agenticengineering.com (confirmed: msg ID 19c569a580619f71)
- **Gmail sends (in progress)**: Research brief → nvtutor1@gmail.com, VSL + deck → nvtutor1@gmail.com

## Commands & Skills Created
- `/content` — Daily content engine: research trends, create scripts + presentations, send brief to client, cross-post after recording. Works for any business type. 620 lines, 7 phases.
- `/drop` — Updated with Loom VSL link and case study link in email template

## Key Research Outputs
### Top 5 Online Tutors (by revenue)
| Tutor | Revenue | Key Insight |
|-------|---------|-------------|
| Ali Abdaal | $5-6M/yr | $1 micro-commitment → $995 course funnel |
| Organic Chemistry Tutor | $1.5-2.5M/yr | Pure volume + evergreen SEO = millions from ads |
| Steven Menking | $500K+ ($1K/hr) | Premium positioning + elite credentials |
| Gabby Wallace | $400-600K/yr | Niche specificity + waitlist scarcity model |
| Mike and Matty | $1M+/yr | "Meta-tutor" — teach subject, then teach how to teach |

### Market Data
- Global online tutoring: $12.8B (2025), 14.5% CAGR, >$25B by 2030
- AI disruption creating opportunity for human-connection tutors

## Verification
- Case study deployed and live: PASS
- VSL script emailed to self: PASS (Gmail message ID confirmed)
- `/content` command registered in skills: PASS (620 lines, YAML frontmatter valid)
- Research brief saved locally: PASS (`research/tutor-intelligence-brief.md`)
- Git changes pulled from mobile: PASS (fast-forward merge, zero conflicts)

## Next Steps
- [ ] Background agent: Confirm research brief email sent to nvtutor1@gmail.com
- [ ] Background agent: Confirm VSL + deck email sent to nvtutor1@gmail.com
- [ ] Record Loom VSL using `leaddrop/VSL_SCRIPT.md` script + SYBA dashboard screenshare
- [ ] Replace `[LOOM_URL]` placeholder in `/drop` email template with actual Loom link
- [ ] Google Slides deck creation (needs OAuth re-auth — port 8000 conflict)
- [ ] Remotion project setup (`npx create-video@latest` — needs user approval for npm install)
- [ ] Feb 15: Follow-up emails due (Day 3 for dental + law batches)
- [ ] Run `/save-prompt` to save reusable prompts from this session

## Session Notes
- **Gmail OAuth pattern works reliably**: Extract refresh_token from Keychain → refresh access token → send via API. Must be in SINGLE bash call (env vars don't persist).
- **Parallel background agents**: 3 agents ran simultaneously — Gmail sender, tutor researcher, content command builder. All completed successfully. 2 more running now (research emailer + VSL creator).
- **Research agent was read-only**: Couldn't write files directly. Had to extract research from agent output and save manually.
- **Mobile App Factory V2**: Pulled from GitHub branch `claude/mobile-app-generator-rgjfr`. 11-phase system with 7 agent definitions, template registry, compound knowledge.
