import UserNav from "../../components/dashboard/user-nav";
import { createClient } from "../../lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeletePropertyButton from "../../components/dashboard/delete-property-button";
import ThemeToggle from "@/src/components/ThemeToggle";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  // 1. Fetch properties
  const { data: properties, error: propError } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  // 2. Fetch all other data for calculations
  const { data: allInventory } = await supabase.from("inventory_items").select("*");
  const { data: allBookings } = await supabase.from("bookings").select("*");
  const { data: allLogs } = await supabase.from("inventory_logs").select("*");

  if (propError) {
    console.error("Error fetching properties:", propError);
    return <div className="p-8 text-red-500 font-bold">Failed to load properties. Check console.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0F172A] transition-colors duration-500">
     

      <main className="mx-auto max-w-7xl p-8">
        <header className="mb-10">
          <h2 className="text-4xl font-black text-[#484848] dark:text-white tracking-tighter">Your Portfolio</h2>
          <p className="text-gray-500 dark:text-slate-400 font-medium italic">Tracking real-time occupancy and profit.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties?.map((property) => {
            const propertyInventory = allInventory?.filter(i => i.property_id === property.id) || [];
            const propertyBookings = allBookings?.filter(b => b.property_id === property.id) || [];
            const propertyLogs = allLogs?.filter(l => l.property_id === property.id) || [];

            const today = new Date().setHours(0,0,0,0);
            const hasActiveGuest = propertyBookings.some(b => new Date(b.check_out).getTime() >= today);
            const lowStockCount = propertyInventory.filter(i => !i.is_permanent && (i.quantity <= (i.min_stock || 0))).length;
            
            const totalRevenue = propertyBookings.reduce((acc, b) => acc + (Number(b.payout_amount) || 0), 0);
            const totalExpenses = propertyLogs.reduce((acc, l) => acc + (Number(l.price_at_time || 0) * Number(l.quantity || 1)), 0);
            const netProfit = totalRevenue - totalExpenses;

            return (
              <div key={property.id} className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_30px_60px_rgba(0,132,137,0.12)] transition-all duration-500 border border-gray-100 dark:border-slate-800">
                
                {/* --- IMAGE AREA --- */}
                <Link href={`/dashboard/properties/${property.id}`} className="block relative h-80 w-full overflow-hidden">
                  {property.thumbnail_url ? (
                    <img src={property.thumbnail_url} alt={property.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#008489] to-[#015a5e] dark:from-[#004D4F] dark:to-[#002A2B]" />
                  )}

                  {/* ALERTS / STATUS */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {hasActiveGuest && (
                      <span className="bg-[#008489] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">● Guest In</span>
                    )}
                    {lowStockCount > 0 && (
                      <span className="bg-[#FF5A5F] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">⚠️ {lowStockCount} Alert{lowStockCount > 1 ? 's' : ''}</span>
                    )}
                  </div>

                  {/* GLASS OVERLAY */}
                  <div className="absolute bottom-4 left-4 right-4 p-5 rounded-[2rem] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl transition-all duration-500 group-hover:-translate-y-2">
                    <div className="flex justify-between items-center">
                      <div className="min-w-0">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight truncate">{property.name}</h3>
                        <p className="text-[10px] font-bold text-gray-500 dark:text-slate-400 flex items-center gap-1 mt-1 uppercase tracking-wider">{property.address || "Location Pending"}</p>
                      </div>
                      <div className="bg-[#008489] text-white p-2 rounded-xl shadow-lg shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* --- ACTIONS --- */}
                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Link href={`/dashboard/properties/${property.id}/edit`} className="p-2.5 bg-white dark:bg-slate-800 shadow-xl rounded-xl text-gray-400 dark:text-slate-400 hover:text-[#008489] transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                  </Link>
                  <DeletePropertyButton id={property.id} thumbnail={property.thumbnail_url} />
                </div>

                {/* --- STATS FOOTER --- */}
                <div className="px-8 py-5 flex justify-between items-center bg-white dark:bg-slate-900/50 border-t border-gray-50 dark:border-slate-800">
                  <div>
                    <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-0.5">Inventory</span>
                    <span className={`text-sm font-black ${lowStockCount > 0 ? 'text-[#FF5A5F]' : 'text-gray-700 dark:text-slate-200'}`}>
                      {propertyInventory.length} Items
                    </span>
                  </div>
                  <div className="h-8 w-[1px] bg-gray-100 dark:bg-slate-800" />
                  <div className="text-right">
                    <span className="text-[9px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-[0.2em] block mb-0.5">Estimated Net</span>
                    <span className="text-sm font-black text-[#008489]">
                      KSh {netProfit.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* --- ADD PROPERTY CARD --- */}
          <Link href="/dashboard/properties/new" className="relative rounded-[2.5rem] border-2 border-dashed border-gray-200 dark:border-slate-800 flex flex-col items-center justify-center text-center hover:border-[#008489] dark:hover:border-[#008489] hover:bg-[#008489]/5 transition-all duration-500 group min-h-[400px]">
            <div className="h-16 w-16 rounded-[1.5rem] bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4 group-hover:bg-[#008489] transition-all duration-500">
              <span className="text-3xl font-light text-gray-400 dark:text-slate-500 group-hover:text-white transition-colors">+</span>
            </div>
            <p className="font-black text-[#484848] dark:text-white text-xl tracking-tight">Add Property</p>
            <p className="text-xs font-bold text-gray-400 dark:text-slate-600 max-w-[180px] mt-2 uppercase tracking-widest">Grow Portfolio</p>
          </Link>
        </div>
      </main>
    </div>
  );
}