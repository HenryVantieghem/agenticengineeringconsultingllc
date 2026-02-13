# Starter Kit Department

> Pre-built mobile app templates with AI, auth, payments, and real-time features.
> Sold as digital products via Stripe + delivered via private GitHub repo access.

## Products

### 1. ExpoLaunch — React Native Expo + Supabase Starter Kit
- **Price:** $149
- **Tech:** Expo SDK 52+, Supabase (auth, db, storage, realtime), RevenueCat (IAP)
- **Includes:** Auth flow, onboarding, push notifications, in-app purchases, analytics, dark mode, 15+ screens

### 2. SwiftLaunch — SwiftUI + Supabase Starter Kit
- **Price:** $149
- **Tech:** SwiftUI (iOS 18+), Supabase Swift SDK, StoreKit 2, CloudKit
- **Includes:** Auth flow, onboarding, push notifications, subscriptions, widgets, 15+ screens

## Architecture
```
starter-kits/
├── README.md                    # This file
├── expo-supabase/               # ExpoLaunch template
│   ├── PRODUCT.md               # Product spec, features, pricing
│   ├── template/                # The actual template code
│   │   ├── app/                 # Expo Router file-based routing
│   │   ├── components/          # Reusable UI components
│   │   ├── lib/                 # Supabase client, helpers
│   │   ├── hooks/               # Custom React hooks
│   │   ├── constants/           # Theme, config
│   │   ├── assets/              # Icons, images
│   │   ├── supabase/            # Migrations, seed data
│   │   ├── app.json             # Expo config
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── docs/                    # Setup guide, customization
├── swiftui-supabase/            # SwiftLaunch template
│   ├── PRODUCT.md               # Product spec, features, pricing
│   ├── template/                # The actual template code
│   │   ├── App/                 # Main app entry
│   │   ├── Views/               # SwiftUI views
│   │   ├── ViewModels/          # MVVM view models
│   │   ├── Models/              # Data models
│   │   ├── Services/            # Supabase, StoreKit, Push
│   │   ├── Components/          # Reusable UI components
│   │   ├── Resources/           # Assets, colors
│   │   └── Package.swift
│   └── docs/                    # Setup guide, customization
└── shared-assets/               # Landing page assets, screenshots
    ├── mockups/                 # Device mockups for marketing
    └── screenshots/             # App screenshots
```

## Distribution Model
1. Customer buys via Stripe Payment Link ($149)
2. Stripe webhook triggers email with GitHub repo invite
3. Customer gets private repo access (read-only)
4. Template includes detailed README + video walkthrough link

## Stripe Payment Links
- ExpoLaunch: TBD (create via Stripe dashboard or API)
- SwiftLaunch: TBD (create via Stripe dashboard or API)
