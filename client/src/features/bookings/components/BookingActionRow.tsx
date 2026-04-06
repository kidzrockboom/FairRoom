import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button";

export default function BookingActionRow() {
  return (
    <footer className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
      <Link
        to="/rooms/room_01"
        className="text-sm font-semibold text-muted-foreground transition-colors hover:text-content"
      >
        Cancel and Go Back
      </Link>

      <div className="flex flex-wrap items-center gap-2">
        <Link
          to="/bookings/reminder"
          className={buttonVariants({
            variant: "default",
            size: "default",
            className: "h-10 rounded px-4 text-sm font-semibold",
          })}
        >
          Confirm Booking
        </Link>
      </div>
    </footer>
  );
}
