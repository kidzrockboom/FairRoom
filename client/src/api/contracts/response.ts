import type {
  AccountActivityItem,
  AccountState,
  Booking,
  Reminder,
  Room,
  UserProfile,
} from "./domain";

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

export interface RoomBookingsResponse {
  items: Booking[];
}

export interface BookingListResponse {
  items: Booking[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ReminderListResponse {
  items: Reminder[];
  total: number;
}
