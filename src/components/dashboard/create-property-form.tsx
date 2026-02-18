'use client'

import { useState } from 'react'
import { createProperty } from '../../app/dashboard/actions'
import { Home, MapPin, Loader2 } from 'lucide-react'

export default function CreatePropertyForm() {
  const [loading, setLoading] = useState(false)

  return (
    <form 
      action={async (formData) => {
        setLoading(true)
        try {
          await createProperty(formData)
        } finally {
          setLoading(false)
        }
      }} 
      className="space-y-6 max-w-md p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl transition-all duration-500"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
          Add New Property
        </h2>
        <p className="text-xs text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest">
          Property Details
        </p>
      </div>

      <div className="space-y-4">
        {/* Property Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            <Home size={12} /> Property Name
          </label>
          <input 
            name="name" 
            required 
            placeholder="e.g. Blue Lagoon Villa"
            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] dark:focus:border-[#008489] text-gray-900 dark:text-white transition-colors"
          />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            <MapPin size={12} /> Address
          </label>
          <input 
            name="address" 
            placeholder="123 Ocean Drive"
            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] dark:focus:border-[#008489] text-gray-900 dark:text-white transition-colors"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#008489] py-4 font-black text-white hover:brightness-110 shadow-lg shadow-[#008489]/20 disabled:opacity-50 active:scale-[0.98] transition-all cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          'Create Property'
        )}
      </button>
    </form>
  )
}