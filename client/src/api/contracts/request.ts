export type BookingScope = "active" | "past" | "all";

export interface SearchRoomsParams {
  search?: string;
  minCapacity?: number;
  startsAt?: string;
  endsAt?: string;
  page?: number;
  pageSize?: number;
}

export interface CreateBookingRequest {
  roomId: string;
  startsAt: string;
  endsAt: string;
}
