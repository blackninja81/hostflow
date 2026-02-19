'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Package, Calendar, TrendingUp, ArrowLeft, 
  AlertCircle, LayoutDashboard
} from "lucide-react";

// Components
import AddItemModal from "../../../../components/dashboard/add-item-modal";
import AddBookingModal from "../../../../components/dashboard/add-booking-modal";
import InventoryHistory from "../../../../components/dashboard/inventory-history";
import BookingsList from "../../../../components/dashboard/bookings-list";
import LowStockModal from "../../../../components/dashboard/low-stock-modal";
import FinancialReportButton from "../../../../components/dashboard/FinancialReportButton";
import InventorySection from "./InventorySection";

const formatKSh = (amount: number) => {
  return new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    minimumFractionDigits: 0,
  }).format(amount).replace('KES', 'KSh');
};

export default function PropertyDetailView({ property, inventory, logs, bookings }: any) {

  const currentYear = new Date().getFullYear().toString();
  const currentMonthIndex = new Date().getMonth().toString();

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedPeriod, setSelectedPeriod] = useState(currentMonthIndex);

  // --- FILTER LOGIC ---
  const filteredData = useMemo(() => {
    const isWithinRange = (dateStr: string) => {
      const date = new Date(dateStr);
      const yearMatch = date.getFullYear().toString() === selectedYear;
      if (!yearMatch) return false;
      if (selectedPeriod === 'all') return true;
      
      const month = date.getMonth();
      if (selectedPeriod === 'q1') return month <= 2;
      if (selectedPeriod === 'q2') return month >= 3 && month <= 5;
      if (selectedPeriod === 'q3') return month >= 6 && month <= 8;
      if (selectedPeriod === 'q4') return month >= 9;
      return month.toString() === selectedPeriod;
    };

    return {
      filteredBookings: bookings.filter((b: any) => isWithinRange(b.check_in || b.created_at)),
      filteredLogs: logs.filter((l: any) => isWithinRange(l.transaction_date || l.created_at))
    };
  }, [selectedYear, selectedPeriod, bookings, logs]);

  // --- FINANCIAL CALCULATIONS (Matching Dashboard Logic) ---
  const financials = useMemo(() => {
    // Revenue from all bookings
    const totalRevenue = filteredData.filteredBookings.reduce(
      (acc: number, b: any) => acc + (Number(b.payout_amount) || 0), 
      0
    );
    
    // Expenses from ALL inventory logs (price_at_time * quantity)
    const totalExpenses = filteredData.filteredLogs.reduce(
      (acc: number, l: any) => acc + (Number(l.price_at_time || 0) * Number(l.quantity || 1)), 
      0
    );
    
    const netProfit = totalRevenue - totalExpenses;

    return { 
      revenue: totalRevenue, 
      expenses: totalExpenses, 
      net: netProfit 
    };
  }, [filteredData]);

  const lowStockCount = inventory.filter(
    (i: any) => !i.is_permanent && i.quantity <= i.min_stock
  ).length;

  const years = Array.from({ length: 3 }, (_, i) => (new Date().getFullYear() - i).toString());

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#0F172A] pb-20 transition-colors duration-500">
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 px-8 pt-8 pb-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <Link 
              href="/dashboard" 
              className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 hover:text-brand transition-all"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
              Portfolio Overview
            </Link>

            {/* TIME FILTER BAR */}
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-slate-800 text-brand p-2 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
              <Calendar size={14} className="ml-2 text-gray-400 dark:text-slate-500" />
              <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
    {years.map(year => (
      <option key={year} value={year}>{year}</option>
    ))}
  </select>
              <div className="w-px h-4 bg-gray-200 dark:bg-slate-700 mx-1" />
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)} 
                className="bg-transparent text-[11px] font-black uppercase outline-none text-brand cursor-pointer"
              >
                <option value="all">Full Year</option>
                <option value="q1">Q1 (Jan-Mar)</option>
                <option value="q2">Q2 (Apr-Jun)</option>
                <option value="q3">Q3 (Jul-Sep)</option>
                <option value="q4">Q4 (Oct-Dec)</option>
                <optgroup label="──────────">
                  <option value="0">January</option>
                  <option value="1">February</option>
                  <option value="2">March</option>
                  <option value="3">April</option>
                  <option value="4">May</option>
                  <option value="5">June</option>
                  <option value="6">July</option>
                  <option value="7">August</option>
                  <option value="8">September</option>
                  <option value="9">October</option>
                  <option value="10">November</option>
                  <option value="11">December</option>
                </optgroup>
              </select>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div>
              <h1 className="text-4xl font-black text-[#484848] dark:text-white tracking-tighter mb-1">
                {property.name}
              </h1>
              <p className="text-gray-400 dark:text-slate-500 text-sm font-medium italic">
                {property.address}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setIsAlertOpen(true)} 
                className={`flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all bg-white dark:bg-slate-900 hover:shadow-md ${
                  lowStockCount > 0 ? 'border-red-100 dark:border-red-900/30' : 'border-gray-100 dark:border-slate-800'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  lowStockCount > 0 ? 'bg-[#FF5A5F] animate-pulse' : 'bg-gray-300 dark:bg-slate-700'
                }`} />
                <span className={`font-bold text-sm ${
                  lowStockCount > 0 ? 'text-[#FF5A5F]' : 'text-gray-400 dark:text-slate-500'
                }`}>
                  {lowStockCount} Alert{lowStockCount !== 1 ? 's' : ''}
                </span>
              </button>
              <AddBookingModal propertyId={property.id} />
              <AddItemModal propertyId={property.id} />
            </div>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {/* REVENUE */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Revenue
                </p>
                <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <p className="text-3xl font-black text-[#484848] dark:text-white mb-2">
                {formatKSh(financials.revenue)}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                {filteredData.filteredBookings.length} booking{filteredData.filteredBookings.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* EXPENSES */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                  Expenses
                </p>
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-orange-500" />
                </div>
              </div>
              <p className="text-3xl font-black text-[#FF5A5F] mb-2">
                {formatKSh(financials.expenses)}
              </p>
              <p className="text-xs text-gray-400 dark:text-slate-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
                {filteredData.filteredLogs.length} transaction{filteredData.filteredLogs.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* NET PROFIT */}
            <div className={`p-8 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-300 group ${
              financials.net >= 0 
                ? 'bg-linear-to-br from-brand to-[#006d73]' 
                : 'bg-linear-to-br from-[#FF5A5F] to-[#e04950]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">
                  Net Profit
                </p>
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
              </div>
              <p className="text-3xl font-black text-white mb-2">
                {formatKSh(financials.net)}
              </p>
              <p className="text-xs text-white/70 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white/60"></span>
                {financials.revenue > 0 
                  ? `${((financials.net / financials.revenue) * 100).toFixed(1)}% margin`
                  : 'No revenue yet'
                }
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* INVENTORY SECTION */}
          <div className="lg:col-span-7">
            <InventorySection
              inventory={inventory}
              property={property}
              lowStockCount={lowStockCount}
            />
          </div>

          {/* BOOKINGS & LOGS SECTION */}
          <div className="lg:col-span-5 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-[#484848] dark:text-white uppercase">
                    Recent Stays
                  </h2>
                  {filteredData.filteredBookings.length > 0 && (
                    <span className="text-xs font-bold text-brand bg-teal-50 dark:bg-brand/10 px-3 py-1 rounded-full">
                      {filteredData.filteredBookings.length}
                    </span>
                  )}
                </div>
              </div>
              
              <BookingsList 
                bookings={filteredData.filteredBookings} 
                propertyId={property.id} 
              />
            </section>
            
            <section className="space-y-6 pt-8 border-t border-gray-200 dark:border-slate-800">
              <h2 className="text-xl font-black text-[#484848] dark:text-white uppercase px-2">
                Activity Log
              </h2>
              <InventoryHistory logs={filteredData.filteredLogs} />
              <FinancialReportButton
                property={property}
                inventory={inventory}
                logs={logs}
                bookings={bookings}
                selectedYear={selectedYear}
              />
            </section>
          </div>
        </div>
      </main>

      <LowStockModal 
        isOpen={isAlertOpen} 
        onClose={() => setIsAlertOpen(false)} 
        items={inventory} 
        propertyName={property.name} 
      />
    </div>
  );
}