import { Button } from "@/components/ui/button";
import { Search, iconProps } from "@/lib/icons";
import AccountHealthReminder from "@/features/bookings/components/AccountHealthReminder";
import BookingStatusBanner from "@/features/bookings/components/BookingStatusBanner";
import BookingsTabs from "@/features/bookings/components/BookingsTabs";

export default function MyBookingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-0">
      <BookingStatusBanner />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-3xl font-bold leading-tight text-content">
            My Bookings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your active reservations and view your booking history.
          </p>
        </div>
        <Button size="sm" className="h-9 gap-2 text-sm font-semibold">
          <Search {...iconProps} aria-hidden="true" />
          Search New Room
        </Button>
      </div>

      <BookingsTabs />

      <AccountHealthReminder />
    </div>
  );
}
