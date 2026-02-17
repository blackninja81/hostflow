'use client';

import { useState } from 'react';
import { deleteItem, updateItem } from '../../app/dashboard/actions';

export default function ItemSettings({ item, propertyId }: { item: any, propertyId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit State
  const [name, setName] = useState(item.name);
  const [cost, setCost] = useState(item.cost_per_unit);
  const [minStock, setMinStock] = useState(item.min_stock);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-full text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>
      </button>

      {isOpen && !isEditing && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full text-left px-4 py-3 text-sm font-bold text-[#484848] hover:bg-gray-50 border-b border-gray-50"
          >
            Edit Item
          </button>
          <button 
            onClick={() => {
              if(confirm("Delete this item? Logs will be preserved.")) deleteItem(item.id, propertyId);
            }}
            className="w-full text-left px-4 py-3 text-sm font-bold text-[#FF5A5F] hover:bg-red-50"
          >
            Delete Item
          </button>
        </div>
      )}

      {isEditing && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-[#484848] mb-6">Edit {item.name}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Item Name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 font-bold" />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 ml-2">Cost (KSh)</label>
                <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} className="w-full p-4 rounded-xl border border-gray-100 bg-gray-50 font-bold" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setIsEditing(false)} className="flex-1 p-4 rounded-xl font-bold text-gray-400 hover:bg-gray-50">Cancel</button>
              <button 
                onClick={async () => {
                  await updateItem(item.id, propertyId, name, cost, minStock);
                  setIsEditing(false);
                  setIsOpen(false);
                }}
                className="flex-1 p-4 rounded-xl font-bold bg-[#008489] text-white"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}