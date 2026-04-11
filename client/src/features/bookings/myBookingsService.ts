import type { Booking, BookingScope, CancelBookingRequest, UpdateBookingRequest } from "@/api/contracts";
import { fairroomApi } from "@/api/fairroomApi";

export async function loadMyBookings(scope: BookingScope, page: number, pageSize: number) {
  return fairroomApi.getMyBookings(scope, page, pageSize);
}

export async function updateMyBooking(bookingId: string, payload: UpdateBookingRequest): Promise<Booking> {
  return fairroomApi.updateBooking(bookingId, payload);
}

export async function cancelMyBooking(
  bookingId: string,
  payload: CancelBookingRequest = {},
): Promise<Booking> {
  return fairroomApi.cancelBooking(bookingId, payload);
}
