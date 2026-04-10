import type { BookingStatus } from "@/api/contracts";

export type AdminBookingRow = {
  id: string;
  userFullName: string;
  userCode: string;
  avatarUrl: string;
  roomName: string;
  roomCode: string;
  dateLabel: string;
  timeLabel: string;
  status: BookingStatus;
};

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

export const adminBookingsRows: AdminBookingRow[] = [
  {
    id: "bk-001",
    userFullName: "Sarah Jenkins",
    userCode: "S202301",
    avatarUrl: "https://i.pravatar.cc/40?img=5",
    roomName: "Library Room 402",
    roomCode: "RM-8821",
    dateLabel: "Oct 24, 2023",
    timeLabel: "10:00 AM - 12:00 PM",
    status: "active",
  },
  {
    id: "bk-002",
    userFullName: "Michael Chen",
    userCode: "S202305",
    avatarUrl: "https://i.pravatar.cc/40?img=15",
    roomName: "Science Hub B2",
    roomCode: "RM-8822",
    dateLabel: "Oct 24, 2023",
    timeLabel: "01:00 PM - 03:00 PM",
    status: "cancelled",
  },
  {
    id: "bk-003",
    userFullName: "Aria Rodriguez",
    userCode: "S202312",
    avatarUrl: "https://i.pravatar.cc/40?img=32",
    roomName: "Study Pod 09",
    roomCode: "RM-8823",
    dateLabel: "Oct 23, 2023",
    timeLabel: "09:00 AM - 10:30 AM",
    status: "no_show",
  },
  {
    id: "bk-004",
    userFullName: "James Wilson",
    userCode: "S202309",
    avatarUrl: "https://i.pravatar.cc/40?img=52",
    roomName: "Collaboration Suite A",
    roomCode: "RM-8824",
    dateLabel: "Oct 23, 2023",
    timeLabel: "02:00 PM - 05:00 PM",
    status: "active",
  },
  {
    id: "bk-005",
    userFullName: "Elena Gilbert",
    userCode: "S202318",
    avatarUrl: "https://i.pravatar.cc/40?img=45",
    roomName: "Library Room 201",
    roomCode: "RM-8825",
    dateLabel: "Oct 22, 2023",
    timeLabel: "11:00 AM - 12:30 PM",
    status: "active",
  },
  {
    id: "bk-006",
    userFullName: "Noah Patel",
    userCode: "S202324",
    avatarUrl: "https://i.pravatar.cc/40?img=22",
    roomName: "Lab 210",
    roomCode: "RM-8826",
    dateLabel: "Oct 22, 2023",
    timeLabel: "03:00 PM - 04:30 PM",
    status: "cancelled",
  },
  {
    id: "bk-007",
    userFullName: "Lina Park",
    userCode: "S202331",
    avatarUrl: "https://i.pravatar.cc/40?img=25",
    roomName: "Quiet Pod 04",
    roomCode: "RM-8827",
    dateLabel: "Oct 21, 2023",
    timeLabel: "08:00 AM - 09:00 AM",
    status: "no_show",
  },
  {
    id: "bk-008",
    userFullName: "Omar Khaled",
    userCode: "S202337",
    avatarUrl: "https://i.pravatar.cc/40?img=29",
    roomName: "Meeting Room 09",
    roomCode: "RM-8828",
    dateLabel: "Oct 21, 2023",
    timeLabel: "04:00 PM - 06:00 PM",
    status: "completed",
  },
] satisfies AdminBookingRow[];

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
