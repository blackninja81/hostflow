import { login } from '../../actions'
import SocialAuth from '../../../../components/auth/social-auth'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#484848]">Welcome to HostFlow</h2>
          <p className="mt-2 text-sm text-gray-600 italic">"The Airbnb for Inventory Management"</p>
        </div>

        <form action={login} className="mt-8 space-y-4">
          <button className="w-full rounded-md bg-[#FF5A5F] py-3 font-semibold text-white">
            Log in
          </button>
        </form>

        <SocialAuth />
      </div>
    </div>
  )
}