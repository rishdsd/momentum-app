import type { LogEntry, Tracker } from "@/types/domain";

export function trackerTotals(trackers: Tracker[], logs: LogEntry[], days = 7) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - (days - 1));
  cutoff.setHours(0, 0, 0, 0);
  const scopedLogs = logs.filter((log) => new Date(`${log.date}T00:00:00`) >= cutoff);

  return trackers.map((tracker) => {
    const trackerLogs = scopedLogs.filter((log) => log.trackerId === tracker.id);
    const rawTotal = trackerLogs.reduce((sum, log) => sum + log.amount, 0);
    const target = tracker.weeklyTarget * (days / 7);
    const score =
      tracker.mode === "measurement" ? (trackerLogs.length ? 100 : 0) : Math.min(100, (rawTotal / target) * 100);
    return {
      ...tracker,
      rawTotal,
      target,
      score,
      avgMood: average(trackerLogs.map((log) => log.mood)),
    };
  });
}

export function overallScore(totals: Array<{ score: number; weight: number }>) {
  const weighted = totals.reduce(
    (acc, tracker) => {
      acc.score += tracker.score * tracker.weight;
      acc.weight += tracker.weight;
      return acc;
    },
    { score: 0, weight: 0 },
  );
  return weighted.weight ? Math.round(weighted.score / weighted.weight) : 0;
}

export function average(values: number[]) {
  const clean = values.filter(Boolean);
  return clean.length ? clean.reduce((sum, value) => sum + value, 0) / clean.length : 0;
}
