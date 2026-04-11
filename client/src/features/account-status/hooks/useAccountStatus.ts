import { useCallback, useEffect, useState } from "react";
import type { AccountActivityItem, AccountStatusResponse } from "@/api/contracts";
import { loadAccountStatusOverview } from "../accountStatusService";

export function useAccountStatus() {
  const [accountStatus, setAccountStatus] = useState<AccountStatusResponse | null>(null);
  const [accountActivities, setAccountActivities] = useState<AccountActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loadAccountStatusOverview();
      setAccountStatus(data.accountStatus);
      setAccountActivities(data.accountActivities);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load account status");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    accountStatus,
    accountActivities,
    error,
    isLoading,
    reload,
  };
}
