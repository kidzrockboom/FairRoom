import { useMemo, useState } from "react";
import { rooms } from "../data/mockData";
import type { Room } from "../types/types";
import RoomCard from "../components/RoomCard";

function Rooms() {
  const [searchTerm, setSearchTerm] = useState("");
  const [minCapacity, setMinCapacity] = useState(1);

  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      const matchesName = room.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCapacity = room.capacity >= minCapacity;
      return matchesName && matchesCapacity;
    });
  }, [searchTerm, minCapacity]);

  const handleBook = (room: Room) => {
    alert(`Booking flow for ${room.name} will be added next`);
  };

  return (
    <div>
      <h2>Available Rooms</h2>

      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
        <div>
          <label htmlFor="search">Search:</label>
        </div>
        <input
          type="text"
          placeholder="Search by room name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label htmlFor="capacity">Min Capacity:</label>
        </div>
          <input
          type="number"
          min={1}
          value={minCapacity}
          onChange={(e) => setMinCapacity(Number(e.target.value) || 1)}
        />
        

        
      </div>

      {filteredRooms.length === 0 ? (
        <p>No rooms found with current filters.</p>
      ) : (
        filteredRooms.map((room) => <RoomCard key={room.id} room={room} onBook={handleBook} />)
      )}
    </div>
  );
}

export default Rooms;