# The Apify Money-Making Arsenal

> 25 battle-tested Apify actors for lead generation, competitive intelligence, price arbitrage, and automation.
> Last updated: 2026-02-12

---

## Table of Contents

1. [Lead Generation (The Money Printers)](#1-lead-generation)
2. [Price Monitoring & E-Commerce Arbitrage](#2-price-monitoring--e-commerce-arbitrage)
3. [Social Media Intelligence](#3-social-media-intelligence)
4. [Job Market & Freelance Intelligence](#4-job-market--freelance-intelligence)
5. [Competitive Intelligence & SEO](#5-competitive-intelligence--seo)
6. [Quick-Reference Pricing Table](#6-quick-reference-pricing-table)
7. [Recommended Playbooks](#7-recommended-playbooks)

---

## 1. Lead Generation

### 1.1 Google Maps Scraper (THE KING)

| Field | Value |
|---|---|
| **Actor ID** | `compass/crawler-google-places` |
| **URL** | https://apify.com/compass/crawler-google-places |
| **Total Users** | 273,535 |
| **Monthly Users** | 15,083 |
| **Success Rate** | 96% |
| **Rating** | 4.68/5 |

**What it does:** The #1 most-used actor on the entire Apify platform. Extracts business data from Google Maps -- names, addresses, phone numbers, websites, reviews, reviewer details, images, contact info (including full name, email, job title), opening hours, and prices.

**Pricing (Pay Per Event):**
- Place scraped: $0.004/place (FREE tier) down to $0.000756/place (DIAMOND)
- Review scraped: $0.0005/review (FREE) down to $0.0000945 (DIAMOND)
- Business leads enrichment (name, email, phone, job title, LinkedIn): $0.005/lead (BRONZE+)
- Company contacts enrichment (emails, socials): $0.002/place (FREE+)

**How to make money:**
- **Lead generation agency:** Scrape "plumbers in Dallas" or "dentists in Miami" -- sell lists of 1,000 businesses with emails for $50-200. Your cost: ~$4-10.
- **Local SEO service:** Find businesses with low review counts or poor ratings, then offer reputation management services.
- **Appointment setting:** Scrape businesses, enrich with emails/phones, feed into cold outreach sequences.

**Example use case:** Scrape all restaurants in Chicago with fewer than 4 stars and no website. Sell them website development services. Cost for 5,000 leads: ~$20-50.

---

### 1.2 Google Maps Email Extractor

| Field | Value |
|---|---|
| **Actor ID** | `lukaskrivka/google-maps-with-contact-details` |
| **URL** | https://apify.com/lukaskrivka/google-maps-with-contact-details |
| **Total Users** | 57,747 |
| **Monthly Users** | 2,073 |
| **Success Rate** | 90.4% |
| **Rating** | 4.46/5 |

**What it does:** Scrapes Google Maps places AND then visits each business website to extract emails, phone numbers, and social media links. Two-step enrichment built in.

**Pricing:** $0.01/result (FREE tier) down to $0.005/result (DIAMOND)

**How to make money:**
- **Cold email campaigns:** Get verified business emails from Google Maps directly. No separate email finder needed.
- **Data-as-a-service:** Build niche business databases (e.g., "all auto repair shops in Texas with email addresses") and sell subscriptions.

---

### 1.3 LinkedIn Profile Scraper with Email (No Cookies)

| Field | Value |
|---|---|
| **Actor ID** | `dev_fusion/Linkedin-Profile-Scraper` |
| **URL** | https://apify.com/dev_fusion/Linkedin-Profile-Scraper |
| **Total Users** | 38,003 |
| **Monthly Users** | 2,977 |
| **Success Rate** | 99.9% |
| **Rating** | 4.53/5 |

**What it does:** Mass-extracts LinkedIn profiles -- verified emails, phone numbers, work history, education, skills, and more. No LinkedIn cookies required (safe for your account).

**Pricing:** $0.01/profile ($10 per 1,000 profiles)

**How to make money:**
- **B2B lead lists:** Scrape decision-makers (CTOs, VPs of Engineering) at target companies, enrich with emails, sell to sales teams.
- **Recruiting pipeline:** Build candidate databases for staffing agencies. Charge per placement.
- **ABM campaigns:** Pair with company data to build account-based marketing lists.

---

### 1.4 LinkedIn Profile Enrichment (Cheapest)

| Field | Value |
|---|---|
| **Actor ID** | `anchor/linkedin-profile-enrichment` |
| **URL** | https://apify.com/anchor/linkedin-profile-enrichment |
| **Total Users** | 3,839 |
| **Monthly Users** | 237 |
| **Success Rate** | 100% |
| **Rating** | 4.71/5 |

**What it does:** Takes LinkedIn URLs and returns live profile data -- works for both people and companies. Integrates with N8N, Make, Zapier.

**Pricing:** $0.006/profile enriched + $0.001 actor start + $0.003/minute runtime

**How to make money:**
- **CRM enrichment service:** Offer to enrich clients' existing CRM data with fresh LinkedIn info.
- **Automation pipeline component:** Cheapest way to add LinkedIn enrichment to any n8n/Make workflow.

---

### 1.5 LinkedIn Email Finder (Verified)

| Field | Value |
|---|---|
| **Actor ID** | `blitzapi/linkedin-email-finder` |
| **URL** | https://apify.com/blitzapi/linkedin-email-finder |
| **Total Users** | 764 |
| **Monthly Users** | 166 |
| **Success Rate** | 100% |
| **Rating** | 5.0/5 |

**What it does:** Finds verified professional emails from LinkedIn profiles with >99% deliverability. No cookies required. Pay only for verified emails found.

**Pricing:** $0.008/email found + $0.001 actor start

**How to make money:**
- **Email list building:** Feed LinkedIn Sales Navigator exports into this, get verified emails back. Sell enriched lists.
- **Outbound sales automation:** Chain with LinkedIn scraper to go from "VP of Marketing at SaaS companies" to "verified email addresses" in one pipeline.

---

### 1.6 Leads Scraper (Apollo/ZoomInfo Alternative)

| Field | Value |
|---|---|
| **Actor ID** | `peakydev/leads-scraper-ppe` |
| **URL** | https://apify.com/peakydev/leads-scraper-ppe |
| **Total Users** | 7,060 |
| **Monthly Users** | 1,017 |
| **Success Rate** | 96.2% |
| **Rating** | 2.70/5 (mixed reviews -- test before committing) |

**What it does:** Extracts leads with verified mobile phone numbers, work and personal emails. Positioned as a cheap Apollo/ZoomInfo/Lusha alternative. Claims 70-90% email hit rate.

**Pricing:** $0.0017/lead (FREE/BRONZE) down to $0.001/lead (GOLD+). Actor start: $0.30.

**How to make money:**
- **Cheapest lead enrichment at scale:** At $1.70 per 1,000 leads, this is dramatically cheaper than Apollo ($49/mo for 900 exports) or ZoomInfo ($15,000+/year).
- **Resell enriched data:** Buy at $1.70/1k, sell at $50-100/1k to sales teams.

**Caveat:** Lower rating suggests inconsistent quality. Always validate a sample before buying at scale.

---

### 1.7 Website Email & Phone Finder

| Field | Value |
|---|---|
| **Actor ID** | `caprolok/website-email-phone-finder` |
| **URL** | https://apify.com/caprolok/website-email-phone-finder |
| **Total Users** | 945 |
| **Monthly Users** | 88 |
| **Success Rate** | 100% |

**What it does:** Takes any domain and extracts emails and phone numbers from the website. Simple, reliable, high success rate.

**Pricing:** $0.01/result

**How to make money:**
- **Pair with Google Maps scraper:** Get business websites from Maps, then extract contact details from each site.
- **Lead enrichment add-on:** Offer as part of a data pipeline.

---

### 1.8 Free Email Domain Scraper

| Field | Value |
|---|---|
| **Actor ID** | `s-r/free-email-domain-scraper` |
| **URL** | https://apify.com/s-r/free-email-domain-scraper |
| **Total Users** | 917 |
| **Monthly Users** | 58 |
| **Success Rate** | 94.2% |
| **Rating** | 5.0/5 |

**What it does:** Extracts emails from any website using a two-pass search strategy with advanced filtering (removes generic/malformed emails) and user-agent rotation.

**Pricing:** $0.025/email (FREE) down to $0.005/email (GOLD+)

---

## 2. Price Monitoring & E-Commerce Arbitrage

### 2.1 Amazon Product Details Scraper

| Field | Value |
|---|---|
| **Actor ID** | `axesso_data/amazon-product-details-scraper` |
| **URL** | https://apify.com/axesso_data/amazon-product-details-scraper |
| **Total Users** | 896 |
| **Monthly Users** | 184 |
| **Success Rate** | 100% |
| **Rating** | 3.59/5 |

**What it does:** Real-time Amazon product data -- title, price, rating, images, availability, seller info. No caching; always live data.

**Pricing:** $0.0015/product

**How to make money:**
- **Retail arbitrage:** Monitor price differences between Amazon and other marketplaces (Walmart, Target). Buy low, sell high.
- **Amazon FBA research:** Find products with high demand, low competition, good margins.
- **Price tracking service:** Sell alerts to e-commerce businesses when competitor prices change.

---

### 2.2 Google Shopping Scraper

| Field | Value |
|---|---|
| **Actor ID** | `damilo/google-shopping-apify` |
| **URL** | https://apify.com/damilo/google-shopping-apify |
| **Total Users** | 417 |
| **Monthly Users** | 49 |
| **Success Rate** | 99.7% |
| **Rating** | 4.56/5 |

**What it does:** Live Google Shopping product listings -- prices, ratings, sellers, availability, images. Fully localized by keyword, language, country. Automatic pagination.

**Pricing:** $0.0035/result

**How to make money:**
- **Cross-platform arbitrage:** Compare Google Shopping prices with Amazon/eBay to find margin opportunities.
- **Competitive pricing intelligence:** Help e-commerce clients monitor where their products rank and at what price.

---

### 2.3 Shopify Product Scraper (FREE)

| Field | Value |
|---|---|
| **Actor ID** | `pocesar/shopify-scraper` |
| **URL** | https://apify.com/pocesar/shopify-scraper |
| **Total Users** | 2,131 |
| **Monthly Users** | 33 |
| **Success Rate** | 98.6% |

**What it does:** Crawls any Shopify store and extracts all products -- title, price, description, variants, images. Open source and FREE.

**Pricing:** FREE (open source)

**How to make money:**
- **Competitor monitoring:** Track competitor Shopify stores' pricing, new products, inventory changes.
- **Dropshipping research:** Find trending products across thousands of Shopify stores.
- **Market intelligence reports:** Build reports on pricing trends in specific niches.

---

### 2.4 CoinMarketCap Crypto Scraper

| Field | Value |
|---|---|
| **Actor ID** | `louisdeconinck/coinmarketcap-crypto-scraper` |
| **URL** | https://apify.com/louisdeconinck/coinmarketcap-crypto-scraper |
| **Total Users** | 224 |
| **Monthly Users** | 7 |
| **Success Rate** | 100% |
| **Rating** | 5.0/5 |

**What it does:** Comprehensive crypto market data -- prices, market caps, volumes for all listed cryptocurrencies.

**Pricing:** $0.0018/result

**How to make money:**
- **Crypto analytics dashboards:** Build and sell access to custom crypto dashboards.
- **Arbitrage bot feeds:** Feed data into arbitrage bots monitoring price discrepancies across exchanges.
- **Newsletter data:** Power a crypto market newsletter with automated data.

---

## 3. Social Media Intelligence

### 3.1 Instagram Scraper (Official Apify)

| Field | Value |
|---|---|
| **Actor ID** | `apify/instagram-scraper` |
| **URL** | https://apify.com/apify/instagram-scraper |
| **Total Users** | 179,039 |
| **Monthly Users** | 10,777 |
| **Success Rate** | 99.6% |
| **Rating** | 4.74/5 |

**What it does:** The definitive Instagram scraper. Posts, profiles, places, hashtags, photos, comments. By Apify themselves (official).

**Pricing:** $0.0027/result (FREE) down to $0.0005/result (DIAMOND)

**How to make money:**
- **Influencer marketing agency:** Find influencers by hashtag/location, analyze engagement rates, build databases for brands.
- **Brand monitoring:** Track mentions, sentiment, competitor content strategies.
- **Lead generation from Instagram business profiles:** Extract business emails from bios.

---

### 3.2 TikTok Scraper

| Field | Value |
|---|---|
| **Actor ID** | `clockworks/tiktok-scraper` |
| **URL** | https://apify.com/clockworks/tiktok-scraper |
| **Total Users** | 126,122 |
| **Monthly Users** | 5,473 |
| **Success Rate** | 98.9% |
| **Rating** | 4.66/5 |

**What it does:** Full TikTok data extraction -- videos, hashtags, users, profiles, followers, comments, music data. Country-specific scraping. Video download available.

**Pricing:** $0.0037/result (FREE) down to $0.0005/result (DIAMOND). Add-ons for comments, followers, video downloads.

**How to make money:**
- **TikTok influencer database:** Build the definitive influencer database for brands. Charge for access.
- **Trend spotting service:** Monitor trending hashtags/sounds, sell insights to content creators and agencies.
- **UGC content curation:** Find viral content patterns for clients.

---

### 3.3 Tweet Scraper V2 (Twitter/X)

| Field | Value |
|---|---|
| **Actor ID** | `apidojo/tweet-scraper` |
| **URL** | https://apify.com/apidojo/tweet-scraper |
| **Total Users** | 35,911 |
| **Monthly Users** | 2,656 |
| **Success Rate** | 99.9% |
| **Rating** | 4.38/5 |

**What it does:** Lightning-fast Twitter/X scraping -- search, URL, list, and profile scraping with customizable filters. 30-80 tweets per second.

**Pricing:** $0.40 per 1,000 tweets (BRONZE+). FREE tier is $40/1k tweets (100x markup, so always use BRONZE+).

**How to make money:**
- **Social listening service:** Monitor brand mentions, competitor activity, industry conversations.
- **Sentiment analysis pipeline:** Scrape tweets about a stock/crypto/brand, run through sentiment analysis, sell insights.
- **PR monitoring:** Real-time brand crisis detection.

---

### 3.4 Twitter/X Follower Scraper

| Field | Value |
|---|---|
| **Actor ID** | `kaitoeasyapi/premium-x-follower-scraper-following-data` |
| **URL** | https://apify.com/kaitoeasyapi/premium-x-follower-scraper-following-data |
| **Total Users** | 3,198 |
| **Monthly Users** | 235 |
| **Success Rate** | 97.9% |
| **Rating** | 4.59/5 |

**What it does:** Extracts follower and following lists from any Twitter/X account.

**Pricing:** $0.00015/user ($0.10 per 1,000 followers) -- extremely cheap.

**How to make money:**
- **Audience analysis:** Map out who follows competitors, find lookalike audiences for ad targeting.
- **Influencer vetting:** Verify follower quality before brands pay for influencer campaigns.

---

### 3.5 Reddit Scraper (All-In-One)

| Field | Value |
|---|---|
| **Actor ID** | `fatihtahta/reddit-scraper-search-fast` |
| **URL** | https://apify.com/fatihtahta/reddit-scraper-search-fast |
| **Total Users** | 1,205 |
| **Monthly Users** | 363 |
| **Success Rate** | 98.3% |
| **Rating** | 2.99/5 |

**What it does:** Posts and full comment threads from any search, subreddit, user, or direct post URL. Fastest Reddit scraper available. Clean JSON output.

**Pricing:** $0.00149/result ($1.49 per 1,000 posts/comments)

**How to make money:**
- **Pain point mining:** Scrape subreddits like r/smallbusiness, r/entrepreneur, r/freelance to find problems people will pay to solve.
- **Content research:** Find popular topics and questions for content marketing.
- **Product validation:** Search for discussions about competitor products, find feature gaps.
- **SEO keyword research:** Find what real people are asking about in your niche.

---

### 3.6 Google Maps Reviews Scraper

| Field | Value |
|---|---|
| **Actor ID** | `compass/Google-Maps-Reviews-Scraper` |
| **URL** | https://apify.com/compass/Google-Maps-Reviews-Scraper |
| **Total Users** | 25,811 |
| **Monthly Users** | 2,294 |
| **Success Rate** | 99.9% |
| **Rating** | 4.89/5 |

**What it does:** Extracts all reviews from Google Maps places -- review text, date, rating, response from owner, review URL, reviewer details.

**Pricing:** $0.0006/review (FREE) down to $0.0002/review (DIAMOND)

**How to make money:**
- **Reputation management service:** Find businesses with bad reviews, offer to help them respond and improve.
- **Competitor analysis:** Analyze competitor reviews to find their weaknesses.
- **Sentiment analysis reports:** Sell review analysis reports to local businesses.

---

## 4. Job Market & Freelance Intelligence

### 4.1 Indeed Jobs Scraper

| Field | Value |
|---|---|
| **Actor ID** | `valig/indeed-jobs-scraper` |
| **URL** | https://apify.com/valig/indeed-jobs-scraper |
| **Total Users** | 878 |
| **Monthly Users** | 192 |
| **Success Rate** | 99.9% |
| **Rating** | 5.0/5 |

**What it does:** Extracts job listings from Indeed with detailed filters, structured output, global support. Cheapest high-quality option.

**Pricing:** $0.0001/result ($0.10 per 1,000 jobs) -- absurdly cheap.

**How to make money:**
- **Job market analytics:** Build salary benchmarking tools for specific roles/locations.
- **Recruiting intelligence:** Find which companies are hiring aggressively (growth signal) and sell to investors or sales teams.
- **Staffing agency pipeline:** Automate job discovery for staffing agencies.

---

### 4.2 Indeed Jobs Scraper (PPR - Higher Volume)

| Field | Value |
|---|---|
| **Actor ID** | `borderline/indeed-scraper` |
| **URL** | https://apify.com/borderline/indeed-scraper |
| **Total Users** | 4,438 |
| **Monthly Users** | 603 |
| **Success Rate** | 94.9% |
| **Rating** | 4.45/5 |

**What it does:** Higher-volume Indeed scraper with company details, advanced filters, and anti-blocking.

**Pricing:** $0.005/job

**How to make money:** Same as above but better for large-scale jobs requiring more robust anti-blocking.

---

### 4.3 Upwork Job Scraper (FREE)

| Field | Value |
|---|---|
| **Actor ID** | `hidayat-ethum/upwork-job-scraper-ethum` |
| **URL** | https://apify.com/hidayat-ethum/upwork-job-scraper-ethum |
| **Total Users** | 61 |
| **Monthly Users** | 4 |
| **Success Rate** | 97.2% |

**What it does:** Extracts freelance opportunities from Upwork based on search criteria -- filter by keywords, hourly rates, client verification, categories, experience levels.

**Pricing:** FREE

**How to make money:**
- **Freelance job alerts service:** Build a premium job alert service for freelancers ($10-30/mo subscription).
- **Market rate analysis:** Build tools showing average rates per skill/category.
- **Competitive intelligence for freelancers:** Show who is bidding on what.

---

## 5. Competitive Intelligence & SEO

### 5.1 Website Tech Stack Scanner

| Field | Value |
|---|---|
| **Actor ID** | `misterkhan/website-tech-stack-scanner` |
| **URL** | https://apify.com/misterkhan/website-tech-stack-scanner |
| **Total Users** | 158 |
| **Monthly Users** | 35 |
| **Success Rate** | 99.6% |
| **Rating** | 5.0/5 |

**What it does:** Detects 6,000+ technologies on any website -- CMS, analytics, marketing pixels, JS frameworks, CDNs, hosting. BuiltWith alternative at a fraction of the cost.

**Pricing:** $0.05/site (FREE) down to $0.03/site (GOLD+)

**How to make money:**
- **Sales prospecting:** Find companies using outdated tech (e.g., WordPress 4.x) and sell them upgrades/migration services.
- **Agency lead qualification:** Identify prospects using specific tech stacks you specialize in.
- **Market research:** "What % of e-commerce sites in the US use Shopify vs. WooCommerce?"
- **BuiltWith alternative:** BuiltWith charges $295-495/mo. You can replicate their data for pennies.

---

### 5.2 SpyFu Domain SEO/PPC Insights

| Field | Value |
|---|---|
| **Actor ID** | `dionysus_way/spyfu-multiple-domains-seo-ppc-and-keyword-insights` |
| **URL** | https://apify.com/dionysus_way/spyfu-multiple-domains-seo-ppc-and-keyword-insights |
| **Total Users** | 54 |
| **Monthly Users** | 15 |
| **Success Rate** | 100% |

**What it does:** Exports competitor SEO and PPC details from SpyFu -- organic/paid keywords, traffic estimates, ad spend, backlinks, top pages. Bulk scrape up to 200 domains at once. Covers 30+ countries.

**Pricing:** $0.007/domain (FREE) down to $0.0031/domain (GOLD+)

**How to make money:**
- **SEO agency reports:** Generate competitor analysis reports for clients at near-zero data cost.
- **PPC intelligence:** Find what keywords competitors are bidding on, what their ad spend looks like.
- **Content gap analysis:** Find keywords competitors rank for that your client doesn't.

---

### 5.3 Complete SEO Audit Tool

| Field | Value |
|---|---|
| **Actor ID** | `smart-digital/complete-seo-audit-tool` |
| **URL** | https://apify.com/smart-digital/complete-seo-audit-tool |
| **Total Users** | 73 |
| **Monthly Users** | 25 |
| **Success Rate** | 92.2% |
| **Rating** | 5.0/5 |

**What it does:** Full SEO audit -- meta tags, technical SEO, performance, links, images. Generates 0-100 SEO scores per page with detailed recommendations.

**Pricing:** $0.06 actor start + $0.03/page analyzed

**How to make money:**
- **SEO audit lead magnet:** Offer free SEO audits, then sell remediation services. Cost per audit: $0.30-3.00.
- **White-label SEO service:** Run audits for agencies at scale.

---

### 5.4 Restaurant Review Aggregator

| Field | Value |
|---|---|
| **Actor ID** | `tri_angle/restaurant-review-aggregator` |
| **URL** | https://apify.com/tri_angle/restaurant-review-aggregator |
| **Total Users** | 513 |
| **Monthly Users** | 16 |
| **Success Rate** | 94% |
| **Rating** | 4.25/5 |

**What it does:** Add restaurant names, get reviews from Yelp, Google Maps, DoorDash, UberEats, TripAdvisor, and Facebook. Cross-platform review aggregation.

**Pricing:** $0.005/review (generic), $0.003/TripAdvisor review, down to $0.001/Google Maps review (DIAMOND)

**How to make money:**
- **Restaurant reputation management:** Offer monitoring across all platforms. Charge $200-500/mo per restaurant.
- **Restaurant consulting:** Analyze review patterns across platforms to find operational issues.

---

### 5.5 Zillow ZIP Code Search Scraper

| Field | Value |
|---|---|
| **Actor ID** | `maxcopell/zillow-zip-search` |
| **URL** | https://apify.com/maxcopell/zillow-zip-search |
| **Total Users** | 2,259 |
| **Monthly Users** | 129 |
| **Success Rate** | 95.1% |
| **Rating** | 3.08/5 |

**What it does:** Finds all Zillow properties for sale, for rent, or recently sold by ZIP code.

**Pricing:** $0.002/result

**How to make money:**
- **Real estate investment analysis:** Build models for specific markets using actual listing data.
- **Real estate agent leads:** Find FSBO (For Sale By Owner) listings, offer agent services.
- **Market reports:** Sell neighborhood-level market reports.

---

## 6. Quick-Reference Pricing Table

| Actor | Cost per 1K Results | Best For |
|---|---|---|
| Google Maps Scraper | $4.00 | Local business leads |
| Google Maps Email Extractor | $10.00 | Business emails from Maps |
| LinkedIn Profile Scraper | $10.00 | B2B prospect data |
| LinkedIn Email Finder | $8.00 | Verified work emails |
| Leads Scraper (Apollo alt.) | $1.70 | Cheapest bulk leads |
| Amazon Product Scraper | $1.50 | Product/pricing data |
| Google Shopping Scraper | $3.50 | Cross-platform pricing |
| Shopify Scraper | FREE | Competitor products |
| Instagram Scraper | $2.70 | Social media analytics |
| TikTok Scraper | $3.70 | Trend analysis |
| Tweet Scraper V2 | $0.40 | Social listening |
| X Follower Scraper | $0.10 | Audience analysis |
| Reddit Scraper | $1.49 | Pain point mining |
| Google Maps Reviews | $0.60 | Reputation monitoring |
| Indeed Jobs Scraper | $0.10 | Job market intel |
| Upwork Scraper | FREE | Freelance opportunities |
| Tech Stack Scanner | $50.00 | Sales prospecting |
| SpyFu Domain Insights | $7.00 | SEO/PPC competitor intel |
| SEO Audit Tool | $30.00/page | SEO lead magnet |
| CoinMarketCap Scraper | $1.80 | Crypto data |
| Zillow Scraper | $2.00 | Real estate data |
| Review Aggregator | $5.00 | Restaurant reputation |

*Prices shown at FREE/BRONZE tier. Volume discounts available at higher tiers.*

---

## 7. Recommended Playbooks

### Playbook A: Local Business Lead Generation Machine

**Goal:** Generate and sell local business leads.
**Monthly revenue potential:** $2,000-10,000/month

**Pipeline:**
1. **Google Maps Scraper** (`compass/crawler-google-places`) -- Scrape businesses by category + location
2. **Google Maps Email Extractor** (`lukaskrivka/google-maps-with-contact-details`) -- Enrich with emails
3. **Google Maps Reviews Scraper** (`compass/Google-Maps-Reviews-Scraper`) -- Get review data for qualification
4. Export to CRM or cold email tool (Instantly, Smartlead, etc.)

**Cost:** ~$15-25 per 1,000 fully enriched leads
**Sell for:** $50-200 per 1,000 leads, or $500-2,000/mo as a subscription

---

### Playbook B: B2B Sales Intelligence Platform

**Goal:** Build a ZoomInfo/Apollo competitor at 1/100th the cost.
**Monthly revenue potential:** $5,000-50,000/month

**Pipeline:**
1. **LinkedIn Profile Scraper** (`dev_fusion/Linkedin-Profile-Scraper`) -- Get profiles + emails
2. **LinkedIn Email Finder** (`blitzapi/linkedin-email-finder`) -- Verify emails
3. **Website Tech Stack Scanner** (`misterkhan/website-tech-stack-scanner`) -- Add technographic data
4. **Company Domain Finder** (`apioracle/company-domain`) -- Map company names to domains
5. Package into a searchable database with API access

**Cost:** ~$20-30 per 1,000 enriched B2B contacts
**Sell for:** $0.10-0.50 per contact, or SaaS subscription at $99-499/mo

---

### Playbook C: Social Media Intelligence Agency

**Goal:** Sell social media analytics and influencer databases.
**Monthly revenue potential:** $3,000-20,000/month

**Pipeline:**
1. **Instagram Scraper** (`apify/instagram-scraper`) -- Profile + engagement data
2. **TikTok Scraper** (`clockworks/tiktok-scraper`) -- TikTok profiles + video data
3. **Tweet Scraper** (`apidojo/tweet-scraper`) -- Twitter mentions + sentiment
4. Build dashboards showing engagement rates, growth trends, content analysis

**Cost:** ~$10-50 per brand analysis (1,000 posts across platforms)
**Sell for:** $500-2,000/month per client for ongoing monitoring

---

### Playbook D: E-Commerce Price Arbitrage

**Goal:** Find and exploit price differences across marketplaces.
**Monthly revenue potential:** $1,000-5,000/month (arbitrage profits)

**Pipeline:**
1. **Amazon Product Scraper** (`axesso_data/amazon-product-details-scraper`) -- Amazon prices
2. **Google Shopping Scraper** (`damilo/google-shopping-apify`) -- Cross-marketplace prices
3. **Shopify Scraper** (`pocesar/shopify-scraper`) -- DTC store prices
4. Run comparison algorithm, flag arbitrage opportunities
5. Execute on eBay, Amazon, or your own storefront

**Cost:** ~$5-20/day in scraping costs
**Sell for:** Keep the margins (typically 15-40% per item)

---

### Playbook E: SEO/Reputation Service (Automated Lead Gen)

**Goal:** Use scraped data to identify and close SEO and reputation management clients.
**Monthly revenue potential:** $5,000-30,000/month

**Pipeline:**
1. **SEO Audit Tool** (`smart-digital/complete-seo-audit-tool`) -- Run audits on prospect websites
2. **SpyFu Domain Insights** (`dionysus_way/spyfu-multiple-domains-seo-ppc-and-keyword-insights`) -- Show competitors' advantages
3. **Google Maps Reviews** (`compass/Google-Maps-Reviews-Scraper`) -- Find businesses with review problems
4. Send automated reports as lead magnets via cold email
5. Close retainer deals ($1,000-5,000/mo per client)

**Cost:** ~$1-5 per prospect audit
**Sell for:** $1,000-5,000/month retainer per client

---

### Playbook F: Job Market Intelligence

**Goal:** Build and sell job market data products.
**Monthly revenue potential:** $1,000-5,000/month

**Pipeline:**
1. **Indeed Jobs Scraper** (`valig/indeed-jobs-scraper`) -- Mass scrape at $0.10/1K
2. **Upwork Scraper** (`hidayat-ethum/upwork-job-scraper-ethum`) -- Freelance market data (FREE)
3. Build dashboards: salary trends, hiring velocity, skills demand by region
4. Sell to recruiting firms, HR departments, career coaches

**Cost:** ~$1-10/day
**Sell for:** $49-199/mo subscription

---

## Key Strategic Notes

1. **Always start at BRONZE tier or above.** Many actors have 10-100x markups on the FREE tier (notably Tweet Scraper: $0.04 vs $0.0004 per tweet). Even BRONZE dramatically cuts costs.

2. **Chain actors in pipelines.** The real power is combining actors: Google Maps -> Email Extractor -> Review Scraper -> Cold Email Tool. No single actor wins; the pipeline wins.

3. **Schedule recurring runs.** Most of these actors support scheduling via the Apify platform or API. Set up daily/weekly scrapes to keep data fresh and sell "always-on" monitoring services.

4. **Export via API for automation.** All actors expose their results via Apify's REST API. Integrate with n8n, Make, Zapier, or direct API calls to build fully automated data pipelines.

5. **Test before committing.** Always run a small test batch (100-500 results) before scaling up. Check data quality, success rates, and whether the output matches what you need.

6. **The margins are absurd.** You are paying $1-25 per 1,000 data points for data that companies like ZoomInfo ($15K/yr), Apollo ($49-79/mo), BuiltWith ($295/mo), and SEMrush ($130/mo) charge orders of magnitude more for. The arbitrage between Apify actor costs and market value of the data is the core business opportunity.
