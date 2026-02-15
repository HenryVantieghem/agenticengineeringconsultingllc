# V3 Revenue-Generating Prompt Sequence

**Created:** 2026-02-15
**Context:** After V3 audit/fix/deploy session. System is ready for first production run.

## Prompt 1: Send Francis Email + First V3 Production Run

Send the Gmail draft to Francis and Brigitte, then run the first production V3 intelligence run for SYBA.

STEP 1: Send the drafted email (subject: "Your 6 problems? Fixed. Here's what we built.") via Gmail API (Keychain OAuth method).
STEP 2: Run /syba-intelligence syba — full 5-agent pipeline, target 50 verified leads.
STEP 3: Verify Supabase has new leads, briefing was created, send the brief.

## Prompt 2: Process All Due Follow-Ups

Process all due follow-ups across SYBA client pipeline + LeadDrop outreach pipeline.
- SYBA: Check leads with contacted_at + N days, send appropriate FU1/FU2/FU3
- LeadDrop: Check leaddrop_prospects sent on Feb 12-13, send Day 3 follow-ups
- Check Gmail inbox for any replies, update statuses

## Prompt 3: LeadDrop Expansion — Atlanta Medical

Run /drop for Atlanta Medical (rotation #4). Target 50 businesses.
Update leaddrop/ROTATION.md with results.

## Prompt 4: SYBA Case Study + LinkedIn Post

Create a Google Doc case study from V3 results (real Supabase data).
Draft a LinkedIn post (under 1,300 chars) announcing the system.

## Prompt 5: Daily Automation Orchestrator

Create .claude/commands/morning.md that runs the entire daily business:
inbox check → serve all clients → process follow-ups → run /drop → daily report.

## Prompt 6: Independent Audit (separate session)

Full 13-point verification of all V3 work. See prompts/syba-intelligence-v3-plan-2026-02-15.md for the complete audit prompt.
