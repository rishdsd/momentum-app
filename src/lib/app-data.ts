import { createClient } from "@/lib/supabase-server";
import type { JournalEntry, JournalPeriod, LogEntry, SmartSet, Tracker } from "@/types/domain";

type AppData = {
  isAuthenticated: boolean;
  trackers: Tracker[];
  logs: LogEntry[];
  smartSets: SmartSet[];
  journalPrompts: Record<JournalPeriod, string[]>;
  journalEntries: JournalEntry[];
};

export async function getAppData(): Promise<AppData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return getEmptyData(false);

  const [trackersResult, logsResult, smartSetsResult, itemsResult, promptsResult, entriesResult] = await Promise.all([
    supabase.from("trackers").select("*").order("created_at", { ascending: true }),
    supabase.from("logs").select("*").order("logged_on", { ascending: false }),
    supabase.from("smart_sets").select("*").order("created_at", { ascending: true }),
    supabase.from("smart_set_items").select("*"),
    supabase.from("journal_prompts").select("*").order("sort_order", { ascending: true }),
    supabase.from("journal_entries").select("*").order("created_at", { ascending: false }),
  ]);

  if (
    trackersResult.error ||
    logsResult.error ||
    smartSetsResult.error ||
    itemsResult.error ||
    promptsResult.error ||
    entriesResult.error
  ) {
    return getEmptyData(true);
  }

  const trackers = (trackersResult.data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    unit: row.unit,
    weeklyTarget: Number(row.weekly_target),
    weight: Number(row.overall_weight),
    mode: row.mode,
  })) satisfies Tracker[];

  const logs = (logsResult.data ?? []).map((row) => ({
    id: row.id,
    trackerId: row.tracker_id,
    amount: Number(row.amount),
    mood: Number(row.mood ?? 3),
    energy: Number(row.energy ?? 3),
    note: row.note ?? "",
    date: row.logged_on,
  })) satisfies LogEntry[];

  const smartSets = (smartSetsResult.data ?? []).map((set) => ({
    id: set.id,
    name: set.name,
    description: set.description ?? "",
    items: (itemsResult.data ?? [])
      .filter((item) => item.smart_set_id === set.id)
      .map((item) => ({ trackerId: item.tracker_id, amount: Number(item.amount) })),
  })) satisfies SmartSet[];

  const journalPrompts = { daily: [], weekly: [], monthly: [], yearly: [] } as Record<JournalPeriod, string[]>;
  (promptsResult.data ?? []).forEach((row) => {
    journalPrompts[row.period as JournalPeriod].push(row.prompt);
  });

  const journalEntries = (entriesResult.data ?? []).map((row) => ({
    id: row.id,
    period: row.period as JournalPeriod,
    key: row.period_key,
    mood: Number(row.mood ?? 3),
    energy: Number(row.energy ?? 3),
    answers: row.answers ?? {},
    createdAt: row.created_at,
  })) satisfies JournalEntry[];

  return {
    isAuthenticated: true,
    trackers,
    logs,
    smartSets,
    journalPrompts,
    journalEntries,
  };
}

function getEmptyData(isAuthenticated: boolean): AppData {
  return {
    isAuthenticated,
    trackers: [],
    logs: [],
    smartSets: [],
    journalPrompts: { daily: [], weekly: [], monthly: [], yearly: [] },
    journalEntries: [],
  };
}
