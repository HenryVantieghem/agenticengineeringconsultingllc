import { View, Text, ScrollView, Switch, TouchableOpacity, Alert, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/hooks/useStore";
import { Button } from "@/components/Button";
import { COLORS, APP_CONFIG } from "@/lib/constants";
import * as Linking from "expo-linking";

type ThemeMode = "light" | "dark" | "system";

interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  trailing?: React.ReactNode;
  destructive?: boolean;
}

/**
 * Settings screen with theme toggle, notification preferences,
 * account management, and sign out.
 */
export default function SettingsScreen() {
  const { signOut, loading, user } = useAuth();
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const notifications = useStore((s) => s.notifications);
  const setNotificationPreference = useStore((s) => s.setNotificationPreference);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch {
            // Handled by useAuth
          }
        },
      },
    ]);
  };

  const handleUpgrade = () => {
    router.push("/paywall");
  };

  const themeOptions: { label: string; value: ThemeMode }[] = [
    { label: "Light", value: "light" },
    { label: "Dark", value: "dark" },
    { label: "System", value: "system" },
  ];

  const SettingsRow = ({
    icon,
    label,
    value,
    onPress,
    trailing,
    destructive,
  }: SettingsRowProps) => (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
        gap: 12,
      }}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          backgroundColor: destructive
            ? "rgba(239, 68, 68, 0.1)"
            : isDark
              ? "#1e1b4b"
              : "#eef2ff",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name={icon}
          size={18}
          color={destructive ? "#ef4444" : COLORS.brand[500]}
        />
      </View>
      <Text
        style={{
          flex: 1,
          fontSize: 16,
          color: destructive ? "#ef4444" : colors.text,
        }}
      >
        {label}
      </Text>
      {value && (
        <Text style={{ fontSize: 14, color: colors.muted }}>{value}</Text>
      )}
      {trailing}
      {onPress && !trailing && (
        <Ionicons name="chevron-forward" size={18} color={colors.muted} />
      )}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text
      style={{
        fontSize: 13,
        fontWeight: "600",
        color: colors.muted,
        textTransform: "uppercase",
        letterSpacing: 0.5,
        paddingHorizontal: 16,
        paddingTop: 24,
        paddingBottom: 8,
      }}
    >
      {title}
    </Text>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["bottom"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Upgrade banner */}
        <TouchableOpacity
          onPress={handleUpgrade}
          activeOpacity={0.8}
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            padding: 16,
            borderRadius: 16,
            backgroundColor: COLORS.brand[500],
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Ionicons name="diamond" size={24} color="#ffffff" />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#ffffff",
                  marginBottom: 2,
                }}
              >
                Upgrade to Premium
              </Text>
              <Text style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
                Unlock all features and remove limits.
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </View>
        </TouchableOpacity>

        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <View
          style={{
            marginHorizontal: 16,
            borderRadius: 12,
            backgroundColor: isDark ? "#171717" : "#f8fafc",
            overflow: "hidden",
          }}
        >
          <View style={{ padding: 16 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: colors.text,
                marginBottom: 12,
              }}
            >
              Theme
            </Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              {themeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => setTheme(option.value)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 8,
                    borderWidth: 1.5,
                    borderColor:
                      theme === option.value
                        ? COLORS.brand[500]
                        : colors.border,
                    backgroundColor:
                      theme === option.value
                        ? isDark
                          ? "rgba(99, 102, 241, 0.15)"
                          : "rgba(99, 102, 241, 0.08)"
                        : "transparent",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: theme === option.value ? "600" : "400",
                      color:
                        theme === option.value
                          ? COLORS.brand[500]
                          : colors.text,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View
          style={{
            marginHorizontal: 16,
            borderRadius: 12,
            backgroundColor: isDark ? "#171717" : "#f8fafc",
            overflow: "hidden",
          }}
        >
          <SettingsRow
            icon="notifications-outline"
            label="Push Notifications"
            trailing={
              <Switch
                value={notifications.pushEnabled}
                onValueChange={(v) =>
                  setNotificationPreference("pushEnabled", v)
                }
                trackColor={{
                  false: colors.border,
                  true: COLORS.brand[400],
                }}
                thumbColor="#ffffff"
              />
            }
          />
          <View
            style={{
              height: 0.5,
              backgroundColor: colors.border,
              marginLeft: 60,
            }}
          />
          <SettingsRow
            icon="mail-outline"
            label="Email Notifications"
            trailing={
              <Switch
                value={notifications.emailEnabled}
                onValueChange={(v) =>
                  setNotificationPreference("emailEnabled", v)
                }
                trackColor={{
                  false: colors.border,
                  true: COLORS.brand[400],
                }}
                thumbColor="#ffffff"
              />
            }
          />
        </View>

        {/* Account */}
        <SectionHeader title="Account" />
        <View
          style={{
            marginHorizontal: 16,
            borderRadius: 12,
            backgroundColor: isDark ? "#171717" : "#f8fafc",
            overflow: "hidden",
          }}
        >
          <SettingsRow
            icon="person-outline"
            label="Email"
            value={user?.email ?? ""}
          />
          <View
            style={{
              height: 0.5,
              backgroundColor: colors.border,
              marginLeft: 60,
            }}
          />
          <SettingsRow
            icon="shield-outline"
            label="Privacy Policy"
            onPress={() => Linking.openURL(APP_CONFIG.privacyUrl)}
          />
          <View
            style={{
              height: 0.5,
              backgroundColor: colors.border,
              marginLeft: 60,
            }}
          />
          <SettingsRow
            icon="document-text-outline"
            label="Terms of Service"
            onPress={() => Linking.openURL(APP_CONFIG.termsUrl)}
          />
        </View>

        {/* Danger zone */}
        <SectionHeader title="" />
        <View
          style={{
            marginHorizontal: 16,
            borderRadius: 12,
            backgroundColor: isDark ? "#171717" : "#f8fafc",
            overflow: "hidden",
          }}
        >
          <SettingsRow
            icon="log-out-outline"
            label="Sign Out"
            onPress={handleSignOut}
            destructive
          />
        </View>

        {/* App version */}
        <Text
          style={{
            textAlign: "center",
            fontSize: 13,
            color: colors.muted,
            marginTop: 24,
          }}
        >
          {APP_CONFIG.name} v{APP_CONFIG.version}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
