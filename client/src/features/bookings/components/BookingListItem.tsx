import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  MapPin,
  Pen,
  Users,
  X,
} from "@/lib/icons";
import { cn } from "@/lib/utils";

export type PlaceholderBooking = {
  id: string;
  roomName: string;
  location: string;
  timeRange: string;
  capacity: number;
  status: "confirmed" | "pending";
};

type BookingListItemProps = {
  booking: PlaceholderBooking;
};

const STATUS_STYLES: Record<PlaceholderBooking["status"], string> = {
  confirmed: "border-transparent bg-success-subtle text-success",
  pending:   "border-transparent bg-warning-subtle text-warning",
};

const STATUS_LABELS: Record<PlaceholderBooking["status"], string> = {
  confirmed: "Confirmed",
  pending:   "Pending",
};

export default function BookingListItem({ booking }: BookingListItemProps) {
  return (
    <article className="flex items-center gap-4 py-5">
      <div className="flex shrink-0 items-center justify-center pt-0.5">
        <Calendar size={20} strokeWidth={1.5} aria-hidden="true" className="text-muted-foreground" />
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-semibold text-content">{booking.roomName}</span>
          <Badge
            variant="outline"
            className={cn(
              "rounded-full px-2.5 py-0.5 text-xs font-semibold",
              STATUS_STYLES[booking.status],
            )}
          >
            {STATUS_LABELS[booking.status]}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin size={11} strokeWidth={1.5} aria-hidden="true" />
            {booking.location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} strokeWidth={1.5} aria-hidden="true" />
            {booking.timeRange}
          </span>
          <span className="flex items-center gap-1">
            <Users size={11} strokeWidth={1.5} aria-hidden="true" />
            Capacity: {booking.capacity}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-content">
          <Pen size={13} strokeWidth={1.5} aria-hidden="true" />
          Edit
        </Button>
        <Button variant="ghost" size="sm" className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-destructive">
          <X size={13} strokeWidth={2} aria-hidden="true" />
          Cancel
        </Button>
      </div>
    </article>
  );
}
