'use client'

import { useState } from 'react'
import { addBooking } from '../../app/dashboard/actions'

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
      className="bg-[#008489] text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-[#008489]/20 hover:scale-[1.02] transition-all"
    >
      + Add Booking
    </button>
  )

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        <h2 className="text-2xl font-black text-[#484848] mb-6 tracking-tight">New Payout</h2>
        
        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Guest Name</label>
            <input name="guest_name" required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#008489]" placeholder="e.g. Mary Wambui" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Payout (KSh)</label>
            <input name="payout_amount" type="number" required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#008489] font-bold text-[#008489]" placeholder="0" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Check In</label>
              <input name="check_in" type="date" required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-2 tracking-widest">Check Out</label>
              <input name="check_out" type="date" required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm font-bold" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => setIsOpen(false)} className="flex-1 p-4 font-bold text-gray-400">Cancel</button>
            <button disabled={loading} className="flex-[2] p-4 bg-[#008489] text-white rounded-2xl font-bold shadow-lg shadow-[#008489]/20 transition-all active:scale-95">
              {loading ? 'Saving...' : 'Record Payout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}