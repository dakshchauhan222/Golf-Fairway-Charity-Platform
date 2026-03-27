import { createBrowserClient } from '@supabase/ssr';

const authLockNoOp = async (name, acquireTimeout, fn) => {
  // Supabase uses a navigator lock to avoid concurrent auth race conditions.
  // In some dev environments this may produce "lock was released because another request stole it".
  // A no-op lock avoids these transient errors while keeping auth consistency in a single-tab app.
  return fn();
};

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
        lock: authLockNoOp,
      },
    }
  );
}
