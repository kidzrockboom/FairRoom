import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Filter, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

// ─── Static presentation state ────────────────────────────────────────────────
// These will be replaced with real state when the hook is wired in.

const CAPACITY_OPTIONS = [2, 4, 8, 12, 20, 50] as const;
const SELECTED_CAPACITY: number = 4;

// ─── Local helpers ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchRoomsFilterPanel() {
  return (
    <aside className="flex w-full flex-col rounded-card border border-border bg-surface lg:w-[272px] lg:shrink-0">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3.5">
        <span className="flex items-center gap-2 text-sm font-semibold text-content">
          <Filter {...iconProps} aria-hidden="true" />
          Filters
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-1.5 py-1 text-xs text-muted-foreground"
        >
          Reset
        </Button>
      </div>

      <Separator />

      {/* ── Filter sections ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-0 divide-y divide-border">
        {/* Date */}
        <section className="space-y-2.5 px-4 py-4">
          <SectionLabel>Date</SectionLabel>
          <input
            type="date"
            defaultValue="2024-10-24"
            className="h-10 w-full rounded-input border border-input bg-surface px-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </section>

        {/* Capacity */}
        <section className="space-y-2.5 px-4 py-4">
          <SectionLabel>Capacity</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {CAPACITY_OPTIONS.map((cap) => (
              <Button
                key={cap}
                variant={cap === SELECTED_CAPACITY ? "default" : "outline"}
                size="sm"
                className={cn(
                  "h-9 text-sm",
                  cap !== SELECTED_CAPACITY && "text-content",
                )}
              >
                {cap}+ People
              </Button>
            ))}
          </div>
        </section>

        {/* Time Range */}
        <section className="space-y-2.5 px-4 py-4">
          <SectionLabel>Time Range</SectionLabel>

          {/* Static range track — replaced with interactive slider when wired */}
          <div className="relative px-0.5 py-3">
            {/* Background track */}
            <div className="h-1 w-full rounded-full bg-border" />
            {/* Active portion: 9AM–17PM = roughly 37.5%–70% of 24h */}
            <div
              className="absolute top-3 h-1 rounded-full bg-brand-500"
              style={{ left: "37.5%", right: "30%" }}
            />
            {/* End thumb */}
            <div
              className="absolute top-1.5 size-4 -translate-x-1/2 rounded-full border-2 border-brand-500 bg-surface shadow-sm"
              style={{ left: "70%" }}
            />
          </div>

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>09:00 AM</span>
            <span>05:00 PM</span>
          </div>
        </section>
      </div>

      {/* ── Apply button ────────────────────────────────────────────────── */}
      <div className="mt-auto px-4 pb-5 pt-4">
        <Button className="h-11 w-full text-sm font-semibold">
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}
