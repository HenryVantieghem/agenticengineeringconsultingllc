# MCP Zero-Cost Expansion — Claude Code Prompt

Copy and paste everything below the line into Claude Code to generate an executable plan for expanding the MCP stack at $0 cost.

---

You are planning an MCP (Model Context Protocol) expansion for the agenticengineeringconsultingllc repo. Your goal is to produce an **executable plan** that achieves maximum MCP coverage using **only zero-cost options** in two ways:

1. **Install existing MCP servers** that are free or have generous free tiers
2. **Build custom MCP servers** that wrap only free APIs

## Step 1: Read Source of Truth

1. Read `research/high-value-mcp-api-landscape.md` in full
2. Read `.mcp.json` to see what is already installed
3. Optionally inspect `mcp-servers/mcp-domain-radar/` and `mcp-servers/mcp-clay-waterfall/` to understand the custom server structure (TypeScript, @modelcontextprotocol/sdk)

## Step 2: Extract Two Lists

From the research file, extract:

**List A — Free MCP servers to install**
- Include only servers with "Free tier", "Free", "No API key", or "Free (public API)" in the Free Tier column
- Exclude any server already present in `.mcp.json`
- For each: name, data type, install method (npx/uvx/mcp-remote/HTTP URL)

**List B — APIs to wrap as custom MCP servers**
- Include only APIs marked "Free", "Free (open)", "Free (public)", or "Free tier" that have "NEEDS_BUILDING" and no existing MCP
- Exclude any API that requires paid signup or has no free tier
- For each: API name, category, free tier details, suggested tool names

## Step 3: Produce the Plan

Output a structured plan with these sections:

### 3.1 Executive Summary
- Total number of free MCP installs
- Total number of custom MCP builds
- Estimated time (installs: ~15 min each; custom builds: Simple 1 day, Medium 2–3 days, Complex 1 week)
- Total estimated cost: $0

### 3.2 Install Plan (List A)

For each server in List A, provide:

1. **Server name** (e.g., `sec-edgar`, `jobspy`)
2. **Install command** — Exact `npx`, `uvx`, or `mcp-remote` command, or HTTP URL for `type: "http"`
3. **Environment variables** — If required, use `${VAR}` expansion. State how to obtain free API keys (URL, signup flow)
4. **`.mcp.json` entry** — Valid JSON snippet ready to merge into `mcpServers`, e.g.:
   ```json
   "sec-edgar": {
     "command": "npx",
     "args": ["-y", "sec-edgar-mcp"],
     "env": {}
   }
   ```
5. **Install order** — Put no-env-vars servers first, then those requiring free API keys

**Priority free MCPs from research (verify availability):**
- Bright Data Web MCP
- SEC EDGAR MCP
- JobSpy MCP
- USASpending MCP
- Google Business Profile MCP
- Product Hunt MCP
- YouTube Transcript MCP
- arXiv MCP
- Alpha Vantage MCP (25 req/day free)
- Polygon.io MCP (5 req/min free)
- OpenWeatherMap MCP
- Hunter.io MCP (25 searches/mo free)
- Notion MCP
- HubSpot MCP (free CRM)
- Perplexity MCP (only if free tier exists — verify)

### 3.3 Custom Build Plan (List B)

For each custom MCP that uses **only free APIs**, provide:

1. **Server name** (e.g., `mcp-government-contracts`)
2. **APIs wrapped** — All must be free. List each API and its free tier
3. **Tools** — Tool names and input schemas (parameters with types)
4. **Build effort** — Simple (1 day) / Medium (2–3 days) / Complex (1 week)
5. **Directory** — `mcp-servers/{name}/`
6. **Build steps** — High-level: init project, add API clients, implement tools, register with MCP SDK, build, add to `.mcp.json`
7. **Verification** — How to test the server (e.g., invoke one tool and check output)

**Free-only custom builds from research:**
- **mcp-government-contracts** — USASpending API + SAM.gov API (both free). Tools: `search_opportunities`, `get_contract_awards`, `track_incumbent_contracts`, `get_spending_by_agency`
- **mcp-financial-intelligence** — FRED + SEC EDGAR + CoinGecko + Polygon free tier + Alpha Vantage free. Tools: `get_market_snapshot`, `analyze_company_financials`, `get_insider_trades`, `track_economic_indicators`
- **mcp-social-listening** (MVP) — Reddit API + Google Trends (both free). Tools: `search_reddit`, `get_trending_topics`, `analyze_sentiment`
- **mcp-hiring-intelligence** — JobSpy (free). If JobSpy MCP exists, consider aggregator; otherwise build wrapper
- **mcp-defi-llama** — DeFi Llama API (free, open). Tools: `get_tvl`, `get_protocols`, `get_chains`
- **mcp-political-intelligence** — FEC API + OpenSecrets API (both free). Tools: `get_donations`, `get_lobbying_expenditures`

### 3.4 Verification Checklist

- How to run `claude mcp list` (or equivalent) to confirm servers are connected
- For each install: one example tool invocation to verify it works
- For each custom build: one example tool call and expected output shape

### 3.5 Rollback

- How to remove an entry from `.mcp.json` if a server fails or is unwanted
- How to disable a custom server (comment out or delete its block)

## Constraints

- **Zero cost only** — Exclude any MCP or API that requires paid signup, has no free tier, or is enterprise-only
- **No hardcoded secrets** — Always use `${VAR}` expansion in configs; document env vars
- **Match existing patterns** — Custom servers: TypeScript, `@modelcontextprotocol/sdk`, structure like `mcp-domain-radar`
- **Ask before adding npm deps** — Per project CLAUDE.md, ask before running `npm install` for new packages

## Output

Write the plan to a new file: `research/mcp-zero-cost-expansion-plan-YYYY-MM-DD.md` (use today's date). The plan should be copy-paste executable: a human or agent can follow it step-by-step to install servers and build custom MCPs without additional research.
