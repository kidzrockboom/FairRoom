import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterPanel from "../../components/dashboard/FilterPanel";
import { rooms } from "../../data/mockData";

type SortOption = "capacity-asc" | "capacity-desc" | "name-asc";
const ITEMS_PER_PAGE = 6;

const amenityLabel: Record<"wifi" | "projector" | "whiteboard", string> = {
  wifi: "High-speed Wifi",
  projector: "Projector / Screen",
  whiteboard: "Whiteboard",
};

const hourLabel = (hour: number) => {
  const h = hour % 24;
  const ampm = h >= 12 ? "PM" : "AM";
  const normalized = h % 12 === 0 ? 12 : h % 12;
  return `${normalized}${ampm}`;
};

function SearchRoomsPage() {
  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const [search, setSearch] = useState("");
  const [date, setDate] = useState(today);
  const [minCapacity, setMinCapacity] = useState<number | null>(null);
  const [timeRange, setTimeRange] = useState<{ start: number; end: number } | null>({
    start: 9,
    end: 17,
  });
  const [sortBy, setSortBy] = useState<SortOption>("capacity-asc");
  const [page, setPage] = useState(1);
  const [amenities, setAmenities] = useState({
    wifi: false,
    projector: false,
    whiteboard: false,
  });

  const toggleCapacity = (value: number) => {
    setMinCapacity((prev) => (prev === value ? null : value));
  };

  const clearAll = () => {
    setSearch("");
    setDate(today);
    setMinCapacity(null);
    setTimeRange(null);
    setSortBy("capacity-asc");
    setAmenities({ wifi: false, projector: false, whiteboard: false });
    setPage(1);
  };

  const filteredRooms = useMemo(() => {
    let result = rooms.filter((room) => {
      const matchName = room.name.toLowerCase().includes(search.toLowerCase());
      const matchCapacity = minCapacity === null ? true : room.capacity >= minCapacity;

      const matchWifi = !amenities.wifi || room.amenities.includes("wifi");
      const matchProjector = !amenities.projector || room.amenities.includes("projector");
      const matchWhiteboard = !amenities.whiteboard || room.amenities.includes("whiteboard");

      const matchTime =
        timeRange === null
          ? true
          : room.slots
              .filter((s) => s.hour >= timeRange.start && s.hour < timeRange.end)
              .some((s) => s.available);

      return (
        matchName &&
        matchCapacity &&
        matchWifi &&
        matchProjector &&
        matchWhiteboard &&
        matchTime
      );
    });

    if (sortBy === "capacity-asc") result = [...result].sort((a, b) => a.capacity - b.capacity);
    if (sortBy === "capacity-desc") result = [...result].sort((a, b) => b.capacity - a.capacity);
    if (sortBy === "name-asc") result = [...result].sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [search, minCapacity, amenities, timeRange, sortBy]);

  useEffect(() => {
    setPage(1);
  }, [search, date, minCapacity, timeRange, amenities, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRooms.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedRooms = filteredRooms.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <section>
      <div className="content-grid">
        <FilterPanel
          date={date}
          onDateChange={setDate}
          minCapacity={minCapacity}
          onMinCapacityChange={toggleCapacity}
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          amenities={amenities}
          onAmenityChange={(key, checked) =>
            setAmenities((prev) => ({ ...prev, [key]: checked }))
          }
          onReset={clearAll}
        />

        <div>
          <div className="results-top">
            <div>
              <h1 className="results-title">Search Rooms</h1>
              <p className="results-subtitle">
                Find the perfect space for your study group or project.
              </p>
            </div>

            <input
              className="search-input"
              placeholder="Search room name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="active-row">
            <span className="active-label">ACTIVE:</span>

            {date && (
              <button className="active-chip" onClick={() => setDate("")} type="button">
                Date: {date} ×
              </button>
            )}

            {minCapacity !== null && (
              <button className="active-chip" onClick={() => setMinCapacity(null)} type="button">
                Capacity: {minCapacity}+ ×
              </button>
            )}

            {timeRange !== null && (
              <button className="active-chip" onClick={() => setTimeRange(null)} type="button">
                Time: {hourLabel(timeRange.start)} - {hourLabel(timeRange.end)} ×
              </button>
            )}

            {amenities.wifi && (
              <button
                className="active-chip"
                onClick={() => setAmenities((p) => ({ ...p, wifi: false }))}
                type="button"
              >
                {amenityLabel.wifi} ×
              </button>
            )}
            {amenities.projector && (
              <button
                className="active-chip"
                onClick={() => setAmenities((p) => ({ ...p, projector: false }))}
                type="button"
              >
                {amenityLabel.projector} ×
              </button>
            )}
            {amenities.whiteboard && (
              <button
                className="active-chip"
                onClick={() => setAmenities((p) => ({ ...p, whiteboard: false }))}
                type="button"
              >
                {amenityLabel.whiteboard} ×
              </button>
            )}

            <button className="clear-all-btn" onClick={clearAll} type="button">
              Clear All
            </button>
          </div>

          <div className="list-head">
            <h2>Showing {filteredRooms.length} Rooms</h2>
            <div className="sort-wrap">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)}>
                <option value="capacity-asc">Capacity (Low to High)</option>
                <option value="capacity-desc">Capacity (High to Low)</option>
                <option value="name-asc">Name (A to Z)</option>
              </select>
            </div>
          </div>

          <div className="rooms-grid">
            {paginatedRooms.map((room) => (
              <article key={room.id} className="room-card">
                <div className="room-top">
                  <h3>{room.name}</h3>
                  <span className="status-pill">Available</span>
                </div>

                <p className="muted">{room.location}</p>
                <p className="capacity-line">Cap: {room.capacity}</p>
                <p className="muted">{room.amenities.map((a) => amenityLabel[a]).join(" • ")}</p>

                <div className="card-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => navigate(`/app/rooms/${room.id}`)}
                    type="button"
                  >
                    Details
                  </button>
                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/app/rooms/${room.id}`)}
                    type="button"
                  >
                    Book Now
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="pagination">
            <button
              type="button"
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="page-indicator">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SearchRoomsPage;