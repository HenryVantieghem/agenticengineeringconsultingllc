import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { PostCard } from "@/components/PostCard";
import { PostCardSkeleton } from "@/components/Skeleton";
import { EmptyState } from "@/components/EmptyState";
import { COLORS, APP_CONFIG } from "@/lib/constants";
import type { PostWithProfile } from "@/lib/types";

/**
 * Home / Feed screen.
 * Loads posts with real-time subscription, pull-to-refresh, and loading skeletons.
 */
export default function HomeScreen() {
  const [posts, setPosts] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const fetchPosts = useCallback(async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(username, full_name, avatar_url)")
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setPosts(data as PostWithProfile[]);
    }
    setLoading(false);
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Real-time subscription for new posts
  useEffect(() => {
    const channel = supabase
      .channel("posts-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        async (payload) => {
          // Fetch the new post with profile data
          const { data } = await supabase
            .from("posts")
            .select("*, profiles(username, full_name, avatar_url)")
            .eq("id", payload.new.id)
            .single();

          if (data) {
            setPosts((prev) => [data as PostWithProfile, ...prev]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        (payload) => {
          setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  const handleLike = useCallback(async (postId: string) => {
    // Optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, likes_count: p.likes_count + 1 } : p
      )
    );

    const { error } = await supabase.rpc("increment_likes", {
      post_id: postId,
    });

    if (error) {
      // Revert on failure
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, likes_count: p.likes_count - 1 } : p
        )
      );
    }
  }, []);

  // Loading state with skeletons
  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
        edges={["top"]}
      >
        <View style={{ padding: 24, paddingBottom: 16 }}>
          <Text
            style={{ fontSize: 28, fontWeight: "700", color: colors.text }}
          >
            {APP_CONFIG.name}
          </Text>
        </View>
        {Array.from({ length: 4 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PostCard post={item} onLike={handleLike} />
        )}
        ListHeaderComponent={
          <View style={{ padding: 24, paddingBottom: 16 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: colors.text,
              }}
            >
              {APP_CONFIG.name}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            icon="chatbubbles-outline"
            title="No posts yet"
            description="When people share something, it will show up here."
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.brand[500]}
          />
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
