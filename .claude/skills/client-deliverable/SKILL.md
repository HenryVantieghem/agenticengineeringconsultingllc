---
name: client-deliverable
description: Create client-facing + internal value docs via Google Docs for any client
argument-hint: <client-slug>
---

<objective>
Create two Google Docs for the specified client ($ARGUMENTS):

1. **Client-Facing Deliverable** — What the client now has, how to use it, logins, links, daily workflow
2. **Internal Value Document** — Architecture, costs, value created, what agencies would charge
</objective>

<context>
- Read the client's context from `syba/context/` or `clients/{slug}/` directory
- Check Supabase for current data counts (leads, outreach, briefings, trigger events)
- Check the client's dashboard deployment URL
- Read memory for pipeline status and email history
</context>

<process>

<step name="gather">
1. Read client context files for ICP, products, pricing, recipients
2. Query Supabase for data counts (leads, outreach_packages, briefings, trigger_events)
3. Check Netlify deployment URL and status
4. Read recent conversation logs for briefs sent, emails delivered
</step>

<step name="doc1-client-facing">
Create a Google Doc titled "{CLIENT_NAME} — AI Lead Intelligence Platform" containing:

1. **Executive Summary** — What was built, the value proposition
2. **What You Now Have** — Dashboard, daily intelligence, outreach engine
3. **Access & Credentials** — Landing page URL, dashboard URL, login email/password
4. **How It Works Daily** — Daily lead generation pipeline explained simply
5. **What This Replaces** — HubSpot/Apollo comparison, why this is better
6. **Intelligence Briefs Sent** — Links/references to the briefs delivered
7. **Your Lead Pipeline** — Current stats (leads, outreach, fit scores, regions)
8. **Next Steps** — Follow-up schedule, what to expect going forward

Send to: client recipients (from clients table or context)
</step>

<step name="doc2-internal-value">
Create a Google Doc titled "{CLIENT_NAME} — Project Value & Architecture Report" containing:

1. **Architecture Overview** — Tech stack diagram (Supabase, Netlify, Claude Code, MCPs)
2. **What Was Built** — Every component itemized with effort description
3. **Agency Pricing Comparison** — What firms charge for equivalent work
4. **Cost Breakdown** — Claude Code Max, Supabase, Netlify, Apify, Firecrawl, n8n
5. **Value Created** — Pipeline value, addressable market, leads generated
6. **n8n Automations** — Fallback workflows for HubSpot/Apollo integration
7. **Ongoing Operations** — Daily /serve command, follow-up engine, brief generation

Keep internal (do not share with client)
</step>

<step name="deliver">
1. Share Doc 1 with client recipients (view access)
2. Return both Google Doc links
3. Optionally draft a Gmail to client introducing the deliverable
</step>

</process>

<rules>
- Use Google Workspace MCP (hardened-workspace) for doc creation
- Use builder agents for large doc content to avoid context overflow
- Include actual data and links — no placeholder text
- Client doc should be polished and professional
- Internal doc should be detailed and honest about costs
- Always verify Google auth is working before creating docs
</rules>
