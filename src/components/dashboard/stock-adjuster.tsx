'use client'

import { adjustStock } from '../../app/dashboard/actions'
import { useState } from 'react'
import { Plus, Minus, Banknote, Loader2 } from 'lucide-react'

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
    if (isPermanent && defaultPrice === 0 && !variablePrice) {
      alert("Please enter a cost for this utility.");
      return;
    }

    setLoading(true)
    const type = mode === 'add' ? 'RESTOCK' : 'DISPATCH'
    const finalPrice = variablePrice ? parseFloat(variablePrice) : undefined;
    
    try {
      await adjustStock(itemId, propertyId, count, type, finalPrice)
      setCount(1)
      if (defaultPrice === 0) setVariablePrice("") 
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-700/50 transition-colors">
      
      {isPermanent ? (
        <div className="flex items-center gap-2">
          {/* Variable Utility Input */}
          {defaultPrice === 0 ? (
            <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 px-3 py-1.5 shadow-sm focus-within:border-[#008489] transition-all">
              <span className="text-[10px] font-black text-[#008489] mr-1">KSh</span>
              <input 
                type="number"
                placeholder="0.00"
                value={variablePrice}
                onChange={(e) => setVariablePrice(e.target.value)}
                className="w-20 bg-transparent font-black text-xs text-[#484848] dark:text-white outline-none placeholder:text-gray-300 dark:placeholder:text-slate-600"
              />
            </div>
          ) : (
            <div className="px-3 py-2 flex items-center gap-1.5 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-tight">
              <Banknote size={12} />
              {new Intl.NumberFormat('en-KE').format(defaultPrice)} KSh / unit
            </div>
          )}

          <button
            type="button"
            onClick={() => handleApply('subtract')}
            disabled={loading}
            className="px-4 py-2.5 bg-[#008489] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-md shadow-[#008489]/20 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : 'Log Bill'}
          </button>
        </div>
      ) : (
        // --- Standard Physical Inventory UI ---
        <>
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <button 
              type="button" 
              onClick={() => setCount(Math.max(1, count - 1))} 
              className="px-3 py-2 text-gray-400 dark:text-slate-500 hover:text-[#FF5A5F] transition-colors disabled:opacity-20 cursor-pointer" 
              disabled={loading}
            >
              <Minus size={14} />
            </button>
            <span className="px-2 py-2 text-[11px] font-black text-[#484848] dark:text-white min-w-[30px] text-center">
              {count}
            </span>
            <button 
              type="button" 
              onClick={() => setCount(count + 1)} 
              className="px-3 py-2 text-gray-400 dark:text-slate-500 hover:text-[#008489] transition-colors cursor-pointer" 
              disabled={loading}
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="flex gap-1.5">
            <button 
              onClick={() => handleApply('subtract')} 
              disabled={loading}
              className="px-4 py-2.5 bg-white dark:bg-slate-900 text-gray-500 dark:text-slate-400 border border-gray-200 dark:border-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-slate-900 transition-all shadow-sm cursor-pointer"
            >
              Usage
            </button>
            <button 
              onClick={() => handleApply('add')} 
              disabled={loading}
              className="px-4 py-2.5 bg-[#008489] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 transition-all shadow-md shadow-[#008489]/20 cursor-pointer"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : 'Restock'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}