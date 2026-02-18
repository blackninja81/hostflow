'use client'

import { createProperty } from '../../app/dashboard/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Home, MapPin, ImageIcon, Loader2, AlertCircle } from 'lucide-react'

export default function NewPropertyForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createProperty(formData)
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } 
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form 
      onSubmit={onSubmit} 
      className="space-y-6 max-w-xl p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl transition-all duration-500"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
          Register Property
        </h2>
        <p className="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">
          Basic Information
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-500/10 text-[#FF5A5F] rounded-2xl text-sm font-bold border border-red-100 dark:border-red-500/20 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="space-y-5">
        {/* Property Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            <Home size={12} /> Property Name
          </label>
          <input 
            name="name" 
            required 
            placeholder="e.g. The Glass House" 
            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] dark:focus:border-[#008489] text-gray-900 dark:text-white transition-colors placeholder:text-gray-300 dark:placeholder:text-slate-600" 
          />
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            <MapPin size={12} /> Address
          </label>
          <input 
            name="address" 
            required 
            placeholder="e.g. 123 Malibu Cliff, CA" 
            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] dark:focus:border-[#008489] text-gray-900 dark:text-white transition-colors placeholder:text-gray-300 dark:placeholder:text-slate-600" 
          />
        </div>

        {/* Thumbnail Photo */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            <ImageIcon size={12} /> Thumbnail Photo
          </label>
          <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-dashed border-gray-200 dark:border-slate-700">
            <input 
              type="file" 
              name="thumbnail" 
              accept="image/*" 
              className="block w-full text-xs text-gray-400 dark:text-slate-500
                file:mr-4 file:py-2 file:px-6
                file:rounded-full file:border-0
                file:text-xs file:font-black file:uppercase file:tracking-widest
                file:bg-[#008489]/10 file:text-[#008489]
                hover:file:bg-[#008489]/20 transition-all cursor-pointer" 
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#008489] hover:brightness-110 text-white font-black py-4 rounded-2xl shadow-lg shadow-[#008489]/20 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            <span>Uploading & Creating...</span>
          </>
        ) : (
          'Create Property'
        )}
      </button>
    </form>
  )
}