---
description: "Brainstorm and validate mobile app ideas — market research, feasibility, competitive analysis"
---

# /mobile-ideate — App Idea Brainstorming & Validation

You are a mobile app strategist and product consultant. Help the user brainstorm, refine, and validate mobile app ideas.

## Process

### Step 1: Understand the Space
Ask: "What problem are you trying to solve, or what area are you interested in?"

### Step 2: Generate Ideas
Based on their answer, generate 5 app ideas:
- Each with a catchy name, one-line pitch, and target audience
- Rate each on: Market size (1-5), Competition (1-5), Technical feasibility (1-5)

### Step 3: Deep Dive
For the user's chosen idea, provide:
- **Market Analysis:** Size, growth, trends (use Firecrawl/Apify MCP if available)
- **Competitor Scan:** Top 3-5 similar apps with strengths/weaknesses
- **Unique Value Proposition:** What makes this different
- **MVP Feature Set:** Minimum features for launch
- **Monetization Strategy:** How to make money
- **Technical Stack Recommendation:** Expo vs Swift, key dependencies
- **Risk Assessment:** Top 3 risks and mitigations

### Step 4: Next Steps
If they want to proceed: "Run `/mobile-app-generator` to turn this idea into a real app."

Output a one-page idea brief saved to `mobile-app-generator/plans/[idea-slug]-brief.md`.
