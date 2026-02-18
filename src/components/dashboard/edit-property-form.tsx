'use client'

import { updateProperty } from '../../app/dashboard/actions'
import { useState } from 'react'
import { Home, MapPin, ImageIcon, Save, AlertCircle } from 'lucide-react'

export default function EditPropertyForm({ property }: { property: any }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await updateProperty(property.id, formData)
      if (result?.error) {
        setError(result.error)
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6 max-w-xl p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-xl transition-colors duration-500">
      
      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-500/10 text-[#FF5A5F] rounded-2xl text-sm font-bold border border-red-100 dark:border-red-500/20 animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <input type="hidden" name="currentThumbnailUrl" value={property.thumbnail_url || ''} />

      <div className="space-y-5">
        {/* Property Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            <Home size={12} /> Property Name
          </label>
          <input 
            name="name" 
            defaultValue={property.name} 
            required 
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
            defaultValue={property.address} 
            required 
            className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] dark:focus:border-[#008489] text-gray-900 dark:text-white transition-colors" 
          />
        </div>

        {/* Thumbnail Photo */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
            <ImageIcon size={12} /> Thumbnail Photo
          </label>
          
          <div className="flex items-center gap-6 p-4 bg-gray-50 dark:bg-slate-800 rounded-[2rem] border border-dashed border-gray-200 dark:border-slate-700">
            {property.thumbnail_url && (
                <div className="relative h-20 w-32 rounded-2xl overflow-hidden border border-white dark:border-slate-700 shadow-sm shrink-0">
                    <img src={property.thumbnail_url} alt="Current" className="object-cover w-full h-full" />
                </div>
            )}
            
            <div className="flex-1">
              <input 
                type="file" 
                name="thumbnail" 
                accept="image/*" 
                className="block w-full text-xs text-gray-400 dark:text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-xs file:font-black file:uppercase file:tracking-widest
                  file:bg-[#008489]/10 file:text-[#008489]
                  hover:file:bg-[#008489]/20 transition-all cursor-pointer" 
              />
              <p className="mt-2 text-[9px] text-gray-400 dark:text-slate-600 font-bold uppercase tracking-tighter">
                PNG, JPG or WEBP (Max 5MB)
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-[#008489] hover:brightness-110 text-white font-black py-4 rounded-2xl shadow-lg shadow-[#008489]/20 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
      >
        {loading ? (
          <span className="flex items-center gap-2 animate-pulse">Saving Changes...</span>
        ) : (
          <>
            <Save size={18} />
            <span>Save Changes</span>
          </>
        )}
      </button>
    </form>
  )
}