import { Link } from "react-router-dom";
import { buttonVariants } from "@/components/ui/button-variants";
import { Search, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";
import BookingsTabs from "@/features/bookings/components/BookingsTabs";

export default function MyBookingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[920px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-content">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your active reservations and booking history.
          </p>
        </div>

        <Link
          to="/search"
          className={cn(buttonVariants({ variant: "default", size: "sm" }), "h-9 gap-2 text-sm font-semibold")}
        >
          <Search {...iconProps} aria-hidden="true" />
          Search New Room
        </Link>
      </div>

      <BookingsTabs />
    </div>
  );
}
