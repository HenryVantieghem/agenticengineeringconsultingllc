# Realtime Patterns — Compound Knowledge Base

> Accumulated patterns for Supabase Realtime in mobile apps
> Updated: 2026-02-13

---

## Pattern 1: Subscription Lifecycle Management

**Problem:** Realtime subscriptions leak if not properly cleaned up, causing memory issues and duplicate events.

**Solution:** Always unsubscribe on component unmount / view disappear.

### Expo
```typescript
useEffect(() => {
  const channel = supabase
    .channel('posts-changes')
    .on('postgres_changes',
      { event: '*', schema: 'public', table: 'posts' },
      (payload) => {
        handleRealtimeEvent(payload);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Swift
```swift
@Observable
final class PostsViewModel {
    private var channel: RealtimeChannelV2?

    func startListening() async {
        channel = supabase.realtimeV2.channel("posts")
        // ... subscribe
        await channel?.subscribe()
    }

    func stopListening() async {
        await channel?.unsubscribe()
        channel = nil
    }
}
```

---

## Pattern 2: Optimistic Updates + Realtime Reconciliation

**Problem:** Waiting for realtime event to update UI feels slow.

**Solution:** Update UI immediately (optimistic), then reconcile when realtime event arrives.

```typescript
const handleLike = async (postId: string) => {
  // Optimistic: update UI immediately
  setPosts(prev => prev.map(p =>
    p.id === postId ? { ...p, likes_count: p.likes_count + 1, is_liked: true } : p
  ));

  // Persist to database
  const { error } = await supabase
    .from('likes')
    .insert({ post_id: postId, user_id: session.user.id });

  if (error) {
    // Rollback on failure
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, likes_count: p.likes_count - 1, is_liked: false } : p
    ));
  }
  // Realtime event will confirm the update — no additional UI change needed
};
```

---

## Pattern 3: Presence for Online Status

**Problem:** Need to show who's online in a chat or social app.

**Solution:** Use Supabase Realtime Presence.

```typescript
const channel = supabase.channel('online-users', {
  config: { presence: { key: userId } }
});

channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState();
  setOnlineUsers(Object.keys(state));
});

channel.subscribe(async (status) => {
  if (status === 'SUBSCRIBED') {
    await channel.track({
      user_id: userId,
      online_at: new Date().toISOString(),
    });
  }
});
```

---

## Pattern 4: Only Subscribe to What You Need

**Problem:** Subscribing to `*` events on large tables causes unnecessary network traffic.

**Solution:** Use filters to subscribe only to relevant rows.

```typescript
// Instead of subscribing to ALL messages:
// BAD: .on('postgres_changes', { event: '*', table: 'messages' })

// Subscribe only to messages in the current conversation:
const channel = supabase
  .channel(`conversation:${conversationId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `conversation_id=eq.${conversationId}`
  }, handleNewMessage)
  .subscribe();
```

---

## Anti-Patterns to Avoid

1. **Don't use realtime for initial data load** — Fetch with a query first, then subscribe for changes
2. **Don't create multiple channels for the same table** — Combine subscriptions into one channel
3. **Don't ignore subscription errors** — Handle CHANNEL_ERROR and TIMED_OUT states
4. **Don't forget to enable realtime on the table** — `ALTER PUBLICATION supabase_realtime ADD TABLE [table]`
