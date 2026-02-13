# Swift Native iOS + Supabase — Template Registry

> Curated template database for Swift/SwiftUI mobile apps with Supabase backend
> Last updated: 2026-02-13

---

## Official SDK & Libraries

### 1. supabase/supabase-swift (Official SDK)
- **Repo:** https://github.com/supabase/supabase-swift
- **Package:** Swift Package Manager
- **Platforms:** iOS 13+, macOS 10.15+, tvOS 13+, watchOS 6+, visionOS 1+
- **Modules:**
  - `Auth` — Authentication (email, social, magic link, phone)
  - `PostgREST` — Database queries (CRUD, filters, joins)
  - `Realtime` — WebSocket subscriptions (postgres_changes, broadcast, presence)
  - `Storage` — File upload/download/management
  - `Functions` — Edge function invocation
  - `Supabase` — All-in-one package
- **Rating:** Essential (required for all Swift + Supabase apps)

### 2. supabase-community/realtime-swift
- **Repo:** https://github.com/supabase-community/realtime-swift
- **Purpose:** Dedicated realtime subscription client
- **Features:** Channel-based subscriptions, presence tracking, broadcast
- **Note:** Now bundled in supabase-swift, use standalone only for custom setups

### 3. supabase-community/storage-swift
- **Repo:** https://github.com/supabase-community/storage-swift
- **Purpose:** Dedicated storage client
- **Features:** Upload, download, list, delete files; bucket management
- **Note:** Now bundled in supabase-swift

---

## Project Templates & Scaffolding Tools

### 4. proSamik/ios-app-with-widget (WidgetKit + SwiftData)
- **Repo:** https://github.com/proSamik/ios-app-with-widget
- **License:** Open Source
- **Type:** Complete iOS app with Home Screen Widget
- **Stack:** SwiftUI, SwiftData, WidgetKit, App Groups
- **Features:**
  - Text editor for composing and saving content
  - History/archive with chronological viewing
  - Swipe-to-delete management
  - Home Screen widget with live data
  - Widget navigation (browse items via arrows)
  - Timestamp display per entry
  - App Groups for app-widget data synchronization
  - SharedModelContainer singleton for bidirectional data sync
  - @Model annotations with SwiftData macros
  - Tab-based navigation (Write/History)
- **Architecture:**
  - Shared data model with SwiftData @Model
  - SharedModelContainer singleton for persistence
  - Reusable components (QuoteDisplayView)
  - Widget timeline provider for updates
  - App Group container for cross-target data
- **Best For:** Any app that needs Home Screen widgets, content-based apps, journaling apps, productivity apps
- **Why Important:** WidgetKit is a massive ASO advantage — apps with widgets get more home screen visibility and higher retention. This is the reference implementation for app-widget data sharing patterns.
- **Rating:** A-Tier (best WidgetKit reference for Swift + SwiftData)

### 5. shurutech/iOSKickstart
- **Repo:** https://github.com/shurutech/iOSKickstart
- **License:** Open Source
- **Type:** CLI-based SwiftUI app generator
- **Generated Flows:**
  - Splash screen
  - Authorization (Login/SignUp)
  - User Details
  - Terms & Conditions
  - Onboarding carousel
  - Main tab screens
- **Auth Support:** Supabase (planned), Auth0, custom API
- **Best For:** Quickly scaffolding new iOS apps with standard flows
- **Rating:** B-Tier (Supabase auth still in development)

### 5. SwiftAI Boilerplate Pro (Paid)
- **URL:** https://www.swiftaiboilerplate.com/
- **License:** Commercial
- **Stack:** SwiftUI, Supabase, RevenueCat, SwiftData
- **Features:**
  - MVVM architecture with CompositionRoot DI
  - Protocol-oriented with swappable implementations
  - 11 modular Swift packages
  - Streaming AI chat infrastructure
  - Supabase Auth
  - RevenueCat subscriptions
  - Push notifications
  - SwiftData local persistence
- **Best For:** AI-powered iOS apps, production SaaS
- **Rating:** A-Tier (best production-ready option, but paid)

---

## Official Tutorials & Guides

### 6. Supabase SwiftUI Quickstart
- **URL:** https://supabase.com/docs/guides/getting-started/quickstarts/ios-swiftui
- **Covers:**
  - Project setup with Swift Package Manager
  - Basic database queries
  - Deep linking configuration
  - Custom URL schemes for auth callbacks
- **Best For:** Getting started, understanding the basics

### 7. Supabase Swift User Management Tutorial
- **URL:** https://supabase.com/docs/guides/getting-started/tutorials/with-swift
- **Covers:**
  - Full auth flow (login, signup, session management)
  - Profile management with database
  - Avatar upload with Storage
  - AppView routing (auth vs authenticated)
- **Best For:** Building complete user management

### 8. Supabase Swift API Reference
- **URL:** https://supabase.com/docs/reference/swift/introduction
- **Covers:** Complete API documentation for all Swift SDK modules
- **Best For:** Reference during development

---

## Architecture Patterns for Swift + Supabase

### Recommended Architecture: MVVM + Service Layer

```
┌─────────────────────────────────────────┐
│                  Views                   │
│  (SwiftUI Views — declarative UI)       │
├─────────────────────────────────────────┤
│               ViewModels                 │
│  (@Observable — state + business logic) │
├─────────────────────────────────────────┤
│               Services                   │
│  (Protocol-based — Supabase operations) │
├─────────────────────────────────────────┤
│            Supabase Client               │
│  (Single instance — configured once)     │
└─────────────────────────────────────────┘
```

### Key Swift Patterns

**Dependency Injection (CompositionRoot):**
```swift
@MainActor
final class CompositionRoot {
    static let shared = CompositionRoot()

    let supabase: SupabaseClient
    let authService: AuthServiceProtocol
    let databaseService: DatabaseServiceProtocol
    let storageService: StorageServiceProtocol

    private init() {
        supabase = SupabaseClient(
            supabaseURL: URL(string: Config.supabaseURL)!,
            supabaseKey: Config.supabaseAnonKey
        )
        authService = SupabaseAuthService(client: supabase)
        databaseService = SupabaseDatabaseService(client: supabase)
        storageService = SupabaseStorageService(client: supabase)
    }
}
```

**Auth State Management:**
```swift
@Observable
final class AuthManager {
    private(set) var session: Session?
    private(set) var isAuthenticated = false

    private let client: SupabaseClient

    init(client: SupabaseClient) {
        self.client = client
    }

    func initialize() async {
        session = try? await client.auth.session
        isAuthenticated = session != nil

        for await (event, session) in client.auth.authStateChanges {
            self.session = session
            self.isAuthenticated = session != nil
        }
    }
}
```

**Realtime Subscriptions:**
```swift
@Observable
final class RealtimeManager {
    private let client: SupabaseClient
    private var channel: RealtimeChannelV2?

    func subscribeToChanges(
        table: String,
        onInsert: @escaping (any Decodable) -> Void
    ) async {
        channel = client.realtimeV2.channel("db-changes")

        let changes = channel?.postgresChange(
            InsertAction.self,
            schema: "public",
            table: table
        )

        await channel?.subscribe()

        if let changes {
            for await change in changes {
                onInsert(change.record)
            }
        }
    }
}
```

---

## Standard Swift Project Structure (Generated by Mobile App Factory)

```
[AppName]/
├── App/
│   ├── [AppName]App.swift              # @main entry
│   ├── CompositionRoot.swift           # Dependency injection
│   └── Config.swift                    # Environment config
├── Core/
│   ├── Supabase/
│   │   ├── SupabaseConfig.swift        # Client setup
│   │   ├── AuthService.swift           # Auth operations
│   │   ├── DatabaseService.swift       # DB operations
│   │   ├── StorageService.swift        # File operations
│   │   └── RealtimeService.swift       # Realtime subs
│   ├── Protocols/
│   │   ├── AuthServiceProtocol.swift
│   │   ├── DatabaseServiceProtocol.swift
│   │   └── StorageServiceProtocol.swift
│   ├── Extensions/
│   │   ├── View+Extensions.swift
│   │   ├── Date+Extensions.swift
│   │   └── Color+Extensions.swift
│   └── Utilities/
│       ├── Logger.swift
│       ├── KeychainHelper.swift
│       └── NetworkMonitor.swift
├── Features/
│   ├── Auth/
│   │   ├── Views/
│   │   │   ├── LoginView.swift
│   │   │   ├── RegisterView.swift
│   │   │   ├── ForgotPasswordView.swift
│   │   │   └── SocialAuthButtons.swift
│   │   └── ViewModels/
│   │       └── AuthViewModel.swift
│   ├── Home/
│   │   ├── Views/
│   │   │   ├── HomeView.swift
│   │   │   └── [Feature]CardView.swift
│   │   └── ViewModels/
│   │       └── HomeViewModel.swift
│   ├── Profile/
│   │   ├── Views/
│   │   │   ├── ProfileView.swift
│   │   │   ├── EditProfileView.swift
│   │   │   └── AvatarPickerView.swift
│   │   └── ViewModels/
│   │       └── ProfileViewModel.swift
│   ├── Settings/
│   │   ├── Views/
│   │   │   └── SettingsView.swift
│   │   └── ViewModels/
│   │       └── SettingsViewModel.swift
│   └── [CustomFeature]/
│       ├── Views/
│       └── ViewModels/
├── Shared/
│   ├── Components/
│   │   ├── PrimaryButton.swift
│   │   ├── SecondaryButton.swift
│   │   ├── TextFieldStyled.swift
│   │   ├── LoadingView.swift
│   │   ├── EmptyStateView.swift
│   │   ├── ErrorStateView.swift
│   │   └── AvatarView.swift
│   ├── Models/
│   │   ├── Profile.swift
│   │   ├── [Feature]Model.swift
│   │   └── AppError.swift
│   └── Theme/
│       ├── AppTheme.swift
│       ├── AppColors.swift
│       └── AppTypography.swift
├── Resources/
│   ├── Assets.xcassets/
│   ├── Localizable.xcstrings
│   └── Info.plist
└── Tests/
    ├── [AppName]Tests/
    │   ├── ViewModelTests/
    │   └── ServiceTests/
    └── [AppName]UITests/
```

---

## Swift + Supabase Feature Matrix

| Feature | SDK Support | Complexity | Notes |
|---------|------------|------------|-------|
| Email/Password Auth | Full | Low | Built-in |
| Magic Link Auth | Full | Low | Requires deep link setup |
| Apple Sign In | Full | Medium | Requires Apple Developer |
| Google Sign In | Full | Medium | Requires Firebase config |
| Database CRUD | Full | Low | Type-safe with Codable |
| Realtime Subscriptions | Full | Medium | async/await streams |
| File Upload/Download | Full | Low | Storage API |
| Edge Functions | Full | Low | invoke() method |
| Push Notifications | Partial | High | Need APNs setup + edge function |
| Offline Mode | Manual | High | Combine with SwiftData |
| Deep Linking | Manual | Medium | URL schemes + Universal Links |
