'use client'

import { createClient } from '../../lib/supabase/client'
import { useState } from 'react'

export default function SocialAuth() {
  const supabase = createClient()
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | null>(null)

  const handleLogin = async (provider: 'google' | 'github') => {
    setLoadingProvider(provider)
    
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        // This is the key for Dev vs Live support
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="mt-8 space-y-4">
      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-100"></span>
        </div>
        <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
          <span className="bg-white px-4 text-gray-400">or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {/* Google Button */}
        <button
          disabled={!!loadingProvider}
          onClick={() => handleLogin('google')}
          className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-gray-100 bg-white px-6 py-4 text-sm font-black text-[#484848] uppercase tracking-wider transition-all hover:bg-gray-50 hover:border-gray-200 active:scale-[0.98] disabled:opacity-50"
        >
          {loadingProvider === 'google' ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-200 border-t-[#484848]" />
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" alt="Google" className="h-5 w-5 grayscale group-hover:grayscale-0" />
              Google
            </>
          )}
        </button>

        {/* GitHub Button */}
        <button
          disabled={!!loadingProvider}
          onClick={() => handleLogin('github')}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#24292e] px-6 py-4 text-sm font-black text-white uppercase tracking-wider transition-all hover:bg-black active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-50"
        >
          {loadingProvider === 'github' ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          ) : (
            <>
              <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" className="h-5 w-5 invert" />
              GitHub
            </>
          )}
        </button>
      </div>
    </div>
  )
}