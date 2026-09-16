export interface Lesson {
  id: string;
  title: string;
  body: string;
  category: LessonCategory;
  impact: LessonImpact;
  date: string;        // YYYY-MM-DD
  createdAt: string;
}

export type LessonCategory =
  | "All"
  | "Trading"
  | "Life"
  | "Mindset"
  | "Health"
  | "Relationships"
  | "Finance"
  | "Mistake"
  | "Other";

export type LessonImpact = "low" | "medium" | "high";
