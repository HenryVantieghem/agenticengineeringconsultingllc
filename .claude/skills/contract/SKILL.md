---
name: contract
description: Generate a client contract as a Google Doc with Stripe payment links for setup + retainer
argument-hint: <client-name>
---

<objective>
Generate a professional service agreement as a Google Doc for the specified client ($ARGUMENTS).
Includes Stripe payment links for the $300 setup fee and $200/mo retainer.
</objective>

<context>
- Read client context from `clients/{slug}/` or `syba/context/` if available
- Check memory for client details, ICP, and engagement history
- Use the standard Agentic Engineering pricing: $300 one-time setup + $200/mo retainer
- Stripe Payment Links (set up in Stripe Dashboard):
  - Setup Fee: {{STRIPE_SETUP_LINK}} ($300 one-time)
  - Monthly Retainer: {{STRIPE_RETAINER_LINK}} ($200/mo recurring)
</context>

<process>

<step name="gather">
1. Parse client name from $ARGUMENTS
2. Read any existing client context files
3. Determine scope of services (lead gen, dashboard, outreach, briefs)
4. Check if Stripe payment links exist in `.env` or memory
</step>

<step name="create-contract-doc">
Create a Google Doc titled "Agentic Engineering — Service Agreement — {CLIENT_NAME}" containing:

1. **Header**
   - "AGENTIC ENGINEERING CONSULTING LLC"
   - "SERVICE AGREEMENT"
   - Date, client name, Agentic Engineering contact info

2. **Parties**
   - Provider: Agentic Engineering Consulting LLC, Auburn, AL
   - Client: {CLIENT_NAME}, contact name, email

3. **Scope of Services**
   - AI Lead Intelligence Platform (custom dashboard, daily leads, outreach engine)
   - Daily lead generation pipeline (10-40 leads/day, ICP-targeted)
   - Personalized outreach packages (cold email, follow-up sequences, call scripts)
   - Intelligence briefings (daily HTML reports with trigger events)
   - Real-time dashboard (leads, pipeline analytics, briefing archive)
   - n8n automation workflows (HubSpot/Apollo sync as fallback)

4. **Deliverables**
   - Custom landing page for client
   - Client dashboard with Supabase Auth + RLS
   - Daily lead generation (Mon-Fri)
   - Outreach package per lead (email + 3 follow-ups + call script)
   - Weekly intelligence brief
   - n8n workflow templates for CRM integration

5. **Pricing & Payment Terms**
   - One-Time Setup Fee: **$300** (due upon signing)
     - Pay here: [Stripe Payment Link]
   - Monthly Retainer: **$200/month** (billed on the 1st)
     - Subscribe here: [Stripe Payment Link]
   - Payment via Stripe (credit card or ACH)
   - 30-day written notice to cancel monthly retainer

6. **Term & Termination**
   - Initial term: Month-to-month after setup
   - Either party may terminate with 30 days written notice
   - Setup fee is non-refundable after work begins
   - Client retains access to dashboard and data after termination

7. **Intellectual Property**
   - Client owns all generated leads, outreach content, and briefs
   - Agentic Engineering retains ownership of underlying platform and templates
   - Client receives perpetual license to their dashboard instance

8. **Confidentiality**
   - Both parties agree to keep business information confidential
   - Lead data and outreach strategies are client proprietary

9. **Limitation of Liability**
   - Services provided "as is" — no guarantee of lead conversion
   - Liability limited to fees paid in the prior 3 months
   - Not responsible for third-party service outages (Supabase, Netlify, etc.)

10. **Signatures**
    - Agentic Engineering: Henry Vantieghem, CEO & Founder
    - Client: {CLIENT_NAME} representative
    - Date lines for both parties

Use Google Workspace MCP (`mcp__hardened-workspace__create_doc`) to create the doc.
Apply formatting: bold headers, 14pt section titles, professional layout.
</step>

<step name="share-and-deliver">
1. Share the Google Doc with the client (edit access for signing)
2. If client email is known, draft a Gmail introducing the contract
3. Return the Google Doc link
4. Remind user to create Stripe Payment Links if not yet set up:
   - Go to https://dashboard.stripe.com/payment-links
   - Create Product 1: "AI Platform Setup" — $300 one-time
   - Create Product 2: "AI Platform Monthly" — $200/mo recurring
   - Save the links and add to `.env` as STRIPE_SETUP_LINK and STRIPE_RETAINER_LINK
</step>

</process>

<rules>
- Use Google Workspace MCP for doc creation — make it look professional
- Use builder agents for large doc content to avoid context overflow
- Include actual Stripe links if available, otherwise use placeholder with instructions
- Keep legal language simple and clear — this is a small business contract, not Fortune 500
- Always include both payment links prominently in the pricing section
- Do NOT auto-send or auto-share without user confirmation
</rules>
