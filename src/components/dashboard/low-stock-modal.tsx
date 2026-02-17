'use client'

import { exportLowStockPDF } from '../../lib/utils/pdf-helper';

interface LowStockModalProps {
  items: any[];
  propertyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function LowStockModal({ items, propertyName, isOpen, onClose }: LowStockModalProps) {
  if (!isOpen) return null;

  // Filter for items that are actually low and NOT permanent utilities
  const lowStockItems = items.filter(
    (item) => !item.is_permanent && item.quantity <= item.min_stock
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-[#484848] tracking-tight">Shopping List</h2>
            <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">
              {lowStockItems.length} Items requiring attention
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-8 max-h-[50vh] overflow-y-auto">
          {lowStockItems.length === 0 ? (
            <div className="text-center py-10 text-gray-400 italic font-medium">
              All physical stock levels are healthy!
            </div>
          ) : (
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                  <th className="px-4 pb-2">Supply Item</th>
                  <th className="px-4 pb-2 text-center">Status</th>
                  <th className="px-4 pb-2 text-right">Order Goal</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map((item) => (
                  <tr key={item.id} className="bg-gray-50/50 rounded-xl overflow-hidden">
                    <td className="px-4 py-4 font-bold text-[#484848] rounded-l-xl">
                      {item.name}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-xs font-black text-[#FF5A5F] bg-red-50 px-2 py-1 rounded-lg">
                        {item.quantity} LEFT
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-gray-400 rounded-r-xl">
                      +{(item.min_stock * 2) - item.quantity} units
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-2xl font-bold text-gray-400 hover:text-[#484848] transition-colors"
          >
            Cancel
          </button>
          <button 
            disabled={lowStockItems.length === 0}
            onClick={() => exportLowStockPDF(lowStockItems, propertyName)}
            className="flex-[2] px-6 py-4 rounded-2xl font-bold bg-[#008489] text-white shadow-lg shadow-[#008489]/20 hover:bg-[#006c70] disabled:opacity-50 disabled:grayscale transition-all"
          >
            Download PDF Purchase Order
          </button>
        </div>
      </div>
    </div>
  );
}