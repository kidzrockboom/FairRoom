import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fairroomApi } from "../../api/fairroomApi";
import type { BookingSummary, Reminder, Room } from "../../api/contracts";

const timeLabel = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(value));

function MyBookingsPage() {
  const [activeBookings, setActiveBookings] = useState<BookingSummary[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadBookingData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [bookingsResponse, remindersResponse] = await Promise.all([
          fairroomApi.getMyBookings("active"),
          fairroomApi.getMyReminders(),
        ]);

        if (isCancelled) return;

        const sortedBookings = [...bookingsResponse.items].sort(
          (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
        );

        setActiveBookings(sortedBookings);
        setReminders(remindersResponse.items);

        if (sortedBookings[0]) {
          const roomResponse = await fairroomApi.getRoom(sortedBookings[0].roomId);
          if (!isCancelled) {
            setRoom(roomResponse);
          }
        }
      } catch (loadError) {
        if (isCancelled) return;

        setError(loadError instanceof Error ? loadError.message : "Unable to load bookings.");
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadBookingData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const upcoming = useMemo(() => {
    const now = Date.now();
    return activeBookings.find((booking) => new Date(booking.startsAt).getTime() > now) ?? activeBookings[0];
  }, [activeBookings]);

  const relatedReminders = useMemo(
    () => reminders.filter((reminder) => reminder.bookingId === upcoming?.id),
    [reminders, upcoming?.id],
  );

  if (loading) {
    return <section className="booking-reminder-page"><p>Loading bookings...</p></section>;
  }

  if (error) {
    return <section className="booking-reminder-page"><p>{error}</p></section>;
  }

  if (!upcoming) {
    return (
      <section className="booking-reminder-page">
        <article className="booking-card">
          <header className="booking-card-header">
            <div className="booking-bell" aria-hidden>
              🔔
            </div>
            <h1>My Bookings</h1>
            <p>No upcoming bookings found.</p>
          </header>
        </article>
      </section>
    );
  }

  const bookingStart = new Date(upcoming.startsAt);
  const minutesLeft = Math.max(0, Math.floor((bookingStart.getTime() - Date.now()) / 60000));

  return (
    <section className="booking-reminder-page">
      <article className="booking-card">
        <header className="booking-card-header">
          <div className="booking-bell" aria-hidden>
            🔔
          </div>
          <h1>Booking Reminder</h1>
          <p>
            Your session at {room?.name ?? upcoming.roomName} begins in <u>{minutesLeft} minutes</u>.
          </p>
        </header>

        <div className="booking-meta-row">
          <div className="booking-meta-item">
            <span className="meta-icon" aria-hidden>
              📍
            </span>
            <div>
              <small>LOCATION</small>
              <p>{room?.location ?? "Unknown location"}</p>
            </div>
          </div>

          <div className="booking-meta-item">
            <span className="meta-icon" aria-hidden>
              🕒
            </span>
            <div>
              <small>SCHEDULED TIME</small>
              <p>
                {timeLabel(upcoming.startsAt)} - {timeLabel(upcoming.endsAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="checkin-box">
          <h3>ⓘ Check-in Instructions</h3>
          <p>
            Please arrive on time. You must scan the QR code located on the room door within 15
            minutes of your start time. Failure to check in will result in automatic cancellation
            and a strike on your account.
          </p>
        </div>

        <div className="notification-history">
          <h4>NOTIFICATION HISTORY</h4>

          <div className="history-chips">
            {relatedReminders.map((reminder) => (
              <div key={reminder.id} className="history-chip">
                <span>{reminder.channel.toUpperCase()}</span>
                <small>{timeLabel(reminder.scheduledFor)}</small>
                <strong>{reminder.status === "delivered" ? "Delivered" : reminder.status === "scheduled" ? "Scheduled" : "Failed"}</strong>
              </div>
            ))}
          </div>

          <p className="history-note">
            Note: SMS reminders may take up to 5 minutes to deliver depending on your carrier.
          </p>
        </div>

        <footer className="booking-card-footer">
          <p>ⓘ Need to cancel? You have 5 minutes left to avoid penalties.</p>

          <div className="footer-actions">
            <button className="btn-secondary" type="button">
              Get Directions
            </button>
            <Link to={`/app/rooms/${upcoming.roomId}`} className="btn-primary">
              View Details →
            </Link>
          </div>
        </footer>
      </article>

      <nav className="booking-links">
        <a href="#">Help Center</a>
        <a href="#">Booking Policies</a>
        <a href="#">Report an Issue</a>
      </nav>
    </section>
  );
}

export default MyBookingsPage;
