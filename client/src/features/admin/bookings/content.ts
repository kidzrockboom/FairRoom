export type AdminQuickLink = {
  id: string;
  label: string;
};

export const adminBookingsHeader = {
  title: "Bookings Overview",
  subtitle: "Monitor and manage all active room reservations in the system.",
} as const;

export const adminBookingsQuickLinks: AdminQuickLink[] = [
  { id: "ql-1", label: "Strike Management" },
  { id: "ql-2", label: "Room Inventory" },
  { id: "ql-3", label: "Usage Analytics" },
];

export const adminBookingsProTip =
  "No-shows automatically result in a strike if not cancelled 2 hours prior. Review flagged users in the Strikes module.";
