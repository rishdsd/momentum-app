export type Category = "Body" | "Work" | "Creation" | "Social" | "Life";

export type JournalPeriod = "daily" | "weekly" | "monthly" | "yearly";

export type Tracker = {
  id: string;
  name: string;
  category: Category;
  unit: string;
  weeklyTarget: number;
  weight: number;
  mode?: "measurement" | "count";
};

export type LogEntry = {
  id: string;
  trackerId: string;
  amount: number;
  mood: number;
  energy: number;
  note?: string;
  date: string;
};

export type SmartSet = {
  id: string;
  name: string;
  description: string;
  items: SmartSetItem[];
};

export type SmartSetItem = {
  trackerId: string;
  amount: number;
};

export type JournalEntry = {
  id: string;
  period: JournalPeriod;
  key: string;
  mood?: number;
  energy?: number;
  answers: Record<string, string>;
  createdAt: string;
};
