---
name: follow-up
description: "Daily follow-up pipeline for LeadDrop prospects. Checks Supabase leaddrop_prospects and leads/ markdown files for Day 3/7/14 follow-ups due, personalizes templates, sends via Gmail, and updates tracking columns."
---

# Follow-Up Pipeline

Send Day 3, Day 7, and Day 14 follow-up emails to LeadDrop prospects who haven't replied yet.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com
**Calendly:** https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min

---

## Prerequisites

- Supabase MCP connected (project `wghzabtkmntpclynntpp`)
- Google Workspace MCP connected (Gmail access for henry@agenticengineering.com)
- Follow-up template at `outreach/templates/follow-up.md`
- `leaddrop_prospects` table with follow-up columns (see Step 0)

---

## Workflow

Copy this checklist and track progress:

```
Task Progress:
- [ ] Step 0: Ensure follow-up columns exist in leaddrop_prospects
- [ ] Step 1: Query Supabase for prospects due for follow-up
- [ ] Step 2: Scan leads/ directory for markdown-tracked prospects
- [ ] Step 3: Read follow-up template and personalize each email
- [ ] Step 4: Send follow-ups via Gmail
- [ ] Step 5: Update Supabase and leads/ files
- [ ] Step 6: Print summary dashboard
```

---

## Step 0: Ensure Follow-Up Columns Exist

The `leaddrop_prospects` table may not yet have follow-up tracking columns. Run this migration via Supabase MCP (`apply_migration`) or `execute_sql` if the columns are missing:

```sql
-- Add follow-up tracking columns (idempotent — safe to re-run)
ALTER TABLE leaddrop_prospects
  ADD COLUMN IF NOT EXISTS followup_1_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS followup_2_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS followup_3_sent_at TIMESTAMPTZ;
```

Only run this once. If columns already exist, skip.

---

## Step 1: Query Supabase for Prospects Due

Use Supabase MCP `execute_sql` to find prospects due for each follow-up tier.

### Day 3 Follow-Up (first follow-up)

```sql
SELECT id, business_name, owner_name, industry, city, email_to, website_url, email_sent_at
FROM leaddrop_prospects
WHERE status = 'sent'
  AND email_sent_at <= NOW() - INTERVAL '3 days'
  AND followup_1_sent_at IS NULL
ORDER BY email_sent_at ASC;
```

### Day 7 Follow-Up (second follow-up)

```sql
SELECT id, business_name, owner_name, industry, city, email_to, website_url, email_sent_at, followup_1_sent_at
FROM leaddrop_prospects
WHERE status = 'sent'
  AND email_sent_at <= NOW() - INTERVAL '7 days'
  AND followup_1_sent_at IS NOT NULL
  AND followup_2_sent_at IS NULL
ORDER BY email_sent_at ASC;
```

### Day 14 Follow-Up (final follow-up)

```sql
SELECT id, business_name, owner_name, industry, city, email_to, website_url, email_sent_at, followup_1_sent_at, followup_2_sent_at
FROM leaddrop_prospects
WHERE status = 'sent'
  AND email_sent_at <= NOW() - INTERVAL '14 days'
  AND followup_2_sent_at IS NOT NULL
  AND followup_3_sent_at IS NULL
ORDER BY email_sent_at ASC;
```

**Important:** If a prospect has `status` other than `'sent'` (e.g., `replied`, `booked`, `declined`), they are excluded automatically. Never follow up with someone who already responded.

---

## Step 2: Scan leads/ Directory

Some prospects are tracked in `leads/*.md` files instead of (or in addition to) Supabase. Scan for prospects with email sent but no follow-up:

Look for files matching this pattern:
- Line contains `[x] Email sent` (case-insensitive) with a date
- Line contains `[ ] Follow-up #1 sent` (unchecked)

For each matching file, extract:
- **Business name** from the `# ` heading (line 1)
- **Industry** from the `**Industry:**` line
- **City** from the `**City:**` line
- **Email address** from the `[x] Email sent (DATE -- EMAIL)` line
- **Contact person** from `**Contact Person:**` line
- **Date sent** from the `[x] Email sent (DATE` marker

Calculate which follow-up is due:
- If `[x] Email sent` date is 3+ days ago AND `[ ] Follow-up #1 sent` is unchecked --> Day 3
- If `[x] Follow-up #1 sent` date is present AND `[x] Email sent` date is 7+ days ago AND `[ ] Follow-up #2 sent` is unchecked --> Day 7
- If `[x] Follow-up #2 sent` date is present AND `[x] Email sent` date is 14+ days ago AND `[ ] Follow-up #3 sent` is unchecked --> Day 14

**Deduplication:** If a prospect appears in both Supabase and `leads/`, use the Supabase record as the source of truth. Do not send duplicate follow-ups.

---

## Step 3: Personalize Follow-Up Emails

Read the template from `outreach/templates/follow-up.md`. Each follow-up tier has a different template.

### Day 3 Template Personalization

**Subject:** `Following up -- [Business Name]`

Replace these placeholders in the Day 3 template body:
- `[Name]` --> owner_name (or "there" if unknown)
- `[day]` --> the day of the week the initial email was sent (e.g., "Tuesday")
- `[City]` --> city value
- `[Business Name]` --> business_name

### Day 7 Template Personalization

**Subject:** `One more thing -- [Business Name]`

Replace these placeholders in the Day 7 template body:
- `[Name]` --> owner_name (or "there" if unknown)
- `[industry]` --> industry value (lowercase: "dental", "law", "HVAC")
- `[City]` --> city value

### Day 14 Template Personalization

**Subject:** `Closing the loop -- [Business Name]`

Replace these placeholders in the Day 14 template body:
- `[Name]` --> owner_name (or "there" if unknown)
- `[industry]` --> industry value (lowercase)
- `[City]` --> city value
- `[Business Name]` --> business_name

### Signature (all follow-ups)

Every follow-up is sent from:
```
Henry Vantieghem
Agentic Engineering Consulting
henry@agenticengineering.com
```

### Calendly Link

All templates already include the Calendly link. Verify it matches:
`https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min`

---

## Step 4: Send Follow-Ups via Gmail

For each personalized follow-up email:

1. Use Google Workspace MCP `draft_gmail_message` to create a draft:
   - `to`: the prospect's email address (`email_to` from Supabase or extracted from leads/ file)
   - `subject`: the personalized subject line
   - `body`: the personalized email body (plain text)
   - `from`: henry@agenticengineering.com

2. Then send the draft using the Gmail API pattern:
   - Extract OAuth token from macOS Keychain (service: `hardened-google-workspace-mcp`)
   - Send via `POST https://gmail.googleapis.com/gmail/v1/users/me/drafts/send`
   - Sleep 0.5s between sends to avoid rate limiting

3. If the user prefers drafts only (ask at the start), skip the send step — just create drafts.

**Sequence rules (from outreach/templates/follow-up.md):**
- Stop immediately if they responded (positive or negative)
- If they booked a meeting, update status to `booked` in Supabase
- If they asked to stop, update status to `declined` and never contact again
- Max 3 touches per lead. Respect their time.

---

## Step 5: Update Tracking

### Supabase Updates

After each successful send, update the corresponding column via Supabase MCP `execute_sql`:

**Day 3:**
```sql
UPDATE leaddrop_prospects
SET followup_1_sent_at = NOW()
WHERE id = 'PROSPECT_UUID';
```

**Day 7:**
```sql
UPDATE leaddrop_prospects
SET followup_2_sent_at = NOW()
WHERE id = 'PROSPECT_UUID';
```

**Day 14:**
```sql
UPDATE leaddrop_prospects
SET followup_3_sent_at = NOW(),
    status = 'archived'
WHERE id = 'PROSPECT_UUID';
```

Note: After the Day 14 (final) follow-up, set `status = 'archived'`. This prospect has received all 3 touches with no response. They can be re-dropped in 90 days.

### leads/ File Updates

For prospects tracked in `leads/*.md` files, update the checklist markers:

**Day 3:** Change `- [ ] Follow-up #1 sent` to `- [x] Follow-up #1 sent (YYYY-MM-DD)`
**Day 7:** Change `- [ ] Follow-up #2 sent` to `- [x] Follow-up #2 sent (YYYY-MM-DD)`
**Day 14:** Change `- [ ] Follow-up #3 sent` to `- [x] Follow-up #3 sent (YYYY-MM-DD)`

---

## Step 6: Print Summary Dashboard

After all follow-ups are processed, print:

```
========================================
  FOLLOW-UP PIPELINE COMPLETE
========================================

  Day 3 Follow-Ups Sent:  [N]
  Day 7 Follow-Ups Sent:  [N]
  Day 14 Follow-Ups Sent: [N]
  --------------------------------
  Total Emails Sent:       [N]
  Skipped (no email):      [N]
  Skipped (already replied): [N]

  BY INDUSTRY:
  Dental:    [N] day3 / [N] day7 / [N] day14
  Law:       [N] day3 / [N] day7 / [N] day14
  HVAC:      [N] day3 / [N] day7 / [N] day14
  Medical:   [N] day3 / [N] day7 / [N] day14
  [other]:   [N] day3 / [N] day7 / [N] day14

  UPCOMING (next 3 days):
  Day 3 due:  [N] prospects
  Day 7 due:  [N] prospects
  Day 14 due: [N] prospects

  PIPELINE HEALTH:
  Total sent (no reply):     [N]
  Total replied:             [N]
  Total booked:              [N]
  Total archived (3 touches): [N]
  Reply rate:                [X]%
========================================
```

Also run a lookahead query to show what's coming:

```sql
-- Prospects due for follow-up in the next 3 days
SELECT
  CASE
    WHEN followup_1_sent_at IS NULL AND email_sent_at <= NOW() - INTERVAL '3 days' THEN 'Day 3 NOW'
    WHEN followup_1_sent_at IS NULL AND email_sent_at <= NOW() - INTERVAL '2 days' THEN 'Day 3 tomorrow'
    WHEN followup_2_sent_at IS NULL AND followup_1_sent_at IS NOT NULL AND email_sent_at <= NOW() - INTERVAL '7 days' THEN 'Day 7 NOW'
    WHEN followup_2_sent_at IS NULL AND followup_1_sent_at IS NOT NULL AND email_sent_at <= NOW() - INTERVAL '6 days' THEN 'Day 7 tomorrow'
    WHEN followup_3_sent_at IS NULL AND followup_2_sent_at IS NOT NULL AND email_sent_at <= NOW() - INTERVAL '14 days' THEN 'Day 14 NOW'
    WHEN followup_3_sent_at IS NULL AND followup_2_sent_at IS NOT NULL AND email_sent_at <= NOW() - INTERVAL '13 days' THEN 'Day 14 tomorrow'
  END AS due_status,
  COUNT(*) as count
FROM leaddrop_prospects
WHERE status = 'sent'
GROUP BY due_status
HAVING due_status IS NOT NULL
ORDER BY due_status;
```

---

## Error Handling

- **No prospects due:** Print "No follow-ups due today. Pipeline is healthy." and show the lookahead.
- **Missing email address:** Skip the prospect, log it in the summary under "Skipped (no email)". Check if the leads/ file has an email that Supabase doesn't.
- **Gmail rate limit:** If a send fails, wait 5 seconds and retry once. If it fails again, log the error and continue to the next prospect.
- **OAuth token expired:** Re-extract from Keychain. If that fails, ask the user to run `/mcp` to re-authenticate.
- **Supabase columns missing:** Run the Step 0 migration and retry.

---

## Related Commands

- `/drop` -- Initial LeadDrop outreach (generates the prospects this skill follows up on)
- `/activate` -- Client onboarding when a prospect converts
- `/serve {slug}` -- Daily operations for activated clients
