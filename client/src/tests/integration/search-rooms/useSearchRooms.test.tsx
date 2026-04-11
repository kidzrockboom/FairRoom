import { afterEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { useSearchRooms } from "@/features/search-rooms/hooks/useSearchRooms";
import { fetchRooms } from "@/features/search-rooms/roomSearchService";

vi.mock("@/features/search-rooms/roomSearchService", () => ({
  fetchRooms: vi.fn(),
}));

describe("useSearchRooms", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("applies filters only when requested and still refetches on page size change", async () => {
    vi.mocked(fetchRooms).mockResolvedValue({
      items: [
        {
          id: "room-1",
          roomCode: "RM-201",
          name: "Seminar Room A",
          location: "Main Building, Floor 2",
          building: "Main Building",
          floor: "2",
          capacity: 12,
          status: "operational",
          usageNotes: "Quiet space",
          createdAt: "2026-04-10T00:00:00.000Z",
          amenities: [
            { id: "wifi", label: "High-speed Wifi" },
            { id: "projector", label: "Projector / Screen" },
          ],
        },
      ],
      page: 1,
      pageSize: 12,
      total: 1,
    });

    const { result } = renderHook(() => useSearchRooms());

    await waitFor(() => {
      expect(fetchRooms).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 12,
        }),
      );
    });

    await waitFor(() => {
      expect(result.current.rooms).toHaveLength(1);
      expect(result.current.totalPages).toBe(1);
      expect(result.current.availableAmenities).toEqual([
        { id: "wifi", label: "High-speed Wifi" },
        { id: "projector", label: "Projector / Screen" },
      ]);
    });

    act(() => {
      result.current.patchFilters({ capacity: 12 });
    });

    expect(fetchRooms).toHaveBeenCalledTimes(1);
    expect(result.current.filters.capacity).toBeNull();
    expect(result.current.draftFilters.capacity).toBe(12);

    act(() => {
      result.current.applyFilters();
    });

    await waitFor(() => {
      expect(fetchRooms).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 12,
          minCapacity: 12,
        }),
      );
    });

    act(() => {
      result.current.setPageSize(24);
    });

    await waitFor(() => {
      expect(fetchRooms).toHaveBeenCalledWith(
        expect.objectContaining({
          page: 1,
          pageSize: 24,
        }),
      );
    });
  });
});
