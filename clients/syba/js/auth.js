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
   * Call on every protected page (dashboard, leads, briefings, etc.).
   */
  async function initAuth() {
    const client = getSupabaseClient();
    const { data: { session }, error } = await client.auth.getSession();

    if (error || !session) {
      window.location.href = 'login.html';
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
   * Sign up with email and password.
   * Returns data with session (if auto-confirmed) or user (if email confirmation required).
   */
  async function signUp(email, password) {
    const client = getSupabaseClient();
    const { data, error } = await client.auth.signUp({ email, password });

    if (error) {
      throw error;
    }

    return data;
  }

  /**
   * Sign out and redirect to login page.
   */
  async function logout() {
    const client = getSupabaseClient();
    await client.auth.signOut();
    window.location.href = 'login.html';
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
   * Check current session — alias for getSession.
   */
  async function checkSession() {
    return await getSession();
  }

  /**
   * Extract client_id (UUID) by resolving the slug stored in user metadata.
   * Caches the result so we only query the clients table once per session.
   */
  let _resolvedClientId = null;
  async function getClientId() {
    if (_resolvedClientId) return _resolvedClientId;

    const session = await getSession();
    if (!session || !session.user) return null;

    const slug = session.user.user_metadata?.client_id || null;
    if (!slug) return null;

    const client = getSupabaseClient();
    const { data, error } = await client
      .from('clients')
      .select('id')
      .eq('slug', slug)
      .single();

    if (error || !data) return null;
    _resolvedClientId = data.id;
    return _resolvedClientId;
  }

  /**
   * Get the raw Supabase client for use in other modules.
   */
  function getClient() {
    return getSupabaseClient();
  }

  // Expose as window.Auth namespace
  window.Auth = {
    initAuth,
    login,
    signUp,
    logout,
    getSession,
    checkSession,
    getClientId,
    getClient
  };

  // Expose as standalone globals for backward compatibility
  window.initAuth = initAuth;
  window.login = login;
  window.signUp = signUp;
  window.logout = logout;
  window.checkSession = checkSession;
  window.getSession = getSession;
  window.getClientId = getClientId;
})();
