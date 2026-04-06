import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { RoomSearchItem } from "@/api/contracts";
import { ChevronLeft, ChevronRight, Search, X } from "@/lib/icons";
import RoomCard from "./RoomCard";

const PLACEHOLDER_ROOMS: RoomSearchItem[] = [
  { id: "1", roomCode: "RM-302", name: "Room 302",        location: "Level 3, East Wing",   capacity: 4,  isAvailableForRequestedRange: true  },
  { id: "2", roomCode: "RM-201", name: "Seminar Room A",  location: "Level 1, Main Hall",   capacity: 20, isAvailableForRequestedRange: false },
  { id: "3", roomCode: "QP-04",   name: "Quiet Pod 04",    location: "Library, North",       capacity: 1,  isAvailableForRequestedRange: true  },
  { id: "4", roomCode: "LAB-210", name: "Lab 210",         location: "Level 2, West Wing",   capacity: 15, isAvailableForRequestedRange: true  },
  { id: "5", roomCode: "MR-09",   name: "Meeting Room 09", location: "Level 4, Center",      capacity: 6,  isAvailableForRequestedRange: true  },
  { id: "6", roomCode: "CS-01",   name: "Collab Space 1",  location: "Student Hub",          capacity: 10, isAvailableForRequestedRange: false },
];

const ACTIVE_FILTER_CHIPS = [
  { id: "date",     label: "Date: 2024-10-24" },
  { id: "capacity", label: "Capacity: 4+"     },
  { id: "time",     label: "Time: 9AM – 5PM"  },
];

export default function ResultsPanel() {
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
            placeholder="Search room name or ID..."
            className="h-10 w-full rounded-input border border-input bg-surface pl-9 pr-3 text-sm text-content placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Active:
        </span>

        {ACTIVE_FILTER_CHIPS.map((chip) => (
          <Badge
            key={chip.id}
            className="h-auto gap-1.5 rounded-full border border-border bg-muted-foreground/10 px-3 py-1.5 text-sm font-medium text-content"
            variant="outline"
          >
            {chip.label}
            <button
              type="button"
              aria-label={`Remove ${chip.label} filter`}
              className="rounded-full text-muted-foreground transition-colors hover:text-content"
            >
              <X size={12} strokeWidth={2} aria-hidden="true" />
            </button>
          </Badge>
        ))}

        <button
          type="button"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-content"
        >
          Clear All
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <h2 className="font-heading text-xl font-semibold text-content">
          Showing {PLACEHOLDER_ROOMS.length} Rooms
        </h2>

        <div className="flex shrink-0 items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:block">
            Sort by:
          </span>
          <select
            defaultValue="capacity-asc"
            className="h-9 rounded-input border border-input bg-surface px-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/50"
          >
            <option value="capacity-asc">Capacity (Low to High)</option>
            <option value="capacity-desc">Capacity (High to Low)</option>
            <option value="name-asc">Name (A to Z)</option>
          </select>
        </div>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {PLACEHOLDER_ROOMS.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </div>

      <div className="flex items-center justify-center gap-3 py-4">
        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Previous page"
          disabled
        >
          <ChevronLeft size={16} strokeWidth={1.5} aria-hidden="true" />
        </Button>

        <span className="min-w-[90px] text-center text-sm font-semibold text-content">
          Page 1 of 3
        </span>

        <Button
          variant="outline"
          size="icon-sm"
          aria-label="Next page"
        >
          <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
        </Button>
      </div>
    </section>
  );
}
