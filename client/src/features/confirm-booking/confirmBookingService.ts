import { fairroomApi } from "@/api/fairroomApi";
import type { Booking, CreateBookingRequest } from "@/api/contracts";
import { readApiErrorMessage } from "@/api/errors";

export async function submitBooking(payload: CreateBookingRequest): Promise<Booking> {
  try {
    return await fairroomApi.createBooking(payload);
  } catch (error: unknown) {
    throw new Error(
      readApiErrorMessage(error, "We could not create your booking. Please try again."),
    );
  }
}
