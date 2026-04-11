import { describe, expect, it } from "vitest";
import { filterSchema } from "@/features/search-rooms/schemas";

describe("search rooms schemas", () => {
  it("accepts a valid filter payload", () => {
    const result = filterSchema.safeParse({
      date: "2026-04-10",
      capacity: 12,
      timeRange: [9, 17],
      amenityIds: ["projector", "wifi"],
    });

    expect(result.success).toBe(true);
  });

  it("rejects an invalid time range", () => {
    const result = filterSchema.safeParse({
      date: "2026-04-10",
      capacity: null,
      timeRange: [17, 9],
      amenityIds: [],
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Start time must be before end time");
    }
  });
});
