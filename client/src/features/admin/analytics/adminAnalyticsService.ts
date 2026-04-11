import { fairroomApi } from "@/api/fairroomApi";
import type { AdminRoomUsageResponse } from "@/api/contracts";
import { readApiErrorMessage } from "@/api/errors";

export async function loadAdminRoomUsage(): Promise<AdminRoomUsageResponse> {
  try {
    return await fairroomApi.getAdminRoomUsage({
      groupBy: "room",
    });
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load room usage analytics."));
  }
}
