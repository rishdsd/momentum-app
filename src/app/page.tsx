import { AppShell } from "@/components/app-shell";
import { getAppData } from "@/lib/app-data";
import { overallScore, trackerTotals } from "@/lib/metrics";

export default async function Home() {
  const { trackers, logs, smartSets, isAuthenticated } = await getAppData();
  const totals = trackerTotals(trackers, logs, 7);
  const score = overallScore(totals);
  const topTracker = totals.filter((tracker) => tracker.mode !== "measurement").sort((a, b) => b.score - a.score)[0];
  const hasTrackers = trackers.length > 0;

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <p className="eyebrow">Launch app</p>
          <h1>Your progress cockpit</h1>
        </div>
        <div className="topbar-actions">
          <a className="ghost-button" href="/journal">
            Check in
          </a>
          <a className="primary-button" href="/log">
            Log today
          </a>
        </div>
      </header>

      <section className="hero-grid">
        <article className="score-card">
          <div>
            <span className="eyebrow">Overall progress</span>
            <strong>{score}%</strong>
            <p>
              {topTracker
                ? `${topTracker.name} is currently leading your week.`
                : "Create your first tracker, then log one real action to begin your progress story."}
            </p>
            {!isAuthenticated ? <a className="ghost-button inline-action" href="/auth">Sign in to sync</a> : null}
            {isAuthenticated && !hasTrackers ? (
              <a className="primary-button inline-action" href="/trackers">
                Create first tracker
              </a>
            ) : null}
          </div>
          <div className="ring" style={{ "--score": `${score * 3.6}deg` } as React.CSSProperties}>
            <span>{score}%</span>
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Smart sets</span>
              <h2>Quick routines</h2>
            </div>
          </div>
          <div className="routine-list">
            {smartSets.length ? (
              smartSets.map((set) => (
                <a href="/log" className="routine-card" key={set.id}>
                  <strong>{set.name}</strong>
                  <p>{set.description}</p>
                  <span>{set.items.length} saved logs</span>
                </a>
              ))
            ) : (
              <div className="empty-state compact">
                <strong>No smart sets yet</strong>
                <p>Create routines after you have a few trackers.</p>
              </div>
            )}
          </div>
        </article>
      </section>

      {totals.length ? (
        <section className="tracker-grid">
          {totals.map((tracker) => (
            <article className="tracker-card" key={tracker.id}>
              <header>
                <div>
                  <h3>{tracker.name}</h3>
                  <p>
                    {Math.round(tracker.rawTotal)} / {Math.round(tracker.target)} {tracker.unit}
                  </p>
                </div>
                <span>{tracker.category}</span>
              </header>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, tracker.score)}%` }} />
              </div>
              <div className="metric-line">
                <span>Weekly target</span>
                <span>{Math.round(tracker.score)}%</span>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-state">
          <span className="eyebrow">Fresh start</span>
          <h2>No trackers or logs yet</h2>
          <p>Your account is empty by design. Create only the areas you genuinely want to track.</p>
          <a className="primary-button" href="/trackers">
            Add a tracker
          </a>
        </section>
      )}
    </AppShell>
  );
}
