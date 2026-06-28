// Calculates hours slept between bedtime and wake time, handles crossing midnight
export function calcDuration(bedtime: string, wakeTime: string): number {
  const [bh, bm] = bedtime.split(":").map(Number);
  const [wh, wm] = wakeTime.split(":").map(Number);

  let bedMins = bh * 60 + bm;
  let wakeMins = wh * 60 + wm;

  // If wake time is earlier than bedtime, it crossed midnight
  if (wakeMins <= bedMins) wakeMins += 24 * 60;

  return Math.round(((wakeMins - bedMins) / 60) * 10) / 10;
}

export function formatDuration(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}