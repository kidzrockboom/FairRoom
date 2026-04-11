import { Button } from "@/components/ui/button";
import Empty from "@/components/ui/empty";
import ErrorBlock from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "@/lib/icons";
import type { BookingListItemViewModel } from "../myBookingsMappers";
import BookingListItem from "./BookingListItem";

type BookingListProps = {
  bookings: BookingListItemViewModel[];
  error: string | null;
  isLoading: boolean;
  page: number;
  pageSize: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRetry: () => void;
  onRefresh: () => void;
  emptyDescription: string;
  emptyTitle: string;
};

export default function BookingList({
  bookings,
  error,
  isLoading,
  page,
  pageSize,
  totalPages,
  onPageChange,
  onRetry,
  onRefresh,
  emptyDescription,
  emptyTitle,
}: BookingListProps) {
  if (error) {
    return <ErrorBlock message={error} onRetry={onRetry} className="py-16" />;
  }

  if (isLoading) {
    return <Loading size="lg" message="Loading bookings…" className="py-16" />;
  }

  if (bookings.length === 0) {
    return (
      <Empty
        title={emptyTitle}
        description={emptyDescription}
        className="py-16"
      />
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col">
        {bookings.map((booking, index) => (
          <div key={booking.id}>
            <BookingListItem booking={booking} onUpdated={onRefresh} />
            {index < bookings.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Previous page"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft size={16} strokeWidth={1.5} aria-hidden="true" />
          </Button>

          <span className="min-w-[90px] text-center text-sm font-semibold text-content">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon-sm"
            aria-label="Next page"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight size={16} strokeWidth={1.5} aria-hidden="true" />
          </Button>
        </div>
      )}

      <p className="sr-only">
        Showing {bookings.length} bookings at {pageSize} per page.
      </p>
    </div>
  );
}
