# AI Creative Production Techniques — Research Brief

**Date:** 2026-02-14
**Purpose:** Actionable techniques for AI-generated videos, images, voiceovers, and interactive web showcases using our available toolchain.

---

## Table of Contents

1. [AI Video Production (Kling AI + Grok)](#1-ai-video-production)
2. [Multi-Tool Video Workflow](#2-multi-tool-video-workflow)
3. [Gemini Image Generation](#3-gemini-image-generation)
4. [ElevenLabs Voiceover Production](#4-elevenlabs-voiceover-production)
5. [Interactive Web Playgrounds](#5-interactive-web-playgrounds)
6. [Prompt Templates Library](#6-prompt-templates-library)
7. [Production Pipeline](#7-production-pipeline)

---

## 1. AI Video Production

### Kling AI — Prompting Framework

**Prompt Structure Template:**
```
[Shot type] of [subject] [action/movement], [environment/setting], [camera movement], [lighting/mood], [style/aesthetic]
```

**Example:**
```
Medium shot of a professional SaaS dashboard interface materializing on a floating glass screen,
modern minimalist office environment with soft ambient lighting, slow dolly-in at 0.5m/s,
cool blue and white color palette, cinematic corporate aesthetic, ultra-detailed 4K
```

**Camera Movement Parameters (8 Primary Types):**

| Movement | Description | Prompt Syntax |
|----------|-------------|---------------|
| Dolly | Forward/backward | "slow dolly-in", "dolly out revealing..." |
| Tracking | Lateral following | "tracking shot following subject left to right" |
| Crane/Jib | Vertical arc | "crane shot rising from desk level to overhead" |
| Pan | Horizontal rotation | "pan from left to right across the dashboard" |
| Tilt | Vertical rotation | "tilt up from hands on keyboard to face" |
| Orbit | 360-degree around subject | "slow orbit around the product at 15deg/s" |
| Handheld | Natural shake | "handheld documentary style" |
| Steadicam | Smooth floating | "steadicam follow through the office" |

**Advanced Combinations:** Dolly Zoom, Arc Track, Crane Pan, Push-In Tilt.

**Power Words by Category:**
- **Motion:** gracefully, swiftly, gradually, explosively, smoothly, dynamically
- **Quality:** cinematic, ultra-detailed, photorealistic, studio-quality, broadcast-ready
- **Atmosphere:** ethereal, dramatic, moody, vibrant, serene, intense, mysterious

**Negative Prompts (always include):**
```
blur, distortion, watermark, text overlay, low quality, compression artifacts,
flickering, inconsistent lighting, morphing faces, extra limbs, unnatural physics
```

**Kling Technical Settings:**
- Resolution: 1080p (1920x1080) for professional output
- Frame rate: 30fps standard
- Duration: 5s (quick clips) or 10s (extended scenes)
- Quality mode: Cinematic (Kling 2.1 Pro) for highest quality
- Kling 3.0 supports 15-second generation with multi-shot sequences (up to 6 camera angles)

### Grok Imagine — Video Generation via API/MCP

**Available via our MCP tools:** `mcp__grok__generate_video`, `mcp__grok__generate_image`, `mcp__grok__chat_with_vision`

**API Parameters:**

| Parameter | Options | Recommended |
|-----------|---------|-------------|
| `model` | `grok-imagine-video` | Only option |
| `duration` | 1-15 seconds | 10s for product demos |
| `aspect_ratio` | 1:1, 16:9, 9:16, 4:3, 3:4 | 16:9 for demos, 9:16 for social |
| `resolution` | 480p, 720p | 720p always |

**Grok Video Modes:**
1. **Text-to-Video** — Generate from description alone
2. **Image-to-Video** — Animate a still image (best for product shots)
3. **Video Editing** — Modify existing videos with text instructions

**Grok Prompt Structure for Image-to-Video:**
```
Subject + Motion, Background + Motion, Camera + Motion
```

**Grok Generation Modes:**
- **Normal:** Balanced, realistic — use for corporate/product content
- **Fun:** Creative, dynamic — use for social media
- **Custom:** Precise control — use when exact motion matters

**Key Advantage:** Speed. Grok generates significantly faster than competitors. It also auto-generates 4 soundtrack variations per video.

---

## 2. Multi-Tool Video Workflow

### The 8-Layer Technical Orchestration Framework (2026 Standard)

Replace "vibes-based" prompting with structured control:

1. **Subject/Scene** — Core entity and environment definition
2. **Emotion Arc** — Explicit emotional transitions ("anticipation to relief")
3. **Optics** — Lens specs (focal length, aperture, depth of field)
4. **Camera Motion** — Precise vectors with speed ("dolly-in at 0.5m/s")
5. **Lighting Stack** — Key, fill, rim with color temps ("5600K key, 3200K rim")
6. **Style/Look** — Film emulation and color grading
7. **Audio/Mood** — Generative audio cues
8. **Continuity Anchors** — Seed IDs and palette tokens for multi-shot stability

### Multi-Shot Consistency (Prompt Chaining)

1. **Generate the Hero Shot first** — Extract Seed ID and subject descriptors
2. **Token Inheritance** — Repeat identical subject descriptors across ALL shots
3. **Motion Vectoring** — Maintain logical camera progression (consistent directional flow)

**Example 3-Shot Product Demo Sequence:**
- Shot 1: Wide establishing, static camera, product centered, 5600K studio lighting
- Shot 2: Macro detail, same 5600K lighting, product visible in background blur
- Shot 3: Medium action shot, slow pan, consistent wardrobe/environment

### Recommended Tool Assignment

| Stage | Tool | Why |
|-------|------|-----|
| Concept art / stills | Gemini Image Gen | Best text rendering, brand consistency |
| Hero product shots | Grok Image Gen | Fast iteration, good quality |
| Product demo video | Kling AI (MCP) | Best motion quality, 15s duration |
| Social clips (fast) | Grok Video Gen (MCP) | Fastest generation, built-in audio |
| Character animation | Kling AI | Best human-centric realism |
| Voiceover narration | ElevenLabs TTS (MCP) | Professional corporate voices |
| Sound effects | ElevenLabs SFX (MCP) | Text-to-sound-effects |
| Background music | ElevenLabs Music (MCP) | AI composition |
| Post-production | HTML/CSS/JS | Interactive assembly, overlays |

### n8n Automation Pipeline

Pre-built n8n workflow templates exist for:
- **Short-form video generation:** OpenAI script + Flux images + Kling video + ElevenLabs VO
- **Multi-platform publishing:** Auto-post to Instagram, TikTok, YouTube, Facebook, X, LinkedIn
- **Photo-to-video transformation:** Static image + Kling animation + auto-distribute
- **Personalized outreach videos:** HeyGen avatar + ElevenLabs voice + Perplexity research

### Artifact Prevention

- **Negative prompts:** Always include "avoid warped anatomy, flickering lights, floating objects, low resolution"
- **Frame rate trick:** Generate at 60fps, downsample to 24fps to smooth temporal jitter
- **Render budgets:** Plan 3-15 minutes per 60 seconds depending on model
- **Consistency fix:** Use fixed seed values and detailed subject descriptions across shots

---

## 3. Gemini Image Generation

### Available via: `~/.claude/design-agency/generate_image.py` (Gemini 3 Pro Image API)

### Core Principle

"Describe the scene, don't just list keywords." Narrative, descriptive paragraphs outperform disconnected word lists.

### Prompt Architecture for Corporate/Brand Visuals

**Include these elements in every prompt:**
1. Shot type (wide-angle, macro, portrait)
2. Subject with specific details
3. Action or composition
4. Environment/setting
5. Lighting (use color temperature: "5600K daylight key light")
6. Mood/atmosphere
7. Camera/lens specs ("85mm portrait lens, f/1.4")
8. Texture and material descriptions

### Text Rendering (Gemini's Strength)

Gemini excels at rendering text in images — ideal for:
- Marketing materials with headlines
- Social media posts with copy
- Product mockups with UI text
- Diagrams and infographics
- Logo concepts

**Text Rendering Tips:**
- Specify exact text in quotes
- Define font style explicitly ("bold sans-serif", "elegant serif")
- Describe design aesthetic around the text
- Generate text content first, then generate the image containing it

### Style Control for Brand Consistency

- Use consistent prompts across a series for uniform style, color grading, and effects
- Specify brand colors explicitly ("SYBA brand palette: deep navy #1a1a2e, accent red #e94560")
- Use photographic terminology for composition control
- Explain the image's intended use ("for a LinkedIn carousel post about AI automation")

### Corporate Visual Prompt Templates

**Executive Portrait:**
```
Ultra-clean studio portrait, professional corporate style, soft diffused lighting,
realistic skin texture, neutral gray background, natural confident expression,
sharp 8K quality, 85mm lens f/2.8
```

**Product Dashboard Showcase:**
```
Photorealistic laptop screen displaying modern SaaS dashboard with dark theme,
floating glass desk in minimalist office, soft ambient lighting from large windows,
shallow depth of field, 35mm lens, warm neutral color palette, premium tech aesthetic
```

**Data Visualization Hero:**
```
Isometric 3D data visualization floating above a conference table, glowing blue and
white holographic charts and graphs, dark corporate environment, volumetric lighting,
cinematic depth of field, futuristic but professional aesthetic
```

### 5-Variant Strategy (from PaperBanana Framework)

For every concept, generate:
1. **Faithful** — Exact to brief
2. **Enhanced** — Brief + elevated quality
3. **Alt Composition** — Different layout/angle
4. **Style Variation** — Different artistic approach
5. **Bold/Creative** — Push creative boundaries

**Resolution values MUST be uppercase:** "2K" not "2k"

### Known Limitations

- Complex typography may need iteration
- Character consistency across multiple images requires restarting conversations with detailed descriptions
- Highly nuanced requests benefit from iterative refinement via follow-up prompts

---

## 4. ElevenLabs Voiceover Production

### Available MCP Tools

- `mcp__elevenlabs__text_to_speech` — Core TTS
- `mcp__elevenlabs__speech_to_speech` — Voice conversion
- `mcp__elevenlabs__text_to_sound_effects` — SFX generation
- `mcp__elevenlabs__search_voices` — Find voices
- `mcp__elevenlabs__voice_clone` — Clone a voice
- `mcp__elevenlabs__compose_music` — AI music
- `mcp__elevenlabs__play_audio` — Preview audio
- `mcp__elevenlabs__isolate_audio` — Noise removal

### Corporate Narration Settings

**Golden Setting for Most Narrations:**
- Stability: 50%
- Similarity: 75%
- Style: 0 (default)

**For Serious/Professional Tone:**
- Stability: 60-75% (higher = more consistent, bordering monotone at extremes)
- Similarity: 75%
- Speed: 0.9-1.0 (slightly slower reads more authoritatively)

**Stability Modes (v3):**
- **Creative** — Most expressive, risk of hallucinations
- **Natural** — Balanced, closest to original voice (RECOMMENDED for corporate)
- **Robust** — Highly stable, less responsive to direction

### Recommended Voices for Corporate Content

| Voice | Best For |
|-------|----------|
| Josh | Documentary, motivational — clear, authoritative |
| Bella | Warm corporate, explainer videos |
| Jordan | Neutral professional narration |
| Adam | Stable, calm corporate narration |

### Text Formatting for Best Results

**Pauses:**
- Use `<break time="1.5s" />` for controlled pauses (v1/v2 only)
- For v3: Use punctuation, dashes, or ellipses instead
- Structure text with line breaks between paragraphs

**Pronunciation:**
- Use CMU Arpabet for consistent pronunciation (over IPA)
- Create pronunciation dictionaries for brand names, acronyms, technical terms
- Phoneme tags work only with Flash v2, Turbo v2, and English v1

**Emotion Control (v3 Audio Tags):**
```
[confident] Welcome to the future of lead intelligence.
[thoughtful] Every business deserves access to actionable data.
[excited] And now, with SYBA, that future is here.
```

**Available tags:** `[whispers]`, `[laughs]`, `[sarcastic]`, `[excited]`, `[sighs]`, `[confident]`, `[thoughtful]`, `[strong X accent]`

**Important:** Match tags to your voice's character. A serious professional voice will not respond well to playful tags.

### Professional Production Tips

1. Write in scriptwriting/narrative style to guide tone and pacing
2. Use explicit dialogue tags for predictable delivery
3. Use speed setting 0.7-1.2 to control velocity
4. Layer segmented outputs in post-production for complex compositions
5. Normalization is ON by default — handles numbers, dates, abbreviations
6. For LLM-generated scripts: explicitly instruct the LLM to expand abbreviations and spell out numbers

### AI Dubbing for Scale

ElevenLabs AI Dubbing Studio translates videos into 20+ languages with lip-sync. Potential add-on service for clients ($50-200 per video).

---

## 5. Interactive Web Playgrounds

### Recommended Stack for Product Showcases

**Core Libraries:**
- **GSAP (GreenSock)** — Industry-standard animation library
- **GSAP ScrollTrigger** — Scroll-linked animations (FREE plugin)
- **Three.js** — 3D WebGL scenes (optional, for premium demos)
- **ScrollSmoother** — Smooth scroll experience (GSAP premium)

### GSAP ScrollTrigger Pattern (Vanilla HTML/CSS/JS)

```html
<!-- CDN Links -->
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
```

**Key Animation Patterns:**

1. **Scroll-Revealed Sections** — Elements fade/slide in as user scrolls
2. **Pinned Product Demos** — Dashboard screenshot pinned while features animate around it
3. **Parallax Depth** — Background/foreground layers move at different speeds
4. **Counter Animations** — Numbers count up as they enter viewport
5. **Staggered Card Reveals** — Feature cards appear in sequence
6. **Horizontal Scroll Sections** — Scroll horizontally through a product tour

### Implementation Approach (Vanilla JS, No Framework)

Since our stack is vanilla HTML/CSS/JS (no React/Next.js), use:

```javascript
// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Fade-in on scroll
gsap.utils.toArray('.feature-card').forEach(card => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: "power2.out"
  });
});

// Pinned product demo
gsap.to('.dashboard-screenshot', {
  scrollTrigger: {
    trigger: '.product-section',
    start: "top top",
    end: "+=200%",
    pin: true,
    scrub: 1
  },
  scale: 1.1,
  filter: "brightness(1.1)"
});
```

### Animation Types for Product Showcases

| Pattern | Use Case | Complexity |
|---------|----------|------------|
| Fade + slide in | Feature sections | Low |
| Counter animation | Stats/metrics | Low |
| Pinned scroll | Product walkthrough | Medium |
| Parallax layers | Hero section | Medium |
| Staggered reveals | Card grids | Medium |
| Morphing shapes | Brand animation | High |
| 3D product rotation | Physical products | High (Three.js) |
| Particle effects | Background ambiance | High (Three.js) |

### CSS-Only Animations (No JS Required)

Modern CSS (2026) handles many animations natively:

```css
/* Scroll-driven animation (native CSS) */
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.feature-card {
  animation: fadeSlideIn linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

/* Smooth hover transitions */
.cta-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(233, 69, 96, 0.3);
}
```

### Reference Examples

- **Codrops (Feb 2026):** Scroll-revealed WebGL gallery with GSAP + Three.js + Astro + Barba.js
- **Awwwards CSS/JS Animations Collection:** Curated production-quality examples
- **FreeFrontend:** 270+ GSAP examples, 51 ScrollTrigger examples, 139 CSS animation examples

---

## 6. Prompt Templates Library

### Corporate Product Demo Video (Kling AI)

```
Cinematic medium shot of a sleek laptop displaying a modern dark-themed analytics
dashboard with glowing data visualizations, sitting on a minimalist white desk in
a premium office with floor-to-ceiling windows showing a city skyline at golden hour.
Slow dolly-in from medium to close-up, soft ambient lighting with 5600K key light
and warm 3200K rim light from the windows. Data points on screen subtly animate
and pulse. Professional corporate aesthetic, photorealistic, broadcast-ready quality.
Negative: blur, distortion, watermark, flickering, low quality, compression artifacts.
```

### Social Media Hook Video (Grok Imagine)

```
Dynamic top-down shot of a smartphone screen showing a notification alert
"5 New Qualified Leads" with confetti particles, hand reaches to pick up phone,
camera follows upward to reveal smiling business owner, modern office background
with warm lighting, energetic and optimistic mood, 9:16 vertical format
```

### Hero Image for Landing Page (Gemini)

```
Create an image: Isometric view of a futuristic AI command center with holographic
screens displaying lead data, contact profiles, and engagement metrics. Dark navy
background (#1a1a2e) with glowing accent highlights in coral red (#e94560) and
electric blue (#4ecdc4). Clean, modern illustration style with subtle gradients
and glass-morphism effects. No people. Text overlay space on the right third.
Premium SaaS aesthetic, 16:9 aspect ratio, 4K quality.
```

### Corporate Voiceover Script (ElevenLabs)

```
[confident] Your business generates leads every single day.

[thoughtful] But how many slip through the cracks... because no one followed up in time?

<break time="1.0s" />

[excited] Introducing LeadDrop. AI-powered lead intelligence that works while you sleep.

We research your market. We find your ideal customers. We deliver actionable
intelligence straight to your inbox, every single morning.

[confident] No more guessing. No more missed opportunities.

Just qualified leads, ready to close.
```

---

## 7. Production Pipeline

### End-to-End Creative Asset Pipeline

```
PHASE 1: CONCEPT
  Input: Client brief, brand guidelines, target audience
  Tool: Claude Code (script + storyboard)
  Output: Shot list, VO script, visual brief

PHASE 2: STATIC ASSETS
  Tool: Gemini Image Gen (via generate_image.py)
  Process: 5-variant strategy per concept
  Output: Hero images, product shots, social graphics

PHASE 3: VIDEO GENERATION
  Tool A: Kling AI (MCP) — product demos, character scenes
  Tool B: Grok Imagine (MCP) — social clips, fast iterations
  Process: Image-to-video for hero shots, text-to-video for b-roll
  Output: 5-15s video clips at 720p-1080p

PHASE 4: AUDIO PRODUCTION
  Tool: ElevenLabs (MCP)
  Process:
    1. text_to_speech — Corporate narration (Josh/Adam voice, Stability 50%, Similarity 75%)
    2. text_to_sound_effects — UI sounds, ambient audio
    3. compose_music — Background score
  Output: VO track, SFX library, background music

PHASE 5: INTERACTIVE ASSEMBLY
  Tool: HTML/CSS/JS + GSAP
  Process: Build scroll-triggered product showcase
  Elements: Pinned demos, parallax, counter animations, video embeds
  Output: Deployable HTML page (Netlify)

PHASE 6: AUTOMATION (OPTIONAL)
  Tool: n8n workflows
  Process: Auto-generate + auto-post to social platforms
  Output: Multi-platform content distribution
```

### Quick Reference: MCP Tool Names

```
# Video
mcp__mcp-kling__generate_video
mcp__mcp-kling__generate_image_to_video
mcp__mcp-kling__check_video_status
mcp__mcp-kling__extend_video
mcp__grok__generate_video
mcp__grok__generate_image

# Audio
mcp__elevenlabs__text_to_speech
mcp__elevenlabs__text_to_sound_effects
mcp__elevenlabs__compose_music
mcp__elevenlabs__search_voices
mcp__elevenlabs__voice_clone
mcp__elevenlabs__play_audio

# Image
Gemini via generate_image.py (REST API)
mcp__grok__generate_image

# Research
mcp__grok__web_search
mcp__grok__x_search
```

---

## Sources

### AI Video Production
- [Kling 3.0 Prompting Guide (Atlabs AI)](https://www.atlabs.ai/blog/kling-3-0-prompting-guide-master-ai-video-generation)
- [Kling AI Prompt Guide (Ambience AI)](https://www.ambienceai.com/tutorials/kling-prompting-guide)
- [AI Video Prompt Engineering 2026 Guide (TrueFan AI)](https://www.truefan.ai/blogs/ai-video-prompt-engineering-2026-guide)
- [Cinematic AI Video Prompts 2026 (TrueFan AI)](https://www.truefan.ai/blogs/cinematic-ai-video-prompts-2026)
- [Kling AI vs Runway Comparison (pxz.ai)](https://pxz.ai/blog/kling-ai-vs-runway)
- [Video Prompting Strategies (Medium)](https://medium.com/@creativeaininja/how-to-actually-control-next-gen-video-ai-runway-kling-veo-and-sora-prompting-strategies-92ef0055658b)

### Grok / xAI
- [Grok Imagine API (xAI)](https://x.ai/news/grok-imagine-api)
- [xAI Video Generation Docs](https://docs.x.ai/docs/guides/video-generation)
- [xAI Image Generation Docs](https://docs.x.ai/docs/guides/image-generations)
- [Grok Imagine Prompt Guide (grokimagineai.net)](https://www.grokimagineai.net/prompt-guide)
- [Grok AI Video Prompts Feb 2026 (TechnomiPro)](https://www.technomipro.com/grok-ai-video-prompts-february-2026/)

### Gemini Image Generation
- [Gemini 2.5 Flash Image Prompting (Google Developers Blog)](https://developers.googleblog.com/en/how-to-prompt-gemini-2-5-flash-image-generation-for-the-best-results/)
- [Gemini Image Generation API Docs](https://ai.google.dev/gemini-api/docs/image-generation)
- [Gemini Image Prompting Tips (Google Blog)](https://blog.google/products-and-platforms/products/gemini/image-generation-prompting-tips/)
- [Brand Logo with Imagen 3 + Gemini (Google Cloud)](https://cloud.google.com/blog/products/ai-machine-learning/build-a-brand-logo-with-imagen-3-and-gemini)
- [6 Best Gemini Photo Editing Prompts 2026 (eWeek)](https://www.eweek.com/news/6-gemini-ai-photo-editing-prompts/)

### ElevenLabs
- [ElevenLabs TTS Best Practices (Official Docs)](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices)
- [ElevenLabs Voice Settings (Official Docs)](https://elevenlabs.io/docs/speech-synthesis/voice-settings)
- [ElevenLabs Voice Design (Official Docs)](https://elevenlabs.io/docs/creative-platform/voices/voice-design)
- [ElevenLabs Models (Official Docs)](https://elevenlabs.io/docs/overview/models)
- [How to Use ElevenLabs 2026 (theaianalystlab.com)](https://theaianalystlab.com/how-to-use-elevenlabs/)

### Interactive Web Playgrounds
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [51 GSAP ScrollTrigger Examples (FreeFrontend)](https://freefrontend.com/scroll-trigger-js/)
- [270 GSAP.js Examples (FreeFrontend)](https://freefrontend.com/gsap-js/)
- [Scroll-Revealed WebGL Gallery Feb 2026 (Codrops)](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
- [CSS Animation Examples (Prismic)](https://prismic.io/blog/css-animation-examples)
- [CSS in 2026 New Features (LogRocket)](https://blog.logrocket.com/css-in-2026/)

### Automation
- [n8n: AI Video Generator with Kling + ElevenLabs](https://n8n.io/workflows/3121-ai-powered-short-form-video-generator-with-openai-flux-kling-and-elevenlabs/)
- [n8n: Auto-Post Social Videos with Kling](https://n8n.io/workflows/3501-generate-and-auto-post-social-videos-to-multiple-platforms-with-gpt-4-and-kling-ai/)
- [n8n: Faceless Videos with Gemini + ElevenLabs](https://n8n.io/workflows/6014-create-faceless-videos-with-gemini-elevenlabs-leonardo-ai-and-shotstack/)
