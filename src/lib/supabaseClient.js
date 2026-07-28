import { createClient } from '@supabase/supabase-js'

export const SUPABASE_PROFILE_ID = '00000000-0000-0000-0000-000000000001'

// createClient throws on a missing url/key, and this module is evaluated during
// the import graph of main.jsx — long before any application-level try/catch
// exists. A misconfigured deploy therefore used to render nothing at all, with
// no hint as to why. Substituting an unroutable placeholder keeps construction
// synchronous-safe and pushes the failure to the first network call, where
// dataService already degrades to the LocalStorage mirror and the pending-sync
// queue. That is exactly the offline-first path the design intends.
const PLACEHOLDER_URL = 'https://supabase-not-configured.invalid'
const PLACEHOLDER_KEY = 'supabase-not-configured'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && key)

if (!isSupabaseConfigured) {
  const missing = [!url && 'VITE_SUPABASE_URL', !key && 'VITE_SUPABASE_ANON_KEY'].filter(Boolean)
  console.error(
    `[sololeveling] Supabase is not configured: missing ${missing.join(' and ')}. ` +
      'The app will run in LocalStorage-only mode and every write will sit in the ' +
      'pending-sync queue until the environment variables are set (see .env.example) ' +
      'and the page is reloaded.',
  )
}

export const supabase = createClient(url || PLACEHOLDER_URL, key || PLACEHOLDER_KEY)

export default supabase
