import type { AdminBookingItem, AdminBookingQueryParams, BookingStatus } from "@/api/contracts";

export type AdminBookingStatusFilter = BookingStatus | "all";

export type AdminBookingRowViewModel = {
  id: string;
  userFullName: string;
  userInitials: string;
  userRef: string;
  roomName: string;
  roomCode: string;
  roomLocation: string;
  dateLabel: string;
  timeLabel: string;
  status: BookingStatus;
};

export const ADMIN_BOOKING_STATUS_OPTIONS: Array<{
  label: string;
  value: AdminBookingStatusFilter;
}> = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Completed", value: "completed" },
  { label: "No-Show", value: "no_show" },
];

export const ADMIN_BOOKING_PAGE_SIZES = [10, 12, 24] as const;

export function buildAdminBookingQuery(
  search: string,
  status: AdminBookingStatusFilter,
  date: string,
  page: number,
  pageSize: number,
): AdminBookingQueryParams {
  const start = date ? `${date}T00:00:00` : undefined;
  const end = date ? `${date}T23:59:59` : undefined;

  return {
    search: search.trim() || undefined,
    status: status === "all" ? undefined : status,
    startsAt: start,
    endsAt: end,
    page,
    pageSize,
  };
}

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimeRange(startsAt: string, endsAt: string): string {
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${formatter.format(new Date(startsAt))} - ${formatter.format(new Date(endsAt))}`;
}

function bookingStatus(status: string): BookingStatus {
  if (status === "active" || status === "cancelled" || status === "completed" || status === "no_show") {
    return status;
  }
  return "active";
}

export function buildAdminBookingRowViewModel(booking: AdminBookingItem): AdminBookingRowViewModel {
  return {
    id: booking.id,
    userFullName: booking.user.fullName,
    userInitials: getInitials(booking.user.fullName),
    userRef: booking.user.id.slice(0, 8).toUpperCase(),
    roomName: booking.room.name,
    roomCode: booking.room.roomCode,
    roomLocation: booking.room.location,
    dateLabel: formatDate(booking.startsAt),
    timeLabel: formatTimeRange(booking.startsAt, booking.endsAt),
    status: bookingStatus(booking.status),
  };
}
