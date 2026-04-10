import type { AccountState, Booking, Reminder, Room, UserProfile } from "./domain";

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface AccountStatusResponse {
  activeStrikes: number;
  bookingEligible: boolean;
  accountState: AccountState;
}

export type AccountActivityListResponse = string[];

export interface RoomSearchResponse {
  items: Room[];
  page: number;
  pageSize: number;
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
