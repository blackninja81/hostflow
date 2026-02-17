'use client'

import { updateProperty } from '../../app/dashboard/actions'
import { useState } from 'react'

export default function EditPropertyForm({ property }: { property: any }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    const result = await updateProperty(property.id, formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && <div className="p-3 bg-red-50 text-[#FF5A5F] rounded-lg text-sm">{error}</div>}

      <input type="hidden" name="currentThumbnailUrl" value={property.thumbnail_url || ''} />

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 uppercase">Property Name</label>
        <input name="name" defaultValue={property.name} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#008489] outline-none" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 uppercase">Address</label>
        <input name="address" defaultValue={property.address} required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#008489] outline-none" />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 uppercase">Thumbnail Photo</label>
        {property.thumbnail_url && (
            <div className="mb-2 relative h-20 w-32 rounded overflow-hidden border">
                <img src={property.thumbnail_url} alt="Current" className="object-cover w-full h-full" />
            </div>
        )}
        <input type="file" name="thumbnail" accept="image/*" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-[#008489]/10 file:text-[#008489] hover:file:bg-[#008489]/20" />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#008489] hover:bg-[#006c70] text-white font-bold py-4 rounded-lg shadow-lg transition-all disabled:opacity-50"
      >
        {loading ? 'Saving Changes...' : 'Save Changes'}
      </button>
    </form>
  )
}