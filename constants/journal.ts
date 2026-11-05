import type { JournalEntry, JournalFilter, Mood } from "@/types/journal";

export const MOODS: { value: Mood; label: string; emoji: string; chip: string }[] = [
  { value: "great", label: "Great", emoji: "😄", chip: "bg-emerald-400/15 text-emerald-300" },
  { value: "good", label: "Good", emoji: "🙂", chip: "bg-lime-400/15 text-lime-300" },
  { value: "okay", label: "Okay", emoji: "😐", chip: "bg-zinc-400/15 text-zinc-300" },
  { value: "low", label: "Low", emoji: "😕", chip: "bg-amber-400/15 text-amber-300" },
  { value: "rough", label: "Rough", emoji: "😣", chip: "bg-rose-400/15 text-rose-300" },
];

export const moodOf = (m: Mood) => MOODS.find((x) => x.value === m) ?? MOODS[2];

export const FILTERS: { key: JournalFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "good", label: "Good days" },
  { key: "tough", label: "Tough days" },
];

export const isFilter = (v?: string): v is JournalFilter => FILTERS.some((f) => f.key === v);

export const PROMPTS = [
  "What went well today, and why?",
  "What drained your energy today?",
  "What is one thing you learned today?",
  "What decision today would you make the same way again?",
  "What did you avoid today that you should face tomorrow?",
  "Who or what are you grateful for right now?",
  "What was the hardest moment today, and how did you handle it?",
  "What would make tomorrow a good day?",
  "Where did you waste time today?",
  "What are you proud of this week?",
  "What is on your mind that you haven't said out loud?",
  "What habit helped you most today?",
  "If today repeated, what would you change?",
  "What small win deserves a mention?",
];

// ---------- dates (all local, YYYY-MM-DD) ----------

export const toISO = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export const parseISO = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

export const todayISO = () => toISO(new Date());

export const formatDay = (iso: string, long = false) =>
  parseISO(iso).toLocaleDateString(
    "en-GB",
    long
      ? { weekday: "long", day: "numeric", month: "long", year: "numeric" }
      : { weekday: "short", day: "numeric", month: "short" },
  );

export const weekdayShort = (iso: string) =>
  parseISO(iso).toLocaleDateString("en-GB", { weekday: "short" });

// Monday → Sunday of the current week
export function weekDays() {
  const start = new Date();
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toISO(d);
  });
}

// ---------- prompts ----------

export function promptForDate(iso: string, shift = 0) {
  const [y, m, d] = iso.split("-").map(Number);
  const day = Math.floor(Date.UTC(y, m - 1, d) / 86_400_000);
  const i = (((day + shift) % PROMPTS.length) + PROMPTS.length) % PROMPTS.length;
  return PROMPTS[i];
}

// ---------- stats ----------

export const wordCount = (text: string) => (text.trim() ? text.trim().split(/\s+/).length : 0);

// consecutive days with an entry, ending today (or yesterday if today isn't written yet)
export function streak(dates: string[]) {
  const set = new Set(dates);
  const d = new Date();
  if (!set.has(toISO(d))) d.setDate(d.getDate() - 1);
  let n = 0;
  while (set.has(toISO(d))) {
    n++;
    d.setDate(d.getDate() - 1);
  }
  return n;
}

export function filterEntries(entries: JournalEntry[], filter: JournalFilter) {
  switch (filter) {
    case "week": {
      const days = new Set(weekDays());
      return entries.filter((e) => days.has(e.date));
    }
    case "month": {
      const month = todayISO().slice(0, 7);
      return entries.filter((e) => e.date.startsWith(month));
    }
    case "good":
      return entries.filter((e) => e.mood === "great" || e.mood === "good");
    case "tough":
      return entries.filter((e) => e.mood === "low" || e.mood === "rough");
    default:
      return entries;
  }
}