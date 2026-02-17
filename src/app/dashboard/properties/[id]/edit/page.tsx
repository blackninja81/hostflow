// src/app/dashboard/properties/[id]/edit/page.tsx

import Link from "next/link";
import { createClient } from "../../../../../lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EditPropertyForm from "../../../../../components/dashboard/edit-property-form";

// Update the type and the function body
export default async function EditPropertyPage(props: { params: Promise<{ id: string }> }) {
  // 1. Unwrap the params promise
  const params = await props.params;
  const id = params.id;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // 2. Use the unwrapped 'id'
  const { data: property } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (!property) notFound();

  return (
    <div className="min-h-screen bg-white md:bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl md:shadow-xl border border-gray-100 p-8 md:p-12">
        <header className="mb-8">
          <Link 
            href="/dashboard" 
            className="text-sm font-medium text-gray-500 hover:text-[#008489] transition-colors mb-4 inline-block"
          >
            ← Cancel and Go Back
          </Link>
          <h1 className="text-3xl font-bold text-[#484848]">Edit Property</h1>
          <p className="text-gray-600 mt-2">Update your property details below.</p>
        </header>

        <EditPropertyForm property={property} />
      </div>
    </div>
  );
}