# Claude Code Marketplace Plugin: Mobile App Factory

> A comprehensive Claude Code plugin that provides a complete mobile app development
> ecosystem — from ideation to App Store submission — using a single reusable slash command.
> Inspired by Compound Engineering (Every Inc.) and GSD methodology.

---

## Plugin Overview

```
┌──────────────────────────────────────────────────────────────────┐
│           MOBILE APP FACTORY — CLAUDE CODE PLUGIN                │
│                                                                  │
│  "One command. Full production app. App Store ready."            │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  SLASH COMMANDS (13)                                             │
│  ├── /mobile-app-generator    — Full app creation wizard         │
│  ├── /mobile-ideate           — Brainstorm and validate ideas    │
│  ├── /mobile-research         — Competitive analysis + templates │
│  ├── /mobile-plan             — Generate PRD + sprint plan       │
│  ├── /mobile-provision        — Set up Supabase backend          │
│  ├── /mobile-scaffold         — Generate project code            │
│  ├── /mobile-develop          — Continue building features       │
│  ├── /mobile-test             — Run test suite + quality gates   │
│  ├── /mobile-review           — Code review + security audit     │
│  ├── /mobile-deploy           — Build + deploy to TestFlight     │
│  ├── /mobile-submit           — Submit to App Store              │
│  ├── /mobile-compound         — Compound learning session        │
│  └── /mobile-status           — Project status dashboard         │
│                                                                  │
│  SKILLS (16)                                                     │
│  ├── mobile-app-generator     — Master orchestrator skill        │
│  ├── supabase-architect       — Database + API design            │
│  ├── expo-developer           — React Native Expo specialist     │
│  ├── swift-developer          — Swift/SwiftUI specialist         │
│  ├── ui-ux-designer           — Mobile UI/UX design              │
│  ├── mobile-backend           — Supabase backend specialist      │
│  ├── mobile-testing           — Test generation + QA             │
│  ├── mobile-devops            — CI/CD + deployment               │
│  ├── appstore-submission      — App Store optimization           │
│  ├── competitive-research     — Market analysis via MCP          │
│  ├── prd-generator            — Product requirements docs        │
│  ├── sprint-planner           — Sprint planning + tracking       │
│  ├── code-reviewer            — Security + quality review        │
│  ├── compound-learner         — Captures patterns + decisions    │
│  ├── template-selector        — Finds best template for app      │
│  └── realtime-architect       — Supabase Realtime specialist     │
│                                                                  │
│  AGENTS (24 Specialized)                                         │
│  ├── Orchestrator (1)         — Meta-agent that routes tasks     │
│  ├── Research Team (4)        — Ideation, market, template, UX   │
│  ├── Architecture Team (4)    — DB, API, realtime, security      │
│  ├── Frontend Team (4)        — Expo, Swift, UI, components      │
│  ├── Backend Team (4)         — Supabase, edge fn, auth, storage │
│  ├── Quality Team (4)         — Unit, integration, E2E, perf     │
│  └── Ship Team (3)            — CI/CD, ASO, submission           │
│                                                                  │
│  MCP SERVERS (5)                                                 │
│  ├── Supabase MCP             — Project + DB + Auth + Storage    │
│  ├── Firecrawl MCP            — Web scraping + competitor scan   │
│  ├── Apify MCP                — App Store data + business data   │
│  ├── GitHub MCP               — Repo management + templates      │
│  └── Context7 MCP             — Documentation context            │
│                                                                  │
│  TOOLS INTEGRATION                                               │
│  ├── Fastlane                 — iOS build + deploy automation    │
│  ├── App Store Connect CLI    — Submission + metadata management │
│  ├── EAS Build                — Expo cloud builds                │
│  ├── Xcode Cloud              — Swift cloud builds               │
│  └── TestFlight               — Beta distribution                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## The Compound Engineering Loop for Mobile Apps

Inspired by Every Inc.'s Compound Engineering methodology, each development cycle follows:

```
    ┌──────────┐
    │  1. PLAN │ ← 40% of time
    └────┬─────┘
         │
    ┌────▼─────┐
    │ 2. WORK  │ ← 20% of time
    └────┬─────┘
         │
    ┌────▼──────┐
    │ 3. REVIEW │ ← 30% of time
    └────┬──────┘
         │
    ┌────▼────────┐
    │ 4. COMPOUND │ ← 10% of time (capture learnings)
    └─────────────┘
```

### 1. PLAN Phase
- Analyze requirements with user
- Research competitors and templates
- Design architecture and schema
- Generate PRD and sprint plan
- Identify risks and dependencies

### 2. WORK Phase
- Execute code generation
- Provision Supabase resources
- Build features sprint by sprint
- Integrate third-party services

### 3. REVIEW Phase
- Automated code review (security, quality)
- Test execution (unit, integration, E2E)
- Performance benchmarking
- App Review Guidelines compliance check

### 4. COMPOUND Phase
- Record architectural decisions
- Document patterns that worked
- Capture failure modes and fixes
- Update templates with learnings
- Feed knowledge back into the system

---

## Meta-Orchestrator Architecture

The Meta-Orchestrator is the brain of the system — it routes tasks to the right agents, manages the development lifecycle, and ensures compound learning.

```
User: "I want to build a fitness tracking app"
                    │
                    ▼
    ┌───────────────────────────────┐
    │       META-ORCHESTRATOR       │
    │                               │
    │  1. Parse intent              │
    │  2. Select platform           │
    │  3. Match template            │
    │  4. Route to agents           │
    │  5. Monitor progress          │
    │  6. Capture learnings         │
    └───────────────────────────────┘
           │         │         │
           ▼         ▼         ▼
    ┌──────────┐ ┌──────┐ ┌──────────┐
    │ Research │ │ Arch │ │ Frontend │
    │  Team    │ │ Team │ │   Team   │
    └──────────┘ └──────┘ └──────────┘
           │         │         │
           ▼         ▼         ▼
    ┌──────────────────────────────┐
    │     COMPOUND KNOWLEDGE DB    │
    │  (patterns, decisions, fixes)│
    └──────────────────────────────┘
```

---

## Fastlane + App Store Connect Integration

### Automated iOS Submission Pipeline

```ruby
# Fastfile (auto-generated by /mobile-deploy)

default_platform(:ios)

platform :ios do

  desc "Build and upload to TestFlight"
  lane :beta do
    setup_ci if ENV['CI']
    sync_code_signing(type: "appstore")
    build_app(
      scheme: APP_SCHEME,
      export_method: "app-store"
    )
    upload_to_testflight(
      skip_waiting_for_build_processing: true
    )
  end

  desc "Submit to App Store"
  lane :release do
    setup_ci if ENV['CI']

    # Build
    sync_code_signing(type: "appstore")
    build_app(
      scheme: APP_SCHEME,
      export_method: "app-store"
    )

    # Upload with metadata
    upload_to_app_store(
      submit_for_review: true,
      automatic_release: false,
      force: true,
      precheck_include_in_app_purchases: false,
      submission_information: {
        add_id_info_uses_idfa: false
      }
    )
  end

  desc "Capture App Store screenshots"
  lane :screenshots do
    capture_screenshots(
      scheme: "#{APP_SCHEME}UITests",
      devices: [
        "iPhone 16 Pro Max",
        "iPhone 16 Plus",
        "iPad Pro (13-inch) (M4)"
      ]
    )
    frame_screenshots(
      silver: true,
      path: "./fastlane/screenshots"
    )
  end
end
```

### App Store Connect CLI Integration

```bash
# Auto-submit via ASC CLI (alternative to Fastlane)
asc submit create \
  --app "$APP_ID" \
  --version "$VERSION" \
  --build "$BUILD_ID" \
  --confirm

# Check submission status
asc submit status --id "$SUBMISSION_ID"

# Update metadata
asc metadata update \
  --app "$APP_ID" \
  --description "$(cat metadata/description.txt)" \
  --keywords "$(cat metadata/keywords.txt)"
```

---

## Plugin Installation

### As a Claude Code Plugin (future)
```bash
# Install from marketplace
npx claude-code install mobile-app-factory

# Or clone and install locally
git clone https://github.com/agenticengineering/mobile-app-factory-plugin
cd mobile-app-factory-plugin
npx claude-code plugin install .
```

### Current Installation (Project-Level)
```
# Copy to your project's .claude directory:
.claude/
├── commands/
│   └── mobile-app-generator.md
└── skills/
    └── mobile-app-generator/
        └── SKILL.md

# Copy agent configs and templates:
mobile-app-generator/
├── agents/           # 7 agent prompts
├── templates/        # Template registry
└── plans/            # Generated plans go here
```

---

## MCP Server Requirements

The plugin expects these MCP servers to be configured:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": ["-y", "@supabase/mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "${SUPABASE_ACCESS_TOKEN}"
      }
    },
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": {
        "FIRECRAWL_API_KEY": "${FIRECRAWL_API_KEY}"
      }
    },
    "apify": {
      "command": "npx",
      "args": ["-y", "@anthropic/apify-mcp-server"],
      "env": {
        "APIFY_API_TOKEN": "${APIFY_API_TOKEN}"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_TOKEN": "${GITHUB_TOKEN}"
      }
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@context7/mcp-server"]
    }
  }
}
```

---

## Knowledge Compound Database

Every app generated feeds back into the system:

```
mobile-app-generator/
└── compound-knowledge/
    ├── patterns/
    │   ├── auth-patterns.md          # What auth approaches work best
    │   ├── realtime-patterns.md      # Realtime subscription patterns
    │   ├── navigation-patterns.md    # Navigation architecture patterns
    │   └── performance-patterns.md   # Performance optimization patterns
    ├── decisions/
    │   ├── [app-slug]-decisions.md   # Decisions log per app
    │   └── ...
    ├── failures/
    │   ├── common-rls-mistakes.md    # RLS policy mistakes
    │   ├── expo-build-failures.md    # Build failure solutions
    │   └── app-review-rejections.md  # App Store rejection reasons + fixes
    └── templates/
        ├── learned-schemas/          # Schema patterns that work well
        └── learned-components/       # Component patterns that work well
```

---

## Differentiation from Existing Solutions

| Feature | Compound Eng. Plugin | GSD by Taaches | Mobile App Factory |
|---------|---------------------|----------------|-------------------|
| Mobile-specific | No | No | Yes (core focus) |
| Supabase integration | No | No | Full MCP integration |
| App Store submission | No | No | Fastlane + ASC CLI |
| Template registry | No | No | 17+ curated templates |
| Dual platform (Expo/Swift) | No | No | Yes |
| Backend provisioning | No | No | Automated via Supabase MCP |
| Competitive research | No | No | Firecrawl + Apify MCP |
| Agent team per app | General | General | 7 mobile-specialized agents |
| Compound learning | Yes (general) | No | Yes (mobile-specific) |

---

## Success Metrics for the Plugin

1. **Idea to scaffold:** < 15 minutes
2. **Scaffold to working auth:** < 30 minutes
3. **Working app to TestFlight:** < 2 weeks (Sprint 1-2)
4. **TestFlight to App Store:** < 16 weeks total
5. **Code quality:** 0 TypeScript errors, 80%+ test coverage
6. **Security:** 100% RLS coverage, 0 exposed keys
7. **Compound learning:** Each new app generation is faster than the last
