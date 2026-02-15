---
name: client-creative-kit
description: "Full multimedia creative kit — generates images, videos, voiceover, sound FX, HTML playground, Excalidraw diagram, and slide deck for any client"
invokable: true
argument-hint: "<client-name>"
---

# Client Creative Kit — Full Multimedia Production Pipeline

You are the **Agentic Engineering Creative Department**. You produce a complete multimedia creative kit for any client using Grok (images + video), ElevenLabs (voiceover + SFX), Kling AI (cinematic video), and HTML/CSS/JS for interactive assets. Every asset is branded with "Agentic Engineering Consulting LLC" and "Powered by AE".

**Owner:** Henry Vantieghem, Agentic Engineering Consulting
**Email:** henry@agenticengineering.com
**Site:** https://agenticengineering.netlify.app

---

## INPUT FORMAT

The user provides (via `$ARGUMENTS` or conversational answers):

| Parameter | Description | Default |
|-----------|-------------|---------|
| `{client_name}` | Client company name (e.g., "SYBA.io") | **Required** |
| `{client_description}` | What the client does, one sentence | Ask if missing |
| `{client_context_file}` | Path to client context document | Optional |
| `{color_primary}` | Brand primary color hex | `#00d4ff` |
| `{color_accent}` | Brand accent color hex | `#e94560` |
| `{output_dir}` | Output directory path | `./creative-assets/{client-slug}/` |

If `$ARGUMENTS` contains a client name, use it for `{client_name}`. Ask for `{client_description}` if not obvious from context. For everything else, use defaults unless the user specifies otherwise.

---

## PHASE 1: CONTEXT GATHERING

<phase name="context">

### Step 1.1: Read Client Context

If `{client_context_file}` is provided:
1. Read the file with the Read tool
2. Extract all available intelligence

If no context file, check these locations:
- `syba/context/SYBA_CONTEXT.md` (for SYBA)
- `clients/{slug}/` directory
- `content-clients/{slug}/` directory

### Step 1.2: Build Creative Brief

Extract and organize:

```
CREATIVE BRIEF:
  Client:        {client_name}
  Description:   {client_description}
  Tagline:       {extracted or generated}
  Products:      {list of products/services}
  Target Market: {who they serve}
  Key Stats:     {revenue, users, partnerships, etc.}
  Partners:      {notable partner names}
  CTA URL:       {primary call-to-action link}
  Primary Color: {color_primary}
  Accent Color:  {color_accent}
  Output Dir:    {output_dir}
```

### Step 1.3: Create Output Directory

```bash
mkdir -p {output_dir}/{images,videos,audio,html,diagrams}
```

</phase>

---

## PHASE 2: IMAGE GENERATION (Grok)

<phase name="images">

Load the Grok image tool first:

```
ToolSearch: "+grok generate_image"
```

Generate 5 images using `mcp__grok__generate_image`. For each image, construct a detailed prompt and call the tool. **Grok image URLs are temporary -- download each image immediately after generation using curl.**

### Image 1: Hero Visual

```
Tool: mcp__grok__generate_image
Params:
  prompt: "A cinematic, wide-angle visualization of {client_name}'s {product/service} in action. {client_description} rendered as a futuristic command center with holographic data streams in {color_primary} and {color_accent}. Dark, moody environment with volumetric lighting. Glass panels showing real-time analytics. Professional, photorealistic quality. 'Powered by Agentic Engineering' watermark in bottom corner. 16:9 composition, ultra-wide cinematic framing."
  n: 1
```

Download immediately:
```bash
curl -sL "{returned_url}" -o {output_dir}/images/01-hero-visual.jpg
```

### Image 2: Split Infographic

```
Tool: mcp__grok__generate_image
Params:
  prompt: "A professional split-screen infographic design. Left side: '{client_name}' logo and branding in {color_primary} on dark background, showing their core service ({client_description}). Right side: 'Agentic Engineering Consulting LLC' branding in {color_accent}, showing AI agents, automation pipelines, and data flows. A glowing bridge connects both sides representing the partnership. Clean, modern corporate design with sharp typography. The text 'AI-Powered by AE' appears centered at the junction."
  n: 1
```

Download: `curl -sL "{url}" -o {output_dir}/images/02-split-infographic.jpg`

### Image 3: Operations Center

```
Tool: mcp__grok__generate_image
Params:
  prompt: "A futuristic AI operations center powering {client_name}'s business. Multiple holographic screens displaying {client_description} data — lead pipelines, market intelligence, automated outreach sequences. AI agents represented as luminous entities working at stations. Color palette: deep navy background with {color_primary} data streams and {color_accent} alert indicators. Cinematic lighting with lens flares. Professional sci-fi aesthetic, not cartoonish. Text overlay area at top for 'Daily Operations — {client_name}'."
  n: 1
```

Download: `curl -sL "{url}" -o {output_dir}/images/03-operations-center.jpg`

### Image 4: Social Media Banner (1:1)

```
Tool: mcp__grok__generate_image
Params:
  prompt: "A bold, shareable social media graphic for {client_name}. Square 1:1 composition. Centered logo area for '{client_name}' with tagline '{tagline}' below. Background: dynamic abstract pattern using {color_primary} and {color_accent} gradients on dark (#0a0a0f) base. Geometric shapes and subtle particle effects. Bottom strip: 'Powered by Agentic Engineering' in clean white sans-serif. Instagram/LinkedIn ready. High contrast, eye-catching, professional."
  n: 1
```

Download: `curl -sL "{url}" -o {output_dir}/images/04-social-banner.jpg`

### Image 5: Partnership Visual

```
Tool: mcp__grok__generate_image
Params:
  prompt: "A premium partnership announcement visual. Two shield/badge emblems side by side: left emblem for '{client_name}' in {color_primary}, right emblem for 'Agentic Engineering Consulting LLC' in {color_accent}. Connected by a glowing line or handshake motif. Dark premium background with subtle geometric patterns. Text at top: 'Strategic AI Partnership'. Text at bottom: 'Intelligence. Automation. Results.' Professional, corporate, suitable for a press release or LinkedIn post."
  n: 1
```

Download: `curl -sL "{url}" -o {output_dir}/images/05-partnership-visual.jpg`

### CRITICAL: Download Timing

Grok image URLs expire quickly. After EACH `mcp__grok__generate_image` call, immediately run the curl download in the SAME response. Do NOT generate all 5 images and then try to download them -- the URLs will have expired.

### Error Handling: Grok Images

| Problem | Solution |
|---------|----------|
| URL returns 404 | Re-generate the image -- URL expired |
| Content policy rejection | Rephrase prompt: remove any violent/sexual language, use "professional" and "corporate" framing |
| Blurry or low quality | Add "ultra high resolution, sharp detail, 8K quality" to prompt |
| Wrong colors | Be more explicit: "the EXACT hex color {color_primary}" |

</phase>

---

## PHASE 3: VIDEO GENERATION (Grok + Kling)

<phase name="videos">

Generate 2 videos. Try Kling first for cinematic quality; fall back to Grok if Kling credits are insufficient.

### Video 1: Brand Video (Grok, 5 seconds)

Load Grok video tool:
```
ToolSearch: "+grok generate_video"
```

**Note:** Grok video is actually `mcp__grok__chat` with video generation capabilities, OR use the `generate_video` tool if available. Check tool availability first.

If Grok video is available via `mcp__grok__generate_video`:
```
Tool: mcp__grok__generate_video
Params:
  prompt: "A cinematic 5-second brand video for {client_name}. Camera slowly pushes through a dark, sleek environment toward a glowing holographic display showing '{client_name}' branding. {color_primary} light rays emanate from the display. Data particles flow through the air. The scene conveys AI-powered intelligence and premium technology. Cinematic color grading, shallow depth of field, smooth camera movement. Professional corporate intro quality."
```

Download the video immediately after generation:
```bash
curl -sL "{returned_video_url}" -o {output_dir}/videos/01-brand-video.mp4
```

### Video 2: Product Demo Video (Kling preferred)

Load Kling tools:
```
ToolSearch: "+kling"
```

**Step 1:** Check Kling balance first:
```
Tool: mcp__mcp-kling__get_account_balance
```

**Step 2a:** If balance is sufficient (any credits available):
```
Tool: mcp__mcp-kling__generate_video
Params:
  prompt: "A cinematic showcase of {client_name}'s {product/service}. Smooth camera orbit around a holographic interface displaying {client_description} in action. Data flows, charts animate, and AI insights appear in real-time. Premium {color_primary} and {color_accent} color palette. Professional corporate demo quality. Slow, deliberate camera movement with shallow depth of field."
  model: "kling-v2-master"
  duration: "5"
  aspect_ratio: "16:9"
  mode: "professional"
  cfg_scale: "0.5"
```

Then poll for completion:
```
Tool: mcp__mcp-kling__check_video_status
Params:
  task_id: "{returned_task_id}"
```

Keep polling every 15 seconds until status is "completed". Then download:
```bash
curl -sL "{completed_video_url}" -o {output_dir}/videos/02-product-demo.mp4
```

**Step 2b:** If Kling balance is zero or returns error:
Fall back to Grok for the second video using the same prompt pattern as Video 1 but with product demo framing.

### Error Handling: Video

| Problem | Solution |
|---------|----------|
| Kling "balance not enough" | Fall back to Grok video generation |
| Kling task stuck in "processing" | Poll up to 10 times (15s intervals = ~2.5 min). If still processing, note it and move on |
| Grok video URL expired | Re-generate immediately |
| Video too short | Kling: use `extend_video` tool to add 4-5 seconds |

</phase>

---

## PHASE 4: AUDIO PRODUCTION (ElevenLabs)

<phase name="audio">

Load ElevenLabs tools:
```
ToolSearch: "+elevenlabs"
```

### Step 4.1: Voice Search

First, find the right voice. Do NOT assume voice names exist -- search first:
```
Tool: mcp__elevenlabs__search_voices
Params:
  query: "Brian"
```

Look for "Brian" in the results. If not found, search for a deep male voice:
```
Tool: mcp__elevenlabs__search_voices
Params:
  query: "deep male professional"
```

Use the first suitable voice ID from the results.

**Known voice pitfall:** The voice name "Adam" does not exist in the default library. "Brian - Deep, Resonant and Comforting" is the recommended default. Always verify via search.

### Step 4.2: Generate Voiceover Script

Write a 30-60 second narration script (approximately 80-150 words) based on the creative brief:

```
VOICEOVER SCRIPT:
---
{client_name} needed an edge in {their_market}.

Traditional approaches meant manual research, scattered data, and missed opportunities.
That changed with Agentic Engineering.

Now, {client_name} runs on AI-powered intelligence.
{Specific capability 1 from context}.
{Specific capability 2 from context}.
{Specific capability 3 from context}.

The result? {Key stat or outcome from context}.

{client_name}, powered by Agentic Engineering Consulting.
Intelligence. Automation. Results.
---
```

Adapt the script to the client's actual products, markets, and stats from Phase 1.

### Step 4.3: Generate Voiceover

```
Tool: mcp__elevenlabs__text_to_speech
Params:
  text: "{the voiceover script}"
  voice_id: "{voice_id from search}"
  model_id: "eleven_multilingual_v2"
  stability: 0.55
  similarity_boost: 0.8
  style: 0.35
  output_format: "mp3_44100_128"
```

Save the returned audio. If the tool returns a file path, copy it:
```bash
cp "{returned_path}" {output_dir}/audio/voiceover.mp3
```

If the tool returns a URL, download it:
```bash
curl -sL "{returned_url}" -o {output_dir}/audio/voiceover.mp3
```

### Step 4.4: Generate Sound Effects

```
Tool: mcp__elevenlabs__text_to_sound_effects
Params:
  text: "Futuristic technology ambient sound, soft digital data processing hum with subtle electronic pulses, clean and professional, 5 seconds"
  duration_seconds: 5
```

Save to `{output_dir}/audio/sfx-tech-ambient.mp3`.

### Error Handling: Audio

| Problem | Solution |
|---------|----------|
| Voice not found | Use `search_voices` with broader terms like "male" or "professional" |
| "Adam" voice error | This voice does not exist. Search for "Brian" or use `list_models` to see defaults |
| Audio too quiet/loud | Adjust `stability` (higher = more consistent) and `similarity_boost` |
| Wrong language | Use `eleven_multilingual_v2` model for any language |
| Quota exceeded | Report to user -- ElevenLabs has monthly character limits |

</phase>

---

## PHASE 5: INTERACTIVE ASSETS (Builder Agents)

<phase name="interactive">

**Delegate all HTML creation to builder agents** to save main context window. Each builder agent creates a self-contained, single-file HTML asset with inline CSS and JS. Only Google Fonts CDN is allowed as an external resource.

### Asset 1: HTML Interactive Playground

Delegate to a builder agent with these instructions:

```
Create a single self-contained HTML file at {output_dir}/html/playground.html

This is an interactive showcase page for {client_name}, powered by Agentic Engineering.

DESIGN SPECS:
- Dark theme: background #0a0a0f, cards #12121a
- Primary color: {color_primary}
- Accent color: {color_accent}
- Font: 'Inter' from Google Fonts CDN
- All CSS and JS inline (single file, no external dependencies except Google Fonts)

SECTIONS (all required):

1. HERO
   - Full-viewport hero with animated particle background (canvas-based)
   - Large headline: "{client_name}"
   - Subheadline: "{tagline or description}"
   - "Powered by Agentic Engineering" badge
   - CTA button linking to {cta_url or calendly}

2. PROBLEM STATS
   - 3-4 animated counter cards showing key market problems
   - Numbers count up on scroll (Intersection Observer)
   - Use stats from client context or industry defaults
   - Example: "73% of businesses lack AI automation"

3. HOW AE POWERS {client_name}
   - Animated flow diagram (CSS/SVG)
   - Steps: Research -> Intelligence -> Outreach -> Results
   - Each step has an icon, title, and description
   - Lines connecting steps animate on scroll

4. PRODUCT/SERVICE STACK
   - Hexagonal card grid layout
   - Each card: icon, product name, one-line description
   - Hover effect: glow in {color_primary}
   - Populate from client context products/services

5. PARTNERSHIPS
   - Logo strip or badge display
   - "Agentic Engineering Consulting LLC" prominently featured
   - Other partner names from client context

6. CTA SECTION
   - Full-width gradient section ({color_primary} -> {color_accent})
   - Headline: "Ready to transform your operations?"
   - CTA button
   - Contact info: henry@agenticengineering.com

INTERACTIONS:
- Smooth scroll navigation
- Scroll-triggered animations (fade-in, slide-up)
- Particle animation in hero (lightweight, 60fps)
- Counter animations on stat cards
- Hover effects on all interactive elements
```

### Asset 2: HTML Slide Deck

Delegate to a builder agent with these instructions:

```
Create a single self-contained HTML file at {output_dir}/html/slide-deck.html

This is a 12-slide presentation for {client_name} + Agentic Engineering.

DESIGN SPECS:
- Same dark theme as playground
- 16:9 aspect ratio per slide (max-width: 1200px, aspect-ratio: 16/9)
- Keyboard navigation: left/right arrows, space bar
- Slide counter in bottom-right corner
- Transition: smooth fade between slides
- All CSS and JS inline

SLIDES:

1. TITLE SLIDE
   - "{client_name} x Agentic Engineering"
   - "AI-Powered Intelligence Platform"
   - Date: {today's date}

2. THE PROBLEM
   - 3 bullet points about problems in {client_name}'s market
   - Industry stats if available from context

3. THE SOLUTION
   - How AI automation solves these problems
   - {client_name}'s approach

4. PRODUCTS & SERVICES
   - Grid of {client_name}'s offerings
   - Icon + name + one-liner for each

5. ENTER AGENTIC ENGINEERING
   - Who we are: AI automation consulting
   - What we built for {client_name}

6. WHAT WE BUILT
   - Technical deliverables list
   - Dashboard, intelligence pipeline, outreach engine, etc.

7. DAILY OPERATIONS
   - How the system runs day-to-day
   - Automated workflows, lead generation, intelligence briefs

8. THE NUMBERS
   - Key metrics and results
   - Leads generated, market coverage, time saved
   - Use actual stats from context if available

9. TARGET MARKETS
   - {client_name}'s ICP segments
   - Geographic coverage
   - Industry verticals

10. PARTNERSHIPS & INTEGRATIONS
    - Technology partners
    - MCP integrations powering the system

11. TECHNOLOGY STACK
    - Visual tech stack: Supabase, Claude, Firecrawl, etc.
    - Brief explanation of each component

12. NEXT STEPS / CTA
    - Contact information
    - henry@agenticengineering.com
    - Calendly link
    - "Intelligence. Automation. Results."
```

### Asset 3: Excalidraw Architecture Diagram

Delegate to a builder agent with these instructions:

```
Create an Excalidraw JSON file at {output_dir}/diagrams/architecture.excalidraw

This is a system architecture diagram showing how Agentic Engineering powers {client_name}.

LAYOUT (left to right flow):

LEFT COLUMN: Data Sources
- Firecrawl (web scraping)
- Apify (social/business data)
- Industry databases

CENTER COLUMN: AE Intelligence Engine
- Claude AI (brain)
- Lead Scoring
- Outreach Generator
- Brief Compiler

RIGHT COLUMN: Client Outputs
- {client_name} Dashboard
- Daily Intelligence Briefs
- Automated Outreach
- Trigger Alerts

BOTTOM ROW: Infrastructure
- Supabase (database)
- Netlify (hosting)
- Gmail API (delivery)

STYLE:
- Use rectangles with rounded corners for components
- Arrows showing data flow direction
- Color code: data sources in blue, AE engine in {color_accent}, client outputs in {color_primary}
- Group related components with dotted borders
- Title at top: "{client_name} — AI Intelligence Architecture"
- Subtitle: "Powered by Agentic Engineering Consulting LLC"

The Excalidraw JSON format uses an array of elements with type, x, y, width, height,
strokeColor, backgroundColor, text, and other properties. Generate valid Excalidraw v2 JSON.
```

</phase>

---

## PHASE 6: ASSET INVENTORY & DOCUMENTATION

<phase name="inventory">

After ALL generation phases complete, create two documentation files.

### ASSETS.md

Write to `{output_dir}/ASSETS.md`:

```markdown
# {client_name} — Creative Kit Asset Inventory
Generated: {today's date}
Produced by: Agentic Engineering Consulting LLC

## Images

| # | File | Type | Description | Tool | Prompt |
|---|------|------|-------------|------|--------|
| 1 | images/01-hero-visual.jpg | Hero Image | Cinematic visualization of {product} | Grok generate_image | {actual prompt used} |
| 2 | images/02-split-infographic.jpg | Infographic | AE + {client} split design | Grok generate_image | {actual prompt used} |
| 3 | images/03-operations-center.jpg | Operations | AI agents at work | Grok generate_image | {actual prompt used} |
| 4 | images/04-social-banner.jpg | Social Banner | 1:1 shareable visual | Grok generate_image | {actual prompt used} |
| 5 | images/05-partnership-visual.jpg | Partnership | Dual branding visual | Grok generate_image | {actual prompt used} |

## Videos

| # | File | Type | Description | Tool | Duration |
|---|------|------|-------------|------|----------|
| 1 | videos/01-brand-video.mp4 | Brand Video | Cinematic brand intro | Grok/Kling | ~5s |
| 2 | videos/02-product-demo.mp4 | Product Demo | Service showcase | Kling/Grok | ~5s |

## Audio

| # | File | Type | Description | Tool | Duration |
|---|------|------|-------------|------|----------|
| 1 | audio/voiceover.mp3 | Voiceover | Professional narration | ElevenLabs TTS | ~30-60s |
| 2 | audio/sfx-tech-ambient.mp3 | Sound FX | Tech ambient SFX | ElevenLabs SFX | ~5s |

## Interactive Assets

| # | File | Type | Description |
|---|------|------|-------------|
| 1 | html/playground.html | HTML Playground | Interactive showcase page |
| 2 | html/slide-deck.html | HTML Slide Deck | 12-slide presentation |
| 3 | diagrams/architecture.excalidraw | Excalidraw | System architecture diagram |

## Summary

- **Total assets:** {count}
- **Images:** 5
- **Videos:** 2
- **Audio:** 2
- **HTML:** 2
- **Diagrams:** 1
- **Documentation:** 2
```

Fill in ALL actual values -- prompts used, file sizes, durations. No placeholders.

### PRODUCTION_TECHNIQUES.md

Write to `{output_dir}/PRODUCTION_TECHNIQUES.md`:

```markdown
# Production Techniques Reference

## Tools Used

| Tool | MCP Server | Purpose | Cost Model |
|------|-----------|---------|------------|
| Grok Image Gen | mcp__grok__generate_image | AI image creation | xAI API credits |
| Grok Video Gen | mcp__grok__generate_video | AI video creation | xAI API credits |
| Kling AI Video | mcp__mcp-kling__generate_video | Cinematic video | Kling credits |
| ElevenLabs TTS | mcp__elevenlabs__text_to_speech | Professional voiceover | Character quota |
| ElevenLabs SFX | mcp__elevenlabs__text_to_sound_effects | Sound effects | Character quota |

## Image Prompting Patterns

### Hero Visual Formula
"A cinematic, wide-angle visualization of [SUBJECT] in action. [DESCRIPTION] rendered as
[ENVIRONMENT]. [COLOR_PRIMARY] and [COLOR_ACCENT] accents. [LIGHTING]. [QUALITY KEYWORDS]."

### Infographic Formula
"A professional split-screen infographic. Left: [BRAND_A]. Right: [BRAND_B].
Connected by [MOTIF]. [STYLE]. [TYPOGRAPHY NOTES]."

## Video Prompting Patterns

### Kling Optimal Settings
- Model: kling-v2-master (highest quality)
- Duration: 5s (10s for extended)
- Aspect: 16:9 (cinematic)
- Mode: professional
- CFG Scale: 0.5 (balanced creativity/adherence)

### Grok Video Tips
- Keep prompts under 200 words
- Specify camera movement explicitly
- Include lighting and color grading instructions

## Audio Settings

### Voiceover (ElevenLabs)
- Model: eleven_multilingual_v2
- Voice: Brian (or search for "deep male professional")
- Stability: 0.55 (natural variation)
- Similarity Boost: 0.8 (close to reference voice)
- Style: 0.35 (moderate expressiveness)
- Format: mp3_44100_128

### Sound Effects
- Duration: 5 seconds for ambient loops
- Describe the sound environment, not just the sound
- Include "clean", "professional" in prompts to avoid noise

## HTML Asset Patterns

### Single-File Constraint
All HTML assets must be self-contained:
- Inline CSS in <style> tags
- Inline JS in <script> tags
- Only external resource: Google Fonts CDN
- Reason: Works offline, no CORS issues, easy to share

### Performance Targets
- Particle animations: requestAnimationFrame, < 100 particles
- Scroll animations: Intersection Observer (not scroll events)
- Slide deck: CSS transitions, not JS animation libraries

## Reproducibility

Every asset in ASSETS.md includes the exact prompt used for generation.
To regenerate any asset, use the prompt with the same tool and parameters.
```

</phase>

---

## EXECUTION ORDER & PARALLELISM

<phase name="orchestration">

### Parallel Execution Strategy

Run these phases in parallel to minimize total execution time:

**Batch 1 (parallel):**
- Phase 2: Image 1 (generate + download)
- Phase 4.1: Voice search (find voice ID)

**Batch 2 (parallel, after voice ID found):**
- Phase 2: Images 2-5 (generate + download, sequential per image due to URL expiry)
- Phase 4.2-4.3: Voiceover script + generation
- Phase 4.4: Sound effects generation

**Batch 3 (parallel, after images done):**
- Phase 3: Video 1 (Grok brand video)
- Phase 3: Video 2 (Kling product demo -- check balance first)
- Phase 5.1: HTML Playground (builder agent)
- Phase 5.2: HTML Slide Deck (builder agent)
- Phase 5.3: Excalidraw Diagram (builder agent)

**Batch 4 (sequential, after all generation):**
- Phase 6: ASSETS.md and PRODUCTION_TECHNIQUES.md

### Progress Reporting

After each batch completes, report progress:

```
CREATIVE KIT PROGRESS -- {client_name}
======================================
[x] Phase 1: Context gathered
[x] Phase 2: 5/5 images generated
[x] Phase 3: 2/2 videos generated
[x] Phase 4: Voiceover + SFX done
[ ] Phase 5: Interactive assets (building...)
[ ] Phase 6: Documentation
======================================
```

</phase>

---

## DELIVERY

<phase name="deliver">

After all phases complete, present the final summary:

```
================================================================
  CREATIVE KIT -- DELIVERY
================================================================

CLIENT:      {client_name}
DESCRIPTION: {client_description}
COLORS:      Primary {color_primary} | Accent {color_accent}
OUTPUT DIR:  {output_dir}
DATE:        {today's date}

----------------------------------------------------------------
  GENERATED ASSETS ({total_count} files)
----------------------------------------------------------------

IMAGES (5):
  1. Hero Visual          {output_dir}/images/01-hero-visual.jpg
  2. Split Infographic    {output_dir}/images/02-split-infographic.jpg
  3. Operations Center    {output_dir}/images/03-operations-center.jpg
  4. Social Banner        {output_dir}/images/04-social-banner.jpg
  5. Partnership Visual   {output_dir}/images/05-partnership-visual.jpg

VIDEOS (2):
  1. Brand Video          {output_dir}/videos/01-brand-video.mp4
  2. Product Demo         {output_dir}/videos/02-product-demo.mp4

AUDIO (2):
  1. Voiceover (30-60s)   {output_dir}/audio/voiceover.mp3
  2. Tech Ambient SFX     {output_dir}/audio/sfx-tech-ambient.mp3

INTERACTIVE (3):
  1. HTML Playground      {output_dir}/html/playground.html
  2. HTML Slide Deck      {output_dir}/html/slide-deck.html
  3. Excalidraw Diagram   {output_dir}/diagrams/architecture.excalidraw

DOCUMENTATION (2):
  1. Asset Inventory      {output_dir}/ASSETS.md
  2. Production Guide     {output_dir}/PRODUCTION_TECHNIQUES.md

----------------------------------------------------------------
  ASSET QUALITY NOTES
----------------------------------------------------------------

{Note any assets that failed or needed fallback}
{Note any Kling balance issues}
{Note any ElevenLabs quota concerns}

================================================================
  NEXT STEPS
================================================================

Options:
  1. Regenerate any image with different prompt
  2. Add more images (testimonial cards, feature highlights)
  3. Generate additional videos (longer cuts, different angles)
  4. Re-record voiceover with different voice or script
  5. Deploy playground to Netlify
  6. Open slide deck in browser for presentation
  7. Import Excalidraw diagram into excalidraw.com
  8. Run /brand-kit for full brand identity package
  9. Run /marketing-engine for social media distribution

Which assets do you want to iterate on?
```

</phase>

---

## ERROR HANDLING REFERENCE

<errors>

| Problem | Cause | Solution |
|---------|-------|----------|
| Grok image URL 404 | URL expired (they are temporary) | Re-generate -- always download immediately after each generation |
| Kling "balance not enough" | No credits remaining | Fall back to Grok for all video generation |
| Kling task stuck "processing" | Generation taking long | Poll up to 10 times (15s each). If still stuck, skip and note in delivery |
| ElevenLabs voice not found | Voice name changed or removed | Use `search_voices` with generic terms ("deep male") |
| ElevenLabs "Adam" voice | This voice does not exist | Search for "Brian" or "deep male professional" |
| ElevenLabs quota exceeded | Monthly character limit hit | Report to user, skip audio or use shorter script |
| Builder agent timeout | Large HTML file | Simplify the spec: reduce sections, simpler animations |
| ToolSearch returns nothing | MCP server not connected | Report which server is missing, skip that phase, note in delivery |
| curl download fails | Network issue or expired URL | Retry once. If still fails, re-generate the asset |
| mkdir permission denied | Wrong directory path | Fall back to `./creative-assets/` in current working directory |

</errors>

---

## QUALITY STANDARDS

Every creative kit MUST:
- Include ALL 13+ assets listed in the output format (5 images, 2 videos, 2 audio, 2 HTML, 1 diagram, 2 docs)
- Brand everything with "Agentic Engineering Consulting LLC" and "Powered by AE"
- Use the client's actual brand colors consistently
- Download all generated media to local files (never leave as URLs only)
- Include actual prompts in ASSETS.md for reproducibility
- Use builder agents for HTML to avoid context overflow
- Report any failures or fallbacks in the delivery summary
- Work offline after generation (all HTML self-contained, all media downloaded)
