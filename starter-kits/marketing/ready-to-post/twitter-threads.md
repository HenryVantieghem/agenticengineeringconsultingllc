# X/Twitter Threads — ExpoLaunch & SwiftLaunch

> 2 ready-to-post threads (each tweet under 280 chars)
> Copy-paste each tweet as a reply to the previous one.

---

## Thread 1: "I built an app in 2 hours using ExpoLaunch" (7 tweets)

### Tweet 1 (Hook)

I built a fully functional app in 2 hours.

Auth. Payments. Push notifications. Real-time data. Dark mode.

Not a prototype. A production-ready app.

Here's exactly how:

### Tweet 2

Hour 0:00 — Cloned the ExpoLaunch repo.

It's a React Native starter kit built on Expo + Supabase + RevenueCat.

15+ screens already built. Auth flows, onboarding, paywall, profile, settings — all there.

I ran `npx expo start` and had the app running on my phone in 3 minutes.

### Tweet 3

Hour 0:15 — Set up Supabase.

Created a new project, ran the included migrations, and pasted in my env vars.

Database tables, RLS policies, and auth config — all pre-built.

I had a working backend in under 10 minutes.

### Tweet 4

Hour 0:30 — Customized the theme.

Changed the accent color, updated the app name, swapped the onboarding copy.

NativeWind (Tailwind for RN) makes styling changes fast. One config file controls the whole look.

### Tweet 5

Hour 1:00 — Added my own feature.

Because auth, payments, navigation, and data fetching were already handled, I went straight to building my actual feature.

No boilerplate. No infrastructure work. Just my code.

### Tweet 6

Hour 2:00 — Ready to submit.

App Store metadata templates were included. EAS Build pipeline was pre-configured.

I triggered a build and started filling out the App Store Connect form.

Two hours from clone to submission.

### Tweet 7 (CTA)

ExpoLaunch is $149. One-time. Full source code.

There's also SwiftLaunch — same concept for native SwiftUI + StoreKit 2.

Stop rebuilding the same 15 screens. Start building YOUR app.

agenticengineering.netlify.app/starter-kits.html

---

## Thread 2: "The tech stack behind SwiftLaunch" (5 tweets)

### Tweet 1 (Hook)

I spent weeks choosing the perfect SwiftUI tech stack.

Here's every decision I made for SwiftLaunch — and why.

A thread for iOS devs who want to ship faster:

### Tweet 2

@Observable over ObservableObject.

Swift 5.9 gave us the @Observable macro. It's cleaner, fewer property wrappers, and better performance.

SwiftLaunch uses it everywhere. No more @Published. No more objectWillChange.

Combined with async/await, the entire codebase reads like pseudocode.

### Tweet 3

Supabase over Firebase.

Postgres > Firestore for relational data. SQL > NoSQL for most app use cases.

Supabase gives you auth, database, storage, realtime, and edge functions. One SDK. One dashboard. Row-level security built in.

The Swift SDK is official and well-maintained.

### Tweet 4

StoreKit 2 over RevenueCat (for native iOS).

If you're building iOS-only, StoreKit 2 is the move. Native API. No third-party dependency. Apple handles receipt validation.

SwiftLaunch includes the full subscription flow: paywall, purchase, restore, entitlements.

Plus WidgetKit integration — most templates skip this entirely.

### Tweet 5 (CTA)

SwiftLaunch ships with 15+ screens, MVVM architecture, full auth, StoreKit 2 payments, APNs push, dark mode, and Xcode Cloud CI/CD.

$149. One-time. You own the code. Unlimited projects.

See the full feature list: agenticengineering.netlify.app/starter-kits.html
