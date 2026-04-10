import type { Booking, Reminder, Room } from "@/api/contracts";
import { fairroomApi } from "@/api/fairroomApi";

export type BookingReminderPayload = {
  booking: Booking;
  room: Room;
  reminders: Reminder[];
};

export async function loadBookingReminder(booking: Booking): Promise<BookingReminderPayload> {
  const [room, reminders] = await Promise.all([
    fairroomApi.getRoom(booking.roomId),
    fairroomApi.getMyReminders({
      bookingId: booking.id,
      pageSize: 10,
    }),
  ]);

  return {
    booking,
    room,
    reminders,
  };
}
