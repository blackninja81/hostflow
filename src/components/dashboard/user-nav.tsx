import { createClient } from '../../lib/supabase/server'
import { logout } from '../../app/(auth)/actions'

export default async function UserNav() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const avatarUrl = user.user_metadata?.avatar_url
  const initials = user.email?.[0].toUpperCase()

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col items-end">
        <span className="text-sm font-semibold text-[#484848]">
          {user.user_metadata?.full_name || 'Host'}
        </span>
        
        {/* The Logout Button */}
        <form action={logout}>
          <button 
            type="submit"
            className="text-xs text-gray-500 hover:text-[#FF5A5F] transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>

      {/* Profile Image / Initials Circle */}
      <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-[#008489] shadow-sm">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white font-bold">
            {initials}
          </div>
        )}
      </div>
    </div>
  )
}