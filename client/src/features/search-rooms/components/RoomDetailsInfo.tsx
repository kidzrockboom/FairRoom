import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, iconProps } from "@/lib/icons";
import { useRoomDetailsContext } from "@/features/room-details/context";

export default function RoomDetailsInfo() {
  const { room } = useRoomDetailsContext();

  if (!room) return null;

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
          {room.name}
        </h1>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin {...iconProps} aria-hidden="true" className="shrink-0" />
          {room.location}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant="outline"
            className="rounded-full border-border bg-muted-foreground/10 px-3 py-1 text-xs font-semibold text-content"
          >
            <Users {...iconProps} aria-hidden="true" className="shrink-0" />
            Capacity: {room.capacity} {room.capacity === 1 ? "Person" : "Persons"}
          </Badge>
          <Badge
            variant="outline"
            className="rounded-full border-border bg-muted-foreground/10 px-3 py-1 text-xs font-semibold text-content"
          >
            Room ID: {room.roomCode}
          </Badge>
        </div>
      </div>

      {room.amenities && room.amenities.length > 0 && (
        <div className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">
            Amenities
          </p>
          <div className="flex flex-wrap gap-2">
            {room.amenities.map((amenity) => (
              <Badge
                key={amenity.id}
                variant="outline"
                className="rounded-full border-border bg-sidebar/65 px-3 py-1.5 text-sm font-medium text-content"
              >
                {amenity.label}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
