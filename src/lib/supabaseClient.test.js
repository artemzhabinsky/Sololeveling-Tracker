import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('supabaseClient', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')
    vi.resetModules()
  })

  it('exports a configured client and the fixed profile id', async () => {
    const { supabase, SUPABASE_PROFILE_ID, isSupabaseConfigured } = await import('./supabaseClient.js')
    expect(supabase).toBeDefined()
    expect(typeof supabase.from).toBe('function')
    expect(isSupabaseConfigured).toBe(true)
    expect(SUPABASE_PROFILE_ID).toBe('00000000-0000-0000-0000-000000000001')
  })

  // This module is evaluated while main.jsx's imports resolve, so a throw here
  // is a blank page with an empty console — the worst possible failure mode for
  // a misconfigured deploy.
  it('still constructs a client and reports loudly when env vars are missing', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.resetModules()

    const { supabase, isSupabaseConfigured } = await import('./supabaseClient.js')

    expect(typeof supabase.from).toBe('function')
    expect(isSupabaseConfigured).toBe(false)
    expect(consoleError).toHaveBeenCalledWith(
      expect.stringContaining('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'),
    )
    consoleError.mockRestore()
  })
})
