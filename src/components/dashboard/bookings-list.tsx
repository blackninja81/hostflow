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

  // Determine guest status
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

  // Style configurations based on guest status
  const styles = {
    current: {
      container: 'bg-green-50/50 border-green-400 shadow-md shadow-green-500/10',
      icon: 'bg-green-500 text-white',
      badge: 'bg-green-500 text-white',
      badgeIcon: CheckCircle2,
      badgeText: 'Active',
      name: 'text-[#484848]',
      amount: 'text-green-600',
      calendar: 'text-green-500',
      accentDot: 'bg-green-500'
    },
    future: {
      container: 'bg-blue-50/30 border-blue-200 shadow-sm',
      icon: 'bg-blue-500 text-white',
      badge: 'bg-blue-500 text-white',
      badgeIcon: Clock,
      badgeText: 'Upcoming',
      name: 'text-[#484848]',
      amount: 'text-blue-600',
      calendar: 'text-blue-500',
      accentDot: 'bg-blue-500'
    },
    past: {
      container: 'bg-white border-gray-200 opacity-60 hover:opacity-100',
      icon: 'bg-gray-300 text-gray-500',
      badge: 'bg-gray-400 text-white',
      badgeIcon: CheckCircle2,
      badgeText: 'Past',
      name: 'text-gray-500',
      amount: 'text-gray-500',
      calendar: 'text-gray-400',
      accentDot: 'bg-gray-400'
    }
  };

  const currentStyle = isCurrentGuest ? styles.current : isFutureGuest ? styles.future : styles.past;
  const BadgeIcon = currentStyle.badgeIcon;

  return (
    <div className={`relative group transition-all duration-300 rounded-[2rem] p-5 border-2 ${
      currentStyle.container
    } ${isDeleting ? 'scale-95 opacity-20' : ''}`}>
      
      <div className="flex items-center justify-between gap-4">
        
        {/* LEFT: GUEST INFO */}
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
            
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={13} className={currentStyle.calendar} />
              <span className="text-xs font-bold tracking-tight">
                {new Date(booking.check_in).toLocaleDateString('en-KE', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
              <ArrowRight size={10} className="text-gray-300" />
              <span className="text-xs font-bold tracking-tight">
                {new Date(booking.check_out).toLocaleDateString('en-KE', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>

            {/* Platform badge if available */}
            {booking.platform && (
              <div className="mt-1 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${currentStyle.accentDot}`}></span>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                  {booking.platform}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: FINANCIALS & ACTIONS */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-right">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
              Payout
            </p>
            <p className={`text-xl font-black ${currentStyle.amount}`}>
              KSh {Number(booking.payout_amount).toLocaleString()}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-1 border-l border-gray-200 pl-4">
            <button 
              onClick={() => setIsEditOpen(true)} 
              className="p-2 text-gray-400 hover:text-[#008489] hover:bg-teal-50 rounded-xl transition-all"
              title="Edit booking"
            >
              <Edit3 size={18} />
            </button>
            <button 
              onClick={handleDelete} 
              className="p-2 text-gray-400 hover:text-[#FF5A5F] hover:bg-red-50 rounded-xl transition-all"
              disabled={isDeleting}
              title="Delete booking"
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
  // Sort bookings: current guests first, then future, then past
  const sortedBookings = [...bookings].sort((a, b) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const aCheckIn = new Date(a.check_in);
    aCheckIn.setHours(0, 0, 0, 0);
    const aCheckOut = new Date(a.check_out);
    aCheckOut.setHours(0, 0, 0, 0);
    
    const bCheckIn = new Date(b.check_in);
    bCheckIn.setHours(0, 0, 0, 0);
    const bCheckOut = new Date(b.check_out);
    bCheckOut.setHours(0, 0, 0, 0);
    
    const aIsCurrent = today >= aCheckIn && today < aCheckOut;
    const bIsCurrent = today >= bCheckIn && today < bCheckOut;
    const aIsFuture = aCheckIn > today;
    const bIsFuture = bCheckIn > today;
    
    // Current guests first
    if (aIsCurrent && !bIsCurrent) return -1;
    if (!aIsCurrent && bIsCurrent) return 1;
    
    // Then future guests
    if (aIsFuture && !bIsFuture) return -1;
    if (!aIsFuture && bIsFuture) return 1;
    
    // Within same category, sort by date (newest first)
    return new Date(b.check_in).getTime() - new Date(a.check_in).getTime();
  });

  // Get counts for each category
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const counts = bookings.reduce((acc, booking) => {
    const checkIn = new Date(booking.check_in);
    checkIn.setHours(0, 0, 0, 0);
    const checkOut = new Date(booking.check_out);
    checkOut.setHours(0, 0, 0, 0);
    
    if (today >= checkIn && today < checkOut) acc.current++;
    else if (checkIn > today) acc.future++;
    else acc.past++;
    
    return acc;
  }, { current: 0, future: 0, past: 0 });

  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[600px]">
      {/* Header with stats - Sticky */}
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            Guest History
          </span>
          {counts.current > 0 && (
            <span className="flex items-center gap-1 text-[8px] font-black bg-green-50 text-green-600 px-2 py-1 rounded-full uppercase">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              {counts.current} Active
            </span>
          )}
          {counts.future > 0 && (
            <span className="text-[8px] font-black bg-blue-50 text-blue-600 px-2 py-1 rounded-full uppercase">
              {counts.future} Upcoming
            </span>
          )}
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
          Revenue
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent p-4">
        {sortedBookings.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">
                No Bookings Yet
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Add your first booking to start tracking revenue
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedBookings.map((b) => (
              <BookingRow key={b.id} booking={b} propertyId={propertyId} />
            ))}
          </div>
        )}
      </div>

      {/* Subtle Bottom Fade */}
      <div className="h-4 bg-gradient-to-t from-gray-50/50 to-transparent sticky bottom-0 pointer-events-none" />
    </div>
  )
}