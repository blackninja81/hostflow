'use client'

import { adjustStock } from '../../app/dashboard/actions'
import { useState } from 'react'

export default function RestockButton({ itemId, propertyId }: { itemId: string, propertyId: string }) {
  const [loading, setLoading] = useState(false)

const handleRestock = async () => {
  setLoading(true);
  try {
    await adjustStock(itemId, propertyId, 50, 'RESTOCK');
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};

  return (
    <button 
      onClick={handleRestock}
      disabled={loading}
      className="p-1.5 text-gray-400 hover:text-[#008489] transition-all hover:scale-110 disabled:opacity-50"
      title="Restock Box (+50)"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3"/><path d="m21 12-9-4-9 4V19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M12 21v-9"/>
      </svg>
    </button>
  )
}