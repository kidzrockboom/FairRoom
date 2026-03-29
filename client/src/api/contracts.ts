export type UserRole = "student" | "admin";
export type BookingStatus = "active" | "cancelled" | "completed" | "no_show";
export type ReminderStatus = "scheduled" | "delivered" | "failed";
export type ReminderChannel = "email" | "push" | "sms";
export type AccountState = "good" | "warned" | "restricted";
export type BookingScope = "active" | "past" | "all";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface AccountStatusResponse {
  activeStrikes: number;
  bookingEligible: boolean;
  accountState: AccountState;
}

export interface AccountActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  occurredAt: string;
  status: string;
  sourceEntityType: string;
  sourceEntityId: string;
}

export interface AccountActivityListResponse {
  items: AccountActivityItem[];
}

export interface RoomSearchItem {
  id: string;
  roomCode: string;
  name: string;
  location: string;
  capacity: number;
  isAvailableForRequestedRange: boolean;
}

export interface RoomSearchResponse {
  items: RoomSearchItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Room {
  id: string;
  roomCode: string;
  name: string;
  location: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
}

export interface AvailabilityWindow {
  startsAt: string;
  endsAt: string;
  status: "available" | "booked";
}

export interface RoomAvailabilityResponse {
  roomId: string;
  requestedStartsAt: string;
  requestedEndsAt: string;
  windows: AvailabilityWindow[];
}

export interface BookingSummary {
  id: string;
  roomId: string;
  roomCode: string;
  roomName: string;
  startsAt: string;
  endsAt: string;
  status: BookingStatus;
  checkedIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BookingListResponse {
  items: BookingSummary[];
  page: number;
  pageSize: number;
  total: number;
}

export interface Reminder {
  id: string;
  bookingId: string;
  channel: ReminderChannel;
  scheduledFor: string;
  sentAt: string | null;
  status: ReminderStatus;
  failureReason: string | null;
  createdAt: string;
}

export interface ReminderListResponse {
  items: Reminder[];
  total: number;
}

export interface CreateBookingRequest {
  roomId: string;
  startsAt: string;
  endsAt: string;
}

export interface SearchRoomsParams {
  search?: string;
  minCapacity?: number;
  startsAt?: string;
  endsAt?: string;
  onlyAvailable?: boolean;
  page?: number;
  pageSize?: number;
}
