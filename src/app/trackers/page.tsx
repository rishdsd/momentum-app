import { AppShell } from "@/components/app-shell";
import { getAppData } from "@/lib/app-data";

export default async function TrackersPage() {
  const { trackers } = await getAppData();

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <p className="eyebrow">Editable system</p>
          <h1>Trackers</h1>
        </div>
        <button className="primary-button" type="button">
          Add tracker
        </button>
      </header>
      <section className="tracker-grid">
        {trackers.map((tracker) => (
          <article className="tracker-card" key={tracker.id}>
            <header>
              <div>
                <h3>{tracker.name}</h3>
                <p>
                  {tracker.weeklyTarget} {tracker.unit} weekly target
                </p>
              </div>
              <span>{tracker.category}</span>
            </header>
            <div className="metric-line">
              <span>Overall weight</span>
              <span>{tracker.weight}/10</span>
            </div>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
