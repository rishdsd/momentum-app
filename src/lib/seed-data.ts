import type { JournalEntry, LogEntry, SmartSet, Tracker } from "@/types/domain";

export const trackers: Tracker[] = [
  { id: "exercise", name: "Exercise", category: "Body", unit: "mins", weeklyTarget: 240, weight: 8 },
  { id: "gym", name: "Gym", category: "Body", unit: "sessions", weeklyTarget: 4, weight: 8 },
  { id: "boxing", name: "Boxing", category: "Body", unit: "mins", weeklyTarget: 120, weight: 7 },
  { id: "office", name: "Office deep work", category: "Work", unit: "hrs", weeklyTarget: 32, weight: 9 },
  { id: "project", name: "Personal project", category: "Creation", unit: "hrs", weeklyTarget: 10, weight: 9 },
  { id: "x-growth", name: "X profile growth", category: "Social", unit: "actions", weeklyTarget: 25, weight: 5 },
  { id: "cooking", name: "Cooking", category: "Life", unit: "meals", weeklyTarget: 7, weight: 4 },
  { id: "weight", name: "Body weight", category: "Body", unit: "kg", weeklyTarget: 1, weight: 3, mode: "measurement" },
  { id: "muscle", name: "Muscle mass", category: "Body", unit: "kg", weeklyTarget: 1, weight: 4, mode: "measurement" },
];

export const smartSets: SmartSet[] = [
  {
    id: "training-day",
    name: "Training day",
    description: "Movement, skill work, and body metrics.",
    items: [
      { trackerId: "gym", amount: 1 },
      { trackerId: "boxing", amount: 45 },
      { trackerId: "exercise", amount: 30 },
    ],
  },
  {
    id: "deep-work-day",
    name: "Deep work day",
    description: "Professional work plus personal project momentum.",
    items: [
      { trackerId: "office", amount: 6.5 },
      { trackerId: "project", amount: 1.5 },
      { trackerId: "x-growth", amount: 3 },
    ],
  },
  {
    id: "recovery-day",
    name: "Recovery day",
    description: "Low-friction life maintenance.",
    items: [
      { trackerId: "cooking", amount: 1 },
      { trackerId: "exercise", amount: 20 },
    ],
  },
];

export const journalPrompts = {
  daily: ["What's my #1 focus today?", "How am I showing up physically?", "What would make today great?"],
  weekly: ["What will move my goals forward?", "What might drain me?", "What am I proud of already?"],
  monthly: ["What's the theme this month?", "What habit am I building?", "What am I letting go of?"],
  yearly: ["Who am I becoming?", "What do I want to build?", "What does success look like?"],
};

export const journalEntries: JournalEntry[] = [
  {
    id: "yearly-2026",
    period: "yearly",
    key: "2026",
    mood: 4,
    energy: 4,
    answers: {
      "Who am I becoming?": "A stronger, calmer builder.",
      "What do I want to build?": "A body of work I can point to with pride.",
      "What does success look like?": "Consistent health, focused creation, and visible growth.",
    },
    createdAt: "2026-01-01T00:00:00.000Z",
  },
];

export function createSeedLogs() {
  const today = new Date();
  const logs: LogEntry[] = [];
  for (let daysAgo = 0; daysAgo < 42; daysAgo += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);
    const dateKey = date.toISOString().slice(0, 10);
    trackers.forEach((tracker, index) => {
      if (tracker.mode === "measurement") {
        if (daysAgo % 7 === 0) {
          logs.push({
            id: `${tracker.id}-${dateKey}`,
            trackerId: tracker.id,
            amount: tracker.id === "weight" ? 77.8 - daysAgo * 0.025 : 34.2 - daysAgo * 0.01,
            mood: 3 + ((daysAgo + index) % 3),
            energy: 3 + (daysAgo % 2),
            date: dateKey,
          });
        }
        return;
      }
      if ((daysAgo + index) % 7 < 4) {
        logs.push({
          id: `${tracker.id}-${dateKey}`,
          trackerId: tracker.id,
          amount: Number(((tracker.weeklyTarget / 5.2) * (0.7 + (index % 3) * 0.12)).toFixed(1)),
          mood: 2 + ((daysAgo + index) % 4),
          energy: 2 + ((daysAgo + index + 1) % 4),
          date: dateKey,
        });
      }
    });
  }
  return logs;
}
