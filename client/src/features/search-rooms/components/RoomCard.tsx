import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { RoomSearchItem } from "@/api/contracts";
import { MapPin, Monitor, Users, Wifi, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

type RoomCardProps = {
  room: RoomSearchItem;
};

export default function RoomCard({ room }: RoomCardProps) {
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
            room.isAvailableForRequestedRange
              ? "bg-success-subtle text-success"
              : "bg-[#f2f3f7] text-muted-foreground",
          )}
        >
          {room.isAvailableForRequestedRange ? "Available" : "Busy"}
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
        <Wifi    {...iconProps} aria-hidden="true" className="text-muted-foreground" />
        <Monitor {...iconProps} aria-hidden="true" className="text-muted-foreground" />
      </div>

      <p className="text-sm leading-relaxed text-muted-foreground">
        Equipped with ergonomic seating and high-speed internal network
      </p>

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
