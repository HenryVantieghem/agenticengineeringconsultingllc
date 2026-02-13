# MCP Server Setup Guide — Mobile App Factory V2

> All MCP servers required for the full end-to-end mobile app factory pipeline.
> Add these to your Claude Code MCP configuration.

---

## Required MCP Servers (9 total)

### 1. Supabase MCP (Backend Infrastructure)
```json
{
  "supabase": {
    "command": "npx",
    "args": ["-y", "@supabase/mcp-server"],
    "env": {
      "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
    }
  }
}
```
**Purpose:** Create projects, run SQL, configure auth, storage, realtime, edge functions
**Get token:** https://supabase.com/dashboard/account/tokens

### 2. Firecrawl MCP (Web Scraping)
```json
{
  "firecrawl": {
    "command": "npx",
    "args": ["-y", "firecrawl-mcp"],
    "env": {
      "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"
    }
  }
}
```
**Purpose:** Scrape competitor websites, app landing pages, marketing copy
**Get key:** https://firecrawl.dev/

### 3. Apify MCP (Social Media + App Store Intelligence)
```json
{
  "apify": {
    "command": "npx",
    "args": ["-y", "@anthropic/apify-mcp-server"],
    "env": {
      "APIFY_API_TOKEN": "${APIFY_API_TOKEN}"
    }
  }
}
```
**Purpose:** TikTok/Instagram/X trend scraping, App Store data, business data
**Key Actors Used:**
- `clockworks/tiktok-scraper` — TikTok hashtag/video scraping
- `scrapers/twitter` — X/Twitter search scraping
- `instagram-scraper` — Instagram hashtag scraping
- `app-store-scraper` — App Store listing data
**Get token:** https://apify.com/ (free tier: $5/month credits)

### 4. GitHub MCP (Source Control)
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```
**Purpose:** Create repos from templates, push code, manage issues
**Get token:** https://github.com/settings/tokens

### 5. RevenueCat MCP (Monetization)
```json
{
  "revenuecat": {
    "command": "npx",
    "args": ["-y", "@revenuecat/mcp-server"],
    "env": {
      "REVENUECAT_API_KEY": "${REVENUECAT_API_KEY}"
    }
  }
}
```
**Purpose:** Create apps, products, entitlements, offerings, packages, paywalls
**26 tools available** organized by: App Management, Product Management, Entitlement Management, Offering & Package Management
**Get key:** https://app.revenuecat.com/settings/api-keys
**Docs:** https://www.revenuecat.com/docs/tools/mcp

### 6. XcodeBuildMCP (iOS Build + Test + Screenshot)
```json
{
  "xcodebuild": {
    "command": "xcodebuildmcp",
    "args": []
  }
}
```
**Install:** `brew tap getsentry/xcodebuildmcp && brew install xcodebuildmcp`
**Or:** `npm install -g xcodebuildmcp@latest`
**Purpose:** Build, run, test, screenshot, UI automation on iOS simulators + devices
**59 tools** including: simulator/build, simulator/test, simulator/screenshot, ui-automation/tap, ui-automation/swipe, debugging/attach
**Docs:** https://www.xcodebuildmcp.com/
**Repo:** https://github.com/cameroncooke/XcodeBuildMCP

### 7. Browser MCP (Web Automation)
```json
{
  "browser": {
    "command": "npx",
    "args": ["-y", "@anthropic/browser-mcp-server"]
  }
}
```
**Alternative (Browser Use — persistent auth):**
```json
{
  "browser-use": {
    "url": "https://mcp.browser-use.com/sse",
    "headers": {
      "Authorization": "Bearer ${BROWSER_USE_API_KEY}"
    }
  }
}
```
**Purpose:** Automate App Store Connect login, configure metadata, upload screenshots
**Key feature:** Browser Use profiles store persistent auth (cookies/sessions)
**Docs:** https://browsermcp.io/

### 8. Mobile MCP (iOS Simulator Automation)
```json
{
  "mobile": {
    "command": "npx",
    "args": ["-y", "@anthropic/mobile-mcp-server"]
  }
}
```
**Purpose:** iOS simulator interaction, UI testing, screenshot capture, accessibility inspection
**Featured in:** Anthropic's "Claude Code Best Practices" article
**Repo:** https://github.com/mobile-next/mobile-mcp

### 9. Context7 MCP (Documentation)
```json
{
  "context7": {
    "command": "npx",
    "args": ["-y", "@context7/mcp-server"]
  }
}
```
**Purpose:** Latest SDK documentation and framework references in context

---

## Agent Skills to Install

### SwiftUI Expert Skill
```json
// In .claude/settings.json
{
  "permissions": {
    "allow": ["swiftui-expert@swiftui-expert-skill"]
  }
}
```
**Or install manually:** Clone [AvdLee/SwiftUI-Agent-Skill](https://github.com/AvdLee/SwiftUI-Agent-Skill)
**Provides:** SwiftUI best practices, iOS 26+ Liquid Glass adoption, MVVM patterns, accessibility, performance

### React Native Expert Skill
```bash
# Install Callstack's agent skills
# Clone: https://github.com/callstackincubator/agent-skills
```
**Provides:** React Native performance optimization (FlashList, memoization), Reanimated animations, navigation patterns, platform-specific logic

### Mobile App Development Skill
**Source:** [MCPMarket](https://mcpmarket.com/tools/skills/mobile-app-development)
**Provides:** Cross-platform architecture, Swift/SwiftUI + Kotlin + React Native + Flutter patterns, MVVM, state management

---

## Optional / Enhancement MCPs

### Playwright MCP (Advanced Browser Automation)
```json
{
  "playwright": {
    "command": "npx",
    "args": ["-y", "@anthropic/playwright-mcp-server"]
  }
}
```

### Sentry MCP (Crash Reporting)
```json
{
  "sentry": {
    "command": "npx",
    "args": ["-y", "@sentry/mcp-server"]
  }
}
```

---

## Full Combined MCP Configuration

Copy this complete block to your Claude Code MCP config:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": { "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}" }
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}" }
    },
    "apify": {
      "command": "npx",
      "args": ["-y", "@anthropic/apify-mcp-server"],
      "env": { "APIFY_API_TOKEN": "${APIFY_API_TOKEN}" }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "${GITHUB_TOKEN}" }
    },
    "revenuecat": {
      "command": "npx",
      "args": ["-y", "@revenuecat/mcp-server"],
      "env": { "REVENUECAT_API_KEY": "${REVENUECAT_API_KEY}" }
    },
    "xcodebuild": {
      "command": "xcodebuildmcp",
      "args": []
    },
    "browser": {
      "command": "npx",
      "args": ["-y", "@anthropic/browser-mcp-server"]
    },
    "mobile": {
      "command": "npx",
      "args": ["-y", "@anthropic/mobile-mcp-server"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```

---

## Environment Variables Required

Add these to your `.env` file:

```bash
# Supabase
SUPABASE_ACCESS_TOKEN=sbp_xxxxx

# Firecrawl
FIRECRAWL_API_KEY=fc-xxxxx

# Apify
APIFY_API_TOKEN=apify_api_xxxxx

# GitHub
GITHUB_TOKEN=ghp_xxxxx

# RevenueCat
REVENUECAT_API_KEY=sk_xxxxx

# App Store Connect (for xcrun altool)
APP_STORE_CONNECT_API_KEY_ID=xxxxx
APP_STORE_CONNECT_ISSUER_ID=xxxxx
APP_STORE_CONNECT_API_KEY_PATH=~/.appstoreconnect/private_keys/AuthKey_xxxxx.p8

# Expo (for EAS Build)
EXPO_TOKEN=xxxxx

# Browser Use (optional)
BROWSER_USE_API_KEY=xxxxx
```
