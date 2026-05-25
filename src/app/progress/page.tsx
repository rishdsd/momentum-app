import { AppShell } from "@/components/app-shell";
import { getAppData } from "@/lib/app-data";
import { trackerTotals } from "@/lib/metrics";

export default async function ProgressPage() {
  const { trackers, logs } = await getAppData();
  const totals = trackerTotals(trackers, logs, 30);

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <p className="eyebrow">Progress</p>
          <h1>Monthly view</h1>
        </div>
      </header>

      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Target tension</span>
            <h2>How each lane is moving</h2>
          </div>
        </div>
        <div className="tracker-grid">
          {totals.map((tracker) => (
            <article className="tracker-card" key={tracker.id}>
              <header>
                <div>
                  <h3>{tracker.name}</h3>
                  <p>{Math.round(tracker.score)}% of monthly target</p>
                </div>
                <span>{tracker.category}</span>
              </header>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${Math.min(100, tracker.score)}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
