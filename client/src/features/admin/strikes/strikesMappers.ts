import type {
  AdminUserItem,
  AdminUserListResponse,
  AdminUserStrikesResponse,
  StrikeResponse,
  AccountState,
} from "@/api/contracts";

export type StrikeAccountState = AccountState;

export type StrikeDirectoryRowViewModel = {
  id: string;
  fullName: string;
  email: string;
  activeStrikes: number;
  accountState: StrikeAccountState;
  initials: string;
};

export type StrikeHistoryRowViewModel = {
  id: string;
  title: string;
  description: string;
  date: string;
  badge: "added" | "revoked";
};

export type StrikeStudentViewModel = {
  id: string;
  fullName: string;
  email: string;
  activeStrikes: number;
  accountState: StrikeAccountState;
  lastUpdateLabel: string;
  history: StrikeHistoryRowViewModel[];
};

type StrikeDirectoryUser = Pick<
  AdminUserItem,
  "id" | "fullName" | "email" | "activeStrikes" | "accountState"
>;

export function buildStrikeDirectoryRows(response: AdminUserListResponse): StrikeDirectoryRowViewModel[] {
  return response.items.map(buildStrikeDirectoryRow);
}

export function buildStrikeDirectoryRow(user: StrikeDirectoryUser): StrikeDirectoryRowViewModel {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    activeStrikes: user.activeStrikes,
    accountState: buildStrikeAccountState(user.accountState),
    initials: getInitials(user.fullName),
  };
}

export function buildStrikeStudentViewModel(
  user: StrikeDirectoryUser,
  strikes: AdminUserStrikesResponse,
): StrikeStudentViewModel {
  const history = strikes.items.map(buildStrikeHistoryRow);
  const lastUpdateLabel = history[0]?.date ?? "No recent updates";

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    activeStrikes: strikes.activeStrikes,
    accountState: buildStrikeAccountState(user.accountState),
    lastUpdateLabel,
    history,
  };
}

export function buildStrikeHistoryRow(strike: StrikeResponse): StrikeHistoryRowViewModel {
  const revoked = Boolean(strike.revokedAt);
  return {
    id: strike.id,
    title: revoked ? "Strike Revoked" : "Strike Added",
    description: strike.reason,
    date: formatDate(revoked ? strike.revokedAt ?? strike.createdAt : strike.createdAt),
    badge: revoked ? "revoked" : "added",
  };
}

export function buildStrikeAccountState(value: string): StrikeAccountState {
  if (value === "good" || value === "warned" || value === "restricted") {
    return value;
  }
  return "good";
}

export function getStrikeAccountStateLabel(value: StrikeAccountState): string {
  switch (value) {
    case "good":
      return "Good standing";
    case "warned":
      return "Account warned";
    case "restricted":
      return "Restricted";
  }
}

export function getStrikeAccountStateTone(value: StrikeAccountState) {
  switch (value) {
    case "good":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "warned":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "restricted":
      return "border-destructive/20 bg-destructive/10 text-destructive";
  }
}

function getInitials(fullName: string) {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
