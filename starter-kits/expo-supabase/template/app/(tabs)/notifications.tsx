import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";
import { COLORS } from "@/lib/constants";
import type { Notification } from "@/lib/types";

/**
 * Notification center displaying the user's notifications.
 * Supports pull-to-refresh and marking individual notifications as read.
 */
export default function NotificationsScreen() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const fetchNotifications = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      setNotifications(data);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Real-time subscription for new notifications
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel("notifications-feed")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  }, [fetchNotifications]);

  const markAsRead = useCallback(async (id: string) => {
    // Optimistic update
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", id);
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false);
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

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
            Notifications
          </Text>
        </View>
        <View style={{ gap: 16, paddingHorizontal: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={{ flexDirection: "row", gap: 12 }}>
              <Skeleton width={40} height={40} borderRadius={20} />
              <View style={{ flex: 1, gap: 8 }}>
                <Skeleton width="80%" height={14} />
                <Skeleton width="50%" height={12} />
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 24,
              paddingBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: colors.text,
              }}
            >
              Notifications
            </Text>
            {unreadCount > 0 && (
              <TouchableOpacity onPress={markAllAsRead}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "600",
                    color: COLORS.brand[500],
                  }}
                >
                  Mark all read
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => markAsRead(item.id)}
            activeOpacity={0.7}
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              paddingHorizontal: 16,
              paddingVertical: 14,
              gap: 12,
              backgroundColor: item.read
                ? "transparent"
                : isDark
                  ? "rgba(99, 102, 241, 0.08)"
                  : "rgba(99, 102, 241, 0.04)",
            }}
          >
            {/* Unread indicator */}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: isDark ? "#1e1b4b" : "#eef2ff",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="notifications"
                size={18}
                color={COLORS.brand[500]}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: item.read ? "400" : "600",
                  color: colors.text,
                  marginBottom: 2,
                }}
              >
                {item.title}
              </Text>
              {item.body && (
                <Text
                  style={{
                    fontSize: 14,
                    color: colors.muted,
                    lineHeight: 20,
                  }}
                  numberOfLines={2}
                >
                  {item.body}
                </Text>
              )}
              <Text
                style={{
                  fontSize: 12,
                  color: colors.muted,
                  marginTop: 4,
                }}
              >
                {formatNotificationTime(item.created_at)}
              </Text>
            </View>

            {!item.read && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: COLORS.brand[500],
                  marginTop: 6,
                }}
              />
            )}
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => (
          <View
            style={{
              height: 0.5,
              backgroundColor: colors.border,
              marginLeft: 68,
            }}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="notifications-off-outline"
            title="No notifications"
            description="You're all caught up. New notifications will appear here."
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

function formatNotificationTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60_000);
  const diffHr = Math.floor(diffMs / 3_600_000);
  const diffDay = Math.floor(diffMs / 86_400_000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(timestamp).toLocaleDateString();
}
