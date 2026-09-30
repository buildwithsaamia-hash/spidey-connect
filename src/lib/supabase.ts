import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { RegisteredUser } from '../types';

const STORAGE_KEY = 'spidey_connect_real_registrations';

export function isSupabaseReady(): boolean {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();
  return Boolean(envUrl && envKey && envUrl.startsWith('http'));
}

let currentClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (currentClient) return currentClient;

  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (!envUrl || !envKey || !envUrl.startsWith('http')) {
    return null;
  }

  try {
    currentClient = createClient(envUrl, envKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
    return currentClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

// Local persistent real user storage helper
function getLocalUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Local storage read error:', e);
  }
  return [];
}

function saveLocalUser(user: RegisteredUser) {
  const list = getLocalUsers();
  const exists = list.some((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (!exists) {
    list.unshift(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
}

/**
 * Register user through Supabase Auth & Database
 */
export async function registerNewUser(
  email: string,
  password?: string
): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const timestamp = new Date().toISOString();
  const newUserId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `usr_${Date.now()}`;

  const client = getSupabaseClient();

  if (client) {
    try {
      let authUserId = newUserId;
      if (password) {
        const { data: authData, error: authErr } = await client.auth.signUp({
          email: normalizedEmail,
          password: password,
        });

        if (authErr) {
          if (
            authErr.message.toLowerCase().includes('already registered') ||
            authErr.message.toLowerCase().includes('already exists') ||
            authErr.message.toLowerCase().includes('duplicate')
          ) {
            return { success: false, error: 'Account already exists, please Sign In' };
          }
          return { success: false, error: authErr.message };
        }

        if (authData.user && authData.user.identities && authData.user.identities.length === 0) {
          return { success: false, error: 'Account already exists, please Sign In' };
        }

        if (authData.user?.id) {
          authUserId = authData.user.id;
        }
      }

      const newUserRecord: RegisteredUser = {
        id: authUserId,
        email: normalizedEmail,
        created_at: timestamp,
        source: 'supabase',
      };

      const { error: dbError } = await client
        .from('registrations')
        .insert([{ id: authUserId, email: normalizedEmail, created_at: timestamp }]);

      if (dbError) {
        if (
          dbError.code === '23505' ||
          dbError.message.toLowerCase().includes('unique') ||
          dbError.message.toLowerCase().includes('duplicate')
        ) {
          return { success: false, error: 'Account already exists, please Sign In' };
        }
        console.warn('Note: registrations table insert note:', dbError.message);
      }

      saveLocalUser(newUserRecord);

      return {
        success: true,
        user: newUserRecord,
      };
    } catch (error: any) {
      console.error('Supabase registration error:', error);
      return { success: false, error: error?.message || 'Failed to complete registration.' };
    }
  }

  const currentList = getLocalUsers();
  if (currentList.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: 'Account already exists, please Sign In' };
  }

  const fallbackUser: RegisteredUser = {
    id: newUserId,
    email: normalizedEmail,
    created_at: timestamp,
    source: 'local_storage',
  };

  saveLocalUser(fallbackUser);

  return {
    success: true,
    user: fallbackUser,
  };
}

/**
 * Sign In user through Supabase Auth (signInWithPassword)
 */
export async function signInUser(
  email: string,
  password: string
): Promise<{ success: boolean; user?: RegisteredUser; error?: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: normalizedEmail,
        password: password,
      });

      if (error) {
        const msg = error.message.toLowerCase();
        if (
          msg.includes('invalid login credentials') ||
          msg.includes('user not found') ||
          msg.includes('not found') ||
          msg.includes('no user')
        ) {
          return { success: false, error: 'No account found, please Sign Up' };
        }
        return { success: false, error: error.message };
      }

      if (!data.user) {
        return { success: false, error: 'No account found, please Sign Up' };
      }

      const userRecord: RegisteredUser = {
        id: data.user.id,
        email: data.user.email || normalizedEmail,
        created_at: data.user.created_at || new Date().toISOString(),
        source: 'supabase',
      };

      saveLocalUser(userRecord);

      return {
        success: true,
        user: userRecord,
      };
    } catch (err: any) {
      console.error('Supabase sign-in error:', err);
      return { success: false, error: err?.message || 'Failed to sign in.' };
    }
  }

  const currentList = getLocalUsers();
  const foundUser = currentList.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!foundUser) {
    return { success: false, error: 'No account found, please Sign Up' };
  }

  return {
    success: true,
    user: foundUser,
  };
}

/**
 * Retrieve registered users for Admin Portal
 */
export async function fetchRegisteredUsers(): Promise<{
  users: RegisteredUser[];
  source: 'supabase' | 'local_storage';
  error?: string;
}> {
  const client = getSupabaseClient();

  if (client) {
    try {
      const { data, error } = await client
        .from('registrations')
        .select('id, email, created_at')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Could not query registrations table:', error.message);
        const localList = getLocalUsers();
        return {
          users: localList,
          source: 'local_storage',
          error: `Supabase connected, but "registrations" table query returned: "${error.message}". Showing registered users.`,
        };
      }

      if (data && Array.isArray(data)) {
        const dbUsers: RegisteredUser[] = data.map((d: any) => ({
          id: d.id || `usr_${Math.random()}`,
          email: d.email,
          created_at: d.created_at,
          source: 'supabase',
        }));

        const localUsers = getLocalUsers();
        const combined = [...dbUsers];
        for (const loc of localUsers) {
          if (!combined.some((u) => u.email.toLowerCase() === loc.email.toLowerCase())) {
            combined.push(loc);
          }
        }

        combined.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        return {
          users: combined,
          source: 'supabase',
        };
      }
    } catch (err: any) {
      console.error('Fetch registered users exception:', err);
    }
  }

  const localList = getLocalUsers();
  return {
    users: localList,
    source: 'local_storage',
  };
}
