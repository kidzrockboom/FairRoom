import type {
  AccountActivityItem,
  AccountState,
  AvailabilityWindow,
  BookingSummary,
  Reminder,
  Room,
} from "./domain";

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

export interface RoomAvailabilityResponse {
  roomId: string;
  requestedStartsAt: string;
  requestedEndsAt: string;
  windows: AvailabilityWindow[];
}

export interface BookingListResponse {
  items: BookingSummary[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ReminderListResponse {
  items: Reminder[];
  total: number;
}
