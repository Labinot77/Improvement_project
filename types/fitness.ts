export type ActivityType =
  | "Martial Arts"
  | "Gym"
  | "Running"
  | "Cycling"
  | "Swimming"
  | "Yoga"
  | "Other";

export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

export interface Activity {
  id: string;
  date: string;           // "YYYY-MM-DD"
  type: ActivityType;
  durationMins: number;
  intensity: IntensityLevel;
  notes: string;
  createdAt: string;
}
// Fields the log form sends to the server
export type ActivityFormValues = Omit<Activity, "id" | "createdAt">;
