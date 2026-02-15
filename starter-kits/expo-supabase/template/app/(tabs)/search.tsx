import { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Input } from "@/components/Input";
import { PostCard } from "@/components/PostCard";
import { EmptyState } from "@/components/EmptyState";
import { supabase } from "@/lib/supabase";
import { COLORS } from "@/lib/constants";
import type { PostWithProfile } from "@/lib/types";

const DEBOUNCE_MS = 400;

/**
 * Search screen with debounced full-text search against posts.
 */
export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PostWithProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const colors = isDark ? COLORS.dark : COLORS.light;

  const performSearch = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    const { data, error } = await supabase
      .from("posts")
      .select("*, profiles(username, full_name, avatar_url)")
      .ilike("content", `%${trimmed}%`)
      .order("created_at", { ascending: false })
      .limit(30);

    if (!error && data) {
      setResults(data as PostWithProfile[]);
    }
    setLoading(false);
  }, []);

  const handleChangeText = useCallback(
    (text: string) => {
      setQuery(text);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      debounceTimer.current = setTimeout(() => {
        performSearch(text);
      }, DEBOUNCE_MS);
    },
    [performSearch]
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={["top"]}
    >
      {/* Header */}
      <View style={{ padding: 24, paddingBottom: 8 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: colors.text,
            marginBottom: 16,
          }}
        >
          Search
        </Text>
        <Input
          placeholder="Search posts..."
          value={query}
          onChangeText={handleChangeText}
          autoCorrect={false}
        />
      </View>

      {/* Results */}
      {loading ? (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <ActivityIndicator size="large" color={COLORS.brand[500]} />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <PostCard post={item} />}
          ListEmptyComponent={
            hasSearched ? (
              <EmptyState
                icon="search-outline"
                title="No results"
                description={`We couldn't find anything matching "${query}"`}
              />
            ) : (
              <EmptyState
                icon="search-outline"
                title="Discover content"
                description="Start typing to search through posts."
              />
            )
          }
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="on-drag"
        />
      )}
    </SafeAreaView>
  );
}
