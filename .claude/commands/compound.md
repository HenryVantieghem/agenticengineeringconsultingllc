---
description: "Compounding history reviewer — audits git history, command usage, pipeline metrics, and theoretical capacity to identify 10x growth levers"
---

# /compound — Compounding Intelligence Report

You are the compounding analyst for Agentic Engineering Consulting. Your job is to review everything that has been built, what has actually been used, what worked, what is dormant, and produce specific recommendations to 10x output. This is a read-only analysis command — you do not modify anything.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com

---

## Section 1: Git History Timeline

Run `git log --oneline --all` and `git log --stat --since="2 weeks ago"` to map every commit to a capability:

For each commit, categorize:
- **Infrastructure** — project setup, config, schema, MCP servers
- **Command/Skill** — new slash command or skill created
- **Client Work** — SYBA briefs, client dashboards, outreach sent
- **Content** — landing page, case study, starter kits, marketing
- **Pipeline** — leads contacted, emails sent, follow-ups

Present as a timeline:

```
GIT TIMELINE — Capability Build History
════════════════════════════════════════
[Date] [Hash] [Category] [Description]
[Date] [Hash] [Category] [Description]
...
════════════════════════════════════════
Total commits: [N]
Build velocity: [N] commits/day
Capabilities added: [N]
```

---

## Section 2: Usage Audit — Built vs. Used

Read the following to determine what has actually been run vs. what is dormant:

### Commands (`.claude/commands/`)
Read every `.md` file in `.claude/commands/`. For each command:
1. Check git log for evidence of the command being invoked (look for output files, Supabase records, or conversation logs in `conversations/`)
2. Check `leaddrop/ROTATION.md` for `/drop` run evidence
3. Check `syba/briefs/` for `/syba-daily` or `/serve` run evidence
4. Check `content-clients/` for `/content` run evidence

### Skills (`.claude/skills/`)
Read every `SKILL.md` in `.claude/skills/*/`. For each skill:
1. Check for any output artifacts that would indicate usage
2. Cross-reference with conversations in `conversations/`

Present as a table:

```
USAGE AUDIT
═══════════════════════════════════════════════════
Command/Skill       | Status    | Last Used  | Runs
═══════════════════════════════════════════════════
/drop               | [ACTIVE]  | [date]     | [N]
/serve              | [ACTIVE]  | [date]     | [N]
/activate           | [DORMANT] | never      | 0
/compound           | [NEW]     | today      | 1
/free-value-blitz   | [NEW]     | never      | 0
/content            | [DORMANT] | [date]     | [N]
/run-everything     | [DORMANT] | never      | 0
/deep-outreach      | [DORMANT] | never      | 0
/follow-up          | [DORMANT] | [date]     | [N]
...                 | ...       | ...        | ...
═══════════════════════════════════════════════════
ACTIVE: [N] / [Total]
DORMANT: [N] / [Total]
Utilization rate: [N]%
```

---

## Section 3: Output Metrics

Query actual output data from multiple sources:

### 3a. Supabase Pipeline
Use Supabase MCP `execute_sql` to query:

```sql
-- Total prospects contacted
SELECT count(*) as total, status, industry, city
FROM leaddrop_prospects
GROUP BY status, industry, city;

-- Emails sent timeline
SELECT date_trunc('day', email_sent_at) as day, count(*) as sent
FROM leaddrop_prospects
WHERE email_sent_at IS NOT NULL
GROUP BY day ORDER BY day;

-- SYBA lead count
SELECT count(*) as total FROM leads
WHERE client_id = 'ed91c1d0-8bc2-4be4-84ad-d9a3812f60fe';

-- SYBA briefings delivered
SELECT count(*) as total, max(created_at) as latest
FROM briefings
WHERE client_id = 'ed91c1d0-8bc2-4be4-84ad-d9a3812f60fe';
```

### 3b. LeadDrop Rotation
Read `leaddrop/ROTATION.md` and count:
- Slots completed vs. total slots
- Total businesses contacted across all runs
- Total free leads delivered (businesses x 5)

### 3c. Gmail Evidence
Use `search_gmail_messages` to search for:
- Emails sent from henry@agenticengineering.com with "leads" or "LeadDrop" in subject
- Replies received to outreach emails
- SYBA briefings sent

Present metrics:

```
OUTPUT METRICS
═══════════════════════════════════════════════
LEADDROP:
  Businesses contacted:     [N]
  Free leads delivered:     [N] (businesses x 5)
  Emails sent:              [N]
  Replies received:         [N]
  Reply rate:               [N]%
  Clients converted:        [N]
  Revenue from LeadDrop:    $[N]

SYBA:
  Leads researched:         [N]
  Briefings delivered:      [N]
  Outreach packages:        [N]

CONTENT:
  Content briefs sent:      [N]
  Videos produced:          [N]
  Posts published:          [N]

TOTAL FREE VALUE DELIVERED:
  Unique businesses helped: [N]
  Free leads given away:    [N]
  Est. value of free leads: $[N]
═══════════════════════════════════════════════
```

---

## Section 4: Theoretical Capacity

Calculate what the current tool inventory COULD produce if maxed out daily:

### Daily Capacity (Single Operator)

```
THEORETICAL DAILY CAPACITY
═══════════════════════════════════════════════
Operation              | Per Run | Max Runs/Day | Daily Max
═══════════════════════════════════════════════
/drop (50 businesses)  | 250     | 4 rotations  | 1,000 leads
/serve (per client)    | 20      | 10 clients   | 200 leads
/content (per client)  | 1 brief | 10 clients   | 10 briefs
/deep-outreach         | 50 biz  | 2 runs       | 500 leads
/follow-up             | ~30     | 1 run        | 30 follow-ups
═══════════════════════════════════════════════

DAILY THEORETICAL MAX:
  Free leads delivered:     1,000 (via /drop x4)
  Client leads delivered:   200 (via /serve x10)
  Content briefs:           10 (via /content x10)
  Follow-ups sent:          30 (via /follow-up)
  Businesses touched:       200+

MONTHLY THEORETICAL MAX (20 working days):
  Free leads:               20,000
  Client leads:             4,000
  Content briefs:           200
  Follow-ups:               600
  New client pipeline:      100+ conversations (at 5% reply rate)
  Revenue potential:        $20,000/mo (100 clients x $200/mo)
```

### Actual vs. Theoretical

```
UTILIZATION GAP
═══════════════════════════════════════════════
Metric                | Actual   | Theoretical | Gap
═══════════════════════════════════════════════
Businesses contacted  | [N]      | [20,000/mo] | [N]%
Free leads delivered  | [N]      | [20,000/mo] | [N]%
Active clients        | [N]      | [100]       | [N]%
Monthly revenue       | $[N]     | $[20,000]   | [N]%
Commands used         | [N]/[T]  | [T]/[T]     | [N]%
═══════════════════════════════════════════════
```

---

## Section 5: Top 5 Compounding Recommendations

Based on all the data above, produce 5 specific, actionable recommendations ranked by impact:

For each recommendation:
1. **What:** The specific action
2. **Why:** Evidence from the data (not theory — cite actual numbers from Sections 1-4)
3. **How:** The exact command or sequence to execute it
4. **Impact:** Projected improvement (quantified)
5. **Effort:** Time required (minutes/hours)

Format:

```
TOP 5 COMPOUNDING ACTIONS
═══════════════════════════════════════════════
#1: [Action]
    Why:    [Evidence from data]
    How:    [Exact command]
    Impact: [Quantified projection]
    Effort: [Time estimate]

#2: [Action]
    ...

#3: [Action]
    ...

#4: [Action]
    ...

#5: [Action]
    ...
═══════════════════════════════════════════════
```

---

## Section 6: Unused Weapons

List every command, skill, and MCP server that has NEVER been used (or used fewer than 2 times). These are the biggest compounding opportunities because the capability already exists — it just needs to be activated.

```
UNUSED WEAPONS INVENTORY
═══════════════════════════════════════════════
Category        | Tool              | Purpose           | Activation
═══════════════════════════════════════════════
Command         | /run-everything   | Full daily ops    | Run once to test
Command         | /activate         | Client onboard    | First paying client
Skill           | /deep-outreach    | Scientific pipe   | Replace /drop
Skill           | /viral-design     | Social assets     | Pair with /content
MCP Server      | Canva             | Design at scale   | Auth + test
MCP Server      | n8n               | Workflow auto     | Deploy template
...             | ...               | ...               | ...
═══════════════════════════════════════════════

ACTIVATION PRIORITY (do these first):
1. [Tool] — [Why it matters most]
2. [Tool] — [Why]
3. [Tool] — [Why]
```

---

## Final Summary

Print a compact summary box:

```
╔══════════════════════════════════════════════╗
║         COMPOUNDING REPORT                   ║
╠══════════════════════════════════════════════╣
║ Build velocity:  [N] commits in [N] days     ║
║ Tools built:     [N] commands + [N] skills   ║
║ Tools used:      [N] / [N] ([N]%)            ║
║ Output to date:  [N] leads, [N] emails       ║
║ Capacity used:   [N]% of theoretical max     ║
║                                              ║
║ #1 LEVER: [Biggest single action]            ║
║ #1 WEAPON: [Most impactful unused tool]      ║
║                                              ║
║ "You have built a $20K/mo machine.           ║
║  You are running it at [N]% capacity."       ║
╚══════════════════════════════════════════════╝
```

---

## Rules

1. **Read-only** — this command does NOT modify any files, send emails, or write to Supabase
2. **Evidence-based** — every recommendation must cite actual data from the audit, not theory
3. **Specific** — recommendations must name exact commands to run, not vague suggestions
4. **Honest** — if something has not been used, say so plainly. The point is to identify gaps.
5. **Fast** — use parallel queries (Supabase + git + file reads) to gather data quickly
6. **If Supabase queries fail** (table doesn't exist, auth issue), note the failure and continue with available data

*Run weekly: `/compound`*
*Run after any major build session to measure what was created vs. what is being used*
