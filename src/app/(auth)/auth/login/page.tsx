import { login } from '../../actions'
import SocialAuth from '../../../../components/auth/social-auth'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0F172A] dark:to-[#0B0F1A] transition-colors duration-500">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#008489] to-[#00656a] dark:from-[#004D4F] dark:to-[#003335] p-12 flex-col justify-between relative overflow-hidden transition-colors duration-500">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 dark:bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#00a699]/20 dark:bg-[#00a699]/10 rounded-full blur-[120px]" />
        
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
          <p className="text-white/60 text-sm italic">
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
            className="inline-flex items-center gap-2 text-sm font-bold text-gray-400 dark:text-slate-500 hover:text-[#008489] dark:hover:text-[#008489] transition-colors mb-8 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 md:p-10 shadow-xl dark:shadow-2xl dark:shadow-black/20 border border-gray-100 dark:border-slate-800 transition-colors">
            {/* Logo for Mobile */}
            <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
              <div className="relative w-8 h-8">
                <img src="/logo.png" alt="HostFlow" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-black tracking-tighter text-[#008489]">HostFlow</span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#484848] dark:text-white mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-500 dark:text-slate-400 text-sm font-medium">
                Sign in to manage your properties
              </p>
            </div>

            {/* Social Auth */}
            <div className="dark:invert-[0.05] transition-all">
               <SocialAuth />
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs text-center text-gray-400 dark:text-slate-500 leading-relaxed">
              By continuing, you agree to HostFlow's{' '}
              <a href="#" className="underline hover:text-[#008489] dark:hover:text-[#00a699] transition-colors">Terms of Service</a>
              {' '}and{' '}
              <a href="#" className="underline hover:text-[#008489] dark:hover:text-[#00a699] transition-colors">Privacy Policy</a>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-gray-400 dark:text-slate-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Secure Login</span>
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-blue-500 opacity-80" fill="currentColor" viewBox="0 0 20 20">
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