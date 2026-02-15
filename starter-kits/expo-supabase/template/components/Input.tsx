import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  type TextInputProps,
  type ViewStyle,
  useColorScheme,
} from "react-native";
import { COLORS } from "@/lib/constants";

interface InputProps extends TextInputProps {
  /** Label shown above the input */
  label?: string;
  /** Error message shown below the input */
  error?: string;
  /** Additional container styles */
  containerStyle?: ViewStyle;
}

/**
 * Reusable text input with label and error state.
 * Automatically adapts to dark/light theme.
 * Shows a colored border on focus and red border on error.
 */
export function Input({
  label,
  error,
  containerStyle,
  style,
  ...rest
}: InputProps) {
  const [focused, setFocused] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const colors = isDark ? COLORS.dark : COLORS.light;

  const borderColor = error
    ? "#ef4444"
    : focused
      ? COLORS.brand[500]
      : colors.border;

  return (
    <View style={[{ gap: 6 }, containerStyle]}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            color: colors.text,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        placeholderTextColor={colors.muted}
        onFocus={(e) => {
          setFocused(true);
          rest.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          rest.onBlur?.(e);
        }}
        style={[
          {
            backgroundColor: isDark ? "#171717" : "#f8fafc",
            borderWidth: 1.5,
            borderColor,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 14,
            fontSize: 16,
            color: colors.text,
          },
          style,
        ]}
        {...rest}
      />
      {error && (
        <Text style={{ fontSize: 13, color: "#ef4444" }}>{error}</Text>
      )}
    </View>
  );
}
