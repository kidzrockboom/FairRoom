import type { LucideIcon } from "lucide-react";

import { Clock, TrendingUp, Users } from "@/lib/icons";

export type AnalyticsKpi = {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
};

export type AnalyticsBarItem = {
  room: string;
  hours: number;
};

export type AnalyticsPerformanceRow = {
  roomIdentifier: string;
  totalUsage: string;
  occupancyPct: number;
  efficiency: "High" | "Medium" | "Low";
};

export type AnalyticsInsight = {
  title: string;
  description: string;
  meta?: string;
};

export const analyticsHeader = {
  title: "Room Usage Review",
  subtitle: "Analyze peak times and room performance across all campuses.",
  inlineNote: "Inline Note: No data available for future date range filters.",
  dateRangeLabel: "Jan 1, 2024 - Jan 30, 2024",
} as const;

export const analyticsKpis: AnalyticsKpi[] = [
  {
    label: "Most Popular Room",
    value: "Room 412",
    note: "+12% usage since last month",
    icon: TrendingUp,
  },
  {
    label: "Avg Booking Duration",
    value: "2.4 Hours",
    note: "Slightly higher than system average",
    icon: Clock,
  },
  {
    label: "No-Show Rate",
    value: "4.2%",
    note: "-0.8% decrease (improvement)",
    icon: Users,
  },
];

export const analyticsChart = {
  title: "Usage Distribution",
  subtitle: "Total active booking hours per room for the current period.",
  groupLabel: "Group by Campus: Main",
  bars: [
    { room: "Room 101", hours: 140 },
    { room: "Room 102", hours: 118 },
    { room: "Room 205", hours: 185 },
    { room: "Room 303", hours: 92 },
    { room: "Room 410", hours: 160 },
    { room: "Room 412", hours: 212 },
    { room: "Lounge A", hours: 176 },
  ] satisfies AnalyticsBarItem[],
  yAxis: [220, 165, 110, 55, 0],
} as const;

export const analyticsPerformance = {
  title: "Performance Breakdown",
  inlineNote: "Inline Note: Access Denied to detailed user identity logs for privacy.",
  rows: [
    { roomIdentifier: "Room 412 (Executive)", totalUsage: "210h", occupancyPct: 88, efficiency: "High" },
    { roomIdentifier: "Room 205 (Workshop)", totalUsage: "190h", occupancyPct: 76, efficiency: "Medium" },
    { roomIdentifier: "Lounge A (Open Space)", totalUsage: "180h", occupancyPct: 72, efficiency: "Medium" },
    { roomIdentifier: "Room 410 (Meeting)", totalUsage: "160h", occupancyPct: 64, efficiency: "Medium" },
    { roomIdentifier: "Room 101 (Study)", totalUsage: "145h", occupancyPct: 58, efficiency: "Low" },
  ] satisfies AnalyticsPerformanceRow[],
} as const;

export const analyticsInsights = {
  title: "System Insights",
  recommendation: {
    title: "System Recommendation",
    description:
      "Consider adding more 4-person rooms in Campus North. Current booking conflicts suggest a 22% shortfall in capacity during peak Tuesday/Thursday hours.",
    meta: "View Capacity Forecast",
  },
  anomalies: [
    {
      title: "Room 303: Low Utilization",
      description: "Under 40% for 3 consecutive weeks.",
      meta: "Weekly audit ready",
    },
    {
      title: "Monthly Audit Ready",
      description: "January report compiled successfully.",
    },
  ] satisfies AnalyticsInsight[],
} as const;
