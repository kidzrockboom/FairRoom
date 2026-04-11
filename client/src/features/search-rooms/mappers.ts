import type { SearchRoomsParams } from "@/api/contracts";
import type { Filters } from "./schemas";

function toLocalDateTime(date: string, hour: number) {
  return `${date}T${String(hour).padStart(2, "0")}:00:00`;
}

export function toSearchParams(
  filters: Filters,
  search: string,
  page: number,
  pageSize: number,
): SearchRoomsParams {
  const [startHour, endHour] = filters.timeRange;

  const startsAt = filters.date ? toLocalDateTime(filters.date, startHour) : undefined;

  const endsAt = filters.date ? toLocalDateTime(filters.date, endHour) : undefined;

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
