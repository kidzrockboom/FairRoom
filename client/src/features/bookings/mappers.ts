import type { Booking, Reminder, ReminderChannel, ReminderStatus, Room } from "@/api/contracts";

export type ReminderTone = "success" | "warning" | "neutral";

export interface ReminderRowViewModel {
  id: string;
  channelLabel: string;
  statusLabel: string;
  tone: ReminderTone;
  detailLabel: string;
}

export interface BookingReminderViewModel {
  roomName: string;
  countdownLabel: string;
  location: string;
  scheduleLabel: string;
  checkInDeadlineLabel: string;
  viewDetailsHref: string;
  directionsHref: string;
  reminders: ReminderRowViewModel[];
}

const CHANNEL_LABELS: Record<ReminderChannel, string> = {
  email: "Email",
  push: "Push",
  sms: "SMS",
};

const STATUS_LABELS: Record<ReminderStatus, string> = {
  scheduled: "Scheduled",
  delivered: "Delivered",
  failed: "Failed",
};

const STATUS_TONES: Record<ReminderStatus, ReminderTone> = {
  scheduled: "neutral",
  delivered: "success",
  failed: "warning",
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

export function formatReminderChannel(channel: ReminderChannel): string {
  return CHANNEL_LABELS[channel];
}

export function formatReminderStatus(status: ReminderStatus): string {
  return STATUS_LABELS[status];
}

export function reminderStatusTone(status: ReminderStatus): ReminderTone {
  return STATUS_TONES[status];
}

export function formatReminderCountdown(startsAt: string, now: Date = new Date()): string {
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

export function formatReminderSchedule(
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

export function formatReminderDeadline(startsAt: string): string {
  const deadline = new Date(new Date(startsAt).getTime() - 15 * 60 * 1000);
  return new Intl.DateTimeFormat("en-GB", TIME_FORMAT_OPTIONS).format(deadline);
}

export function buildDirectionsUrl(location: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
}

export function mapReminderRow(reminder: Reminder): ReminderRowViewModel {
  const detailLabel =
    reminder.status === "failed"
      ? reminder.failureReason || "Delivery failed"
      : new Intl.DateTimeFormat("en-GB", TIME_FORMAT_OPTIONS).format(
          new Date(reminder.status === "delivered" ? reminder.sentAt : reminder.scheduledFor),
        );

  return {
    id: reminder.id,
    channelLabel: formatReminderChannel(reminder.channel),
    statusLabel: formatReminderStatus(reminder.status),
    tone: reminderStatusTone(reminder.status),
    detailLabel,
  };
}

export function buildBookingReminderViewModel(
  booking: Booking,
  room: Room,
  reminders: Reminder[],
  now: Date = new Date(),
): BookingReminderViewModel {
  return {
    roomName: room.name || booking.roomName,
    countdownLabel: formatReminderCountdown(booking.startsAt, now),
    location: room.location,
    scheduleLabel: formatReminderSchedule(booking.startsAt, booking.endsAt, now),
    checkInDeadlineLabel: formatReminderDeadline(booking.startsAt),
    viewDetailsHref: `/rooms/${room.id}`,
    directionsHref: buildDirectionsUrl(room.location),
    reminders: reminders.map(mapReminderRow),
  };
}
