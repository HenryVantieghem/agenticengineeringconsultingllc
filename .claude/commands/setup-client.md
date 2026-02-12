---
description: "Setup a new client — creates dashboard, Supabase records, daily command, and deploys to Netlify"
---

# /setup-client — New Client Onboarding

You are the Agentic Engineering client setup agent. You will gather information about a new client, then create everything they need: dashboard, database records, daily command, and Netlify deployment.

## Step 1: Gather Client Information
Ask the user these questions (use AskUserQuestion tool for structured input):

1. **Client name + slug** — e.g., "SYBA" / "syba" (slug must be lowercase, no spaces)
2. **Industry / what they sell** — free text description of their business
3. **Target ICP segments** — decision-maker titles and industries they want to reach
4. **Target regions** — countries/cities with lead allocation (e.g., "Belgium 20, Europe 10, USA 10")
5. **Recipient emails** — who gets the daily briefing (comma-separated)
6. **Calendly URL** — for CTAs in outreach
7. **Brand accent color** — hex code (e.g., #e94560)
8. **Key stats/partnerships for credibility** — notable partnerships, awards, stats for outreach

## Step 2: Create Context Document
Write `clients/{slug}/context/{SLUG}_CONTEXT.md` with:
- Company overview from user's answers
- ICP segments with titles, pain points, hooks
- Regional messaging rules
- Key statistics for outreach
- Outreach tone and style guidelines
- Calendly link and CTA format

## Step 3: Create Dashboard
1. Copy all files from `clients/template/` to `clients/{slug}/`
2. Edit `clients/{slug}/js/config.js` — replace placeholders:
   - `{{SLUG}}` → client slug
   - `{{NAME}}` → client name
   - `{{COLOR}}` → accent color hex
   - `{{ANON_KEY}}` → Supabase anon key from .env

## Step 4: Create Supabase Records
Insert the client row into Supabase `clients` table:
- slug, name, industry, context (JSON from Step 2), recipients, calendly_url, accent_color

Create Supabase auth users for each recipient email:
- Set `user_metadata.client_id` to the new client's UUID
- Use a temporary password and instruct Henry to share it with the client

## Step 5: Deploy Dashboard
Use Netlify MCP to deploy `clients/{slug}/` as a new Netlify site:
- Site name: `{slug}-leads`
- URL will be: `{slug}-leads.netlify.app`

## Step 6: Create Daily Command
Copy `clients/template/daily-command-template.md` to `.claude/commands/{slug}-daily.md`
Replace all template variables:
- `{{SLUG}}` → slug
- `{{NAME}}` → name
- `{{CONTEXT_PATH}}` → `clients/{slug}/context/{SLUG}_CONTEXT.md`
- `{{RECIPIENTS}}` → comma-separated recipient emails
- `{{CALENDLY}}` → Calendly URL
- `{{REGIONS}}` → region configuration from user input
- `{{ICP_SEGMENTS}}` → ICP segments from user input

## Step 7: Create Outreach Skill
Copy `clients/template/outreach-skill-template.md` to `.claude/skills/{slug}-outreach-generator/SKILL.md`
Replace all template variables with client-specific values.

## Step 8: Summary
Print:
- Client name and slug
- Dashboard URL: `{slug}-leads.netlify.app`
- Daily command: `/{slug}-daily`
- Outreach skill: `/{slug}-outreach-generator`
- Recipient login credentials (temporary passwords)
- Supabase client_id
- Next step: "Run `/{slug}-daily` to generate the first batch of leads"
