# Francis Feedback — 2026-02-13

## Source
Email from Francis (francis@syba.io) received 2026-02-13, reviewing the first batch of 50 SYBA lead intelligence briefs.

## Key Issues Identified

### 1. Email Bounces
Multiple emails bounced, particularly fabricated addresses like `pierre.dumont@cliffordchance.com`. Emails were never verified before inclusion.

### 2. Can't Mark Contacted Leads
Dashboard is read-only. Francis needs to mark leads as contacted, note responses, and track follow-ups directly in the dashboard.

### 3. No Follow-Up Engine
Follow-up templates exist but there's no scheduling or tracking. Leads fall through the cracks after initial outreach.

### 4. Limited Trigger Sources
Only 5 hardcoded search queries for trigger events. Misses LinkedIn posts, regulatory pages, and industry publications.

### 5. Competitor Contacts
Some leads were at partner companies (Chubb, Jencap). Need an exclusion list for partners and flagging for partner competitors.

### 6. Region Mismatch
Original allocation was 20 Belgium / 10 Europe / 10 USA. Francis wants 20 Belgium / 20 USA / 10 Europe to reflect Brigitte's US focus.

## Resolution
All 6 issues addressed in V3 plan (`prompts/syba-intelligence-v3-plan-2026-02-15.md`):
- SmtpVerifier for $0 email verification
- Interactive dashboard with status tracking + notes
- Follow-up cadence (Day 3/10/17) built into daily command
- Expanded trigger sources via Apify LinkedIn scrapers
- Exclusion list in `syba/CLAUDE.md`
- Regional allocation updated to 20/20/10
