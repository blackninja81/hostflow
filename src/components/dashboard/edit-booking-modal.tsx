'use client'

import { useState } from 'react'
import { updateBooking } from '../../app/dashboard/actions'
import { X, User, Banknote, Calendar, Globe } from 'lucide-react'

export default function EditBookingModal({ booking, propertyId, isOpen, onClose }: any) {
  const [loading, setLoading] = useState(false)
  
  if (!isOpen) return null

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    try {
      await updateBooking(propertyId, formData)
      onClose()
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-gray-800 dark:text-white tracking-tight">
            Edit Booking
          </h2>
          <p className="text-[10px] font-black text-[#008489] uppercase tracking-widest mt-1">
            Updating Record #{booking.id?.slice(-4)}
          </p>
        </div>

        <form action={handleSubmit} className="space-y-5">
          {/* Hidden ID */}
          <input type="hidden" name="bookingId" value={booking.id} />
          
          {/* Guest Name */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
              <User size={12} /> Guest Name
            </label>
            <input 
              name="guest_name" 
              defaultValue={booking.guest_name} 
              required 
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] dark:focus:border-[#008489] text-gray-900 dark:text-white transition-colors" 
            />
          </div>

          {/* Payout Amount */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
              <Banknote size={12} /> Payout (KSh)
            </label>
            <input 
              name="payout_amount" 
              type="number" 
              defaultValue={booking.payout_amount} 
              required 
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] font-bold text-[#008489] transition-colors" 
            />
          </div>

          {/* Dates Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                <Calendar size={12} /> Check In
              </label>
              <input 
                name="check_in" 
                type="date" 
                defaultValue={booking.check_in} 
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
                defaultValue={booking.check_out} 
                className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 text-sm font-bold text-gray-900 dark:text-white" 
              />
            </div>
          </div>

          {/* Platform Field (Optional but nice for data) */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
              <Globe size={12} /> Booking Platform
            </label>
            <input 
              name="platform" 
              defaultValue={booking.platform} 
              placeholder="e.g. Airbnb, Booking.com"
              className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] text-sm text-gray-900 dark:text-white transition-colors" 
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="flex-1 p-4 font-bold text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              disabled={loading} 
              className="flex-[2] p-4 bg-[#008489] text-white rounded-2xl font-bold shadow-lg shadow-[#008489]/20 hover:bg-[#006d73] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Update Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}