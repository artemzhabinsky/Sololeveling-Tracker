import { createClient } from '@supabase/supabase-js'

export const SUPABASE_PROFILE_ID = '00000000-0000-0000-0000-000000000001'

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

export default supabase
