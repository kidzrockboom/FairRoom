export type AdminQuickLink = {
  id: string;
  label: string;
  href: string;
};

export const adminBookingsHeader = {
  title: "Bookings Overview",
  subtitle: "Monitor and manage all active room reservations in the system.",
} as const;

export const adminBookingsQuickLinks: AdminQuickLink[] = [
  { id: "ql-1", label: "Strike Management", href: "/admin/strikes" },
  { id: "ql-2", label: "Room Inventory", href: "/admin/inventory" },
  { id: "ql-3", label: "Usage Analytics", href: "/admin/analytics" },
];

export const adminBookingsProTip =
  "No-shows automatically result in a strike if not cancelled 2 hours prior. Review flagged users in the Strikes module.";
