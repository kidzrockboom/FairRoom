import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock, iconProps } from "@/lib/icons";
import SlotButton, { type TimeSlot } from "@/features/search-rooms/components/SlotButton";
import { buttonVariants } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PLACEHOLDER_SLOTS: TimeSlot[] = [
  { time: "08:00 AM", status: "available" },
  { time: "09:00 AM", status: "reserved"  },
  { time: "10:00 AM", status: "selected"  },
  { time: "11:00 AM", status: "available" },
  { time: "12:00 PM", status: "reserved"  },
  { time: "01:00 PM", status: "reserved"  },
  { time: "02:00 PM", status: "available" },
  { time: "03:00 PM", status: "available" },
  { time: "04:00 PM", status: "available" },
  { time: "05:00 PM", status: "available" },
  { time: "06:00 PM", status: "reserved"  },
  { time: "07:00 PM", status: "available" },
];

export default function RoomAvailabilityPanel() {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-2xl font-bold text-content">Room Availability</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Select an available time slot below to start your booking process.
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-sidebar/65 px-3 py-1.5 text-sm text-muted-foreground">
          <Clock {...iconProps} aria-hidden="true" />
          Today: Oct 24, 2023
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PLACEHOLDER_SLOTS.map((slot) => (
          <SlotButton key={slot.time} slot={slot} />
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-base font-semibold text-content">Your Selection</h3>

        <div className="flex items-center justify-between gap-3 rounded-card border border-primary/30 bg-primary/5 px-4 py-3.5">
          <div>
            <p className="text-sm font-bold text-primary">Single Hour Booking</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Thursday, Oct 24 • 10:00 AM</p>
          </div>
          <Badge className="shrink-0 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Free for Students
          </Badge>
        </div>

        <div className="flex gap-3 rounded-card border border-warning/40 bg-warning/10 px-4 py-3.5">
          <AlertTriangle
            size={16}
            strokeWidth={1.5}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-warning"
          />
          <div>
            <p className="text-sm font-bold text-warning">Important Strike Policy</p>
            <p className="mt-0.5 text-sm text-warning/80">
              Failing to check in within 15 minutes of your booking start time will result in a{" "}
              <strong>strike</strong>. 3 strikes will lead to a 14-day booking suspension.
            </p>
          </div>
        </div>
      </div>

      <Link
        to="/bookings/confirm"
        className={buttonVariants({
          variant: "default",
          size: "default",
          className: "h-12 w-full text-base font-semibold",
        })}
      >
        Book This Room
      </Link>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center gap-2 rounded-card border border-border bg-sidebar/65 p-4 text-center">
          <CheckCircle size={28} strokeWidth={1.5} aria-hidden="true" className="text-muted-foreground" />
          <p className="text-sm font-semibold text-content">Instant Confirmation</p>
          <p className="text-xs text-muted-foreground">No admin approval required</p>
        </div>
        <div className="flex flex-col items-center gap-2 rounded-card border border-border bg-sidebar/65 p-4 text-center">
          <Clock size={28} strokeWidth={1.5} aria-hidden="true" className="text-muted-foreground" />
          <p className="text-sm font-semibold text-content">4-Hour Max Limit</p>
          <p className="text-xs text-muted-foreground">Per student per day</p>
        </div>
      </div>
    </div>
  );
}
