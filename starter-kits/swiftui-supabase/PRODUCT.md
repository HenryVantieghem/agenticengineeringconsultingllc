# SwiftLaunch — SwiftUI + Supabase Starter Kit

> Native iOS excellence, shipped fast. Production-ready SwiftUI template with auth, StoreKit 2 subscriptions, real-time data, and 15+ polished screens.

## Price: $149 (one-time)

## Tech Stack
- **Framework:** SwiftUI (iOS 18+)
- **Architecture:** MVVM with async/await
- **Backend:** Supabase Swift SDK (Auth, Database, Storage, Realtime)
- **Payments:** StoreKit 2 (native subscriptions)
- **State:** @Observable macro (Swift 5.9+)
- **Navigation:** NavigationStack with type-safe routing
- **Push:** APNs + Supabase Edge Functions
- **Analytics:** TelemetryDeck or PostHog (pluggable)
- **Widgets:** WidgetKit integration included

## Included Screens (15+)
1. **Onboarding** — Animated TabView carousel with skip
2. **Sign In** — Email/password + Sign in with Apple
3. **Sign Up** — With email verification
4. **Forgot Password** — Reset via deep link
5. **Home / Feed** — Real-time data with async refresh
6. **Profile** — PhotosPicker avatar, edit details
7. **Settings** — System settings integration, haptics toggle
8. **Paywall** — StoreKit 2 subscription view
9. **Notifications** — Push notification center
10. **Search** — Searchable modifier with debounce
11. **Detail View** — Dynamic content with hero animation
12. **Create/Edit** — Form with validation + camera/gallery
13. **Loading States** — Shimmer/placeholder views
14. **Error States** — Retry-capable error views
15. **Widget** — WidgetKit timeline with deep linking

## Features
- [x] Sign in with Apple + Email Auth
- [x] Row Level Security (RLS) policies
- [x] Real-time Supabase subscriptions
- [x] Image upload with PhotosPicker
- [x] StoreKit 2 subscriptions + one-time purchases
- [x] Push notifications (APNs)
- [x] Dark mode / Light mode (system + manual)
- [x] Haptic feedback (UIImpactFeedbackGenerator)
- [x] WidgetKit home screen widgets
- [x] @Observable macro for state management
- [x] Swift Concurrency (async/await throughout)
- [x] SwiftLint configured
- [x] Xcode Cloud CI/CD ready
- [x] App Store submission metadata
- [x] Supabase migrations included

## Supabase Schema
- `profiles` — User profiles with avatar_url
- `posts` — Example content table with RLS
- `notifications` — In-app notifications
- `subscriptions` — StoreKit 2 webhook sync

## Setup Time: ~15 minutes
1. Clone repo
2. Create Supabase project
3. Run migrations
4. Add Supabase URL + key to Config.swift
5. Open .xcodeproj → Run
