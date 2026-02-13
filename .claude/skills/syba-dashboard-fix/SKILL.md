---
name: syba-dashboard-fix
description: Fix, update, and redeploy the SYBA dashboard — login flow, data loading, UI improvements, and Netlify deploy
argument-hint: [focus area: login|data|ui|full]
---

<objective>
Fix and update the SYBA.io client dashboard at `clients/syba/` to be a fully functional lead intelligence platform that replaces HubSpot and Apollo.

Focus: $ARGUMENTS (default: full rebuild)
</objective>

<context>
- **Dashboard location:** `clients/syba/`
- **Template:** `clients/template/`
- **Supabase project:** `wghzabtkmntpclynntpp`
- **SYBA client UUID:** `ed91c1d0-8bc2-4be4-84ad-d9a3812f60fe`
- **Auth users:** brigittev@syba.io / francis@syba.io (password: SybaLeads2026)
- **Netlify site:** syba-leads.netlify.app (ID: 400296a9-3cd3-40c5-98d7-c9da48b9b3ad)
- **Briefs directory:** `syba/briefs/`
- **Deploy method:** Direct upload via Netlify MCP (no git-based deploy)
</context>

<process>

<step name="audit">
1. Read ALL current dashboard files (`clients/syba/` — HTML, CSS, JS)
2. Query Supabase for current SYBA data (leads, briefings, outreach_packages)
3. Check auth users and RLS policies
4. Identify what's broken (data not loading, auth issues, missing features)
</step>

<step name="fix-auth">
1. Simplify to single login page (email + password)
2. Ensure auth flow works with Supabase user_metadata.client_id = 'syba'
3. Redirect to dashboard after successful login
4. Add persistent session (don't require re-login on refresh)
</step>

<step name="fix-data">
1. Make leads table load and display with real Supabase data
2. Make briefings/intelligence briefs render as rich HTML
3. Make outreach packages (emails sent) visible with status
4. Add real-time updates via Supabase Realtime subscriptions
5. Ensure RLS filters data to only SYBA's records
</step>

<step name="redesign-ui">
Design an intuitive dashboard that replaces HubSpot/Apollo:
1. **Command Center** — Today's metrics at a glance (leads found, emails sent, responses)
2. **Lead Pipeline** — Visual kanban or table with lead status, company, contact info
3. **Intelligence Briefs** — Rich HTML briefs with prospect research
4. **Outreach Tracker** — Emails sent, follow-up schedule, response tracking
5. **Clean, modern UI** — Dark theme, responsive, zero learning curve
</step>

<step name="deploy">
1. Build the updated dashboard
2. Test locally (verify auth, data loading, UI)
3. Deploy to Netlify via MCP direct upload
4. Verify live at syba-leads.netlify.app
</step>

</process>

<rules>
- Vanilla HTML/CSS/JS only (no frameworks) — matches existing architecture
- Supabase JS v2 CDN — no npm/build step
- RLS uses `auth.jwt()->'user_metadata'->>'client_id'` (NOT top-level)
- briefings column is `content_html` (NOT `html_content`)
- outreach_packages has flat text columns (email_subject, email_body, followup_1/2/3)
- Date queries use `.eq('created_date', today)` NOT `.gte()/.lt()`
- Deploy via Netlify MCP direct upload (NOT git-based)
</rules>
