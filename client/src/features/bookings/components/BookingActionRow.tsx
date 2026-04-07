import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useConfirmBookingContext } from "@/features/confirm-booking/context";

export default function BookingActionRow() {
  const { room, isSubmitting, submitError } = useConfirmBookingContext();

  return (
    <footer className="flex flex-col gap-3 pt-1">
      {submitError && (
        <p className="text-sm text-destructive">{submitError}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          to={room ? `/rooms/${room.id}` : "/search"}
          className="text-sm font-semibold text-muted-foreground transition-colors hover:text-content"
        >
          Cancel and Go Back
        </Link>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded px-4 text-sm font-semibold"
        >
          {isSubmitting ? "Confirming…" : "Confirm Booking"}
        </Button>
      </div>
    </footer>
  );
}
