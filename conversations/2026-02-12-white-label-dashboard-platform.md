# White-Label Client Dashboard Platform + Reusable Setup System
**Date:** 2026-02-12
**Duration:** ~15 minutes (parallelized across 4 builder agents)
**Status:** Completed

## Goal
Build a reusable white-label platform where each Agentic Engineering client gets a standalone lead intelligence dashboard (Netlify), a daily MCP-native lead gen command, and Supabase-backed data storage. Replace Apollo + HubSpot with Supabase + custom dashboards. Start with SYBA as the first client.

## What Was Built

### Files Created
| File | Lines | Purpose |
|------|-------|---------|
| `supabase/migrations/001_initial_schema.sql` | 169 | Full DB schema: 5 tables, 8 indexes, 10 RLS policies, SYBA seed data |
| `clients/template/index.html` | ~100 | Login page template (Supabase Auth, no sidebar) |
| `clients/template/dashboard.html` | ~200 | Main dashboard (stats cards, top leads, briefing preview) |
| `clients/template/leads.html` | ~230 | Filterable leads table with pagination + CSV export |
| `clients/template/lead.html` | ~310 | Lead detail with full outreach package, copy buttons |
| `clients/template/briefings.html` | ~150 | Briefing archive with expand/collapse |
| `clients/template/css/dashboard.css` | 1,478 | Dark theme matching agenticengineering.netlify.app aesthetic |
| `clients/template/js/config.js` | 9 | Client config with {{PLACEHOLDER}} values |
| `clients/template/js/auth.js` | 99 | Supabase auth module (login, logout, session, client_id extraction) |
| `clients/template/js/app.js` | 691 | Dashboard data fetching, rendering, filtering, CSV export |
| `clients/template/daily-command-template.md` | 53 | Parameterized daily command template |
| `clients/template/outreach-skill-template.md` | 43 | Parameterized outreach skill template |
| `clients/syba/` (all files) | ~3,200 | SYBA-specific dashboard instance (copy of template with config injected) |
| `.claude/commands/syba-daily.md` | 124 | SYBA daily 40-lead intelligence engine |
| `.claude/commands/setup-client.md` | 74 | Master client onboarding command |
| `.claude/commands/save-conversation.md` | 60 | Reusable conversation summary command |

### Files Modified
| File | Change |
|------|--------|
| `.env` | Added SUPABASE_URL and SUPABASE_ANON_KEY |
| `MEMORY.md` | Updated with white-label platform architecture, SYBA dashboard details, new commands |

### Files Deleted
| File | Reason |
|------|--------|
| `clients/syba/daily-command-template.md` | Template file not needed in client instance |
| `clients/syba/outreach-skill-template.md` | Template file not needed in client instance |

## Architecture Decisions
- **Single Supabase project for all clients** — RLS policies use JWT `client_id` claim to isolate data per client. Service role bypasses RLS for Claude Code writes.
- **Vanilla HTML/CSS/JS (no framework)** — Keeps dashboards simple, fast to deploy, zero build step. Supabase JS v2 loaded from CDN.
- **Config via string replacement** — `{{PLACEHOLDER}}` values in `config.js` replaced per client. Simpler than env vars for static sites.
- **MCP-native daily command** — Replaces n8n + Apollo + HubSpot pipeline. Firecrawl for web scraping, Apify for enrichment, Google Workspace for Gmail drafts.
- **Gmail drafts (not auto-send)** — Google Workspace MCP creates drafts that Henry clicks to send. Safe by design.
- **Dark theme matching main site** — Same design tokens (#0A0A0B, Satoshi + Instrument Serif, glass morphism, grain overlay) as agenticengineering.netlify.app.

## Deployments & Services
- **SYBA Dashboard:** https://syba-leads.netlify.app (Netlify site ID: `400296a9-3cd3-40c5-98d7-c9da48b9b3ad`)
- **Supabase project:** `wghzabtkmntpclynntpp` (schema not yet applied — manual step)

## Commands & Skills Created
- `/syba-daily` — Find 40 leads across Belgium/Europe/USA, generate outreach, store in Supabase, draft Gmail briefing
- `/setup-client` — Full client onboarding: gather info, create context doc, dashboard, Supabase records, Netlify deploy, daily command, outreach skill
- `/save-conversation` — Save conversation summary to `conversations/` folder

## Verification
- All 5 HTML files: valid structure (Python HTML parser) — PASS
- All 3 JS files: `node --check` syntax validation — PASS
- 62 page-specific requirement checks across all HTML — 62/62 PASS
- CDN resource audit (Google Fonts, Supabase JS, CSS, config, accent color, toast) — 35/35 PASS
- SQL migration: 5 tables, 8 indexes, 10 RLS policies, SYBA seed data — PASS
- SYBA dashboard live at https://syba-leads.netlify.app — PASS (login page renders correctly)
- SYBA config.js injected with correct values (slug, name, color, anon key) — PASS

## Next Steps
- [ ] Run SQL migration in Supabase SQL Editor (`supabase/migrations/001_initial_schema.sql`)
- [ ] Create Supabase auth users for `brigittev@syba.io` and `francis@syba.io` with `client_id` metadata
- [ ] Run `/syba-daily` to populate the database with real leads
- [ ] Verify dashboard shows lead data after daily run
- [ ] Verify Gmail draft is created for briefing email
- [ ] Consider adding `clients/` and `conversations/` to `.gitignore` if they contain sensitive data
- [ ] Future: add password reset flow to login page
- [ ] Future: add real-time notifications (Supabase Realtime) for new leads

## Session Notes
- **Parallelization strategy:** 4 independent builder agents ran simultaneously — SQL migration, CSS/JS, HTML pages, commands/templates. Total wall-clock time ~4 minutes for ~3,600 lines of code.
- **Netlify CLI issue:** `netlify sites:create` fails in non-interactive mode with the current version (23.15.1). Workaround: used `netlify api createSite` which works without prompts.
- **Supabase MCP not available:** No Supabase MCP in the tool set, so SQL is delivered as a migration file for manual execution in the Supabase SQL Editor.
- **Template pattern:** The `clients/template/` + `{{PLACEHOLDER}}` pattern is intentionally low-tech. For a consulting business deploying the same dashboard to multiple clients, string replacement is more maintainable than a build pipeline.

## Execution Summary
| Step | Agent | Duration | Status |
|------|-------|----------|--------|
| 1. Add Supabase keys to .env | Main | <1 min | Done |
| 2. Create SQL migration | Builder agent | ~30s | Done |
| 3a. Build CSS + JS | Builder agent | ~4 min | Done |
| 3b. Build HTML pages | Builder agent | ~3 min | Done |
| 3c. Build commands + templates | Builder agent | ~1 min | Done |
| 4. Create SYBA instance | Main | <1 min | Done |
| 5. Deploy to Netlify | Main | ~1 min | Done |
| 6. Update MEMORY.md | Main | <1 min | Done |
