import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { cancelMyBooking } from "../myBookingsService";
import { Building2, Calendar, ChevronRight, Clock, Trash2, iconProps } from "@/lib/icons";
import type { BookingListItemViewModel } from "../myBookingsMappers";
import { cn } from "@/lib/utils";
import BookingEditSheet from "./BookingEditSheet";

type BookingListItemProps = {
  booking: BookingListItemViewModel;
  onUpdated: () => void;
};

const STATUS_STYLES: Record<BookingListItemViewModel["statusTone"], string> = {
  success: "border-transparent bg-success-subtle text-success",
  warning: "border-transparent bg-warning-subtle text-warning",
  muted: "border-transparent bg-muted-foreground/10 text-muted-foreground",
};

export default function BookingListItem({ booking, onUpdated }: BookingListItemProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const handleCancel = async () => {
    setIsCancelling(true);
    setCancelError(null);

    try {
      await cancelMyBooking(booking.id);
      setCancelOpen(false);
      onUpdated();
    } catch (error: unknown) {
      setCancelError(error instanceof Error ? error.message : "We could not cancel this booking.");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <>
      <article className="flex items-center gap-4 py-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-card bg-surface text-muted-foreground">
          <Calendar {...iconProps} aria-hidden="true" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold text-content">{booking.roomName}</span>
            <Badge
              variant="outline"
              className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", STATUS_STYLES[booking.statusTone])}
            >
              {booking.statusLabel}
            </Badge>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 size={11} strokeWidth={1.5} aria-hidden="true" />
              Room {booking.roomCode}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} strokeWidth={1.5} aria-hidden="true" />
              {booking.scheduleLabel}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {booking.canEdit && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 px-3 text-xs font-semibold"
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
          )}

          <Link
            to={`/bookings/${booking.id}`}
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "h-8 gap-1.5 px-3 text-xs font-semibold",
            )}
          >
            View
            <ChevronRight size={14} strokeWidth={2} aria-hidden="true" />
          </Link>

          {booking.canCancel && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 gap-1.5 px-3 text-xs font-semibold text-muted-foreground hover:text-destructive"
              onClick={() => setCancelOpen(true)}
            >
              <Trash2 size={14} strokeWidth={1.75} aria-hidden="true" />
              Cancel
            </Button>
          )}
        </div>
      </article>

      <BookingEditSheet
        booking={booking}
        open={editOpen}
        onOpenChange={setEditOpen}
        onUpdated={onUpdated}
      />

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This will cancel your booking for {booking.roomName}. You can create a new booking
              later if the room is still available.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {cancelError && (
            <p className="rounded-card border border-destructive/20 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {cancelError}
            </p>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Keep booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleCancel();
              }}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling…" : "Cancel booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
