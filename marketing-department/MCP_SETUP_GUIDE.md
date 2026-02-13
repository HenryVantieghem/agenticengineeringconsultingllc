# MCP Server Setup Guide — Marketing Department

> All MCP servers required for the full AI marketing department pipeline.
> Add these to your Claude Code MCP configuration.

---

## Required MCP Servers (9 total)

### 1. Apify MCP (Social Media Intelligence)
```json
{
  "apify": {
    "command": "npx",
    "args": ["-y", "@anthropic/apify-mcp-server"],
    "env": { "APIFY_API_TOKEN": "${APIFY_API_TOKEN}" }
  }
}
```
**Key Actors:**
- `clockworks/tiktok-scraper` — TikTok hashtags, videos, profiles, trending
- `scrapers/twitter` — X/Twitter search, profiles, trending
- `instagram-scraper` — Instagram posts, hashtags, profiles
- `reddit-scraper` — Subreddit posts, comments
- `app-store-scraper` — App Store listings and reviews
**Get token:** https://apify.com/ (free: $5/month credits)

### 2. Firecrawl MCP (Web Scraping)
```json
{
  "firecrawl": {
    "command": "npx",
    "args": ["-y", "firecrawl-mcp"],
    "env": { "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}" }
  }
}
```
**Purpose:** Competitor websites, product pages, blog content, SEO analysis
**Get key:** https://firecrawl.dev/

### 3. Kling AI MCP (AI Video Generation)
```json
{
  "kling": {
    "command": "npx",
    "args": ["-y", "mcp-kling@latest"],
    "env": {
      "KLING_ACCESS_KEY": "${KLING_ACCESS_KEY}",
      "KLING_SECRET_KEY": "${KLING_SECRET_KEY}"
    }
  }
}
```
**13+ tools:** Text-to-video, image-to-video, lip-sync, virtual try-on, effects
**Models:** kling-v2-master, v1.6, v1.5, v1.0, KOLORS (images)
**Durations:** 5s, 10s clips (stitch for longer)
**Formats:** 16:9, 9:16, 1:1
**Repo:** https://github.com/199-mcp/mcp-kling
**Get keys:** https://app.klingai.com/global/dev

### 4. Postiz MCP (Social Media Posting)
```json
{
  "postiz": {
    "command": "npx",
    "args": ["-y", "@postiz/mcp-server"],
    "env": { "POSTIZ_API_KEY": "${POSTIZ_API_KEY}" }
  }
}
```
**Alternative — Late.dev:**
```json
{
  "late": {
    "command": "npx",
    "args": ["-y", "@getlate/mcp-server"],
    "env": { "LATE_API_KEY": "${LATE_API_KEY}" }
  }
}
```
**Platforms:** TikTok, Instagram, X/Twitter, LinkedIn, YouTube, Facebook, Threads
**Features:** Schedule, publish, cross-post, analytics
**Postiz:** https://postiz.com/ | **Late.dev:** https://getlate.dev/

### 5. Xpoz MCP (Social Analytics)
```json
{
  "xpoz": {
    "command": "npx",
    "args": ["-y", "@xpoz/mcp-server"]
  }
}
```
**Purpose:** Cross-platform search and analytics (X, Instagram, TikTok, Reddit)
**Feature:** Natural language queries, no API keys needed
**URL:** https://www.xpoz.ai/

### 6. Browser MCP (Web Automation)
```json
{
  "browser": {
    "command": "npx",
    "args": ["-y", "@anthropic/browser-mcp-server"]
  }
}
```
**Purpose:** Login to platforms, set up accounts, navigate Alibaba/Accio, manage App Store Connect
**Alternative (Browser Use — persistent sessions):** https://browsermcp.io/

### 7. Supabase MCP (Data Storage)
```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server"],
    "env": { "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}" }
  }
}
```
**Purpose:** Content calendar, analytics, client data, A/B test results

### 8. GitHub MCP (Version Control)
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
  }
}
```

### 9. Ayrshare API (Alternative Social Posting)
```json
{
  "ayrshare": {
    "command": "npx",
    "args": ["-y", "@ayrshare/mcp-server"],
    "env": { "AYRSHARE_API_KEY": "${AYRSHARE_API_KEY}" }
  }
}
```
**Platforms:** X, Instagram, Facebook, LinkedIn, YouTube, TikTok, Reddit, Telegram, Pinterest
**URL:** https://www.ayrshare.com/

---

## For AI Image Generation (Gemini Nano Banana)

No MCP server needed — use directly via API:

```bash
# Environment variable
GEMINI_API_KEY=your_gemini_api_key

# API call for image generation
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-image:generateContent" \
  -H "x-goog-api-key: $GEMINI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{"text": "Generate a professional product photo of..."}]
    }],
    "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]}
  }'
```

**Models:**
- `gemini-2.5-flash-image` — Fast, efficient ($0.039/image)
- `gemini-3-pro-image-preview` — Highest quality, text rendering ($0.13-0.24/image)

---

## Environment Variables

```bash
# Social Intelligence
APIFY_API_TOKEN=apify_api_xxxxx
FIRECRAWL_API_KEY=fc-xxxxx

# Content Creation
KLING_ACCESS_KEY=xxxxx
KLING_SECRET_KEY=xxxxx
GEMINI_API_KEY=xxxxx

# Social Posting (pick one or more)
POSTIZ_API_KEY=xxxxx
LATE_API_KEY=xxxxx
AYRSHARE_API_KEY=xxxxx

# Infrastructure
SUPABASE_ACCESS_TOKEN=sbp_xxxxx
GITHUB_TOKEN=ghp_xxxxx
```

---

## Full Combined MCP Configuration

```json
{
  "mcpServers": {
    "apify": {
      "command": "npx",
      "args": ["-y", "@anthropic/apify-mcp-server"],
      "env": { "APIFY_API_TOKEN": "${APIFY_API_TOKEN}" }
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}" }
    },
    "kling": {
      "command": "npx",
      "args": ["-y", "mcp-kling@latest"],
      "env": {
        "KLING_ACCESS_KEY": "${KLING_ACCESS_KEY}",
        "KLING_SECRET_KEY": "${KLING_SECRET_KEY}"
      }
    },
    "postiz": {
      "command": "npx",
      "args": ["-y", "@postiz/mcp-server"],
      "env": { "POSTIZ_API_KEY": "${POSTIZ_API_KEY}" }
    },
    "xpoz": {
      "command": "npx",
      "args": ["-y", "@xpoz/mcp-server"]
    },
    "browser": {
      "command": "npx",
      "args": ["-y", "@anthropic/browser-mcp-server"]
    },
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": { "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}" }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    }
  }
}
```
