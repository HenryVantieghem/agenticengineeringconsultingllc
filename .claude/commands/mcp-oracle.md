---
description: "MCP Oracle — discover and evaluate high-value MCP servers and APIs for revenue generation"
allowed-tools: WebSearch, WebFetch, Bash, Read, Write, Edit, Task, Grep, Glob
---

# /mcp-oracle — Revenue Intelligence Engine

You are executing the MCP Oracle skill. Load and follow the full skill definition at `.claude/skills/mcp-oracle/SKILL.md`.

## Mode Detection

Parse the arguments to determine which mode to run:

| Input | Mode | Description |
|---|---|---|
| `/mcp-oracle` | scan | Full landscape sweep (default) |
| `/mcp-oracle scan` | scan | Full landscape sweep (explicit) |
| `/mcp-oracle vertical {name}` | vertical | Deep dive into one vertical |
| `/mcp-oracle evaluate {api}` | evaluate | Single API deep evaluation |
| `/mcp-oracle build {api}` | build | Generate MCP server scaffold |
| `/mcp-oracle compare` | compare | Side-by-side top candidates |

**Arguments received:** $ARGUMENTS

## Execution Steps

1. **Load the skill:** Read `.claude/skills/mcp-oracle/SKILL.md` completely.

2. **Load the knowledge base:** Read `./research/mcp-oracle/KNOWLEDGE_BASE.md` to load all previous discoveries. If the file does not exist, create it from the template in the skill.

3. **Load the run log:** Read `./research/mcp-oracle/RUN_LOG.md` to check last run date and findings. If the file does not exist, create it from the template in the skill.

4. **Determine mode:** Parse `$ARGUMENTS` using the table above.
   - If no arguments: run `scan` mode.
   - If first argument is `vertical`: extract the vertical name from the second argument.
   - If first argument is `evaluate`: extract the API name from the second argument.
   - If first argument is `build`: extract the API name from the second argument.
   - If first argument is `compare`: run `compare` mode.
   - If unrecognized argument: show usage table and ask for clarification.

5. **Execute the appropriate mode** as defined in SKILL.md Parts 3-7:
   - **scan:** Run Agents 1 -> 2 -> 3 -> 5 (with parallelism per Part 9)
   - **vertical:** Run Agents 1 -> 2 -> 5 (focused on single vertical)
   - **evaluate:** Run Agents 2 -> 3 -> 5 (single API)
   - **build:** Run Agents 2 -> 4 -> 5
   - **compare:** Run Agent 5 only (reads knowledge base)

6. **Save outputs:**
   - Report: `./research/mcp-oracle/{date}-{mode}.md`
   - Knowledge base: update `./research/mcp-oracle/KNOWLEDGE_BASE.md`
   - Run log: append to `./research/mcp-oracle/RUN_LOG.md`

7. **Print summary dashboard** as defined in SKILL.md Part 7, Step 5.

## Valid Vertical Names

When running `vertical` mode, these are the valid vertical names:

- `crypto` — Cryptocurrency, blockchain, DeFi, trading APIs
- `leads` — Lead generation, contact enrichment, sales intelligence
- `real-estate` — Property data, MLS, assessor records
- `legal` — Court records, case law, compliance
- `healthcare` — Medical data, provider info, NPI
- `financial` — Financial data, credit, business intelligence
- `government` — Government contracts, SAM.gov, FOIA
- `social` — Social media monitoring, brand mentions
- `hiring` — Job postings, hiring signals, workforce data
- `reviews` — Business reviews, reputation, sentiment
- `property` — Property records, ownership, tax assessor
- `competitive-intel` — Company data, tech stack, web traffic

If an unrecognized vertical is provided, suggest the closest match from the list above.
