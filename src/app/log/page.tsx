import { AppShell } from "@/components/app-shell";
import { createLog } from "@/app/actions";
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
            {smartSets.length ? (
              smartSets.map((set) => (
                <button className="routine-card" key={set.id} type="button">
                  <strong>{set.name}</strong>
                  <p>{set.description}</p>
                  <span>{set.items.length} logs ready</span>
                </button>
              ))
            ) : (
              <div className="empty-state compact">
                <strong>No smart sets yet</strong>
                <p>Smart sets will appear here after you create them.</p>
              </div>
            )}
          </div>
        </article>

        <article className="panel">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Manual log</span>
              <h2>One entry</h2>
            </div>
          </div>
          {trackers.length ? (
            <form action={createLog} className="form-stack">
              <label>
                Tracker
                <select name="trackerId" required>
                  {trackers.map((tracker) => (
                    <option key={tracker.id} value={tracker.id}>
                      {tracker.name} ({tracker.unit})
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Date
                <input defaultValue={new Date().toISOString().slice(0, 10)} name="loggedOn" required type="date" />
              </label>
              <label>
                Amount
                <input min="0.01" name="amount" placeholder="45" required step="0.01" type="number" />
              </label>
              <div className="form-row">
                <label>
                  Mood
                  <select defaultValue="3" name="mood">
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Flat</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Strong</option>
                    <option value="5">5 - Peak</option>
                  </select>
                </label>
                <label>
                  Energy
                  <select defaultValue="3" name="energy">
                    <option value="1">1 - Low</option>
                    <option value="2">2 - Flat</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Strong</option>
                    <option value="5">5 - Peak</option>
                  </select>
                </label>
              </div>
              <label>
                Note
                <input name="note" placeholder="Optional reflection" />
              </label>
              <button className="primary-button" type="submit">
                Save log
              </button>
            </form>
          ) : (
            <div className="empty-state compact">
              <strong>Create a tracker first</strong>
              <p>Logs belong to a tracker, so define your first activity or metric before logging.</p>
              <a className="primary-button" href="/trackers">
                Add tracker
              </a>
            </div>
          )}
        </article>
      </section>
    </AppShell>
  );
}
