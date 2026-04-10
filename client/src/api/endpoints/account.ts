import type {
  AccountActivityListResponse,
  AccountStatusResponse,
  BookingListResponse,
  BookingScope,
  ReminderListResponse,
  ReminderQueryParams,
} from "@/api/contracts";
import { apiClient } from "../client";
import { authHeaders } from "../auth-storage";
import { readApiErrorMessage } from "../errors";

export async function getAccountStatus(): Promise<AccountStatusResponse> {
  try {
    const { data } = await apiClient.get<AccountStatusResponse>("/me/account-status", {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load account status"));
  }
}

export async function getAccountActivities(): Promise<AccountActivityListResponse> {
  const { data } = await apiClient.get<AccountActivityListResponse>("/me/account-activities", {
    headers: authHeaders(),
  });
  return data;
}

export async function getMyBookings(
  scope: BookingScope = "all",
  page = 1,
  pageSize = 10,
): Promise<BookingListResponse> {
  const { data } = await apiClient.get<BookingListResponse>("/me/bookings", {
    headers: authHeaders(),
    params: { scope, page, pageSize },
  });
  return data;
}

export async function getMyReminders(
  params: ReminderQueryParams = {},
): Promise<ReminderListResponse> {
  const { data } = await apiClient.get<ReminderListResponse>("/me/reminders", {
    headers: authHeaders(),
    params: {
      ...(params.status ? { status: params.status } : {}),
      ...(params.bookingId ? { bookingId: params.bookingId } : {}),
      ...(params.pageSize ? { pageSize: params.pageSize } : {}),
    },
  });
  return data;
}
