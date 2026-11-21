// "Gym" for new sessions; the rest are kept for older entries
export type ActivityType =
  | "Gym"
  | "Martial Arts"
  | "Running"
  | "Cycling"
  | "Swimming"
  | "Yoga"
  | "Other";

export type IntensityLevel = 1 | 2 | 3 | 4 | 5;

// Cardio done inside a gym session
export type CardioType = "Running" | "Cycling" | "Stairs" | "Rowing" | "Elliptical";

export interface WorkoutSet {
  exercise: string;
  setIndex: number;
  reps: number;
  weightKg: number;
}

export interface Activity {
  id: string;
  date: string; // "YYYY-MM-DD"
  type: ActivityType;
  durationMins: number;
  intensity: IntensityLevel;
  notes: string;
  createdAt: string;
  workoutName: string | null;
  cardioType: CardioType | null;
  cardioMins: number | null;
  distanceKm: number | null;
  sets: WorkoutSet[];
}

// One exercise in a program day
export interface TemplateExercise {
  name: string;
  sets: number;
  reps: number;
}

// A named workout in the user's program (Push, Pull, Legs…)
export interface WorkoutTemplate {
  id: string;
  name: string;
  position: number;
  exercises: TemplateExercise[];
}

// What the log-workout form sends
export interface WorkoutInput {
  date: string;
  workoutName: string;
  durationMins: number;
  intensity: IntensityLevel;
  notes: string;
  exercises: { name: string; sets: { reps: number; weightKg: number }[] }[];
  cardio: { type: CardioType; mins: number; distanceKm: number | null } | null;
}
