"use client";

export function LessonSkeleton() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#111111] p-3 animate-pulse">
      <div className="flex items-center justify-between mb-2">
        <div className="h-3 w-24 rounded bg-white/[0.06]" />
        <div className="h-3 w-14 rounded bg-white/[0.06]" />
      </div>
      <div className="h-3 w-3/4 rounded bg-white/[0.06] mb-2" />
      <div className="h-2.5 w-full rounded bg-white/[0.05] mb-1.5" />
      <div className="h-2.5 w-2/3 rounded bg-white/[0.05]" />
    </div>
  );
}