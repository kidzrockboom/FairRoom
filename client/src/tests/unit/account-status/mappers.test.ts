import { describe, expect, it } from "vitest";
import { getStandingLabel, getStandingMessage } from "@/features/account-status/accountStatusMappers";

describe("account status mappers", () => {
  it("maps each account state to a readable label", () => {
    expect(getStandingLabel("good")).toBe("Good Standing");
    expect(getStandingLabel("warned")).toBe("Account Warned");
    expect(getStandingLabel("restricted")).toBe("Restricted");
  });

  it("maps each account state to the matching status message", () => {
    expect(getStandingMessage("good")).toBe("Your account is in great shape!");
    expect(getStandingMessage("warned")).toBe("Your account needs attention.");
    expect(getStandingMessage("restricted")).toBe("Booking access is currently paused.");
  });
});
