import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/hooks/useStore";
import { supabase } from "@/lib/supabase";
import { COLORS } from "@/lib/constants";

import "../global.css";

// Prevent splash screen from auto-hiding until fonts are loaded
SplashScreen.preventAutoHideAsync();

/**
 * Root layout handles:
 * 1. Font loading + splash screen dismissal
 * 2. Auth state observation + route protection
 * 3. User profile fetching
 * 4. Theme-aware status bar and navigation
 */
export default function RootLayout() {
  const { session, initialized } = useAuth();
  const setProfile = useStore((s) => s.setProfile);
  const theme = useStore((s) => s.theme);
  const systemColorScheme = useColorScheme();
  const router = useRouter();
  const segments = useSegments();

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("@/assets/fonts/Inter-Regular.ttf"),
    "Inter-Medium": require("@/assets/fonts/Inter-Medium.ttf"),
    "Inter-SemiBold": require("@/assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("@/assets/fonts/Inter-Bold.ttf"),
  });

  // Resolve effective theme
  const effectiveTheme =
    theme === "system" ? systemColorScheme ?? "light" : theme;
  const isDark = effectiveTheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  // Hide splash screen once fonts are loaded and auth is initialized
  useEffect(() => {
    if (fontsLoaded && initialized) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialized]);

  // Route protection: redirect based on auth state
  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!session && !inAuthGroup) {
      // Not signed in and not on an auth screen -> redirect to sign-in
      router.replace("/(auth)/sign-in");
    } else if (session && inAuthGroup) {
      // Signed in but still on auth screen -> redirect to home
      router.replace("/(tabs)");
    }
  }, [session, initialized, segments, router]);

  // Fetch user profile when session changes
  useEffect(() => {
    if (!session?.user) {
      setProfile(null);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (!error && data) {
        setProfile(data);
      }
    };

    fetchProfile();
  }, [session?.user, setProfile]);

  if (!fontsLoaded || !initialized) {
    return null;
  }

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: true,
            title: "Settings",
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            presentation: "modal",
          }}
        />
        <Stack.Screen
          name="paywall"
          options={{
            presentation: "modal",
          }}
        />
      </Stack>
    </>
  );
}
