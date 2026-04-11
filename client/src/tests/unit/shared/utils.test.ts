import { describe, expect, it } from "vitest";
import { cn, formatHour } from "@/lib/utils";

describe("shared utilities", () => {
  it("merges class names with cn", () => {
    expect(cn("text-sm", undefined, "font-medium")).toBe("text-sm font-medium");
  });

  it("formats hours in 12-hour time", () => {
    expect(formatHour(0)).toBe("12:00 AM");
    expect(formatHour(9)).toBe("09:00 AM");
    expect(formatHour(12)).toBe("12:00 PM");
    expect(formatHour(17)).toBe("05:00 PM");
  });
});
