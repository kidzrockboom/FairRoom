import type { AdminRoomUsageQueryParams, AdminRoomUsageResponse } from "@/api/contracts";
import { authHeaders } from "../auth-storage";
import { apiClient } from "../client";
import { readApiErrorMessage } from "../errors";

export async function getAdminRoomUsage(
  params: AdminRoomUsageQueryParams = {},
): Promise<AdminRoomUsageResponse> {
  try {
    const { data } = await apiClient.get<AdminRoomUsageResponse>("/admin/analytics/room-usage", {
      headers: authHeaders(),
      params,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load room usage analytics."));
  }
}
