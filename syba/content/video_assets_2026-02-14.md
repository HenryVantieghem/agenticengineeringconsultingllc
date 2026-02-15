# Cyber.io Video Assets — 2026-02-14

## Status: BLOCKED — Kling AI Account Has Zero Credits

The Kling AI MCP account (`mcp__mcp-kling`) has insufficient balance for both video and image generation across all model tiers (v1, v1.5, v1.6, v2-master).

**Action required:** Top up Kling AI credits at https://klingai.com, then re-run the generation commands below.

---

## Asset 1: Promotional Video (5s, 16:9)

**Tool:** `mcp__mcp-kling__generate_video`

| Parameter | Value |
|-----------|-------|
| model_name | `kling-v2-master` |
| duration | `5` |
| aspect_ratio | `16:9` |
| mode | `standard` |
| cfg_scale | `0.7` |

**Prompt:**
```
Cinematic futuristic cybersecurity visualization. A glowing red shield icon (#e94560) at the center of a dark digital space. Six AI agent nodes orbit around it in a hexagonal pattern, connected by pulsing data streams. The nodes light up one by one in sequence, scanning and analyzing. Digital particles flow inward toward the shield. The text 'Cyber.io' appears in clean modern sans-serif font. Premium, minimalist, OpenAI-inspired aesthetic. Dark background with subtle grid. 4K quality.
```

**Negative Prompt:**
```
Low quality, blurry, pixelated, amateur, cartoonish, colorful rainbow effects, messy text, misspelled text, watermark, stock footage look
```

**Camera Control (optional, for v2):**
```json
{
  "type": "simple",
  "config": {
    "zoom": 2,
    "horizontal": 0,
    "vertical": 0,
    "pan": 0,
    "tilt": 0,
    "roll": 0
  }
}
```

**Estimated cost:** ~33 credits (standard 5s video on v2-master)

---

## Asset 2: Thumbnail / Social Image (16:9)

**Tool:** `mcp__mcp-kling__generate_image`

| Parameter | Value |
|-----------|-------|
| model_name | `kling-v2-master` |
| aspect_ratio | `16:9` |
| num_images | `2` |

**Prompt:**
```
Minimalist cybersecurity dashboard showing an AI agent swarm analysis. Clean dark background (#0a0a0a) with a central glowing shield icon in vibrant red (#e94560). Six category cards arranged around the shield showing security scores with colored progress bars. Premium OpenAI-inspired design. Inter font style. Subtle shadows and glow effects. Modern SaaS product screenshot aesthetic. The word 'Cyber.io' displayed prominently at the top. Clean, professional, futuristic.
```

**Negative Prompt:**
```
Low quality, blurry, pixelated, cluttered, amateur, cartoonish, bright colorful rainbow, messy UI, watermark, stock photo
```

**Estimated cost:** ~1-2 credits per image

---

## Asset 3 (Stretch Goal): 10s Extended Video

If the 5s video looks good, extend it to 10s:

**Tool:** `mcp__mcp-kling__extend_video`

| Parameter | Value |
|-----------|-------|
| task_id | (from Asset 1) |
| duration | `5` |
| model_name | `kling-v2-master` |

**Extension Prompt:**
```
The Cyber.io shield pulses and expands outward. The six AI agent nodes converge toward the center forming a unified protection barrier. Data streams consolidate into a single bright ring. A subtle tagline 'AI-Powered Cybersecurity Intelligence' fades in below. The scene settles into a clean logo lockup.
```

---

## Generated Assets (fill in after generation)

| Asset | Task ID | Status | URL |
|-------|---------|--------|-----|
| Video (5s) | — | PENDING (no credits) | — |
| Thumbnail 1 | — | PENDING (no credits) | — |
| Thumbnail 2 | — | PENDING (no credits) | — |
| Extended Video (10s) | — | PENDING (no credits) | — |

---

## Quick Re-run Commands

After topping up credits, run these in Claude Code:

```
# Step 1: Check balance
Use mcp__mcp-kling__get_account_balance

# Step 2: Generate video
Use mcp__mcp-kling__generate_video with the Asset 1 params above

# Step 3: Generate thumbnails
Use mcp__mcp-kling__generate_image with the Asset 2 params above

# Step 4: Check status (repeat until complete)
Use mcp__mcp-kling__check_video_status with the task_id
Use mcp__mcp-kling__check_image_status with the task_id

# Step 5: Optionally extend to 10s
Use mcp__mcp-kling__extend_video with the Asset 3 params above
```
