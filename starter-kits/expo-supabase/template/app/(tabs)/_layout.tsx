import { Tabs } from "expo-router";
import { Platform, useColorScheme } from "react-native";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { COLORS, LAYOUT } from "@/lib/constants";

type TabIconName = keyof typeof Ionicons.glyphMap;

interface TabConfig {
  name: string;
  title: string;
  iconFocused: TabIconName;
  iconDefault: TabIconName;
}

const tabs: TabConfig[] = [
  {
    name: "index",
    title: "Home",
    iconFocused: "home",
    iconDefault: "home-outline",
  },
  {
    name: "search",
    title: "Search",
    iconFocused: "search",
    iconDefault: "search-outline",
  },
  {
    name: "notifications",
    title: "Alerts",
    iconFocused: "notifications",
    iconDefault: "notifications-outline",
  },
  {
    name: "profile",
    title: "Profile",
    iconFocused: "person",
    iconDefault: "person-outline",
  },
];

/**
 * Tab navigator with custom styling and haptic feedback.
 * Tabs: Home, Search, Notifications, Profile.
 */
export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.brand[500],
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
          height: LAYOUT.tabBarHeight,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.iconDefault}
                size={size}
                color={color}
              />
            ),
          }}
          listeners={{
            tabPress: () => {
              if (Platform.OS !== "web") {
                Haptics.selectionAsync();
              }
            },
          }}
        />
      ))}
    </Tabs>
  );
}
