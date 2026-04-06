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
import type { AdminBookingStatus } from "@/data/adminMockData";
import type { ReactNode } from "react";

type AdminBookingsFiltersProps = {
  query: string;
  dateFilter: string;
  statusFilter: "all" | AdminBookingStatus;
  onQueryChange: (value: string) => void;
  onDateFilterChange: (value: string) => void;
  onStatusFilterChange: (value: "all" | AdminBookingStatus) => void;
  onReset: () => void;
};

function FieldShell({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="relative">{children}</div>;
}

export default function AdminBookingsFilters({
  query,
  dateFilter,
  statusFilter,
  onQueryChange,
  onDateFilterChange,
  onStatusFilterChange,
  onReset,
}: AdminBookingsFiltersProps) {
  return (
    <section className="grid gap-3 rounded-card border border-border bg-surface p-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
      <FieldShell>
        <Search
          {...iconProps}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search user or room..."
          className="h-10 pl-9"
        />
      </FieldShell>

      <FieldShell>
        <Calendar
          {...iconProps}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={dateFilter}
          onChange={(event) => onDateFilterChange(event.target.value)}
          placeholder="Date"
          className="h-10 pl-9"
        />
      </FieldShell>

      <Select
        value={statusFilter}
        onValueChange={(value) => onStatusFilterChange(value as "all" | AdminBookingStatus)}
      >
        <SelectTrigger className="h-10 w-full">
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
