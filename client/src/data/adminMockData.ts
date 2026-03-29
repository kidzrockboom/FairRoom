import type { AccountState, BookingStatus } from "../api/contracts";

/* =========================
   Admin Overview
========================= */
export type AdminBookingStatus = BookingStatus;

export type AdminBookingRow = {
  id: string;
  userFullName: string;
  userCode: string;
  avatarUrl: string;
  roomName: string;
  roomCode: string;
  dateLabel: string;
  timeLabel: string;
  status: AdminBookingStatus;
};

export const adminOverviewHeader = {
  title: "Bookings Overview",
  subtitle: "Monitor and manage all active room reservations in the system.",
  exportButtonLabel: "Export CSV",
  newBookingButtonLabel: "+ New Booking",
};

export const adminOverviewRows: AdminBookingRow[] = [
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
    status: "active",
  },
];

export type AdminQuickLink = {
  id: string;
  label: string;
  badge?: string;
};

export const adminQuickLinks: AdminQuickLink[] = [
  { id: "ql-1", label: "Strike Management", badge: "4 Pending" },
  { id: "ql-2", label: "Room Inventory" },
  { id: "ql-3", label: "Usage Analytics" },
  { id: "ql-4", label: "System Settings" },
];

export type AdminRecentActivity = {
  id: string;
  title: string;
  actor: string;
  when: string;
};

export const adminRecentActivities: AdminRecentActivity[] = [
  { id: "ra-1", title: "Updated Strike Policy", actor: "Admin Jane", when: "2h ago" },
  { id: "ra-2", title: "Auto-cancelled 3 No-Shows", actor: "System", when: "5h ago" },
  { id: "ra-3", title: "Booked Room 402", actor: "John Doe", when: "6h ago" },
  { id: "ra-4", title: "Room 205 marked unavailable", actor: "Admin Jane", when: "1d ago" },
  { id: "ra-5", title: "Inventory sync completed", actor: "System", when: "1d ago" },
];

export const adminProTip =
  "No-shows automatically result in a strike if not cancelled 2 hours prior. Review flagged users in the Strikes module.";

/* =========================
   Admin Strikes
========================= */
export type StrikeHistoryItem = {
  id: string;
  title: string;
  description: string;
  date: string;
};

export type DirectoryStudent = {
  id: string;
  fullName: string;
  studentCode: string;
  program: string;
  avatarUrl: string;
  strikes: number;
  accountState: AccountState;
  lastUpdate: string;
  strikeHistory: StrikeHistoryItem[];
};

export const adminStudents: DirectoryStudent[] = [
  {
    id: "st-1",
    fullName: "Alex Thompson",
    studentCode: "2023-0492",
    program: "Computer Science",
    avatarUrl: "https://i.pravatar.cc/64?img=12",
    strikes: 0,
    accountState: "good",
    lastUpdate: "2023-10-14",
    strikeHistory: [
      { id: "st1-h1", title: "Strike Cleared", description: "Successful attendance streak.", date: "2023-10-14" },
    ],
  },
  {
    id: "st-2",
    fullName: "Sarah Jenkins",
    studentCode: "2023-0112",
    program: "Mechanical Engineering",
    avatarUrl: "https://i.pravatar.cc/64?img=5",
    strikes: 2,
    accountState: "warned",
    lastUpdate: "2023-10-15",
    strikeHistory: [
      { id: "st2-h1", title: "Strike Added", description: "Booking #FA-2931 - No show.", date: "2023-10-16" },
      { id: "st2-h2", title: "Strike Cleared", description: "Appeal accepted with valid proof.", date: "2023-10-17" },
    ],
  },
  {
    id: "st-3",
    fullName: "Michael Chen",
    studentCode: "2022-0943",
    program: "Civil Engineering",
    avatarUrl: "https://i.pravatar.cc/64?img=15",
    strikes: 3,
    accountState: "restricted",
    lastUpdate: "2023-10-12",
    strikeHistory: [
      { id: "st3-h1", title: "Strike Added", description: "Late cancellation (<2h notice).", date: "2023-10-10" },
      { id: "st3-h2", title: "Strike Added", description: "No-show in Room 205.", date: "2023-10-12" },
    ],
  },
  {
    id: "st-4",
    fullName: "Emily Rodriguez",
    studentCode: "2023-0881",
    program: "Architecture",
    avatarUrl: "https://i.pravatar.cc/64?img=47",
    strikes: 1,
    accountState: "good",
    lastUpdate: "2023-10-11",
    strikeHistory: [
      { id: "st4-h1", title: "Strike Added", description: "Capacity violation warning escalated.", date: "2023-10-08" },
    ],
  },
  {
    id: "st-5",
    fullName: "David Kim",
    studentCode: "2022-0322",
    program: "Business Administration",
    avatarUrl: "https://i.pravatar.cc/64?img=60",
    strikes: 0,
    accountState: "good",
    lastUpdate: "2023-10-09",
    strikeHistory: [],
  },
];

/* =========================
   Admin Analytics
========================= */
export type UsageBarItem = {
  room: string;
  hours: number;
};

export type PerformanceRow = {
  roomIdentifier: string;
  totalUsage: string;
  occupancyPct: number;
  efficiency: "High" | "Medium" | "Low";
};

export type UsageAnomaly = {
  id: string;
  text: string;
};

export const analyticsSummary = {
  title: "Room Usage Review",
  subtitle: "Analyze peak times and room performance across all campuses.",
  note: "Inline Note: No data available for future date range filters.",
  dateRangeLabel: "Jan 1, 2024 - Jan 30, 2024",
  mostPopularRoom: "Room 412",
  mostPopularDelta: "+12% usage since last month",
  avgBookingDuration: "2.4 Hours",
  avgBookingDurationNote: "Slightly higher than system average",
  noShowRate: "4.2%",
  noShowRateNote: "-0.8% decrease (Improvement)",
  usageDistributionTitle: "Usage Distribution",
  usageDistributionSubtitle: "Total active booking hours per room for the current period.",
  campusGroupLabel: "Group by Campus: Main",
  performanceTitle: "Performance Breakdown",
  performanceInlineNote: "Inline Note: Access Denied to detailed user identity logs for privacy.",
  systemInsightsTitle: "System Insights",
  systemRecommendationTitle: "System Recommendation",
  systemRecommendationText:
    "Consider adding more 4-person rooms in Campus North. Current booking conflicts suggest a 22% shortfall in capacity during peak Tuesday/Thursday hours.",
  systemRecommendationLink: "View Capacity Forecast",
};

export const usageDistribution: UsageBarItem[] = [
  { room: "Room 101", hours: 145 },
  { room: "Room 102", hours: 120 },
  { room: "Room 205", hours: 190 },
  { room: "Room 303", hours: 92 },
  { room: "Room 410", hours: 160 },
  { room: "Room 412", hours: 210 },
  { room: "Lounge A", hours: 180 },
];

export const performanceRows: PerformanceRow[] = [
  { roomIdentifier: "Room 412 (Executive)", totalUsage: "210h", occupancyPct: 88, efficiency: "High" },
  { roomIdentifier: "Room 205 (Workshop)", totalUsage: "190h", occupancyPct: 76, efficiency: "Medium" },
  { roomIdentifier: "Lounge A (Open Space)", totalUsage: "180h", occupancyPct: 72, efficiency: "Medium" },
  { roomIdentifier: "Room 410 (Meeting)", totalUsage: "160h", occupancyPct: 64, efficiency: "Medium" },
  { roomIdentifier: "Room 101 (Study)", totalUsage: "145h", occupancyPct: 58, efficiency: "Low" },
  { roomIdentifier: "Room 102 (Focus)", totalUsage: "120h", occupancyPct: 49, efficiency: "Low" },
];

export const usageAnomalies: UsageAnomaly[] = [
  { id: "ua-1", text: "Room 303: Low utilization trend for 3 consecutive weeks." },
  { id: "ua-2", text: "Room 102: Spike in same-day cancellations on Fridays." },
  { id: "ua-3", text: "Lounge A: Frequent overtime usage beyond booked slots." },
];
