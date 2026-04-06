import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Filter, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

const CAPACITY_OPTIONS = [2, 4, 8, 12, 20, 50] as const;
const SELECTED_CAPACITY: number = 4;

const AMENITY_OPTIONS = [
  { id: "wifi",       label: "High-speed Wifi",   defaultChecked: true  },
  { id: "projector",  label: "Projector / Screen", defaultChecked: false },
  { id: "whiteboard", label: "Whiteboard",         defaultChecked: false },
] as const;

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
      {children}
    </p>
  );
}

export default function SearchRoomsFilterPanel() {
  return (
    <aside className="flex w-full flex-col rounded-card border border-border bg-surface lg:min-h-full lg:w-[272px] lg:shrink-0 lg:self-stretch">
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

      <div className="flex flex-col gap-0 divide-y divide-border">
        <section className="space-y-2.5 px-4 py-4">
          <SectionLabel>Date</SectionLabel>
          <input
            type="date"
            defaultValue="2024-10-24"
            className="h-10 w-full rounded-input border border-input bg-surface px-3 text-sm text-content focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </section>

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

        <section className="space-y-2.5 px-4 py-4">
          <SectionLabel>Time Range</SectionLabel>
          <Slider
            className="px-0.5 py-3"
            defaultValue={[9, 17]}
            max={24}
            min={0}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>09:00 AM</span>
            <span>05:00 PM</span>
          </div>
        </section>

        <section className="space-y-3 px-4 py-4">
          <SectionLabel>Amenities</SectionLabel>
          <div className="flex flex-col gap-2.5">
            {AMENITY_OPTIONS.map(({ id, label, defaultChecked }) => (
              <label
                key={id}
                htmlFor={id}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-content"
              >
                <Checkbox id={id} defaultChecked={defaultChecked} />
                {label}
              </label>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-auto border-t border-border px-4 pb-5 pt-4">
        <Button className="h-11 w-full text-sm font-semibold">
          Apply Filters
        </Button>
      </div>
    </aside>
  );
}
