import type { AdminBookingListResponse, AdminBookingQueryParams } from "@/api/contracts";
import { authHeaders } from "../auth-storage";
import { apiClient } from "../client";
import { readApiErrorMessage } from "../errors";

export async function getAdminBookings(
  params: AdminBookingQueryParams = {},
): Promise<AdminBookingListResponse> {
  try {
    const { data } = await apiClient.get<AdminBookingListResponse>("/admin/bookings", {
      headers: authHeaders(),
      params,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load admin bookings."));
  }
}
