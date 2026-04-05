import {
  analyticsSummary,
  performanceRows,
  usageAnomalies,
  usageDistribution,
} from "@/data/adminMockData";
import "../../styles/admin.css";

function AdminAnalyticsPage() {
  const maxHours = Math.max(...usageDistribution.map((x) => x.hours), 1);

  return (
    <section className="admin-analytics-page">
      <header className="analytics-head">
        <div>
          <h1>{analyticsSummary.title}</h1>
          <p>{analyticsSummary.subtitle}</p>
        </div>

        <div className="analytics-head-actions">
          <span className="inline-note">{analyticsSummary.note}</span>
          <button className="btn-secondary" type="button">{analyticsSummary.dateRangeLabel}</button>
        </div>
      </header>

      <div className="analytics-toolbar">
        <button className="btn-secondary" type="button">Filters</button>
        <button className="btn-primary" type="button">Export PDF</button>
      </div>

      <div className="analytics-kpis">
        <article className="kpi-card">
          <small>Most Popular Room</small>
          <h3>{analyticsSummary.mostPopularRoom}</h3>
          <p>{analyticsSummary.mostPopularDelta}</p>
        </article>
        <article className="kpi-card">
          <small>Avg Booking Duration</small>
          <h3>{analyticsSummary.avgBookingDuration}</h3>
          <p>{analyticsSummary.avgBookingDurationNote}</p>
        </article>
        <article className="kpi-card">
          <small>No-Show Rate</small>
          <h3>{analyticsSummary.noShowRate}</h3>
          <p>{analyticsSummary.noShowRateNote}</p>
        </article>
      </div>

      <section className="usage-section cardish">
        <div className="usage-head">
          <div>
            <h2>{analyticsSummary.usageDistributionTitle}</h2>
            <p>{analyticsSummary.usageDistributionSubtitle}</p>
          </div>
          <span className="campus-chip">{analyticsSummary.campusGroupLabel}</span>
        </div>

        <div className="bars-wrap">
          {usageDistribution.map((item) => (
            <div key={item.room} className="bar-col">
              <div
                className="bar"
                style={{ height: `${(item.hours / maxHours) * 260}px` }}
                title={`${item.room}: ${item.hours}h`}
              />
              <small>{item.room}</small>
            </div>
          ))}
        </div>
      </section>

      <div className="analytics-bottom-grid">
        <section className="cardish">
          <div className="perf-head">
            <h2>{analyticsSummary.performanceTitle}</h2>
            <span className="danger-inline">{analyticsSummary.performanceInlineNote}</span>
          </div>

          <div className="perf-table">
            <div className="perf-row perf-row-head">
              <span>Room Identifier</span>
              <span>Total Usage</span>
              <span>Occupancy %</span>
              <span>Efficiency</span>
            </div>

            {performanceRows.map((row) => (
              <div className="perf-row" key={row.roomIdentifier}>
                <span>{row.roomIdentifier}</span>
                <span>{row.totalUsage}</span>
                <span>{row.occupancyPct}%</span>
                <span>
                  <i className={`eff-tag ${row.efficiency.toLowerCase()}`}>{row.efficiency}</i>
                </span>
              </div>
            ))}
          </div>
        </section>

        <aside className="insights-col">
          <section className="cardish">
            <h2>{analyticsSummary.systemInsightsTitle}</h2>

            <div className="recommend-box">
              <h3>{analyticsSummary.systemRecommendationTitle}</h3>
              <p>{analyticsSummary.systemRecommendationText}</p>
              <button className="linkish" type="button">
                {analyticsSummary.systemRecommendationLink}
              </button>
            </div>

            <div className="anomaly-list">
              <h4>Usage Anomalies</h4>
              {usageAnomalies.map((a) => (
                <p key={a.id}>• {a.text}</p>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

export default AdminAnalyticsPage;