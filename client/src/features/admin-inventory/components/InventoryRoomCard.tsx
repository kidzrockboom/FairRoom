import type { Room } from "@/api/contracts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Pen, Power, Trash2, Users, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";

import type { InventoryRoom } from "@/features/admin-inventory/adminInventoryContent";

type InventoryRoomCardProps = {
  room: InventoryRoom;
};

function roomStateLabel(room: Room) {
  return room.isActive ? "Operational" : "Under Repair";
}

function capacityLabel(capacity: number) {
  return `${capacity} ${capacity === 1 ? "student" : "students"}`;
}

export default function InventoryRoomCard({ room }: InventoryRoomCardProps) {
  const isOperational = room.isActive;

  return (
    <Card
      className={cn(
        "min-h-[260px] border-0 bg-surface shadow-none ring-1 ring-border/40",
        !isOperational && "border-dashed border-border bg-muted/10",
      )}
    >
      <CardHeader className="px-4 pb-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <Badge
            variant="outline"
            className={cn(
              "rounded-full border-transparent px-2.5 py-0.5 text-[11px] font-semibold shadow-none",
              isOperational
                ? "bg-muted/40 text-muted-foreground"
                : "bg-destructive/10 text-destructive",
            )}
          >
            {roomStateLabel(room)}
          </Badge>

          <div className="flex items-center gap-1">
            <Button
              aria-label={`Edit ${room.name}`}
              className="text-muted-foreground hover:text-content"
              size="icon-sm"
              variant="ghost"
            >
              <Pen aria-hidden="true" />
            </Button>
            <Button
              aria-label={`Delete ${room.name}`}
              className="text-muted-foreground hover:text-destructive"
              size="icon-sm"
              variant="ghost"
            >
              <Trash2 aria-hidden="true" />
            </Button>
          </div>
        </div>

        <CardTitle className="mt-2 font-heading text-[18px] font-bold tracking-tight text-content">
          {room.name}
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-0">
        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <p className="flex items-center gap-1.5">
            <MapPin {...iconProps} aria-hidden="true" className="shrink-0" />
            {room.location}
          </p>
          <p className="flex items-center gap-1.5">
            <Users {...iconProps} aria-hidden="true" className="shrink-0" />
            Capacity: {capacityLabel(room.capacity)}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {room.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-sm border-border bg-muted/35 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground shadow-none"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex items-center justify-between border-t border-border bg-background px-4 py-3">
        <span className="text-xs font-medium text-muted-foreground">Maintenance Mode</span>
        <Button
          className={cn(
            "h-8 px-3 text-xs font-semibold shadow-none",
            isOperational
              ? "bg-background text-content hover:bg-muted"
              : "bg-content text-background hover:bg-content/90",
          )}
          variant={isOperational ? "outline" : "default"}
        >
          <Power data-icon="inline-start" />
          {isOperational ? "Disable Room" : "Enable Room"}
        </Button>
      </CardFooter>
    </Card>
  );
}
