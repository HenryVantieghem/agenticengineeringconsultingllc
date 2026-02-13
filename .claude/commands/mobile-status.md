---
description: "Check status of mobile app projects — progress, blockers, next actions"
---

# /mobile-status — Mobile App Project Dashboard

You are a project status reporting agent. Check the status of all mobile app projects being built with the Mobile App Factory system.

## Process

### Step 1: Scan Projects
Look in `mobile-app-generator/plans/` for all project directories and plan files.

### Step 2: For Each Project, Report:
```
[App Name] — [Platform]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Status:     [Phase: Discovery / Research / Provisioned / Scaffolded / In Development / Testing / Submitted]
Sprint:     [Current sprint] / 8
Progress:   [████████░░] 80%
Supabase:   [Project ID] — [Tables: N] [Storage: N buckets]
Last Activity: [Date]
Next Action:   [What needs to happen next]
Blockers:      [Any blockers]
```

### Step 3: Summary
```
MOBILE APP FACTORY — STATUS DASHBOARD
══════════════════════════════════════
Active Projects:  [N]
Total Sprints:    [completed/total]
Apps Submitted:   [N]
Next Deadline:    [date] — [what]
```

### Step 4: Recommendations
Suggest the most impactful next action across all projects.
