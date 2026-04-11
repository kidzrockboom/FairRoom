import { describe, expect, it } from "vitest";
import {
  buildStrikeDirectoryRow,
  buildStrikeHistoryRow,
  buildStrikeStudentViewModel,
  getStrikeAccountStateLabel,
  getStrikeAccountStateTone,
} from "@/features/admin/strikes/strikesMappers";

describe("admin strikes mappers", () => {
  it("maps directory rows from the admin users response", () => {
    expect(
      buildStrikeDirectoryRow({
        id: "user-1",
        fullName: "Sarah Jenkins",
        email: "sarah@example.com",
        activeStrikes: 2,
        accountState: "warned",
      }),
    ).toMatchObject({
      id: "user-1",
      fullName: "Sarah Jenkins",
      email: "sarah@example.com",
      activeStrikes: 2,
      accountState: "warned",
      initials: "SJ",
    });
  });

  it("maps strike history and the selected student view model", () => {
    const student = buildStrikeStudentViewModel(
      {
        id: "user-1",
        fullName: "Sarah Jenkins",
        email: "sarah@example.com",
        activeStrikes: 2,
        accountState: "warned",
      },
      {
        userId: "user-1",
        activeStrikes: 2,
        items: [
          {
            id: "strike-1",
            userId: "user-1",
            reason: "No show",
            createdAt: "2026-04-10T10:00:00.000Z",
            revokedAt: null,
            givenBy: "admin-1",
          },
          {
            id: "strike-2",
            userId: "user-1",
            reason: "Manual reset",
            createdAt: "2026-04-09T10:00:00.000Z",
            revokedAt: "2026-04-10T12:00:00.000Z",
            givenBy: "admin-1",
          },
        ],
      },
    );

    expect(buildStrikeHistoryRow({
      id: "strike-1",
      userId: "user-1",
      reason: "No show",
      createdAt: "2026-04-10T10:00:00.000Z",
      revokedAt: null,
      givenBy: "admin-1",
    })).toMatchObject({
      id: "strike-1",
      title: "Strike Added",
      description: "No show",
      badge: "added",
    });

    expect(student).toMatchObject({
      id: "user-1",
      fullName: "Sarah Jenkins",
      email: "sarah@example.com",
      activeStrikes: 2,
      accountState: "warned",
    });
    expect(student.history[0]).toMatchObject({
      id: "strike-1",
      title: "Strike Added",
      description: "No show",
      badge: "added",
      date: expect.any(String),
    });
    expect(student.history[1]).toMatchObject({
      id: "strike-2",
      title: "Strike Revoked",
      description: "Manual reset",
      badge: "revoked",
      date: expect.any(String),
    });
    expect(getStrikeAccountStateLabel("restricted")).toBe("Restricted");
    expect(getStrikeAccountStateTone("warned")).toContain("amber");
  });
});
