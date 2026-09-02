import { createClient } from '@supabase/supabase-js';
import { getClerkInstance } from '@clerk/clerk-expo';

// Supabase = database only. Auth is Clerk.
// Every request carries the Clerk session token as the Supabase access token,
// so Postgres RLS can read the Clerk user id via `auth.jwt() ->> 'sub'`.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_KEY. ' +
      'Copy .env.example to .env and restart with `npx expo start -c`.'
  );
}

const clerk = getClerkInstance();

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
  accessToken: async () => {
    try {
      return (await clerk.session?.getToken()) ?? null;
    } catch {
      return null;
    }
  },
});
