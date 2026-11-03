// import { JournalEditor } from "./components/Editor";
// import { getTodosData } from "@/lib/progress/getTodos";

// export default async function JournalCard() {
//     const {
//     dateKey,
//     journal,
//     error,
//   } = await getTodosData();

//     if (error) {
//     return <p className="text-red-400">Failed to load progress data.</p>;
//   }
//   return (
//     <section className={`p-6`}>
//       <div className="flex items-start justify-between gap-4">
//       </div>

//       <JournalEditor date={dateKey} initial={journal} />
//     </section>
//   );
// }

import { JournalEditor } from "./components/Editor";
import { DateNav } from "./components/DateNav";
import { getTodosData } from "@/lib/progress/getTodos";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export default async function JournalCard({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const { dateKey: today, journal,  error: todayError } = await getTodosData();

  if (todayError) {
    return <p className="text-red-400">Failed to load progress data.</p>;
  }

  // Fall back to today for bad or future dates.
  const selected = date && DATE_RE.test(date) && date <= today ? date : today;

  // if (error) {
  //   return <p className="text-red-400">Failed to load journal entry.</p>;
  // }

  const heading = new Date(`${selected}T00:00:00Z`).toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    },
  );

  return (
    <section className="p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            {selected === today ? "Today" : "Past entry"}
          </p>
          <h2 className="mt-1 text-xl font-semibold text-zinc-100">
            {heading}
          </h2>
        </div>

        <DateNav selected={selected} today={today} />
      </div>

      {/* key remounts the editor so state resets per date */}
      <JournalEditor key={selected} date={selected} initial={journal} />
    </section>
  );
}