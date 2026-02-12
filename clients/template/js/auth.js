// Supabase Auth Module
// Depends on: config.js loaded first, Supabase JS v2 from CDN

(function () {
  'use strict';

  let _supabase = null;

  function getSupabaseClient() {
    if (_supabase) return _supabase;
    if (!window.supabase) {
      // supabase-js v2 CDN exposes window.supabase.createClient
      throw new Error('Supabase JS not loaded. Include the CDN script before auth.js.');
    }
    _supabase = window.supabase.createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
    return _supabase;
  }

  /**
   * Initialize auth — check session and redirect if not logged in.
   * Call on every page except index.html (login page).
   */
  async function initAuth() {
    const client = getSupabaseClient();
    const { data: { session }, error } = await client.auth.getSession();

    if (error || !session) {
      window.location.href = 'index.html';
      return null;
    }

    // Set client accent color from config
    if (CONFIG.accentColor && CONFIG.accentColor !== '{{COLOR}}') {
      document.documentElement.style.setProperty('--client-accent', CONFIG.accentColor);
    }

    return session;
  }

  /**
   * Sign in with email and password.
   * On success, redirects to dashboard.html.
   */
  async function login(email, password) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signInWithPassword({ email, password });

    if (error) {
      throw error;
    }

    window.location.href = 'dashboard.html';
    return data;
  }

  /**
   * Sign out and redirect to login page.
   */
  async function logout() {
    const client = getSupabaseClient();
    await client.auth.signOut();
    window.location.href = 'index.html';
  }

  /**
   * Return current session or null.
   */
  async function getSession() {
    const client = getSupabaseClient();
    const { data: { session } } = await client.auth.getSession();
    return session;
  }

  /**
   * Extract client_id from the user's metadata.
   */
  async function getClientId() {
    const session = await getSession();
    if (!session || !session.user) return null;
    return session.user.user_metadata?.client_id || null;
  }

  /**
   * Get the raw Supabase client for use in other modules.
   */
  function getClient() {
    return getSupabaseClient();
  }

  // Expose on window for other modules
  window.Auth = {
    initAuth,
    login,
    logout,
    getSession,
    getClientId,
    getClient
  };
})();
