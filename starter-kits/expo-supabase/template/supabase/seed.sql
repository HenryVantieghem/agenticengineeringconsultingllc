-- ExpoLaunch Seed Data
-- Run this after the initial migration to populate sample data for development.
-- Note: You must have at least one user signed up before running this.

-- To use: Sign up a test user in the app, then replace the UUID below with their auth.users.id.

-- Sample posts (replace user_id with a real profile ID from your auth.users table)
-- Uncomment and update the UUID after creating your first user:

/*
insert into posts (user_id, content, likes_count, created_at) values
  ('YOUR-USER-UUID-HERE', 'Just shipped the first version of our app! Built with Expo + Supabase and it was incredibly fast to get to production.', 12, now() - interval '2 hours'),
  ('YOUR-USER-UUID-HERE', 'Tip: Use Zustand for state management in React Native. It is lightweight, has zero boilerplate, and works great with TypeScript.', 8, now() - interval '5 hours'),
  ('YOUR-USER-UUID-HERE', 'Real-time subscriptions in Supabase are a game changer. Our feed updates instantly without any polling.', 15, now() - interval '1 day'),
  ('YOUR-USER-UUID-HERE', 'Dark mode support with NativeWind is surprisingly easy. Just set darkMode to class in your Tailwind config and use the dark: prefix.', 6, now() - interval '2 days'),
  ('YOUR-USER-UUID-HERE', 'RevenueCat makes in-app purchases almost painless. The SDK handles receipt validation, entitlements, and cross-platform sync.', 10, now() - interval '3 days');

-- Sample notifications
insert into notifications (user_id, title, body, read, created_at) values
  ('YOUR-USER-UUID-HERE', 'Welcome to ExpoLaunch!', 'Thanks for signing up. Start by customizing your profile.', false, now() - interval '1 minute'),
  ('YOUR-USER-UUID-HERE', 'New feature: Dark mode', 'You can now toggle dark mode in Settings. Try it out!', false, now() - interval '1 hour'),
  ('YOUR-USER-UUID-HERE', 'Your post got 10 likes', 'Your post about Expo + Supabase is getting traction.', true, now() - interval '1 day');
*/
