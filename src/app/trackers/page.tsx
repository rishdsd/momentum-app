import { AppShell } from "@/components/app-shell";
import { createTracker } from "@/app/actions";
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
      </header>
      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">New tracker</span>
            <h2>Choose what matters</h2>
          </div>
        </div>
        <form action={createTracker} className="tracker-form">
          <label>
            Name
            <input name="name" placeholder="Gym, reading, deep work..." required />
          </label>
          <label>
            Category
            <select defaultValue="Body" name="category">
              <option>Body</option>
              <option>Work</option>
              <option>Creation</option>
              <option>Social</option>
              <option>Life</option>
            </select>
          </label>
          <label>
            Unit
            <input name="unit" placeholder="mins, sessions, kg..." required />
          </label>
          <label>
            Weekly target
            <input min="0.01" name="weeklyTarget" required step="0.01" type="number" />
          </label>
          <label>
            Overall weight
            <input defaultValue="5" max="10" min="1" name="overallWeight" required type="number" />
          </label>
          <label>
            Type
            <select defaultValue="count" name="mode">
              <option value="count">Activity</option>
              <option value="measurement">Body measurement</option>
            </select>
          </label>
          <button className="primary-button" type="submit">
            Create tracker
          </button>
        </form>
      </section>
      <section className="tracker-grid">
        {trackers.length ? (
          trackers.map((tracker) => (
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
          ))
        ) : (
          <div className="empty-state compact">
            <strong>No trackers yet</strong>
            <p>The form above creates your first real tracker in Supabase.</p>
          </div>
        )}
      </section>
    </AppShell>
  );
}
