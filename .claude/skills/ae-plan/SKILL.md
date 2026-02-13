---
name: ae-plan
description: Goal-backward planning with Eisenhower triage and inversion validation. Creates executable plans that start from the desired end state and work backward. Use for any non-trivial implementation task.
argument-hint: "[feature or goal description]"
---

# /ae-plan — Goal-Backward Planning Engine

Plan the implementation of: **$ARGUMENTS**

## Process

### Step 1: Define End State (FIRST — before anything else)
What does "done" look like? Be ruthlessly specific.

```
## End State Checklist
- [ ] [Specific deliverable 1]
- [ ] [Specific deliverable 2]
- [ ] [All tests pass]
- [ ] [Deployed/committed/verified]
```

### Step 2: Inversion Check
Before planning HOW, determine what would make this FAIL.
- Top 3 failure modes for this task
- Top 3 anti-patterns to avoid
- Assumptions we're making that could be wrong

### Step 3: Work Backward from End State
Starting from the end state, work backward to identify all steps:
```
Step N (final): [Deliver/verify end state]
Step N-1: [What must be true for Step N?]
Step N-2: [What must be true for Step N-1?]
...
Step 1: [First action from current state]
```

### Step 4: Eisenhower Triage
Classify every step:
| Step | Urgent? | Important? | Action |
|------|---------|------------|--------|
| ... | Y/N | Y/N | Do/Schedule/Delegate/Drop |

### Step 5: Dependency Analysis
```
Step 1 ──→ Step 2 ──→ Step 4
                ↗
Step 3 ────┘
```
Identify which steps can run in parallel vs. must be sequential.

### Step 6: Second-Order Check
For each major decision in the plan:
- First-order consequence: [immediate effect]
- Second-order consequence: [what happens next]
- Risk mitigation: [how to handle if it goes wrong]

### Step 7: Resource Estimation
- Files to create/modify: [list]
- Tools needed: [MCPs, subagents, bash]
- Context budget: [rough estimate of tokens needed]
- Parallelization opportunities: [what can run as subagents]

## Output Format
```
## Plan: [Goal]

### End State
[Checklist]

### Failure Modes (Inversion)
[Top 3 risks]

### Execution Steps (Backward from goal)
[Numbered steps with dependencies]

### Triage Matrix
[Eisenhower table]

### Parallel Opportunities
[What can be delegated to subagents]

### Verification Criteria
[How we know it worked]
```

## Rules
- ALWAYS define end state before planning steps
- ALWAYS run inversion check before committing to an approach
- Every step must have a verification criterion
- Flag assumptions explicitly — don't let them hide
- If the plan requires more than 10 steps, break into phases
- Read relevant files BEFORE planning — don't plan blind
