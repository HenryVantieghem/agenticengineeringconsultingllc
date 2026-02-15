# Session: Starter Kit Department + MCP Expansion + Research
**Date:** 2026-02-13
**Context:** Continuation of massive multi-part request from previous session

## What Was Built This Session

### 1. Starter Kit Department (NEW)
Created `starter-kits/` directory with two products:

**ExpoLaunch ($149)** — React Native Expo + Supabase
- 15+ production-ready screens (auth, feed, search, profile, settings, paywall)
- Expo SDK 52+, Expo Router, Supabase, RevenueCat, Zustand, NativeWind
- Full TypeScript, dark mode, push notifications, IAP, real-time data
- Supabase migrations + RLS policies included
- `starter-kits/expo-supabase/template/` — full template code

**SwiftLaunch ($149)** — SwiftUI + Supabase
- 15+ production-ready screens (same feature set, native iOS)
- SwiftUI iOS 18+, @Observable macro, Supabase Swift SDK, StoreKit 2
- MVVM architecture, WidgetKit, APNs, async/await throughout
- `starter-kits/swiftui-supabase/template/` — full template code

**Product Landing Page**
- `site/starter-kits.html` — premium dark-theme product page
- Same design system as main site (Instrument Serif + Satoshi, #E8533F accent)
- Product cards, tech stack section, features grid, FAQ, CTA sections
- Stripe payment link placeholders (TBD)

### 2. Convex Database Research
**Verdict: Stay with Supabase.** Reasons:
- Architecture mismatch (vanilla HTML/JS vs Convex's bundler requirement)
- RLS is critical (10 policies, no Convex declarative equivalent)
- MCP pipeline tightly integrated (`/drop`, `/serve`, `/activate` use raw SQL)
- SYBA dashboard is live — migration = high risk, low upside
- Convex good for future greenfield React/Next.js projects

### 3. MCP Expansion
**Already installed (27 servers):** context7, xclaude-plugin (8), magic, hardened-workspace, gemini (broken), n8n (3), supabase, github, browsermcp, stripe (needs auth), memory, filesystem, sequential-thinking, firecrawl, playwright, netlify, pipedream (needs auth), apify

**Researched for installation:** Figma, Sentry, Krea, Canva, Crosspost, Composio Rube, Semrush

### 4. Xcode Version
Already at 26.3 (Build 17C519) — no update needed.

## Files Created/Modified
- `starter-kits/README.md` — Department architecture + distribution model
- `starter-kits/expo-supabase/PRODUCT.md` — ExpoLaunch product spec
- `starter-kits/swiftui-supabase/PRODUCT.md` — SwiftLaunch product spec
- `starter-kits/expo-supabase/template/` — Full Expo template (30+ files)
- `starter-kits/swiftui-supabase/template/` — Full SwiftUI template (35+ files)
- `site/starter-kits.html` — Product landing page
- `conversations/2026-02-13-starter-kit-dept-mcp-expansion.md` — This file

## Pending / Next Steps
- [ ] Authenticate Stripe MCP (`/mcp` or re-auth)
- [ ] Fix Gemini MCP connection
- [ ] Install remaining MCPs (Figma, Sentry, Krea, Canva, Crosspost)
- [ ] Create Stripe payment links for ExpoLaunch + SwiftLaunch
- [ ] Deploy starter-kits.html to Netlify
- [ ] Create GitHub repos for template delivery
- [ ] Add starter kit nav link to main site
- [ ] Test both templates (expo start, xcodebuild)
