'use client'

import { useState } from 'react'
import { Package, Plus, Minus, Edit3, Trash2, AlertTriangle, ChevronRight } from 'lucide-react'
import { updateInventoryStock } from '../../app/dashboard/actions'

function InventoryCard({ item, propertyId }: { item: any, propertyId: string }) {
  const [loading, setLoading] = useState(false)
  
  // Logic: Highlight if stock is below the threshold
  const isLowStock = !item.is_permanent && item.current_stock <= (item.min_stock || 5)

  const handleStockChange = async (change: number) => {
    if (loading) return
    const newStock = item.current_stock + change
    if (newStock < 0) return

    setLoading(true)
    try {
      // actionType helps the history log distinguish between usage and restocked items
      await updateInventoryStock(
        item.id, 
        newStock, 
        propertyId, 
        change > 0 ? 'RESTOCK' : 'DISPATCH'
      )
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`relative transition-all duration-300 rounded-[2.5rem] p-6 mb-4 border-2 flex items-center justify-between gap-6 ${
      isLowStock 
        ? 'bg-red-50/40 border-red-100 shadow-sm' 
        : 'bg-white border-gray-100 shadow-sm hover:border-[#008489]/30'
    } ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
      
      {/* LEFT: ITEM IDENTITY */}
      <div className="flex items-center gap-5 flex-1 min-w-0">
        <div className={`p-4 rounded-[1.25rem] transition-colors ${
          isLowStock ? 'bg-red-100 text-red-600' : 'bg-teal-50 text-[#008489]'
        }`}>
          <Package size={24} />
        </div>
        
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-black text-lg text-[#484848] uppercase tracking-tight truncate">
              {item.name}
            </h3>
            {isLowStock && (
              <span className="flex items-center gap-1 text-[9px] font-black bg-red-500 text-white px-2.5 py-1 rounded-full uppercase tracking-widest animate-pulse">
                <AlertTriangle size={10} /> Low Stock
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs font-bold text-gray-400">
              Value: <span className="text-[#008489]">KSh {Number(item.unit_price || item.cost_per_unit).toLocaleString()}</span>
            </p>
            {item.is_permanent && (
              <span className="text-[9px] font-black bg-teal-100 text-[#008489] px-2 py-0.5 rounded uppercase tracking-tighter">
                Utility
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: THE ACTION ZONE */}
      <div className="flex items-center gap-4 md:gap-8">
        
        {/* STOCK CONTROLLER */}
        {!item.is_permanent && (
          <div className="flex items-center bg-gray-50 p-1.5 rounded-[1.5rem] border border-gray-100 shadow-inner">
            <button 
              onClick={() => handleStockChange(-1)}
              disabled={item.current_stock <= 0}
              className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-white rounded-xl transition-all disabled:opacity-20"
            >
              <Minus size={18} />
            </button>
            
            <div className="px-4 text-center min-w-[70px]">
              <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Quantity</p>
              <p className={`text-2xl font-black leading-none ${isLowStock ? 'text-red-600' : 'text-[#484848]'}`}>
                {item.current_stock}
              </p>
            </div>

            <button 
              onClick={() => handleStockChange(1)}
              className="p-2.5 text-gray-400 hover:text-[#008489] hover:bg-white rounded-xl transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
        )}

        {/* SETTINGS MENU */}
        <div className="flex items-center gap-1 border-l border-gray-100 pl-4 sm:pl-8">
          <button className="p-3 text-gray-300 hover:text-[#008489] hover:bg-teal-50 rounded-2xl transition-all">
            <Edit3 size={20} />
          </button>
          <button className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all">
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function InventoryList({ inventory = [], propertyId }: { inventory: any[], propertyId: string }) {
  return (
    <div className="w-full">
      {/* HEADER LABELS */}
      <div className="px-8 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Item Details</span>
        </div>
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Management</span>
      </div>

      <div className="space-y-1">
        {inventory.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border-2 border-dashed border-gray-100">
            <p className="text-sm font-bold text-gray-300 uppercase tracking-widest">No inventory items found</p>
          </div>
        ) : (
          inventory.map((item) => (
            <InventoryCard key={item.id} item={item} propertyId={propertyId} />
          ))
        )}
      </div>
    </div>
  )
}