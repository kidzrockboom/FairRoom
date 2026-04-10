import type {
  AdminBookingListResponse,
  AdminBookingQueryParams,
  AdminUserListResponse,
  AdminUserQueryParams,
  AdminUserStrikesResponse,
  CreateStrikeRequest,
  RevokeStrikeRequest,
  StrikeResponse,
} from "@/api/contracts";
import { authHeaders } from "../auth-storage";
import { apiClient } from "../client";
import { readApiErrorMessage } from "../errors";

export async function getAdminBookings(
  params: AdminBookingQueryParams = {},
): Promise<AdminBookingListResponse> {
  try {
    const { data } = await apiClient.get<AdminBookingListResponse>("/admin/bookings", {
      headers: authHeaders(),
      params,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load admin bookings."));
  }
}

export async function getAdminUsers(
  params: AdminUserQueryParams = {},
): Promise<AdminUserListResponse> {
  try {
    const { data } = await apiClient.get<AdminUserListResponse>("/admin/users", {
      headers: authHeaders(),
      params,
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load admin users."));
  }
}

export async function getAdminUserStrikes(userId: string): Promise<AdminUserStrikesResponse> {
  try {
    const { data } = await apiClient.get<AdminUserStrikesResponse>(
      `/admin/users/${userId}/strikes`,
      {
        headers: authHeaders(),
      },
    );
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load user strikes."));
  }
}

export async function createAdminStrike(payload: CreateStrikeRequest): Promise<StrikeResponse> {
  try {
    const { data } = await apiClient.post<StrikeResponse>("/admin/strikes", payload, {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to add strike."));
  }
}

export async function revokeAdminStrike(
  strikeId: string,
  payload: RevokeStrikeRequest = {},
): Promise<StrikeResponse> {
  try {
    const { data } = await apiClient.post<StrikeResponse>(`/admin/strikes/${strikeId}/revoke`, payload, {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to revoke strike."));
  }
}
