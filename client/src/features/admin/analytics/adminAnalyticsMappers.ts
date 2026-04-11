import { Clock, TrendingUp, Users } from "@/lib/icons";

import type { AdminRoomUsageResponse } from "@/api/contracts";

import type { AnalyticsBarItem, AnalyticsKpi } from "./content";

export type AnalyticsUsageChart = {
  title: string;
  subtitle: string;
  groupLabel: string;
  bars: readonly AnalyticsBarItem[];
  yAxis: readonly number[];
};

export type AdminAnalyticsViewModel = {
  kpis: AnalyticsKpi[];
  chart: AnalyticsUsageChart;
  hasData: boolean;
};

function formatHours(hours: number) {
  const rounded = Math.round(hours * 10) / 10;
  return `${rounded.toFixed(rounded % 1 === 0 ? 0 : 1)} Hours`;
}

function formatPercent(value: number) {
  return `${Math.round(value * 10) / 10}%`;
}

function buildYAxis(maxValue: number): number[] {
  const upperBound = Math.max(Math.ceil(maxValue / 10) * 10, 10);
  const step = upperBound / 4;

  return [upperBound, upperBound - step, upperBound - step * 2, upperBound - step * 3, 0].map((value) =>
    Math.max(Math.round(value), 0),
  );
}

function getTopItem(items: AdminRoomUsageResponse["items"]) {
  return items.reduce<AdminRoomUsageResponse["items"][number] | null>((best, current) => {
    if (!best) return current;
    if (current.totalBookings > best.totalBookings) return current;
    if (current.totalBookings === best.totalBookings && current.totalHours > best.totalHours) {
      return current;
    }
    return best;
  }, null);
}

export function buildAdminAnalyticsViewModel(
  response: AdminRoomUsageResponse,
): AdminAnalyticsViewModel {
  const totalBookings = response.items.reduce((sum, item) => sum + item.totalBookings, 0);
  const totalHours = response.items.reduce((sum, item) => sum + item.totalHours, 0);
  const totalNoShows = response.items.reduce((sum, item) => sum + item.noShowCount, 0);
  const popularRoom = getTopItem(response.items);
  const averageDuration = totalBookings > 0 ? totalHours / totalBookings : 0;
  const noShowRate = totalBookings > 0 ? (totalNoShows / totalBookings) * 100 : 0;
  const maxHours = Math.max(...response.items.map((item) => item.totalHours), 0);

  const kpis: AnalyticsKpi[] = [
    {
      label: "Most Popular Room",
      value: popularRoom?.key ?? "No data",
      note: popularRoom
        ? `${popularRoom.totalBookings} bookings this period`
        : "No room usage has been recorded yet.",
      icon: TrendingUp,
    },
    {
      label: "Avg Booking Duration",
      value: formatHours(averageDuration),
      note:
        totalBookings > 0
          ? "Derived from total booking hours across all rooms."
          : "No booking activity is available yet.",
      icon: Clock,
    },
    {
      label: "No-Show Rate",
      value: formatPercent(noShowRate),
      note:
        totalBookings > 0
          ? `${totalNoShows} no-shows across ${totalBookings} bookings.`
          : "No show rate will appear once bookings exist.",
      icon: Users,
    },
  ];

  return {
    kpis,
    chart: {
      title: "Usage Distribution",
      subtitle: "Total booking hours per room for the current period.",
      groupLabel: `Group by: ${response.groupBy}`,
      bars: response.items.map((item) => ({
        room: item.key,
        hours: item.totalHours,
      })),
      yAxis: buildYAxis(maxHours),
    },
    hasData: response.items.length > 0,
  };
}
