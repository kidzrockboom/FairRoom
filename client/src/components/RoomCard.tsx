import type { Room } from "@/types/types";

type RoomCardProps = {
  room: Room;
  onBook: (room: Room) => void;
};

function RoomCard({ room, onBook }: RoomCardProps) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "1rem", marginBottom: "0.75rem" }}>
      <h3>{room.name}</h3>
      <p>Capacity: {room.capacity}</p>
      <button onClick={() => onBook(room)}>Book</button>
    </div>
  );
}

export default RoomCard;