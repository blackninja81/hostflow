'use client'

import { useState } from 'react'
import { addInventoryItem } from '../../app/dashboard/actions'

export default function AddItemModal({ propertyId }: { propertyId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    await addInventoryItem(propertyId, formData)
    setLoading(false)
    setIsOpen(false)
  }

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="bg-[#008489] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#006c70] transition-all shadow-lg hover:shadow-[#008489]/20"
    >
      + Add Item
    </button>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-[#484848] mb-6">New Inventory Item</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Item Name</label>
            <input name="name" required placeholder="e.g. Coffee Pods (Box of 50)" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#008489] outline-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Quantity</label>
              <input name="quantity" type="number" defaultValue="0" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#008489] outline-none" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Min. Stock</label>
              <input name="min_stock" type="number" defaultValue="2" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#008489] outline-none" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-400 tracking-widest">Cost per Unit ($)</label>
            <input name="cost" type="number" step="0.01" defaultValue="0.00" className="w-full mt-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#008489] outline-none" />
          </div>
<div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 mb-4">
  <input 
    type="checkbox" 
    id="is_permanent" 
    name="is_permanent"
    className="w-5 h-5 accent-[#008489]"
  />
  <label htmlFor="is_permanent" className="text-sm font-bold text-[#484848]">
    Permanent Utility (Electricity, WiFi, Water)
  </label>
</div>
          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">Cancel</button>
            <button disabled={loading} type="submit" className="flex-1 bg-[#008489] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#006c70] transition-colors shadow-lg shadow-[#008489]/20">
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}