import { describe, expect, it } from "vitest";
import { readApiErrorMessage } from "@/api/errors";

describe("api errors", () => {
  it("reads nested backend error messages", () => {
    const error = {
      isAxiosError: true,
      response: {
        data: {
          error: {
            code: "INVALID_PASSWORD",
            message: "Invalid password",
          },
        },
      },
    } as unknown;

    expect(readApiErrorMessage(error, "Fallback")).toBe("Invalid password");
  });

  it("reads direct response messages", () => {
    const error = {
      isAxiosError: true,
      response: {
        data: {
          message: "Email already exists",
        },
      },
    } as unknown;

    expect(readApiErrorMessage(error, "Fallback")).toBe("Email already exists");
  });

  it("falls back to the provided text for plain errors", () => {
    expect(readApiErrorMessage(new Error("Boom"), "Fallback")).toBe("Boom");
  });
});
