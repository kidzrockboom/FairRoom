import { Download, Plus } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import BookingsFilters from "@/features/admin/bookings/components/BookingsFilters";
import BookingsSidebar from "@/features/admin/bookings/components/BookingsSidebar";
import BookingsTable from "@/features/admin/bookings/components/BookingsTable";
import {
  adminBookingsHeader,
  adminBookingsProTip,
  adminBookingsQuickLinks,
  adminBookingsRecentActivities,
  adminBookingsRows,
} from "@/features/admin/bookings/content";

function AdminBookingsPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
            {adminBookingsHeader.title}
          </h1>
          <p className="text-sm text-muted-foreground">{adminBookingsHeader.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9 gap-2 px-3 text-sm font-semibold shadow-none">
            <Download data-icon="inline-start" />
            {adminBookingsHeader.exportButtonLabel}
          </Button>
          <Button className="h-9 gap-2 px-3 text-sm font-semibold">
            <Plus data-icon="inline-start" />
            {adminBookingsHeader.newBookingButtonLabel}
          </Button>
        </div>
      </header>

      <BookingsFilters />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <BookingsTable rows={adminBookingsRows} />
        <BookingsSidebar
          quickLinks={adminBookingsQuickLinks}
          recentActivities={adminBookingsRecentActivities}
          proTip={adminBookingsProTip}
        />
      </div>
    </div>
  );
}

export default AdminBookingsPage;
