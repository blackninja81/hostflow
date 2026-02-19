'use client';

import { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, History, Clock, Trash2, Loader2, Search, X } from "lucide-react";
import { deleteInventoryLog } from "../../app/dashboard/actions";

const formatKSh = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount).replace('KES', 'KSh');
};

export default function InventoryHistory({ logs, propertyId }: { logs: any[], propertyId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter logs based on search input (Item Name or Action Type)
  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(log => 
      log.item_name?.toLowerCase().includes(q) || 
      log.action_type?.toLowerCase().includes(q)
    );
  }, [logs, searchQuery]);

  const handleDelete = async (logId: string) => {
    setIsDeleting(true);
    try {
      await deleteInventoryLog(logId, propertyId);
      setConfirmDelete(null);
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Could not delete record. Check your database policies.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px] transition-colors duration-500">
      
      {/* Header Section */}
      <div className="p-6 border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md z-20 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-[#008489]" />
            <h3 className="text-xs font-black text-[#484848] dark:text-white uppercase tracking-[0.2em]">
              Activity Log
            </h3>
          </div>
          <span className="text-[10px] font-black bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500 px-3 py-1 rounded-full uppercase">
            {filteredLogs.length} {filteredLogs.length === 1 ? 'Record' : 'Records'}
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-slate-600 group-focus-within:text-[#008489] transition-colors" size={14} />
          <input 
            type="text"
            placeholder="Search item or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 py-2.5 bg-gray-50 dark:bg-slate-800/50 border border-transparent dark:border-slate-800 rounded-xl text-[11px] font-bold text-[#484848] dark:text-slate-200 outline-none focus:border-[#008489]/50 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-gray-300 dark:placeholder:text-slate-600"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#FF5A5F]"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center p-12 text-center opacity-30">
            <Clock size={32} className="text-gray-300 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest italic leading-relaxed dark:text-slate-400">
              {searchQuery ? "No matching records found." : "No activity recorded for this period."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-800/50">
            {filteredLogs.map((log) => {
              const isRestock = log.action_type === 'RESTOCK';
              const isConfirming = confirmDelete === log.id;
              const qty = Math.abs(log.quantity || log.amount || 0);
              const price = Number(log.price_at_time || 0);
              const totalCost = price * qty;
              
              // Use created_at as it now stores the manually selected date
              const displayDate = new Date(log.created_at);

              return (
                <div key={log.id} className="p-5 hover:bg-gray-50/80 dark:hover:bg-slate-800/30 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    {/* Icon Column */}
                    <div className={`p-3 rounded-xl transition-colors ${
                      isRestock 
                        ? 'bg-[#008489]/10 dark:bg-[#008489]/20 text-[#008489]' 
                        : 'bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-slate-500'
                    }`}>
                      {isRestock ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    </div>

                    {/* Details Column */}
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
                        {displayDate.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                        {' • '}
                        {displayDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>

                  {/* Right Side Actions/Info */}
                  <div className="flex items-center gap-4">
                    {!isConfirming ? (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className={`text-sm font-black ${isRestock ? 'text-[#008489]' : 'text-gray-600 dark:text-slate-400'}`}>
                            {isRestock ? '+' : '-'}{qty}
                          </p>
                          {isRestock && totalCost > 0 && (
                            <p className="text-[10px] font-bold text-[#FF5A5F] mt-1">-{formatKSh(totalCost)}</p>
                          )}
                        </div>

                        {/* Hover-only Trash Button */}
                        <button 
                          onClick={() => setConfirmDelete(log.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-[#FF5A5F] transition-all duration-300 transform group-hover:translate-x-0 translate-x-2"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-200">
                        <button 
                          onClick={() => setConfirmDelete(null)}
                          className="text-[9px] font-black uppercase text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 px-2"
                        >
                          Cancel
                        </button>
                        <button 
                          disabled={isDeleting}
                          onClick={() => handleDelete(log.id)}
                          className="bg-[#FF5A5F] text-white text-[9px] font-black uppercase px-4 py-2 rounded-xl shadow-lg shadow-red-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2"
                        >
                          {isDeleting ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
                        </button>
                      </div>
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