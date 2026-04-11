import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionProvider } from "@/features/session/SessionProvider";
import { useSession } from "@/features/session/useSession";
import { fairroomApi } from "@/api/fairroomApi";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAuthToken: vi.fn(),
    setAuthToken: vi.fn(),
    clearAuthToken: vi.fn(),
    getMe: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
  },
}));

function SessionHarness() {
  const { currentUser, signOut } = useSession();

  return (
    <div>
      <div data-testid="user">{currentUser?.fullName ?? "anonymous"}</div>
      <button onClick={signOut} type="button">
        Sign out
      </button>
    </div>
  );
}

describe("SessionProvider", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("hydrates the current user from the backend and supports sign out", async () => {
    vi.mocked(fairroomApi.getAuthToken).mockReturnValue("token-123");
    vi.mocked(fairroomApi.getMe).mockResolvedValue({
      id: "user-1",
      fullName: "Alice Johnson",
      email: "alice@example.com",
      role: "student",
      createdAt: "2026-04-10T00:00:00.000Z",
    });

    render(
      <SessionProvider>
        <SessionHarness />
      </SessionProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("Alice Johnson");
    });

    expect(fairroomApi.getMe).toHaveBeenCalled();
    expect(fairroomApi.setAuthToken).not.toHaveBeenCalled();

    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(fairroomApi.clearAuthToken).toHaveBeenCalled();
  });
});
