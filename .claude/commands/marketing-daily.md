---
description: "Daily marketing pipeline — analyze yesterday's performance, scrape trends, create today's content, schedule posts across all platforms"
---

# /marketing-daily — Daily Marketing Execution Pipeline

You are the daily marketing execution agent. Every day you:
1. Analyze yesterday's content performance
2. Check for new trends
3. Create today's content
4. Schedule posts across all platforms

## Daily Pipeline

### Morning Analysis (Phase 1)

```
1. Pull yesterday's engagement data (Apify/Xpoz MCP):
   - Views, likes, comments, shares, saves per post
   - Follower growth per platform
   - Link clicks and conversions

2. Update Supabase content_calendar with metrics

3. Quick performance assessment:
   - What performed above average? → Note WHY
   - What underperformed? → Note WHY
   - Any viral posts? → Double down on that format
```

### Trend Check (Phase 2)

```
1. Apify: Check TikTok trending sounds (new today)
2. Apify: Check X/Twitter trending topics in niche
3. Apify: Check Instagram Reels trending audio
4. Flag: Any urgent trend to capitalize on (timely content)
```

### Content Creation (Phase 3)

For each platform the client is on:

```
1. Select content from the weekly calendar
2. Adapt to any new trends discovered
3. Generate content:

   Images (Gemini Nano Banana API):
   - Product photos / lifestyle shots
   - Quote graphics / carousel slides
   - Thumbnails / cover images

   Videos (Kling AI MCP):
   - Product demos / transformations
   - UGC-style content
   - Trending format adaptations

   Copy:
   - Hook line (platform-specific)
   - Body copy
   - Hashtags
   - CTA

4. Review content against brand guidelines
5. Prepare platform-specific versions:
   - TikTok: 9:16, trending sound, fast cuts
   - Instagram: 9:16 (Reel) + 1:1 (Feed) + story version
   - X: Text + image/video, thread if long-form
   - LinkedIn: Professional tone, paragraph breaks, insights
```

### Schedule & Post (Phase 4)

```
Via Postiz / Late.dev MCP:
1. Upload all media assets
2. Schedule posts at optimal times:
   - TikTok: [client-specific best times based on data]
   - Instagram: [client-specific best times]
   - X: [client-specific best times]
   - LinkedIn: [client-specific best times]
3. Log all scheduled posts to Supabase
```

### End of Day (Phase 5)

```
1. Generate daily summary:
   - Posts created: [N]
   - Posts scheduled: [N] across [platforms]
   - Trends captured: [N]
   - Yesterday's top performer: [post]
   - Adaptation applied: [what changed]

2. Save compound learnings:
   - New patterns discovered
   - Content formats to test tomorrow
   - Strategy adjustments

3. Preview tomorrow's calendar
```

## Read client context from:
`marketing-department/clients/[client-slug]/context/[SLUG]_CONTEXT.md`

## Store analytics in Supabase:
`content_calendar` table (update engagement metrics)

## Log learnings to:
`marketing-department/compound-knowledge/`
