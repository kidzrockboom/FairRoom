import type { LucideIcon } from "lucide-react";

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
} as const;
