---
name: ae-verify
description: Run all quality gates on current changes — static analysis, tests, build, security scan, and code review. 4-gate verification architecture. Use after building features or before shipping.
disable-model-invocation: true
---

# /ae-verify — Quality Gate Engine

Run all quality gates on the current changes.

## Gate Architecture

### Gate 1: Static Analysis
1. Identify all modified files: `git diff --name-only` + `git diff --cached --name-only`
2. For each modified file:
   - Check syntax (appropriate linter for file type)
   - Check formatting (prettier, eslint, etc. if configured)
   - Report any warnings or errors
3. **Result:** PASS (no errors) / FAIL (errors found)

### Gate 2: Test Suite
1. Identify test files related to modified code
2. Run relevant test suite (detect framework: jest, pytest, swift test, etc.)
3. If no tests exist for new code, FLAG as warning
4. Check test coverage for new/modified functions
5. **Result:** PASS (all tests pass) / FAIL (failures) / WARN (no tests)

### Gate 3: Build Verification
1. Run the project's build command (detect from package.json, Makefile, etc.)
2. Check for build warnings (not just errors)
3. Verify output artifacts exist
4. **Result:** PASS (builds clean) / FAIL (build errors) / WARN (warnings)

### Gate 4: Security Scan
1. Grep for hardcoded secrets:
   - API keys: patterns like `sk-`, `pk_`, `AKIA`, `ghp_`, `xox`
   - Passwords: `password =`, `passwd`, `secret =`
   - Tokens: `token =`, `bearer`, `auth`
   - Private keys: `BEGIN RSA`, `BEGIN PRIVATE`
2. Check for common vulnerabilities:
   - SQL injection patterns (string concatenation in queries)
   - XSS patterns (innerHTML, dangerouslySetInnerHTML without sanitization)
   - Command injection (exec, eval with user input)
3. Check .env files aren't staged: `git diff --cached --name-only | grep -i env`
4. **Result:** PASS (clean) / FAIL (secrets or vulns found)

### Gate 5: Code Review (Optional — if reviewer subagent exists)
1. Use the ae-code-reviewer subagent (if available) for human-quality review
2. Check architectural consistency with CLAUDE.md conventions
3. Check for code duplication, naming conventions, error handling
4. **Result:** PASS / FAIL / SKIP (no reviewer configured)

## Output Format

```
## Quality Gate Report

| Gate | Status | Details |
|------|--------|---------|
| Static Analysis | PASS/FAIL/WARN | [specifics] |
| Tests | PASS/FAIL/WARN | [specifics] |
| Build | PASS/FAIL/WARN | [specifics] |
| Security | PASS/FAIL | [specifics] |
| Code Review | PASS/FAIL/SKIP | [specifics] |

### Overall: PASS / FAIL

### Failures (if any)
[Detailed description of each failure with remediation steps]

### Warnings (if any)
[Items that aren't blocking but should be addressed]
```

## Rules
- NEVER skip Gate 4 (Security) — this is non-negotiable
- If Gate 1 fails, still run remaining gates (collect all failures)
- If no build system is detected, Gate 3 = SKIP
- Present ALL failures at once (don't stop at first failure)
- If overall FAIL, suggest specific fix for each failure
