import type { BookingDetailResponse } from "@/api/contracts";

export interface BookingDetailsViewModel {
  roomName: string;
  countdownLabel: string;
  location: string;
  scheduleLabel: string;
  checkInDeadlineLabel: string;
  bookingStatusLabel: string;
}

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No-show",
};

const TIME_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
};

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
};

export function formatBookingStatus(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function formatBookingCountdown(startsAt: string, now: Date = new Date()): string {
  const startMs = new Date(startsAt).getTime();
  const diffMinutes = Math.max(0, Math.round((startMs - now.getTime()) / 60000));

  if (diffMinutes === 0) {
    return "starts now";
  }

  if (diffMinutes < 60) {
    return `begins in ${diffMinutes} minute${diffMinutes === 1 ? "" : "s"}`;
  }

  const hours = Math.floor(diffMinutes / 60);
  const remainingMinutes = diffMinutes % 60;

  if (remainingMinutes === 0) {
    return `begins in ${hours} hour${hours === 1 ? "" : "s"}`;
  }

  return `begins in ${hours} hour${hours === 1 ? "" : "s"} ${remainingMinutes} minute${
    remainingMinutes === 1 ? "" : "s"
  }`;
}

export function formatBookingSchedule(
  startsAt: string,
  endsAt: string,
  now: Date = new Date(),
): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const isSameDay =
    start.getUTCFullYear() === now.getUTCFullYear() &&
    start.getUTCMonth() === now.getUTCMonth() &&
    start.getUTCDate() === now.getUTCDate();

  const startLabel = new Intl.DateTimeFormat("en-GB", TIME_FORMAT_OPTIONS).format(start);
  const endLabel = new Intl.DateTimeFormat("en-GB", TIME_FORMAT_OPTIONS).format(end);

  if (isSameDay) {
    return `${startLabel} – ${endLabel} (Today)`;
  }

  const dateLabel = new Intl.DateTimeFormat("en-GB", DATE_FORMAT_OPTIONS).format(start);
  return `${dateLabel} · ${startLabel} – ${endLabel}`;
}

export function formatBookingDeadline(startsAt: string): string {
  const deadline = new Date(new Date(startsAt).getTime() - 15 * 60 * 1000);
  return new Intl.DateTimeFormat("en-GB", TIME_FORMAT_OPTIONS).format(deadline);
}

export function buildBookingDetailsViewModel(
  booking: BookingDetailResponse,
  now: Date = new Date(),
): BookingDetailsViewModel {
  return {
    roomName: booking.room.name,
    countdownLabel: formatBookingCountdown(booking.startsAt, now),
    location: booking.room.location,
    scheduleLabel: formatBookingSchedule(booking.startsAt, booking.endsAt, now),
    checkInDeadlineLabel: formatBookingDeadline(booking.startsAt),
    bookingStatusLabel: formatBookingStatus(booking.status),
  };
}
