---
description: "Deploy creative assets to Netlify and deliver to client via Gmail — one-shot showcase pipeline"
argument-hint: "<client-name>"
---

# /showcase — Client Creative Showcase Pipeline

Deploy creative assets and deliver them to a client in one shot.

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com

---

## Step 1: Identify Client and Locate Assets

The client name is provided as the argument: `$ARGUMENTS`

If no argument provided, ask the user for the client name.

### Locate the creative assets directory. Check these paths in order:

1. `syba/creative-assets/` (SYBA-specific legacy path)
2. `{client}/creative-assets/` (client directory at repo root)
3. `creative-assets/{client}/` (centralized creative dir)
4. `clients/{client}/creative-assets/` (inside client dashboard dir)
5. `content-clients/{client}/creative-assets/` (content clients dir)

Set `ASSET_DIR` to whichever path contains files.

### Verify Required Files

Check that these files exist in `ASSET_DIR`:

- `playground.html` — interactive showcase (required)
- `presentation.html` — slide deck (required)
- `ASSETS.md` — asset inventory (optional, used for report)

If `playground.html` or `presentation.html` are missing, stop and tell the user:

```
Missing required assets in {ASSET_DIR}:
  - playground.html: {FOUND/MISSING}
  - presentation.html: {FOUND/MISSING}

Run /client-creative-kit {client} first to generate these assets.
```

### Inventory Additional Assets

Scan `ASSET_DIR` for all files and categorize:
- Images: *.jpeg, *.jpg, *.png, *.webp
- Videos: *.mp4, *.mov, *.webm
- Audio: *.mp3, *.wav, *.m4a
- Diagrams: *.excalidraw
- Docs: *.md

If `ASSETS.md` exists, read it for the complete inventory and descriptions.

---

## Step 2: Deploy to Netlify

Deploy the entire `ASSET_DIR` as a Netlify site so both HTML files are accessible.

### 2a. Create or Find Site

The site name should be `{client}-showcase`. Check if it already exists:

```bash
netlify api listSites --data '{}' 2>/dev/null | grep -o '"url":"[^"]*{client}-showcase[^"]*"' || true
```

If the site does not exist, create it:

```bash
netlify api createSite --data '{"body":{"name":"{client}-showcase"}}'
```

**Note:** Use `netlify api createSite` to avoid the interactive team selection prompt that causes exit code 13.

### 2b. Deploy Assets

Deploy `ASSET_DIR` to the site in production mode:

```bash
netlify deploy --dir={ASSET_DIR} --site={client}-showcase --prod
```

If deploy fails with a site not found error, get the site ID from the createSite response and use `--site={site_id}` instead.

### 2c. Confirm Live URLs

After successful deploy, the live URLs are:
- **Playground:** `https://{client}-showcase.netlify.app/playground.html`
- **Presentation:** `https://{client}-showcase.netlify.app/presentation.html`

Verify both URLs are accessible using `curl -s -o /dev/null -w "%{http_code}"` for each. If either returns non-200, troubleshoot the deploy.

---

## Step 3: Get Client Contact Info

### For SYBA:
- **Recipients:** francis@syba.io, brigittev@syba.io
- **Client name (display):** SYBA
- **Context file:** `syba/context/SYBA_CONTEXT.md`
- **Calendly CTA:** https://calendly.com/with-francis-at-syba-io/15min
- **Existing dashboard:** https://syba-leads.netlify.app

### For Other Clients:
1. Check for context file: `clients/{client}/context/{CLIENT}_CONTEXT.md`
2. Check Supabase: `SELECT name, recipients, calendly_url FROM clients WHERE slug = '{client}';`
3. If neither exists, ask the user for:
   - Recipient email(s)
   - Client display name
   - Any specific CTA link (default: Henry's Calendly)

---

## Step 4: Craft Deliverable Email

Build the deliverable email HTML. Read from `ASSET_DIR` for any existing email template first (e.g., `*deliverable*email*.html` or `*delivery*.html`). If one exists, use it as the base and inject the live URLs.

If no template exists, generate the email from scratch using this structure:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;margin:0 auto;background:#0a0a0a;">
    <tr>
      <td style="padding:40px 30px;">

        <!-- Header -->
        <div style="text-align:center;margin-bottom:40px;">
          <h1 style="color:#ffffff;font-size:28px;margin:0;">Your AI Creative Kit is Ready</h1>
          <p style="color:#888;font-size:14px;margin-top:8px;">Prepared for {CLIENT_DISPLAY_NAME} by Agentic Engineering</p>
        </div>

        <!-- Intro -->
        <p style="color:#ccc;font-size:16px;line-height:1.6;">
          Hi {FIRST_NAME},
        </p>
        <p style="color:#ccc;font-size:16px;line-height:1.6;">
          Your custom AI-generated creative kit is complete. Everything below is live and ready for your team to review.
        </p>

        <!-- Interactive Playground CTA -->
        <div style="background:#111;border:1px solid #333;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
          <h2 style="color:#00d4ff;font-size:20px;margin:0 0 8px;">Interactive Playground</h2>
          <p style="color:#999;font-size:14px;margin:0 0 16px;">Animated showcase with live stats, flow diagrams, and partner logos</p>
          <a href="{{PLAYGROUND_URL}}" style="display:inline-block;background:#00d4ff;color:#000;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:16px;">Open Playground</a>
        </div>

        <!-- Presentation CTA -->
        <div style="background:#111;border:1px solid #333;border-radius:12px;padding:24px;margin:24px 0;text-align:center;">
          <h2 style="color:#00d4ff;font-size:20px;margin:0 0 8px;">12-Slide Presentation</h2>
          <p style="color:#999;font-size:14px;margin:0 0 16px;">Premium slide deck with cinematic animations — navigate with arrow keys</p>
          <a href="{{PRESENTATION_URL}}" style="display:inline-block;background:transparent;color:#00d4ff;text-decoration:none;padding:12px 32px;border-radius:8px;font-weight:600;font-size:16px;border:2px solid #00d4ff;">View Presentation</a>
        </div>

        <!-- Asset Summary -->
        <div style="background:#111;border:1px solid #333;border-radius:12px;padding:24px;margin:24px 0;">
          <h3 style="color:#fff;font-size:16px;margin:0 0 12px;">What's Included</h3>
          <table width="100%" style="color:#ccc;font-size:14px;">
            <tr><td style="padding:4px 0;">Interactive playground</td><td style="text-align:right;color:#00d4ff;">Live</td></tr>
            <tr><td style="padding:4px 0;">12-slide presentation</td><td style="text-align:right;color:#00d4ff;">Live</td></tr>
            <tr><td style="padding:4px 0;">Hero images ({IMAGE_COUNT})</td><td style="text-align:right;color:#00d4ff;">Included</td></tr>
            <tr><td style="padding:4px 0;">AI-generated videos ({VIDEO_COUNT})</td><td style="text-align:right;color:#00d4ff;">Included</td></tr>
            <tr><td style="padding:4px 0;">Professional voiceover</td><td style="text-align:right;color:#00d4ff;">Included</td></tr>
            <tr><td style="padding:4px 0;">Architecture diagram</td><td style="text-align:right;color:#00d4ff;">Included</td></tr>
          </table>
        </div>

        <!-- CTA -->
        <div style="text-align:center;margin:32px 0;">
          <p style="color:#ccc;font-size:16px;line-height:1.6;">
            Want to discuss how we use these assets in your growth pipeline?
          </p>
          <a href="{CALENDLY_URL}" style="display:inline-block;background:#00d4ff;color:#000;text-decoration:none;padding:14px 40px;border-radius:8px;font-weight:700;font-size:16px;margin-top:8px;">Book 15 Minutes</a>
        </div>

        <!-- Sign-off -->
        <p style="color:#ccc;font-size:16px;line-height:1.6;margin-top:32px;">
          Best,<br>
          Henry Vantieghem<br>
          <span style="color:#888;font-size:14px;">Agentic Engineering Consulting</span><br>
          <span style="color:#888;font-size:14px;">henry@agenticengineering.com</span>
        </p>

      </td>
    </tr>
  </table>
</body>
</html>
```

### Replace Placeholders

Inject actual values into the email HTML:
- `{{PLAYGROUND_URL}}` --> `https://{client}-showcase.netlify.app/playground.html`
- `{{PRESENTATION_URL}}` --> `https://{client}-showcase.netlify.app/presentation.html`
- `{CLIENT_DISPLAY_NAME}` --> the client's display name
- `{FIRST_NAME}` --> first name of primary recipient (e.g., "Francis" for SYBA)
- `{CALENDLY_URL}` --> the client's Calendly link or Henry's default
- `{IMAGE_COUNT}` --> number of images found in asset inventory
- `{VIDEO_COUNT}` --> number of videos found in asset inventory

---

## Step 5: Create Gmail Draft

### 5a. Load Gmail MCP Tools

Use ToolSearch to find and load the Gmail draft tool:
```
ToolSearch: "+hardened-workspace draft"
```

### 5b. Create the Draft

Use the Gmail MCP tool to create a draft:

```
Tool: mcp__hardened-workspace__draft_gmail_message
Params:
  user_google_email: "henryvantieghem@gmail.com"
  to: ["{recipient_1}", "{recipient_2}"]
  subject: "Your {CLIENT_DISPLAY_NAME} AI Creative Kit is Ready — Interactive Playground, Video, and Full Presentation Inside"
  body: "{the final email HTML with all placeholders replaced}"
  is_html: true
```

If Gmail MCP is not authenticated, instruct the user:
```
Gmail MCP not authenticated. Run:
  ToolSearch: "+hardened-workspace auth"
Then:
  mcp__hardened-workspace__start_google_auth with user_google_email: "henryvantieghem@gmail.com"
```

### 5c. Save Email to Disk

Also save the final email HTML to `ASSET_DIR/{client}-deliverable-email.html` for future reference.

---

## Step 6: Delivery Report

Print the final summary:

```
================================================================
  SHOWCASE DELIVERY — {CLIENT_DISPLAY_NAME}
================================================================

DEPLOYED:
  Playground:    https://{client}-showcase.netlify.app/playground.html
  Presentation:  https://{client}-showcase.netlify.app/presentation.html

EMAIL DRAFT CREATED:
  To:      {recipient_1}, {recipient_2}
  Subject: Your {CLIENT_DISPLAY_NAME} AI Creative Kit is Ready...
  Status:  Draft ready in Gmail — review and send

ASSETS INCLUDED:
  - Interactive playground (live URL)
  - 12-slide presentation (live URL)
  - {IMAGE_COUNT} hero images (embedded in playground/presentation)
  - {VIDEO_COUNT} AI videos (in asset directory)
  - Professional voiceover (in asset directory)
  - Architecture diagram (Excalidraw)

ASSET DIRECTORY:
  {ASSET_DIR}/

NEXT STEPS:
  1. Open Gmail and review the draft
  2. Optionally attach video/audio files from {ASSET_DIR}/
  3. Hit Send
  4. Follow up in 3 days: /follow-up {client}
================================================================
```

---

## Client-Specific Overrides

### SYBA
- **Recipients:** francis@syba.io, brigittev@syba.io
- **First name:** Francis
- **Assets dir:** syba/creative-assets/
- **Context:** syba/context/SYBA_CONTEXT.md
- **Calendly CTA:** https://calendly.com/with-francis-at-syba-io/15min
- **Existing sites:** syba-leads.netlify.app (dashboard)
- **Subject line override:** "Your SYBA AI Creative Kit is Ready — Interactive Playground, Video, and Full Presentation Inside"

---

## Error Handling

| Problem | Solution |
|---------|----------|
| No assets found | Tell user to run `/client-creative-kit {client}` first |
| Netlify deploy fails (site not found) | Run `netlify api createSite` first, then retry deploy |
| Netlify deploy fails (auth) | Run `netlify login` or check Netlify MCP auth |
| Gmail MCP not authenticated | Run `start_google_auth` with henryvantieghem@gmail.com |
| No email template and no client context | Generate email from the default template in Step 4 |
| curl verification returns non-200 | Wait 10s and retry — Netlify CDN propagation can take a moment |
| ASSET_DIR has no images/videos | Adjust the email template to remove those line items |

---

## Efficiency Rules

1. **Do not regenerate assets** — this command deploys and delivers what already exists
2. **Single Netlify site** — both playground and presentation go to the same site
3. **Save the email HTML** — write it to disk before creating the draft (backup)
4. **Verify deploy before emailing** — confirm URLs return 200 before crafting the email
5. **Use ASSETS.md if available** — it has exact file counts, sizes, and descriptions

---

## Related Commands

- `/client-creative-kit {client}` — Generate the creative assets (run BEFORE /showcase)
- `/follow-up {client}` — Follow up 3 days after sending the showcase
- `/serve {client}` — Daily lead intelligence (ongoing service)
- `/activate` — Full client onboarding (if not yet activated)

*Deploy and deliver: `/showcase {client}`*
*Generate assets first: `/client-creative-kit {client}`*
*Follow up after delivery: `/follow-up {client}`*
