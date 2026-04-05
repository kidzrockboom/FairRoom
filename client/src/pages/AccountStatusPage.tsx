import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fairroomApi } from "../api/fairroomApi";
import type { AccountActivityItem, AccountStatusResponse } from "../api/contracts";

function AccountStatusPage() {
  const [accountStatus, setAccountStatus] = useState<AccountStatusResponse | null>(null);
  const [activity, setActivity] = useState<AccountActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;

    const loadAccountData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [statusResponse, activitiesResponse] = await Promise.all([
          fairroomApi.getAccountStatus(),
          fairroomApi.getAccountActivities(),
        ]);

        if (isCancelled) return;

        setAccountStatus(statusResponse);
        setActivity(activitiesResponse.items);
      } catch (loadError) {
        if (isCancelled) return;

        setError(loadError instanceof Error ? loadError.message : "Unable to load account data.");
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    void loadAccountData();

    return () => {
      isCancelled = true;
    };
  }, []);

  const strikeCount = accountStatus?.activeStrikes ?? 0;
  const maxStrikes = 3;

  const { standingLabel, standingMessage } = useMemo(() => {
    if (!accountStatus) {
      return {
        standingLabel: "Loading",
        standingMessage: "Retrieving your account standing.",
      };
    }

    if (accountStatus.accountState === "restricted") {
      return {
        standingLabel: "Restricted",
        standingMessage: "Booking is currently restricted until your active strikes are reduced.",
      };
    }

    if (accountStatus.accountState === "warned") {
      return {
        standingLabel: "Warning",
        standingMessage: "You are one strike away from booking restrictions.",
      };
    }

    return {
      standingLabel: strikeCount === 0 ? "Excellent Standing" : "Good Standing",
      standingMessage:
        strikeCount === 0 ? "Perfect record. Keep it up!" : "Your account is still eligible to book.",
    };
  }, [accountStatus, strikeCount]);

  if (loading) {
    return <section className="account-health-page"><p>Loading account status...</p></section>;
  }

  if (error) {
    return <section className="account-health-page"><p>{error}</p></section>;
  }

  return (
    <section className="account-health-page">
      <header className="account-health-header">
        <h1>Account Health</h1>
        <p>Monitor your booking standing and strike history.</p>
      </header>

      <article className="standing-card">
        <div className="strike-meter" aria-hidden>
          <div className={`meter-bubble ${strikeCount === 0 ? "active" : ""}`}>🛡️</div>
          <div className={`meter-bubble ${strikeCount === 1 ? "active" : ""}`}>1</div>
          <div className={`meter-bubble ${strikeCount === 2 ? "active" : ""}`}>2</div>
          <div className={`meter-bubble ${strikeCount >= 3 ? "active" : ""}`}>3</div>
        </div>

        <div className="standing-content">
          <span className="standing-pill">{standingLabel}</span>
          <h2>{standingMessage}</h2>
          <p>
            Continue following the fair use policy to maintain access to all campus study rooms and
            facilities.
          </p>
          <strong>
            ACTIVE STRIKES: {strikeCount} / {maxStrikes} •{" "}
            {accountStatus?.bookingEligible ? "BOOKING ENABLED" : "BOOKING BLOCKED"}
          </strong>
        </div>
      </article>

      <div className="quick-actions-grid">
        <Link to="/search" className="quick-action-card">
          <div>
            <h3>Find a Room</h3>
            <p>Browse available spaces</p>
          </div>
          <span>›</span>
        </Link>

        <Link to="/bookings" className="quick-action-card">
          <div>
            <h3>My Bookings</h3>
            <p>Manage active reservations</p>
          </div>
          <span>›</span>
        </Link>
      </div>

      <section className="policy-section">
        <h2>ⓘ Fair Use Policy</h2>
      </section>

      <section className="activity-section">
        <div className="activity-head">
          <h2>↻ Recent Account Activity</h2>
          <button type="button" className="link-btn">
            View Full History
          </button>
        </div>

        <div className="activity-list">
          {activity.map((item) => (
            <article key={item.id} className="activity-row">
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
              <div className="activity-meta">
                <small>{new Date(item.occurredAt).toLocaleDateString()}</small>
                <span className={`status-tag ${item.status}`}>
                  {item.status === "incident" ? "Incident" : "Completed"}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default AccountStatusPage;
