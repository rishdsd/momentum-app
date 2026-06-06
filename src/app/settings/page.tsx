import { AppShell } from "@/components/app-shell";
import { signOut } from "@/app/actions";

export default function SettingsPage() {
  return (
    <AppShell>
      <header className="topbar">
        <div>
          <p className="eyebrow">Setup</p>
          <h1>Settings</h1>
        </div>
      </header>
      <section className="panel">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Supabase</span>
            <h2>Account</h2>
          </div>
        </div>
        <p className="muted-copy">
          Your account starts empty. Trackers, logs, smart sets, and journal entries are stored only when you create them.
        </p>
        <div className="settings-actions">
          <form action={signOut}>
            <button className="ghost-button" type="submit">
              Sign out
            </button>
          </form>
        </div>
      </section>
    </AppShell>
  );
}
