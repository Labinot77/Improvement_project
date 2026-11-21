import { Moon } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";
import { CARD } from "@/constants/ui";
import { getSleepEntries } from "@/app/sleep/store/main";
import { formatDuration, sleepStats } from "@/app/sleep/data/main";
import { SleepSummary } from "./components/SleepSummary";
import { SleepBoard } from "./components/SleepBoard";

// Sleep page: nightly log, window, debt and regularity
export default async function SleepPage() {
  const { entries, error } = await getSleepEntries();
  const s = sleepStats(entries);
  const last = s.lastNight;

  return (
    <div className="space-y-12 px-4 py-6 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Recovery"
        eyebrowClass="text-[#8b9cf7]"
        title="Sleep"
        subtitle="Consistent nights beat long weekends. Track the rhythm, not just the hours."
        aside={
          <div className={`${CARD} flex items-center gap-4 rounded-2xl bg-gradient-to-br from-[#1b1e33] to-[#16181b] px-5 py-4`}>
            <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#8b9cf7]/10 text-[#8b9cf7]">
              <Moon className="size-6" />
            </span>
            <div>
              <p className="text-xl font-medium leading-tight">{last ? formatDuration(last.durationHours) : "No nights yet"}</p>
              <p className="text-zinc-500">{last ? `${last.bedtime} → ${last.wakeTime}, last logged` : "Log last night below"}</p>
            </div>
          </div>
        }
      />

      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
          Couldn&apos;t load your nights: {error}
        </p>
      )}

      <SleepSummary s={s} />
      <SleepBoard entries={entries} />
    </div>
  );
}
