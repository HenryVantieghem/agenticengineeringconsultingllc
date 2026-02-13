# Auth Patterns — Compound Knowledge Base

> Accumulated patterns from building mobile apps with Supabase Auth
> Updated: 2026-02-13

---

## Pattern 1: Session-First Architecture

**Problem:** Apps that check auth state on every screen cause flickering and redundant API calls.

**Solution:** Single auth check at app root, then propagate session via Context (Expo) or Environment (Swift).

### Expo Implementation
```typescript
// app/_layout.tsx
export default function RootLayout() {
  const { session, loading } = useAuth();

  if (loading) return <SplashScreen />;

  return (
    <AuthContext.Provider value={{ session }}>
      <Stack>
        {session ? (
          <Stack.Screen name="(tabs)" />
        ) : (
          <Stack.Screen name="(auth)" />
        )}
      </Stack>
    </AuthContext.Provider>
  );
}
```

### Swift Implementation
```swift
@main
struct MyApp: App {
    @State private var authManager = AuthManager(client: CompositionRoot.shared.supabase)

    var body: some Scene {
        WindowGroup {
            Group {
                if authManager.isLoading {
                    SplashView()
                } else if authManager.isAuthenticated {
                    MainTabView()
                } else {
                    AuthView()
                }
            }
            .task { await authManager.initialize() }
        }
    }
}
```

---

## Pattern 2: Secure Token Storage

**Problem:** AsyncStorage is not encrypted. Tokens stored there can be extracted on jailbroken devices.

**Solution:** Use expo-secure-store (Expo) or Keychain (Swift) for token storage.

### Expo Implementation
```typescript
import * as SecureStore from 'expo-secure-store';

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

---

## Pattern 3: Auto-Create Profile on Signup

**Problem:** Users sign up but have no profile row, causing null errors on profile screens.

**Solution:** Database trigger that auto-creates a profile row on auth.users INSERT.

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Pattern 4: Apple Sign In (Required for iOS)

**Problem:** Apple requires Sign In with Apple if you offer any other social login.

**Solution:** Always include Apple Sign In. Configure both Supabase and Apple Developer Console.

### Key Steps:
1. Enable Apple provider in Supabase Auth settings
2. Configure Services ID in Apple Developer Console
3. Set redirect URL to `https://[project-ref].supabase.co/auth/v1/callback`
4. Use `expo-apple-authentication` (Expo) or `AuthenticationServices` (Swift)

---

## Pattern 5: Deep Link Auth Callbacks

**Problem:** OAuth flows open a browser, but the user doesn't return to the app.

**Solution:** Configure deep links properly for auth callbacks.

### Expo (app.json):
```json
{
  "expo": {
    "scheme": "myapp",
    "ios": {
      "bundleIdentifier": "com.company.myapp",
      "associatedDomains": ["applinks:myapp.com"]
    }
  }
}
```

### Swift (Info.plist):
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>
```
