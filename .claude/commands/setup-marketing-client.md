---
description: "Onboard a new marketing client — set up profiles, content strategy, brand guide, content calendar, and Supabase tracking"
---

# /setup-marketing-client — New Marketing Client Onboarding

You are the marketing client onboarding agent. You gather information about a new client or business, then create everything needed for their marketing operation.

## Step 1: Gather Client Information

Ask (use AskUserQuestion for structured input):

1. **Client name + slug** — e.g., "MyBrand" / "mybrand"
2. **Business type** — E-commerce, SaaS, App, Service, Creator
3. **What they sell** — Products, services, or content description
4. **Target audience** — Demographics, psychographics, pain points
5. **Social platforms** — TikTok, Instagram, X, LinkedIn, YouTube (multi-select)
6. **Content style** — UGC, Professional, Meme, Educational, Luxury, Mixed
7. **Monetization** — Product sales, Subscriptions, Ads, Leads, Affiliate
8. **Brand colors** — Primary hex, secondary hex
9. **Brand voice** — Formal, Casual, Bold, Witty, Professional
10. **Website URL** — For Firecrawl scraping
11. **Competitor URLs** — Top 3 competitors
12. **Social handles** — @handle per platform

## Step 2: Research & Scrape

1. **Firecrawl MCP:** Scrape client's website → extract value prop, products, messaging
2. **Firecrawl MCP:** Scrape competitor websites → features, pricing, content strategy
3. **Apify MCP:** Scrape competitor social accounts → posting frequency, engagement, content types
4. **Apify MCP:** Scrape trending content in client's niche → viral formats, sounds, hooks

## Step 3: Create Client Context

Write `marketing-department/clients/{slug}/context/{SLUG}_CONTEXT.md` with:
- Company overview, products/services
- Target audience personas (3 detailed)
- Brand voice guidelines
- Content pillars (3-5 themes)
- Competitor analysis summary
- Platform-specific strategies
- Hashtag banks per platform
- CTA templates

## Step 4: Create Brand Guide

Write `marketing-department/clients/{slug}/BRAND_GUIDE.md` with:
- Colors, typography, visual style
- Voice and tone guidelines
- Do's and Don'ts
- Caption templates
- Hashtag strategy
- Bio templates per platform

## Step 5: Create Content Strategy

Write `marketing-department/clients/{slug}/CONTENT_STRATEGY.md` with:
- Content pillars and posting schedule
- Hook formulas tailored to brand
- Platform-specific adaptations
- Monthly content themes
- Viral content playbook

## Step 6: Set Up Supabase Tracking

Via **Supabase MCP**, create tables for:
- `marketing_clients` — client info
- `content_calendar` — scheduled/posted content with engagement metrics
- `analytics_snapshots` — daily/weekly performance data
- `content_templates` — reusable content formats
- `trend_signals` — tracked trends and their performance

## Step 7: Create Slash Commands

1. `/.claude/commands/{slug}-marketing-daily.md` — Daily content pipeline for this client
2. Update marketing engine with client context

## Step 8: Summary

Print:
- Client name and slug
- Platforms configured
- Content strategy summary
- Daily command: `/{slug}-marketing-daily`
- Marketing engine: `/marketing-engine`
- Trend report: Location of trend analysis
- Next step: "Run `/{slug}-marketing-daily` to generate today's content"
