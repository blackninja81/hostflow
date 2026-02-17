'use client'

import { useState } from 'react'
import { createProperty } from '../../app/dashboard/actions' // We will create this next

export default function CreatePropertyForm() {
  const [loading, setLoading] = useState(false)

  return (
    <form action={async (formData) => {
      setLoading(true)
      await createProperty(formData)
      setLoading(false)
    }} className="space-y-4 max-w-md p-6 bg-white rounded-xl border shadow-sm">
      <div>
        <label className="block text-sm font-medium text-gray-700">Property Name</label>
        <input 
          name="name" 
          required 
          placeholder="e.g. Blue Lagoon Villa"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#008489] focus:outline-none focus:ring-1 focus:ring-[#008489]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <input 
          name="address" 
          placeholder="123 Ocean Drive"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#008489] focus:outline-none focus:ring-1 focus:ring-[#008489]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-[#FF5A5F] py-2 font-semibold text-white hover:bg-[#e04f54] disabled:opacity-50 transition-all"
      >
        {loading ? 'Creating...' : 'Add Property'}
      </button>
    </form>
  )
}