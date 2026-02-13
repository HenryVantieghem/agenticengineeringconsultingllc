---
name: ae-compound
description: Extract learnings from the current session and compound them into persistent memory, skills, and rules. The failure-to-rule pipeline — every mistake becomes a permanent improvement. Use at end of every session.
disable-model-invocation: true
---

# /ae-compound — Compound Learning Engine

Extract and persist learnings from this session to make every future session better.

## The Core Loop: Plan → Work → Review → **Compound** → Repeat

The Compound step is the critical innovation. Without it, the same mistakes repeat across sessions.

## Process

### Step 1: Session Review
Analyze what happened in this session:
- **Tasks attempted**: What was the goal?
- **Tasks completed**: What was achieved?
- **Errors encountered**: What went wrong?
- **Recovery strategies used**: How were errors resolved?
- **Tools used**: Which tools were most/least effective?
- **Time sinks**: Where was the most effort spent?

### Step 2: Pattern Extraction
Identify reusable learnings in 4 categories:

**A. New Conventions Discovered**
- Code patterns that worked well
- Tool combinations that were effective
- Naming conventions or file organization patterns
- Build/test/deploy procedures that work

**B. Gotchas & Workarounds**
- Tool limitations discovered
- API quirks or undocumented behavior
- Configuration gotchas
- Platform-specific issues

**C. Architecture Insights**
- Key files and their relationships
- Module boundaries and responsibilities
- Data flow patterns
- Integration points

**D. Anti-Patterns (What NOT to Do)**
- Failed approaches to avoid
- Wrong assumptions
- Tool misuse patterns
- Over-engineering traps

### Step 3: Failure-to-Rule Pipeline
For each ERROR encountered in the session:
1. What went wrong?
2. Why did it go wrong?
3. How was it fixed?
4. What RULE would prevent this from happening again?
5. Where should the rule live? (CLAUDE.md / auto-memory / skill)

### Step 4: Propose Updates
Draft updates for the appropriate memory location:

**CLAUDE.md** (if project-wide convention that the team should follow):
- New build commands
- Architecture decisions
- Naming conventions

**Auto-memory MEMORY.md** (if project insight for Claude):
- Tool gotchas
- File locations
- Schema details
- Workaround patterns

**New Skill** (if a workflow was repeated 3+ times):
- Draft a SKILL.md for it
- Define trigger conditions
- List the steps

**Hook** (if a check should be deterministic, not AI-judged):
- Pre-commit formatting
- File protection rules
- Notification triggers

### Step 5: Present for Approval
Show ALL proposed updates to the user before writing anything.

Format:
```
## Proposed Updates

### Memory Updates (MEMORY.md)
[Additions/changes]

### CLAUDE.md Updates
[Additions/changes]

### New Skill Candidates
[Skill drafts]

### New Rules from Failures
| Failure | Root Cause | Rule | Location |
|---------|------------|------|----------|

### Anti-Patterns to Remember
[What to avoid]
```

### Step 6: Write Approved Updates
After user approval:
1. Update MEMORY.md with new learnings
2. Update CLAUDE.md if applicable
3. Create new skills if approved
4. Report what was written

## Rules
- NEVER write to memory without user approval
- Present ALL changes together (don't drip-feed updates)
- Be concise — memory files should be scannable, not novels
- Remove outdated entries when adding new contradicting ones
- If a learning is already documented, don't duplicate it
- Focus on patterns, not incidents (abstract the specific into the general)
