# ExpoLaunch

> Ship your React Native app in days, not months. Production-ready starter kit with auth, payments, real-time data, and 15+ polished screens.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo SDK 52 |
| Routing | Expo Router (file-based) |
| Backend | Supabase (PostgreSQL, Auth, Storage, Realtime) |
| Payments | RevenueCat (in-app purchases + subscriptions) |
| State | Zustand |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Language | TypeScript (strict mode) |

## Quick Start

### Prerequisites

- Node.js 18+
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo`)
- A [Supabase](https://supabase.com) project (free tier works)
- A [RevenueCat](https://www.revenuecat.com) account (optional, for payments)

### 1. Install dependencies

```bash
npm install
```

### 2. Add fonts

Download [Inter](https://fonts.google.com/specimen/Inter) and place these files in `assets/fonts/`:

- `Inter-Regular.ttf`
- `Inter-Medium.ttf`
- `Inter-SemiBold.ttf`
- `Inter-Bold.ttf`

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your Supabase and RevenueCat credentials:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
EXPO_PUBLIC_REVENUECAT_API_KEY=your-revenuecat-api-key
```

### 4. Run the Supabase migration

1. Go to your Supabase Dashboard > SQL Editor
2. Copy the contents of `supabase/migrations/001_initial_schema.sql`
3. Paste and run

This creates tables, RLS policies, storage buckets, triggers, and enables realtime.

### 5. Start the app

```bash
npx expo start
```

Scan the QR code with Expo Go (iOS/Android) or press `i` for iOS Simulator / `a` for Android Emulator.

## Project Structure

```
app/
  _layout.tsx          # Root layout (auth provider, theme, fonts)
  (auth)/
    _layout.tsx        # Auth group layout
    sign-in.tsx        # Email/password + social auth
    sign-up.tsx        # Registration with terms
    forgot-password.tsx # Password reset flow
  (tabs)/
    _layout.tsx        # Tab navigator with haptics
    index.tsx          # Home feed (real-time)
    search.tsx         # Debounced search
    notifications.tsx  # Notification center
    profile.tsx        # Profile with avatar upload
  settings.tsx         # Theme, notifications, account
  paywall.tsx          # RevenueCat subscription screen

components/
  Avatar.tsx           # User avatar with upload
  Button.tsx           # Variants: primary, secondary, ghost, destructive
  EmptyState.tsx       # Empty state placeholder
  Input.tsx            # Text input with label + error
  PostCard.tsx         # Feed post card
  Skeleton.tsx         # Loading skeleton animations

hooks/
  useAuth.ts           # Auth state + actions (sign in, sign up, etc.)
  useStore.ts          # Zustand store (profile, theme, notifications)

lib/
  constants.ts         # Colors, typography, layout, app config
  supabase.ts          # Supabase client with secure storage
  types.ts             # Database type definitions

supabase/
  migrations/          # SQL migrations
  seed.sql             # Sample seed data
```

## Customization Guide

### Branding

1. **Colors** -- Edit `tailwind.config.js` and `lib/constants.ts` (the `brand` color scale and `COLORS` object)
2. **App name** -- Update `APP_CONFIG` in `lib/constants.ts` and `name`/`slug` in `app.json`
3. **Fonts** -- Replace the Inter font files in `assets/fonts/` and update `tailwind.config.js`
4. **App icon** -- Replace `assets/icon.png`, `assets/adaptive-icon.png`, and `assets/splash-icon.png`

### Adding a New Screen

1. Create a file in `app/` (Expo Router uses file-based routing)
2. The file name becomes the route (e.g., `app/about.tsx` -> `/about`)
3. For grouped routes, create a folder with `_layout.tsx`

### Adding a New Database Table

1. Add a new migration file in `supabase/migrations/`
2. Add TypeScript types in `lib/types.ts`
3. Enable RLS and create policies
4. Add to realtime publication if needed

### Changing the Tab Bar

Edit `app/(tabs)/_layout.tsx` to add, remove, or reorder tabs. Each tab maps to a file in the `(tabs)` directory.

## Supabase Setup

### Auth Providers

To enable Apple and Google sign-in:

1. **Supabase Dashboard** > Authentication > Providers
2. Enable Apple Sign-In (requires Apple Developer account)
3. Enable Google Sign-In (requires Google Cloud OAuth client)
4. Set the redirect URL to `expolaunch://auth/callback`

### Storage

The migration automatically creates two storage buckets:

- `avatars` -- Profile pictures (public)
- `post-images` -- Post attachments (public)

### Realtime

Realtime is enabled on `posts` and `notifications` tables. The home feed and notification center update automatically when new data is inserted.

## RevenueCat Setup

1. Create a project at [revenuecat.com](https://www.revenuecat.com)
2. Add your App Store / Play Store app
3. Create products and an offering named `default`
4. Add an entitlement named `premium`
5. Copy your API key to `.env` as `EXPO_PUBLIC_REVENUECAT_API_KEY`
6. Update identifiers in `lib/constants.ts` if you use different names

The paywall screen automatically fetches available packages from RevenueCat and handles the purchase flow.

## Building for Production

### EAS Build

```bash
# Install EAS CLI
npm install -g eas-cli

# Configure
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### App Store Submission

1. Update `app.json` with your actual bundle identifier and package name
2. Replace placeholder icons and splash screens in `assets/`
3. Set up your App Store Connect / Google Play Console listing
4. Run `eas submit` to upload your build

## Troubleshooting

### "Missing Supabase environment variables"

Make sure you copied `.env.example` to `.env` and filled in your Supabase URL and anon key.

### Fonts not loading

Verify that the four Inter `.ttf` files exist in `assets/fonts/`. Download them from [Google Fonts](https://fonts.google.com/specimen/Inter).

### RevenueCat offerings are empty

RevenueCat requires native builds (not Expo Go) to fetch real products. Use `npx expo run:ios` or EAS Build for testing purchases.

### Auth redirect not working

Make sure the `scheme` in `app.json` matches the redirect URL in your Supabase auth provider settings (`expolaunch://auth/callback`).

## License

This template is licensed for use in your own projects. You may not redistribute or resell the template itself.
