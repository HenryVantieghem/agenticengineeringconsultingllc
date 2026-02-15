import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme,
} from "react-native";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { COLORS, APP_CONFIG } from "@/lib/constants";

/**
 * Sign in screen with email/password form and social auth options.
 */
export default function SignInScreen() {
  const { signIn, signInWithApple, signInWithGoogle, loading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;
    try {
      await signIn(email, password);
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
        {/* Header */}
        <View style={{ alignItems: "center", marginBottom: 40 }}>
          <View
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              backgroundColor: COLORS.brand[500],
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="rocket" size={32} color="#ffffff" />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: colors.text,
              marginBottom: 6,
            }}
          >
            Welcome back
          </Text>
          <Text style={{ fontSize: 16, color: colors.muted }}>
            Sign in to {APP_CONFIG.name}
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16, marginBottom: 24 }}>
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            textContentType="password"
          />
        </View>

        {/* Forgot password */}
        <Link href="/(auth)/forgot-password" asChild>
          <TouchableOpacity style={{ alignSelf: "flex-end", marginBottom: 24 }}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: COLORS.brand[500],
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        </Link>

        {/* Sign in button */}
        <Button
          title="Sign In"
          loading={loading}
          onPress={handleSignIn}
          style={{ marginBottom: 20 }}
        />

        {/* Divider */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <View
            style={{ flex: 1, height: 1, backgroundColor: colors.border }}
          />
          <Text
            style={{
              marginHorizontal: 16,
              fontSize: 13,
              color: colors.muted,
            }}
          >
            or continue with
          </Text>
          <View
            style={{ flex: 1, height: 1, backgroundColor: colors.border }}
          />
        </View>

        {/* Social auth buttons */}
        <View style={{ flexDirection: "row", gap: 12, marginBottom: 32 }}>
          <TouchableOpacity
            onPress={signInWithApple}
            disabled={loading}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: colors.border,
              backgroundColor: isDark ? "#171717" : "#ffffff",
            }}
          >
            <Ionicons name="logo-apple" size={20} color={colors.text} />
            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>
              Apple
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={signInWithGoogle}
            disabled={loading}
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              paddingVertical: 14,
              borderRadius: 12,
              borderWidth: 1.5,
              borderColor: colors.border,
              backgroundColor: isDark ? "#171717" : "#ffffff",
            }}
          >
            <Ionicons name="logo-google" size={20} color={colors.text} />
            <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>
              Google
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 15, color: colors.muted }}>
            Don't have an account?
          </Text>
          <Link href="/(auth)/sign-up" asChild>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: COLORS.brand[500],
                }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
