# Mobile App Generator — Master Plan & PRD

> **Project:** Agentic Mobile App Factory
> **Version:** 1.0.0
> **Created:** 2026-02-13
> **Author:** Agentic Engineering Consulting LLC
> **Slash Command:** `/mobile-app-generator`

---

## Executive Summary

A Claude Code slash command system that transforms a single idea into a **complete, App Store-ready mobile application** with full Supabase backend — in either **React Native Expo Go** or **Swift native iOS**. The system uses MCP tools (Supabase, Firecrawl, Apify, GitHub) to scaffold, provision, and plan the entire application from zero to submission.

This isn't a template. It's a **full agentic app factory** — an AI-powered mobile development studio that questions, plans, provisions, scaffolds, and orchestrates the entire lifecycle of a production mobile app.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Template Registry](#template-registry)
3. [The Generator Flow](#the-generator-flow)
4. [Supabase MCP Integration](#supabase-mcp-integration)
5. [Platform Templates](#platform-templates)
6. [Agent Team Architecture](#agent-team-architecture)
7. [PRD Auto-Generation](#prd-auto-generation)
8. [App Store Readiness Checklist](#app-store-readiness-checklist)
9. [Skill Ecosystem](#skill-ecosystem)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│              /mobile-app-generator                   │
│         (Claude Code Slash Command)                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Phase 1: DISCOVER                                   │
│  ├── Ask: What app do you want to build?            │
│  ├── Ask: React Native Expo Go or Swift Native?     │
│  ├── Ask: Core features & target audience            │
│  ├── Ask: Monetization strategy                      │
│  └── Ask: Design preferences                         │
│                                                      │
│  Phase 2: RESEARCH                                   │
│  ├── Firecrawl: Scan competitor apps                 │
│  ├── Apify: Scrape App Store listings                │
│  ├── Web: Find best matching templates               │
│  └── Analyze: Feature gap analysis                   │
│                                                      │
│  Phase 3: PROVISION                                  │
│  ├── Supabase MCP: Create new project                │
│  ├── Supabase MCP: Configure auth providers          │
│  ├── Supabase MCP: Create database schema            │
│  ├── Supabase MCP: Set up RLS policies               │
│  ├── Supabase MCP: Configure storage buckets          │
│  ├── Supabase MCP: Deploy edge functions             │
│  └── Supabase MCP: Enable realtime                   │
│                                                      │
│  Phase 4: SCAFFOLD                                   │
│  ├── GitHub: Create repo from template               │
│  ├── Generate: Full project structure                │
│  ├── Generate: All screens & navigation              │
│  ├── Generate: Supabase client config                │
│  ├── Generate: Auth flows                            │
│  ├── Generate: Core feature modules                  │
│  └── Generate: CI/CD pipeline                        │
│                                                      │
│  Phase 5: PLAN                                       │
│  ├── Generate: Full PRD document                     │
│  ├── Generate: Sprint-by-sprint roadmap              │
│  ├── Generate: App-specific skill & prompt           │
│  ├── Generate: Agent team for this app               │
│  └── Generate: App Store submission plan             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## 2. Template Registry

### React Native Expo Go Templates (Curated & Ranked)

| # | Template | GitHub | Features | Best For |
|---|----------|--------|----------|----------|
| 1 | **LuckyBelieve/social-app** | [Link](https://github.com/LuckyBelieve/social-app) | Full social media, posts, likes, comments, profiles, realtime, Supabase auth+storage | Social/community apps |
| 2 | **Razikus/supabase-nextjs-template** | [Link](https://github.com/Razikus/supabase-nextjs-template) | Production SaaS, auth, user mgmt, file storage, RLS, i18n, legal docs, Expo mobile app | SaaS / enterprise apps |
| 3 | **aaronksaunders/expo-supabase-ai-template** | [Link](https://github.com/aaronksaunders/expo-supabase-ai-template) | Expo Router, Supabase auth, OpenAI integration, NativeWind UI | AI-powered apps |
| 4 | **Hechprad/react-native-supabase-boilerplate-2025** | [Link](https://github.com/Hechprad/react-native-supabase-boilerplate-2025) | RN 0.76+, TypeScript, Supabase auth, ESLint, Jest, GitHub Actions, i18n, Zod | Any production app |
| 5 | **flemingvincent/expo-supabase-starter** | [Link](https://github.com/flemingvincent/expo-supabase-starter) | Comprehensive Expo + Supabase starter, opinionated architecture | Learning / any app |
| 6 | **josehernandezv/supabook** | [Link](https://github.com/josehernandezv/supabook) | Social media app, React Native + Supabase | Social media clones |
| 7 | **hiroshitashir/react-native-openai-supabase** | [Link](https://github.com/hiroshitashir/react-native-openai-supabase) | AI chat, Supabase edge functions, auth | Chat / AI apps |
| 8 | **launchtodayhq/expo-push-notifications** | [Link](https://github.com/launchtodayhq/expo-push-notifications) | Push notifications, Supabase edge functions, device token mgmt | Apps needing push |
| 9 | **NativeLaunch Expo Starter** | [Link](https://nativelaunch.dev/expo-starter-kit) | Production-ready: auth, subscriptions (RevenueCat), analytics, push, polished UI | Commercial/paid apps |
| 10 | **ExpoStarter.com** | [Link](https://www.expostarter.com/) | Full Supabase starter kit, auth, storage, all features | Quick launch apps |

### Swift Native iOS Templates (Curated & Ranked)

| # | Template | Source | Features | Best For |
|---|----------|--------|----------|----------|
| 1 | **supabase/supabase-swift** | [Link](https://github.com/supabase/supabase-swift) | Official SDK: DB, auth, realtime, storage, edge functions, pgvector | Any Swift app (SDK) |
| 2 | **SwiftAI Boilerplate Pro** | [Link](https://www.swiftaiboilerplate.com/) | MVVM, streaming chat, Supabase auth, RevenueCat, SwiftData, 11 Swift packages | AI-powered iOS apps |
| 3 | **shurutech/iOSKickstart** | [Link](https://github.com/shurutech/iOSKickstart) | SwiftUI boilerplate generator, splash, auth, onboarding, tabs, CLI-driven | Any iOS app scaffold |
| 4 | **Supabase SwiftUI Quickstart** | [Link](https://supabase.com/docs/guides/getting-started/quickstarts/ios-swiftui) | Official quickstart: auth, database, deep linking | Getting started |
| 5 | **Supabase Swift User Mgmt Tutorial** | [Link](https://supabase.com/docs/guides/getting-started/tutorials/with-swift) | Auth, profiles, avatar upload, storage | User management apps |
| 6 | **supabase-community/realtime-swift** | [Link](https://github.com/supabase-community/realtime-swift) | Realtime subscriptions, websocket client | Realtime-heavy apps |
| 7 | **supabase-community/storage-swift** | [Link](https://github.com/supabase-community/storage-swift) | File storage, upload/download, RLS | Storage-heavy apps |

### Recommended Template Combinations

**For Social/Community Apps (Expo):**
- Base: `LuckyBelieve/social-app` + `launchtodayhq/expo-push-notifications`
- Adds: Posts, likes, comments, profiles, realtime, push notifications

**For SaaS/Enterprise Apps (Expo):**
- Base: `Razikus/supabase-nextjs-template` (mobile part) + `Hechprad/react-native-supabase-boilerplate-2025`
- Adds: Production CI/CD, i18n, legal docs, user management

**For AI-Powered Apps (Expo):**
- Base: `aaronksaunders/expo-supabase-ai-template` + `hiroshitashir/react-native-openai-supabase`
- Adds: AI chat, edge functions, OpenAI integration

**For Any Swift iOS App:**
- Base: `supabase/supabase-swift` SDK + `shurutech/iOSKickstart` scaffold
- Adds: Full Supabase backend with native SwiftUI scaffold

---

## 3. The Generator Flow

### Phase 1: Discovery Interview

The generator asks these questions interactively:

```
Q1: "What app would you like to build?"
    → Free text description of the app idea

Q2: "Which platform?"
    → React Native Expo Go (iOS + Android)
    → Swift Native iOS (iOS only)

Q3: "What type of app is this?"
    → Social / Community
    → Marketplace / E-commerce
    → SaaS / Productivity
    → Health / Fitness
    → Education / Learning
    → Finance / Fintech
    → AI-Powered / Chat
    → Content / Media
    → Custom (describe)

Q4: "What are the 3-5 core features?"
    → User provides feature list

Q5: "Who is the target audience?"
    → Demographics, use case

Q6: "Monetization strategy?"
    → Free (ad-supported)
    → Freemium (in-app purchases)
    → Subscription (monthly/yearly)
    → One-time purchase
    → None (internal tool)

Q7: "Design preferences?"
    → Minimal / Clean
    → Bold / Vibrant
    → Dark mode first
    → Corporate / Professional
    → Custom (describe)

Q8: "App name and bundle identifier?"
    → Name + reverse domain (com.company.appname)
```

### Phase 2: Competitive Research (MCP-Powered)

Using Firecrawl and Apify MCPs:

1. **Firecrawl** → Scrape top 5 competitor app landing pages
2. **Apify** → Scrape App Store listings for similar apps (ratings, reviews, features)
3. **Web Search** → Find latest best practices for the app category
4. **Analysis** → Generate competitive feature matrix and gap analysis

### Phase 3: Supabase Backend Provisioning

Using Supabase MCP tools:

```
1. supabase.create_project(name, org_id, region, plan)
2. supabase.run_sql() → Create all tables with proper types
3. supabase.run_sql() → Create RLS policies for every table
4. supabase.run_sql() → Create indexes for performance
5. supabase.run_sql() → Create triggers and functions
6. supabase.run_sql() → Enable realtime on required tables
7. Configure auth providers (email, Google, Apple)
8. Create storage buckets (avatars, uploads, media)
9. Deploy edge functions (push notifications, webhooks, AI)
10. Generate API keys and connection config
```

### Phase 4: Project Scaffolding

**React Native Expo Go:**
```
├── app/                          # Expo Router file-based routing
│   ├── (auth)/                   # Auth screens group
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── forgot-password.tsx
│   │   └── verify-otp.tsx
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── index.tsx             # Home/Feed
│   │   ├── search.tsx            # Search/Explore
│   │   ├── create.tsx            # Create/Add
│   │   ├── notifications.tsx     # Notifications
│   │   └── profile.tsx           # Profile
│   ├── (screens)/                # Stack screens
│   │   ├── settings.tsx
│   │   ├── edit-profile.tsx
│   │   ├── [id].tsx              # Dynamic detail screen
│   │   └── chat/
│   │       ├── index.tsx         # Chat list
│   │       └── [chatId].tsx      # Chat detail
│   ├── _layout.tsx               # Root layout
│   └── +not-found.tsx
├── components/                   # Reusable UI components
│   ├── ui/                       # Base UI (buttons, inputs, cards)
│   ├── forms/                    # Form components
│   ├── layouts/                  # Layout wrappers
│   └── features/                 # Feature-specific components
├── lib/                          # Core libraries
│   ├── supabase.ts               # Supabase client config
│   ├── auth.ts                   # Auth helpers
│   ├── storage.ts                # Storage helpers
│   └── realtime.ts               # Realtime subscriptions
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useSupabase.ts
│   ├── useRealtime.ts
│   └── usePushNotifications.ts
├── context/                      # React Context providers
│   ├── AuthContext.tsx
│   ├── ThemeContext.tsx
│   └── NotificationContext.tsx
├── services/                     # API service layer
│   ├── api.ts                    # Base API client
│   ├── users.ts                  # User CRUD
│   └── [feature].ts              # Feature-specific services
├── types/                        # TypeScript types
│   ├── database.types.ts         # Supabase generated types
│   ├── navigation.types.ts
│   └── app.types.ts
├── constants/                    # App constants
│   ├── theme.ts
│   ├── config.ts
│   └── strings.ts
├── utils/                        # Utility functions
├── assets/                       # Static assets
├── supabase/                     # Supabase config
│   ├── migrations/               # SQL migrations
│   ├── functions/                # Edge functions
│   └── config.toml
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
├── tsconfig.json
└── package.json
```

**Swift Native iOS:**
```
├── [AppName]/
│   ├── App/
│   │   ├── [AppName]App.swift        # App entry point
│   │   ├── AppState.swift             # Global app state
│   │   └── ContentView.swift          # Root view router
│   ├── Core/
│   │   ├── Supabase/
│   │   │   ├── SupabaseClient.swift   # Client configuration
│   │   │   ├── AuthManager.swift      # Authentication logic
│   │   │   ├── DatabaseManager.swift  # Database operations
│   │   │   ├── StorageManager.swift   # File storage
│   │   │   └── RealtimeManager.swift  # Realtime subscriptions
│   │   ├── Network/
│   │   │   └── NetworkMonitor.swift
│   │   └── Extensions/
│   ├── Features/
│   │   ├── Auth/
│   │   │   ├── Views/
│   │   │   │   ├── LoginView.swift
│   │   │   │   ├── RegisterView.swift
│   │   │   │   └── ForgotPasswordView.swift
│   │   │   └── ViewModels/
│   │   │       └── AuthViewModel.swift
│   │   ├── Home/
│   │   │   ├── Views/
│   │   │   └── ViewModels/
│   │   ├── Profile/
│   │   │   ├── Views/
│   │   │   └── ViewModels/
│   │   ├── Search/
│   │   ├── Notifications/
│   │   └── Settings/
│   ├── Shared/
│   │   ├── Components/             # Reusable SwiftUI views
│   │   ├── Models/                 # Data models
│   │   ├── Services/               # Service layer
│   │   └── Utilities/
│   ├── Resources/
│   │   ├── Assets.xcassets
│   │   ├── Localizable.strings
│   │   └── Info.plist
│   └── Configuration/
│       ├── Debug.xcconfig
│       └── Release.xcconfig
├── [AppName]Tests/
├── [AppName]UITests/
├── Supabase/
│   ├── migrations/
│   └── functions/
└── [AppName].xcodeproj
```

### Phase 5: PRD & Completion Plan Generation

The system auto-generates:

1. **Full PRD** — Problem, solution, user personas, features, technical architecture, success metrics
2. **Sprint Roadmap** — 2-week sprints from scaffold to App Store submission
3. **App-Specific Skill** — A new `/[app-slug]` slash command for ongoing development
4. **Agent Team** — Specialized agents for this specific app
5. **App Store Submission Plan** — Screenshots, descriptions, keywords, review guidelines compliance

---

## 4. Supabase MCP Integration

### Required Supabase MCP Operations

```yaml
Project Setup:
  - create_project: Create new Supabase project in organization
  - get_project: Retrieve project details and API keys
  - list_projects: List org projects to avoid duplicates

Database:
  - run_sql: Execute DDL/DML statements
    - CREATE TABLE with proper column types
    - CREATE INDEX for query performance
    - CREATE FUNCTION for triggers and RPC
    - CREATE POLICY for Row Level Security
    - ALTER PUBLICATION for realtime
  - list_tables: Verify table creation

Auth:
  - Configure email/password auth
  - Configure OAuth providers (Google, Apple, GitHub)
  - Set up email templates
  - Configure redirect URLs for deep linking

Storage:
  - create_bucket: Create storage buckets
  - Set bucket policies for public/private access

Edge Functions:
  - deploy_function: Deploy serverless functions
    - Push notification handler
    - Webhook processors
    - AI/ML integrations
    - Image processing

Realtime:
  - Enable realtime on specific tables
  - Configure broadcast channels
  - Set up presence tracking
```

### Standard Database Schema Templates

**User Management (always included):**
```sql
-- Profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Push Notifications (always included):**
```sql
CREATE TABLE public.push_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  platform TEXT CHECK (platform IN ('ios', 'android', 'web')),
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Notifications (always included):**
```sql
CREATE TABLE public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB DEFAULT '{}',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
```

---

## 5. Agent Team Architecture

### The Mobile App Factory Agent Team

Each generated app gets a **specialized team of 7 agents**:

```
┌─────────────────────────────────────────────────────────┐
│                 APP FACTORY AGENT TEAM                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. 🏗️  ARCHITECT AGENT                                 │
│     Role: System design, database schema, API design     │
│     Tools: Supabase MCP, GitHub MCP                      │
│     Outputs: Schema SQL, API specs, architecture docs    │
│                                                          │
│  2. 🎨  UI/UX AGENT                                     │
│     Role: Screen design, component library, navigation   │
│     Tools: Firecrawl (competitor scanning)                │
│     Outputs: Screen specs, component tree, style guide   │
│                                                          │
│  3. ⚡  FRONTEND AGENT                                   │
│     Role: React Native/Swift code generation              │
│     Tools: GitHub MCP, Context7                           │
│     Outputs: All screens, components, hooks, services    │
│                                                          │
│  4. 🔧  BACKEND AGENT                                   │
│     Role: Supabase config, edge functions, RLS           │
│     Tools: Supabase MCP                                  │
│     Outputs: Migrations, functions, policies, triggers   │
│                                                          │
│  5. 🧪  QA AGENT                                        │
│     Role: Test generation, validation, quality gates     │
│     Tools: Bash (test runners)                           │
│     Outputs: Test suites, coverage reports, bug reports  │
│                                                          │
│  6. 🚀  DEPLOYMENT AGENT                                │
│     Role: CI/CD, EAS Build, App Store submission          │
│     Tools: GitHub MCP, Bash                              │
│     Outputs: Build configs, store listings, screenshots  │
│                                                          │
│  7. 📋  PROJECT MANAGER AGENT                           │
│     Role: Sprint planning, progress tracking, reporting  │
│     Tools: TodoWrite, GitHub Issues                      │
│     Outputs: Sprint plans, status reports, blockers      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 6. App Store Readiness Checklist

### Pre-Submission Requirements

**Technical:**
- [ ] App loads in under 3 seconds
- [ ] All API calls have proper error handling
- [ ] Offline mode / graceful degradation
- [ ] Push notifications configured (APNs certificates)
- [ ] Deep linking configured
- [ ] Universal links (iOS) / App Links (Android)
- [ ] App Transport Security compliance
- [ ] Proper keychain storage for sensitive data
- [ ] Memory management — no leaks
- [ ] Background task handling

**Apple App Store Specific:**
- [ ] App icon (1024x1024)
- [ ] Launch screen / splash screen
- [ ] Screenshots for all required device sizes
- [ ] App Store description (4000 chars max)
- [ ] Keywords (100 chars max)
- [ ] Privacy policy URL
- [ ] Support URL
- [ ] App Store category selected
- [ ] Age rating questionnaire completed
- [ ] In-app purchase configuration (if applicable)
- [ ] Sign in with Apple (required if other social logins exist)
- [ ] App Review Guidelines compliance check
- [ ] Data collection disclosure (App Privacy)
- [ ] TestFlight beta testing completed

**Supabase Backend:**
- [ ] RLS enabled on ALL tables
- [ ] No exposed service_role keys in client code
- [ ] Rate limiting on edge functions
- [ ] Database backups configured
- [ ] Connection pooling enabled (for production)
- [ ] Custom domain configured (optional)
- [ ] Email templates customized
- [ ] Auth redirect URLs configured for production
- [ ] Storage bucket policies reviewed
- [ ] Realtime quotas checked

---

## 7. Sprint Roadmap Template

### Standard 8-Sprint (16-Week) App Development Plan

**Sprint 0 (Week 0): Foundation** ← *Handled by /mobile-app-generator*
- Supabase project creation
- Repository setup from template
- Database schema deployment
- Auth configuration
- Storage bucket creation
- CI/CD pipeline setup

**Sprint 1 (Weeks 1-2): Core Auth & Navigation**
- Login / Register / Forgot Password screens
- Social auth (Google, Apple)
- Protected route navigation
- Tab bar / main navigation structure
- Profile setup flow

**Sprint 2 (Weeks 3-4): Core Feature #1**
- Primary feature screens
- CRUD operations
- Supabase integration
- Realtime subscriptions
- Basic UI polish

**Sprint 3 (Weeks 5-6): Core Feature #2 + Realtime**
- Secondary feature screens
- Realtime updates
- Optimistic UI updates
- Error handling
- Loading states

**Sprint 4 (Weeks 7-8): Social & Notifications**
- Push notification system
- In-app notifications
- User-to-user interactions
- Activity feed
- Sharing functionality

**Sprint 5 (Weeks 9-10): Polish & Performance**
- UI/UX refinement
- Performance optimization
- Image optimization
- Caching strategy
- Accessibility (a11y)

**Sprint 6 (Weeks 11-12): Monetization & Analytics**
- In-app purchases / subscriptions (RevenueCat)
- Analytics integration
- Crash reporting (Sentry)
- A/B testing setup
- User engagement tracking

**Sprint 7 (Weeks 13-14): Testing & QA**
- Unit tests (80%+ coverage)
- Integration tests
- E2E tests (Detox / XCUITest)
- Beta testing (TestFlight)
- Bug fixes from beta feedback

**Sprint 8 (Weeks 15-16): Launch**
- App Store assets preparation
- Store listing optimization (ASO)
- Privacy policy & terms of service
- App review submission
- Launch marketing materials
- Post-launch monitoring setup

---

## 8. Generated Artifacts Per App

When `/mobile-app-generator` runs, it creates:

```
[app-slug]/
├── README.md                              # Project overview
├── PRD.md                                 # Full Product Requirements Document
├── SPRINT_PLAN.md                         # 8-sprint development roadmap
├── ARCHITECTURE.md                        # Technical architecture doc
├── APP_STORE_CHECKLIST.md                 # Pre-submission checklist
│
├── .claude/
│   ├── commands/
│   │   └── [app-slug]-dev.md              # App-specific dev slash command
│   └── skills/
│       └── [app-slug]-generator/
│           └── SKILL.md                   # App-specific skill
│
├── agents/
│   ├── architect.md                       # Architect agent prompt
│   ├── ui-ux.md                           # UI/UX agent prompt
│   ├── frontend.md                        # Frontend agent prompt
│   ├── backend.md                         # Backend agent prompt
│   ├── qa.md                              # QA agent prompt
│   ├── deployment.md                      # Deployment agent prompt
│   └── project-manager.md                 # PM agent prompt
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_profiles.sql
│   │   ├── 002_[feature].sql
│   │   └── ...
│   ├── functions/
│   │   ├── push-notification/
│   │   └── [custom-functions]/
│   └── config.toml
│
└── [app-code]/                            # The actual app source code
    ├── (Expo structure or Swift structure)
    └── ...
```

---

## 9. Success Metrics

The Mobile App Generator is successful when:

1. **Time to scaffold**: < 10 minutes from idea to working project with Supabase backend
2. **Completeness**: Generated app has auth, navigation, and core CRUD working immediately
3. **App Store readiness**: Clear path from scaffold to submission with checklist
4. **Developer experience**: Single slash command, no manual configuration
5. **Reusability**: Each generated app gets its own slash command for ongoing development

---

## 10. Future Enhancements

- **Android-specific**: Separate Kotlin/Jetpack Compose templates
- **Web companion**: Auto-generate Next.js admin dashboard
- **AI features**: Built-in AI chat, image generation, content moderation
- **Analytics dashboard**: Real-time app metrics via Supabase + Netlify
- **Multi-tenant**: Generate SaaS apps with tenant isolation
- **White-label**: Generate white-label app variants from a single codebase
