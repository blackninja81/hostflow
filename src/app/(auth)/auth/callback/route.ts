import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'

export async function GET(request: Request) {
  // 1. Get the URL details (e.g., http://localhost:3000/auth/callback?code=...)
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 2. Check where the user should go after login (default to dashboard)
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    // 3. Initialize the Supabase Server Client
    const supabase = await createClient()
    
    // 4. "The Trade": Exchange the temporary code for a permanent session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // 5. SUCCESS: Cookies are set! Send them to the dashboard.
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 6. FAIL: If there's no code or the exchange failed, send them back to login
  return NextResponse.redirect(`${origin}/auth/login?error=auth-callback-failed`)
}