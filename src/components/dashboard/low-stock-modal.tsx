'use client'

import { exportLowStockPDF } from '../../lib/utils/pdf-helper';
import { ShoppingBag, AlertCircle, CheckCircle2 } from "lucide-react";

interface LowStockModalProps {
  items: any[];
  propertyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LowStockModal({ items, propertyName, isOpen, onClose }: LowStockModalProps) {
  if (!isOpen) return null;

  // Filter for all physical/consumable items (Excludes permanent utilities like WiFi/Electricity)
  const physicalItems = items.filter((item) => !item.is_permanent);

  // Sort: Put low stock items at the top so they are seen first
  const sortedItems = [...physicalItems].sort((a, b) => {
    const aLow = a.quantity <= a.min_stock;
    const bLow = b.quantity <= b.min_stock;
    return aLow === bLow ? 0 : aLow ? -1 : 1;
  });

  const lowCount = physicalItems.filter(i => i.quantity <= i.min_stock).length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-start">
          <div className="flex gap-4">
            <div className="p-3 bg-teal-50 rounded-2xl text-[#008489]">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#484848] tracking-tight">Inventory Checklist</h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
                {propertyName} • {lowCount} Alerts
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-2 max-h-[60vh] overflow-y-auto">
          {physicalItems.length === 0 ? (
            <div className="text-center py-20 text-gray-400 font-bold uppercase tracking-widest text-xs">
              No physical inventory items found.
            </div>
          ) : (
            <div className="space-y-2 p-4">
              {sortedItems.map((item) => {
                const isLow = item.quantity <= item.min_stock;
                
                return (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-5 rounded-3xl border-2 transition-all ${
                      isLow 
                        ? 'bg-red-50/30 border-red-100' 
                        : 'bg-white border-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {isLow ? (
                        <AlertCircle className="text-[#FF5A5F]" size={18} />
                      ) : (
                        <CheckCircle2 className="text-teal-500" size={18} />
                      )}
                      <div>
                        <p className={`font-black uppercase text-sm ${isLow ? 'text-[#FF5A5F]' : 'text-[#484848]'}`}>
                          {item.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          Current: {item.quantity} / Min: {item.min_stock}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isLow ? (
                        <div className="bg-[#FF5A5F] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter">
                          Order +{(item.min_stock * 2) - item.quantity}
                        </div>
                      ) : (
                        <div className="text-[10px] font-black text-teal-600 uppercase tracking-widest">
                          Healthy
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-[#484848] transition-colors"
          >
            Close
          </button>
          <button 
            disabled={physicalItems.length === 0}
            onClick={() => exportLowStockPDF(physicalItems, propertyName)}
            className="flex-[2] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-[#008489] text-white shadow-lg shadow-[#008489]/20 hover:bg-[#006c70] transition-all hover:scale-[1.02]"
          >
            Download Full Restock List (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}