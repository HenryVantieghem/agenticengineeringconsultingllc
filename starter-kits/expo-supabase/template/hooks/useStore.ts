import { create } from "zustand";
import type { Profile } from "@/lib/types";

type ThemeMode = "light" | "dark" | "system";

interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  marketingEnabled: boolean;
}

interface AppState {
  /** Current user profile from the profiles table */
  profile: Profile | null;
  /** Theme preference: light, dark, or follow system */
  theme: ThemeMode;
  /** Notification preference toggles */
  notifications: NotificationPreferences;
  /** Whether the user has completed onboarding */
  hasOnboarded: boolean;
}

interface AppActions {
  setProfile: (profile: Profile | null) => void;
  updateProfile: (updates: Partial<Profile>) => void;
  setTheme: (theme: ThemeMode) => void;
  setNotificationPreference: (
    key: keyof NotificationPreferences,
    value: boolean
  ) => void;
  setHasOnboarded: (value: boolean) => void;
  reset: () => void;
}

const initialState: AppState = {
  profile: null,
  theme: "system",
  notifications: {
    pushEnabled: true,
    emailEnabled: true,
    marketingEnabled: false,
  },
  hasOnboarded: false,
};

/**
 * Global app state managed by Zustand.
 * Stores user profile, theme preference, and notification settings.
 *
 * Usage:
 *   const profile = useStore((s) => s.profile);
 *   const setTheme = useStore((s) => s.setTheme);
 */
export const useStore = create<AppState & AppActions>((set) => ({
  ...initialState,

  setProfile: (profile) => set({ profile }),

  updateProfile: (updates) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updates } : null,
    })),

  setTheme: (theme) => set({ theme }),

  setNotificationPreference: (key, value) =>
    set((state) => ({
      notifications: { ...state.notifications, [key]: value },
    })),

  setHasOnboarded: (hasOnboarded) => set({ hasOnboarded }),

  reset: () => set(initialState),
}));
