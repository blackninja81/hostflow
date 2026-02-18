// src/app/dashboard/properties/[id]/edit/page.tsx

import Link from "next/link";
import { createClient } from "../../../../../lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditPropertyForm from "../../../../../components/dashboard/edit-property-form";
import { ChevronLeft, Settings2 } from "lucide-react";

export default async function EditPropertyPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (!property) notFound();

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#0F172A] flex items-center justify-center p-6 transition-colors duration-500">
      
      <div className="w-full max-w-xl relative">
        {/* Navigation */}
        <Link 
          href="/dashboard" 
          className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-slate-500 hover:text-[#008489] transition-all mb-8 ml-4"
        >
          <ChevronLeft size={14} className="transform group-hover:-translate-x-1 transition-transform" />
          Cancel and Go Back
        </Link>

        {/* Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.03)] dark:shadow-[0_40px_100px_rgba(0,0,0,0.4)] border border-gray-100 dark:border-slate-800 p-8 md:p-14 transition-all">
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-3 bg-[#008489]/10 dark:bg-[#008489]/20 rounded-2xl">
                  <Settings2 size={24} className="text-[#008489]" />
               </div>
               <span className="text-[10px] font-black text-[#008489] uppercase tracking-[0.3em]">
                 Management
               </span>
            </div>
            
            <h1 className="text-4xl font-black text-[#484848] dark:text-white tracking-tighter leading-none">
              Edit Property
            </h1>
            <p className="text-sm text-gray-400 dark:text-slate-400 font-medium mt-3">
              Modifying <span className="text-[#008489] font-bold">{property.name}</span>
            </p>
          </header>

          <EditPropertyForm property={property} />
        </div>

        {/* Branded Footer Ornament */}
        <div className="mt-10 flex items-center justify-center gap-4 opacity-20 dark:opacity-10">
          <div className="h-[1px] w-12 bg-[#008489]" />
          <span className="text-[9px] font-black text-[#484848] dark:text-white uppercase tracking-[0.4em]">HostFlow</span>
          <div className="h-[1px] w-12 bg-[#008489]" />
        </div>
      </div>
    </div>
  );
}