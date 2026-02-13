---
name: ae-review
description: Deep code review of recent changes using a dedicated reviewer perspective — checks for bugs, security issues, architectural violations, and best practices. Use after building features.
disable-model-invocation: true
context: fork
agent: Explore
---

# /ae-review — Code Review Engine

Perform a thorough code review of recent changes.

## Review Process

### Step 1: Understand the Changes
1. Run `git diff` to see all unstaged changes
2. Run `git diff --cached` to see staged changes
3. Run `git log --oneline -5` for recent commit context
4. Read each modified file in full (not just the diff)

### Step 2: Review Categories

**A. Correctness**
- Does the code do what it's supposed to?
- Are there off-by-one errors, null pointer risks, or race conditions?
- Are edge cases handled (empty arrays, null values, network failures)?
- Is error handling appropriate (not swallowing errors, not over-catching)?

**B. Security**
- Any hardcoded secrets or credentials?
- Input validation on user-facing data?
- SQL injection, XSS, or command injection risks?
- Are file permissions appropriate?
- Any sensitive data logged or exposed?

**C. Architecture**
- Does this follow existing patterns in the codebase?
- Are there CLAUDE.md conventions being violated?
- Is the code in the right location/module?
- Does it maintain separation of concerns?
- Are dependencies appropriate?

**D. Performance**
- Any O(n^2) or worse algorithms where O(n) is possible?
- Unnecessary database queries or API calls?
- Large objects held in memory unnecessarily?
- Missing pagination for large datasets?

**E. Maintainability**
- Is the code self-explanatory?
- Are variable/function names descriptive?
- Is there unnecessary complexity?
- Could any repeated code be extracted?

### Step 3: Classify Findings

| Severity | Meaning | Action |
|----------|---------|--------|
| CRITICAL | Bug, security flaw, data loss risk | Must fix before shipping |
| WARNING | Bad practice, potential issue | Should fix |
| SUGGESTION | Improvement opportunity | Nice to have |
| PRAISE | Excellent code worth noting | Positive reinforcement |

### Step 4: Report

```
## Code Review Report

### Summary
- Files reviewed: [count]
- Lines changed: [count]
- Findings: [X critical, Y warnings, Z suggestions]

### Critical Issues
[Each with file:line, description, and suggested fix]

### Warnings
[Each with file:line, description, and suggested fix]

### Suggestions
[Each with file:line, description]

### What's Good
[Praise for well-written code]

### Verdict: APPROVE / REQUEST CHANGES
```

## Rules
- Read-only — DO NOT modify any files
- Always read the full file, not just the diff (context matters)
- Be specific — reference file:line for every finding
- Suggest concrete fixes, not vague improvements
- If no issues found, say so explicitly (don't invent problems)
- Look for what's good too — positive feedback builds better habits
