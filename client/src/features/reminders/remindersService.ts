import type { Reminder } from "@/api/contracts";
import { fairroomApi } from "@/api/fairroomApi";

function normalizeReminderList(value: unknown): Reminder[] {
  if (Array.isArray(value)) {
    return value as Reminder[];
  }

  if (value && typeof value === "object") {
    const items = (value as { items?: unknown }).items;
    if (Array.isArray(items)) {
      return items as Reminder[];
    }
  }

  return [];
}

export async function loadRecentReminders(pageSize = 5): Promise<Reminder[]> {
  const reminders = await fairroomApi.getMyReminders({ pageSize }).catch(() => []);
  return normalizeReminderList(reminders);
}
