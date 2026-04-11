import { useCallback, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMyBookingsScope } from "../hooks/useMyBookingsScope";
import BookingList from "./BookingList";

type BookingTab = "upcoming" | "history";
type BookingTabValue = BookingTab | "cancelled";

const PAGE_SIZE_OPTIONS = [12, 24, 36];

export default function BookingsTabs() {
  const [activeTab, setActiveTab] = useState<BookingTabValue>("upcoming");
  const [pageSize, setPageSize] = useState(12);

  const upcoming = useMyBookingsScope("active", pageSize);
  const history = useMyBookingsScope("past", pageSize);
  const allBookings = useMyBookingsScope("all", 1000);
  const cancelledBookings = useMemo(
    () => allBookings.bookings.filter((booking) => booking.status === "cancelled"),
    [allBookings.bookings],
  );
  const historyBookings = useMemo(
    () => history.bookings.filter((booking) => booking.status !== "cancelled"),
    [history.bookings],
  );
  const historyTotal = useMemo(
    () => Math.max(0, history.total - cancelledBookings.length),
    [cancelledBookings.length, history.total],
  );

  const refreshAll = useCallback(() => {
    upcoming.retry();
    history.retry();
    allBookings.retry();
  }, [allBookings, history, upcoming]);

  const totalLabel = useMemo(() => {
    if (activeTab === "upcoming") return upcoming.total;
    if (activeTab === "history") return historyTotal;
    return cancelledBookings.length;
  }, [activeTab, cancelledBookings.length, historyTotal, upcoming.total]);

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => setActiveTab(value as BookingTabValue)}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.total})</TabsTrigger>
          <TabsTrigger value="history">History ({historyTotal})</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled ({cancelledBookings.length})</TabsTrigger>
        </TabsList>

        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:block">Per page:</span>
          <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[92px]">
              <SelectValue placeholder="12" />
            </SelectTrigger>
            <SelectContent>
              {PAGE_SIZE_OPTIONS.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <TabsContent value="upcoming" className="mt-0">
        <BookingList
          bookings={upcoming.bookings}
          error={upcoming.error}
          isLoading={upcoming.isLoading}
          page={upcoming.page}
          pageSize={upcoming.pageSize}
          totalPages={upcoming.totalPages}
          onPageChange={upcoming.setPage}
          onRetry={upcoming.retry}
          onRefresh={refreshAll}
          emptyTitle="No upcoming bookings"
          emptyDescription="Your future reservations will appear here once they are confirmed."
        />
      </TabsContent>

      <TabsContent value="history" className="mt-0">
        <BookingList
          bookings={historyBookings}
          error={history.error}
          isLoading={history.isLoading}
          page={history.page}
          pageSize={history.pageSize}
          totalPages={Math.max(1, Math.ceil(historyTotal / history.pageSize))}
          onPageChange={history.setPage}
          onRetry={history.retry}
          onRefresh={refreshAll}
          emptyTitle="No booking history"
          emptyDescription="Completed bookings will appear here."
        />
      </TabsContent>

      <TabsContent value="cancelled" className="mt-0">
        <BookingList
          bookings={cancelledBookings}
          error={allBookings.error}
          isLoading={allBookings.isLoading}
          page={1}
          pageSize={cancelledBookings.length || 1}
          totalPages={1}
          onPageChange={() => {}}
          onRetry={allBookings.retry}
          onRefresh={refreshAll}
          emptyTitle="No cancelled bookings"
          emptyDescription="Cancelled bookings will appear here."
        />
      </TabsContent>

      <p className="sr-only">Total bookings in the selected tab: {totalLabel}</p>
    </Tabs>
  );
}
