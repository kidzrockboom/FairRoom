export type AdminQuickLink = {
  id: string;
  label: string;
  badge?: string;
};

export type AdminRecentActivity = {
  id: string;
  title: string;
  actor: string;
  when: string;
};

export const adminBookingsHeader = {
  title: "Bookings Overview",
  subtitle: "Monitor and manage all active room reservations in the system.",
  exportButtonLabel: "Export CSV",
  newBookingButtonLabel: "New Booking",
} as const;

export const adminBookingsQuickLinks: AdminQuickLink[] = [
  { id: "ql-1", label: "Strike Management", badge: "4 Pending" },
  { id: "ql-2", label: "Room Inventory" },
  { id: "ql-3", label: "Usage Analytics" },
  { id: "ql-4", label: "System Settings" },
];

export const adminBookingsRecentActivities: AdminRecentActivity[] = [
  { id: "ra-1", title: "Updated Strike Policy", actor: "Admin Jane", when: "2h ago" },
  { id: "ra-2", title: "Auto-cancelled 3 No-Shows", actor: "System", when: "5h ago" },
  { id: "ra-3", title: "Booked Room 402", actor: "John Doe", when: "6h ago" },
  { id: "ra-4", title: "Room 205 marked unavailable", actor: "Admin Jane", when: "1d ago" },
  { id: "ra-5", title: "Inventory sync completed", actor: "System", when: "1d ago" },
];

export const adminBookingsProTip =
  "No-shows automatically result in a strike if not cancelled 2 hours prior. Review flagged users in the Strikes module.";
