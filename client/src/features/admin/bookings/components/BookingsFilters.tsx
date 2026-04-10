import type { ReactNode } from "react";
import { Calendar, Search, iconProps } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AdminBookingStatusFilter } from "../adminBookingsMappers";

type BookingsFiltersProps = {
  search: string;
  status: AdminBookingStatusFilter;
  date: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: AdminBookingStatusFilter) => void;
  onDateChange: (value: string) => void;
  onReset: () => void;
};

function FieldShell({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}

export default function BookingsFilters({
  search,
  status,
  date,
  onSearchChange,
  onStatusChange,
  onDateChange,
  onReset,
}: BookingsFiltersProps) {
  return (
    <section className="grid gap-3 rounded-card border border-border bg-surface p-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
      <FieldShell>
        <Search
          {...iconProps}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          aria-label="Search user or room"
          placeholder="Search user or room..."
          className="h-10 pl-9"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </FieldShell>

      <FieldShell>
        <Calendar
          {...iconProps}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="date"
          aria-label="Booking date"
          className="h-10 pl-9"
          value={date}
          onChange={(event) => onDateChange(event.target.value)}
        />
      </FieldShell>

      <Select value={status} onValueChange={(value) => onStatusChange(value as AdminBookingStatusFilter)}>
        <SelectTrigger
          aria-label="Booking status"
          className="h-11 w-full rounded-md border-border bg-background px-3 text-sm text-muted-foreground shadow-none"
        >
          <SelectValue placeholder="Status: All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Status: All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="cancelled">Cancelled</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
          <SelectItem value="no_show">No-Show</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" className="h-10 px-4 text-sm font-semibold shadow-none" onClick={onReset}>
        Reset Filters
      </Button>
    </section>
  );
}
