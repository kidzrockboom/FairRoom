import type { UserRole } from "@/api/contracts";

export const getHomePathForRole = (role: UserRole) =>
  role === "admin" ? "/admin/overview" : "/search";
