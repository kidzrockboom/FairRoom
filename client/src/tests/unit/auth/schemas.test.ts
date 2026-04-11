import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/features/auth/schemas";

describe("auth schemas", () => {
  it("accepts a valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "student@example.com",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects a short password for login", () => {
    const result = loginSchema.safeParse({
      email: "student@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Password must be at least 8 characters");
    }
  });

  it("rejects mismatched registration passwords", () => {
    const result = registerSchema.safeParse({
      fullName: "Student User",
      email: "student@example.com",
      password: "password123",
      confirmPassword: "password321",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.path).toEqual(["confirmPassword"]);
      expect(result.error.issues[0]?.message).toBe("Passwords do not match");
    }
  });
});
