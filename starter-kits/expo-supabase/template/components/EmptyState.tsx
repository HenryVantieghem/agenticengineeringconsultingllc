import React from "react";
import { View, Text, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "./Button";
import { COLORS } from "@/lib/constants";

interface EmptyStateProps {
  /** Icon name from Ionicons */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Main heading */
  title: string;
  /** Supporting description text */
  description?: string;
  /** Optional action button label */
  actionTitle?: string;
  /** Callback when the action button is pressed */
  onAction?: () => void;
}

/**
 * Empty state component for screens with no data.
 * Displays an icon, title, description, and optional action button.
 */
export function EmptyState({
  icon = "file-tray-outline",
  title,
  description,
  actionTitle,
  onAction,
}: EmptyStateProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        paddingVertical: 60,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: isDark ? "#1e1b4b" : "#eef2ff",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Ionicons name={icon} size={36} color={COLORS.brand[500]} />
      </View>

      <Text
        style={{
          fontSize: 20,
          fontWeight: "600",
          color: colors.text,
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        {title}
      </Text>

      {description && (
        <Text
          style={{
            fontSize: 15,
            color: colors.muted,
            textAlign: "center",
            lineHeight: 21,
            marginBottom: 24,
          }}
        >
          {description}
        </Text>
      )}

      {actionTitle && onAction && (
        <Button
          title={actionTitle}
          variant="primary"
          size="md"
          onPress={onAction}
        />
      )}
    </View>
  );
}
