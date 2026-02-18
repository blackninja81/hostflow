import { createClient } from "../../../../lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import PropertyDetailView from "./PropertyDetailView";

export default async function PropertyDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const [propRes, invRes, logRes, bookRes] = await Promise.all([
    supabase.from("properties").select("*").eq("id", params.id).single(),
    supabase.from("inventory_items")
      .select(`*, inventory_logs(created_at, action_type)`)
      .eq("property_id", params.id),
    supabase.from("inventory_logs")
      .select("*")
      .eq("property_id", params.id)
      .order("created_at", { ascending: false }),
    supabase.from("bookings")
      .select("id, guest_name, payout_amount, check_in, check_out")
      .eq("property_id", params.id)
      .order("check_in", { ascending: false })
  ]);

  if (!propRes.data) notFound();

  // Note: We pass the raw data arrays. 
  // PropertyDetailView will handle the filtering and math 
  // based on the selected month/year.
  return (
    <PropertyDetailView 
      property={propRes.data} 
      inventory={invRes.data || []} 
      logs={logRes.data || []} // Full data passed here
      bookings={bookRes.data || []}
    />
  );
}