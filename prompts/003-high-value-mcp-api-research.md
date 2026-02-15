<research_objective>
Conduct an exhaustive, multi-source deep research sweep to identify the most valuable MCP servers, APIs, and data sources in the world that could be connected to Claude Code — specifically those that retrieve the richest, most actionable, most revenue-generating data for an AI automation consulting firm.

This research will directly feed our Agentic Engineering Consulting business. The output will be used to:
1. Prioritize which MCP servers to install or build next
2. Identify APIs worth wrapping into custom MCP servers
3. Maximize the data richness of our lead generation, outreach, and intelligence pipelines
4. Expand into new high-value verticals (crypto, finance, real estate, hiring, etc.)

Thoroughly explore every category. Be wildly ambitious. Think about what data, if accessible in real-time from Claude Code, would be worth thousands of dollars per month to a consulting firm.
</research_objective>

<context>
We are Agentic Engineering Consulting LLC, an AI automation consulting firm. Our core workflow:
- Use Apify MCP to scrape Google Maps, LinkedIn, websites for B2B leads with emails, phones, LinkedIn URLs
- Use Firecrawl MCP to deep-scrape prospect websites for personalization data
- Use Supabase MCP to store leads and intelligence in our client dashboards
- Use Google Workspace MCP for Gmail outreach, Google Docs contracts, Sheets tracking
- Use GitHub MCP, Netlify MCP for deployment
- We already have 34 MCP servers installed (see MEMORY.md for full list)

What makes data "high-value" for us:
- Lead enrichment data (emails, phones, LinkedIn, revenue, employee count, tech stack, funding)
- Trigger events (job postings, funding rounds, leadership changes, regulatory filings)
- Market intelligence (competitor analysis, industry trends, pricing data)
- Financial data (crypto prices, stock data, economic indicators)
- Real estate data (property values, transactions, zoning)
- Social proof data (reviews, ratings, social media engagement)
- Intent signals (website visitors, content engagement, search behavior)
</context>

<research_phases>

<phase name="1_existing_mcp_landscape">
<title>Scan the Entire MCP Server Ecosystem</title>
<instructions>
Use WebSearch, Firecrawl, and Apify to research:

1. **Official MCP Server Registries:**
   - Search "MCP server registry" "model context protocol servers" "MCP marketplace"
   - Scrape https://github.com/modelcontextprotocol/servers for ALL listed servers
   - Scrape any community MCP directories or awesome-lists
   - Search GitHub for repos with "mcp-server" in the name (sort by stars)

2. **For EACH discovered MCP server, capture:**
   - Name, description, what data it provides
   - GitHub stars, last updated, maintenance status
   - What API it wraps (if any)
   - Revenue potential score (1-10): How much money could this data make us?
   - Data richness score (1-10): How detailed/actionable is the data?
   - Installation complexity (easy/medium/hard)

3. **Categorize into value tiers:**
   - TIER 1 (Install immediately): Direct revenue impact, rich data, easy setup
   - TIER 2 (Build soon): High value but needs custom work or API key
   - TIER 3 (Future consideration): Niche but potentially valuable
</instructions>
</phase>

<phase name="2_api_goldmine_discovery">
<title>Identify the Most Valuable APIs That SHOULD Be MCP Servers</title>
<instructions>
Research APIs across these high-value categories. For each, assess whether an MCP server exists or if we should build one:

**Lead Generation & Enrichment:**
- Apollo.io API (we know this one — but is there an MCP?)
- ZoomInfo API, Clearbit API, Hunter.io API, Lusha API
- BuiltWith API (tech stack detection)
- Crunchbase API (funding data, company intelligence)
- PitchBook API (private market data)
- LinkedIn Sales Navigator API (if accessible)
- RocketReach, Snov.io, Voila Norbert (email finding)

**Financial & Crypto:**
- CoinGecko API, CoinMarketCap API (crypto prices, market cap)
- Binance API, Coinbase API (trading execution)
- Alpha Vantage API (stocks, forex, crypto)
- Polygon.io (real-time market data)
- Alpaca API (we have this — assess current value)
- PumpFun API (we have this — assess)
- DeFi Llama API (TVL, DeFi protocols)
- Etherscan/Solscan APIs (on-chain data)
- FRED API (Federal Reserve economic data)
- World Bank API, IMF API (macro economic data)
- Bloomberg API (if accessible)

**Real Estate & Property:**
- Zillow API, Redfin API, Realtor.com API
- ATTOM Data API (property data, owner info, valuations)
- CoStar API (commercial real estate)
- Reonomy API (commercial property intelligence)

**Social & Intent Signals:**
- Twitter/X API (social listening, trending topics)
- Reddit API (community sentiment, trending discussions)
- Google Trends API (search intent signals)
- SimilarWeb API (website traffic data)
- SEMrush API (we have MCP — assess its tools)
- Ahrefs API (backlink data, keyword research)
- BuzzSumo API (content performance)

**Government & Public Records:**
- SEC EDGAR API (company filings, insider trading)
- USPTO API (patent filings)
- OpenCorporates API (global company registry)
- USASpending API (government contracts)
- Permits, licenses, court records APIs

**Hiring & Talent:**
- Indeed API, Glassdoor API
- LinkedIn Jobs API
- Wellfound (AngelList) API
- Lever, Greenhouse APIs (ATS data)

**Reviews & Reputation:**
- Google Business Profile API (reviews, ratings)
- Yelp Fusion API (business reviews)
- Trustpilot API, G2 API, Capterra API
- BBB API

**Communication & Outreach:**
- Twilio API (SMS, voice)
- SendGrid API (email delivery)
- Slack API (team communication)
- WhatsApp Business API
- Calendly API (scheduling)

**AI & Data Processing:**
- Perplexity API (AI-powered search)
- Tavily API (AI search for agents)
- Exa API (neural search)
- Diffbot API (web data extraction)
- ScrapingBee, Bright Data APIs

For EACH API discovered:
- Name and URL
- Free tier availability and pricing
- Data richness (what exactly do you get back?)
- MCP server status: EXISTS / NEEDS_BUILDING / IMPOSSIBLE
- Revenue potential: How would we use this to make money?
- Priority score (1-10)
</instructions>
</phase>

<phase name="3_custom_mcp_opportunities">
<title>Identify Custom MCP Servers We Should Build</title>
<instructions>
Based on phases 1 and 2, identify the TOP 10 custom MCP servers we should build ourselves:

For each:
1. **Name**: e.g., "mcp-crunchbase" or "mcp-zillow"
2. **API it wraps**: The underlying API
3. **Key tools it would expose**: List 5-10 MCP tool functions
4. **Data output**: What structured data would each tool return?
5. **Revenue use case**: Exactly how this generates money for us
6. **Build estimate**: Simple (1 day) / Medium (2-3 days) / Complex (1 week+)
7. **Dependencies**: API key cost, rate limits, authentication method

Prioritize by: (Revenue Potential × Data Richness) / Build Complexity
</instructions>
</phase>

<phase name="4_competitive_intelligence">
<title>What Are Other AI Agencies Using?</title>
<instructions>
Research what tools and data sources the most successful AI automation agencies are using:

- Search for "AI agency tech stack" "AI automation tools" "AI lead generation stack"
- Look at Clay.com, Instantly.ai, Smartlead, Lemlist — what APIs do they integrate?
- Research what data enrichment tools sales teams at top companies use
- Look at Y Combinator AI startups — what data APIs are they building on?
- Check Product Hunt for recently launched data/API tools

Capture: Tool name, what it does, pricing, whether we could replicate it with MCP servers
</instructions>
</phase>

<phase name="5_moonshot_ideas">
<title>Moonshot & Unconventional Data Sources</title>
<instructions>
Think beyond the obvious. What unconventional data sources would be incredibly valuable?

- **Satellite imagery APIs** (economic activity, construction, parking lot analysis)
- **Weather APIs** (impact on HVAC, insurance, agriculture businesses)
- **IoT/sensor data APIs** (industrial monitoring, smart building data)
- **Academic/research APIs** (JSTOR, arXiv, PubMed — for research consulting)
- **Patent intelligence** (competitive moats, innovation tracking)
- **Podcast/YouTube transcript APIs** (content intelligence, thought leader tracking)
- **Browser extension data** (anonymous web behavior patterns)
- **Dark web monitoring APIs** (cybersecurity consulting)
- **Supply chain data APIs** (logistics, shipping, inventory)
- **Domain registration APIs** (new business detection, competitor monitoring)
- **Job board scraping** (hiring signals = growth signals = sales triggers)
- **Court records/litigation APIs** (legal industry intelligence)
- **Lobbying/political donation APIs** (government affairs consulting)
- **Energy/utility data APIs** (sustainability consulting)

For each moonshot:
- What is it?
- How would we monetize it?
- Does an API exist?
- Could we build an MCP server for it?
- Estimated revenue potential
</instructions>
</phase>

</research_phases>

<execution_strategy>
<parallel_research>
For maximum efficiency, whenever you need to perform multiple independent searches or scrapes, invoke all relevant tools simultaneously rather than sequentially. This means:

1. Launch multiple WebSearch queries in parallel for different categories
2. Use Apify actors in parallel for different scraping targets
3. Use Firecrawl in parallel for different documentation sites

After receiving tool results, carefully reflect on their quality and determine optimal next steps before proceeding.
</parallel_research>

<tools_to_use>
- **WebSearch**: For discovering MCP servers, API marketplaces, tech stack articles
- **Firecrawl** (firecrawl_scrape, firecrawl_search): For deep-scraping API documentation sites
- **Apify** (search-actors, call-actor): For structured data extraction from directories
- **Context7**: For up-to-date MCP protocol documentation
- **GitHub MCP** (search_repositories, search_code): For finding MCP server repos
</tools_to_use>
</execution_strategy>

<output>
Save the complete research report to: `./research/high-value-mcp-api-landscape.md`

Structure the output as:

```markdown
# High-Value MCP & API Landscape Research
## Date: [today]
## Researcher: Claude Code (Opus)

## Executive Summary
[Top 10 findings, biggest opportunities, recommended immediate actions]

## TIER 1: Install Now (Existing MCP Servers)
[Table: Name | Data Type | Revenue Potential | Stars | Install Command]

## TIER 2: APIs to Wrap as Custom MCP Servers
[Table: API | Category | Data Richness | Free Tier | Build Effort | Priority]

## TOP 10 Custom MCP Servers to Build
[Detailed spec for each]

## Competitive Intelligence
[What top agencies use, gaps we can fill]

## Moonshot Opportunities
[Unconventional high-value data sources]

## Category Deep Dives
### Lead Generation & Enrichment
### Financial & Crypto
### Real Estate
### Social & Intent Signals
### Government & Public Records
### Hiring & Talent
### Reviews & Reputation

## Recommended Action Plan
### Week 1: [immediate installs]
### Week 2: [first custom MCP builds]
### Month 1: [full stack expansion]

## Appendix: Full API Database
[Every API discovered with all metadata]
```
</output>

<verification>
Before completing, verify:
- At least 50 unique APIs/MCP servers researched and documented
- Every major category has at least 5 entries
- Top 10 custom MCP server opportunities have full specs
- Revenue potential is estimated for every entry
- Competitive intelligence section has real company examples
- Action plan is concrete with specific next steps
</verification>

<success_criteria>
- Research covers breadth (10+ categories) AND depth (5+ entries per category)
- Clear revenue narrative for each recommendation
- Prioritized action plan that can be executed immediately
- Output file is well-structured and usable as a reference document
- At least 3 "moonshot" ideas that go beyond obvious choices
</success_criteria>
