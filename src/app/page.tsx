'use client'
 
import Link from "next/link";
import { ArrowRight, BarChart3, Package, ShieldCheck, TrendingUp, Clock, Star, CheckCircle } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-[#484848] selection:bg-[#008489]/20 scroll-smooth">
      {/* --- NAVIGATION --- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 group-hover:scale-110 transition-transform">
              <img src="/logo.png" alt="HostFlow" className="w-full h-full object-contain" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-[#008489]">HostFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-gray-400">
            <a 
              href="#features" 
              className="hover:text-[#008489] transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Features
            </a>
            <a 
              href="#how-it-works" 
              className="hover:text-[#008489] transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              How It Works
            </a>
            <a 
              href="#pricing" 
              className="hover:text-[#008489] transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#pricing')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Pricing
            </a>
            <Link href="/auth/login" className="bg-[#008489] text-white px-6 py-3 rounded-full hover:bg-[#006d73] transition-all shadow-lg shadow-[#008489]/20 hover:shadow-xl hover:shadow-[#008489]/30">
              Sign In
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-50 to-green-50 text-[#008489] px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-teal-100 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#008489] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#008489]"></span>
            </span>
            Now supporting multi-property management
          </div>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#484848] tracking-tighter mb-6 leading-[0.95]">
            Manage your stays. <br />
            <span className="bg-gradient-to-r from-[#008489] to-[#00a699] bg-clip-text text-transparent">Master your margins.</span>
          </h1>
          
          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-medium leading-relaxed mb-12">
            The only inventory & analytics platform built specifically for AirBnB hosts. 
            Track supplies, monitor profits, and scale your portfolio with confidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/auth/login" className="group flex items-center gap-3 bg-[#008489] text-white px-10 py-5 rounded-[2rem] text-lg font-black transition-all hover:scale-105 hover:shadow-2xl hover:shadow-[#008489]/40">
              Start Free Trial
              <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
            </Link>
            <a 
              href="#how-it-works" 
              className="px-10 py-5 rounded-[2rem] text-lg font-black text-[#484848] hover:bg-gray-50 transition-all border-2 border-transparent hover:border-gray-200 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#how-it-works')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              See How It Works
            </a>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="font-semibold">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="font-semibold">Free for 14 days</span>
            </div>
            <div className="flex items-center gap-2">
              <Star size={16} className="text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">Loved by 500+ hosts</span>
            </div>
          </div>
        </div>

        {/* --- DECORATIVE ELEMENTS --- */}
        <div className="absolute top-0 -left-20 w-96 h-96 bg-gradient-to-br from-teal-100 to-green-100 opacity-50 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 -right-20 w-96 h-96 bg-gradient-to-br from-[#FF5A5F]/10 to-orange-100/50 rounded-full blur-[120px] -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-blue-50 to-purple-50 opacity-30 rounded-full blur-[150px] -z-10" />
      </section>

      {/* --- FEATURE GRID --- */}
      <section id="features" className="py-24 bg-gradient-to-br from-[#F7F7F7] to-gray-50 rounded-[4rem] mx-4 border border-gray-100 shadow-inner">
        <div className="max-w-7xl mx-auto px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#008489] bg-teal-50 px-4 py-2 rounded-full mb-4 border border-teal-100">
              Features
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#484848] tracking-tighter mb-4">
              Everything you need to run <br className="hidden md:block" />a profitable operation
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Professional-grade tools designed specifically for short-term rental hosts
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#008489]/20">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-50 to-green-50 rounded-2xl flex items-center justify-center shadow-sm border border-teal-100 mb-6 group-hover:scale-110 transition-transform">
                <Package className="text-[#008489]" size={28} />
              </div>
              <h3 className="text-xl font-black text-[#484848] uppercase tracking-tight mb-3">Smart Inventory</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Automated low-stock alerts for toiletries, linens, and essentials. Never disappoint guests with missing amenities.
              </p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#008489]" />
                  Real-time stock tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#008489]" />
                  Custom restock thresholds
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#008489]" />
                  Shopping list generation
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#FF5A5F]/20">
              <div className="w-14 h-14 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl flex items-center justify-center shadow-sm border border-red-100 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="text-[#FF5A5F]" size={28} />
              </div>
              <h3 className="text-xl font-black text-[#484848] uppercase tracking-tight mb-3">Profit Analytics</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                True profit visibility after accounting for all expenses: payouts, cleaning, utilities, and supplies.
              </p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#FF5A5F]" />
                  Real-time P&L tracking
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#FF5A5F]" />
                  Monthly trend analysis
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-[#FF5A5F]" />
                  Property comparison
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-teal-600/20">
              <div className="w-14 h-14 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl flex items-center justify-center shadow-sm border border-teal-100 mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-teal-600" size={28} />
              </div>
              <h3 className="text-xl font-black text-[#484848] uppercase tracking-tight mb-3">Multi-Property</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Scale from one studio to fifty villas. Unified dashboard with zero friction switching between properties.
              </p>
              <ul className="space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-teal-600" />
                  Unlimited properties
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-teal-600" />
                  Portfolio-wide reporting
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-teal-600" />
                  Bulk operations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS SECTION --- */}
      <section id="how-it-works" className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#008489] bg-teal-50 px-4 py-2 rounded-full mb-4 border border-teal-100">
              How It Works
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#484848] tracking-tighter mb-4">
              From setup to insights <br className="hidden md:block" />in three simple steps
            </h2>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#008489] text-white rounded-full flex items-center justify-center font-black text-xl">
                1
              </div>
              <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 h-full pt-12">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                  <Package className="text-[#008489]" size={24} />
                </div>
                <h3 className="text-lg font-black text-[#484848] uppercase tracking-tight mb-2">Add Your Properties</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Add your listings and stock them with supplies. Set custom thresholds for each item.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#008489] text-white rounded-full flex items-center justify-center font-black text-xl">
                2
              </div>
              <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 h-full pt-12">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="text-[#FF5A5F]" size={24} />
                </div>
                <h3 className="text-lg font-black text-[#484848] uppercase tracking-tight mb-2">Track Bookings</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Log guest stays and payouts. HostFlow automatically calculates your true profit margins.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#008489] text-white rounded-full flex items-center justify-center font-black text-xl">
                3
              </div>
              <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 h-full pt-12">
                <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="text-teal-600" size={24} />
                </div>
                <h3 className="text-lg font-black text-[#484848] uppercase tracking-tight mb-2">Get Insights</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Receive real-time alerts, view analytics, and make data-driven decisions to grow your business.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PRICING SECTION --- */}
      <section id="pricing" className="py-24 px-8 bg-gradient-to-br from-[#F7F7F7] to-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block text-[10px] font-black uppercase tracking-[0.2em] text-[#008489] bg-teal-50 px-4 py-2 rounded-full mb-4 border border-teal-100">
              Simple Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-[#484848] tracking-tighter mb-4">
              Start free, scale as you grow
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              14-day free trial. No credit card required. Cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 hover:border-gray-200 transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Starter</div>
              <div className="text-4xl font-black text-[#484848] mb-2">Free</div>
              <p className="text-sm text-gray-500 mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#008489]" />
                  1 property
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#008489]" />
                  Basic inventory tracking
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#008489]" />
                  Booking management
                </li>
              </ul>
              <Link href="/auth/login" className="block w-full bg-gray-100 text-[#484848] text-center px-6 py-3 rounded-full font-black hover:bg-gray-200 transition-all">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="bg-gradient-to-br from-[#008489] to-[#006d73] p-8 rounded-[2rem] border-2 border-[#008489] shadow-2xl shadow-[#008489]/30 scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF5A5F] text-white text-[8px] font-black uppercase tracking-widest px-4 py-1 rounded-full">
                Most Popular
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 mb-2">Pro</div>
              <div className="text-4xl font-black text-white mb-2">$29<span className="text-lg text-white/70">/mo</span></div>
              <p className="text-sm text-white/70 mb-6">For growing portfolios</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle size={16} className="text-white" />
                  Up to 5 properties
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle size={16} className="text-white" />
                  Advanced analytics
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle size={16} className="text-white" />
                  Low stock alerts
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <CheckCircle size={16} className="text-white" />
                  Priority support
                </li>
              </ul>
              <Link href="/auth/login" className="block w-full bg-white text-[#008489] text-center px-6 py-3 rounded-full font-black hover:bg-gray-50 transition-all">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="bg-white p-8 rounded-[2rem] border-2 border-gray-100 hover:border-gray-200 transition-all">
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Enterprise</div>
              <div className="text-4xl font-black text-[#484848] mb-2">Custom</div>
              <p className="text-sm text-gray-500 mb-6">For property managers</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#008489]" />
                  Unlimited properties
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#008489]" />
                  Custom integrations
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#008489]" />
                  White-label option
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle size={16} className="text-[#008489]" />
                  Dedicated support
                </li>
              </ul>
              <a href="mailto:sales@hostflow.com" className="block w-full bg-[#484848] text-white text-center px-6 py-3 rounded-full font-black hover:bg-black transition-all">
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="py-24 px-8">
        <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-[#008489] to-[#00a699] p-12 md:p-16 rounded-[3rem] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6">
              Ready to level up your hosting game?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
              Join hundreds of hosts who've already transformed their operations with HostFlow.
            </p>
            <Link href="/auth/login" className="inline-flex items-center gap-3 bg-white text-[#008489] px-10 py-5 rounded-[2rem] text-lg font-black hover:scale-105 transition-all shadow-2xl hover:shadow-white/20">
              Start Your Free Trial
              <ArrowRight size={20} />
            </Link>
            <p className="text-white/60 text-sm mt-6">
              No credit card required • 14-day free trial • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="relative w-8 h-8">
                <img src="/logo.png" alt="HostFlow" className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-black tracking-tighter text-[#008489]">HostFlow</span>
            </div>
            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">
              &copy; 2026 HostFlow &bull; Built for Superhosts
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-400">
              <a href="#" className="hover:text-[#008489] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#008489] transition-colors">Terms</a>
              <a href="mailto:support@hostflow.com" className="hover:text-[#008489] transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}