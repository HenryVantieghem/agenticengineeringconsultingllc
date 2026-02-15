import { useState } from "react";
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { COLORS } from "@/lib/constants";

/**
 * Forgot password screen. Sends a password reset email via Supabase.
 */
export default function ForgotPasswordScreen() {
  const { resetPassword, loading } = useAuth();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Enter a valid email address");
      return;
    }

    setError("");
    try {
      await resetPassword(email);
      setSent(true);
    } catch {
      // Error is handled by useAuth via Alert
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingVertical: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back button */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            position: "absolute",
            top: 60,
            left: 24,
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isDark ? "#171717" : "#f1f5f9",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </TouchableOpacity>

        {sent ? (
          /* Success state */
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: "#dcfce7",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              <Ionicons name="mail-open" size={36} color="#16a34a" />
            </View>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "700",
                color: colors.text,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              Check your email
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: colors.muted,
                textAlign: "center",
                lineHeight: 24,
                marginBottom: 32,
                paddingHorizontal: 16,
              }}
            >
              We sent a password reset link to{"\n"}
              <Text style={{ fontWeight: "600", color: colors.text }}>
                {email}
              </Text>
            </Text>
            <Button
              title="Back to Sign In"
              variant="secondary"
              onPress={() => router.back()}
            />
          </View>
        ) : (
          /* Form state */
          <View>
            <View style={{ alignItems: "center", marginBottom: 32 }}>
              <View
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: 16,
                  backgroundColor: isDark ? "#1e1b4b" : "#eef2ff",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}
              >
                <Ionicons name="key" size={28} color={COLORS.brand[500]} />
              </View>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: "700",
                  color: colors.text,
                  marginBottom: 8,
                }}
              >
                Reset password
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  color: colors.muted,
                  textAlign: "center",
                  lineHeight: 21,
                }}
              >
                Enter your email and we'll send you a link to reset your
                password.
              </Text>
            </View>

            <Input
              label="Email"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              error={error}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              textContentType="emailAddress"
              containerStyle={{ marginBottom: 24 }}
            />

            <Button
              title="Send Reset Link"
              loading={loading}
              onPress={handleReset}
            />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
