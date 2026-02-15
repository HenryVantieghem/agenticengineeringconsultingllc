---
title: "How to Ship a Production-Ready React Native App in 2 Hours with Expo + Supabase [2026]"
published: true
tags: reactnative, expo, supabase, mobile
canonical_url: https://agenticengineering.netlify.app/starter-kits.html
cover_image: # Add a cover image URL before publishing
---

# How to Ship a Production-Ready React Native App in 2 Hours with Expo + Supabase [2026]

Every React Native project starts the same way.

You set up Expo. You configure navigation. You build an auth flow. You add a profile screen. You integrate payments. You wire up push notifications. You handle dark mode. You create loading states. You design error boundaries.

And then — maybe 200 hours later — you finally start building the thing you actually wanted to build.

I got tired of this cycle. So I built a starter kit that eliminates the entire boilerplate phase and lets you go from `git clone` to a production-ready app in about 2 hours.

This article walks through the architecture, shows the key code patterns, and compares the "build from scratch" timeline against using a pre-built template.

## The Stack

Here is what the ExpoLaunch starter kit runs on:

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | React Native + Expo SDK 52+ | Expo handles native modules, builds, and OTA updates. No ejecting needed. |
| Routing | Expo Router | File-based routing (like Next.js for React Native). Type-safe. |
| Backend | Supabase | PostgreSQL, Auth, Storage, Realtime, Edge Functions — one SDK. |
| Payments | RevenueCat | Handles App Store + Play Store subscriptions and IAP. |
| Styling | NativeWind v4 | Tailwind CSS utility classes in React Native. |
| State | Zustand | Minimal, no-boilerplate state management. |
| Language | TypeScript | Full type safety throughout the entire codebase. |

Every technology in this stack is actively maintained, gaining adoption, and well-documented in 2026. Nothing is deprecated. Nothing is a "might get replaced" gamble.

## Authentication: The Foundation

The starter kit's auth flow uses Supabase Auth with email/password, Apple, and Google sign-in.

Here is the simplified auth hook pattern:

```typescript
// hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInWithApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  return { session, user, loading, signInWithEmail, signInWithApple, signOut };
}
```

This hook handles session persistence, token refresh, and auth state changes throughout the app. The starter kit wraps this with protected routes in Expo Router:

```typescript
// app/(auth)/_layout.tsx
import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AuthLayout() {
  const { session, loading } = useAuth();

  if (loading) return <LoadingScreen />;
  if (session) return <Redirect href="/(tabs)" />;

  return <Stack screenOptions={{ headerShown: false }} />;
}
```

No session? Show auth screens. Valid session? Redirect to the app. Loading? Show a skeleton. Three states, handled cleanly.

## Real-Time Data: Live Updates Without Polling

One of the most powerful parts of the Supabase integration is real-time subscriptions. The starter kit includes a pattern for subscribing to database changes:

```typescript
// hooks/useRealtimePosts.ts
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Post } from '@/types';

export function useRealtimePosts() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Initial fetch
    const fetchPosts = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setPosts(data);
    };

    fetchPosts();

    // Subscribe to changes
    const channel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'posts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPosts((prev) => [payload.new as Post, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPosts((prev) =>
              prev.map((p) =>
                p.id === (payload.new as Post).id ? (payload.new as Post) : p
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPosts((prev) =>
              prev.filter((p) => p.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return posts;
}
```

This gives you live data updates across all connected clients without any polling, WebSocket management, or conflict resolution code. The database change happens, every client sees it instantly.

## Row-Level Security: Security That Actually Works

The Supabase migrations included in ExpoLaunch set up proper RLS policies:

```sql
-- supabase/migrations/002_rls_policies.sql

-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Posts are readable by everyone, writable only by the author
CREATE POLICY "Posts are publicly readable"
  ON posts FOR SELECT
  USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (auth.uid() = user_id);
```

Security lives in the database, not scattered through your app code. Every table in the starter kit has RLS enabled with appropriate policies.

## The Build-From-Scratch vs. Starter Kit Comparison

Here is a realistic time comparison for building a production-ready app:

| Task | From Scratch | With ExpoLaunch |
|------|-------------|-----------------|
| Project setup + navigation | 8 hours | 0 (included) |
| Auth flow (email + social) | 20 hours | 0 (included) |
| Onboarding carousel | 8 hours | 0 (included) |
| Profile with avatar upload | 12 hours | 0 (included) |
| Settings screen | 6 hours | 0 (included) |
| Payment integration | 24 hours | 0 (included) |
| Push notification setup | 16 hours | 0 (included) |
| Real-time data layer | 16 hours | 0 (included) |
| Dark mode implementation | 8 hours | 0 (included) |
| Loading / error / empty states | 12 hours | 0 (included) |
| Database schema + RLS | 12 hours | 0 (included) |
| CI/CD pipeline | 8 hours | 0 (included) |
| TypeScript config + linting | 4 hours | 0 (included) |
| Theme + customization | 8 hours | 2 hours |
| **Your actual app features** | **40 hours** | **40 hours** |
| **Total** | **202 hours** | **42 hours** |

That is a 160-hour difference. At even a modest $50/hour rate, the starter kit pays for itself 80 times over.

But the time savings is not even the main benefit. The real value is that every hour you spend is focused on what makes your app unique — not on infrastructure that every app needs.

## What 15 Minutes of Setup Looks Like

Here is the actual setup process:

**Step 1: Clone and install**

```bash
git clone <your-private-repo-url> my-app
cd my-app
npm install
```

**Step 2: Create Supabase project**

Go to [supabase.com](https://supabase.com), create a new project, and copy your project URL and anon key.

**Step 3: Run migrations**

```bash
npx supabase db push
```

This creates all tables, RLS policies, and seed data.

**Step 4: Configure environment**

```bash
cp .env.example .env
# Add your Supabase URL, anon key, and RevenueCat API key
```

**Step 5: Run**

```bash
npx expo start
```

Scan the QR code with Expo Go. Your app is running with a full backend.

## The Screens

ExpoLaunch ships with 15+ screens, each with dark mode variants, loading states, and error handling:

1. **Onboarding** — 3-step animated carousel with skip button and progress indicators
2. **Sign In** — Email/password with Apple and Google OAuth buttons
3. **Sign Up** — With email verification and input validation
4. **Forgot Password** — Reset flow via magic link
5. **Home Feed** — Real-time data list with pull-to-refresh
6. **Profile** — Avatar upload via Supabase Storage, editable fields
7. **Settings** — Theme toggle, notification preferences, account management
8. **Paywall** — RevenueCat subscription screen with feature comparison
9. **Notifications** — In-app notification center with read/unread states
10. **Search** — Debounced search with highlighted results
11. **Detail View** — Dynamic content page with hero image
12. **Create/Edit** — Form with validation, image picker, and Supabase insert/update
13. **Loading States** — Skeleton screens that match the layout of each view
14. **Error States** — Friendly error messages with retry buttons
15. **Empty States** — Illustrated screens for zero-data scenarios

Every screen uses the centralized theme system, so changing the entire app's look is a matter of editing one config file.

## Who Is This For?

**Indie hackers and solo developers**: You have limited time. Every hour matters. Stop spending 80% of your dev time on boilerplate.

**Agencies**: You need to spin up client apps fast. This template gives your team a consistent, production-quality starting point for every project.

**CTOs and tech leads**: You are evaluating build-vs-buy for your MVP. This is the "build" option that lets your team skip straight to feature development.

**Developers learning React Native**: The codebase follows modern best practices. It is a better learning resource than most tutorials because it shows production patterns, not simplified examples.

## What You Get

- Private GitHub repo access (full source code, no obfuscation)
- Detailed README and setup guide
- Supabase migrations and seed data
- CI/CD configuration for EAS Build
- App Store and Play Store metadata templates
- One-time purchase: $149 (no subscription, no per-project licensing)
- Unlimited projects — build as many apps as you want

## The SwiftUI Alternative

If you are building for iOS only, I also built **SwiftLaunch** — the same concept but for native Swift:

- SwiftUI (iOS 18+) with @Observable macro
- Supabase Swift SDK
- StoreKit 2 (native subscriptions, no third-party dependency)
- WidgetKit integration
- async/await throughout
- MVVM architecture

Same price, same deal: $149, full source code, unlimited projects.

---

Both kits are available at: [https://agenticengineering.netlify.app/starter-kits.html](https://agenticengineering.netlify.app/starter-kits.html)

Questions? Drop a comment below or reach out at henry@agenticengineering.com.

Stop rebuilding the same 15 screens. Start building your app.
