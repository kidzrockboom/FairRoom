import { Calendar, ChevronDown, Search, iconProps } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ReactNode } from "react";

function FieldShell({ children }: { children: ReactNode }) {
  return <div className="relative">{children}</div>;
}

export default function BookingsFilters() {
  return (
    <section className="grid gap-3 rounded-card border border-border bg-surface p-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
      <FieldShell>
        <Search
          {...iconProps}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search user or room..."
          className="h-10 pl-9"
          readOnly
        />
      </FieldShell>

      <FieldShell>
        <Calendar
          {...iconProps}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Date"
          className="h-10 pl-9"
          readOnly
        />
      </FieldShell>

      <button
        type="button"
        aria-label="Status: All"
        className="flex h-10 w-full items-center justify-between rounded-md border border-border bg-background px-3 text-left text-sm text-muted-foreground shadow-none"
      >
        <span>Status: All</span>
        <ChevronDown {...iconProps} aria-hidden="true" className="text-muted-foreground" />
      </button>

      <Button variant="outline" className="h-10 px-4 text-sm font-semibold shadow-none">
        Reset Filters
      </Button>
    </section>
  );
}
