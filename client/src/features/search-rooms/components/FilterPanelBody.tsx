import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { iconProps } from "@/lib/icons";
import { cn, formatHour } from "@/lib/utils";
import { useSearchRoomsContext } from "../context";
import { CAPACITY_OPTIONS } from "../content";
import { Filter } from "@/lib/icons";

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  );
}

type FilterPanelBodyProps = {
  className?: string;
};

export default function FilterPanelBody({ className }: FilterPanelBodyProps) {
  const {
    draftFilters,
    availableAmenities,
    patchFilters,
    resetDraftFilters,
  } = useSearchRoomsContext();

  return (
    <div className={cn("flex h-full flex-col", className)}>
      <div className="flex items-center justify-between px-6 py-5">
        <span className="flex items-center gap-2 text-sm font-semibold text-content">
          <Filter {...iconProps} aria-hidden="true" />
          Filters
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-auto px-1.5 py-1 text-xs text-muted-foreground"
          onClick={resetDraftFilters}
        >
          Reset
        </Button>
      </div>

      <Separator />

      <div className="flex flex-1 flex-col gap-0 divide-y divide-border overflow-y-auto">
        <section className="space-y-2.5 px-6 py-4">
          <SectionLabel>Date</SectionLabel>
          <input
            type="date"
            value={draftFilters.date}
            onChange={(e) => patchFilters({ date: e.target.value })}
            className="h-10 w-full rounded-input border border-input bg-surface px-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </section>

        <section className="space-y-2.5 px-6 py-4">
          <SectionLabel>Capacity</SectionLabel>
          <div className="grid grid-cols-2 gap-2">
            {CAPACITY_OPTIONS.map((capacity) => (
              <Button
                key={capacity}
                variant={draftFilters.capacity === capacity ? "default" : "outline"}
                size="sm"
                className={cn("h-9 text-sm", draftFilters.capacity !== capacity && "text-content")}
                onClick={() =>
                  patchFilters({
                    capacity: draftFilters.capacity === capacity ? null : capacity,
                  })
                }
              >
                {capacity}+ People
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-2.5 px-6 py-4">
          <SectionLabel>Time Range</SectionLabel>
          <Slider
            className="px-0.5 py-3"
            value={draftFilters.timeRange}
            onValueChange={(val) => {
              const [start, end] = val as [number, number];
              patchFilters({ timeRange: [start, end] });
            }}
            max={24}
            min={0}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatHour(draftFilters.timeRange[0])}</span>
            <span>{formatHour(draftFilters.timeRange[1])}</span>
          </div>
        </section>

        <section className="space-y-3 px-6 py-4">
          <SectionLabel>Amenities</SectionLabel>
          {availableAmenities.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {availableAmenities.map(({ id, label }) => (
                <label
                  key={id}
                  htmlFor={id}
                  className="flex cursor-pointer items-center gap-2.5 text-sm text-content"
                >
                  <Checkbox
                    id={id}
                    checked={draftFilters.amenityIds.includes(id)}
                    onCheckedChange={(checked) =>
                      patchFilters({
                        amenityIds: checked
                          ? [...draftFilters.amenityIds, id]
                          : draftFilters.amenityIds.filter((amenityId) => amenityId !== id),
                      })
                    }
                  />
                  {label}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Amenities will appear from loaded rooms.</p>
          )}
        </section>
      </div>

    </div>
  );
}
