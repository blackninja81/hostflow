import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import Link from 'next/link'
import NewPropertyForm from '../../../../components/dashboard/new-property-form'
import { ChevronLeft, Sparkles } from 'lucide-react'

export default async function NewPropertyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] flex items-center justify-center p-6 transition-colors duration-500 relative overflow-hidden">
      <div className="w-full max-w-xl relative z-10">
        {/* Navigation */}
        <Link 
          href="/dashboard" 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 hover:text-[#008489] dark:hover:text-[#008489] transition-all mb-8 ml-4"
        >
          <ChevronLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
          Back to Portfolio
        </Link>

        <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.04)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-white dark:border-slate-800 p-8 md:p-12">
          <header className="mb-10 space-y-2">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-[#008489]/10 rounded-lg">
                  <Sparkles size={18} className="text-[#008489]" />
               </div>
               <span className="text-[10px] font-black text-[#008489] uppercase tracking-[0.3em]">Expansion</span>
            </div>
            <h1 className="text-4xl font-black text-[#484848] dark:text-white tracking-tighter">
              List New Property
            </h1>
            <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">
              Initialize your inventory and start tracking occupancy.
            </p>
          </header>

          <NewPropertyForm />
        </div>

        {/* Footer Note */}
        <p className="text-center mt-8 text-[10px] font-black text-gray-300 dark:text-slate-700 uppercase tracking-[0.2em]">
          HostFlow Asset Management System v2.0
        </p>
      </div>
    </div>
  )
}