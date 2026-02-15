import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "./Avatar";
import { COLORS } from "@/lib/constants";
import type { PostWithProfile } from "@/lib/types";

interface PostCardProps {
  /** Post data with joined profile */
  post: PostWithProfile;
  /** Callback when user taps the like button */
  onLike?: (postId: string) => void;
  /** Callback when user taps the post to view details */
  onPress?: (postId: string) => void;
}

/**
 * Feed post card displaying author info, content, optional image, and like count.
 * Supports haptic feedback on like interaction.
 */
export function PostCard({ post, onLike, onPress }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const handleLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLiked((prev) => !prev);
    onLike?.(post.id);
  }, [post.id, onLike]);

  const handlePress = useCallback(() => {
    onPress?.(post.id);
  }, [post.id, onPress]);

  const timeAgo = formatTimeAgo(post.created_at);

  const initials = post.profiles?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={{
        backgroundColor: isDark ? COLORS.dark.card : COLORS.light.card,
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      {/* Author row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Avatar
          url={post.profiles?.avatar_url ?? null}
          size={40}
          fallback={initials}
        />
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "600",
              color: colors.text,
            }}
          >
            {post.profiles?.full_name || post.profiles?.username || "User"}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: colors.muted,
              marginTop: 1,
            }}
          >
            {timeAgo}
          </Text>
        </View>
      </View>

      {/* Content */}
      <Text
        style={{
          fontSize: 16,
          lineHeight: 22,
          color: colors.text,
          marginBottom: post.image_url ? 12 : 4,
        }}
      >
        {post.content}
      </Text>

      {/* Optional image */}
      {post.image_url && (
        <Image
          source={{ uri: post.image_url }}
          style={{
            width: "100%",
            height: 200,
            borderRadius: 12,
            marginBottom: 12,
          }}
          contentFit="cover"
          transition={200}
        />
      )}

      {/* Actions row */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          onPress={handleLike}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={20}
            color={liked ? "#ef4444" : colors.muted}
          />
          <Text
            style={{
              fontSize: 14,
              color: colors.muted,
            }}
          >
            {post.likes_count + (liked ? 1 : 0)}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

/** Format a timestamp string into a human-readable relative time (e.g. "2h ago") */
function formatTimeAgo(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
