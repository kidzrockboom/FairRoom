import { describe, expect, it } from "vitest";
import { toSearchParams } from "@/features/search-rooms/mappers";

describe("search rooms mappers", () => {
  it("maps filters, search, and pagination into request params", () => {
    const params = toSearchParams(
      {
        date: "2026-04-10",
        capacity: 12,
        timeRange: [9, 17],
        amenityIds: ["projector"],
      },
      "  seminar  ",
      3,
      12,
    );

    expect(params.search).toBe("seminar");
    expect(params.minCapacity).toBe(12);
    expect(params.amenityIds).toEqual(["projector"]);
    expect(params.page).toBe(3);
    expect(params.pageSize).toBe(12);
    expect(typeof params.startsAt).toBe("string");
    expect(typeof params.endsAt).toBe("string");
    expect(params.startsAt && params.endsAt && params.startsAt < params.endsAt).toBe(true);
  });

  it("omits blank search text and null capacity", () => {
    const params = toSearchParams(
      {
        date: "2026-04-10",
        capacity: null,
        timeRange: [9, 17],
        amenityIds: [],
      },
      "   ",
      1,
      12,
    );

    expect(params.search).toBeUndefined();
    expect(params.minCapacity).toBeUndefined();
    expect(params.amenityIds).toBeUndefined();
  });
});
