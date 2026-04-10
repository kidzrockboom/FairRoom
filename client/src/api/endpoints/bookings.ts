import type { Booking, CreateBookingRequest } from "@/api/contracts";
import { authHeaders } from "../auth-storage";
import { apiClient } from "../client";

export async function createBooking(payload: CreateBookingRequest): Promise<Booking> {
  const { data } = await apiClient.post<Booking>("/bookings", payload, {
    headers: authHeaders(),
  });
  return data;
}
