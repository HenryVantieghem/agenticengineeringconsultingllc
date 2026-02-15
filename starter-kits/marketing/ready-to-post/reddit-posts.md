# Reddit Posts — ExpoLaunch & SwiftLaunch

> 2 ready-to-post Reddit posts
> Genuine, helpful tone. Not salesy. Share the "why" and technical decisions.

---

## Post 1: r/reactnative

**Title:** I made a production-ready Expo + Supabase starter kit (15+ screens, auth, payments, real-time, push)

**Body:**

Hey everyone,

I've been building React Native apps for a while now, and I kept running into the same problem: every new project starts with the same 200+ hours of boilerplate before I can write a single line of actual app logic.

Auth screens (email, Apple, Google). Onboarding carousel. Paywall. Profile with avatar upload. Settings with theme toggle. Push notification setup. Real-time data subscriptions. Error boundaries. Loading skeletons. Navigation scaffolding.

Every. Single. Time.

So I finally built a proper starter kit and figured I'd share it with the community.

**What's in it:**

- 15+ screens (onboarding, auth, home feed, profile, settings, paywall, notifications, search, detail view, create/edit, error states, empty states, loading states)
- Expo SDK 52+ with Expo Router (file-based routing)
- Supabase for backend (auth, PostgreSQL, storage, realtime, edge functions)
- RevenueCat for in-app purchases and subscriptions
- NativeWind for styling (Tailwind CSS in RN)
- Zustand for state management
- Full TypeScript throughout
- Dark mode / light mode with system detection
- Push notifications via Expo Notifications
- Haptic feedback
- Pull-to-refresh with optimistic updates
- Supabase migrations included (tables, RLS policies)
- ESLint + Prettier configured
- CI/CD with EAS Build
- App Store + Play Store ready metadata

**Stack decisions and why:**

- **Expo over bare RN**: Expo SDK 52 is genuinely great now. EAS Build handles native modules. There's almost no reason to eject anymore.
- **Supabase over Firebase**: I prefer PostgreSQL and SQL over Firestore for most use cases. Supabase's realtime, auth, and storage all work through one SDK. Plus, RLS means your security logic lives in the database, not scattered through your app code.
- **RevenueCat over raw StoreKit/Billing**: RevenueCat handles both platforms, does receipt validation server-side, and gives you a dashboard. For cross-platform apps, it's the right call.
- **NativeWind over StyleSheet**: Controversial, I know. But NativeWind v4 with Tailwind CSS utility classes is genuinely productive once you're used to it. One className string vs. a separate StyleSheet object.
- **Zustand over Redux/Context**: Minimal API, no boilerplate, good TypeScript support. For most apps, it's all you need.

**Setup time is about 15 minutes:**

1. Clone repo
2. Create Supabase project
3. Run migrations
4. Add env vars
5. `npx expo start`

It's $149 one-time (not a subscription). You get full source code via private GitHub repo access and can use it for unlimited projects.

I also built a SwiftUI version (SwiftLaunch) for anyone doing native iOS — same concept but with SwiftUI + StoreKit 2 + @Observable.

Landing page with full feature lists: https://agenticengineering.netlify.app/starter-kits.html

Happy to answer any questions about the architecture, stack choices, or specific implementations. Feedback welcome too — I'm actively maintaining both kits.

---

## Post 2: r/iOSProgramming

**Title:** Built a SwiftUI + Supabase starter kit — 15+ screens, StoreKit 2, WidgetKit, @Observable, async/await

**Body:**

Hey r/iOSProgramming,

I wanted to share a SwiftUI starter kit I've been working on. It came out of frustration with rebuilding the same infrastructure for every new app.

The core idea: every iOS app needs auth, payments, push, settings, and profile screens. That's easily 150-200 hours of work before you write a single line of your actual app logic. This kit eliminates that phase.

**Tech stack:**

- SwiftUI targeting iOS 18+
- MVVM with @Observable macro (Swift 5.9+)
- Supabase Swift SDK (auth, database, storage, realtime)
- StoreKit 2 for subscriptions and one-time purchases
- NavigationStack with type-safe routing
- APNs for push notifications
- WidgetKit integration with deep linking
- async/await throughout (no Combine for async work)

**Screens included (15+):**

- Onboarding (animated TabView carousel)
- Sign In / Sign Up / Forgot Password
- Home feed with real-time data
- Profile with PhotosPicker avatar
- Settings (system integration, haptics toggle)
- Paywall with StoreKit 2 subscription flow
- Notification center
- Searchable list with debounce
- Detail view with hero animations
- Create/Edit form with validation
- WidgetKit widget with timeline provider
- Loading, error, and empty states

**Why these architecture decisions:**

- **@Observable over ObservableObject**: Fewer property wrappers, better performance, cleaner code. If you're targeting iOS 17+ anyway, there's no reason to use the old pattern.
- **Supabase over Firebase/CloudKit**: I want PostgreSQL with proper relational data modeling. Supabase's Swift SDK is well-maintained, and RLS policies mean security lives in the database. CloudKit is great for iCloud sync but not for multi-user app backends.
- **StoreKit 2 over RevenueCat**: For iOS-only apps, StoreKit 2 is the right choice. Native API, no third-party dependency, Apple handles receipt validation. The API is clean and modern — Product, Transaction, and EntitlementInfo are well-designed.
- **async/await over Combine**: For network calls and async operations, structured concurrency is simpler and more readable. I still use Combine for reactive UI bindings where it makes sense, but the template defaults to async/await.
- **WidgetKit included**: Most templates skip this, but widgets are a legitimate retention and engagement feature. The template includes a timeline widget with deep linking back into the app.

**What I tried to get right:**

- RLS policies on every Supabase table (not just "trust the client")
- Proper error handling with retry-capable error views
- Shimmer loading states (not just spinners)
- SwiftLint configured and enforced
- Xcode Cloud CI/CD ready
- App Store submission metadata templates

**Setup:**

1. Clone repo
2. Create Supabase project
3. Run migrations
4. Add Supabase URL + anon key to Config.swift
5. Open .xcodeproj and run

It's $149 one-time. Full source code, private GitHub repo, unlimited projects. I also have a React Native version (ExpoLaunch) for anyone doing cross-platform.

Full details: https://agenticengineering.netlify.app/starter-kits.html

I'd genuinely appreciate feedback on the architecture decisions. Also happy to answer questions about any of the implementations — the StoreKit 2 flow and WidgetKit setup are the parts I'm most proud of.
