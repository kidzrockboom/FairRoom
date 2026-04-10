import type { Room } from "@/api/contracts";

export type InventoryRoom = Room & {
  tags: string[];
};

export type InventoryAmenityOption = {
  id: string;
  label: string;
};

export const inventoryHeader = {
  title: "Room Inventory",
  subtitle: "Manage physical spaces, capacity, and maintenance status.",
} as const;

export const inventorySyncMessage = {
  title: "Inventory synced successfully.",
  description: "All room records reflect the latest capacity and maintenance state.",
} as const;

export const inventoryAmenityOptions: InventoryAmenityOption[] = [
  { id: "projector", label: "Projector" },
  { id: "ac", label: "AC" },
  { id: "stage", label: "Stage" },
  { id: "power-outlets", label: "Power Outlets" },
  { id: "whiteboard", label: "Whiteboard" },
  { id: "pa-system", label: "PA System" },
  { id: "high-end-pcs", label: "High-end PCs" },
  { id: "video-conf", label: "Video Conf" },
];

export const inventoryRooms: InventoryRoom[] = [
  {
    id: "inv-1",
    roomCode: "RM-1101",
    name: "Seminar Room A",
    location: "Building 1, Floor 2",
    capacity: 30,
    status: "operational",
    createdAt: "2023-09-14",
    tags: ["Projector", "Whiteboard", "AC"],
  },
  {
    id: "inv-2",
    roomCode: "RM-2201",
    name: "Collaborative Lab",
    location: "Building 2, Floor 1",
    capacity: 12,
    status: "operational",
    createdAt: "2023-09-19",
    tags: ["High-end PCs", "Whiteboard"],
  },
  {
    id: "inv-3",
    roomCode: "RM-3104",
    name: "Focus Pod 104",
    location: "Library, Floor 1",
    capacity: 2,
    status: "disabled",
    createdAt: "2023-08-24",
    tags: ["Power Outlets"],
  },
  {
    id: "inv-4",
    roomCode: "RM-4401",
    name: "Conference Room C",
    location: "Building 1, Floor 4",
    capacity: 50,
    status: "operational",
    createdAt: "2023-08-29",
    tags: ["Projector", "Video Conf", "AC"],
  },
  {
    id: "inv-5",
    roomCode: "RM-3302",
    name: "Study Suite 2",
    location: "Library, Floor 3",
    capacity: 6,
    status: "operational",
    createdAt: "2023-09-04",
    tags: ["Whiteboard"],
  },
  {
    id: "inv-6",
    roomCode: "RM-5101",
    name: "Lecture Hall 1",
    location: "West Wing, Ground",
    capacity: 120,
    status: "disabled",
    createdAt: "2023-07-20",
    tags: ["PA System", "Stage", "Projector"],
  },
];
