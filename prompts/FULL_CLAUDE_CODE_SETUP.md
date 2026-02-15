# Full Claude Code Setup — MCP Servers, Plugins, Marketplaces & Co-Work

> **Purpose:** One-shot prompt to fully configure a fresh Claude Code installation with all of Henry Vantieghem's (Agentic Engineering Consulting) MCP servers, plugin marketplaces, plugins, and co-work settings.
>
> **Usage:** Copy this entire prompt into a new Claude Code session and run it.
>
> **Last verified:** 2026-02-14 via `claude mcp list` health check (72 servers total)

---

## INSTRUCTIONS

You are setting up a complete Claude Code environment for Agentic Engineering Consulting. Execute each section below in order. Report progress after each section. Do NOT skip any steps.

---

## SECTION 1: Environment Variables

Ensure these environment variables are set in `~/.zshrc` or `~/.env`:

```bash
# === REQUIRED API KEYS (replace YOUR_KEY_HERE with actual values) ===

# Core
export GITHUB_PERSONAL_ACCESS_TOKEN="YOUR_GITHUB_PAT"
export FIRECRAWL_API_KEY="YOUR_FIRECRAWL_KEY"
export GEMINI_API_KEY="YOUR_GEMINI_KEY"

# AI & Creative
export KLING_ACCESS_KEY="YOUR_KLING_ACCESS_KEY"
export KLING_SECRET_KEY="YOUR_KLING_SECRET_KEY"

# Search & Research
export EXA_API_KEY="YOUR_EXA_KEY"
export TAVILY_API_KEY="YOUR_TAVILY_KEY"
export GOOGLE_TRENDS_API_KEY="YOUR_GOOGLE_TRENDS_KEY"

# Finance
export FRED_API_KEY="YOUR_FRED_KEY"
export ALPACA_API_KEY="YOUR_ALPACA_KEY"
export ALPACA_SECRET_KEY="YOUR_ALPACA_SECRET"
export HELIUS_RPC_URL="YOUR_HELIUS_RPC_URL"

# Business Intel
export BUILTWITH_API_KEY="YOUR_BUILTWITH_KEY"
export EXPLORIUM_API_KEY="YOUR_EXPLORIUM_KEY"
export WHOISXML_API_KEY="YOUR_WHOISXML_KEY"

# Real Estate
export ATTOM_API_KEY="YOUR_ATTOM_KEY"
export ZILLOW_API_KEY="YOUR_ZILLOW_KEY"

# Google Workspace
export GOOGLE_OAUTH_CLIENT_ID="YOUR_GOOGLE_OAUTH_CLIENT_ID"
export GOOGLE_OAUTH_CLIENT_SECRET="YOUR_GOOGLE_OAUTH_CLIENT_SECRET"

# n8n Automation
export N8N_API_KEY="YOUR_N8N_API_KEY"
export N8N_BEARER_TOKEN="YOUR_N8N_MCP_BEARER_TOKEN"
```

---

## SECTION 2: MCP Servers (User Scope — 56 total)

All servers are added at user scope (`~/.claude/settings.json`) so they're available in every project and via co-work.

### 2A: Core Infrastructure (6 servers)
```bash
claude mcp add github --scope user -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_PERSONAL_ACCESS_TOKEN" -- npx -y @modelcontextprotocol/server-github

claude mcp add supabase --scope user --type http --url "https://mcp.supabase.com/mcp?project_ref=wghzabtkmntpclynntpp"

claude mcp add stripe --scope user --type http --url "https://mcp.stripe.com"

claude mcp add memory --scope user -- npx -y @modelcontextprotocol/server-memory

claude mcp add filesystem --scope user -- npx -y @modelcontextprotocol/server-filesystem .

claude mcp add sequential-thinking --scope user -- npx -y @modelcontextprotocol/server-sequential-thinking
```

### 2B: Documentation & Research (7 servers)
```bash
claude mcp add context7 --scope user -- npx -y @upstash/context7-mcp@latest

claude mcp add remotion-documentation --scope user -- npx -y @remotion/mcp@latest

claude mcp add firecrawl --scope user -e FIRECRAWL_API_KEY="$FIRECRAWL_API_KEY" -- npx -y firecrawl-mcp

claude mcp add exa --scope user -e EXA_API_KEY="$EXA_API_KEY" -- npx -y exa-mcp-server

claude mcp add tavily --scope user -e TAVILY_API_KEY="$TAVILY_API_KEY" -- npx -y tavily-mcp@latest

claude mcp add google-trends --scope user -e GOOGLE_TRENDS_API_KEY="$GOOGLE_TRENDS_API_KEY" -- npx -y @andrewlwn77/google-trends-mcp

claude mcp add deep-graph --scope user -- npx -y mcp-code-graph@latest
```

### 2C: Browser & Automation (6 servers)
```bash
claude mcp add browsermcp --scope user -- npx -y @browsermcp/mcp@latest

claude mcp add playwright --scope user -- npx -y @anthropic/mcp-playwright@latest

claude mcp add chrome-devtools --scope user -- npx chrome-devtools-mcp@latest

claude mcp add mobile-mcp --scope user -- npx -y @mobilenext/mobile-mcp@latest

claude mcp add netlify --scope user -- npx -y @netlify/mcp

claude mcp add apify --scope user -- npx -y @apify/actors-mcp-server
```

### 2D: n8n Workflow Automation (2 servers)
```bash
claude mcp add n8n-native --scope user -- npx -y supergateway --streamableHttp "https://agenticengineeringllc.app.n8n.cloud/mcp-server/http" --header "authorization:Bearer $N8N_BEARER_TOKEN"

claude mcp add n8n-mcp --scope user -e MCP_MODE=stdio -e LOG_LEVEL=error -e DISABLE_CONSOLE_OUTPUT=true -e N8N_API_URL="https://agenticengineeringllc.app.n8n.cloud" -e N8N_API_KEY="$N8N_API_KEY" -- npx -y n8n-mcp
```

### 2E: AI & Creative (6 servers)
```bash
claude mcp add mcp-kling --scope user -e KLING_ACCESS_KEY="$KLING_ACCESS_KEY" -e KLING_SECRET_KEY="$KLING_SECRET_KEY" -- npx -y mcp-kling@latest

claude mcp add magic --scope user -- npx -y @21st-dev/magic@latest

claude mcp add gemini --scope user -e GEMINI_API_KEY="$GEMINI_API_KEY" -- npx -y @rlabs-inc/gemini-mcp

claude mcp add elevenlabs --scope user -- uvx elevenlabs-mcp

claude mcp add excalidraw --scope user -- npx -y @scofieldfree/excalidraw-mcp

claude mcp add krea --scope user -- npx -y krea-mcp
```

### 2F: Content & Social (3 servers)
```bash
claude mcp add youtube-transcript --scope user -- npx -y @fabriqa.ai/youtube-transcript-mcp@latest

claude mcp add crosspost --scope user -- npx -y @humanwhocodes/crosspost --mcp

claude mcp add canva-dev --scope user -- npx -y @canva/cli@latest mcp
```

### 2G: Cloudflare Suite (3 servers)
```bash
claude mcp add cloudflare-docs --scope user -- npx -y mcp-remote https://docs.mcp.cloudflare.com/mcp

claude mcp add cloudflare-radar --scope user -- npx -y mcp-remote https://radar.mcp.cloudflare.com/mcp

claude mcp add cloudflare-browser --scope user -- npx -y mcp-remote https://browser.mcp.cloudflare.com/mcp
```

### 2H: Data & Scraping (2 servers)
```bash
claude mcp add brightdata --scope user -- npx -y @brightdata/mcp

claude mcp add trendradar --scope user -- uv --directory /Users/henryvantieghem/Developer/mcp/trendradar run python -m mcp_server.server
```

### 2I: Finance & Trading (4 servers)
```bash
claude mcp add coingecko --scope user -- npx -y mcp-remote https://mcp.api.coingecko.com/mcp

claude mcp add fred --scope user -e FRED_API_KEY="$FRED_API_KEY" -- npx -y fred-mcp-server

claude mcp add alpaca --scope user -e ALPACA_API_KEY="$ALPACA_API_KEY" -e ALPACA_SECRET_KEY="$ALPACA_SECRET_KEY" -e ALPACA_PAPER_TRADE=True -- uvx alpaca-mcp-server serve

claude mcp add financial-datasets --scope user -- uv --directory /Users/henryvantieghem/Developer/mcp/financial-datasets-mcp run server.py
```

### 2J: Business Intelligence & Sales (5 servers)
```bash
claude mcp add builtwith --scope user -e BUILTWITH_API_KEY="$BUILTWITH_API_KEY" -- npx -y @nicholasoxford/builtwith-mcp

claude mcp add explorium --scope user -e EXPLORIUM_API_KEY="$EXPLORIUM_API_KEY" -- npx -y @explorium/mcp-server

claude mcp add apollo --scope user -- uv run --directory /Users/henryvantieghem/mcp-servers/apollo-mcp-server python -m apollo_mcp.server

claude mcp add mcp-clay-waterfall --scope user -- node /Users/henryvantieghem/agenticengineeringconsultingllc/mcp-servers/mcp-clay-waterfall/build/index.js

claude mcp add grok --scope user -- uv --directory /Users/henryvantieghem/Developer/mcp/grok-mcp run python main.py
```

### 2K: Google Workspace (1 server — hardened, local Python)
```bash
# IMPORTANT: Uses 'uv run --directory' with '--single-user' flag
claude mcp add hardened-workspace --scope user -- uv run --directory /Users/henryvantieghem/agenticengineeringconsultingllc/hardened-google-workspace-mcp python -m main --single-user
```

### 2L: Real Estate & Domains (2 servers — local Node.js)
```bash
claude mcp add mcp-domain-radar --scope user -e WHOISXML_API_KEY="$WHOISXML_API_KEY" -- node /Users/henryvantieghem/agenticengineeringconsultingllc/mcp-servers/mcp-domain-radar/build/index.js

claude mcp add mcp-property-intelligence --scope user -e ATTOM_API_KEY="$ATTOM_API_KEY" -e ZILLOW_API_KEY="$ZILLOW_API_KEY" -- node /Users/henryvantieghem/agenticengineeringconsultingllc/mcp-servers/mcp-property-intelligence/build/index.js
```

### 2M: Crypto & Trading (1 server — local Node.js)
```bash
claude mcp add pumpfun --scope user -e HELIUS_RPC_URL="$HELIUS_RPC_URL" -- node /Users/henryvantieghem/agenticengineeringconsultingllc/mcp/pumpfun-mcp/build/index.js
```

### 2N: HTTP MCPs (7 servers — require OAuth via /mcp after adding)
```bash
# These use HTTP transport and need OAuth authentication in-app
claude mcp add rube --scope user --type http --url "https://rube.app/mcp"
claude mcp add hunter --scope user --type http --url "https://mcp.hunter.io/mcp"
claude mcp add pipedream --scope user --type http --url "https://mcp.pipedream.net/v2"
claude mcp add figma --scope user --type http --url "https://mcp.figma.com/mcp"
claude mcp add semrush --scope user --type http --url "https://mcp.semrush.com/v1/mcp"
claude mcp add sentry --scope user --type http --url "https://mcp.sentry.dev/mcp"
claude mcp add canva --scope user --type http --url "https://mcp.canva.com/mcp"
```

After adding HTTP MCPs, run `/mcp` in Claude Code to authenticate each one.

---

## SECTION 3: Plugin Marketplaces (24 total)

### GitHub-hosted Marketplaces
```bash
# Official / Major
claude plugin add-marketplace https://github.com/anthropics/claude-plugins-official
claude plugin add-marketplace https://github.com/anthropics/claude-code.git
claude plugin add-marketplace https://github.com/ccplugins/awesome-claude-code-plugins
claude plugin add-marketplace https://github.com/obra/superpowers.git
claude plugin add-marketplace https://github.com/softaworks/agent-toolkit
claude plugin add-marketplace https://github.com/CharlesWiltgen/Axiom.git
claude plugin add-marketplace https://github.com/ivan-magda/claude-code-marketplace
claude plugin add-marketplace https://github.com/EveryInc/compound-engineering-plugin.git

# Skills & Agents
claude plugin add-marketplace https://github.com/AvdLee/SwiftUI-Agent-Skill
claude plugin add-marketplace https://github.com/AvdLee/Swift-Concurrency-Agent-Skill
claude plugin add-marketplace https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
claude plugin add-marketplace https://github.com/conorluddy/xclaude-plugin
claude plugin add-marketplace https://github.com/kylehughes/apple-platform-build-tools-claude-code-plugin
claude plugin add-marketplace https://github.com/lackeyjb/playwright-skill
claude plugin add-marketplace https://github.com/mvanhorn/last30days-skill
claude plugin add-marketplace https://github.com/createsomethingtoday/claude-plugins

# Domain-Specific
claude plugin add-marketplace https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering
claude plugin add-marketplace https://github.com/coreyhaines31/marketingskills
claude plugin add-marketplace https://github.com/czlonkowski/n8n-skills
claude plugin add-marketplace https://github.com/glittercowboy/taches-cc-resources
claude plugin add-marketplace https://github.com/f/prompts.chat
claude plugin add-marketplace https://github.com/0xdesign/design-plugin
claude plugin add-marketplace https://github.com/kingbootoshi/codex-orchestrator
```

### Local Marketplace Repos (clone first)
```bash
git clone https://github.com/anthropics/oh-my-claudecode.git ~/.claude/plugins/repos/oh-my-claudecode
claude plugin add-marketplace --directory ~/.claude/plugins/repos/oh-my-claudecode

git clone https://github.com/geoffreyhuntley/ralph.git ~/.claude/plugins/repos/ralph
claude plugin add-marketplace --directory ~/.claude/plugins/repos/ralph

# Claude Code Plugins Plus (check source URL)
git clone <PLUGINS_PLUS_REPO_URL> ~/.claude/plugins/repos/claude-code-plugins-plus-skills
claude plugin add-marketplace --directory ~/.claude/plugins/repos/claude-code-plugins-plus-skills

# Claude Flow
git clone <CLAUDE_FLOW_REPO_URL> ~/.claude/plugins/repos/claude-flow
claude plugin add-marketplace --directory ~/.claude/plugins/repos/claude-flow
```

---

## SECTION 4: Install & Enable Plugins (48 total)

### Always-Enabled (13 plugins)
```bash
claude plugin enable "swiftui-expert@swiftui-expert-skill"
claude plugin enable "context7@claude-plugins-official"
claude plugin enable "apple-platform-build-tools@apple-platform-build-tools"
claude plugin enable "swift-lsp@claude-plugins-official"
claude plugin enable "project-shipper@awesome-claude-code-plugins"
claude plugin enable "context-engineering-fundamentals@context-engineering-marketplace"
claude plugin enable "swift-concurrency@swift-concurrency-agent-skill"
claude plugin enable "ui-ux-pro-max@ui-ux-pro-max-skill"
claude plugin enable "code-simplifier@claude-plugins-official"
claude plugin enable "explanatory-output-style@claude-plugins-official"
claude plugin enable "xclaude-plugin@xclaude-plugin-marketplace"
claude plugin enable "taches-cc-resources@taches-cc-resources"
claude plugin enable "last30days@last30days-skill"
```

### Installed but Disabled (35 plugins — enable as needed)
```bash
claude plugin install "supabase@claude-plugins-official"
claude plugin install "n8n-mcp-skills@n8n-mcp-skills"
claude plugin install "frontend-design@claude-plugins-official"
claude plugin install "superpowers@claude-plugins-official"
claude plugin install "agent-ui-ux-designer@agent-toolkit"
claude plugin install "ai-engineer@awesome-claude-code-plugins"
claude plugin install "ceo-quality-controller-agent@awesome-claude-code-plugins"
claude plugin install "design-system-starter@agent-toolkit"
claude plugin install "frontend-developer@awesome-claude-code-plugins"
claude plugin install "mui@agent-toolkit"
claude plugin install "sprint@claude-code-plugins-plus"
claude plugin install "ui-designer@awesome-claude-code-plugins"
claude plugin install "web-dev@awesome-claude-code-plugins"
claude plugin install "writing-clearly-and-concisely@agent-toolkit"
claude plugin install "agent-architecture@context-engineering-marketplace"
claude plugin install "agent-development@context-engineering-marketplace"
claude plugin install "agent-evaluation@context-engineering-marketplace"
claude plugin install "cognitive-architecture@context-engineering-marketplace"
claude plugin install "frontend-design@claude-code-plugins"
claude plugin install "ralph-loop@claude-plugins-official"
claude plugin install "playwright@claude-plugins-official"
claude plugin install "superpowers@superpowers-dev"
claude plugin install "marketing-skills@marketingskills"
claude plugin install "prompts.chat@prompts.chat"
claude plugin install "design-and-refine@design-plugins"
claude plugin install "codex-orchestrator@codex-orchestrator-marketplace"
claude plugin install "feature-dev@claude-plugins-official"
claude plugin install "commit-commands@claude-plugins-official"
claude plugin install "planning-prd-agent@awesome-claude-code-plugins"
claude plugin install "prd-specialist@awesome-claude-code-plugins"
claude plugin install "coding-tutor@every-marketplace"
claude plugin install "compound-engineering@every-marketplace"
claude plugin install "n8n-workflow-builder@awesome-claude-code-plugins"
claude plugin install "n8n-workflow-designer@claude-code-plugins-plus"
claude plugin install "playwright-skill@playwright-skill"
```

---

## SECTION 5: Global Settings

```bash
claude config set env.CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS 1
claude config set alwaysThinkingEnabled true
claude config set toolSearchEnabled true
claude config set experimental.agentTeams true
claude config set permissions.defaultMode bypassPermissions
claude config set allowedTools '["*"]'
claude config set skipDangerousModePermissionPrompt true
```

---

## SECTION 6: Safety Hook (rm -rf Protection)

The PreToolUse hook in `~/.claude/settings.json` blocks destructive `rm -rf` commands:

```json
{
  "hooks": {
    "PreToolUse": [{
      "matcher": "Bash",
      "hooks": [{
        "type": "command",
        "command": "if echo \"$CLAUDE_TOOL_INPUT\" | grep -qE 'rm\\\\s+(-[^\\\\s]*)?r[^\\\\s]*f|rm\\\\s+(-[^\\\\s]*)?f[^\\\\s]*r'; then echo 'BLOCKED: Use trash instead of rm -rf' >&2; exit 2; fi"
      }]
    }]
  }
}
```

---

## SECTION 7: Co-Work Setup (Claude.ai Integration)

### Enable Co-Work
1. Open Claude Code CLI
2. Run `/co-work` or enable from the menu
3. All user-scope MCP servers are automatically shared with Claude.ai

### Full Server Inventory for Co-Work

**56 MCP Servers at User Scope (available via co-work):**

| # | Server | Type | Category | Status |
|---|--------|------|----------|--------|
| 1 | github | stdio | Core | Connected |
| 2 | supabase | http | Core | Connected (needs OAuth) |
| 3 | stripe | http | Core | Needs auth |
| 4 | memory | stdio | Core | Connected |
| 5 | filesystem | stdio | Core | Connected |
| 6 | sequential-thinking | stdio | Core | Connected |
| 7 | context7 | stdio | Research | Connected |
| 8 | remotion-documentation | stdio | Research | Connected |
| 9 | firecrawl | stdio | Research | Connected |
| 10 | exa | stdio | Research | Connected |
| 11 | tavily | stdio | Research | Connected |
| 12 | google-trends | stdio | Research | Connected |
| 13 | deep-graph | stdio | Research | Connected |
| 14 | browsermcp | stdio | Browser | Connected |
| 15 | playwright | stdio | Browser | Connected |
| 16 | chrome-devtools | stdio | Browser | Needs fix |
| 17 | mobile-mcp | stdio | Browser | Connected |
| 18 | netlify | stdio | Deploy | Connected |
| 19 | apify | stdio | Scraping | Connected |
| 20 | n8n-native | stdio | Automation | Connected |
| 21 | n8n-mcp | stdio | Automation | Connected |
| 22 | mcp-kling | stdio | AI/Creative | Connected |
| 23 | magic | stdio | AI/Creative | Connected |
| 24 | gemini | stdio | AI/Creative | Needs GEMINI_API_KEY |
| 25 | elevenlabs | stdio | AI/Creative | Connected |
| 26 | excalidraw | stdio | AI/Creative | Connected |
| 27 | krea | stdio | AI/Creative | Needs KREA_API_KEY |
| 28 | youtube-transcript | stdio | Content | Connected |
| 29 | crosspost | stdio | Content | Connected |
| 30 | canva-dev | stdio | Content | Connected |
| 31 | cloudflare-docs | stdio | Cloudflare | Connected |
| 32 | cloudflare-radar | stdio | Cloudflare | Connected |
| 33 | cloudflare-browser | stdio | Cloudflare | Connected |
| 34 | brightdata | stdio | Data | Connected |
| 35 | trendradar | stdio | Data | Needs fix |
| 36 | coingecko | stdio | Finance | Connected |
| 37 | fred | stdio | Finance | Connected |
| 38 | alpaca | stdio | Finance | Connected |
| 39 | financial-datasets | stdio | Finance | Connected |
| 40 | builtwith | stdio | Business | Connected |
| 41 | explorium | stdio | Business | Connected |
| 42 | apollo | stdio | Business | Connected |
| 43 | mcp-clay-waterfall | stdio | Business | Connected |
| 44 | grok | stdio | Business | Connected |
| 45 | hardened-workspace | stdio | Google | Connected |
| 46 | mcp-domain-radar | stdio | Real Estate | Connected |
| 47 | mcp-property-intelligence | stdio | Real Estate | Connected |
| 48 | pumpfun | stdio | Crypto | Connected |
| 49 | rube | http | Integration | Connected |
| 50 | hunter | http | Sales | Needs auth |
| 51 | pipedream | http | Automation | Needs auth |
| 52 | figma | http | Design | Needs auth |
| 53 | semrush | http | SEO | Needs auth |
| 54 | sentry | http | Monitoring | Needs auth |
| 55 | canva | http | Design | Needs auth |
| 56 | (notion) | http | (Claude.ai built-in) | Needs auth |

**Plugin-Provided MCPs (auto-managed, 10 servers):**
- plugin:context7:context7 (from context7 plugin)
- plugin:xclaude-plugin:xc-setup (from xclaude-plugin)
- plugin:xclaude-plugin:xc-build
- plugin:xclaude-plugin:xc-interact
- plugin:xclaude-plugin:xc-launch
- plugin:xclaude-plugin:xc-ai-assist
- plugin:xclaude-plugin:xc-testing
- plugin:xclaude-plugin:xc-meta
- plugin:xclaude-plugin:xc-all
- claude.ai:Context7 (Claude.ai built-in)

---

## SECTION 8: Post-Setup OAuth Authentication

After all servers and plugins are installed, authenticate HTTP MCPs:

```
# In Claude Code, run /mcp and authenticate each:
1. Supabase — sign in with Supabase account
2. Stripe — sign in with Stripe account
3. Figma — sign in with Figma account
4. Semrush — sign in with Semrush account
5. Sentry — sign in with Sentry account
6. Canva — sign in with Canva account
7. Pipedream — sign in with Pipedream account
8. Hunter — sign in with Hunter.io account
9. Rube (Composio) — sign in with Composio account
10. Notion — authenticate via Claude.ai settings
```

---

## SECTION 9: Verification

```bash
# Full health check
claude mcp list

# Check plugins
claude plugin list --enabled

# Test co-work connection
claude --co-work
```

### Smoke Tests
1. **GitHub:** "List my repos"
2. **Supabase:** "List tables"
3. **Firecrawl:** "Scrape https://example.com"
4. **Gmail:** "Check my inbox" (hardened-workspace)
5. **Context7:** "Look up React docs"
6. **Apify:** "Search for Google Maps scraper"
7. **ElevenLabs:** "List available voices"
8. **CoinGecko:** "Get Bitcoin price"
9. **Cloudflare Radar:** "Get HTTP traffic data for US"

---

## Summary

| Category | Count |
|----------|-------|
| User-scope MCP servers | 56 |
| Plugin-provided MCP servers | 10 |
| HTTP MCPs needing OAuth | 9 |
| Plugin marketplaces | 24 |
| Plugins installed | 48 |
| Plugins enabled | 13 |
| Safety hooks | 1 (rm -rf blocker) |
| Experimental features | 3 (Agent Teams, Tool Search, Always Thinking) |

**Total MCP capacity: 66+ servers**

---

*Generated for Agentic Engineering Consulting LLC — Henry Vantieghem*
*Last updated: 2026-02-14*
