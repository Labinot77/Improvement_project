export type Mood = "great" | "good" | "okay" | "low" | "rough";

export type JournalFilter = "all" | "week" | "month" | "good" | "tough";

export type JournalEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  mood: Mood;
  prompt: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type JournalFormValues = Pick<JournalEntry, "date" | "mood" | "prompt" | "content">;