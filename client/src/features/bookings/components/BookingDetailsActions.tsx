import { Link } from "react-router-dom";
import { ArrowRight } from "@/lib/icons";

export default function BookingDetailsActions() {
  return (
    <div className="flex flex-wrap items-center justify-end gap-3 px-6 py-4">
      <Link
        to="/bookings"
        className="inline-flex h-9 items-center justify-center gap-1.5 rounded bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80"
      >
        View My Bookings
        <ArrowRight size={14} strokeWidth={2} aria-hidden="true" />
      </Link>
    </div>
  );
}
