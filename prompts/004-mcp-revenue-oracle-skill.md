<objective>
Create a production-ready Claude Code skill AND slash command called `/mcp-oracle` — a reusable, orchestrated research engine that discovers and evaluates high-value MCP servers, APIs, and data sources for revenue generation.

This skill should be the "intelligence arm" of Agentic Engineering Consulting — run it anytime to scan the landscape for new data sources, APIs, and MCP servers worth connecting to. It should function as a living, evolving capability that gets smarter each time it runs.

Read the research output at `./research/high-value-mcp-api-landscape.md` first to understand the full landscape before building the skill.
</objective>

<context>
This builds on the research from prompt 003. The skill should encode the research methodology into a repeatable, parameterized workflow that:
1. Scans for new MCP servers across registries and GitHub
2. Evaluates APIs by revenue potential, data richness, and build complexity
3. Cross-references against our already-installed MCP servers (34 currently)
4. Outputs prioritized recommendations with actionable next steps
5. Can focus on specific verticals (crypto, real estate, leads, etc.) via arguments

Our existing skill architecture:
- Skills live in `.claude/skills/` as `SKILL.md` files in subdirectories
- Slash commands live in `.claude/commands/` as `.md` files
- Skills use XML structure with `<skill>` root tags
- Commands use YAML frontmatter + markdown body
- We have 16+ skills and 18+ commands already

Reference our existing high-performing skills for patterns:
- `/drop` (`.claude/commands/drop.md`) — multi-phase orchestration
- `/deep-outreach` (`.claude/skills/deep-outreach/SKILL.md`) — 11-agent architecture
- `/serve` — daily client operations pattern
</context>

<requirements>

<skill_spec>
Create `.claude/skills/mcp-oracle/SKILL.md` with:

1. **Multi-mode operation** (like /syba has daily/prospect/content modes):
   - `scan` — Full landscape sweep (runs all phases from 003 research prompt)
   - `vertical {name}` — Deep dive into one vertical (crypto, leads, real-estate, etc.)
   - `evaluate {api-name}` — Single API/MCP deep evaluation
   - `build {api-name}` — Generate MCP server scaffold for a specific API
   - `compare` — Side-by-side comparison of top candidates

2. **Orchestration architecture** (5+ specialized agents):
   - **Registry Scanner Agent**: Scrapes MCP registries, GitHub, awesome-lists
   - **API Evaluator Agent**: Assesses each API on revenue potential, data richness, cost
   - **Competitive Intel Agent**: Researches what top AI agencies use
   - **MCP Builder Agent**: Generates scaffolding for custom MCP servers
   - **Synthesis Agent**: Combines all findings into prioritized report

3. **Data sources to query** (in parallel where possible):
   - WebSearch for landscape scanning
   - GitHub MCP for repo discovery (search_repositories, search_code)
   - Firecrawl for deep API documentation scraping
   - Apify for structured directory scraping
   - Context7 for MCP protocol documentation
   - Memory MCP for persisting findings across runs

4. **Output formats**:
   - Markdown report saved to `./research/mcp-oracle/{date}-{mode}.md`
   - Summary table with scores (revenue potential, data richness, ease of integration)
   - Action items with specific next steps
   - Optional: Supabase table insert for tracking discoveries over time

5. **Reinforcement learning pattern**:
   - After each run, append findings to a cumulative knowledge file: `./research/mcp-oracle/KNOWLEDGE_BASE.md`
   - On subsequent runs, load the knowledge base to avoid re-discovering known APIs
   - Track which recommendations were acted on and their outcomes
   - Score adjustments: if we installed an MCP and it was valuable, boost similar categories
</skill_spec>

<command_spec>
Create `.claude/commands/mcp-oracle.md` as the slash command entry point:

```yaml
---
description: "MCP Oracle — discover and evaluate high-value MCP servers and APIs for revenue generation"
allowed-tools: WebSearch, WebFetch, Bash, Read, Write, Edit, Task, Grep, Glob
---
```

The command should:
- Parse arguments to determine mode (scan/vertical/evaluate/build/compare)
- Load the SKILL.md and execute the appropriate mode
- Default to `scan` if no arguments provided
- Pass vertical name or API name as context to the skill
</command_spec>

<mcp_builder_integration>
The `build` mode should generate a complete MCP server scaffold:
- Use our existing `/mcp-builder` skill pattern
- Generate a TypeScript MCP server using the official SDK
- Include tool definitions based on API endpoints
- Include authentication handling (API key, OAuth, etc.)
- Generate a README with setup instructions
- Output to `./mcp-servers/{api-name}/`
</mcp_builder_integration>

</requirements>

<implementation>
1. Read existing skill files for pattern reference:
   - `.claude/skills/deep-outreach/SKILL.md` (multi-agent orchestration)
   - `.claude/commands/drop.md` (complex slash command)
   - `.claude/skills/mcp-builder/SKILL.md` (MCP server generation)

2. Read the research output for content reference:
   - `./research/high-value-mcp-api-landscape.md`

3. Build the skill with these design principles:
   - **Parallel execution**: All independent research queries run simultaneously
   - **Progressive disclosure**: Summary first, details on demand
   - **Cumulative learning**: Knowledge base grows with each run
   - **Revenue-first scoring**: Every API scored by money-making potential
   - **Actionable output**: Not just "here's what exists" but "here's what to do next"

4. The skill should be self-improving:
   - Track run history in `./research/mcp-oracle/RUN_LOG.md`
   - Each run logs: date, mode, findings count, new discoveries, recommendations acted on
   - Load previous run data to focus on what's NEW since last scan
</implementation>

<output>
Create these files:
- `.claude/skills/mcp-oracle/SKILL.md` — The full skill definition
- `.claude/commands/mcp-oracle.md` — The slash command entry point
- `./research/mcp-oracle/KNOWLEDGE_BASE.md` — Initial knowledge base seeded from 003 research
- `./research/mcp-oracle/RUN_LOG.md` — Empty run log template
</output>

<verification>
Before completing:
- Skill file follows existing project patterns (check against deep-outreach SKILL.md)
- Command file has valid YAML frontmatter
- All 5 modes are documented and implemented
- Agent architecture is clearly defined with parallel execution opportunities
- Knowledge base is properly seeded from research
- Run log template is ready for first execution
- Self-improvement loop is coded into the skill
</verification>

<success_criteria>
- Running `/mcp-oracle` performs a full landscape scan
- Running `/mcp-oracle vertical crypto` deep-dives into crypto APIs
- Running `/mcp-oracle evaluate crunchbase` evaluates a single API
- Running `/mcp-oracle build zillow` scaffolds a custom MCP server
- Running `/mcp-oracle compare` shows side-by-side comparison
- Knowledge base accumulates across runs
- Output is revenue-focused and actionable
</success_criteria>
