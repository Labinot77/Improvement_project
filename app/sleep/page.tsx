import { Moon, Plus } from "lucide-react";
import PageHeader from "@/app/components/PageHeader";
import OpenModalButton from "@/app/components/OpenModalButton";
import { getSleepEntries } from "@/app/sleep/store/main";
import { durationTrend, formatDuration, nightCalendar, sleepStats, weekdayAverages } from "@/app/sleep/data/main";
import { SleepSummary } from "./components/SleepSummary";
import { WindowChart } from "./components/WindowChart";
import { DurationTrend } from "./components/DurationTrend";
import { WeekdayChart } from "./components/WeekdayChart";
import { NightCalendar } from "./components/NightCalendar";

// Sleep page: night-sky window, recovery summary, trends and the night calendar
export default async function SleepPage() {
  const { entries, error } = await getSleepEntries();
  const s = sleepStats(entries);
  const last = s.lastNight;

  return (
    <div className="space-y-8 px-4 py-6 sm:space-y-12 sm:px-8 sm:py-10">
      <PageHeader
        eyebrow="Recovery"
        eyebrowClass="text-[#8b9cf7]"
        title="Sleep"
        subtitle="Consistent nights beat long weekends. Track the rhythm, not just the hours."
        aside={
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#16181b] px-4 py-3">
              <Moon className="size-5 text-[#8b9cf7]" />
              <div>
                <p className="font-medium leading-tight">{last ? formatDuration(last.durationHours) : "No nights yet"}</p>
                <p className="text-sm text-zinc-500">{last ? `${last.bedtime} → ${last.wakeTime}` : "last night"}</p>
              </div>
            </div>
            <OpenModalButton
              modal="sleep_form"
              props={{}}
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#8b9cf7] px-6 font-medium text-[#11131f] transition hover:opacity-90"
            >
              <Plus className="size-5" /> Log night
            </OpenModalButton>
          </div>
        }
      />

      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
          Couldn&apos;t load your nights: {error}
        </p>
      )}

      <WindowChart entries={entries} />
      <SleepSummary s={s} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <DurationTrend rows={durationTrend(entries)} />
        <WeekdayChart rows={weekdayAverages(entries)} />
      </div>

      <NightCalendar cells={nightCalendar(entries)} />
    </div>
  );
}
