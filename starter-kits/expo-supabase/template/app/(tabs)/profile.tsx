import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { useStore } from "@/hooks/useStore";
import { supabase } from "@/lib/supabase";
import { Avatar } from "@/components/Avatar";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { COLORS } from "@/lib/constants";

/**
 * Profile screen with editable avatar, user details, and stats.
 * Includes a link to Settings and profile save functionality.
 */
export default function ProfileScreen() {
  const { user } = useAuth();
  const profile = useStore((s) => s.profile);
  const updateProfile = useStore((s) => s.updateProfile);
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [username, setUsername] = useState(profile?.username ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");

  const handleAvatarUpload = useCallback(
    async (url: string) => {
      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: url, updated_at: new Date().toISOString() })
        .eq("id", user.id);

      if (!error) {
        updateProfile({ avatar_url: url });
      } else {
        Alert.alert("Error", "Failed to update avatar.");
      }
    },
    [user, updateProfile]
  );

  const handleSave = useCallback(async () => {
    if (!user) return;

    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim() || null,
        username: username.trim() || null,
        bio: bio.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      if (error.code === "23505") {
        Alert.alert("Username Taken", "That username is already in use.");
      } else {
        Alert.alert("Error", "Failed to update profile.");
      }
      return;
    }

    updateProfile({
      full_name: fullName.trim() || null,
      username: username.trim() || null,
      bio: bio.trim() || null,
    });
    setEditing(false);
  }, [user, fullName, username, bio, updateProfile]);

  const initials = profile?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with settings button */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 16,
          }}
        >
          <Text
            style={{ fontSize: 28, fontWeight: "700", color: colors.text }}
          >
            Profile
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/settings")}
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isDark ? "#171717" : "#f1f5f9",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="settings-outline" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={{ alignItems: "center", marginBottom: 24 }}>
          <Avatar
            url={profile?.avatar_url ?? null}
            size={96}
            editable
            onUpload={handleAvatarUpload}
            fallback={initials}
          />
          <Text
            style={{
              fontSize: 22,
              fontWeight: "600",
              color: colors.text,
              marginTop: 12,
            }}
          >
            {profile?.full_name || "Your Name"}
          </Text>
          {profile?.username && (
            <Text
              style={{
                fontSize: 15,
                color: colors.muted,
                marginTop: 2,
              }}
            >
              @{profile.username}
            </Text>
          )}
        </View>

        {/* Stats row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 32,
            marginBottom: 32,
            paddingHorizontal: 24,
          }}
        >
          {[
            { label: "Posts", value: "0" },
            { label: "Likes", value: "0" },
            { label: "Joined", value: formatJoinDate(profile?.created_at) },
          ].map((stat) => (
            <View key={stat.label} style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: colors.text,
                }}
              >
                {stat.value}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.muted,
                  marginTop: 2,
                }}
              >
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Bio */}
        {!editing && profile?.bio && (
          <View style={{ paddingHorizontal: 24, marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 15,
                lineHeight: 22,
                color: colors.text,
                textAlign: "center",
              }}
            >
              {profile.bio}
            </Text>
          </View>
        )}

        {/* Edit form or edit button */}
        <View style={{ paddingHorizontal: 24 }}>
          {editing ? (
            <View style={{ gap: 16 }}>
              <Input
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Your full name"
              />
              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="your_username"
                autoCapitalize="none"
              />
              <Input
                label="Bio"
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={3}
                style={{ minHeight: 80, textAlignVertical: "top" }}
              />
              <View style={{ flexDirection: "row", gap: 12, marginTop: 8 }}>
                <Button
                  title="Cancel"
                  variant="ghost"
                  onPress={() => {
                    setEditing(false);
                    setFullName(profile?.full_name ?? "");
                    setUsername(profile?.username ?? "");
                    setBio(profile?.bio ?? "");
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Save"
                  loading={saving}
                  onPress={handleSave}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ) : (
            <Button
              title="Edit Profile"
              variant="secondary"
              onPress={() => setEditing(true)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatJoinDate(timestamp: string | undefined): string {
  if (!timestamp) return "N/A";
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}
