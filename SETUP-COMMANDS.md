# Claude Code Setup Commands — Quick Reference
> Run these on your Mac in Claude Code terminal (not Cowork)

## MCP Servers Already Configured in .mcp.json
These will activate automatically when you restart Claude Code:

| Server | Status |
|--------|--------|
| n8n-native | ✅ Already configured |
| n8n-mcp | ✅ Already configured |
| Supabase | ✅ Already configured |
| GitHub | ✅ NEW — just added with your token |
| BrowserMCP | ✅ NEW — browser automation |
| Stripe | ✅ NEW — payment management |
| Memory | ✅ NEW — persistent knowledge graph |
| Filesystem | ✅ NEW — local file operations |
| Sequential Thinking | ✅ NEW — structured reasoning |
| Context7 | ✅ NEW — docs search |
| Firecrawl | ✅ NEW — web scraping |
| Playwright | ✅ NEW — web automation & testing |

## MCP Servers to Add Manually on Your Mac

### iMessage (requires macOS + Full Disk Access)
```bash
claude mcp add-json messages '{"command":"uvx","args":["mac-messages-mcp"]}'
```
Then: System Settings → Privacy → Full Disk Access → Add your terminal app

### Stripe (requires your Stripe secret key)
```bash
# Get your key from: dashboard.stripe.com → Developers → API Keys
# Then add to .env:
echo 'STRIPE_SECRET_KEY=sk_live_your_key_here' >> .env
```

### HubSpot (upgrade to proper MCP)
```bash
claude mcp add hubspot -- npx -y @anthropic/mcp-hubspot
# Uses your existing HUBSPOT_API_KEY from .env
```

## Skills Already Installed
| Skill | Source |
|-------|--------|
| frontend-design | anthropics/claude-code |
| find-skills | vercel-labs/skills |
| skill-development | anthropics/claude-code |
| founder-sales | refoundai/lenny-skills |
| apify-lead-generation | apify/agent-skills |

## Skills to Install on Your Mac
Run these in your project directory:

```bash
# Sales & Outreach
npx skills add refoundai/lenny-skills@sales-qualification -y
npx skills add refoundai/lenny-skills@enterprise-sales -y
npx skills add refoundai/lenny-skills@product-led-sales -y

# Marketing & Content
npx skills add vasilyu1983/ai-agents-public@marketing-leads-generation -y
npx skills add sanky369/vibe-building-skills@lead-magnet -y

# Development & Design
npx skills add anthropics/claude-code@web-design-guidelines -y
npx skills add davila7/claude-code-templates@nodejs-best-practices -y

# Productivity
npx skills add olafgeibig/skills@skill-builder -y

# Search for more:
npx skills find "consulting"
npx skills find "outreach"
npx skills find "crm"
npx skills find "automation"
```

## Plugin Marketplaces to Browse
- **skills.sh** — 56,000+ skills: https://skills.sh
- **awesome-claude-code-toolkit** — 135 agents, 120 plugins: https://github.com/rohitg00/awesome-claude-code-toolkit
- **awesome-mcp-servers** — 1,200+ servers: https://github.com/punkpeye/awesome-mcp-servers
- **mcpservers.org** — Verified directory: https://mcpservers.org
- **mcp.so** — Search & discover: https://mcp.so
- **Anthropic skills** — Official: https://github.com/anthropics/skills

## Your Daily Commands Cheat Sheet
```
/revenue-engine    → 20 deep-researched prospects + personalized emails
/serve             → Daily client lead intelligence delivery
/daily-hustle      → Full pipeline automation + action items
/activate          → One-shot: URL → live client dashboard
/contract          → Generate agreement + Stripe payment links
/drop              → LeadDrop rotation for multi-client leads
/marketing-daily   → Social media content generation
/save-conversation → Archive session for continuity
```

## Restart Claude Code After Setup
After running these commands, restart Claude Code for all MCP servers to connect:
```bash
# In your terminal
cd ~/path/to/agenticengineeringconsultingllc
claude
```
