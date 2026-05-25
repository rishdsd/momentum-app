import { AppShell } from "@/components/app-shell";
import { getAppData } from "@/lib/app-data";

export default async function LogPage() {
  const { smartSets, trackers } = await getAppData();

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <p className="eyebrow">Daily action</p>
          <h1>Log today</h1>
        </div>
      </header>

      <section className="hero-grid">
        <article className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Smart sets</span>
              <h2>Use a routine</h2>
            </div>
          </div>
          <div className="routine-list">
            {smartSets.map((set) => (
              <button className="routine-card" key={set.id} type="button">
                <strong>{set.name}</strong>
                <p>{set.description}</p>
                <span>{set.items.length} logs ready</span>
              </button>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Manual log</span>
              <h2>One entry</h2>
            </div>
          </div>
          <form className="form-stack">
            <label>
              Tracker
              <select>
                {trackers.map((tracker) => (
                  <option key={tracker.id}>{tracker.name}</option>
                ))}
              </select>
            </label>
            <label>
              Amount
              <input placeholder="45" type="number" />
            </label>
            <label>
              Note
              <input placeholder="Optional reflection" />
            </label>
            <button className="primary-button" type="button">
              Save log
            </button>
          </form>
        </article>
      </section>
    </AppShell>
  );
}
