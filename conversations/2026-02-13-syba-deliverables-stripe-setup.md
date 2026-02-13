# SYBA Deliverables, Stripe Payment Links & Landing Page Overhaul
**Date:** 2026-02-13
**Duration:** ~2 hours
**Status:** Completed

## Goal
Fix the SYBA dashboard (login flow, data loading, UI), create client-facing and internal Google Docs documenting the value delivered, create reusable slash commands (`/client-deliverable`, `/contract`), set up Stripe with live payment links ($300 setup + $200/mo), overhaul the landing page to focus on AI Lead Intelligence, and redeploy everything.

## What Was Built

### Files Created
| File | Lines | Purpose |
|------|-------|---------|
| `.claude/skills/syba-dashboard-fix/SKILL.md` | ~60 | Reusable skill for SYBA dashboard fixes |
| `.claude/skills/client-deliverable/SKILL.md` | ~75 | Reusable skill for creating client-facing + internal value Google Docs |
| `.claude/skills/contract/SKILL.md` | ~95 | Reusable contract generator with Stripe payment links |
| `conversations/2026-02-13-syba-deliverables-stripe-setup.md` | this file | Session summary |

### Files Modified
| File | Change |
|------|--------|
| `clients/syba/login.html` | Removed signup tab/form, simplified to sign-in only |
| `clients/syba/leads.html` | Fixed table headers (8 → 7 columns matching JS output) |
| `clients/syba/js/app.js` | Removed `.eq('created_date', today)` filter so ALL data loads; added outreach count, trigger events, pipeline breakdown by ICP |
| `clients/syba/dashboard.html` | Added trigger events section, pipeline breakdown, improved stat cards layout |
| `clients/syba/css/dashboard.css` | Added ~130 lines: dashboard-grid, pipeline bars, trigger event cards, ICP tags |
| `site/index.html` | Complete overhaul — new hero copy, AI Lead Intelligence pricing section, Stripe payment link, "5 free leads" CTA, updated stats |
| `MEMORY.md` | Added Stripe account info and payment link URLs |

## Architecture Decisions
- **Removed date filter on dashboard queries** — the `.eq('created_date', todayISO())` was causing zero-data display on any day except the insert date. Changed to show ALL leads.
- **Removed signup from login page** — signup without `client_id` in metadata created orphan accounts that passed auth but saw no data via RLS.
- **Stripe Payment Links over custom checkout** — no server-side code needed, handles recurring billing natively.
- **Two separate Stripe products** — one-time ($300 setup) and recurring ($200/mo) can't be combined in a single Payment Link, so we use two products with two links.
- **Landing page pivot** — shifted messaging from "AI phone answering" to "AI Lead Intelligence" with $300/$200 pricing as the primary offer.

## Deployments & Services
- **SYBA Dashboard**: https://syba-leads.netlify.app (deploy ID: 698eb25648cd9a1d33f949f0)
- **Landing Page**: https://agenticengineering.netlify.app (deploy ID: 698ec07b3424ed5b22d4774e)
- **Google Doc (client-facing)**: https://docs.google.com/document/d/16f-dBPq3s14_P2i8rV0wM5_WKulYUyEIzLKoZ8jKUUA/edit
- **Google Doc (internal value)**: https://docs.google.com/document/d/1QDeGy7KuDqqpgVpjK-Wykbj8eIwQsi0rahpaKn4gQis/edit
- **Stripe Setup Link (LIVE)**: https://buy.stripe.com/bJe7sK0O92mn1HZ9xEfjG02 ($300)
- **Stripe Monthly Link (LIVE)**: https://buy.stripe.com/7sYaEWfJ3aSTfyPeRYfjG03 ($200/mo)
- **Stripe Account**: acct_1RFfRWBQXryBTFI2 (Henry Vantieghem ACTMASTERCLASS)
- **Stripe CLI**: Installed via Homebrew, authenticated

## Commands & Skills Created
- `/syba-dashboard-fix` — Reusable fix for SYBA dashboard login, data loading, UI
- `/client-deliverable` — Create client-facing + internal value Google Docs for any client
- `/contract` — Generate service agreement Google Doc with Stripe payment links ($300 setup + $200/mo)

## Supabase Changes
- **Deleted orphan account**: `sdfsdfsd@gmail.com` removed from `auth.users`
- **Remaining valid accounts**: francis@syba.io, brigittev@syba.io (password: SybaLeads2026)

## Stripe Products Created (LIVE)
| Product | ID | Price | Price ID |
|---------|-----|-------|----------|
| AI Lead Intelligence Platform - Setup | prod_TyByMf1UoButCD | $300 one-time | price_1T0FaKBQXryBTFI25JUomBcx |
| AI Lead Intelligence Platform - Monthly | prod_TyByda9dZOT2iz | $200/mo recurring | price_1T0FaMBQXryBTFI21c1YESWO |

## Verification
- SYBA dashboard loads all 10 leads, 10 outreach packages, 1 briefing, 5 trigger events
- Login flow works for both francis@syba.io and brigittev@syba.io
- Landing page deployed with Stripe "Get Started" button linking to live checkout
- Both Google Docs created with formatted content via Google Workspace MCP
- Stripe payment links are live mode (livemode: true), accepting real payments

## Key Bugs Fixed
- **Dashboard zero-data bug**: `.eq('created_date', todayISO())` filter removed — data now persists across days
- **Leads table header mismatch**: 8 HTML headers vs 7 JS columns — aligned to match
- **Orphan auth accounts**: Signup removed from UI to prevent future orphans

## Next Steps
- [ ] Share client-facing Google Doc with francis@syba.io and brigittev@syba.io
- [ ] Draft Gmail to SYBA introducing the deliverable doc
- [ ] Follow-ups due Feb 15 (Day 3 for dental + law Atlanta batches)
- [ ] Next rotation: Atlanta HVAC (per /money-machine matrix)
- [ ] Consider combining setup + first month into single $500 Stripe link for smoother onboarding

## Session Notes
- Stripe CLI restricted keys (rk_live_) don't have product creation permissions — had to use the full secret key (sk_live_) via curl
- Stripe Accounts V2 blocks test-mode Payment Links for recurring prices — must use Sandbox or go straight to live mode
- Google Workspace MCP `batch_update_doc` works well for formatting — calculate character indices with Python, then apply bold/size in one batch call
- Parallel builder agents remain the best pattern for large Google Doc content creation
