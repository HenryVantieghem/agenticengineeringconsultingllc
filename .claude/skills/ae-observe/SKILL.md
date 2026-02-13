---
name: ae-observe
description: Generate observability report for the current session — cost analysis, effectiveness metrics, pattern detection, and improvement recommendations. Use at end of sessions or when evaluating productivity.
disable-model-invocation: true
---

# /ae-observe — Session Observability Engine

Generate a comprehensive observability report for the current session.

## Analysis Process

### 1. Session Summary
- What was the stated goal at session start?
- How long has this session been running?
- What was achieved vs. what was planned?

### 2. Activity Analysis
Review the conversation to identify:
- **Tool calls made** (by type): Read, Write, Edit, Bash, Grep, Glob, WebSearch, WebFetch, Task, MCP tools
- **Subagents spawned** and their purposes
- **Files read** (which ones, how many times)
- **Files modified** (which ones, what changed)
- **Commands executed** (bash) and their results
- **Errors encountered** and how they were resolved
- **User interactions** (questions asked, clarifications needed)

### 3. Efficiency Metrics
Calculate:
| Metric | Value | Assessment |
|--------|-------|------------|
| Exploration:Execution ratio | X:Y | [Too much research? Too little?] |
| Retry count | N | [Were there wasted cycles?] |
| Error recovery time | [time/turns] | [How quickly were errors resolved?] |
| Context utilization | [estimate]% | [Are we near compaction?] |
| Subagent delegation | N tasks | [Could more have been parallelized?] |

### 4. Pattern Detection
Look for:
- **Repeated searches**: Same file/pattern searched multiple times (context lost?)
- **Retry loops**: Same action attempted multiple times (tool issues?)
- **Dead ends**: Exploration that led nowhere (could have been avoided?)
- **Successful patterns**: Tool combinations that worked well (worth remembering?)
- **Blocking patterns**: What took the most time/turns to resolve?

### 5. Cost Estimation
Based on conversation length and tool usage:
- Estimated input tokens: [rough count]
- Estimated output tokens: [rough count]
- Estimated cost: $[amount]
- Cost per deliverable: $[amount per feature/fix]

### 6. Recommendations
Based on the analysis:
- **Process improvements**: What could be done differently next time?
- **Memory candidates**: Should anything be added to CLAUDE.md or auto-memory?
- **Skill candidates**: Were any workflows repeated that should become skills?
- **Tool preferences**: Did certain tools work better than expected?
- **Bottleneck prediction**: What is likely to slow down the next session?

## Output Format

```
## Session Observability Report — [DATE]

### Goal Achievement
- Goal: [stated goal]
- Status: COMPLETE / PARTIAL / BLOCKED
- Completion: [X]%

### Activity Summary
| Category | Count | Details |
|----------|-------|---------|
| Files read | N | [list] |
| Files modified | N | [list] |
| Commands run | N | [key ones] |
| Subagents used | N | [purposes] |
| Errors hit | N | [types] |

### Efficiency
[Metrics table]

### Patterns Detected
[Notable patterns — both good and bad]

### Cost Estimate
[Token usage and cost breakdown]

### Recommendations
1. [Specific improvement]
2. [Memory update suggestion]
3. [Skill creation suggestion]

### Next Session Prep
[What should be loaded/ready for the next session]
```

## Rules
- Be honest about inefficiencies — the point is to improve
- Focus on actionable recommendations, not just observations
- If the session went well, say so and note what made it effective
- Compare against previous sessions if memory/logs are available
