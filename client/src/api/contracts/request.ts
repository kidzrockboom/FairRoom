import type { ReminderStatus } from "./domain";

export type BookingScope = "active" | "past" | "all";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

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
  purpose: string;
  expectedAttendees: number;
}

export interface ReminderQueryParams {
  status?: ReminderStatus;
  bookingId?: string;
  pageSize?: number;
}
