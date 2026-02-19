"use client";

import { useState } from "react";
import { deleteItem, updateItem } from "../../app/dashboard/actions";
import {
  MoreVertical,
  Edit3,
  Trash2,
  Box,
  Banknote,
  AlertTriangle,
  X,
} from "lucide-react";

export default function ItemSettings({
  item,
  propertyId,
}: {
  item: any;
  propertyId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit State
  const [name, setName] = useState(item.name);
  const [cost, setCost] = useState(item.cost_per_unit);
  const [minStock, setMinStock] = useState(item.min_stock);
  const [isPermanent, setIsPermanent] = useState(item.is_permanent || false);

  const handleDelete = async () => {
    if (confirm(`Delete ${item.name}? History logs will be preserved.`)) {
      await deleteItem(item.id, propertyId);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-400 dark:text-slate-500 transition-colors cursor-pointer"
      >
        <MoreVertical size={18} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isEditing && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 z-50 overflow-hidden animate-in fade-in zoom-in duration-150">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm font-bold text-[#484848] dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 border-b border-gray-50 dark:border-slate-800 transition-colors"
            >
              <Edit3 size={14} className="text-[#008489]" />
              Edit Item
            </button>
            <button
              onClick={handleDelete}
              className="w-full flex items-center gap-3 text-left px-4 py-3 text-sm font-bold text-[#FF5A5F] hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 size={14} />
              Delete Item
            </button>
          </div>
        </>
      )}

      {/* Inline Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-[#484848] dark:text-white tracking-tight">
                  Edit Supply
                </h3>
                <p className="text-[10px] font-black text-[#008489] uppercase tracking-widest mt-1">
                  {item.name}
                </p>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5">
              {/* Item Name */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                  <Box size={12} /> Item Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] text-gray-900 dark:text-white font-bold transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Cost */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                    <Banknote size={12} /> Cost (KSh)
                  </label>
                  <input
                    type="number"
                    value={cost}
                    onChange={(e) => setCost(Number(e.target.value))}
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] text-[#008489] font-bold transition-colors"
                  />
                </div>
                {/* Min Stock */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase ml-2 tracking-widest">
                    <AlertTriangle size={12} /> Min. Stock
                  </label>
                  <input
                    type="number"
                    value={minStock}
                    onChange={(e) => setMinStock(Number(e.target.value))}
                    className="w-full p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 outline-none focus:border-[#008489] text-gray-900 dark:text-white font-bold transition-colors"
                  />
                </div>
                <div className="flex items-center w-95 gap-4 p-4 bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl border border-blue-100 dark:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    id="is_permanent"
                    checked={isPermanent}
                    onChange={(e) => setIsPermanent(e.target.checked)}
                    className="w-5 h-5 accent-brand cursor-pointer"
                  />
                  <label
                    htmlFor="is_permanent"
                    className="flex items-center gap-2 text-sm font-bold text-[#484848] dark:text-slate-200 cursor-pointer"
                  >
                    Permanent Utility
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 p-4 rounded-2xl font-bold text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await updateItem(
                    item.id,
                    propertyId,
                    name,
                    cost,
                    minStock,
                    isPermanent,
                  );
                  setIsEditing(false);
                  setIsOpen(false);
                }}
                className="flex-[2] p-4 rounded-2xl font-black bg-[#008489] text-white shadow-lg shadow-[#008489]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
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
