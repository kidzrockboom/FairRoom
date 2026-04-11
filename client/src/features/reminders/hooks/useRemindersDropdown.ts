import { useCallback, useEffect, useState } from "react";
import type { Reminder } from "@/api/contracts";
import { loadRecentReminders } from "../remindersService";

export function useRemindersDropdown() {
  const [open, setOpen] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await loadRecentReminders();
      setReminders(data);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load reminders");
      setReminders([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    void reload();
  }, [open, reload]);

  return {
    error,
    isLoading,
    open,
    reminders,
    reload,
    setOpen,
  };
}
