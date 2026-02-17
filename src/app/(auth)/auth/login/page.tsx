import { login } from '../../actions'
import SocialAuth from '../../../../components/auth/social-auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#008489] to-[#00656a] p-12 flex-col justify-between relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a699]/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-12 h-12 group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="HostFlow" className="w-full h-full object-contain" />
            </div>
            <span className="text-3xl font-black tracking-tighter text-white">HostFlow</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-black text-white tracking-tighter leading-tight">
            Manage your stays.<br />
            Master your margins.
          </h1>
          <p className="text-white/80 text-lg max-w-md leading-relaxed">
            Join hundreds of AirBnB hosts who've transformed their operations with smart inventory tracking and real-time profit analytics.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8">
            <div>
              <div className="text-4xl font-black text-white">500+</div>
              <div className="text-white/60 text-sm font-medium uppercase tracking-wider">Active Hosts</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">1.2K</div>
              <div className="text-white/60 text-sm font-medium uppercase tracking-wider">Properties</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white">98%</div>
              <div className="text-white/60 text-sm font-medium uppercase tracking-wider">Satisfaction</div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white/60 text-sm">
            "HostFlow helped us increase our profit margins by 23% in just 3 months."
          </p>
          <p className="text-white/80 text-sm font-bold mt-2">
            — Sarah Chen, Superhost
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Back to Home Link */}
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-[#008489] transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Login Card */}
          <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-xl border border-gray-100">
            {/* Logo for Mobile */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="relative w-8 h-8">
                <img src="/logo.png" alt="HostFlow" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-[#008489]">HostFlow</span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#484848] mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 text-sm">
                Sign in to manage your properties
              </p>
            </div>

            {/* Login Form */}
            <form action={login} className="space-y-4">
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-[#008489] to-[#00a699] text-white py-4 rounded-2xl font-black text-lg uppercase tracking-wider hover:scale-[1.02] transition-all shadow-lg shadow-[#008489]/20 hover:shadow-xl hover:shadow-[#008489]/30"
              >
                Continue with Email
              </button>
            </form>

            {/* Social Auth */}
            <SocialAuth />

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="font-bold text-[#008489] hover:text-[#006d73] transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs text-center text-gray-400 leading-relaxed">
              By continuing, you agree to HostFlow's{' '}
              <a href="#" className="underline hover:text-[#008489]">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-[#008489]">Privacy Policy</a>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Secure Login</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <span className="font-semibold">Email Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}