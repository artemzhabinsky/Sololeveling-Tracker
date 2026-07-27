import { describe, it, expect, vi, beforeEach } from 'vitest'

describe('supabaseClient', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'test-anon-key')
    vi.resetModules()
  })

  it('exports a configured client and the fixed profile id', async () => {
    const { supabase, SUPABASE_PROFILE_ID } = await import('./supabaseClient.js')
    expect(supabase).toBeDefined()
    expect(typeof supabase.from).toBe('function')
    expect(SUPABASE_PROFILE_ID).toBe('00000000-0000-0000-0000-000000000001')
  })
})
