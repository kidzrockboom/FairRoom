import type {
  AdminUserListResponse,
  AdminUserQueryParams,
  AdminUserStrikesResponse,
  CreateStrikeRequest,
  RevokeStrikeRequest,
  StrikeResponse,
} from "@/api/contracts";
import { fairroomApi } from "@/api/fairroomApi";

export async function loadStrikeDirectory(params: AdminUserQueryParams = {}): Promise<AdminUserListResponse> {
  return fairroomApi.getAdminUsers(params);
}

export async function loadStudentStrikes(userId: string): Promise<AdminUserStrikesResponse> {
  return fairroomApi.getAdminUserStrikes(userId);
}

export async function addStrike(payload: CreateStrikeRequest): Promise<StrikeResponse> {
  return fairroomApi.createAdminStrike(payload);
}

export async function revokeStrike(
  strikeId: string,
  payload: RevokeStrikeRequest = {},
): Promise<StrikeResponse> {
  return fairroomApi.revokeAdminStrike(strikeId, payload);
}
