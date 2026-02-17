'use client'

import { useState } from 'react'
import { updateBooking } from '../../app/dashboard/actions'

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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
        <h2 className="text-2xl font-black text-[#484848] mb-6">Edit Booking</h2>
        <form action={handleSubmit} className="space-y-4">
          {/* Ensure the name matches the server action EXACTLY */}
          <input type="hidden" name="bookingId" value={booking.id} />
          
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Guest</label>
            <input name="guest_name" defaultValue={booking.guest_name} required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#008489]" />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase ml-2">Payout (KSh)</label>
            <input name="payout_amount" type="number" defaultValue={booking.payout_amount} required className="w-full p-4 bg-gray-50 rounded-2xl border border-gray-100 outline-none focus:border-[#008489]" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input name="check_in" type="date" defaultValue={booking.check_in} className="p-4 bg-gray-50 rounded-2xl border border-gray-100" />
            <input name="check_out" type="date" defaultValue={booking.check_out} className="p-4 bg-gray-50 rounded-2xl border border-gray-100" />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 font-bold text-gray-400">Cancel</button>
            <button disabled={loading} className="flex-[2] p-4 bg-[#008489] text-white rounded-2xl font-bold shadow-lg shadow-[#008489]/20 transition-all">
              {loading ? 'Saving...' : 'Update Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}