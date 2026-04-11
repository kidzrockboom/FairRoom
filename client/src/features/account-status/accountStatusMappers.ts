import type { AccountState } from "@/api/contracts";

export function getStandingLabel(accountState: AccountState): string {
  if (accountState === "restricted") {
    return "Restricted";
  }

  if (accountState === "warned") {
    return "Account Warned";
  }

  return "Good Standing";
}

export function getStandingMessage(accountState: AccountState): string {
  if (accountState === "restricted") {
    return "Booking access is currently paused.";
  }

  if (accountState === "warned") {
    return "Your account needs attention.";
  }

  return "Your account is in great shape!";
}
