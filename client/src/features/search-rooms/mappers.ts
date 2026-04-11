import type { SearchRoomsParams } from "@/api/contracts";
import type { Filters } from "./schemas";

export function toSearchParams(
  filters: Filters,
  search: string,
  page: number,
  pageSize: number,
): SearchRoomsParams {
  const [startHour, endHour] = filters.timeRange;

  const startsAt = filters.date
    ? new Date(`${filters.date}T${String(startHour).padStart(2, "0")}:00:00`).toISOString()
    : undefined;

  const endsAt = filters.date
    ? new Date(`${filters.date}T${String(endHour).padStart(2, "0")}:00:00`).toISOString()
    : undefined;

  return {
    search: search.trim() || undefined,
    minCapacity: filters.capacity ?? undefined,
    startsAt,
    endsAt,
    amenityIds: filters.amenityIds.length > 0 ? filters.amenityIds : undefined,
    page,
    pageSize,
  };
}
