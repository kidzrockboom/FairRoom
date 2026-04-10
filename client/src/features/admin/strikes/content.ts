import type { AccountState } from "@/api/contracts";

export type StrikeHistoryItem = {
  id: string;
  title: string;
  description: string;
  date: string;
};

export type StrikeStudent = {
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

export const strikeStudents: StrikeStudent[] = [
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
      {
        id: "st1-h1",
        title: "Strike Cleared",
        description: "Successful attendance streak.",
        date: "2023-10-14",
      },
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
      {
        id: "st2-h1",
        title: "Strike Added",
        description: "Booking #FA-2931 - No show.",
        date: "2023-10-16",
      },
      {
        id: "st2-h2",
        title: "Strike Cleared",
        description: "Annual strike reset period.",
        date: "2023-10-17",
      },
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
      {
        id: "st3-h1",
        title: "Strike Added",
        description: "Late cancellation (<2h notice).",
        date: "2023-10-10",
      },
      {
        id: "st3-h2",
        title: "Strike Added",
        description: "No-show in Room 205.",
        date: "2023-10-12",
      },
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
      {
        id: "st4-h1",
        title: "Strike Added",
        description: "Capacity violation warning escalated.",
        date: "2023-10-08",
      },
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

export const selectedStrikeStudent = strikeStudents[1];

export const strikeSummary = {
  currentStrikes: 2,
  proposedStrikes: 2,
};

export const strikePolicyItems = [
  "3 strikes result in automatic account suspension for 14 days.",
  "Strikes can be appealed by students within 48 hours.",
  "Manual overrides must include a valid reason for auditing purposes.",
  "Strikes expire after 180 days of clean booking history.",
];
