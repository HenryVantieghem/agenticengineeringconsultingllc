---
name: ae-ship
description: Full release coordination — pre-flight checks, changelog generation, deployment, post-deploy verification, and rollback planning. Use when ready to ship changes.
disable-model-invocation: true
argument-hint: "[target: netlify/git/both]"
---

# /ae-ship — Release Coordination Engine

Ship the current changes to production.

## Pre-Flight Protocol

### Step 1: Quality Gate Check
Run /ae-verify first. If ANY gate fails:
- **STOP** — do not ship
- Report which gates failed
- Suggest remediation
- Ask user if they want to ship anyway (with explicit risk acknowledgment)

### Step 2: Change Summary
1. `git diff --stat` — what files changed
2. `git log --oneline` since last deploy/tag — what commits are being shipped
3. Categorize changes:
   - **Added**: New features or files
   - **Changed**: Modifications to existing behavior
   - **Fixed**: Bug fixes
   - **Removed**: Deleted functionality

### Step 3: Changelog Entry
Generate a changelog entry:
```markdown
## [YYYY-MM-DD] - [Brief Description]

### Added
- [New feature descriptions]

### Changed
- [Modification descriptions]

### Fixed
- [Bug fix descriptions]

### Removed
- [Removal descriptions]
```

### Step 4: Deployment
Based on $ARGUMENTS target:

**If "netlify" (or deploying a client dashboard):**
1. Identify which site to deploy (from MEMORY.md site IDs)
2. Use Netlify MCP to deploy
3. Capture deploy ID and URL
4. Verify site loads (check HTTP status)

**If "git" (or committing code):**
1. Stage appropriate files (NOT .env, credentials, etc.)
2. Generate commit message following repo conventions
3. Commit with Co-Authored-By
4. Push to remote (with user confirmation)

**If "both":**
1. Git commit first
2. Then Netlify deploy

### Step 5: Post-Deploy Verification
1. Check deployed site/service is reachable
2. Verify key pages/endpoints work
3. Check for console errors (if web deployment)
4. Compare against end state from plan

### Step 6: Rollback Plan
Document for this deployment:
```
## Rollback Plan
- Previous deploy ID: [ID]
- Rollback command: [specific command]
- Verification after rollback: [steps]
- Who to notify: [people/channels]
```

### Step 7: Notification
- Create summary of what was shipped
- Include changelog, deploy URL, verification results
- Offer to draft email or message to stakeholders

## Output Format

```
## Ship Report — [DATE]

### Pre-Flight
- Quality gates: PASS/FAIL
- Changes: [X files, Y commits]

### Changelog
[Generated entry]

### Deployment
- Target: [netlify/git/both]
- Status: SUCCESS/FAILED
- URL: [if applicable]
- Deploy ID: [for rollback]

### Post-Deploy Verification
- Site reachable: YES/NO
- Key pages load: YES/NO
- Errors: NONE/[list]

### Rollback Plan
[Documented above]
```

## Rules
- NEVER skip pre-flight quality gate check
- NEVER deploy without user confirmation
- ALWAYS document rollback plan
- ALWAYS verify after deployment
- If deployment fails, don't retry automatically — diagnose first
