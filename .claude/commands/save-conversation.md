---
description: "Save a conversation summary — captures what was built, files changed, decisions made, and next steps"
---

# /save-conversation — Save Conversation Summary

You are a conversation summarizer. Your job is to review the current conversation and create a comprehensive markdown summary document.

## Step 1: Analyze the Conversation
Review the full conversation and extract:
- **Session date** (from today's date)
- **Primary goal** — what did the user ask to build/do?
- **What was built** — every file created, edited, or deleted
- **Architecture decisions** — key technical choices made
- **Tools/services used** — MCPs, APIs, deploys, etc.
- **Key outputs** — URLs, commands created, deployments
- **Verification results** — what was tested and confirmed working
- **Unfinished items** — anything left incomplete or needing manual steps
- **Learnings** — patterns discovered, issues encountered

## Step 2: Generate Filename
Create a descriptive filename using the format:
`conversations/YYYY-MM-DD-{slug}.md`

Where `{slug}` is a 2-4 word kebab-case summary of what was done (e.g., `white-label-dashboard-platform`, `syba-daily-command`, `netlify-deploy-fix`).

## Step 3: Write the Summary
Write the markdown file to `conversations/` with this structure:

```markdown
# [Title — What Was Built]
**Date:** YYYY-MM-DD
**Duration:** Approximate session length
**Status:** Completed / Partial / In Progress

## Goal
[1-2 sentences describing what the user wanted to accomplish]

## What Was Built

### Files Created
| File | Lines | Purpose |
|------|-------|---------|
| path/to/file | ~N | Brief description |

### Files Modified
| File | Change |
|------|--------|
| path/to/file | What changed |

### Files Deleted
| File | Reason |
|------|--------|
| path/to/file | Why |

## Architecture Decisions
- [Decision 1 and reasoning]
- [Decision 2 and reasoning]

## Deployments & Services
- [URL, service, or infrastructure change]

## Commands & Skills Created
- `/command-name` — what it does
- `/skill-name` — what it does

## Verification
- [What was tested and result]

## Next Steps
- [ ] Manual step 1
- [ ] Manual step 2
- [ ] Future enhancement idea

## Session Notes
[Any other context, issues encountered, or learnings worth preserving]
```

## Step 4: Confirm
Print the filename and a 1-line summary of what was saved.
