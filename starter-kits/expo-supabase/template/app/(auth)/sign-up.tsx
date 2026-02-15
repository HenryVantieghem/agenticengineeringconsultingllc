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
 * Sign up screen with email/password form, name field, and terms acceptance.
 */
export default function SignUpScreen() {
  const { signUp, loading } = useAuth();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    terms?: string;
  }>({});

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.fullName = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must accept the terms to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validate()) return;
    try {
      await signUp(email, password, fullName);
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
            <Ionicons name="person-add" size={32} color="#ffffff" />
          </View>
          <Text
            style={{
              fontSize: 28,
              fontWeight: "700",
              color: colors.text,
              marginBottom: 6,
            }}
          >
            Create account
          </Text>
          <Text style={{ fontSize: 16, color: colors.muted }}>
            Get started with {APP_CONFIG.name}
          </Text>
        </View>

        {/* Form */}
        <View style={{ gap: 16, marginBottom: 20 }}>
          <Input
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            error={errors.fullName}
            autoCapitalize="words"
            textContentType="name"
          />
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
            placeholder="8+ characters"
            value={password}
            onChangeText={setPassword}
            error={errors.password}
            secureTextEntry
            textContentType="newPassword"
          />
        </View>

        {/* Terms checkbox */}
        <TouchableOpacity
          onPress={() => setAgreedToTerms((prev) => !prev)}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 10,
            marginBottom: 8,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 6,
              borderWidth: 1.5,
              borderColor: errors.terms
                ? "#ef4444"
                : agreedToTerms
                  ? COLORS.brand[500]
                  : colors.border,
              backgroundColor: agreedToTerms ? COLORS.brand[500] : "transparent",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 1,
            }}
          >
            {agreedToTerms && (
              <Ionicons name="checkmark" size={14} color="#ffffff" />
            )}
          </View>
          <Text style={{ flex: 1, fontSize: 14, lineHeight: 20, color: colors.muted }}>
            I agree to the{" "}
            <Text style={{ color: COLORS.brand[500], fontWeight: "500" }}>
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text style={{ color: COLORS.brand[500], fontWeight: "500" }}>
              Privacy Policy
            </Text>
          </Text>
        </TouchableOpacity>
        {errors.terms && (
          <Text
            style={{ fontSize: 13, color: "#ef4444", marginBottom: 16 }}
          >
            {errors.terms}
          </Text>
        )}

        {/* Sign up button */}
        <Button
          title="Create Account"
          loading={loading}
          onPress={handleSignUp}
          style={{ marginTop: 8, marginBottom: 32 }}
        />

        {/* Sign in link */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 4,
          }}
        >
          <Text style={{ fontSize: 15, color: colors.muted }}>
            Already have an account?
          </Text>
          <Link href="/(auth)/sign-in" asChild>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "600",
                  color: COLORS.brand[500],
                }}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
