import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { screen, waitFor } from "@testing-library/react";
import RegisterForm from "@/features/auth/components/RegisterForm";
import { useSession } from "@/features/session/useSession";
import { renderWithRouter } from "@/tests/test-utils";

const navigateMock = vi.fn();
const registerMock = vi.fn();

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

describe("RegisterForm", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("submits account details and navigates on success", async () => {
    vi.mocked(useSession).mockReturnValue({
      currentUser: null,
      isAuthenticated: false,
      isHydrating: false,
      signIn: vi.fn(),
      register: registerMock,
      signOut: vi.fn(),
      refreshCurrentUser: vi.fn(),
    });
    registerMock.mockResolvedValue({
      id: "user-1",
      fullName: "Alice Johnson",
      email: "alice@example.com",
      role: "student",
    });

    const user = userEvent.setup();
    renderWithRouter(<RegisterForm />);

    await user.type(screen.getByLabelText("Full name"), "Alice Johnson");
    await user.type(screen.getByLabelText("Email"), "alice@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.type(screen.getByLabelText("Confirm password"), "password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        fullName: "Alice Johnson",
        email: "alice@example.com",
        password: "password123",
      });
    });
    expect(navigateMock).toHaveBeenCalledWith("/search", { replace: true });
  });
});
