import type { Booking } from "@/api/contracts";
import { formatBookingSchedule, formatBookingStatus } from "./bookingDetailsMappers";

export type BookingListItemViewModel = {
  id: string;
  roomName: string;
  roomCode: string;
  startsAt: string;
  endsAt: string;
  scheduleLabel: string;
  status: string;
  statusLabel: string;
  statusTone: "success" | "warning" | "muted";
  canEdit: boolean;
  canCancel: boolean;
};

const STATUS_TONES: Record<string, BookingListItemViewModel["statusTone"]> = {
  active: "success",
  cancelled: "muted",
  completed: "muted",
  no_show: "warning",
};

export function buildBookingListItemViewModel(
  booking: Booking,
  now: Date = new Date(),
): BookingListItemViewModel {
  return {
    id: booking.id,
    roomName: booking.roomName,
    roomCode: booking.roomCode,
    startsAt: booking.startsAt,
    endsAt: booking.endsAt,
    scheduleLabel: formatBookingSchedule(booking.startsAt, booking.endsAt, now),
    status: booking.status,
    statusLabel: formatBookingStatus(booking.status),
    statusTone: STATUS_TONES[booking.status] ?? "muted",
    canEdit: booking.status === "active",
    canCancel: booking.status === "active",
  };
}

export function buildBookingListViewModels(
  bookings: Booking[],
  now: Date = new Date(),
): BookingListItemViewModel[] {
  return bookings.map((booking) => buildBookingListItemViewModel(booking, now));
}
