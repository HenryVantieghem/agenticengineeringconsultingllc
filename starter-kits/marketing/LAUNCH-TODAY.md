# Starter Kit Launch Plan — February 13, 2026

**Products:** ExpoLaunch ($149) | SwiftLaunch ($149)
**Landing page:** https://agenticengineering.netlify.app/starter-kits.html
**Stripe account:** acct_1RFfRWBQXryBTFI2
**Goal:** First marketing content live in 30 minutes. First sale this week.

---

## TODAY — Do These Right Now (30 minutes)

### Step 1: Create Stripe Products (10 min)

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Products** -> **+ Add product**
   - Name: `ExpoLaunch - React Native Starter Kit`
   - Price: `$149.00` one-time
   - Save
3. **Products** -> **+ Add product**
   - Name: `SwiftLaunch - SwiftUI Starter Kit`
   - Price: `$149.00` one-time
   - Save
4. For each product: **Create payment link**
   - Settings: Don't collect shipping, do collect email
   - After payment: Show confirmation page with message: "Check your email for repo access instructions. You'll receive a GitHub invite within 1 hour."
5. Copy both payment link URLs — you need these for Step 2

### Step 2: Update Landing Page (5 min)

- Open `site/starter-kits.html`
- Find the two `href="#"` buy buttons
- Replace with real Stripe payment link URLs from Step 1
- Redeploy: run `/starter-kit-marketing` or ask Claude to deploy via Netlify MCP

### Step 3: Create GitHub Delivery Repos (10 min)

1. [github.com/new](https://github.com/new) -> `expolaunch` (private repo)
2. [github.com/new](https://github.com/new) -> `swiftlaunch` (private repo)
3. Push template code to each:
   ```bash
   # ExpoLaunch
   cd starter-kits/expo-supabase
   git init && git remote add origin git@github.com:HenryVantieghem/expolaunch.git
   git add -A && git commit -m "ExpoLaunch v1.0" && git push -u origin main

   # SwiftLaunch
   cd ../swift-supabase
   git init && git remote add origin git@github.com:HenryVantieghem/swiftlaunch.git
   git add -A && git commit -m "SwiftLaunch v1.0" && git push -u origin main
   ```
4. **Delivery flow (manual for now):** Stripe purchase email comes in -> go to repo Settings -> Collaborators -> invite buyer's GitHub username
5. Automate later with a Stripe webhook -> GitHub API invite

### Step 4: Post First Content (5 min)

1. Open `starter-kits/marketing/ready-to-post/bluesky-posts.md`
2. Copy the first post
3. Go to [bsky.app](https://bsky.app) and post it
4. Open `starter-kits/marketing/ready-to-post/linkedin-posts.md`
5. Copy the first post
6. Go to [linkedin.com](https://linkedin.com/feed) and post it

**You are now live. Products for sale, content in the wild.**

---

## THIS WEEK — Build Momentum

| Day | Actions |
|-----|---------|
| **Day 1 (Today, Thu)** | Stripe products + payment links. Landing page updated. Bluesky post #1. LinkedIn post #1. |
| **Day 2 (Fri)** | Twitter thread #1 (from `ready-to-post/twitter-threads.md`). Reddit post in r/reactnative. |
| **Day 3 (Sat)** | Dev.to article (from `ready-to-post/devto-articles.md`). Reddit post in r/swift or r/SwiftUI. |
| **Day 4 (Sun)** | Twitter thread #2. LinkedIn post #2. Reply to any comments from earlier posts. |
| **Day 5 (Mon)** | Bluesky posts #2-3. Engage with every comment and reply across all platforms. |
| **Day 6-7 (Tue-Wed)** | Prep ProductHunt listing — screenshots, tagline, description. Do NOT launch yet. Build anticipation first. |

---

## NEXT WEEK — Scale

- **Tuesday or Wednesday:** Launch on ProductHunt (these are the highest-traffic launch days)
- **Daily:** Post on Twitter + Bluesky using `/starter-kit-marketing daily`
- **Create first video:** Remotion speed-build — "ExpoLaunch: full app in 5 minutes" (screen recording -> edit -> post)
- **Write 2 more Dev.to articles:** "How I built a SaaS backend in 10 minutes with Supabase" + "The $149 shortcut to shipping your first mobile app"
- **Cross-post:** Hashnode, Medium (behind friend link, not paywall)

---

## Automation Checklist

- [ ] Stripe Payment Link created for ExpoLaunch ($149)
- [ ] Stripe Payment Link created for SwiftLaunch ($149)
- [ ] Landing page `href="#"` buttons replaced with real payment links
- [ ] Landing page redeployed to Netlify
- [ ] GitHub repo `expolaunch` created (private) with template code pushed
- [ ] GitHub repo `swiftlaunch` created (private) with template code pushed
- [ ] Bluesky app password set up (Settings -> App Passwords)
- [ ] `.env.crosspost` filled in with Bluesky credentials
- [ ] First Bluesky post published
- [ ] First LinkedIn post published
- [ ] Reddit post in r/reactnative drafted and posted
- [ ] Reddit post in r/swift or r/SwiftUI drafted and posted
- [ ] Dev.to article published
- [ ] ProductHunt listing drafted (ship page created)

---

## Quick Wins to Get First Sale

1. **Post in r/SideProject** — "I built two starter kits for mobile devs" (high upvote sub, friendly to makers)
2. **Post in r/reactnative** — Frame it as a resource, not an ad: "I open-sourced my Expo + Supabase boilerplate structure, full kit is $149"
3. **Indie Hackers post** — Share the building story, revenue goal ($1K/mo from kits), and the landing page
4. **DM 10 people on Twitter** who recently tweeted about Expo or SwiftUI starter templates — offer them a look, ask for feedback
5. **Answer Stack Overflow questions** about Expo + Supabase setup, include a link to the landing page in your profile (not in answers — SO will flag direct links)
6. **Submit to GitHub awesome lists:**
   - [awesome-react-native](https://github.com/jondot/awesome-react-native) — PR to add ExpoLaunch
   - [awesome-swiftui](https://github.com/vlondon/awesome-swiftui) — PR to add SwiftLaunch
7. **Hacker News "Show HN"** — Only after you have 2-3 social proof signals (sales, stars, comments). Not day 1.
8. **Reply to every comment** on every post within 1 hour. Engagement signals boost visibility on every platform.

---

## Revenue Math

| Scenario | Sales/week | Monthly Revenue |
|----------|-----------|----------------|
| Slow start | 2 | $1,192 |
| Moderate | 5 | $2,980 |
| Good traction | 10 | $5,960 |

One sale per product per week = $1,192/mo. That is the floor to aim for in week 1.

---

## If Nothing Sells in 7 Days

1. Check landing page analytics (are people visiting?)
2. If no traffic: double down on content, post 2x/day
3. If traffic but no conversions: add a demo video, testimonial, or drop price to $99 for launch week
4. Ask 5 developer friends to review the landing page and give honest feedback
5. Offer a "buy both" bundle at $249 (save $49) — bundles convert better

---

**Stop reading. Start with Step 1. Timer starts now.**
