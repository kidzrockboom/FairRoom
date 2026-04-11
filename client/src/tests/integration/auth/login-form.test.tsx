import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import LoginForm from "@/features/auth/components/LoginForm";
import { useSession } from "@/features/session/useSession";
import { renderWithRouter } from "@/tests/test-utils";

const navigateMock = vi.fn();
const signInMock = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("@/features/session/useSession", () => ({
  useSession: vi.fn(),
}));

describe("LoginForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("submits credentials and navigates on success", async () => {
    vi.mocked(useSession).mockReturnValue({
      currentUser: null,
      isAuthenticated: false,
      isHydrating: false,
      signIn: signInMock,
      register: vi.fn(),
      signOut: vi.fn(),
      refreshCurrentUser: vi.fn(),
    });
    signInMock.mockResolvedValue({
      id: "user-1",
      fullName: "Alice Johnson",
      email: "alice@example.com",
      role: "student",
    });

    const user = userEvent.setup();
    renderWithRouter(<LoginForm />);

    await user.type(screen.getByLabelText("Email"), "student@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({
        email: "student@example.com",
        password: "password123",
      });
    });
    expect(navigateMock).toHaveBeenCalledWith("/search", { replace: true });
  });
});
