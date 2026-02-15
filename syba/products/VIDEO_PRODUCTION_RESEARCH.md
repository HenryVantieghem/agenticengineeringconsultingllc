# AI Video Production Pipeline Research
## Claude Code + Kling AI + Remotion + ElevenLabs

**Date:** 2026-02-14
**Researcher:** Claude Opus 4.6
**Confidence:** High (verified across 30+ sources, tool schemas confirmed in local MCP config)

---

## Table of Contents
1. [Executive Summary](#executive-summary)
2. [The Stack: Four Tools, One Pipeline](#the-stack)
3. [Remotion + Claude Code (Visual Layer)](#remotion--claude-code)
4. [Kling AI MCP (AI Video Generation Layer)](#kling-ai-mcp)
5. [ElevenLabs MCP (Audio/Voice Layer)](#elevenlabs-mcp)
6. [Combined Pipeline Architecture](#combined-pipeline-architecture)
7. [X.com / Twitter Posts (Deep Dives)](#x-posts)
8. [Kling 3.0 Prompting Guide](#kling-prompting)
9. [ElevenLabs TTS Timestamps API](#elevenlabs-timestamps-api)
10. [Starter Kits and Open Source Projects](#starter-kits)
11. [Step-by-Step Workflow for a Reusable Skill](#reusable-skill-workflow)
12. [Best Practices](#best-practices)
13. [MCP Tool Inventory (Already Installed)](#mcp-tool-inventory)
14. [Sources](#sources)

---

## Executive Summary

In January 2026, Remotion launched Agent Skills that integrate directly with Claude Code, turning natural language prompts into rendered MP4 videos via React/TypeScript compositions. This triggered an explosion of adoption -- a demo on the Remotion X account hit 6M+ views in days, and the skill package got 25,000+ installs on skills.sh.

The production-grade AI video pipeline combines four tools:

| Tool | Role | MCP Server | Status in Your Config |
|------|------|------------|----------------------|
| **Remotion** | Programmatic video composition/rendering | `remotion-documentation` (docs MCP) | Installed |
| **Kling AI** | AI video generation from text/images | `mcp-kling` | Installed (13 tools) |
| **ElevenLabs** | TTS narration, voice cloning, SFX | `elevenlabs` | Installed (10+ tools) |
| **Claude Code** | Orchestrator / code generator | N/A (host) | Active |

**Key Insight:** These are not competing tools. They form a layered pipeline:
- Kling generates raw AI video clips (B-roll, product shots, cinematic scenes)
- ElevenLabs generates narration audio with word-level timestamps
- Remotion composes everything into a final rendered MP4 with animations, transitions, captions
- Claude Code orchestrates the entire pipeline via natural language

---

## The Stack

### Architecture Diagram

```
User Prompt
    |
    v
[Claude Code] -- orchestrator
    |
    |-- [ElevenLabs MCP] --> narration.mp3 + timestamps.json
    |-- [Kling MCP] --> b-roll-1.mp4, b-roll-2.mp4, hero-shot.mp4
    |-- [Remotion Skill] --> writes React/TSX composition
    |
    v
[Remotion Render] --> final-video.mp4
    |
    v
Output: Production-ready video with narration, B-roll, animations, captions
```

---

## Remotion + Claude Code

### What It Is
Remotion is "React for video." You write TypeScript components that describe what appears on each frame, and Remotion renders them into MP4 files via a headless browser. Claude Code writes the React code from natural language prompts.

### Setup

```bash
# Create new Remotion project
npx create-video@latest
# Select: Blank template, TailwindCSS, Skills

# Install Remotion Agent Skills
npx skills add remotion-dev/skills

# Start dev server
npm run dev

# In a separate terminal, launch Claude Code
claude
```

### How Skills Work
Remotion maintains 28+ modular "rule files" optimized for LLMs. When installed via `npx skills add remotion-dev/skills`, they give Claude deep knowledge of:
- Remotion API constraints and best practices
- Animation patterns (spring, interpolate, sequences)
- Composition structure (fps, duration, resolution)
- Asset handling (audio, video, images)
- TailwindCSS integration for visual styling
- Rendering pipeline (`npx remotion render`)

### Rendering Commands

```bash
# Preview in browser
npm run dev

# Render specific composition
pnpm exec remotion render <CompositionId>

# Render with specific settings
npx remotion render src/index.ts MyVideo --output out/MyVideo.mp4
```

### Video Presets
- Landscape-720p: 1280x720
- Landscape-1080p: 1920x1080
- Square-1080p: 1080x1080
- Portrait-1080p: 1080x1920

### Key Technical Details
- Default 60fps (configurable)
- Uses `secondsToFrames()` for frame-accurate scheduling
- `TransitionSeries` for fade, slide, custom transitions
- Supports `<Audio>`, `<Video>`, `<Img>` components
- TailwindCSS for all visual styling
- Remotion license required for companies with 3+ employees

### Remotion MCP Server
There is also a Remotion MCP server (separate from the skills) that indexes Remotion docs into a vector database for AI chat context:
- Tool name: `mcp__remotion__remotion-documentation` / `mcp__remotion-documentation__remotion-documentation`
- Use: Query Remotion docs from within Claude Code for accurate API usage

---

## Kling AI MCP

### What It Is
The `mcp-kling` server (by 199-mcp/Boris Djordjevic) is the first complete MCP server for Kling AI. It exposes 13 tools covering the entire Kling API: video generation, image-to-video, lip-sync, effects, image generation, and account management.

### Setup

```json
{
  "mcpServers": {
    "mcp-kling": {
      "command": "npx",
      "args": ["-y", "mcp-kling@latest"],
      "env": {
        "KLING_ACCESS_KEY": "YOUR_ACCESS_KEY",
        "KLING_SECRET_KEY": "YOUR_SECRET_KEY"
      }
    }
  }
}
```

Get API credentials from: https://app.klingai.com/global/dev/api-key

### Complete Tool Inventory (13 Tools)

**Video Generation:**
| Tool | Function | Key Parameters |
|------|----------|----------------|
| `generate_video` | Text-to-video | model (v1/v1.5/v1.6/v2-master), duration (5/10s), aspect_ratio, mode (standard/professional), cfg_scale (0-1), camera_control |
| `generate_image_to_video` | Image-to-video | image_url, prompt for motion, mode, duration |
| `check_video_status` | Poll task progress | task_id (auto-downloads on completion) |
| `extend_video` | Add 4-5 seconds | task_id, prompt for continuation |

**Audio & Effects:**
| Tool | Function | Key Parameters |
|------|----------|----------------|
| `create_lipsync` | Sync lips to audio | video_url, audio_url OR tts_text + tts_voice, tts_speed |
| `apply_video_effect` | Post-production | effect_scene: hug, kiss, squish, expansion, fuzzyfuzzy, bloombloom, dizzydizzy |

**Image Generation:**
| Tool | Function | Key Parameters |
|------|----------|----------------|
| `generate_image` | Text-to-image (KOLORS) | prompt, aspect_ratio, num_images (1-4), model_name |
| `check_image_status` | Poll task progress | task_id |
| `virtual_try_on` | AI fashion try-on | image_urls (model + garment) |

**Account:**
| Tool | Function |
|------|----------|
| `get_account_balance` | Check credits |
| `get_resource_packages` | View subscriptions |
| `list_tasks` | Task history |

### Camera Control (V2 Models)

```json
{
  "camera_control": {
    "type": "simple",
    "config": {
      "zoom": 5,
      "horizontal": -3,
      "vertical": 2,
      "pan": 0,
      "tilt": -2,
      "roll": 0
    }
  }
}
```

Preset camera types: `simple`, `down_back`, `forward_up`, `right_turn_forward`, `left_turn_forward`

All values range from -10 to 10.

### Auto-Download Structure

```
./downloads/
  videos/       # Generated videos
  images/       # Generated images
  lipsync/      # Lip-sync videos
  effects/      # Effect-applied videos
  extended/     # Extended videos
  tryon/        # Virtual try-on results
```

### Supported Local File Formats
- Images: PNG, JPG, JPEG, GIF, WebP
- Videos: MP4, WebM, MOV
- Audio (for lipsync): MP3, WAV, FLAC, OGG

---

## ElevenLabs MCP

### What It Is
The official ElevenLabs MCP server gives Claude full access to the ElevenLabs AI audio platform: text-to-speech, voice cloning, transcription, sound effects, and voice design.

### Setup

```json
{
  "mcpServers": {
    "ElevenLabs": {
      "command": "uvx",
      "args": ["elevenlabs-mcp"],
      "env": {
        "ELEVENLABS_API_KEY": "<your-api-key>",
        "ELEVENLABS_MCP_OUTPUT_MODE": "files",
        "ELEVENLABS_MCP_BASE_PATH": "~/Desktop"
      }
    }
  }
}
```

Free tier: 10k credits/month. Get key from: https://elevenlabs.io/app/settings/api-keys

### Complete Tool Inventory

| Tool | Function | Key Parameters |
|------|----------|----------------|
| `text_to_speech` | Generate narration | text, voice_name/voice_id, model_id, stability (0-1), similarity_boost (0-1), speed (0.7-1.2), output_format |
| `speech_to_text` | Transcribe audio | input_file_path, diarize (speaker ID), language_code |
| `text_to_sound_effects` | Generate SFX | text description, duration_seconds (0.5-5), loop |
| `voice_clone` | Clone a voice | name, files (audio array) |
| `text_to_voice` | Design new voice | voice_description (creates 3 previews) |
| `search_voices` | Find voices | query |
| `list_models` | Available TTS models | -- |
| `get_voice` | Voice details | voice_id |
| `isolate_audio` | Remove background noise | file_path |
| `speech_to_speech` | Voice conversion | -- |
| `play_audio` | Play generated audio | file_path |

### TTS Model Options

| Model ID | Description |
|----------|-------------|
| `eleven_multilingual_v2` | High quality, 29 languages (default) |
| `eleven_flash_v2_5` | Fastest, ultra-low latency, 32 languages |
| `eleven_turbo_v2_5` | Balanced quality/speed, 32 languages |
| `eleven_flash_v2` | Fast English-only |
| `eleven_turbo_v2` | Balanced English-only |
| `eleven_monolingual_v1` | Legacy English |

### Output Format Options
- `mp3_44100_128` (default, good for video)
- `mp3_44100_192` (higher quality, requires Creator tier)
- `pcm_44100` (uncompressed, for mixing, requires Pro tier)
- `wav_48000` (studio quality)

### Output Modes
- `"files"` (default): Saves to disk, returns file path
- `"resources"`: Returns base64 binary data in MCP response
- `"both"`: Saves files AND returns as MCP resources

---

## ElevenLabs Timestamps API

**Critical for video sync.** The ElevenLabs API can return character-level timing data alongside audio:

### Endpoint
```
POST https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps
```

### Response Format
```json
{
  "audio_base64": "base64_encoded_audio",
  "alignment": {
    "characters": ["H", "e", "l", "l", "o"],
    "character_start_times_seconds": [0.0, 0.12, 0.24, 0.31, 0.38],
    "character_end_times_seconds": [0.12, 0.24, 0.31, 0.38, 0.52]
  },
  "normalized_alignment": {
    "characters": ["H", "e", "l", "l", "o"],
    "character_start_times_seconds": [0.0, 0.12, 0.24, 0.31, 0.38],
    "character_end_times_seconds": [0.12, 0.24, 0.31, 0.38, 0.52]
  }
}
```

### How to Use for Video Sync
1. Generate TTS with timestamps endpoint
2. Parse character timings into word boundaries
3. Feed timing data into Remotion composition as props
4. Each word/sentence appears on screen at the exact frame it's spoken
5. Use `secondsToFrames(startTime, fps)` in Remotion for frame-accurate placement

**Note:** The MCP `text_to_speech` tool does NOT expose timestamps directly. For timestamp sync, you need to call the REST API directly via `curl` in a Bash tool call, or build a helper script.

---

## Combined Pipeline Architecture

### Pipeline A: Animated Explainer / Marketing Video

```
Step 1: Script
  Claude writes video script with scene breakdown

Step 2: Narration
  ElevenLabs MCP: text_to_speech → narration.mp3
  (Optionally: REST API with timestamps for word-level sync)

Step 3: B-Roll Generation
  Kling MCP: generate_video → scene clips
  Kling MCP: generate_image → still frames for transitions
  Kling MCP: check_video_status → poll until ready

Step 4: Composition
  Claude writes Remotion TSX composition:
  - <Audio src={narration.mp3} />
  - <Video src={broll1.mp4} /> with <Sequence from={frame}>
  - Animated text overlays via TailwindCSS
  - Transitions between scenes

Step 5: Render
  npx remotion render CompositionId --output final.mp4
```

### Pipeline B: Talking Head with Lip-Sync

```
Step 1: Script
  Claude writes narration script

Step 2: Generate Base Video
  Kling MCP: generate_video → person talking (silent)
  OR: generate_image_to_video → animate a portrait

Step 3: Generate Audio
  ElevenLabs MCP: text_to_speech → voiceover.mp3
  (Optional: voice_clone first for brand consistency)

Step 4: Lip-Sync
  Kling MCP: create_lipsync → video_url + audio_url → synced_video.mp4

Step 5: Post-Production (Optional)
  Kling MCP: apply_video_effect → slow motion / speed up
  Kling MCP: extend_video → make it longer

Step 6: Final Composition in Remotion
  Add lower thirds, logos, captions, music bed
  Render final output
```

### Pipeline C: Social Short-Form (TikTok/Reels)

```
Step 1: Hook + Script
  Claude generates script: hook (3s) + value (15s) + CTA (5s)

Step 2: Voice Generation
  ElevenLabs: text_to_speech (speed: 1.1, 9:16 optimized)

Step 3: Visual Generation
  Kling: generate_video (aspect_ratio: "9:16", duration: "5")
  Kling: extend_video (chain 3x for ~20s total)

Step 4: Composition
  Remotion composition in Portrait-1080p preset
  Animated captions synced to audio timestamps
  Brand watermark overlay

Step 5: Render
  npx remotion render ShortVideo --output short.mp4
```

---

## X.com / Twitter Posts (Deep Dives)

### 1. Remotion Official Launch (6M+ views)
**@Remotion** (Jan 20, 2026)
> "Remotion now has Agent Skills - make videos just with Claude Code! `$ npx skills add remotion-dev/skills` This animation was created just by prompting"
- URL: https://x.com/Remotion/status/2013626968386765291
- **Significance:** The post that started the movement. 6M+ views in days. 25,000+ skill installs.

### 2. Peter Cooper -- Claude Code + Remotion + ElevenLabs
**@cooperx86**
> "Claude Code made (most of) this using Remotion and the Remotion skill -- I used Eleven Labs for the voiceover and ambience and cobbled it together with a few edits. Just as a learning experience. I think people are gunna go nuts with this."
- URL: https://x.com/cooperx86/status/2014126181272965512
- **Significance:** First widely-shared demo of the full Remotion + ElevenLabs pipeline.

### 3. Christoph Rumpel -- Telegram to Video in <10min
**@christophrumpel**
> "I created this from a simple Telegram prompt: @clawedbot running on Laravel VPS, using Claude Code, using Eleven Labs and my voice clone, using @Remotion to bring it together. This was the result after two prompts. (< 10min)"
- URL: https://x.com/christophrumpel/status/2015819834823467036
- **Significance:** Demonstrates voice cloning + Remotion pipeline triggered from Telegram. Production workflow in under 10 minutes.

### 4. Riley Brown -- Claude Agent SDK + Remotion Animations
**@rileybrown**
> "Claude Code for Video Animations? Building an app with an agent that can create and edit animated videos... In 4 prompts."
- URL: https://x.com/rileybrown/status/2013868186807242855
- **Significance:** Shows Claude Agent SDK (not just Claude Code CLI) driving Remotion.

### 5. Moritz Kremb -- Full Tutorial with Timestamps
**@moritzkremb**
> "You can create videos with Claude Code. Just type your prompt and get a fully edited and animated marketing video for your product. Full workflow and tutorial here: 00:00 - Intro, 01:11 - The Remotion library, 04:35 - Claude Code and Remotion Setup, 08:55 - Example 1: Marketing"
- URL: https://x.com/moritzkremb/status/1950211411671433263
- **Significance:** Full video tutorial covering setup through production.

### 6. Francesco -- Open-Source Remotion Templates for Product Launches
**@francedot**
> "A bunch of you asked about our Remotion setup after the article. It's now open-source: Video templates for product launches, Shared animation components, Works with Claude Code + Remotion skills. How we made the Cua-Bench video in 2 hours"
- URL: https://x.com/francedot/status/2014897878347743732
- **Significance:** Open-source production templates. Made a full product video in 2 hours.

### 7. Kaxil Naik -- Playwright + Remotion + Claude Code Data Pipeline
**@kaxil**
> "Playwright + Remotion + Claude Code. It did an even better one! I used Claude Code with Playwright skill to extract the survey data from typeform and used Remotion skill to record video with no other input!"
- URL: https://x.com/kaxil/status/2014094200111833257
- **Significance:** Shows data-driven video generation. Playwright scrapes data, Remotion renders video automatically.

### 8. Thariq -- Shared CLAUDE.md for Remotion Videos
**@trq212**
> "Here's the CLAUDE.md I use to make remotion videos. If there's interest I might do a live stream or video on how to use Remotion with Claude Code."
- URL: https://x.com/trq212/status/1947706215624282590
- **Significance:** Shared his CLAUDE.md configuration for the community.

### 9. Masato Okuwaki -- ElevenLabs API via MCP for Product Demo
**@okuwaki_m**
> "I've found another fantastic way to utilize Remotion skills. I think we should try implementing it in our product too."
- URL: https://x.com/okuwaki_m/status/2015487766650556486
- **Significance:** Used Claude (Opus 4.5) with the Remotion skill AND ElevenLabs API via MCP to generate a product demo video.

### 10. Claude Code Community -- Official Recommendation
**@claude_code**
> "Tip: Use @claude_code to create beautiful demos and videos. 1. Use @Remotion, a React library for video creation. 2. Use Manim (by @3blue1brown) to render videos with Python code. 3. @claude_code can leverage your UI, Remotion, and Manim"
- URL: https://x.com/claude_code/status/1947866828904272059
- **Significance:** Official Claude Code account endorsing Remotion as THE video tool.

### 11. ElevenLabs Official -- MCP Server Launch
**@elevenlabsio**
> "Introducing the official ElevenLabs MCP server. Give Claude and Cursor access to the entire ElevenLabs AI audio platform via simple text prompts. You can even spin up voice agents to perform outbound calls for you -- like ordering pizza."
- URL: https://x.com/elevenlabsio/status/1909300782673101265
- **Significance:** Official ElevenLabs MCP announcement. Full platform access via MCP.

---

## Kling 3.0 Prompting Guide

### The Five-Layer Prompt Formula

```
[Context/Scene] + [Subject & Appearance] + [Action Timeline] + [Camera Movement] + [Audio & Atmosphere]
```

Alternatively, the four-part universal formula:
```
Subject (specific visual details) + Action (precise movement) + Context (environment with 3-5 elements) + Style (camera, lighting, mood)
```

### Five Essential Principles

**1. Think in Shots, Not Clips**
Kling 3.0 supports multi-shot generation (up to 6 shots per output). Label each shot explicitly:
```
Shot 1 (0-5s): Wide establishing shot of a Mars colony greenhouse...
Shot 2 (5-10s): Cut to macro close-up of the sprout...
Shot 3 (10-15s): Medium shot, botanist removes helmet visor...
```

**2. Anchor Subjects Early**
Define characters at the prompt's beginning with consistent descriptions. Maintain character traits across scenes for multi-character narratives.

**3. Describe Motion Explicitly**
Use cinematic camera language:
- dolly push, whip-pan, shoulder-cam drift, crash zoom, snap focus
- tracking shot, POV, shot-reverse-shot
- "Camera follows" is better than "camera moves right"
- AVOID generic words like "moves" or "goes"

**4. Use Native Audio Intentionally (3.0)**
Kling 3.0 supports native dialogue. Indicate who speaks when and include tone descriptions:
```
She says in a trembling, frustrated voice: "I can't believe this happened again."
```

**5. Leverage Longer Durations (Up to 15s in 3.0)**
Describe progression over time. Show how actions unfold, don't fragment.

### Professional Example Prompts

**Cinematic Product Shot:**
```
Static tripod camera in narrow neon-lit ramen shop, condensation fogs
the window, couple sits side by side under flickering magenta sign,
steam rising from bowls as they eat noodles in slow synchronized rhythm,
broth splattering gently, their faces softly illuminated by red neon glow,
shot on 35mm film with shallow focus and glowing bokeh behind them
```

**Multi-Shot Sci-Fi:**
```
Shot 1 (0-5s): A wide establishing shot of a desolate Mars colony
greenhouse. Outside, a red dust storm rages. Inside, a young botanist
in a white bio-suit is kneeling, inspecting a small green sprout.

Shot 2 (5-10s): Cut to a macro close-up of the sprout. The botanist's
gloved hand gently touches a leaf. The camera tilts up to reveal her
face through the helmet visor; she looks hopeful.
```

**Coastal Cinematic:**
```
Cinematic sunset scene on a coastal balcony overlooking the sea.
A young woman wearing a light linen dress leans on the railing as
waves crash below. The camera slowly dolly-moves forward. She sighs
softly and says, "I always forget how loud the ocean can be."
```

### Multi-Character Dialogue Best Practices

| Principle | Best Practice |
|-----------|---------------|
| Structured Naming | Use unique, consistent character labels; avoid pronouns |
| Visual Anchoring | Bind dialogue to character-specific actions |
| Audio Details | Assign distinct tone/emotion labels per speaker |
| Temporal Control | Use linking words like "immediately" to control sequence |

### MCP-Specific Parameters for Best Results

```
model_name: "kling-v2-master"    # Best quality
duration: "10"                    # Longer = more story
mode: "professional"              # Higher quality
cfg_scale: 0.7                    # 0.5-0.8 sweet spot
aspect_ratio: "16:9"              # Standard video
negative_prompt: "blurry, low quality, distorted faces, watermark"
```

### Image-to-Video Strategy
Treat input images as anchors. Focus prompts on scene evolution: subtle movements, camera motion, environmental changes. Preserve identity, layout, and text from source image.

---

## Starter Kits and Open Source Projects

### 1. claude-remotion-kickstart (jhartquist)
**URL:** https://github.com/jhartquist/claude-remotion-kickstart
- Pre-built components: TitleSlide, ContentSlide, CodeSlide, DiagramSlide, VideoSlide
- Overlays: Logo, Caption, Music (with fade controls)
- Media: BRollVideo, ZoomableVideo, Screenshot, AsciiPlayer
- Claude slash commands: `/new-composition`, `/generate-image`, `/generate-video`, `/transcribe`, `/screenshot`
- Optional integrations: Replicate (image/video), Deepgram (transcription), ElevenLabs (voiceovers via MCP)
- GitHub Actions for cloud rendering
- **Best for:** Full production pipeline starter

### 2. Remotion Prompt-to-Video Template (remotion-dev)
**URL:** https://github.com/remotion-dev/template-prompt-to-video
- Official Remotion template
- Pipeline: prompt -> OpenAI script -> image generation -> ElevenLabs voiceover -> timeline.json -> Remotion render
- Environment: `OPENAI_API_KEY` + `ELEVENLABS_API_KEY`
- Command: `npm run gen` to generate from prompt
- Timeline structure: Elements (slides), Text (narrative), Audio (voiceover)
- **Best for:** TikTok/Instagram short-form content

### 3. Claude-x-Remotion (MoJuBaGod)
**URL:** https://github.com/MoJuBaGod/Claude-x-Remotion
- Fork/variant of kickstart kit
- Streamlined workflow for professional videos
- AI integrations built-in
- **Best for:** Quick start

### 4. digitalsamba/claude-code-video-toolkit
**URL:** https://github.com/digitalsamba/claude-code-video-toolkit
- AI-native video production toolkit
- TTS-driven timing (narration drives scene duration)
- Voice consistency via voice cloning
- Word-level subtitles
- Multi-track audio
- **Best for:** Advanced production with TTS-sync

### 5. n8n Workflow Template: AI Short-Form Video Generator
**URL:** https://n8n.io/workflows/3121-ai-powered-short-form-video-generator-with-openai-flux-kling-and-elevenlabs/
- OpenAI for script generation
- Flux for image generation
- Kling (via PiAPI) for video generation from images
- ElevenLabs for voiceover generation
- **Best for:** Automated pipeline via n8n (you already have n8n MCP installed)

---

## Step-by-Step Workflow for a Reusable Skill

### Proposed `/video` Skill Architecture

```
Phase 1: BRIEF
  Input: topic, style (explainer/marketing/social), duration, voice
  Output: script.md with scene breakdown

Phase 2: AUDIO
  Tool: mcp__elevenlabs__text_to_speech
  Input: script narration text, voice_name, model_id
  Output: narration.mp3 saved to project/public/audio/

  (Optional) REST API call for timestamps:
  curl -X POST "https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/with-timestamps" \
    -H "xi-api-key: $ELEVENLABS_API_KEY" \
    -d '{"text": "...", "model_id": "eleven_multilingual_v2"}'
  Output: timestamps.json

Phase 3: VISUALS
  Tool: mcp__mcp-kling__generate_video (for each scene)
  Parameters:
    model_name: "kling-v2-master"
    duration: "5" or "10"
    mode: "professional"
    cfg_scale: 0.7
    aspect_ratio: "16:9" (or "9:16" for social)
  Output: downloads/videos/*.mp4

  Tool: mcp__mcp-kling__check_video_status (poll until complete)

  (Optional) Tool: mcp__mcp-kling__extend_video (chain for longer clips)

Phase 4: COMPOSE
  Claude writes Remotion TSX composition:
  - Import narration audio
  - Import Kling video clips
  - Calculate frame timings from audio duration
  - Add animated text overlays
  - Add transitions between scenes
  - Add logo/watermark
  - Add captions (from timestamps if available)

Phase 5: RENDER
  Command: npx remotion render CompositionId --output out/final.mp4

Phase 6: REVIEW
  Preview in Remotion Studio (npm run dev)
  Iterate on specific scenes
```

### Example Skill CLAUDE.md Fragment

```markdown
## /video Skill

You are a video production agent. When the user says "/video [topic]":

1. Write a script with scene breakdown (hook/body/CTA structure)
2. Generate narration using ElevenLabs MCP text_to_speech tool
3. For each scene, generate a Kling AI video clip using mcp-kling generate_video
4. Poll each Kling task with check_video_status until complete
5. Write a Remotion composition in src/compositions/ that:
   - Imports all audio and video assets from public/
   - Uses TransitionSeries for scene transitions
   - Adds TailwindCSS-styled text overlays
   - Syncs text appearance to audio timing
6. Render with: npx remotion render [CompositionId]

### Voice Guidelines
- Use voice_name: "Rachel" for female narration
- Use model_id: "eleven_multilingual_v2" for quality
- Set speed: 1.0 for explainers, 1.1 for social
- Set stability: 0.5 for natural variation

### Kling Guidelines
- Always use model_name: "kling-v2-master"
- Always use mode: "professional"
- Set cfg_scale: 0.7 (balanced creativity/accuracy)
- Use negative_prompt: "blurry, low quality, distorted, watermark"
- Structure prompts as: [Scene] + [Subject] + [Action] + [Camera] + [Style]
- Use cinematic camera language: dolly push, tracking shot, crash zoom
- For social: aspect_ratio: "9:16", duration: "5"
- For YouTube: aspect_ratio: "16:9", duration: "10"
```

---

## Best Practices

### From the Community

1. **Remotion Skills are mandatory.** Install them before prompting. Without skills, Claude generates broken Remotion code. With skills, it understands the full API.

2. **TTS-driven timing.** Let the narration audio duration drive scene length, not the other way around. Generate audio first, measure duration, then compose visuals to fit.

3. **Voice cloning for brand consistency.** Use `mcp__elevenlabs__voice_clone` once to create a branded voice, then reuse the `voice_id` across all videos.

4. **Chain Kling extensions for longer videos.** A single Kling clip is 5-10s max. Chain `extend_video` 3-4 times for 20-30s sequences. Each extension costs credits.

5. **Preview before rendering.** Always use Remotion Studio (`npm run dev`) to preview compositions before the expensive render step.

6. **Negative prompts matter in Kling.** Always include: `"blurry, low quality, distorted faces, watermark, text overlay"` to avoid common artifacts.

7. **cfg_scale sweet spot is 0.5-0.8.** Lower = more creative (risk of artifacts). Higher = more literal (risk of boring). 0.7 is the community consensus.

8. **Use professional mode for final output.** Standard mode is fine for drafts/previews. Professional mode for anything client-facing.

9. **Sound effects layer.** Use `mcp__elevenlabs__text_to_sound_effects` to generate ambient sounds (office noise, nature, city) as a background track under narration.

10. **Parallel generation.** Generate all Kling clips simultaneously (they run server-side). Don't wait for one to finish before starting the next. Batch your `generate_video` calls, then batch your `check_video_status` polls.

### Gotchas

- **ElevenLabs MCP does not return timestamps.** For word-level sync, you must call the REST API directly.
- **Kling generation takes 30-120 seconds.** Build polling loops with retries.
- **Remotion license required** for companies with 3+ employees rendering videos.
- **Kling credits are consumed per generation.** Professional mode costs more than standard. Check balance with `get_account_balance` before batch runs.
- **ElevenLabs free tier is 10k credits/month.** A single video narration (~200 words) uses ~1000-2000 credits.

---

## MCP Tool Inventory (Already Installed in Your Config)

### ElevenLabs (10+ tools confirmed)
- `mcp__elevenlabs__text_to_speech` -- core TTS
- `mcp__elevenlabs__speech_to_text` -- transcription
- `mcp__elevenlabs__text_to_sound_effects` -- SFX generation
- `mcp__elevenlabs__voice_clone` -- instant voice cloning
- `mcp__elevenlabs__text_to_voice` -- voice design from description
- `mcp__elevenlabs__search_voices` -- find voices
- `mcp__elevenlabs__list_models` -- available models
- `mcp__elevenlabs__get_voice` -- voice details
- `mcp__elevenlabs__isolate_audio` -- noise removal
- `mcp__elevenlabs__speech_to_speech` -- voice conversion
- `mcp__elevenlabs__play_audio` -- playback

### Kling AI (13 tools confirmed)
- `mcp__mcp-kling__generate_video` -- text-to-video
- `mcp__mcp-kling__generate_image_to_video` -- image-to-video
- `mcp__mcp-kling__check_video_status` -- poll progress
- `mcp__mcp-kling__extend_video` -- extend by 5s
- `mcp__mcp-kling__create_lipsync` -- lip-sync audio to video
- `mcp__mcp-kling__apply_video_effect` -- effects (squish, bloom, etc.)
- `mcp__mcp-kling__generate_image` -- text-to-image (KOLORS)
- `mcp__mcp-kling__check_image_status` -- poll image progress
- `mcp__mcp-kling__virtual_try_on` -- fashion try-on
- `mcp__mcp-kling__get_account_balance` -- credits
- `mcp__mcp-kling__get_resource_packages` -- packages
- `mcp__mcp-kling__list_tasks` -- task history

### Remotion (2 doc-search tools)
- `mcp__remotion__remotion-documentation` -- search Remotion docs
- `mcp__remotion-documentation__remotion-documentation` -- search Remotion docs (duplicate)

### Also Available (complementary)
- `mcp__grok__generate_video` -- Grok video generation (alternative to Kling)
- `mcp__elevenlabs__compose_music` -- AI music composition
- `mcp__elevenlabs__create_composition_plan` -- music planning

---

## Sources

### Official Documentation
- [Remotion + Claude Code Guide](https://www.remotion.dev/docs/ai/claude-code)
- [Remotion Agent Skills](https://www.remotion.dev/docs/ai/skills)
- [Remotion MCP Server](https://www.remotion.dev/docs/ai/mcp)
- [Remotion AI Overview](https://www.remotion.dev/docs/ai/)
- [ElevenLabs MCP Server (GitHub)](https://github.com/elevenlabs/elevenlabs-mcp)
- [ElevenLabs MCP Blog Post](https://elevenlabs.io/blog/introducing-elevenlabs-mcp)
- [ElevenLabs TTS with Timestamps API](https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps)
- [ElevenLabs TTS Best Practices](https://elevenlabs.io/docs/overview/capabilities/text-to-speech/best-practices)
- [Kling MCP Server (GitHub)](https://github.com/199-mcp/mcp-kling)
- [Kling MCP Deep Dive (Skywork)](https://skywork.ai/skypage/en/unlocking-kling-ai-boris-djordjevic-mcp-server/1979080592369242112)

### Starter Kits & Templates
- [claude-remotion-kickstart (GitHub)](https://github.com/jhartquist/claude-remotion-kickstart)
- [Remotion Prompt-to-Video Template (GitHub)](https://github.com/remotion-dev/template-prompt-to-video)
- [Claude-x-Remotion (GitHub)](https://github.com/MoJuBaGod/Claude-x-Remotion)
- [digitalsamba/claude-code-video-toolkit (GitHub)](https://github.com/digitalsamba/claude-code-video-toolkit)
- [n8n AI Video Generator Workflow](https://n8n.io/workflows/3121-ai-powered-short-form-video-generator-with-openai-flux-kling-and-elevenlabs/)

### Blog Posts & Articles
- [Claude Code + Remotion: The 2026 Developer Stack (Medium/AI Monks)](https://medium.com/aimonks/claude-code-remotion-the-2026-developer-stack-that-turned-video-production-into-a-git-commit-5ab44422b2d7)
- [Remotion Turned Claude Code into a Video Production Tool (Dev Genius)](https://blog.devgenius.io/remotion-turned-claude-code-into-a-video-production-tool-f83fd761b158)
- [Claude Code + Remotion = Professional Content (Medium)](https://medium.com/@ai-with-eric/claude-code-remotion-professional-content-with-zero-video-skills-3545498407ff)
- [Making Videos with Code: Complete Guide (Medium)](https://medium.com/@creativeaininja/making-videos-with-code-the-complete-guide-to-remotion-and-claude-code-82892e21d022)
- [Claude Code Video with Remotion: Best Motion Guide 2026 (dplooy)](https://www.dplooy.com/blog/claude-code-video-with-remotion-best-motion-guide-2026)
- [Remotion Skills 2026: Create React Videos via Claude Code (gaga.art)](https://gaga.art/blog/remotion-skills/)
- [How to Create Professional Videos with Claude Code (randyellis)](https://work.randyellis.design/blog/create-professional-videos-claude-code-guide)
- [Kling 3.0 Prompting Guide (fal.ai)](https://blog.fal.ai/kling-3-0-prompting-guide/)
- [Kling 3.0 Prompting Guide (Atlabs)](https://www.atlabs.ai/blog/kling-3-0-prompting-guide-master-ai-video-generation)
- [Kling 3.0 Prompt Guide (basedlabs)](https://www.basedlabs.ai/articles/kling-3-prompts-guide)
- [Make Videos with Claude Code (StartupHub)](https://www.startuphub.ai/ai-news/artificial-intelligence/2026/make-videos-with-claude-code-remotion-ai-video-makes-production-code-from-plain-prompts)

### X.com / Twitter Posts
- [@Remotion -- Agent Skills Launch (6M+ views)](https://x.com/Remotion/status/2013626968386765291)
- [@cooperx86 -- Claude Code + Remotion + ElevenLabs demo](https://x.com/cooperx86/status/2014126181272965512)
- [@christophrumpel -- Telegram to Video in <10min](https://x.com/christophrumpel/status/2015819834823467036)
- [@rileybrown -- Claude Agent SDK + Remotion](https://x.com/rileybrown/status/2013868186807242855)
- [@moritzkremb -- Full Tutorial with Timestamps](https://x.com/moritzkremb/status/1950211411671433263)
- [@francedot -- Open-Source Remotion Templates](https://x.com/francedot/status/2014897878347743732)
- [@kaxil -- Playwright + Remotion + Claude Code](https://x.com/kaxil/status/2014094200111833257)
- [@trq212 -- Shared CLAUDE.md for Remotion](https://x.com/trq212/status/1947706215624282590)
- [@okuwaki_m -- ElevenLabs MCP + Remotion Skill](https://x.com/okuwaki_m/status/2015487766650556486)
- [@claude_code -- Official Remotion Recommendation](https://x.com/claude_code/status/1947866828904272059)
- [@elevenlabsio -- MCP Server Launch](https://x.com/elevenlabsio/status/1909300782673101265)
- [@hilmanski -- Remotion + Claude Testing](https://x.com/hilmanski/status/2014511140706123819)
- [@learn2vibe -- VibecodeApp + Remotion Skill](https://x.com/learn2vibe/status/2014213425409499260)

### Kling AI Prompting Guides
- [Kling 3.0 Prompting Guide (Glif)](https://glif.app/use-cases/kling-3-prompting-guide)
- [Kling AI Prompt Guide (Leonardo.ai)](https://leonardo.ai/news/kling-ai-prompts/)
- [Kling 3.0 Prompt Guide with 16 Prompts (imagine.art)](https://www.imagine.art/blogs/kling-3-0-prompt-guide)
- [Kling AI Prompt Guide (ageofllms)](https://ageofllms.com/ai-howto-prompts/ai-fun/kling-ai-promp-guide)
- [Best Text-To-Video Prompts for Kling (Segmind)](https://blog.segmind.com/best-text-to-video-prompts-for-kling-ai-with-examples/)
