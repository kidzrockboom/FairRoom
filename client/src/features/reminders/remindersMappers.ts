import type { Reminder } from "@/api/contracts";

const CHANNEL_LABELS: Record<Reminder["channel"], string> = {
  email: "Email",
  push: "Push",
  sms: "SMS",
};

const STATUS_LABELS: Record<Reminder["status"], string> = {
  scheduled: "Scheduled",
  delivered: "Delivered",
  failed: "Failed",
};

const STATUS_BADGE_CLASSES: Record<Reminder["status"], string> = {
  scheduled: "border-transparent bg-muted text-muted-foreground hover:bg-muted",
  delivered: "border-transparent bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  failed: "border-transparent bg-red-100 text-red-700 hover:bg-red-100",
};

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  weekday: "short",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
};

export function formatReminderChannel(channel: Reminder["channel"]): string {
  return CHANNEL_LABELS[channel] ?? channel;
}

export function formatReminderStatus(status: Reminder["status"]): string {
  return STATUS_LABELS[status] ?? status;
}

export function getReminderStatusBadgeClassName(status: Reminder["status"]): string {
  return STATUS_BADGE_CLASSES[status] ?? STATUS_BADGE_CLASSES.scheduled;
}

export function formatReminderDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-GB", DATE_FORMAT_OPTIONS).format(new Date(dateString));
}

export function getReminderSummary(reminder: Reminder): string {
  if (reminder.status === "delivered") {
    return `Delivered at ${formatReminderDate(reminder.sentAt)}`;
  }

  if (reminder.status === "failed") {
    return `Failed at ${formatReminderDate(reminder.sentAt)}`;
  }

  return `Scheduled for ${formatReminderDate(reminder.scheduledFor)}`;
}

export function getReminderDetail(reminder: Reminder): string {
  if (reminder.status === "failed" && reminder.failureReason) {
    return reminder.failureReason;
  }

  return `Booking ${reminder.bookingId}`;
}
