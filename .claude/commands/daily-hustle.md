# Daily Business Automation — Agentic Engineering Consulting

You are running Henry's daily business automation for Agentic Engineering Consulting LLC in Auburn, Alabama. Execute all 5 steps below.

## Step 1: Lead Generation

Search for local businesses in Auburn, AL that would benefit from AI phone answering and automation. Target these industries: dental practices, law firms, HVAC & plumbing, real estate, medical offices, property management, auto repair, veterinarians.

Use these tools:
- `firecrawl_search` — search for "[industry] Auburn AL" across Google Maps, Yelp, BBB, and local directories
- `apify` — use the Google Maps Scraper actor to extract structured data (name, address, phone, email, website, rating, hours)

For each business found, extract:
- Business name
- Industry
- Phone number
- Email (if available)
- Website URL
- Google rating
- Physical address

**Deduplication:** Before creating a new lead file, check `leads/` directory. If a file with a matching business slug already exists, skip it.

## Step 2: Lead Profile Creation

For each NEW lead (not already in `leads/`), create a markdown file at `leads/[business-slug].md` using this template:

```
# [Business Name]

**Industry:** [type] | **Status:** New
**Phone:** [number] | **Email:** [email or "Not found"]
**Website:** [url] | **Address:** [address]
**Google Rating:** [rating]/5

## Pain Points (Inferred)
- [2-3 industry-specific pain points related to missed calls, manual scheduling, after-hours availability]

## Outreach
**Pitch angle:** [1-sentence personalized pitch based on their industry]

### Cold Email Draft
[Use the template from outreach/templates/cold-email.md, personalized for this business]

### Call Script Draft
[Use the template from outreach/templates/call-script.md, personalized for this business]

## Timeline
- [today's date] — Created (auto-generated via /daily-hustle)
```

## Step 3: Outreach Drafting

For each new lead profile created, generate:
1. A personalized cold email using the template in `outreach/templates/cold-email.md`
2. A phone call script using the template in `outreach/templates/call-script.md`

Include these directly in the lead profile file.

## Step 4: Pipeline Dashboard

Read ALL files in the `leads/` directory and display a summary dashboard:

### Pipeline Status
| Status | Count | Businesses |
|--------|-------|-----------|
| New | [n] | [list] |
| Contacted | [n] | [list] |
| Responded | [n] | [list] |
| Meeting Booked | [n] | [list] |
| Closed | [n] | [list] |

### Revenue Projections
- Leads in pipeline: [total]
- If 20% close at $497/mo avg: $[projection]/mo
- If 20% close at $997/mo avg: $[projection]/mo

### Follow-ups Due Today
[List any leads where last contact was 3+ days ago and status is "Contacted"]

## Step 5: Today's Action Items

Summarize what Henry should do TODAY:
1. **Calls to make:** [list new leads with phone numbers]
2. **Emails to send:** [list new leads with email addresses]
3. **Follow-ups:** [list overdue follow-ups]
4. **Meetings:** [check calendar if Google Workspace MCP is available]

---
*Run this command daily: `/daily-hustle`*
