import { Separator } from "@/components/ui/separator";
import BookingListItem, { type PlaceholderBooking } from "./BookingListItem";

const PLACEHOLDER_BOOKINGS: PlaceholderBooking[] = [
  {
    id: "1",
    roomName:  "Collaborative Space A",
    location:  "Building E, Level 2",
    timeRange: "14:00 – 16:00",
    capacity:  6,
    status:    "confirmed",
  },
  {
    id: "2",
    roomName:  "Silent Study Pod 12",
    location:  "Library, North Wing",
    timeRange: "09:00 – 10:00",
    capacity:  1,
    status:    "pending",
  },
];

export default function BookingList() {
  return (
    <div className="flex flex-col">
      {PLACEHOLDER_BOOKINGS.map((booking, index) => (
        <div key={booking.id}>
          <BookingListItem booking={booking} />
          {index < PLACEHOLDER_BOOKINGS.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
