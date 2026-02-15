# Starter Kits Marketing Strategy

**Products:** ExpoLaunch ($149) | SwiftLaunch ($149)
**Landing Page:** https://agenticengineering.netlify.app/starter-kits.html
**Last Updated:** 2026-02-13

---

## 1. Competitive Landscape

| Product | Price | Stack | MRR (est.) | Primary Channels |
|---------|-------|-------|------------|------------------|
| **ShipFast (Marc Lou)** | $199 | Next.js + Supabase | ~$133K/mo | YouTube speed builds, Twitter build-in-public, ProductHunt launches |
| **Shipnative** | $99 | React Native | Unknown | SEO + Twitter |
| **SwiftAI Boilerplate** | $99 | SwiftUI | Unknown | YouTube tutorials |
| **ExpoBase** | $200 | Expo | Unknown | Content marketing |
| **LaunchToday** | $199 | Multi-platform | Unknown | ProductHunt + blog |

### Key Observations

- **ShipFast dominates** because Marc Lou treats marketing as the product. His YouTube channel (~100K+ subs) and daily Twitter presence create a flywheel: content drives traffic, traffic drives sales, sales fund more content. He launches a new SaaS every month and documents it. That social proof sells the boilerplate.
- **Mobile-first gap:** ShipFast is web-only (Next.js). There is no dominant mobile starter kit brand. Shipnative and SwiftAI exist but neither has built a strong marketing engine.
- **Price clustering:** Most kits sit at $99-$199. The $149 price point is strategic -- perceived as premium vs. the $99 options but accessible vs. the $199 ones.
- **Content is the moat:** Every successful competitor relies on content marketing. No one is winning through paid ads alone. The playbook is: educational content + build-in-public + community engagement.

---

## 2. Our Differentiation

### Two Platforms, One Brand

Most competitors sell a single-platform kit. We sell both Expo and SwiftUI under one brand. This:
- Doubles our addressable market (React Native devs AND Swift devs)
- Creates cross-sell opportunities (buy one, get the other at a discount)
- Positions us as "the mobile starter kit company" rather than a single-product offering

### Latest Tech Stack

| Feature | ExpoLaunch | SwiftLaunch |
|---------|-----------|-------------|
| Framework | Expo SDK 52+ | SwiftUI (iOS 18+) |
| Auth | Supabase Auth + OAuth | Supabase Auth + OAuth |
| State | Zustand / React Context | @Observable macro |
| Payments | RevenueCat | StoreKit 2 |
| Navigation | Expo Router v4 | NavigationStack |
| AI | OpenAI / Anthropic ready | OpenAI / Anthropic ready |

Being on the latest SDK versions matters. Developers searching for "expo sdk 52 template" or "swiftui observable boilerplate" will find us when competitors still reference older APIs.

### $149 Sweet Spot

- **Cheaper** than ExpoBase ($200) and LaunchToday ($199)
- **More complete** than Shipnative ($99) and SwiftAI ($99) -- those are barebones
- **Perceived value:** $149 is low enough for an impulse buy but high enough to signal quality

### AI-Powered Marketing Engine

We use Claude + MCPs (Apify, Firecrawl, Remotion, etc.) to produce content at a pace no solo competitor can match. While Marc Lou manually records YouTube videos, we can:
- Auto-generate blog posts from code examples
- Create video demos with Remotion
- Research trending topics with Firecrawl
- Cross-post everywhere simultaneously

This is our asymmetric advantage.

---

## 3. Launch Plan (First 30 Days)

### Week 1: Soft Launch (Days 1-7)

**Goal:** Establish social presence, get first 3-5 sales from warm audience.

| Day | Action | Platform | Details |
|-----|--------|----------|---------|
| 1 | Announcement post | Twitter + Bluesky | "I built two starter kits for mobile devs. Here's what's inside:" Thread with screenshots, architecture diagrams, feature highlights. |
| 2 | Build-in-public post | Twitter + Bluesky | Share the development journey. "It took me X weeks to build what would save you Y weeks." Include code snippets showing the clean architecture. |
| 3 | Reddit launch post | r/reactnative | "I open-sourced the auth flow from my Expo starter kit" -- give away a piece for free, link to full kit. Follow subreddit rules carefully. |
| 4 | Reddit launch post | r/swift, r/iOSProgramming | Same strategy: share a useful SwiftUI snippet (e.g., Supabase auth with @Observable), link to full kit. |
| 5 | Dev.to article | Dev.to | "How I Built a Production-Ready Expo + Supabase App in 48 Hours" -- tutorial-style, with the kit as the starting point. |
| 6 | LinkedIn post | LinkedIn | Professional angle: "Why I bet on mobile starter kits as a product." Frame it as a business story, not just a dev tool. |
| 7 | r/SideProject post | Reddit | "I launched two mobile starter kits this week. Here are the numbers so far." Transparency builds trust. |

**Soft Launch Checklist:**
- [ ] Landing page live and tested (payment flow works end-to-end)
- [ ] Stripe checkout configured for both products
- [ ] Social media profiles updated with link
- [ ] Analytics tracking set up (Netlify Analytics + UTM params)
- [ ] Email receipt / delivery flow tested

### Week 2: Content Blitz (Days 8-14)

**Goal:** Build SEO foundation, grow social following, target 10+ sales.

| Day | Action | Details |
|-----|--------|---------|
| 8 | YouTube speed build | Record (or generate via Remotion) a 5-min video: "Build a full app in 10 minutes with ExpoLaunch." Upload to YouTube, embed on landing page. |
| 9 | Dev.to article #2 | "SwiftUI + Supabase: The 2026 Stack for iOS Indie Devs" -- target the SwiftUI audience specifically. |
| 10 | Dev.to article #3 | "Expo Router v4 + Supabase Auth: Complete Setup Guide" -- pure SEO play for "expo router supabase auth." |
| 11 | Twitter/Bluesky daily | Share a code snippet from the kit every day. "Here's how ExpoLaunch handles deep linking in 12 lines of code." |
| 12 | Reddit engagement | Don't post about the kit. Instead, answer questions in r/reactnative and r/swift. When relevant, mention the kit naturally. Build karma. |
| 13 | Dev.to article #4 | "RevenueCat vs StoreKit 2: When to Use Each (with Code Examples)" -- comparison content that targets both audiences. |
| 14 | Weekly recap post | Twitter + Bluesky | "Week 2 of selling starter kits. Here are the real numbers:" Transparent revenue sharing builds audience. |

### Week 3: ProductHunt Launch (Days 15-21)

**Pre-Launch (Days 15-17):**
- [ ] Create ProductHunt listing (ship page) for both kits
- [ ] Collect early supporters (DM followers, email list, Discord)
- [ ] Prepare all launch assets: logo, screenshots, demo video, tagline
- [ ] Schedule announcement tweets for launch day
- [ ] Draft ProductHunt first comment (founder story + what makes it different)

**Launch Day (Day 18):**
- [ ] Launch at 12:01 AM PT (ProductHunt resets at midnight)
- [ ] Post founder comment immediately
- [ ] Tweet announcement with ProductHunt link
- [ ] Post to Bluesky, LinkedIn, Reddit (r/SideProject)
- [ ] Email list notification
- [ ] Respond to EVERY ProductHunt comment within 30 minutes
- [ ] Share live vote count updates throughout the day

**Post-Launch (Days 19-21):**
- [ ] Share ProductHunt results across all platforms
- [ ] Write Dev.to article: "How Our ProductHunt Launch Went (Real Numbers)"
- [ ] Follow up with everyone who commented or upvoted
- [ ] Update landing page with "Featured on ProductHunt" badge

### Week 4: SEO + Paid Experiments (Days 22-30)

**SEO Content Targets:**

| Target Keyword | Search Volume (est.) | Content Type |
|---------------|---------------------|-------------|
| expo supabase starter kit | Low-Med | Landing page + blog post |
| swiftui boilerplate 2026 | Low-Med | Landing page + blog post |
| react native template with auth | Medium | Dev.to article |
| expo router authentication | Medium | Tutorial blog post |
| swiftui supabase tutorial | Low-Med | Dev.to article |
| mobile app starter kit | Medium | Comparison blog post |

**Paid Experiments ($50-100 budget):**
- Twitter Ads: Target #reactnative, #swiftui, #indiedev hashtag followers. $50 budget, 7-day test.
- If CPA < $30 (i.e., profitable at $149 price), scale to $200/week.
- If CPA > $50, kill ads and double down on organic.

**Community Plays:**
- Indie Hackers milestone post: "From $0 to $X in 30 days selling starter kits"
- Hacker News "Show HN" post (risky -- HN can be harsh on paid products, but upside is massive)
- Discord communities: Expo Discord, SwiftUI Discord, Supabase Discord

---

## 4. Content Calendar Template

### Weekly Schedule

| Day | Content Type | Platform | Theme |
|-----|-------------|----------|-------|
| **Monday** | Code snippet | Twitter + Bluesky | Feature highlight from the kit |
| **Tuesday** | Blog post / article | Dev.to / Blog | Tutorial or comparison piece |
| **Wednesday** | Engagement | Reddit | Answer questions, provide value in relevant subs |
| **Thursday** | Build-in-public update | Twitter + Bluesky | Revenue numbers, new features, customer feedback |
| **Friday** | Video content | YouTube / Twitter | Speed build, walkthrough, or demo |
| **Saturday** | Community | Discord / Indie Hackers | Engage with communities, share insights |
| **Sunday** | Planning | Internal | Review metrics, plan next week's content |

### Content Formats

**Twitter/Bluesky Posts (daily):**
- Code snippet with explanation (screenshot or code block)
- Before/after comparison (boilerplate vs. from-scratch)
- Customer testimonial or DM screenshot
- Revenue/metrics transparency post
- Quick tip related to Expo or SwiftUI

**Dev.to Articles (2-3/week):**
- Tutorial: "How to X with Expo + Supabase"
- Comparison: "X vs Y for mobile devs in 2026"
- Case study: "How [Customer] launched their app in X days"
- Behind the scenes: "Building a starter kit product"

**YouTube Videos (1/week):**
- Speed build: "Full app in 10 minutes"
- Deep dive: "How the auth system works under the hood"
- Comparison: "ExpoLaunch vs building from scratch"

**Reddit Posts (2-3/week):**
- Helpful answers in r/reactnative, r/swift, r/iOSProgramming
- Occasional showcase in r/SideProject (max 1/week)
- Never hard-sell in subreddit threads

### Monthly Content Goals

| Metric | Target |
|--------|--------|
| Twitter/Bluesky posts | 25-30 |
| Dev.to articles | 8-12 |
| YouTube videos | 4 |
| Reddit contributions | 12-15 |
| LinkedIn posts | 4-8 |

---

## 5. Metrics to Track

### Primary KPIs

| Metric | Tool | Target (30 days) | Target (60 days) |
|--------|------|-------------------|-------------------|
| **Revenue** | Stripe Dashboard | $1,000 | $3,000 |
| **Units Sold** | Stripe Dashboard | 7 | 20 |
| **Landing Page Visits** | Netlify Analytics | 2,000 | 5,000 |
| **Conversion Rate** | Stripe / Netlify | 0.35% | 0.5% |

### Secondary KPIs

| Metric | Tool | Target (30 days) |
|--------|------|-------------------|
| **Twitter/Bluesky Followers** | Platform analytics | +200 |
| **Dev.to Article Views** | Dev.to dashboard | 5,000 total |
| **Reddit Karma (relevant subs)** | Reddit | +500 |
| **YouTube Views** | YouTube Studio | 1,000 total |
| **Email List Subscribers** | Email provider | 100 |
| **ProductHunt Upvotes** | ProductHunt | 100+ |

### Tracking Setup

**Netlify Analytics:**
- Enable on the starter-kits landing page
- Track page views, unique visitors, top referrers
- Monitor bandwidth (indicates download/interest patterns)

**UTM Parameters:**
Use consistent UTM tags for all outbound links:
```
?utm_source={platform}&utm_medium={type}&utm_campaign=starterkit_launch
```

Examples:
- `?utm_source=twitter&utm_medium=social&utm_campaign=starterkit_launch`
- `?utm_source=devto&utm_medium=blog&utm_campaign=starterkit_launch`
- `?utm_source=producthunt&utm_medium=launch&utm_campaign=starterkit_launch`
- `?utm_source=reddit&utm_medium=social&utm_campaign=starterkit_launch`

**Stripe Dashboard:**
- Track total revenue, units sold, refund rate
- Set up Stripe webhook to log each sale (for real-time notifications)

**Weekly Review Checklist:**
- [ ] Revenue this week vs. last week
- [ ] Top 3 traffic sources
- [ ] Best-performing content piece
- [ ] Conversion rate trend
- [ ] New email subscribers
- [ ] Customer feedback / support requests

---

## 6. Automation with MCPs

Our MCP stack turns a solo operation into a marketing machine. Here is how each tool fits into the workflow.

### Apify -- Competitor Intelligence & Trend Scraping

**Use cases:**
- Scrape competitor landing pages monthly (track pricing changes, new features)
- Monitor Twitter/Bluesky for mentions of "expo starter kit", "swiftui boilerplate"
- Scrape ProductHunt for newly launched competitor products
- Extract trending topics from r/reactnative and r/swift

**Workflow:**
```
Apify (scrape) -> Claude (analyze) -> Content ideas -> Write posts
```

### Firecrawl -- Deep Web Research

**Use cases:**
- Research trending mobile dev topics for blog posts
- Analyze competitor blog content strategy
- Find forums and communities discussing mobile app development
- Generate content briefs from competitor articles

**Workflow:**
```
Firecrawl (research topic) -> Claude (write article) -> Dev.to / Blog
```

### Google Workspace MCP -- Email Marketing

**Use cases:**
- Draft launch announcement emails
- Send follow-up sequences to prospects
- Manage email list communications

**Workflow:**
```
Claude (draft email) -> Gmail MCP (create draft) -> Review -> Send
```

### Remotion -- Programmatic Video Content

**Use cases:**
- Generate speed-build demo videos from code
- Create social media video clips (15-30 sec feature highlights)
- Build ProductHunt demo video
- Produce weekly "What's New" update videos

**Workflow:**
```
Code examples -> Remotion template -> Render video -> Upload to YouTube/Twitter
```

### Semrush -- SEO Keyword Research

**Use cases:**
- Identify high-value, low-competition keywords
- Track rankings for target keywords
- Analyze competitor SEO strategies
- Find content gaps to exploit

**Target Keywords to Track:**
- "expo supabase starter kit"
- "swiftui boilerplate"
- "react native template 2026"
- "mobile app starter kit"
- "expo router auth template"
- "swiftui supabase tutorial"

### Automation Playbook (Daily Routine)

| Time | Action | MCP Tools |
|------|--------|-----------|
| Morning | Check competitor activity | Apify |
| Morning | Research trending topics | Firecrawl |
| Midday | Write and publish content | Claude + Google Workspace |
| Afternoon | Create visual / video assets | Remotion |
| Evening | Cross-post to all platforms | Manual or scheduled posts |
| Weekly | SEO keyword review | Semrush |

---

## 7. Revenue Projections

### Unit Economics

| | Per Sale |
|---|---------|
| Price | $149 |
| Stripe fees (2.9% + $0.30) | -$4.62 |
| Hosting (negligible) | ~$0 |
| **Net per sale** | **$144.38** |

### Sales Scenarios

| Scenario | Sales/Week | Weekly Revenue | Monthly Revenue | Annual Revenue |
|----------|-----------|---------------|----------------|---------------|
| **Conservative** | 5 | $745 | $3,225 | $38,700 |
| **Target** | 10 | $1,490 | $6,450 | $77,400 |
| **Optimistic** | 20 | $2,980 | $12,900 | $154,800 |
| **ShipFast-level** | 200+ | $29,800+ | $133,000+ | $1.6M+ |

### Milestone Targets

| Milestone | Sales Needed | Timeline Target |
|-----------|-------------|----------------|
| First sale | 1 | Week 1 |
| Break even on time invested | 10 | Week 3 |
| $1,000 MRR | ~7/week | Day 45 |
| $3,000 MRR | ~21/week | Day 90 |
| $6,450 MRR (target) | 10/week sustained | Day 60 |

### Growth Levers (in priority order)

1. **Content volume** -- More articles, more videos, more social posts = more surface area for discovery. This is the highest-ROI activity in Month 1-3.
2. **SEO compounding** -- Dev.to articles and blog posts take 30-60 days to rank. Content published in Week 1 pays off in Month 2-3.
3. **Social proof** -- Every testimonial, every public sale number, every "I built this with ExpoLaunch" tweet compounds trust.
4. **Cross-sell bundle** -- Offer both kits at $249 ($49 discount). Increases average order value.
5. **Affiliate program** -- Offer 30% commission ($45/sale) to dev influencers. Only activate after product-market fit is confirmed (Month 2+).
6. **Paid ads** -- Only scale if organic CPA is understood. Never spend on ads before organic traction.

### Revenue Timeline (Realistic)

```
Month 1:  $500 - $1,500    (soft launch, building content engine)
Month 2:  $1,500 - $4,000  (SEO kicks in, ProductHunt boost)
Month 3:  $3,000 - $6,500  (content flywheel spinning, repeat traffic)
Month 4+: $5,000 - $10,000 (if target trajectory holds)
```

---

## Appendix: Quick Reference

### Social Media Profiles to Create/Update
- [ ] Twitter: Pin tweet about starter kits
- [ ] Bluesky: Profile link to landing page
- [ ] Dev.to: Author bio mentions starter kits
- [ ] YouTube: Channel banner + description
- [ ] LinkedIn: Featured section with landing page
- [ ] Indie Hackers: Product page
- [ ] ProductHunt: Ship page (pre-launch)

### Landing Page Optimization Checklist
- [ ] Clear headline: what it is, who it's for
- [ ] Feature comparison table (ExpoLaunch vs SwiftLaunch)
- [ ] Demo video or GIF above the fold
- [ ] Social proof section (testimonials, sale count, PH badge)
- [ ] FAQ section addressing common objections
- [ ] Money-back guarantee badge
- [ ] Mobile-responsive checkout flow
- [ ] Fast page load (<2s)

### Pricing Strategy Notes
- $149 is the launch price. Consider raising to $179-$199 after 100 sales (with proof of value).
- Bundle deal: both kits for $249 (save $49). Always show the savings.
- Never discount below $99 (destroys perceived value). Instead, add bonuses: "Buy this week, get a free 30-min setup call."
- Black Friday / seasonal: offer bonus templates, not price cuts.

### Competitor Monitoring Cadence
- **Weekly:** Check ShipFast Twitter for new content strategies
- **Monthly:** Scrape competitor landing pages for pricing/feature changes
- **Quarterly:** Full competitive analysis update to this document
