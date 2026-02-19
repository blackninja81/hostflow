'use client'

import { useState } from 'react'
import { addBooking } from '@/src/app/dashboard/actions'
import { X, Calendar, User, Banknote } from 'lucide-react'

export default function AddBookingModal({ propertyId }: { propertyId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await addBooking(propertyId, formData)
      setIsOpen(false)
    } catch (e: any) {
      alert(`Failed to add: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return (
    <button 
      onClick={() => setIsOpen(true)}
      className="bg-brand text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-brand/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
    >
      + Add Booking
    </button>
  )

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={() => setIsOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-black text-gray-800 dark:text-white mb-6 tracking-tight">
          New Payout
        </h2>
        
        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
              <User size={12} /> Guest Name
            </label>
            <input 
              name="guest_name" 
              required 
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-brand dark:focus:border-brand text-gray-900 dark:text-white transition-colors" 
              placeholder="e.g. Mary Wambui" 
            />
          </div>

          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
              <Banknote size={12} /> Payout (KSh)
            </label>
            <input 
              name="payout_amount" 
              type="number" 
              required 
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-brand font-bold text-brand transition-colors" 
              placeholder="Ksh 0" 
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                <Calendar size={12} /> Check In
              </label>
              <input 
                name="check_in" 
                type="date" 
                required 
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-sm font-bold text-gray-900 dark:text-white" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                <Calendar size={12} /> Check Out
              </label>
              <input 
                name="check_out" 
                type="date" 
                required 
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-sm font-bold text-gray-900 dark:text-white" 
              />
            </div>
          </div>

          {/* Action Buttons */}
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
              className="flex-2 p-4 bg-brand text-white rounded-2xl font-bold shadow-lg shadow-brand/20 hover:bg-[#006d73] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Record Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}