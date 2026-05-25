import { AppShell } from "@/components/app-shell";
import { getAppData } from "@/lib/app-data";

export default async function JournalPage() {
  const { journalEntries, journalPrompts } = await getAppData();

  return (
    <AppShell>
      <header className="topbar">
        <div>
          <p className="eyebrow">Reflection system</p>
          <h1>Journal</h1>
        </div>
      </header>

      <section className="journal-grid">
        {Object.entries(journalPrompts).map(([period, prompts]) => {
          const entry = journalEntries.find((item) => item.period === period);
          return (
            <article className="journal-card" key={period}>
              <header>
                <span className="eyebrow">{period}</span>
                <strong>{entry ? "Active" : "Not set"}</strong>
              </header>
              <div className="form-stack">
                {prompts.map((prompt) => (
                  <label key={prompt}>
                    {prompt}
                    <textarea defaultValue={entry?.answers[prompt] ?? ""} rows={3} />
                  </label>
                ))}
              </div>
              <button className="ghost-button" type="button">
                Save {period}
              </button>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}
