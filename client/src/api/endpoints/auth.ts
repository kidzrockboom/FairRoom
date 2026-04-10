import type { AuthResponse, LoginRequest, RegisterRequest, UserProfile } from "@/api/contracts";
import { apiClient } from "../client";
import { readApiErrorMessage } from "../errors";
import { authHeaders } from "../auth-storage";

export async function register(payload: RegisterRequest): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", payload);
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to register"));
  }
}

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  try {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to sign in"));
  }
}

export async function getMe(): Promise<UserProfile> {
  try {
    const { data } = await apiClient.get<UserProfile>("/me", {
      headers: authHeaders(),
    });
    return data;
  } catch (error: unknown) {
    throw new Error(readApiErrorMessage(error, "Failed to load current user"));
  }
}
