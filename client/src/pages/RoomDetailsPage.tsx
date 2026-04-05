import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { fairroomApi } from "@/api/fairroomApi";
import type { AvailabilityWindow, Room } from "@/api/contracts";

const toDateTimeLabel = (value: string) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(value));

function RoomDetailsPage() {
  const { roomId } = useParams();
  const location = useLocation();
  const routeState = location.state as { date?: string; timeRange?: { start: number; end: number } | null } | null;

  const today = new Date().toISOString().split("T")[0];
  const selectedDate = routeState?.date || today;
  const requestedRange = routeState?.timeRange ?? { start: 8, end: 18 };

  const requestedStartsAt = useMemo(
    () => new Date(`${selectedDate}T${String(requestedRange.start).padStart(2, "0")}:00:00`).toISOString(),
    [requestedRange.start, selectedDate],
  );
  const requestedEndsAt = useMemo(
    () => new Date(`${selectedDate}T${String(requestedRange.end).padStart(2, "0")}:00:00`).toISOString(),
    [requestedRange.end, selectedDate],
  );

  const [room, setRoom] = useState<Room | null>(null);
  const [windows, setWindows] = useState<AvailabilityWindow[]>([]);
  const [selectedWindow, setSelectedWindow] = useState<AvailabilityWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingState, setBookingState] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    if (!roomId) return;

    let isCancelled = false;

    const loadRoomData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [roomResponse, availabilityResponse] = await Promise.all([
          fairroomApi.getRoom(roomId),
          fairroomApi.getRoomAvailability(roomId, requestedStartsAt, requestedEndsAt),
        ]);

        if (isCancelled) return;

        setRoom(roomResponse);
        setWindows(availabilityResponse.windows);
      } catch (loadError) {
        if (isCancelled) return;

        setError(loadError instanceof Error ? loadError.message : "Unable to load room details.");
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadRoomData();

    return () => {
      isCancelled = true;
    };
  }, [requestedEndsAt, requestedStartsAt, roomId]);

  if (!roomId) return <p>Invalid room id.</p>;
  if (loading) return <p>Loading room details...</p>;
  if (error) return <p>{error}</p>;
  if (!room) return <p>Room not found.</p>;

  const handleBook = async () => {
    if (!selectedWindow) return;

    setBookingState("submitting");

    try {
      await fairroomApi.createBooking({
        roomId: room.id,
        startsAt: selectedWindow.startsAt,
        endsAt: selectedWindow.endsAt,
      });

      setBookingState("success");
    } catch {
      setBookingState("error");
    }
  };

  return (
    <section className="room-details">
      <Link to="/search" className="back-link">
        ← Back to Search Results
      </Link>

      <div className="room-details-grid">
        <div>
          <div className="photo-placeholder">Room Photography Placeholder</div>
          <h1>{room.name}</h1>
          <p>{room.location}</p>
          <p>
            Capacity: {room.capacity} Persons • Room ID: {room.roomCode}
          </p>
        </div>

        <div>
          <h2>Room Availability</h2>
          <div className="slots-grid">
            {windows.map((window) => {
              const isReserved = window.status !== "available";
              const isSelected = selectedWindow?.startsAt === window.startsAt;

              return (
                <button
                  key={window.startsAt}
                  disabled={isReserved}
                  onClick={() => setSelectedWindow(window)}
                  className={`slot-btn ${isReserved ? "reserved" : ""} ${isSelected ? "selected" : ""}`}
                  type="button"
                >
                  <span>
                    {toDateTimeLabel(window.startsAt)} - {toDateTimeLabel(window.endsAt)}
                  </span>
                  <small>{isReserved ? "RESERVED" : "AVAILABLE"}</small>
                </button>
              );
            })}
          </div>

          <button className="book-btn" type="button" disabled={selectedWindow === null || bookingState === "submitting"} onClick={handleBook}>
            {selectedWindow === null
              ? "Select a time slot first"
              : bookingState === "submitting"
                ? "Booking..."
                : `Book ${toDateTimeLabel(selectedWindow.startsAt)}`}
          </button>

          {bookingState === "success" ? (
            <p className="muted">Booking request submitted through the contract-aligned API layer.</p>
          ) : null}
          {bookingState === "error" ? (
            <p className="muted">Booking request failed. Please try again.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default RoomDetailsPage;
