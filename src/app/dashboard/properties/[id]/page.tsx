import { createClient } from "../../../../lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import PropertyDetailView from "./PropertyDetailView";

/**
 * PropertyDetailPage
 * * Server component that pre-fetches the full dataset for a specific asset.
 * Data is fetched in parallel to minimize waterfall latency.
 */
export default async function PropertyDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params.id;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Parallel fetch for optimal load times
  const [propRes, invRes, logRes, bookRes] = await Promise.all([
    supabase.from("properties").select("*").eq("id", id).single(),
    supabase.from("inventory_items")
      .select(`*, inventory_logs(created_at, action_type)`)
      .eq("property_id", id),
    supabase.from("inventory_logs")
      .select("*")
      .eq("property_id", id)
      .order("created_at", { ascending: false }),
    supabase.from("bookings")
      .select("id, guest_name, payout_amount, check_in, check_out")
      .eq("property_id", id)
      .order("check_in", { ascending: false })
  ]);

  // Handle missing property
  if (!propRes.data) notFound();

  // Injecting a simple breadcrumb/metadata context for SEO and internal tracking
  const metaData = {
    fetchedAt: new Date().toISOString(),
    userName: user.email,
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] dark:bg-[#0F172A] transition-colors duration-500">
      <PropertyDetailView 
        property={propRes.data} 
        inventory={invRes.data || []} 
        logs={logRes.data || []} 
        bookings={bookRes.data || []}
      />
    </div>
  );
}