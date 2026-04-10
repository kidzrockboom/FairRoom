import { fairroomApi } from "@/api/fairroomApi";
import type { BookingDetailResponse } from "@/api/contracts";

export async function loadBookingDetails(bookingId: string): Promise<BookingDetailResponse> {
  return fairroomApi.getBooking(bookingId);
}
