
// Truck data helpers for Supabase
import { supabase } from "@/integrations/supabase/client";
import type { Truck } from "@/lib/data";

// Fetch all trucks (optionally with search and status)
export async function fetchTrucks({
  searchQuery = "",
  statusFilter = ""
}: { searchQuery?: string; statusFilter?: string } = {}) {
  let query = supabase.from("trucks").select("*").order("created_at", { ascending: false });

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }
  if (searchQuery) {
    // Supabase: Use ILIKE for case-insensitive search
    query = query.or(`plate_number.ilike.%${searchQuery}%,model.ilike.%${searchQuery}%`);
  }
  const { data, error } = await query;
  if (error) {
    throw new Error(error.message);
  }

  // Map from snake_case to camelCase (TypeScript type) keys
  const trucks: Truck[] = (data || []).map((item: any) => ({
    id: item.id,
    plateNumber: item.plate_number,
    model: item.model,
    capacity: item.capacity,
    status: item.status,
    fuelLevel: item.fuel_level,
    lastMaintenance: item.last_maintenance,
    assignedDriverId: item.assigned_driver_id || undefined,
  }));

  return trucks;
}
