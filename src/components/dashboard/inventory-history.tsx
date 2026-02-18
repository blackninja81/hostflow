'use client';

import { ArrowUp, ArrowDown, History, Clock } from "lucide-react";

const formatKSh = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount).replace('KES', 'KSh');
};

export default function InventoryHistory({ logs }: { logs: any[] }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[500px] transition-colors duration-500">
      {/* Header - Sticky */}
      <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <History size={16} className="text-[#008489]" />
          <h3 className="text-xs font-black text-[#484848] dark:text-white uppercase tracking-[0.2em]">
            Activity Log
          </h3>
        </div>
        <span className="text-[10px] font-black bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 px-3 py-1 rounded-full uppercase">
          {logs?.length || 0} Records Found
        </span>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {!logs || logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30">
            <Clock size={32} className="text-gray-300 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest italic leading-relaxed dark:text-slate-400">
              No activity recorded for<br/>the selected period.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
            {logs.map((log) => {
              const isRestock = log.action_type === 'RESTOCK';
              const qty = Math.abs(log.quantity || log.amount || 0);
              const price = Number(log.price_at_time || 0);
              const totalCost = price * qty;
              
              const displayDate = new Date(log.transaction_date || log.logged_at || log.created_at);

              return (
                <div key={log.id} className="p-5 hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    {/* Direction Icon */}
                    <div className={`p-3 rounded-xl transition-colors ${
                      isRestock 
                        ? 'bg-[#008489]/10 dark:bg-[#008489]/20 text-[#008489]' 
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500'
                    }`}>
                      {isRestock ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-black text-[#484848] dark:text-slate-200 uppercase tracking-tight">
                          {log.item_name || 'Supply Item'}
                        </p>
                        <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase whitespace-nowrap ${
                          isRestock 
                            ? 'bg-[#008489]/10 dark:bg-[#008489]/20 text-[#008489]' 
                            : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'
                        }`}>
                          {isRestock ? 'Restock' : 'Dispatch'}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                        {displayDate.toLocaleDateString('en-KE', {
                          day: 'numeric',
                          month: 'short'
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
                      isRestock ? 'text-[#008489]' : 'text-gray-600 dark:text-slate-400'
                    }`}>
                      {isRestock ? '+' : '-'}{qty}
                    </p>
                    
                    {isRestock && totalCost > 0 && (
                      <p className="text-[10px] font-bold text-[#FF5A5F] mt-1">
                        -{formatKSh(totalCost)}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: var(--scrollbar-thumb, #f1f1f1); 
          border-radius: 10px; 
        }
        :global(.dark) .custom-scrollbar {
          --scrollbar-thumb: #1e293b;
        }
      `}</style>
    </div>
  );
}