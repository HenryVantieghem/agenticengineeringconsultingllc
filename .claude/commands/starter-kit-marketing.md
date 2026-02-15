---
description: "Starter Kit Marketing Engine — research competitors, generate content, create videos, cross-post to social media"
arguments:
  - name: mode
    description: "daily (daily content cycle) | launch (ProductHunt + social blitz) | video (Remotion video) | research (competitor analysis) | content (single post)"
    default: "daily"
  - name: platform
    description: "Target platform: all | youtube | twitter | linkedin | bluesky | reddit | producthunt | devto"
    default: "all"
---

<context>
Read these files for full context:
- starter-kits/README.md
- starter-kits/expo-supabase/PRODUCT.md
- starter-kits/swiftui-supabase/PRODUCT.md
- site/starter-kits.html
</context>

<products>
## ExpoLaunch — $149
React Native Expo + Supabase + RevenueCat starter kit. 15+ screens, TypeScript, auth, payments, real-time, push notifications, dark mode. Ship in days not months.
Landing page: https://agenticengineering.netlify.app/starter-kits.html

## SwiftLaunch — $149
SwiftUI + Supabase + StoreKit 2 starter kit. 15+ screens, MVVM, @Observable, WidgetKit, APNs, async/await. Ship in days not months.
Landing page: https://agenticengineering.netlify.app/starter-kits.html
</products>

<strategy>
## The Marc Lou Playbook (ShipFast — $133K/mo)
1. **Build in public** — Show the actual code, the architecture, the features
2. **Speed builds** — "I built an app in 2 hours with [template]" videos
3. **Problem-first hooks** — "Stop writing auth code from scratch"
4. **Demo, don't tell** — Screen recordings > feature lists
5. **Cross-post everything** — Same content adapted for each platform
6. **Social proof** — Customer screenshots, revenue numbers, testimonials
7. **SEO content** — Blog posts targeting "[framework] starter kit" keywords
8. **ProductHunt launch** — Major one-time traffic spike, build mailing list

## Content Pillars
1. **Speed demos** — "Build a full app in 2 hours" (YouTube + X + LinkedIn)
2. **Technical deep dives** — "How auth works in ExpoLaunch" (YouTube + Dev.to + Reddit)
3. **Comparison content** — "ExpoLaunch vs building from scratch: 200+ hours saved" (Blog + X)
4. **Behind the scenes** — "How I built a $149 product" (X + LinkedIn + Indie Hackers)
5. **Customer wins** — "Developer shipped their app in 3 days using SwiftLaunch" (All platforms)
</strategy>

<modes>

## MODE: daily
Execute the daily content creation cycle:

### Step 1: Trend Research
Use Apify to scrape:
- Twitter/X for trending #reactnative, #swiftui, #indiedev, #buildinpublic topics
- Reddit r/reactnative, r/swift, r/SideProject for pain points and questions
- Dev.to trending articles about mobile development

### Step 2: Content Creation
Based on trends, create ONE piece of content per platform:

**X/Twitter thread** (5-7 tweets):
- Hook: Problem statement or hot take
- Body: How the starter kit solves it
- CTA: Link to starter-kits.html
- Format: Short, punchy, code screenshots

**LinkedIn post** (1 post):
- Professional angle: "Save 200+ hours of development time"
- Target: CTOs, tech leads, agency owners
- CTA: Link to landing page

**Bluesky post** (1 post):
- Developer community angle
- More casual, technical focus
- CTA: Link to landing page

**Reddit comment/post** (1):
- Find relevant thread in r/reactnative or r/swift
- Provide genuine value (answer their question)
- Mention the template naturally (not spammy)

**Dev.to article** (weekly):
- Technical tutorial using the starter kit
- SEO-optimized title: "How to build [X] with React Native + Supabase in 2026"

### Step 3: Cross-Post
Use Crosspost MCP to publish to Bluesky + LinkedIn simultaneously.
For X/Twitter, draft the thread content (post manually if no API key yet).
For Reddit and Dev.to, draft the content for manual posting.

### Step 4: Track
Log what was posted to `starter-kits/marketing/content-log.md`

---

## MODE: launch
Execute a ProductHunt launch blitz:

### Step 1: Pre-Launch (do 3 days before)
- Create ProductHunt listing draft
- Prepare launch assets (tagline, description, screenshots, maker comment)
- Schedule launch tweets
- Email existing contacts

### Step 2: Launch Day
- Post to ProductHunt at 12:01 AM PT
- Immediate X thread
- LinkedIn announcement
- Bluesky announcement
- Reddit posts (r/SideProject, r/reactnative, r/swift)
- Indie Hackers post
- Hacker News Show HN post
- Dev.to announcement article

### Step 3: Post-Launch
- Respond to all comments
- Share updates and results
- Thank supporters

---

## MODE: video
Create a marketing video using Remotion:

### Step 1: Choose Template
Pick from video templates:
- **Speed Build** — "I built [app] in 2 hours" (2-3 min)
- **Feature Tour** — Walk through all 15+ screens (1-2 min)
- **Comparison** — Side-by-side: from scratch vs starter kit (1 min)
- **Tutorial** — Step-by-step setup guide (5-10 min)

### Step 2: Script
Write the video script with:
- Hook (first 3 seconds — stop the scroll)
- Problem statement (5 seconds)
- Solution demo (bulk of video)
- CTA (last 5 seconds — link to landing page)

### Step 3: Create with Remotion
Use Remotion MCP to create the video:
- Code-based animations
- Screen recordings of the actual template
- Text overlays with key features
- Render to MP4

### Step 4: Export
- YouTube: 16:9 landscape
- X/TikTok/Reels: 9:16 vertical (crop/reformat)
- Thumbnail: Bold text + device mockup

---

## MODE: research
Deep competitive analysis:

### Step 1: Scrape Competitors
Use Firecrawl to scrape:
- shipnative.app (features, pricing, copy)
- expobase.dev
- launchtoday.dev
- swiftship.dev
- swiftaiboilerplate.com

### Step 2: Analyze Content
Use Apify to scrape their:
- Twitter/X engagement (what posts get most likes/RT)
- YouTube videos (view counts, topics)
- ProductHunt launches (upvotes, comments)

### Step 3: Find Gaps
Identify what they're NOT doing that we can do:
- Missing content types
- Underserved platforms
- Unanswered questions on Reddit/forums
- SEO keywords they're not targeting

### Step 4: Report
Write findings to `starter-kits/marketing/competitor-analysis.md`

---

## MODE: content
Generate a single piece of content:

Ask the user for:
1. Platform (X, LinkedIn, Bluesky, YouTube, Reddit, Dev.to)
2. Content type (thread, post, article, video script)
3. Angle (speed, features, comparison, tutorial, behind-the-scenes)
4. Product (ExpoLaunch, SwiftLaunch, or both)

Then generate the content optimized for that platform.

</modes>

<execution>
1. Read the mode from $ARGUMENTS.mode
2. Read product specs from PRODUCT.md files
3. Execute the mode-specific workflow above
4. Use available MCP tools: Apify (social scraping), Firecrawl (web scraping), Crosspost (social posting), Remotion (video), Canva (design)
5. Log all content created to starter-kits/marketing/content-log.md
6. Report results back to user
</execution>
