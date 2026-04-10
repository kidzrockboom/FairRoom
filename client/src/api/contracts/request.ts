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

export interface UpdateBookingRequest {
  startsAt?: string;
  endsAt?: string;
}

export interface CancelBookingRequest {
  reason?: string;
}

export interface ReminderQueryParams {
  status?: ReminderStatus;
  bookingId?: string;
  pageSize?: number;
}

export interface AdminBookingQueryParams {
  search?: string;
  status?: string;
  userId?: string;
  roomId?: string;
  startsAt?: string;
  endsAt?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminUserQueryParams {
  search?: string;
}

export interface CreateStrikeRequest {
  userId: string;
  reason: string;
  sourceBookingId?: string;
}

export interface RevokeStrikeRequest {
  reason?: string;
}
