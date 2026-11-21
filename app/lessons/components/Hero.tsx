import { getLessonStats } from "../store/main";
import { LessonsHeader } from "./LessonsHeader";
import { ReflectionPrompt } from "./ReflectionPrompt";

// Header + reflection prompt with totals (not re-fetched on page changes)
export async function LessonsHero() {
  const { total, categoryCount } = await getLessonStats();
  return (
    <>
      <LessonsHeader />
      <ReflectionPrompt totalLessons={total} categoryCount={categoryCount} />
    </>
  );
}
