'use server'

import { createClient } from '../../lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProperty(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const imageFile = formData.get('thumbnail') as File
  let thumbnailUrl = null

  try {
    if (imageFile && imageFile.size > 0) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('property-thumbnails')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('property-thumbnails')
        .getPublicUrl(filePath)
        
      thumbnailUrl = urlData.publicUrl
    }

    const { error: dbError } = await supabase
      .from('properties')
      .insert([{ 
        name, 
        address, 
        host_id: user.id,
        thumbnail_url: thumbnailUrl 
      }])

    if (dbError) throw dbError

    // Success! Tell Next.js to refresh the dashboard data
    revalidatePath('/dashboard')

  } catch (err: any) {
    console.error('CRITICAL ERROR:', err)
    return { error: err.message || "Failed to create property" }
  }

  // 2. Redirect MUST happen outside the try/catch
  redirect('/dashboard')
}

export async function deleteProperty(propertyId: string, thumbnailUrl: string | null) {
  const supabase = await createClient()
  
  if (thumbnailUrl) {
    const fileName = thumbnailUrl.split('/').pop()
    const { data: { user } } = await supabase.auth.getUser()
    if (user && fileName) {
      await supabase.storage.from('property-thumbnails').remove([`${user.id}/${fileName}`])
    }
  }

  // 2. Database Cleanup
  await supabase.from('properties').delete().eq('id', propertyId)

  revalidatePath('/dashboard')
}

export async function updateProperty(propertyId: string, formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const address = formData.get('address') as string
  const imageFile = formData.get('thumbnail') as File
  
  let thumbnailUrl = formData.get('currentThumbnailUrl') as string

  try {
    // 1. If a new image is uploaded, handle it
    if (imageFile && imageFile.size > 0) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Unauthorized")

      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${user.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('property-thumbnails')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('property-thumbnails')
        .getPublicUrl(filePath)
        
      thumbnailUrl = urlData.publicUrl
    }

    // 2. Update Database
    const { error } = await supabase
      .from('properties')
      .update({ name, address, thumbnail_url: thumbnailUrl })
      .eq('id', propertyId)

    if (error) throw error

    revalidatePath('/dashboard')
  } catch (err: any) {
    return { error: err.message }
  }

  redirect('/dashboard')
}

export async function addInventoryItem(propertyId: string, formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const quantity = parseInt(formData.get('quantity') as string) || 0
  const min_stock = parseInt(formData.get('min_stock') as string) || 0
  const cost = parseFloat(formData.get('cost') as string) || 0
  // NEW: Capture the checkbox value
  const is_permanent = formData.get('is_permanent') === 'on'

  const { error } = await supabase
    .from('inventory_items')
    .insert([
      { 
        property_id: propertyId, 
        name, 
        quantity: is_permanent ? 0 : quantity, // Utilities don't need stock
        min_stock: is_permanent ? 0 : min_stock, 
        cost_per_unit: cost,
        is_permanent: is_permanent
      }
    ])

  if (error) throw new Error(error.message)
  revalidatePath(`/dashboard/properties/${propertyId}`)
}

export async function adjustStock(
  itemId: string, 
  propertyId: string, 
  amount: number, 
  type: 'DISPATCH' | 'RESTOCK',
  customPrice?: number 
) {
  const supabase = await createClient();

  const { data: item } = await supabase
    .from("inventory_items")
    .select("quantity, cost_per_unit, name, is_permanent")
    .eq("id", itemId)
    .single();

  if (!item) throw new Error("Item not found");

  // Use the custom price if provided, otherwise use the stored unit cost
  const finalPrice = customPrice ?? item.cost_per_unit;

  if (!item.is_permanent) {
    const newQuantity = type === 'DISPATCH' ? item.quantity - amount : item.quantity + amount;
    await supabase.from("inventory_items").update({ quantity: newQuantity }).eq("id", itemId);
  }

  await supabase.from("inventory_logs").insert({
    property_id: propertyId,
    item_id: itemId,
    item_name: item.name,
    action_type: type,
    amount: amount,
    price_at_time: finalPrice // This captures the variable cost!
  });

  revalidatePath(`/dashboard/properties/${propertyId}`);
}

export async function updateItem(itemId: string, propertyId: string, name: string, cost: number, minStock: number) {
  const supabase = await createClient();
  await supabase
    .from("inventory_items")
    .update({ name, cost_per_unit: cost, min_stock: minStock })
    .eq("id", itemId);

  revalidatePath(`/dashboard/properties/${propertyId}`);
}

export async function deleteItem(itemId: string, propertyId: string) {
  const supabase = await createClient();
  await supabase.from("inventory_items").delete().eq("id", itemId);
  revalidatePath(`/dashboard/properties/${propertyId}`);
}

export async function getMonthlyCost(propertyId: string) {
  const supabase = await createClient();
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // Fetch only the columns from the LOGS table (including our snapshot price)
  const { data: logs, error } = await supabase
    .from('inventory_logs')
    .select('amount, price_at_time') // <--- Use price_at_time here
    .eq('property_id', propertyId)
    .eq('action_type', 'DISPATCH')
    .gte('created_at', firstDayOfMonth);

  if (error || !logs) return 0;

  return logs.reduce((acc, log) => {
    return acc + (Number(log.amount) * Number(log.price_at_time || 0));
  }, 0);
}
export async function addBooking(propertyId: string, formData: FormData) {
  const supabase = await createClient();

  const data = {
    property_id: propertyId,
    guest_name: formData.get('guest_name') as string,
    payout_amount: parseFloat(formData.get('payout_amount') as string) || 0,
    check_in: formData.get('check_in') as string,
    check_out: formData.get('check_out') as string,
  };

  console.log("Adding Booking Data:", data);

  const { error } = await supabase
    .from('bookings')
    .insert([data]);

  if (error) {
    console.error("Supabase Add Error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function deleteBooking(bookingId: string, propertyId: string) {
  console.log("Attempting to delete booking:", bookingId); // Check your terminal for this
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('bookings')
    .delete()
    .match({ id: bookingId }); // Using .match for stricter UUID checking

  if (error) {
    console.error("Supabase Delete Error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

export async function updateBooking(propertyId: string, formData: FormData) {
  const supabase = await createClient();
  
  // Explicitly log the entries to see what's inside if it fails
  const rawEntries = Object.fromEntries(formData.entries());
  console.log("Raw Form Data:", rawEntries);

  const bookingId = formData.get('bookingId') as string;

  if (!bookingId || bookingId === "undefined" || bookingId === "") {
    throw new Error(`Invalid Booking ID: Received "${bookingId}"`);
  }

  const updates = {
    guest_name: formData.get('guest_name') as string,
    payout_amount: parseFloat(formData.get('payout_amount') as string),
    check_in: formData.get('check_in') as string,
    check_out: formData.get('check_out') as string,
  };

  const { error } = await supabase
    .from('bookings')
    .update(updates)
    .eq('id', bookingId);

  if (error) {
    console.error("Supabase Error:", error.message);
    throw new Error(error.message);
  }

  revalidatePath(`/dashboard/properties/${propertyId}`);
  return { success: true };
}

