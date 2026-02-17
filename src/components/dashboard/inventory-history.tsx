export default function InventoryHistory({ logs }: { logs: any[] }) {
  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <h3 className="font-bold text-[#484848]">Activity Log</h3>
      </div>
      <div className="max-h-[400px] overflow-y-auto">
        {logs.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-400 italic">No activity recorded yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-gray-50/50 transition-colors flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${log.action_type === 'RESTOCK' ? 'bg-[#008489]/10 text-[#008489]' : 'bg-gray-100 text-gray-500'}`}>
                    {log.action_type === 'RESTOCK' ? '↑' : '↓'}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {log.action_type === 'RESTOCK' ? 'Restocked' : 'Dispatched'} {log.item_name}
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase">
                      {new Date(log.created_at).toLocaleDateString()} • {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-black ${log.action_type === 'RESTOCK' ? 'text-[#008489]' : 'text-gray-600'}`}>
                  {log.action_type === 'RESTOCK' ? '+' : '-'}{log.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}