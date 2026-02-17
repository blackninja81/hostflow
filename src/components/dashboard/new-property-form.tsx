'use client'

import { createProperty } from '../../app/dashboard/actions'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function NewPropertyForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use a standard event handler instead of the 'action' prop
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault() // Stop the browser's default submission
    setLoading(true)
    setError(null)
    
    // Manually create the FormData object from the form
    const formData = new FormData(e.currentTarget)
    
    try {
      const result = await createProperty(formData)
      
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } 
      // Note: If successful, the Server Action handles 
      // revalidatePath and redirect internally.
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-[#FF5A5F]/10 border border-[#FF5A5F] text-[#FF5A5F] rounded-lg text-sm font-medium">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Property Name</label>
        <input name="name" required placeholder="e.g. The Glass House" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#008489] focus:border-transparent outline-none transition-all placeholder:text-gray-300" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Address</label>
        <input name="address" required placeholder="e.g. 123 Malibu Cliff, CA" className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#008489] focus:border-transparent outline-none transition-all placeholder:text-gray-300" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Thumbnail Photo</label>
        <input type="file" name="thumbnail" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#008489]/10 file:text-[#008489] hover:file:bg-[#008489]/20 cursor-pointer" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#FF5A5F] hover:bg-[#e04f54] text-white font-bold py-4 rounded-lg shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Uploading & Creating...' : 'Create Property'}
      </button>
    </form>
  )
}