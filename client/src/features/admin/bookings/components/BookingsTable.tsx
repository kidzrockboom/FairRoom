import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, MoreHorizontal, iconProps } from "@/lib/icons";
import { cn } from "@/lib/utils";
import Empty from "@/components/ui/empty";
import ErrorBlock from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ADMIN_BOOKING_PAGE_SIZES,
  type AdminBookingRowViewModel,
} from "../adminBookingsMappers";

type BookingsTableProps = {
  rows: AdminBookingRowViewModel[];
  error: string | null;
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onRetry: () => void;
};

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  cancelled: "Cancelled",
  completed: "Completed",
  no_show: "No-Show",
};

const STATUS_CLASSES: Record<string, string> = {
  active: "border-border bg-surface text-content",
  cancelled: "border-border bg-muted/70 text-muted-foreground",
  completed: "border-border bg-muted/50 text-muted-foreground",
  no_show: "border-transparent bg-destructive/10 text-destructive",
};

export default function BookingsTable({
  rows,
  error,
  isLoading,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
  onRetry,
}: BookingsTableProps) {
  if (error) {
    return <ErrorBlock message={error} onRetry={onRetry} className="py-16" />;
  }

  if (isLoading) {
    return <Loading size="lg" message="Loading bookings…" className="py-16" />;
  }

  if (rows.length === 0) {
    return <Empty title="No bookings found" description="Try adjusting the filters to see results." className="py-16" />;
  }

  return (
    <section className="space-y-4">
      <div className="overflow-hidden rounded-card border border-border bg-surface">
        <Table className="table-fixed">
          <TableHeader>
            <TableRow className="bg-muted/35 hover:bg-muted/35">
              <TableHead className="w-[34%] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground whitespace-normal">
                User Details
              </TableHead>
              <TableHead className="w-[26%] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground whitespace-normal">
                Room
              </TableHead>
              <TableHead className="w-[20%] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground whitespace-normal">
                Date &amp; Time
              </TableHead>
              <TableHead className="w-[12%] px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground whitespace-normal">
                Status
              </TableHead>
              <TableHead className="w-[8%] px-4 py-3 text-right text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground whitespace-normal">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-muted/25">
                <TableCell className="px-4 py-4 whitespace-normal">
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" className="size-9">
                      <AvatarFallback className="text-xs font-semibold">{row.userInitials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-content">{row.userFullName}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">ID: {row.userRef}</p>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4 whitespace-normal">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-content">{row.roomName}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">ID: {row.roomCode}</p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">{row.roomLocation}</p>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4 whitespace-normal">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-content">{row.dateLabel}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock {...iconProps} aria-hidden="true" className="text-muted-foreground" />
                      {row.timeLabel}
                    </p>
                  </div>
                </TableCell>

                <TableCell className="px-4 py-4 whitespace-normal">
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-xs font-semibold shadow-none",
                      STATUS_CLASSES[row.status],
                    )}
                  >
                    {STATUS_LABELS[row.status]}
                  </Badge>
                </TableCell>

                <TableCell className="px-4 py-4 text-right whitespace-normal">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-muted-foreground hover:text-content"
                    aria-label={`More actions for ${row.userFullName}`}
                  >
                    <MoreHorizontal data-icon="inline-start" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground">
        <p>
          Showing <span className="font-semibold text-content">{rows.length}</span> bookings in the current view
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs shadow-none" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
            <ChevronLeft data-icon="inline-start" />
            Prev
          </Button>
          <span className="text-xs font-medium text-content">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" className="h-8 gap-1.5 px-3 text-xs shadow-none" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
            Next
            <ChevronRight data-icon="inline-end" />
          </Button>

          <SelectPageSize pageSize={pageSize} onPageSizeChange={onPageSizeChange} options={ADMIN_BOOKING_PAGE_SIZES} />
        </div>
      </div>
    </section>
  );
}

function SelectPageSize({
  pageSize,
  onPageSizeChange,
  options,
}: {
  pageSize: number;
  onPageSizeChange: (pageSize: number) => void;
  options: readonly number[];
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground">Per page</span>
      <select
        aria-label="Rows per page"
        className="h-8 rounded-md border border-border bg-surface px-2 text-xs text-content"
        value={pageSize}
        onChange={(event) => onPageSizeChange(Number(event.target.value))}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
