import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FilterPanel from "@/components/dashboard/FilterPanel";
import { fairroomApi } from "@/api/fairroomApi";
import type { RoomSearchItem } from "@/api/contracts";

type SortOption = "capacity-asc" | "capacity-desc" | "name-asc";
const ITEMS_PER_PAGE = 6;

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
  const [roomResults, setRoomResults] = useState<RoomSearchItem[]>([]);
  const [totalRooms, setTotalRooms] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const toggleCapacity = (value: number) => {
    setPage(1);
    setMinCapacity((prev) => (prev === value ? null : value));
  };

  const handleDateChange = (value: string) => {
    setPage(1);
    setDate(value);
  };

  const handleTimeRangeChange = (range: { start: number; end: number } | null) => {
    setPage(1);
    setTimeRange(range);
  };

  const clearAll = () => {
    setSearch("");
    setDate("");
    setMinCapacity(null);
    setTimeRange(null);
    setSortBy("capacity-asc");
    setPage(1);
  };

  useEffect(() => {
    let isCancelled = false;

    const loadRooms = async () => {
      setLoading(true);
      setError(null);

      const startsAt =
        date && timeRange
          ? new Date(`${date}T${String(timeRange.start).padStart(2, "0")}:00:00`).toISOString()
          : undefined;
      const endsAt =
        date && timeRange
          ? new Date(`${date}T${String(timeRange.end).padStart(2, "0")}:00:00`).toISOString()
          : undefined;

      try {
        const response = await fairroomApi.searchRooms({
          search: search || undefined,
          minCapacity: minCapacity ?? undefined,
          startsAt,
          endsAt,
          onlyAvailable: true,
          page,
          pageSize: ITEMS_PER_PAGE,
        });

        if (isCancelled) return;

        setRoomResults(response.items);
        setTotalRooms(response.total);
      } catch (loadError) {
        if (isCancelled) return;

        setError(loadError instanceof Error ? loadError.message : "Unable to load rooms.");
        setRoomResults([]);
        setTotalRooms(0);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadRooms();

    return () => {
      isCancelled = true;
    };
  }, [date, minCapacity, page, search, timeRange]);

  const sortedRooms = useMemo(() => {
    const result = [...roomResults];

    if (sortBy === "capacity-asc") result.sort((a, b) => a.capacity - b.capacity);
    if (sortBy === "capacity-desc") result.sort((a, b) => b.capacity - a.capacity);
    if (sortBy === "name-asc") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [roomResults, sortBy]);

  const totalPages = Math.max(1, Math.ceil(totalRooms / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);

  const hourLabel = (hour: number) => {
    const h = hour % 24;
    const ampm = h >= 12 ? "PM" : "AM";
    const normalized = h % 12 === 0 ? 12 : h % 12;
    return `${normalized}${ampm}`;
  };

  return (
    <section>
      <div className="content-grid">
        <FilterPanel
          date={date}
          onDateChange={handleDateChange}
          minCapacity={minCapacity}
          onMinCapacityChange={toggleCapacity}
          timeRange={timeRange}
          onTimeRangeChange={handleTimeRangeChange}
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
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
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

            <button className="clear-all-btn" onClick={clearAll} type="button">
              Clear All
            </button>
          </div>

          <div className="list-head">
              <h2>Showing {totalRooms} Rooms</h2>
            <div className="sort-wrap">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => {
                  setPage(1);
                  setSortBy(e.target.value as SortOption);
                }}
              >
                <option value="capacity-asc">Capacity (Low to High)</option>
                <option value="capacity-desc">Capacity (High to Low)</option>
                <option value="name-asc">Name (A to Z)</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">Loading rooms...</div>
          ) : error ? (
            <div className="empty-state">{error}</div>
          ) : sortedRooms.length === 0 ? (
            <div className="empty-state">No rooms found. Try changing your filters.</div>
          ) : (
            <>
              <div className="rooms-grid">
                {sortedRooms.map((room) => (
                  <article key={room.id} className="room-card">
                    <div className="room-top">
                      <h3>{room.name}</h3>
                      <span className="status-pill">
                        {room.isAvailableForRequestedRange ? "Available" : "Unavailable"}
                      </span>
                    </div>

                    <p className="muted">{room.location}</p>
                    <p className="capacity-line">Cap: {room.capacity}</p>

                    <div className="card-actions">
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          navigate(`/rooms/${room.id}`, {
                            state: { date, timeRange },
                          })
                        }
                        type="button"
                      >
                        Details
                      </button>
                      <button
                        className="btn-primary"
                        onClick={() =>
                          navigate(`/rooms/${room.id}`, {
                            state: { date, timeRange },
                          })
                        }
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
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default SearchRoomsPage;
