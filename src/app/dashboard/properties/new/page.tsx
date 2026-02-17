import { redirect } from 'next/navigation'
import { createClient } from '../../../../lib/supabase/server'
import Link from 'next/link'
import NewPropertyForm from '../../../../components/dashboard/new-property-form'

export default async function NewPropertyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl md:shadow-xl border border-gray-100 p-8 md:p-12">
        <header className="mb-8">
          <Link href="/dashboard" className="text-sm font-medium text-gray-500 hover:text-[#008489] transition-colors mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-[#484848]">List a new property</h1>
        </header>

        <NewPropertyForm />
      </div>
    </div>
  )
}