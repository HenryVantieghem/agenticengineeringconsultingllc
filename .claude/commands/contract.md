---
description: "Generate a client service agreement — Google Doc with scope, pricing, terms, and Stripe payment link"
argument-hint: "<client-name>"
---

# /contract — Client Service Agreement Generator

You are the contract generation agent for Agentic Engineering Consulting. Given a client name and basic info, you create a professional service agreement in Google Docs, ready for the client to sign.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting LLC
**Email:** henry@agenticengineering.com

---

## Step 1: Gather Client Info

If the argument `$ARGUMENTS` is provided, use it as the client name. Otherwise ask:

1. **Client business name** — (required)
2. **Client contact name** — person signing the agreement
3. **Client email** — for sending the agreement
4. **Client website** — for scope reference
5. **Start date** — (default: today's date)
6. **Any custom terms?** — (default: standard terms)

---

## Step 2: Generate Agreement in Google Docs

Use the Google Workspace MCP (`create_doc`) to create a new Google Doc with the following content.

**Document title:** "Agentic Engineering — {Client Name} Service Agreement"

### Agreement Content:

---

**AGENTIC ENGINEERING CONSULTING LLC**
**AI Lead Intelligence Service Agreement**

---

**Date:** {start_date}
**Agreement #:** AEC-{YYYY}-{sequential_number}

---

**BETWEEN:**

**Service Provider:**
Agentic Engineering Consulting LLC
Auburn, Alabama
henry@agenticengineering.com

**Client:**
{Client Business Name}
{Client Contact Name}
{Client Email}

---

### 1. SERVICE OVERVIEW

Agentic Engineering Consulting LLC ("Provider") will deliver an AI-powered lead intelligence service to {Client Business Name} ("Client"), consisting of:

**Daily Lead Intelligence Package:**
- 20 researched leads per business day matching Client's ideal customer profile
- Full prospect intelligence briefs for each lead (company analysis, decision-maker info, pain points, fit scoring)
- Ready-to-send personalized outreach emails for each lead
- Follow-up email sequences (Day 3, 7, and 14) for each lead
- Real-time lead dashboard accessible 24/7 at {slug}-leads.netlify.app

**Initial Setup Includes:**
- Deep analysis of Client's business, services, and target market
- Custom ideal customer profile (ICP) development
- Personalized lead dashboard deployment
- Dashboard login credentials for Client team
- First batch of 20 leads delivered on activation day

---

### 2. PRICING

| Item | Amount | Frequency |
|------|--------|-----------|
| Setup Fee | $300.00 | One-time |
| Monthly Retainer | $200.00 | Monthly (recurring) |

**Payment Terms:**
- Setup fee due upon signing this agreement
- First monthly retainer due upon signing (prorated if mid-month)
- Subsequent monthly payments charged automatically on the same day each month
- All payments processed via Stripe (secure credit card or ACH)

**Payment Link:** {stripe_payment_link}

---

### 3. DELIVERABLES

Provider will deliver the following on each business day (Monday-Friday):

| Deliverable | Quantity | Delivery Method |
|-------------|----------|-----------------|
| Researched leads | 20 per day | Dashboard + Email |
| Prospect intelligence briefs | 20 per day | Dashboard + Email |
| Cold outreach emails (ready to send) | 20 per day | Dashboard + Email |
| Follow-up sequences | 20 per day | Dashboard |
| Daily briefing email | 1 per day | Email to Client |

**Monthly totals (approximate):**
- ~440 researched leads per month
- ~440 ready-to-send outreach emails
- ~440 follow-up sequences (3 emails each = 1,320 follow-ups)
- 22 daily briefing emails

---

### 4. CLIENT RESPONSIBILITIES

Client agrees to:
- Provide accurate information about their business, services, and ideal customers
- Provide a company website URL for initial analysis
- Provide email address(es) for daily briefing delivery
- Review and send outreach emails to leads (Provider does not send on Client's behalf unless separately agreed)
- Provide feedback on lead quality to improve targeting over time

---

### 5. TERM AND CANCELLATION

- **Initial Term:** Month-to-month (no long-term commitment)
- **Cancellation:** Either party may cancel with 14 days written notice
- **Refund Policy:** Setup fee is non-refundable. Monthly retainer is non-refundable for the current billing period. No charges after cancellation takes effect.
- **Pause Option:** Client may pause service for up to 30 days without cancellation (no charge during pause)

---

### 6. INTELLECTUAL PROPERTY

- All lead data and intelligence delivered to Client belongs to Client
- Provider retains ownership of AI systems, processes, and tools used to generate leads
- Client may use delivered content (emails, briefs) freely for their business purposes
- Provider may reference Client as a customer (with permission) for marketing purposes

---

### 7. CONFIDENTIALITY

- Provider will not share Client's business information, lead data, or dashboard access with third parties
- Client will not share Provider's AI systems, processes, or pricing with competitors
- This obligation survives termination of this agreement

---

### 8. LIMITATION OF LIABILITY

- Provider does not guarantee specific results (revenue, closed deals, response rates) from leads delivered
- Provider guarantees delivery of the specified number of daily leads
- Maximum liability is limited to fees paid in the current billing period
- Provider is not responsible for Client's use of outreach content or lead data

---

### 9. ACCEPTANCE

By making payment via the provided Stripe link, Client acknowledges reading and agreeing to all terms in this agreement.

**No physical signature required.** Payment constitutes acceptance.

---

**Agentic Engineering Consulting LLC**
Henry Vantieghem, Founder & CEO
Auburn, Alabama
henry@agenticengineering.com
https://agenticengineering.netlify.app

---

*Agreement generated on {date} by Agentic Engineering Consulting LLC.*

---

## Step 3: Share Document

After creating the Google Doc:

1. Use Google Workspace MCP (`get_drive_shareable_link`) to get a shareable link
2. Set permissions so the client can view (but not edit)

## Step 4: Email the Agreement

Use Google Workspace MCP (`draft_gmail_message`) to create a draft email:

**To:** {client_email}
**Subject:** "Your AI Lead Intelligence Agreement — {Client Name}"
**Body:**

```
Hi {contact_name},

Thanks for your interest in AI-powered lead intelligence for {business_name}.

I've prepared your service agreement — you can review it here:
{google_doc_link}

Quick summary:
- $300 one-time setup fee
- $200/month for 20 daily leads + dashboard + briefings
- Month-to-month, cancel anytime with 14 days notice
- Your system goes live within 24 hours of payment

To get started, simply complete payment here:
{stripe_payment_link}

Once payment is confirmed, I'll have your dashboard live and first 20 leads delivered within the same day.

Questions? Reply to this email or book a quick call:
https://calendly.com/henryvantieghem-agenticengineeringconsultingllc/30min

Best,
Henry Vantieghem
Agentic Engineering Consulting LLC
Auburn, Alabama
```

## Step 5: Summary

Print:
```
CONTRACT GENERATED
═══════════════════════════════════
Client:     {business_name}
Contact:    {contact_name}
Email:      {client_email}
Agreement:  {google_doc_link}
Payment:    {stripe_payment_link}
Monthly:    $200/mo + $300 setup
Gmail:      Draft created ✓

NEXT STEPS:
1. Review the draft email in Gmail
2. Add the correct Stripe payment link
3. Send the email
4. Once paid → run /activate {website_url}
═══════════════════════════════════
```

---

## Notes

- **Stripe payment link:** You must create this in Stripe Dashboard first (see `leaddrop/STRIPE_SETUP.md`)
- **Google Doc permissions:** View-only for client. They accept by paying, not by signing.
- **Payment = acceptance:** No e-signature needed. Stripe payment receipt serves as proof of agreement.
- **Customize per client:** If a client wants custom terms (more leads, different pricing), edit the doc before sending.
