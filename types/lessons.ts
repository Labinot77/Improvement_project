export type LessonCategory =
  | "Trading"
  | "Life"
  | "Mindset"
  | "Health"
  | "Relationships"
  | "Finance"
  | "Mistake"
  | "Other";

export type LessonImpact = "low" | "medium" | "high";

export interface Lesson {
  id: string;
  title: string;
  body: string;
  category: LessonCategory;
  impact: LessonImpact;
  date: string;        // "YYYY-MM-DD" — when the lesson was learned
  createdAt: string;
}