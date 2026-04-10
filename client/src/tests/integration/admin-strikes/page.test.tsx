import { afterEach, describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import type { AdminUserItem } from "@/api/contracts";
import AdminStrikesPage from "@/pages/admin/AdminStrikesPage";
import { fairroomApi } from "@/api/fairroomApi";

vi.mock("@/api/fairroomApi", () => ({
  fairroomApi: {
    getAdminUsers: vi.fn(),
    getAdminUserStrikes: vi.fn(),
    createAdminStrike: vi.fn(),
    revokeAdminStrike: vi.fn(),
  },
}));

type StrikeState = {
  activeStrikes: number;
  items: Array<{
    id: string;
    userId: string;
    reason: string;
    createdAt: string;
    revokedAt: string | null;
    givenBy: string;
  }>;
};

function createUsers() {
  return [
    {
      id: "user-1",
      fullName: "Sarah Jenkins",
      email: "sarah@example.com",
      role: "student",
      activeStrikes: 2,
      accountState: "warned",
    },
    {
      id: "user-2",
      fullName: "Michael Chen",
      email: "michael@example.com",
      role: "student",
      activeStrikes: 1,
      accountState: "good",
    },
  ] satisfies AdminUserItem[];
}

function buildStrikeState(initialActiveStrikes: number, entries: StrikeState["items"]): StrikeState {
  return {
    activeStrikes: initialActiveStrikes,
    items: entries,
  };
}

describe("AdminStrikesPage", () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it("loads the directory, switches students, and adds a strike", async () => {
    let users: AdminUserItem[] = createUsers();
    const strikeStates: Record<string, StrikeState> = {
      "user-1": buildStrikeState(2, [
        {
          id: "strike-1",
          userId: "user-1",
          reason: "No show",
          createdAt: "2026-04-10T10:00:00.000Z",
          revokedAt: null,
          givenBy: "admin-1",
        },
      ]),
      "user-2": buildStrikeState(1, [
        {
          id: "strike-2",
          userId: "user-2",
          reason: "Late cancellation",
          createdAt: "2026-04-09T10:00:00.000Z",
          revokedAt: null,
          givenBy: "admin-1",
        },
      ]),
    };

    vi.mocked(fairroomApi.getAdminUsers).mockImplementation(async (params = {}) => {
      const search = typeof params.search === "string" ? params.search.trim().toLowerCase() : "";
      return {
        items: users.filter((user) => {
          return (
            !search ||
            user.fullName.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search)
          );
        }),
        total: users.length,
      };
    });

    vi.mocked(fairroomApi.getAdminUserStrikes).mockImplementation(async (userId: string) => {
      const state = strikeStates[userId];
      return {
        userId,
        activeStrikes: state.activeStrikes,
        items: state.items,
      };
    });

    vi.mocked(fairroomApi.createAdminStrike).mockImplementation(async ({ userId, reason }) => {
      const state = strikeStates[userId];
      const strike = {
        id: `strike-${state.items.length + 1}`,
        userId,
        reason,
        createdAt: "2026-04-10T12:00:00.000Z",
        revokedAt: null,
        givenBy: "admin-1",
      };

      state.items = [strike, ...state.items];
      state.activeStrikes += 1;
      users = users.map((user) => (user.id === userId ? { ...user, activeStrikes: user.activeStrikes + 1 } : user));

      return strike;
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/admin/strikes"]}>
        <Routes>
          <Route path="/admin/strikes" element={<AdminStrikesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getAllByRole("heading", { name: "Student Directory" }).length).toBeGreaterThan(0);
    });

    expect(await screen.findByText("Sarah Jenkins")).toBeInTheDocument();
    expect(screen.getByText("2 Strikes")).toBeInTheDocument();
    expect(screen.getByText("Strike Policy Quick-Ref")).toBeInTheDocument();
    const mainContent = await screen.findByTestId("strike-main-content");
    expect(within(mainContent).getByText("Sarah Jenkins")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /michael chen/i }));

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: "Michael Chen" })).toBeInTheDocument();
      expect(screen.getByText("Late cancellation")).toBeInTheDocument();
    });

    await user.click(within(mainContent).getByRole("button", { name: "+ Increase" }));
    const reasonField = within(mainContent).getByPlaceholderText(
      "Please provide a detailed justification for this strike adjustment...",
    );
    await user.type(reasonField, "Confirmed misuse");
    await user.click(within(mainContent).getByRole("button", { name: "Save User Record" }));

    await waitFor(() => {
      expect(fairroomApi.createAdminStrike).toHaveBeenCalledWith({
        userId: "user-2",
        reason: "Confirmed misuse",
      });
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Michael Chen.*2 Strikes/i })).toBeInTheDocument();
      expect(screen.getAllByText("Strike Added").length).toBeGreaterThan(0);
    });
  });

  it("revokes an active strike when the proposed count is lowered", async () => {
    let users: AdminUserItem[] = [
      {
        id: "user-1",
        fullName: "Sarah Jenkins",
        email: "sarah@example.com",
        role: "student",
        activeStrikes: 2,
        accountState: "warned",
      },
    ];
    const strikeStates: Record<string, StrikeState> = {
      "user-1": buildStrikeState(2, [
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
          reason: "Late cancellation",
          createdAt: "2026-04-09T10:00:00.000Z",
          revokedAt: null,
          givenBy: "admin-1",
        },
      ]),
    };

    vi.mocked(fairroomApi.getAdminUsers).mockImplementation(async () => ({
      items: users,
      total: users.length,
    }));
    vi.mocked(fairroomApi.getAdminUserStrikes).mockImplementation(async (userId: string) => {
      const state = strikeStates[userId];
      return {
        userId,
        activeStrikes: state.activeStrikes,
        items: state.items,
      };
    });
    vi.mocked(fairroomApi.revokeAdminStrike).mockImplementation(async (strikeId: string) => {
      const state = strikeStates["user-1"];
      state.items = state.items.map((item) =>
        item.id === strikeId ? { ...item, revokedAt: "2026-04-10T13:00:00.000Z" } : item,
      );
      state.activeStrikes = Math.max(0, state.activeStrikes - 1);
      users = users.map((user) =>
        user.id === "user-1" ? { ...user, activeStrikes: Math.max(0, user.activeStrikes - 1) } : user,
      );

      const strike = state.items.find((item) => item.id === strikeId)!;
      return strike;
    });

    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/admin/strikes"]}>
        <Routes>
          <Route path="/admin/strikes" element={<AdminStrikesPage />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /Sarah Jenkins.*2 Strikes/i }));

    const mainContent =
      screen.getAllByTestId("strike-main-content").find((element) =>
        within(element).queryByText("Sarah Jenkins"),
      ) ?? (await screen.findByTestId("strike-main-content"));
    expect(within(mainContent).getByText("Sarah Jenkins")).toBeInTheDocument();

    await user.click(within(mainContent).getByRole("button", { name: /Decrease/i }));
    const reasonField = within(mainContent).getByPlaceholderText(
      "Please provide a detailed justification for this strike adjustment...",
    );
    await user.type(reasonField, "Appeal accepted");
    await user.click(within(mainContent).getByRole("button", { name: "Save User Record" }));

    await waitFor(() => {
      expect(fairroomApi.revokeAdminStrike).toHaveBeenCalledWith("strike-1", {
        reason: "Appeal accepted",
      });
    });

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /Sarah Jenkins.*1 Strike/i })).toBeInTheDocument();
      expect(screen.getByText("Strike Revoked")).toBeInTheDocument();
    });
  });
});
