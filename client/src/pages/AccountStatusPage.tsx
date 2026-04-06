import AccountQuickActions from "@/features/account-status/components/AccountQuickActions";
import AccountStandingCard from "@/features/account-status/components/AccountStandingCard";
import FairUsePolicySection from "@/features/account-status/components/FairUsePolicySection";
import RecentActivitySection from "@/features/account-status/components/RecentActivitySection";
import { currentUser } from "@/data/sessionMock";

function AccountStatusPage() {
  const strikeCount = currentUser?.activeStrikes ?? 0;
  const maxStrikes = 3;
  const standingLabel = strikeCount >= 3 ? "Restricted" : "Good Standing";
  const standingMessage =
    strikeCount >= 3 ? "Booking access is currently paused." : "Your account is in great shape!";

  return (
    <div className="mx-auto flex w-full max-w-[860px] flex-col gap-5 px-4 py-6 sm:px-6 lg:px-0">
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
