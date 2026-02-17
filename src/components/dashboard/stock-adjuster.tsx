'use client'
import { adjustStock } from '../../app/dashboard/actions'
import { useState } from 'react'

export default function StockAdjuster({ itemId, propertyId, isPermanent, defaultPrice }: { 
  itemId: string, 
  propertyId: string, 
  isPermanent: boolean,
  defaultPrice: number 
}) {
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  
  // Initialize with empty string if price is 0 to force manual entry
  const [variablePrice, setVariablePrice] = useState<string>(defaultPrice > 0 ? defaultPrice.toString() : "")

  const handleApply = async (mode: 'add' | 'subtract') => {
    // If it's a variable utility and no price is entered, stop here
    if (isPermanent && defaultPrice === 0 && !variablePrice) {
      alert("Please enter a cost for this utility.");
      return;
    }

    setLoading(true)
    const type = mode === 'add' ? 'RESTOCK' : 'DISPATCH'
    const finalPrice = variablePrice ? parseFloat(variablePrice) : undefined;
    
    try {
      await adjustStock(itemId, propertyId, count, type, finalPrice)
      
      // RESET LOGIC
      setCount(1)
      if (defaultPrice === 0) {
        setVariablePrice("") // Clear the field if it's a variable item
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
      
      {isPermanent ? (
        <div className="flex items-center gap-2">
          {/* Only show input if defaultPrice is 0 (Variable Item) */}
          {defaultPrice === 0 ? (
            <div className="flex items-center bg-white rounded-xl border border-gray-200 px-3 py-1 shadow-sm focus-within:border-[#008489] transition-all">
              <span className="text-[10px] font-bold text-gray-400 mr-1">KSh</span>
              <input 
                type="number"
                placeholder="0.00"
                value={variablePrice}
                onChange={(e) => setVariablePrice(e.target.value)}
                className="w-20 bg-transparent font-bold text-xs text-[#484848] outline-none"
              />
            </div>
          ) : (
            <div className="px-3 py-2 text-[10px] font-black text-gray-400 uppercase">
              {new Intl.NumberFormat('en-KE').format(defaultPrice)} KSh / stay
            </div>
          )}

          <button
            type="button"
            onClick={() => handleApply('subtract')}
            disabled={loading}
            className="px-4 py-2 bg-[#008489] text-white rounded-xl text-[10px] font-bold uppercase hover:bg-[#006c70] transition-all shadow-sm disabled:opacity-50"
          >
            {loading ? '...' : 'Apply Bill'}
          </button>
        </div>
      ) : (
        // --- Standard Physical Inventory UI ---
        <>
          <div className="flex items-center bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <button type="button" onClick={() => setCount(Math.max(1, count - 1))} className="px-3 py-1.5 text-gray-400 disabled:opacity-20" disabled={loading}>−</button>
            <span className="px-4 py-1.5 text-[11px] font-bold text-[#484848] min-w-[35px] text-center">{count}</span>
            <button type="button" onClick={() => setCount(count + 1)} className="px-3 py-1.5 text-gray-400" disabled={loading}>+</button>
          </div>
          <div className="flex gap-1.5">
            <button 
              onClick={() => handleApply('subtract')} 
              disabled={loading}
              className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-xl text-[10px] font-bold uppercase hover:bg-gray-800 hover:text-white transition-all shadow-sm"
            >
              Dispatch
            </button>
            <button 
              onClick={() => handleApply('add')} 
              disabled={loading}
              className="px-4 py-2 bg-[#008489] text-white rounded-xl text-[10px] font-bold uppercase hover:bg-[#006c70] transition-all shadow-sm"
            >
              Restock
            </button>
          </div>
        </>
      )}
    </div>
  )
}