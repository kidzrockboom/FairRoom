import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Empty from "@/components/ui/empty";
import ErrorBlock from "@/components/ui/error";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Search, X } from "@/lib/icons";
import { useSearchRoomsContext } from "../context";
import type { ActiveChip } from "../hooks/useSearchRooms";
import RoomCard from "./RoomCard";
import RoomCardSkeleton from "./RoomCardSkeleton";

const SKELETON_COUNT = 6;

export default function ResultsPanel() {
  const {
    rooms,
    totalRooms,
    isLoading,
    error,
    sort,
    page,
    totalPages,
    activeChips,
    setSearch,
    setSort,
    setPage,
    removeChip,
    removeAmenity,
    resetFilters,
    retry,
  } = useSearchRoomsContext();

  const handleRemoveChip = (chip: ActiveChip) => {
    if (chip.kind === "filter") removeChip(chip.id);
    else removeAmenity(chip.amenityId);
  };

  const [inputValue, setInputValue] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (q: string) => {
    setInputValue(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setSearch(q), 400);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <section className="flex min-w-0 flex-1 flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-content">
            Search Rooms
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Find the perfect space for your study group or project.
          </p>
        </div>

        <div className="relative w-full sm:w-auto sm:min-w-[280px] sm:max-w-sm">
          <Search
            size={15}
            strokeWidth={1.5}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search room name or ID..."
            className="h-10 w-full rounded-input border border-input bg-surface pl-9 pr-3 text-sm text-content placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      {activeChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Active:
          </span>

          {activeChips.map((chip) => (
            <Badge
              key={chip.kind === "filter" ? chip.id : chip.amenityId}
              className="h-auto gap-1.5 rounded-full border border-border bg-muted-foreground/10 px-3 py-1.5 text-sm font-medium text-content"
              variant="outline"
            >
              {chip.label}
              <button
                type="button"
                aria-label={`Remove ${chip.label}`}
                className="rounded-full text-muted-foreground transition-colors hover:text-content"
                onClick={() => handleRemoveChip(chip)}
              >
                <X size={12} strokeWidth={2} aria-hidden="true" />
              </button>
            </Badge>
          ))}

          <button
            type="button"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-content"
            onClick={resetFilters}
          >
            Clear All
          </button>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold text-content">
          {isLoading ? "Loading…" : `Showing ${totalRooms} ${totalRooms === 1 ? "Room" : "Rooms"}`}
        </h2>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:block">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "capacity-asc" | "capacity-desc" | "name-asc")}
            className="h-9 rounded-input border border-input bg-surface px-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="capacity-asc">Capacity (Low to High)</option>
            <option value="capacity-desc">Capacity (High to Low)</option>
            <option value="name-asc">Name (A to Z)</option>
          </select>
        </div>
      </div>

      <Separator />

      {error ? (
        <ErrorBlock message={error} onRetry={retry} className="py-16" />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <RoomCardSkeleton key={i} />
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <Empty
          title="No rooms found"
          description="Try adjusting your filters or search term."
          action={{ label: "Clear filters", onClick: resetFilters }}
          className="py-16"
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}

      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 py-4">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          </Button>

          <span className="min-w-[90px] text-center text-sm font-semibold text-content">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      )}
    </section>
  );
}
