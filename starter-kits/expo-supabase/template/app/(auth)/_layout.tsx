import { Stack } from "expo-router";
import { useColorScheme } from "react-native";
import { COLORS } from "@/lib/constants";

/**
 * Auth group layout.
 * Renders a plain stack navigator with no tab bar.
 * All auth screens (sign-in, sign-up, forgot-password) live here.
 */
export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
