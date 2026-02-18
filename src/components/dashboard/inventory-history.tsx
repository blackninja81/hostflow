'use client';

import { ArrowUp, ArrowDown } from "lucide-react";

const formatKSh = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount).replace('KES', 'KSh');
};

export default function InventoryHistory({ logs }: { logs: any[] }) {
  return (
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
        <h3 className="text-xs font-black text-[#484848] uppercase tracking-[0.2em]">
          Activity Log
        </h3>
        <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1 rounded-full uppercase">
          {logs.length} entries
        </span>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-gray-200">
        {logs.length === 0 ? (
          <p className="p-12 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
            No activity recorded yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log) => {
              const isRestock = log.action_type === 'RESTOCK';
              const price = Number(log.price_at_time || 0);
              const amount = Math.abs(log.quantity || 0);
              const totalFinancialImpact = price * amount;

              return (
                <div 
                  key={log.id} 
                  className="p-5 hover:bg-gray-50/80 transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    {/* Direction Icon */}
                    <div className={`p-3 rounded-xl transition-colors ${
                      isRestock 
                        ? 'bg-[#008489]/10 text-[#008489]' 
                        : 'bg-gray-100 text-gray-400'
                    }`}>
                      {isRestock ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-black text-[#484848] uppercase tracking-tight">
                          {log.item_name}
                        </p>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase whitespace-nowrap ${
                          isRestock 
                            ? 'bg-[#008489]/10 text-[#008489]' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {isRestock ? 'Restock' : 'Dispatch'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                        {new Date(log.transaction_date || log.created_at).toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                        {' • '}
                        {new Date(log.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Amount and Cost Column */}
                  <div className="text-right">
                    <p className={`text-sm font-black ${
                      isRestock ? 'text-[#008489]' : 'text-gray-600'
                    }`}>
                      {isRestock ? '+' : '-'}{amount}
                    </p>
                    
                    {/* Only show price if it's a restock (Expense) */}
                    {isRestock && totalFinancialImpact > 0 && (
                      <p className="text-[10px] font-bold text-[#FF5A5F] mt-1">
                        -{formatKSh(totalFinancialImpact)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Subtle Bottom Fade */}
      <div className="h-4 bg-gradient-to-t from-gray-50/50 to-transparent sticky bottom-0 pointer-events-none" />
    </div>
  );
}