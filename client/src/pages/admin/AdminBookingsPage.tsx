import { useAdminBookings } from "@/features/admin/bookings/hooks/useAdminBookings";
import BookingsFilters from "@/features/admin/bookings/components/BookingsFilters";
import BookingsSidebar from "@/features/admin/bookings/components/BookingsSidebar";
import BookingsTable from "@/features/admin/bookings/components/BookingsTable";
import {
  adminBookingsHeader,
  adminBookingsProTip,
  adminBookingsQuickLinks,
} from "@/features/admin/bookings/content";

function AdminBookingsPage() {
  const {
    bookings,
    date,
    error,
    isLoading,
    page,
    pageSize,
    search,
    setDate,
    setPage,
    setPageSize,
    setSearch,
    setStatus,
    status,
    totalPages,
    reset,
  } = useAdminBookings();

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
            {adminBookingsHeader.title}
          </h1>
          <p className="text-sm text-muted-foreground">{adminBookingsHeader.subtitle}</p>
        </div>
      </header>

      <BookingsFilters
        search={search}
        status={status}
        date={date}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onDateChange={setDate}
        onReset={reset}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <BookingsTable
          rows={bookings}
          error={error}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
          onRetry={reset}
        />
        <BookingsSidebar
          quickLinks={adminBookingsQuickLinks}
          proTip={adminBookingsProTip}
        />
      </div>
    </div>
  );
}

export default AdminBookingsPage;
