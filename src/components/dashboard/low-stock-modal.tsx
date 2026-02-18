'use client';

import { exportLowStockPDF } from '../../lib/utils/pdf-helper';
import { ShoppingBag, AlertCircle, CheckCircle2, X } from "lucide-react";

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
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 dark:border-slate-800 flex justify-between items-start shrink-0">
          <div className="flex gap-4">
            <div className="p-3 bg-teal-50 dark:bg-[#008489]/20 rounded-2xl text-[#008489]">
              <ShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#484848] dark:text-white tracking-tight">Inventory Checklist</h2>
              <p className="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] mt-1">
                {propertyName} • <span className={lowCount > 0 ? "text-[#FF5A5F]" : "text-[#008489]"}>{lowCount} Alerts</span>
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 dark:text-slate-500 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {physicalItems.length === 0 ? (
            <div className="text-center py-20 text-gray-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">
              No physical inventory items found.
            </div>
          ) : (
            <div className="space-y-3 px-4">
              {sortedItems.map((item) => {
                const isLow = item.quantity <= item.min_stock;
                
                return (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-5 rounded-[2rem] border-2 transition-all ${
                      isLow 
                        ? 'bg-red-50/30 dark:bg-red-500/5 border-red-100 dark:border-red-500/20 shadow-sm shadow-red-500/5' 
                        : 'bg-white dark:bg-slate-900 border-gray-50 dark:border-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {isLow ? (
                        <AlertCircle className="text-[#FF5A5F] animate-pulse" size={18} />
                      ) : (
                        <CheckCircle2 className="text-[#008489]" size={18} />
                      )}
                      <div>
                        <p className={`font-black uppercase text-sm tracking-tight ${isLow ? 'text-[#FF5A5F]' : 'text-[#484848] dark:text-slate-200'}`}>
                          {item.name}
                        </p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                          Current: {item.quantity} <span className="mx-1">•</span> Min: {item.min_stock}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      {isLow ? (
                        <div className="bg-[#FF5A5F] text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-tighter shadow-lg shadow-red-500/20">
                          Order +{(item.min_stock * 2) - item.quantity}
                        </div>
                      ) : (
                        <div className="text-[10px] font-black text-[#008489] uppercase tracking-widest">
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
        <div className="p-8 bg-gray-50 dark:bg-slate-800/50 border-t border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 shrink-0">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 hover:text-[#484848] dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            Close
          </button>
          <button 
            disabled={physicalItems.length === 0}
            onClick={() => exportLowStockPDF(physicalItems, propertyName)}
            className="flex-[2] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] bg-[#008489] text-white shadow-lg shadow-[#008489]/20 hover:brightness-110 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            Download Restock List (PDF)
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 10px; 
        }
        :global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}</style>
    </div>
  );
}