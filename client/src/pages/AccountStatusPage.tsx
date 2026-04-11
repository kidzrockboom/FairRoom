import ErrorBlock from "@/components/ui/error";
import Loading from "@/components/ui/loading";
import AccountQuickActions from "@/features/account-status/components/AccountQuickActions";
import AccountStandingCard from "@/features/account-status/components/AccountStandingCard";
import FairUsePolicySection from "@/features/account-status/components/FairUsePolicySection";
import RecentActivitySection from "@/features/account-status/components/RecentActivitySection";
import { getStandingLabel, getStandingMessage } from "@/features/account-status/accountStatusMappers";
import { useAccountStatus } from "@/features/account-status/hooks/useAccountStatus";

function AccountStatusPage() {
  const maxStrikes = 3;
  const { accountStatus, accountActivities, error, isLoading, reload } = useAccountStatus();

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
        <ErrorBlock message={error ?? "Account status is unavailable"} onRetry={reload} />
      </div>
    );
  }

  const strikeCount = accountStatus.activeStrikes;
  const standingLabel = getStandingLabel(accountStatus.accountState);
  const standingMessage = getStandingMessage(accountStatus.accountState);

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

      <RecentActivitySection items={accountActivities} />
    </div>
  );
}

export default AccountStatusPage;
