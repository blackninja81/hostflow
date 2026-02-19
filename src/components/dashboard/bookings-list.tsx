'use client'

import { useState } from 'react'
import { deleteBooking } from '../../app/dashboard/actions'
import { Trash2, Edit3, Calendar, CheckCircle2, User, ArrowRight, Clock } from 'lucide-react'
import EditBookingModal from './edit-booking-modal'

function BookingRow({ booking, propertyId }: { booking: any, propertyId: string }) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkInDate = new Date(booking.check_in);
  checkInDate.setHours(0, 0, 0, 0);
  const checkOutDate = new Date(booking.check_out);
  checkOutDate.setHours(0, 0, 0, 0);

  const isCurrentGuest = today >= checkInDate && today < checkOutDate;
  const isPastGuest = checkOutDate <= today;
  const isFutureGuest = checkInDate > today;

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

  const styles = {
    current: {
      container: 'bg-green-50/50 dark:bg-green-500/10 border-green-400 dark:border-green-500/50 shadow-md shadow-green-500/10',
      icon: 'bg-green-500 text-white',
      badge: 'bg-green-500 text-white',
      badgeIcon: CheckCircle2,
      badgeText: 'Active',
      name: 'text-[#484848] dark:text-white',
      amount: 'text-green-600 dark:text-green-400',
      calendar: 'text-green-500',
      accentDot: 'bg-green-500'
    },
    future: {
      container: 'bg-blue-50/30 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 shadow-sm',
      icon: 'bg-blue-500 text-white',
      badge: 'bg-blue-500 text-white',
      badgeIcon: Clock,
      badgeText: 'Upcoming',
      name: 'text-[#484848] dark:text-white',
      amount: 'text-blue-600 dark:text-blue-400',
      calendar: 'text-blue-500',
      accentDot: 'bg-blue-500'
    },
    past: {
      container: 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 opacity-60 hover:opacity-100',
      icon: 'bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400',
      badge: 'bg-gray-400 dark:bg-slate-700 text-white',
      badgeIcon: CheckCircle2,
      badgeText: 'Past',
      name: 'text-gray-500 dark:text-slate-400',
      amount: 'text-gray-500 dark:text-slate-400',
      calendar: 'text-gray-400 dark:text-slate-600',
      accentDot: 'bg-gray-400 dark:bg-slate-700'
    }
  };

  const currentStyle = isCurrentGuest ? styles.current : isFutureGuest ? styles.future : styles.past;
  const BadgeIcon = currentStyle.badgeIcon;

  return (
    <div className={`relative group transition-all duration-300 rounded-[2rem] p-5 border-2 ${
      currentStyle.container
    } ${isDeleting ? 'scale-95 opacity-20' : ''}`}>
      
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`hidden sm:flex p-3 rounded-2xl ${currentStyle.icon} shrink-0`}>
            <User size={18} />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className={`font-black text-lg truncate ${currentStyle.name}`}>
                {booking.guest_name}
              </h3>
              {!isPastGuest && (
                <span className={`flex items-center gap-1 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm ${currentStyle.badge}`}>
                  <BadgeIcon size={10} className="animate-pulse" />
                  {currentStyle.badgeText}
                </span>
              )}
              {isPastGuest && (
                <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${currentStyle.badge}`}>
                  {currentStyle.badgeText}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-gray-400 dark:text-slate-500">
              <Calendar size={13} className={currentStyle.calendar} />
              <span className="text-xs font-bold tracking-tight">
                {new Date(booking.check_in).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
              </span>
              <ArrowRight size={10} className="text-gray-300 dark:text-slate-700" />
              <span className="text-xs font-bold tracking-tight">
                {new Date(booking.check_out).toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">Payout</p>
            <p className={`text-xl font-black ${currentStyle.amount}`}>
              KSh {Number(booking.payout_amount).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 border-l border-gray-100 dark:border-slate-800 pl-4">
            <button 
              onClick={() => setIsEditOpen(true)} 
              className="p-2 text-gray-400 hover:text-[#008489] dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              <Edit3 size={18} />
            </button>
            <button 
              onClick={handleDelete} 
              className="p-2 text-gray-400 hover:text-[#FF5A5F] dark:hover:bg-red-500/10 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {isEditOpen && (
        <EditBookingModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} booking={booking} propertyId={propertyId} />
      )}
    </div>
  )
}

export default function BookingsList({ bookings = [], propertyId }: { bookings: any[], propertyId: string }) {
  const sortedBookings = [...bookings].sort((a, b) => {
    return new Date(b.check_in).getTime() - new Date(a.check_in).getTime();
  });

  const today = new Date();
  today.setHours(0,0,0,0);
  const counts = bookings.reduce((acc, booking) => {
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    if (today >= checkIn && today < checkOut) acc.current++;
    else if (checkIn > today) acc.future++;
    else acc.past++;
    return acc;
  }, { current: 0, future: 0, past: 0 });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-max[600px] transition-colors duration-500">
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">Guest History</span>
          {counts.current > 0 && (
            <span className="flex items-center gap-1 text-[8px] font-black bg-green-50 dark:bg-green-500/20 text-green-600 dark:text-green-400 px-2 py-1 rounded-full uppercase">
              {counts.current} Active
            </span>
          )}
        </div>
        <span className="text-[10px] font-black text-[#008489] uppercase tracking-[0.2em]">Revenue</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-30">
            <Calendar size={48} className="text-gray-300 mb-2" />
            <p className="text-[10px] font-black uppercase tracking-widest">No Bookings</p>
          </div>
        ) : (
          sortedBookings.map((b) => (
            <BookingRow key={b.id} booking={b} propertyId={propertyId} />
          ))
        )}
      </div>
    </div>
  )
}