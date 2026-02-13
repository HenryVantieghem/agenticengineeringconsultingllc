# ExpoLaunch — React Native Expo + Supabase Starter Kit

> Ship your app in days, not months. Production-ready React Native template with auth, payments, real-time data, and 15+ polished screens.

## Price: $149 (one-time)

## Tech Stack
- **Framework:** React Native + Expo SDK 52+
- **Routing:** Expo Router (file-based)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Realtime, Edge Functions)
- **Payments:** RevenueCat (in-app purchases + subscriptions)
- **State:** Zustand
- **Styling:** NativeWind (Tailwind for React Native)
- **TypeScript:** Full type safety throughout
- **Push:** Expo Notifications
- **Analytics:** PostHog or Mixpanel (pluggable)

## Included Screens (15+)
1. **Onboarding** — 3-step animated carousel with skip
2. **Sign In** — Email/password + Apple + Google OAuth
3. **Sign Up** — With email verification flow
4. **Forgot Password** — Reset via email link
5. **Home / Feed** — Real-time data with pull-to-refresh
6. **Profile** — Avatar upload, edit details, stats
7. **Settings** — Theme toggle, notifications, account management
8. **Paywall** — RevenueCat-powered subscription screen
9. **Notifications** — In-app notification center
10. **Search** — Debounced search with results
11. **Detail View** — Dynamic content page
12. **Create/Edit** — Form with validation + image upload
13. **Loading States** — Skeleton screens throughout
14. **Error States** — Friendly error boundaries
15. **Empty States** — Illustrated empty state screens

## Features
- [x] Email + Social Auth (Apple, Google)
- [x] Row Level Security (RLS) policies
- [x] Real-time subscriptions
- [x] Image upload to Supabase Storage
- [x] In-app purchases + subscriptions (RevenueCat)
- [x] Push notifications (Expo)
- [x] Dark mode / Light mode
- [x] Haptic feedback
- [x] Pull-to-refresh
- [x] Offline-first with optimistic updates
- [x] TypeScript throughout
- [x] ESLint + Prettier configured
- [x] CI/CD with EAS Build
- [x] App Store + Play Store ready metadata
- [x] Supabase migrations included

## Supabase Schema
- `profiles` — User profiles with avatar_url
- `posts` — Example content table with RLS
- `notifications` — In-app notifications
- `subscriptions` — RevenueCat webhook sync

## Setup Time: ~15 minutes
1. Clone repo
2. Create Supabase project
3. Run migrations
4. Add environment variables
5. `npx expo start`
