---
name: ae-build
description: Atomic task execution with OODA verification loops and Boyd's Law speed. Executes implementation tasks one atomic step at a time, verifying each before proceeding. Use for any coding/building task.
argument-hint: "[task description or plan step]"
---

# /ae-build — Atomic Execution Engine

Execute: **$ARGUMENTS**

## Core Principle: Boyd's Law
"Speed of the OODA loop beats the size of the loop."
- Many small, verified steps > few large, unverified leaps
- Each step is atomic (can be committed independently)
- Each step is verified before moving to next

## Execution Protocol

### Pre-Build Checks
1. Is there a plan? If yes, load it. If no, create a quick 3-step plan.
2. What is the end state? (Must be defined before starting)
3. What files will be modified? (Read them first)
4. Are there existing tests? (Run them to establish baseline)

### OODA Execution Loop (Repeat for Each Atomic Step)

**OBSERVE:**
- Read current state of files to be modified
- Check git status for uncommitted changes
- Review any error output from previous step

**ORIENT:**
- How does current state compare to end state?
- What is the smallest change that moves us forward?
- What could go wrong with this change?

**DECIDE:**
- Choose exactly ONE atomic action
- State what the action is and why
- State what success looks like

**ACT:**
- Execute the single action (edit file, write file, run command)
- Capture the result

**VERIFY:**
- Did the action succeed?
- Does the code still work? (run tests/build/lint if applicable)
- Is the change consistent with the plan?
- If verification fails: STOP, diagnose, adjust approach

### Post-Build Protocol
1. Run full test suite (if exists)
2. Check git diff — are all changes intentional?
3. Compare against end state checklist
4. Report: what was done, what remains, any deviations from plan

## Atomic Step Rules
- Maximum 1 file edit per OODA cycle (unless tightly coupled)
- Always verify after each edit
- If verification fails twice on the same step, run /ae-bottleneck
- Never skip the OBSERVE phase — stale state causes bugs
- Prefer small, reversible changes over large, risky ones

## Output Format (Per Cycle)
```
### Step [N]: [Description]
**Observe:** [Current state]
**Orient:** [Analysis]
**Decide:** [Chosen action + reasoning]
**Act:** [What was done]
**Verify:** PASS / FAIL [Evidence]
```

## Summary Format
```
## Build Complete

### End State
- [x] [Achieved items]
- [ ] [Remaining items]

### Changes Made
[List of files modified with descriptions]

### Verification
[Test results, build status]

### Deviations from Plan
[Any changes to the original approach]
```
