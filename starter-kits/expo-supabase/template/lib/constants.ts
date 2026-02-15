import { Dimensions, Platform } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get("window");

/**
 * App configuration constants.
 * Update these values to customize the template for your app.
 */
export const APP_CONFIG = {
  name: "ExpoLaunch",
  scheme: "expolaunch",
  version: "1.0.0",
  supportEmail: "support@yourapp.com",
  privacyUrl: "https://yourapp.com/privacy",
  termsUrl: "https://yourapp.com/terms",
} as const;

/** Layout dimensions */
export const LAYOUT = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,
  padding: 16,
  paddingLarge: 24,
  borderRadius: 12,
  borderRadiusLarge: 16,
  tabBarHeight: Platform.OS === "ios" ? 88 : 64,
  headerHeight: Platform.OS === "ios" ? 96 : 56,
} as const;

/** Brand colors matching tailwind.config.js */
export const COLORS = {
  brand: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
  },
  light: {
    background: "#ffffff",
    surface: "#f8fafc",
    card: "#f8fafc",
    text: "#0f172a",
    textSecondary: "#64748b",
    border: "#e2e8f0",
    muted: "#64748b",
  },
  dark: {
    background: "#0a0a0a",
    surface: "#0a0a0a",
    card: "#171717",
    text: "#fafafa",
    textSecondary: "#a1a1aa",
    border: "#262626",
    muted: "#a1a1aa",
  },
} as const;

/** Typography scale */
export const TYPOGRAPHY = {
  largeTitle: { fontSize: 34, lineHeight: 41 },
  title1: { fontSize: 28, lineHeight: 34 },
  title2: { fontSize: 22, lineHeight: 28 },
  title3: { fontSize: 20, lineHeight: 25 },
  headline: { fontSize: 17, lineHeight: 22 },
  body: { fontSize: 17, lineHeight: 22 },
  callout: { fontSize: 16, lineHeight: 21 },
  subhead: { fontSize: 15, lineHeight: 20 },
  footnote: { fontSize: 13, lineHeight: 18 },
  caption1: { fontSize: 12, lineHeight: 16 },
  caption2: { fontSize: 11, lineHeight: 13 },
} as const;

/** Animation timing constants */
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

/** Supabase storage bucket names */
export const STORAGE_BUCKETS = {
  avatars: "avatars",
  postImages: "post-images",
} as const;

/** RevenueCat entitlement and offering identifiers */
export const REVENUECAT = {
  entitlementId: "premium",
  offeringId: "default",
} as const;
