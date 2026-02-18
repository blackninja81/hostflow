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
    <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-20">
        <div className="flex items-center gap-2">
          <History size={16} className="text-[#008489]" />
          <h3 className="text-xs font-black text-[#484848] uppercase tracking-[0.2em]">
            Activity Log
          </h3>
        </div>
        <span className="text-[10px] font-black bg-gray-50 text-gray-400 px-3 py-1 rounded-full uppercase">
          {logs?.length || 0} Records Found
        </span>
      </div>

      {/* Scrollable Container */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {!logs || logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center">
            <Clock size={32} className="text-gray-100 mb-4" />
            <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest italic leading-relaxed">
              No activity recorded for<br/>the selected period.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log) => {
              const isRestock = log.action_type === 'RESTOCK';
              const qty = Math.abs(log.quantity || log.amount || 0);
              const price = Number(log.price_at_time || 0);
              const totalCost = price * qty;
              
              // We display the date this item was "logged for" (The Accounting Date)
              const displayDate = new Date(log.transaction_date || log.logged_at || log.created_at);

              return (
                <div key={log.id} className="p-5 hover:bg-gray-50/80 transition-all flex items-center justify-between group">
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
                          {log.item_name || 'Supply Item'}
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
                        {displayDate.toLocaleDateString('en-KE', {
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #008489; }
      `}</style>
    </div>
  );
}