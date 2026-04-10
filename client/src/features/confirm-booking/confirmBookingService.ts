import { fairroomApi } from "@/api/fairroomApi";
import type { Booking, CreateBookingRequest } from "@/api/contracts";

export async function submitBooking(payload: CreateBookingRequest): Promise<Booking> {
  return fairroomApi.createBooking(payload);
}
