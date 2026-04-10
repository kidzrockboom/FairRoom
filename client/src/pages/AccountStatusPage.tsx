import { useEffect, useState } from "react";
import type { AccountStatusResponse } from "@/api/contracts";
import { fairroomApi } from "@/api/fairroomApi";
import ErrorBlock from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import AccountQuickActions from "@/features/account-status/components/AccountQuickActions";
import AccountStandingCard from "@/features/account-status/components/AccountStandingCard";
import FairUsePolicySection from "@/features/account-status/components/FairUsePolicySection";
import RecentActivitySection from "@/features/account-status/components/RecentActivitySection";

function AccountStatusPage() {
  const [accountStatus, setAccountStatus] = useState<AccountStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const maxStrikes = 3;

  const loadAccountStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fairroomApi.getAccountStatus();
      setAccountStatus(data);
    } catch (loadError: unknown) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load account status");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fairroomApi.getAccountStatus();
        if (!cancelled) {
          setAccountStatus(data);
        }
      } catch (loadError: unknown) {
        if (!cancelled) {
          setError(
            loadError instanceof Error ? loadError.message : "Failed to load account status",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full items-center justify-center px-6 py-16">
        <Loading message="Loading account status" size="lg" />
      </div>
    );
  }

  if (error || !accountStatus) {
    return (
      <div className="flex w-full items-center justify-center px-6 py-16">
        <ErrorBlock message={error ?? "Account status is unavailable"} onRetry={loadAccountStatus} />
      </div>
    );
  }

  const strikeCount = accountStatus.activeStrikes;
  const standingLabel =
    accountStatus.accountState === "restricted"
      ? "Restricted"
      : accountStatus.accountState === "warned"
        ? "Account Warned"
        : "Good Standing";
  const standingMessage =
    accountStatus.accountState === "restricted"
      ? "Booking access is currently paused."
      : accountStatus.accountState === "warned"
        ? "Your account needs attention."
        : "Your account is in great shape!";

  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
      <header className="space-y-1">
        <h1 className="font-heading text-[30px] font-bold tracking-tight text-content">
          Account Health
        </h1>
        <p className="text-sm text-muted-foreground">
          Monitor your booking standing and strike history.
        </p>
      </header>

      <AccountStandingCard
        maxStrikes={maxStrikes}
        standingLabel={standingLabel}
        standingMessage={standingMessage}
        strikeCount={strikeCount}
      />

      <AccountQuickActions />

      <FairUsePolicySection />

      <RecentActivitySection />
    </div>
  );
}

export default AccountStatusPage;
