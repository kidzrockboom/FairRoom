import { useCallback, useEffect, useMemo, useState } from "react";

import { buildAdminAnalyticsViewModel, type AdminAnalyticsViewModel } from "../adminAnalyticsMappers";
import { loadAdminRoomUsage } from "../adminAnalyticsService";

export function useAdminAnalytics() {
  const [data, setData] = useState<AdminAnalyticsViewModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAnalytics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await loadAdminRoomUsage();
      setData(buildAdminAnalyticsViewModel(response));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load analytics.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAnalytics();
  }, [loadAnalytics]);

  return useMemo(
    () => ({
      data,
      error,
      isLoading,
      refresh: loadAnalytics,
    }),
    [data, error, isLoading, loadAnalytics],
  );
}
