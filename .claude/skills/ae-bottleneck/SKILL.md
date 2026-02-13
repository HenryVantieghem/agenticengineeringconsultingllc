---
name: ae-bottleneck
description: Identify and resolve the ONE constraint blocking progress — applies Theory of Constraints (5 Focusing Steps) to find the bottleneck and maximize throughput. Use when stuck or when progress feels slow.
disable-model-invocation: true
---

# /ae-bottleneck — Constraint Analysis Engine

Identify and resolve the single biggest constraint blocking progress.

## Theory of Constraints — 5 Focusing Steps

### Step 1: IDENTIFY the Constraint
What is the ONE thing preventing progress right now?

Common agent bottlenecks:
- [ ] **Context window** — Running out of space, compaction losing important info
- [ ] **Tool failure** — MCP/API issues, rate limits, timeouts
- [ ] **Ambiguity** — Unclear requirements, multiple valid interpretations
- [ ] **Verification** — Can't confirm correctness, no tests, no feedback loop
- [ ] **Dependencies** — Waiting on external input, blocked by another task
- [ ] **Complexity** — Problem too large for single step, needs decomposition
- [ ] **Knowledge gap** — Don't understand the codebase/domain well enough

Analyze the current session context to determine which constraint applies.

### Step 2: EXPLOIT the Constraint
Maximize throughput AT the bottleneck (don't try to fix everything else).

| Constraint | Exploitation Strategy |
|------------|----------------------|
| Context window | Use subagents for verbose operations, /compact focus on X |
| Tool failure | Switch to alternative tool, manual workaround |
| Ambiguity | Ask the user for clarification via AskUserQuestion |
| Verification | Write a quick test, check manually, use reviewer subagent |
| Dependencies | Work on unblocked tasks first, parallelize independent work |
| Complexity | Decompose into atomic sub-tasks, plan backward from goal |
| Knowledge gap | Read files, use Explore agent, check CLAUDE.md/memory |

### Step 3: SUBORDINATE Everything Else
What should change in the current approach to serve the bottleneck?
- Stop doing things that don't help the bottleneck
- Redirect effort toward the bottleneck

### Step 4: ELEVATE the Constraint
Can we remove the bottleneck entirely?
- Context: Switch model, restructure conversation, start fresh session
- Tools: Fix the MCP, find better tool, build workaround
- Ambiguity: Create a spec document, define acceptance criteria
- Verification: Write automated test, create quality gate
- Dependencies: Find alternative path, do it ourselves
- Complexity: Break into multiple sessions, create skills for sub-problems

### Step 5: REPEAT
After resolving, identify the NEW bottleneck (it always shifts).

## Output Format
```
## Bottleneck Analysis

### Current Constraint: [TYPE]
[Specific description of what's blocking progress]

### Exploitation Strategy
[How to maximize throughput at this constraint]

### Subordination Changes
[What else needs to change]

### Elevation Plan
[How to remove the constraint entirely]

### Next Constraint (Predicted)
[What will become the bottleneck after this one is resolved]

### Action
[The ONE thing to do right now]
```
