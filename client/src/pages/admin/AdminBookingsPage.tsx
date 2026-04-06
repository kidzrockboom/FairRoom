import { useMemo, useState } from "react";
import { Download, Plus } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import type { AdminBookingStatus } from "@/data/adminMockData";
import {
  adminOverviewHeader,
  adminOverviewRows,
  adminProTip,
  adminQuickLinks,
  adminRecentActivities,
} from "@/data/adminMockData";
import AdminBookingsFilters from "@/features/admin-bookings/components/AdminBookingsFilters";
import AdminBookingsSidebar from "@/features/admin-bookings/components/AdminBookingsSidebar";
import AdminBookingsTable from "@/features/admin-bookings/components/AdminBookingsTable";

function AdminBookingsPage() {
  const [query, setQuery] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | AdminBookingStatus>("all");

  const filteredRows = useMemo(() => {
    return adminOverviewRows.filter((row) => {
      const normalizedQuery = query.trim().toLowerCase();
      const normalizedDate = dateFilter.trim().toLowerCase();

      const matchesQuery =
        normalizedQuery.length === 0 ||
        row.userFullName.toLowerCase().includes(normalizedQuery) ||
        row.roomName.toLowerCase().includes(normalizedQuery) ||
        row.roomCode.toLowerCase().includes(normalizedQuery);

      const matchesDate =
        normalizedDate.length === 0 || row.dateLabel.toLowerCase().includes(normalizedDate);

      const matchesStatus = statusFilter === "all" ? true : row.status === statusFilter;

      return matchesQuery && matchesDate && matchesStatus;
    });
  }, [dateFilter, query, statusFilter]);

  return (
    <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-0">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
            {adminOverviewHeader.title}
          </h1>
          <p className="text-sm text-muted-foreground">{adminOverviewHeader.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-9 gap-2 px-3 text-sm font-semibold shadow-none">
            <Download data-icon="inline-start" />
            {adminOverviewHeader.exportButtonLabel}
          </Button>
          <Button className="h-9 gap-2 px-3 text-sm font-semibold">
            <Plus data-icon="inline-start" />
            {adminOverviewHeader.newBookingButtonLabel}
          </Button>
        </div>
      </header>

      <AdminBookingsFilters
        dateFilter={dateFilter}
        onDateFilterChange={setDateFilter}
        onQueryChange={setQuery}
        onReset={() => {
          setQuery("");
          setDateFilter("");
          setStatusFilter("all");
        }}
        onStatusFilterChange={setStatusFilter}
        query={query}
        statusFilter={statusFilter}
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <AdminBookingsTable rows={filteredRows} />
        <AdminBookingsSidebar
          quickLinks={adminQuickLinks}
          recentActivities={adminRecentActivities}
          proTip={adminProTip}
        />
      </div>
    </div>
  );
}

export default AdminBookingsPage;
