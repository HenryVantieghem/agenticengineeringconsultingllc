---
name: ae-lifecycle
description: Meta-orchestrator that chains the full development lifecycle — ideate, research, plan, build, verify, ship, observe, compound. The master command that sequences everything. Use for end-to-end feature development.
disable-model-invocation: true
argument-hint: "[feature description]"
---

# /ae-lifecycle — Full Lifecycle Orchestrator

Execute the complete development lifecycle for: **$ARGUMENTS**

## Architecture: DAG-Based Orchestration

```
/ae-think (first-principles)
    │
    ▼
/ae-plan (goal-backward)
    │
    ├──→ Parallel research (subagents)
    │
    ▼
/ae-build (OODA loops)
    │
    ├──→ Per-step /ae-verify
    │
    ▼
/ae-verify (full quality gates)
    │
    ▼
/ae-ship (release coordination)
    │
    ▼
/ae-observe (session metrics)
    │
    ▼
/ae-compound (extract learnings)
```

## Execution Protocol

### Phase 1: THINK (1-2 minutes)
Apply first-principles thinking to understand the task:
- What is the core problem?
- What assumptions are we making?
- Is there a simpler approach we're missing?

If the task is ambiguous, use /ae-think with the appropriate model.
If the task is clear, skip to Phase 2.

### Phase 2: PLAN (2-5 minutes)
Use /ae-plan to create a goal-backward plan:
1. Define end state
2. Run inversion check (what would make this fail?)
3. Work backward from end state
4. Triage steps (Eisenhower matrix)
5. Identify parallel opportunities

**Gate: Plan must be approved by user before proceeding.**

### Phase 3: BUILD (varies)
Use /ae-build to execute the plan:
- One atomic step at a time
- OODA verification loop per step
- If stuck, run /ae-bottleneck

**Gate: All steps complete before moving to Phase 4.**

### Phase 4: VERIFY (2-3 minutes)
Run /ae-verify quality gates:
- Static analysis
- Tests
- Build
- Security scan
- Code review

**Gate: All gates must PASS (or user explicitly overrides).**

### Phase 5: SHIP (2-5 minutes)
Run /ae-ship to coordinate release:
- Pre-flight check (verify passed)
- Changelog generation
- Deploy to target
- Post-deploy verification
- Rollback plan documented

**Gate: Deployment verified before proceeding.**

### Phase 6: OBSERVE (1-2 minutes)
Run /ae-observe for session metrics:
- What was achieved
- Efficiency analysis
- Pattern detection
- Cost estimate

### Phase 7: COMPOUND (2-3 minutes)
Run /ae-compound to extract learnings:
- Pattern extraction
- Failure-to-rule pipeline
- Memory updates
- Skill candidates

## Lifecycle Summary Output

```
## Lifecycle Complete — [FEATURE]

### Phases Executed
| Phase | Duration | Status | Notes |
|-------|----------|--------|-------|
| Think | Xm | DONE | [key insight] |
| Plan | Xm | DONE | [X steps planned] |
| Build | Xm | DONE | [X steps executed] |
| Verify | Xm | DONE | [X/5 gates passed] |
| Ship | Xm | DONE | [deploy target] |
| Observe | Xm | DONE | [key metric] |
| Compound | Xm | DONE | [X learnings extracted] |

### Deliverables
- [What was shipped]
- [Where it was deployed]
- [Verification evidence]

### Learnings Compounded
- [Key patterns saved to memory]
- [Rules created from failures]
- [Skills proposed]

### End State
- [x] [Each item from the plan's end state checklist]
```

## Adaptive Execution Rules
- If ANY phase fails, STOP and diagnose (don't continue blindly)
- If the task is trivial (< 3 steps), skip Think and go straight to Plan
- If no deployment needed, skip Ship phase
- If the user says "just build it", skip Think + Plan (but ALWAYS verify)
- Each phase should invoke the corresponding /ae-* command (composition, not duplication)
- Ask for user approval between Plan and Build phases (minimum checkpoint)
