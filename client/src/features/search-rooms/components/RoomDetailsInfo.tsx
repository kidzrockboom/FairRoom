import { Badge } from "@/components/ui/badge";
import { Building2, Info, MapPin, Monitor, Pen, Users, Wind, iconProps } from "@/lib/icons";
import AmenityRow from "@/features/search-rooms/components/AmenityRow";

const PLACEHOLDER_AMENITIES = [
  { Icon: Monitor, label: "4K Smart TV"      },
  { Icon: Wind,    label: "Central AC"        },
  { Icon: Pen,     label: "Glass Whiteboard"  },
] as const;

const USAGE_NOTE =
  "This room is optimised for group discussions and digital presentations. Please ensure HDMI adapters are returned to the front desk after use.";

export default function RoomDetailsInfo() {
  return (
    <div className="flex flex-col gap-6 lg:w-[400px] lg:shrink-0">
      <div className="flex h-60 items-center justify-center rounded-card border border-border bg-sidebar/65">
        <div className="flex flex-col items-center gap-2.5 text-muted-foreground">
          <Building2 size={40} strokeWidth={1} aria-hidden="true" />
          <span className="text-sm italic">Room Photography Placeholder</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="font-heading text-4xl font-bold leading-tight text-content">
          Collaboration Lab 204
        </h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin {...iconProps} aria-hidden="true" className="shrink-0" />
          Central Library, Wing B, Level 2
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full border-border bg-muted-foreground/10 px-3 py-1 text-xs font-semibold text-content"
          >
            <Users {...iconProps} aria-hidden="true" className="shrink-0" />
            Capacity: 6 Persons
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border-border bg-muted-foreground/10 px-3 py-1 text-xs font-semibold text-content"
          >
            Room ID: RM-204-CL
          </Badge>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Amenities
        </p>
        <div className="flex flex-col gap-2">
          {PLACEHOLDER_AMENITIES.map(({ Icon, label }) => (
            <AmenityRow key={label} Icon={Icon} label={label} />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Info {...iconProps} aria-hidden="true" className="shrink-0 text-muted-foreground" />
          <span className="text-sm font-bold text-content">Usage Notes</span>
        </div>
        <p className="rounded-card border border-border bg-sidebar/65 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {USAGE_NOTE}
        </p>
      </div>
    </div>
  );
}
