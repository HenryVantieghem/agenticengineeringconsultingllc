import React, { useEffect, useRef } from "react";
import { Animated, type ViewStyle, useColorScheme } from "react-native";

interface SkeletonProps {
  /** Width of the skeleton element */
  width: number | `${number}%`;
  /** Height of the skeleton element */
  height: number;
  /** Border radius (defaults to 8) */
  borderRadius?: number;
  /** Additional styles */
  style?: ViewStyle;
}

/**
 * Animated loading skeleton placeholder.
 * Pulses between two shades to indicate content is loading.
 * Adapts automatically to dark/light theme.
 */
export function Skeleton({
  width,
  height,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: isDark ? "#262626" : "#e2e8f0",
          opacity,
        },
        style,
      ]}
    />
  );
}

/**
 * Pre-built skeleton layout for a post card.
 * Use this in FlatList while data is loading.
 */
export function PostCardSkeleton() {
  return (
    <Animated.View
      style={{
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 16,
        gap: 12,
      }}
    >
      {/* Author row */}
      <Animated.View
        style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
      >
        <Skeleton width={40} height={40} borderRadius={20} />
        <Animated.View style={{ gap: 6 }}>
          <Skeleton width={120} height={14} />
          <Skeleton width={80} height={12} />
        </Animated.View>
      </Animated.View>
      {/* Content lines */}
      <Skeleton width="100%" height={14} />
      <Skeleton width="80%" height={14} />
      <Skeleton width="60%" height={14} />
    </Animated.View>
  );
}
