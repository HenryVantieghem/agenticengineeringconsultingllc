# SwiftLaunch

Production-ready SwiftUI + Supabase starter kit. Auth, real-time data, StoreKit 2 subscriptions, push notifications, and 15+ polished screens -- all wired up and ready to ship.

## Requirements

- Xcode 16+
- iOS 18+
- Swift 5.9+
- Supabase account (free tier works)
- Apple Developer account (for StoreKit & push notifications)

## Quick Start

### 1. Clone & Open

```bash
git clone <your-repo-url>
cd SwiftLaunch
open Package.swift
```

Xcode will resolve the Supabase Swift SDK dependency automatically.

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy your **Project URL** and **anon public key** from Settings > API

### 3. Run Database Migration

Open the SQL Editor in your Supabase dashboard and paste the contents of:

```
supabase/migrations/001_initial_schema.sql
```

This creates all tables, RLS policies, storage buckets, triggers, and realtime subscriptions.

### 4. Configure the App

Open `SwiftLaunch/Config.swift` and replace the placeholder values:

```swift
enum Config {
    static let supabaseURL = URL(string: "https://your-project.supabase.co")!
    static let supabaseAnonKey = "your-anon-key-here"
}
```

### 5. Enable Auth Providers

In your Supabase dashboard under Authentication > Providers:

- **Email:** Enabled by default
- **Apple:** Add your Apple Services ID and private key ([Supabase Apple guide](https://supabase.com/docs/guides/auth/social-login/auth-apple))

### 6. Configure StoreKit (Optional)

1. Create your subscription products in App Store Connect
2. Update the product IDs in `Config.swift`:

```swift
enum StoreKit {
    static let monthlyProductID = "com.yourapp.monthly"
    static let yearlyProductID = "com.yourapp.yearly"
    static let lifetimeProductID = "com.yourapp.lifetime"
}
```

3. For testing, use a StoreKit Configuration file in Xcode (Scheme > StoreKit Configuration)

### 7. Push Notifications (Optional)

1. Enable Push Notifications capability in Xcode
2. Upload your APNs key to Supabase (or your push provider)
3. The `AppDelegate` handles token registration automatically

### 8. Run

Select your target device and press **Cmd+R**.

## Project Structure

```
SwiftLaunch/
  SwiftLaunchApp.swift     # App entry point + AppDelegate
  Config.swift              # All configuration in one place

  Models/
    Profile.swift           # User profile model
    Post.swift              # Post/feed item model
    AppNotification.swift   # Notification model

  Services/
    SupabaseService.swift   # Supabase client singleton (auth, db, storage, realtime)
    StoreKitService.swift   # StoreKit 2 product loading, purchases, transactions
    NotificationService.swift # Push notification registration & handling

  ViewModels/
    AuthViewModel.swift     # Auth state, sign in/up/out, Apple sign in
    FeedViewModel.swift     # Posts CRUD, realtime subscription
    ProfileViewModel.swift  # Profile fetch/update, avatar upload
    NotificationViewModel.swift # Notification fetch, mark read, realtime
    StoreViewModel.swift    # Product display, purchase flow, restore

  Views/
    Auth/
      SignInView.swift      # Email + Apple sign in
      SignUpView.swift      # Registration with password strength
      ForgotPasswordView.swift # Password reset flow
    Onboarding/
      OnboardingView.swift  # 3-page animated onboarding
    Main/
      ContentView.swift     # Root router (onboarding -> auth -> app)
      MainTabView.swift     # 5-tab layout
    Feed/
      FeedView.swift        # Home feed with pull-to-refresh
      PostCardView.swift    # Post card component
      CreatePostView.swift  # New post with PhotosPicker
    Search/
      SearchView.swift      # User search with debounce
    Notifications/
      NotificationsView.swift # Notification center
    Profile/
      ProfileView.swift     # Profile with stats + posts grid
      EditProfileView.swift # Edit profile form
    Settings/
      SettingsView.swift    # Theme, notifications, account, about
    Paywall/
      PaywallView.swift     # Subscription plans + purchase

  Components/
    AvatarView.swift        # Reusable avatar with placeholder
    PrimaryButton.swift     # Button with loading state + variants
    ShimmerView.swift       # Loading skeleton animation
    EmptyStateView.swift    # Empty state with icon + CTA

  Resources/
    Theme.swift             # Colors, typography, spacing, shadows

supabase/
  migrations/
    001_initial_schema.sql  # Full database schema with RLS
```

## Architecture

**MVVM with @Observable** -- clean separation between views and business logic.

- **Models** are plain `Codable` structs with `CodingKeys` for snake_case mapping
- **Services** are singletons that wrap SDK calls (Supabase, StoreKit, notifications)
- **ViewModels** are `@Observable` classes injected via `.environment()`
- **Views** are purely declarative SwiftUI with no business logic

## Customization Guide

### Change the Color Scheme

Edit `SwiftLaunch/Resources/Theme.swift`:

```swift
enum Colors {
    static let primary = Color("AccentColor") // or any Color
    static let secondary = Color.purple
}
```

### Add a New Data Model

1. Create model in `Models/` with `Codable` + `CodingKeys`
2. Add table + RLS policies in a new migration file
3. Create ViewModel in `ViewModels/`
4. Build views in `Views/`

### Add a New Tab

Edit `MainTabView.swift` and add a new `Tab` entry:

```swift
Tab("New", systemImage: "star", value: 5) {
    YourNewView()
}
```

## Database Schema

| Table | Description | RLS |
|-------|-------------|-----|
| `profiles` | User profiles (auto-created on signup) | Public read, own write |
| `posts` | Feed posts with content + images | Public read, own write |
| `post_likes` | Like tracking (composite PK) | Public read, own write |
| `notifications` | In-app notifications | Own read/write only |
| `subscriptions` | StoreKit 2 sync records | Own read/write only |
| `device_tokens` | APNs tokens for push | Own read/write only |

## Storage Buckets

| Bucket | Public | Max Size | Types |
|--------|--------|----------|-------|
| `avatars` | Yes | 5 MB | JPEG, PNG, WebP |
| `post-images` | Yes | 10 MB | JPEG, PNG, WebP, GIF |

## License

This is a commercial product. See LICENSE for terms.
