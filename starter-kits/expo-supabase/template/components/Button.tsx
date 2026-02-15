import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  type TouchableOpacityProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";

type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  /** Button label text */
  title: string;
  /** Visual variant */
  variant?: ButtonVariant;
  /** Button size */
  size?: ButtonSize;
  /** Show loading spinner and disable interaction */
  loading?: boolean;
  /** Trigger haptic feedback on press */
  haptic?: boolean;
  /** Additional container styles */
  style?: ViewStyle;
  /** Additional text styles */
  textStyle?: TextStyle;
}

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: "#6366f1",
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#6366f1",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  destructive: {
    backgroundColor: "#ef4444",
  },
};

const variantTextColors: Record<ButtonVariant, string> = {
  primary: "#ffffff",
  secondary: "#6366f1",
  ghost: "#6366f1",
  destructive: "#ffffff",
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 8 },
  md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 12 },
  lg: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16 },
};

const sizeTextStyles: Record<ButtonSize, TextStyle> = {
  sm: { fontSize: 14 },
  md: { fontSize: 16 },
  lg: { fontSize: 18 },
};

/**
 * Reusable button component with multiple variants and sizes.
 *
 * Variants: primary (filled), secondary (outlined), ghost (text only), destructive (red).
 * Includes optional haptic feedback and loading state.
 */
export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  haptic = true,
  disabled,
  style,
  textStyle,
  onPress,
  ...rest
}: ButtonProps) {
  const handlePress = (event: Parameters<NonNullable<typeof onPress>>[0]) => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(event);
  };

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isDisabled}
      onPress={handlePress}
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          gap: 8,
        },
        variantStyles[variant],
        sizeStyles[size],
        isDisabled && { opacity: 0.5 },
        style,
      ]}
      {...rest}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variantTextColors[variant]}
        />
      )}
      <Text
        style={[
          {
            color: variantTextColors[variant],
            fontWeight: "600",
            textAlign: "center",
          },
          sizeTextStyles[size],
          textStyle,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
