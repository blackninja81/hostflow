'use client'

import { createClient } from '../../lib/supabase/client'

export default function SocialAuth() {
  const supabase = createClient()

  const handleLogin = async (provider: 'google' | 'github') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="space-y-3">
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-300"></span>
        </div>
        <div className="relative flex justify-center text-sm uppercase">
          <span className="bg-white px-2 text-gray-500 font-medium">or</span>
        </div>
      </div>

      <button
        onClick={() => handleLogin('google')}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-[#484848] transition-colors hover:bg-gray-50 active:scale-[0.98]"
      >
        <img src="https://www.google.com/favicon.ico" alt="Google" className="h-4 w-4" />
        Continue with Google
      </button>

      <button
        onClick={() => handleLogin('github')}
        className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-[#24292e] px-3 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 active:scale-[0.98]"
      >
        <img src="https://github.githubassets.com/favicons/favicon.svg" alt="GitHub" className="h-4 w-4 invert" />
        Continue with GitHub
      </button>
    </div>
  )
}