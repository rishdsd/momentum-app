import { AppShell } from "@/components/app-shell";
import { seedAccount, signOut } from "@/app/actions";

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
            <h2>Account setup</h2>
          </div>
        </div>
        <p className="muted-copy">
          After the SQL migration is created in Supabase, sign in and seed your account. This adds your starter trackers,
          smart sets, and journal prompts under your user id.
        </p>
        <div className="settings-actions">
          <form action={seedAccount}>
            <button className="primary-button" type="submit">
              Seed my account
            </button>
          </form>
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
