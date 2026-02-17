import { createClient } from "../../../../lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import PropertyDetailView from "./PropertyDetailView";

export default async function PropertyDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

  const [propRes, invRes, logRes, bookRes] = await Promise.all([
    supabase.from("properties").select("*").eq("id", params.id).single(),
    supabase.from("inventory_items").select(`*, inventory_logs(created_at, action_type)`).eq("property_id", params.id),
    supabase.from("inventory_logs").select("*").eq("property_id", params.id).order("created_at", { ascending: false }),
    // CRITICAL: Explicitly select 'id'
    supabase.from("bookings").select("id, guest_name, payout_amount, check_in, check_out").eq("property_id", params.id).order("check_in", { ascending: false })
  ]);

  if (!propRes.data) notFound();

  const totalRevenue = (bookRes.data || []).reduce((acc, b) => acc + Number(b.payout_amount || 0), 0);
  const totalExpenses = (logRes.data || [])
    .filter(l => l.action_type === 'DISPATCH' && new Date(l.created_at) >= startOfMonth)
    .reduce((acc, l) => acc + (Number(l.amount) * Number(l.price_at_time || 0)), 0);

  return (
    <PropertyDetailView 
      property={propRes.data} 
      inventory={invRes.data || []} 
      logs={logRes.data?.slice(0, 10) || []} 
      bookings={bookRes.data || []}
      financials={{ totalRevenue, totalExpenses, netProfit: totalRevenue - totalExpenses }}
    />
  );
}