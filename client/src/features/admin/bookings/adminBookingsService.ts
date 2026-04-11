import { fairroomApi } from "@/api/fairroomApi";
import type { AdminBookingQueryParams } from "@/api/contracts";

export async function loadAdminBookings(params: AdminBookingQueryParams) {
  return fairroomApi.getAdminBookings(params);
}
