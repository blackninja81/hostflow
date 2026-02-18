'use client';

import { useState, useMemo } from "react";
import { Package, Search, ChevronLeft, ChevronRight } from "lucide-react";
import StockAdjuster from "../../../../components/dashboard/stock-adjuster";
import ItemSettings from "../../../../components/dashboard/item-settings";

const formatKSh = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount).replace('KES', 'KSh');
};

interface InventorySectionProps {
  inventory: any[];
  property: any;
  lowStockCount: number;
}

export default function InventorySection({
  inventory,
  property,
  lowStockCount
}: InventorySectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterType, setFilterType] = useState<'all' | 'low' | 'consumable' | 'utility'>('all');

  // Filter and search logic
  const filteredInventory = useMemo(() => {
    let filtered = [...inventory];

    if (filterType === 'low') {
      filtered = filtered.filter(i => !i.is_permanent && i.quantity <= i.min_stock);
    } else if (filterType === 'consumable') {
      filtered = filtered.filter(i => !i.is_permanent);
    } else if (filterType === 'utility') {
      filtered = filtered.filter(i => i.is_permanent);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(i => 
        i.name.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [inventory, searchQuery, filterType]);

  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredInventory.slice(startIndex, endIndex);

  const handleFilterChange = (newFilter: typeof filterType) => {
    setFilterType(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-2">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-black text-[#484848] dark:text-white uppercase tracking-tight">
            Supply Inventory
          </h2>
          <span className="text-xs font-bold text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            {inventory.length} Items
          </span>
        </div>
        {lowStockCount > 0 && (
          <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full animate-pulse">
            {lowStockCount} Low Stock
          </span>
        )}
      </div>

      {/* Search and Filters Row - Fixed Overflow with overflow-x-auto */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm font-medium dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#008489] transition-all"
          />
        </div>

        {/* Horizontal Scroll for Mobile Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <button
            onClick={() => handleFilterChange('all')}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
              filterType === 'all'
                ? 'bg-[#008489] text-white border-[#008489]'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:bg-gray-50'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleFilterChange('low')}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
              filterType === 'low'
                ? 'bg-[#FF5A5F] text-white border-[#FF5A5F]'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:bg-gray-50'
            }`}
          >
            Low ({lowStockCount})
          </button>
          <button
            onClick={() => handleFilterChange('consumable')}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
              filterType === 'consumable'
                ? 'bg-[#008489] text-white border-[#008489]'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:bg-gray-50'
            }`}
          >
            Stock
          </button>
          <button
            onClick={() => handleFilterChange('utility')}
            className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap border ${
              filterType === 'utility'
                ? 'bg-[#008489] text-white border-[#008489]'
                : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-slate-400 border-gray-200 dark:border-slate-800 hover:bg-gray-50'
            }`}
          >
            Utils
          </button>
        </div>
      </div>

      {/* Results Info */}
      {(searchQuery || filterType !== 'all') && (
        <div className="flex items-center justify-between px-2">
          <p className="text-xs text-gray-500 dark:text-slate-500">
            Showing <span className="font-bold text-[#008489]">{filteredInventory.length}</span> items
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#FF5A5F] hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      )}

      {/* Inventory List */}
      <div className="space-y-4">
        {currentItems.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-16 text-center border-2 border-dashed border-gray-100 dark:border-slate-800">
            <Package size={48} className="mx-auto mb-4 text-gray-300 dark:text-slate-700" />
            <p className="text-sm font-bold text-gray-300 dark:text-slate-700 uppercase tracking-widest">
              {searchQuery ? 'No items found' : 'No items in this category'}
            </p>
          </div>
        ) : (
          currentItems.map((item: any) => {
            const isLow = !item.is_permanent && item.quantity <= item.min_stock;
            return (
              <div 
                key={item.id} 
                className={`group transition-all rounded-[2rem] md:rounded-[2.5rem] p-5 md:p-6 border-2 ${
                  isLow 
                    ? 'bg-red-50/40 dark:bg-red-950/10 border-red-100 dark:border-red-900/30' 
                    : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                {/* TOP ROW */}
                <div className="flex items-start gap-4 md:gap-5 mb-4">
                  <div className={`p-4 rounded-[1.25rem] shrink-0 ${
                    isLow ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-teal-50 dark:bg-[#008489]/10 text-[#008489]'
                  }`}>
                    <Package size={22} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-black text-[#484848] dark:text-white text-base md:text-lg uppercase leading-tight truncate">
                        {item.name}
                      </h3>
                      {isLow && (
                        <span className="text-[8px] font-black bg-red-500 text-white px-2 py-0.5 rounded-full uppercase whitespace-nowrap">
                          Low
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] font-black text-[#008489] uppercase tracking-wider">
                      {formatKSh(item.cost_per_unit)} / Unit
                    </p>
                  </div>
                </div>

                {/* BOTTOM ROW */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <div className="text-left">
                    <p className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase mb-1">
                      Stock Level
                    </p>
                    <span className={`inline-block text-[11px] font-black px-3 py-1 rounded-full uppercase ${
                      item.is_permanent 
                        ? 'bg-teal-100 dark:bg-[#008489]/20 text-[#008489]' 
                        : isLow 
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                          : 'bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300'
                    }`}>
                      {item.is_permanent ? 'Utility' : `${item.quantity} Units`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 md:gap-3">
                    <StockAdjuster 
                      itemId={item.id} 
                      propertyId={property.id} 
                      isPermanent={item.is_permanent} 
                      defaultPrice={item.cost_per_unit || 0} 
                    />
                    <ItemSettings item={item} propertyId={property.id} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {filteredInventory.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-gray-100 dark:border-slate-800">
          <span className="text-xs font-bold text-gray-500 dark:text-slate-500">
            {startIndex + 1}-{Math.min(endIndex, filteredInventory.length)} of {filteredInventory.length}
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={18} className="text-gray-600 dark:text-slate-400" />
            </button>

            <div className="flex items-center gap-1">
              {/* Pagination numbers simplified for mobile if necessary, logic remains same */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum = i + 1; // Simplified for display brevity in this block
                return (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`min-w-[32px] h-8 rounded-lg text-xs font-black transition-all ${
                      currentPage === pageNum
                        ? 'bg-[#008489] text-white shadow-lg'
                        : 'hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-slate-400'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={18} className="text-gray-600 dark:text-slate-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}