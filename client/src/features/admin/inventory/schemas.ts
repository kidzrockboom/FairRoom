import { z } from "zod";

export const inventoryRoomSchema = z.object({
  roomCode: z.string().trim().min(1, "Room code is required"),
  name: z.string().trim().min(1, "Room name is required"),
  location: z.string().trim().min(1, "Location is required"),
  capacity: z.coerce.number().int().min(1, "Capacity must be at least 1"),
  status: z.enum(["operational", "disabled"]),
  usageNotes: z.string().optional().default(""),
  amenityIds: z.array(z.string()).default([]),
});

export const createAmenitySchema = z.object({
  label: z.string().trim().min(1, "Amenity label is required"),
});

export type InventoryRoomFormValues = z.infer<typeof inventoryRoomSchema>;
export type CreateAmenityFormValues = z.infer<typeof createAmenitySchema>;
