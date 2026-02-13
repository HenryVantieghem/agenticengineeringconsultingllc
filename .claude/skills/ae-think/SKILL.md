---
name: ae-think
description: Apply a mental model to the current problem — first-principles, inversion, second-order, pareto, eisenhower, ooda. Use when facing complex decisions or unclear paths forward.
argument-hint: "[model-name]"
---

# /ae-think — Apply Mental Model

Apply the **$ARGUMENTS** mental model to the current problem context.

## Available Models

### first-principles
Strip away assumptions → Decompose to atomic truths → Rebuild from ground up.
1. "What do we KNOW vs what do we ASSUME?"
2. "What are the irreducible components?"
3. "Given only these truths, what is the simplest solution?"

### inversion
Design to avoid failure modes FIRST, then optimize.
1. "What would guarantee this project FAILS?" — List top 5 failure modes.
2. "What should we absolutely NOT do?" — Define anti-patterns.
3. "How do we design to make these failures impossible?"

### second-order
Trace consequences 2-3 levels deep before deciding.
1. "If we do X, what happens next?" (first-order)
2. "And then what happens after that?" (second-order)
3. "What are the unintended consequences?" (third-order)

### pareto
Identify the 20% that delivers 80% of value.
1. "Which 20% of features deliver 80% of value?"
2. "Which 20% of bugs cause 80% of issues?"
3. Explicitly rank all options by impact/effort ratio.

### eisenhower
Triage by urgency x importance.
- **Urgent + Important** = Do now (blocking issues, production bugs)
- **Important + Not Urgent** = Schedule (architecture, tech debt)
- **Urgent + Not Important** = Delegate (to subagents)
- **Neither** = Drop

### ooda
Full Observe-Orient-Decide-Act cycle.
1. **Observe**: Read current state (git status, files, test results, errors)
2. **Orient**: Analyze against context (CLAUDE.md, memory, project patterns, goal)
3. **Decide**: Choose specific action with explicit reasoning
4. **Act**: Execute the action
5. **Loop**: Return to Observe

## Output Format

```
## Mental Model: [name]

### Observations
[What the current state tells us]

### Analysis
[Applying the model's framework]

### Conclusion
[What the model reveals]

### Recommended Action
[Specific next step with reasoning]
```

## Rules
- Always state which model is being applied
- Be specific — no vague platitudes
- The output should change the user's decision or confirm it with new evidence
- If no model is specified in $ARGUMENTS, ask the user which one, or suggest the most appropriate one for their current context
