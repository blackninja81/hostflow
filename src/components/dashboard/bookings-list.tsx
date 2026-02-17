'use client'

import { useState } from 'react'
import { deleteBooking } from '../../app/dashboard/actions'
import { Trash2, Edit3, Calendar, CheckCircle2, User, ArrowRight } from 'lucide-react'
import EditBookingModal from './edit-booking-modal'

function BookingRow({ booking, propertyId }: { booking: any, propertyId: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkOutDate = new Date(booking.check_out);
  const isPresentOrFuture = checkOutDate >= today;

  const handleDelete = async () => {
    if (!booking.id) return
    if (!confirm(`Delete booking for ${booking.guest_name}?`)) return
    setIsDeleting(true)
    try {
      await deleteBooking(booking.id, propertyId)
    } catch (e: any) {
      alert(e.message)
      setIsDeleting(false)
    }
  }

  return (
    <div className={`relative group transition-all duration-300 rounded-[2rem] p-5 mb-3 border-2 ${
      isPresentOrFuture 
        ? 'bg-white border-[#008489] shadow-md shadow-[#008489]/5' 
        : 'bg-gray-50/50 border-transparent opacity-70 hover:opacity-100 hover:bg-white hover:border-gray-200'
    } ${isDeleting ? 'scale-95 opacity-20' : ''}`}>
      
      <div className="flex items-center justify-between gap-4">
        
        {/* LEFT: GUEST INFO */}
        <div className="flex items-center gap-4 flex-1">
          <div className={`hidden sm:flex p-3 rounded-2xl ${isPresentOrFuture ? 'bg-[#008489] text-white' : 'bg-gray-200 text-gray-400'}`}>
            <User size={18} />
          </div>
          
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className={`font-black text-lg truncate ${isPresentOrFuture ? 'text-[#484848]' : 'text-gray-500'}`}>
                {booking.guest_name}
              </h3>
              {isPresentOrFuture && (
                <span className="flex items-center gap-1 text-[9px] font-black bg-[#008489] text-white px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                  <CheckCircle2 size={10} /> Live
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 mt-1 text-gray-400">
              <Calendar size={13} className={isPresentOrFuture ? "text-[#008489]" : ""} />
              <span className="text-xs font-bold tracking-tight">
                {booking.check_in}
              </span>
              <ArrowRight size={10} className="text-gray-300" />
              <span className="text-xs font-bold tracking-tight">
                {booking.check_out}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: FINANCIALS & ACTIONS */}
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Payout</p>
            <p className={`text-xl font-black ${isPresentOrFuture ? 'text-[#008489]' : 'text-gray-500'}`}>
              KSh {Number(booking.payout_amount).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 border-l border-gray-100 pl-4">
            <button 
              onClick={() => setIsEditOpen(true)} 
              className="p-2 text-gray-400 hover:text-[#008489] hover:bg-teal-50 rounded-xl transition-all"
            >
              <Edit3 size={18} />
            </button>
            <button 
              onClick={handleDelete} 
              className="p-2 text-gray-400 hover:text-[#FF5A5F] hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <EditBookingModal 
          isOpen={isEditOpen} 
          onClose={() => setIsEditOpen(false)} 
          booking={booking} 
          propertyId={propertyId} 
        />
      )}
    </div>
  )
}

export default function BookingsList({ bookings = [], propertyId }: { bookings: any[], propertyId: string }) {
  const sortedBookings = [...bookings].sort((a, b) => {
    const today = new Date().setHours(0,0,0,0);
    const aActive = new Date(a.check_out).getTime() >= today;
    const bActive = new Date(b.check_out).getTime() >= today;
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;
    return new Date(b.check_in).getTime() - new Date(a.check_in).getTime();
  });

  return (
    <div className="space-y-1">
      <div className="px-6 mb-4 flex justify-between items-center">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Guest History</span>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Revenue</span>
      </div>

      {sortedBookings.length === 0 ? (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100">
           <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">No Bookings Yet</p>
        </div>
      ) : (
        sortedBookings.map((b) => (
          <BookingRow key={b.id} booking={b} propertyId={propertyId} />
        ))
      )}
    </div>
  )
}