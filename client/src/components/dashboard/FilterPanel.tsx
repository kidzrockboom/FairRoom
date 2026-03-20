import { useMemo } from "react";

type FilterPanelProps = {
  date: string;
  onDateChange: (value: string) => void;
  minCapacity: number | null;
  onMinCapacityChange: (value: number) => void;

  timeRange: { start: number; end: number } | null; // [start, end)
  onTimeRangeChange: (range: { start: number; end: number } | null) => void;

  amenities: {
    wifi: boolean;
    projector: boolean;
    whiteboard: boolean;
  };
  onAmenityChange: (key: "wifi" | "projector" | "whiteboard", checked: boolean) => void;
  onReset: () => void;
};

const capacityOptions = [2, 4, 8, 12, 20, 50];

const toLabel = (hour: number) => {
  const h = hour % 24;
  const ampm = h >= 12 ? "PM" : "AM";
  const normalized = h % 12 === 0 ? 12 : h % 12;
  return `${String(normalized).padStart(2, "0")}:00 ${ampm}`;
};

function FilterPanel({
  date,
  onDateChange,
  minCapacity,
  onMinCapacityChange,
  timeRange,
  onTimeRangeChange,
  amenities,
  onAmenityChange,
  onReset,
}: FilterPanelProps) {
  const start = timeRange?.start ?? 9;
  const end = timeRange?.end ?? 17;

  const leftPercent = useMemo(() => (start / 24) * 100, [start]);
  const widthPercent = useMemo(() => ((end - start) / 24) * 100, [start, end]);

  const handleStartChange = (value: number) => {
    const safeStart = Math.min(value, end - 1);
    onTimeRangeChange({ start: safeStart, end });
  };

  const handleEndChange = (value: number) => {
    const safeEnd = Math.max(value, start + 1);
    onTimeRangeChange({ start, end: safeEnd });
  };

  return (
    <aside className="filters-panel">
      <div className="filters-head">
        <h3>Filters</h3>
        <button className="reset-btn" onClick={onReset} type="button">
          Reset
        </button>
      </div>

      <section className="filter-section">
        <h4>DATE</h4>
        <div className="date-wrap">
          <input type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
        </div>
      </section>

      <section className="filter-section">
        <h4>CAPACITY</h4>
        <div className="capacity-grid">
          {capacityOptions.map((value) => (
            <button
              key={value}
              className={`chip-btn ${minCapacity === value ? "active" : ""}`}
              onClick={() => onMinCapacityChange(value)}
              type="button"
            >
              {value}+ People
            </button>
          ))}
        </div>
      </section>

      <section className="filter-section">
        <h4>TIME RANGE</h4>

        <div className="dual-range-wrap">
          <div className="dual-range-track" />
          <div
            className="dual-range-active"
            style={{ left: `${leftPercent}%`, width: `${widthPercent}%` }}
          />

          <input
            className="dual-range-input dual-range-input--start"
            type="range"
            min={0}
            max={23}
            step={1}
            value={start}
            onChange={(e) => handleStartChange(Number(e.target.value))}
          />
          <input
            className="dual-range-input dual-range-input--end"
            type="range"
            min={1}
            max={24}
            step={1}
            value={end}
            onChange={(e) => handleEndChange(Number(e.target.value))}
          />
        </div>

        <div className="time-labels">
          <span>{toLabel(start)}</span>
          <span>{toLabel(end === 24 ? 0 : end)}</span>
        </div>

        <button
          type="button"
          className="clear-time-btn"
          onClick={() => onTimeRangeChange(null)}
        >
          Clear time filter
        </button>
      </section>

      <section className="filter-section">
        <h4>AMENITIES</h4>

        <label className="check-row">
          <input
            type="checkbox"
            checked={amenities.wifi}
            onChange={(e) => onAmenityChange("wifi", e.target.checked)}
          />
          <span>High-speed Wifi</span>
        </label>

        <label className="check-row">
          <input
            type="checkbox"
            checked={amenities.projector}
            onChange={(e) => onAmenityChange("projector", e.target.checked)}
          />
          <span>Projector / Screen</span>
        </label>

        <label className="check-row">
          <input
            type="checkbox"
            checked={amenities.whiteboard}
            onChange={(e) => onAmenityChange("whiteboard", e.target.checked)}
          />
          <span>Whiteboard</span>
        </label>
      </section>
    </aside>
  );
}

export default FilterPanel;