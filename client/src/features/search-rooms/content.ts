import type { Amenity } from "@/api/contracts";

export const CAPACITY_OPTIONS = [2, 4, 8, 12, 20, 50] as const;

export const AMENITY_OPTIONS: (Amenity & { defaultChecked: boolean })[] = [
  { id: "wifi",       label: "High-speed Wifi",    defaultChecked: true  },
  { id: "projector",  label: "Projector / Screen",  defaultChecked: false },
  { id: "whiteboard", label: "Whiteboard",           defaultChecked: false },
];
