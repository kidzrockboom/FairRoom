import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Monitor,
  Search,
  Users,
  Wifi,
  X,
  iconProps,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

type PlaceholderRoom = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  available: boolean;
};

const PLACEHOLDER_ROOMS: PlaceholderRoom[] = [
  { id: "1", name: "Room 302",        location: "Level 3, East Wing",   capacity: 4,  available: true  },
  { id: "2", name: "Seminar Room A",  location: "Level 1, Main Hall",   capacity: 20, available: false },
  { id: "3", name: "Quiet Pod 04",    location: "Library, North",       capacity: 1,  available: true  },
  { id: "4", name: "Lab 210",         location: "Level 2, West Wing",   capacity: 15, available: true  },
  { id: "5", name: "Meeting Room 09", location: "Level 4, Center",      capacity: 6,  available: true  },
  { id: "6", name: "Collab Space 1",  location: "Student Hub",          capacity: 10, available: false },
];

const ACTIVE_FILTER_CHIPS = [
  { id: "date",     label: "Date: 2024-10-24" },
  { id: "capacity", label: "Capacity: 4+"     },
  { id: "time",     label: "Time: 9AM – 5PM"  },
];

const CARD_BODY_TEXT =
  "Equipped with ergonomic seating and high-speed internal network";

function RoomCard({ room }: { room: PlaceholderRoom }) {
  return (
    <article className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-[15px] font-semibold leading-snug text-content">
          {room.name}
        </h3>
        <Badge
          variant="outline"
          className={cn(
            "shrink-0 rounded-full border-transparent px-2.5 py-0.5 text-xs font-semibold",
            room.available
              ? "bg-success-subtle text-success"
              : "bg-[#f2f3f7] text-muted-foreground",
          )}
        >
          {room.available ? "Available" : "Busy"}
        </Badge>
      </div>

      <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin {...iconProps} aria-hidden="true" className="shrink-0" />
        {room.location}
      </p>

      <div className="flex items-center gap-3 text-sm font-medium text-content">
        <span className="flex items-center gap-1.5">
          <Users {...iconProps} aria-hidden="true" />
          Cap: {room.capacity}
        </span>
        <Wifi  {...iconProps} aria-hidden="true" className="text-muted-foreground" />
        <Monitor {...iconProps} aria-hidden="true" className="text-muted-foreground" />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">{CARD_BODY_TEXT}</p>

      <div className="mt-auto grid grid-cols-2 gap-2 pt-1">
        <Button variant="outline" size="sm" className="h-9 text-sm text-content">
          Details
        </Button>
        <Button size="sm" className="h-9 text-sm">
          Book Now
        </Button>
      </div>
    </article>
  );
}

export default function SearchRoomsResultsPanel() {
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
