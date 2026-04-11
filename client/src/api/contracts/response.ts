import type { AccountActivityItem, AccountState, Booking, Reminder, Room, UserProfile } from "./domain";

export interface AmenityResponse {
  id: string;
  label: string;
}

export interface AmenityListResponse {
  items: AmenityResponse[];
  total: number;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface AccountStatusResponse {
  activeStrikes: number;
  bookingEligible: boolean;
  accountState: AccountState;
}

export interface AccountActivityListResponse {
  items: AccountActivityItem[];
}

export interface RoomSearchResponse {
  items: Room[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AdminRoomResponse extends Room {
  usageNotes: string;
  amenities: AmenityResponse[];
}

export interface AdminRoomListResponse {
  items: AdminRoomResponse[];
  total: number;
}

export interface RoomBookingsResponse {
  items: Booking[];
}

export interface BookingListResponse {
  items: Booking[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AdminBookingUserSnippet {
  id: string;
  fullName: string;
}

export interface AdminBookingRoomSnippet {
  id: string;
  roomCode: string;
  name: string;
  location: string;
}

export interface AdminBookingItem {
  id: string;
  user: AdminBookingUserSnippet;
  room: AdminBookingRoomSnippet;
  startsAt: string;
  endsAt: string;
  status: string;
  checkedIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminBookingListResponse {
  items: AdminBookingItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface AdminRoomUsageItem {
  key: string;
  totalBookings: number;
  totalHours: number;
  noShowCount: number;
}

export interface AdminRoomUsageResponse {
  groupBy: string;
  startsAt?: string | null;
  endsAt?: string | null;
  items: AdminRoomUsageItem[];
}

export interface AdminUserItem {
  id: string;
  fullName: string;
  email: string;
  role: string;
  activeStrikes: number;
  accountState: string;
}

export interface AdminUserListResponse {
  items: AdminUserItem[];
  total: number;
}

export interface StrikeResponse {
  id: string;
  userId: string;
  reason: string;
  createdAt: string;
  revokedAt: string | null;
  givenBy: string;
}

export interface AdminUserStrikesResponse {
  userId: string;
  activeStrikes: number;
  items: StrikeResponse[];
}

export interface BookingDetailUser {
  id: string;
  fullName: string;
  email: string;
}

export interface BookingDetailRoom {
  id: string;
  roomCode: string;
  name: string;
  location: string;
}

export interface BookingDetailResponse {
  id: string;
  user: BookingDetailUser;
  room: BookingDetailRoom;
  startsAt: string;
  endsAt: string;
  status: string;
  checkedIn: boolean;
  createdAt: string;
  updatedAt: string;
}

export type ReminderListResponse = Reminder[];
