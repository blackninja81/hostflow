'use client'

import { useState } from 'react'
import { addInventoryItem } from '@/src/app/dashboard/actions'
import { X, Box, AlertTriangle, DollarSign, Zap } from 'lucide-react'

export default function AddItemModal({ propertyId }: { propertyId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    try {
      await addInventoryItem(propertyId, formData)
      setIsOpen(false)
    } catch (error) {
      console.error("Failed to add item:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="bg-[#008489] text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-[#006c70] transition-all shadow-lg hover:shadow-[#008489]/20 cursor-pointer"
    >
      + Add Item
    </button>
  )

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 tracking-tight">
          New Inventory Item
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
              <Box size={12} /> Item Name
            </label>
            <input 
              name="name" 
              required 
              placeholder="e.g. Coffee Pods (Box of 50)" 
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] dark:focus:border-[#008489] text-gray-900 dark:text-white transition-colors" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                Quantity
              </label>
              <input 
                name="quantity" 
                type="number" 
                defaultValue="0" 
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] dark:focus:border-[#008489] text-gray-900 dark:text-white transition-colors font-bold" 
              />
            </div>
            {/* Min Stock */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                <AlertTriangle size={12} /> Min. Stock
              </label>
              <input 
                name="min_stock" 
                type="number" 
                defaultValue="2" 
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] dark:focus:border-[#008489] text-gray-900 dark:text-white transition-colors font-bold" 
              />
            </div>
          </div>

          {/* Cost per Unit */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
              Cost per Unit (Ksh)
            </label>
            <input 
              name="cost" 
              type="number" 
              step="0.01" 
              defaultValue="0.00" 
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] font-bold text-[#008489] transition-colors" 
            />
          </div>

          {/* Permanent Utility Toggle */}
          <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl border border-blue-100 dark:border-slate-700 transition-colors">
            <input 
              type="checkbox" 
              id="is_permanent" 
              name="is_permanent"
              className="w-5 h-5 accent-[#008489] cursor-pointer"
            />
            <label htmlFor="is_permanent" className="flex items-center gap-2 text-sm font-bold text-[#484848] dark:text-slate-200 cursor-pointer">
              <Zap size={14} className="text-[#008489]" />
              Permanent Utility (Electricity, WiFi)
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => setIsOpen(false)} 
              className="flex-1 p-4 font-bold text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              disabled={loading} 
              type="submit" 
              className="flex-[2] bg-[#008489] text-white p-4 rounded-2xl font-bold shadow-lg shadow-[#008489]/20 hover:bg-[#006c70] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}