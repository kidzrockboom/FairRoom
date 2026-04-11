import { fairroomApi } from "@/api/fairroomApi";
import type { AccountActivityItem } from "@/api/contracts";

function isAccountActivityItem(value: unknown): value is AccountActivityItem {
  return Boolean(
    value &&
      typeof value === "object" &&
      "id" in value &&
      "title" in value &&
      "description" in value &&
      "occurredAt" in value &&
      "status" in value,
  );
}

function normalizeAccountActivities(value: unknown): AccountActivityItem[] {
  if (Array.isArray(value)) {
    return value.filter(isAccountActivityItem);
  }

  if (value && typeof value === "object") {
    const items = (value as { items?: unknown }).items;
    if (Array.isArray(items)) {
      return items.filter(isAccountActivityItem);
    }
  }

  return [];
}

export async function loadAccountStatusOverview() {
  const accountStatus = await fairroomApi.getAccountStatus();
  const accountActivities = normalizeAccountActivities(await fairroomApi.getAccountActivities().catch(() => []));

  return {
    accountStatus,
    accountActivities,
  };
}
