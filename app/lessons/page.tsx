import { LessonsHeader } from "./components/LessonsHeader";
import { ReflectionPrompt } from "./components/ReflectionPrompt";
import { LessonList } from "./components/List";
import { getLessons } from "./store/main";

// Lessons page: reflection prompt and filterable list
export default async function LessonsPage() {
  const { lessons, error } = await getLessons();
  const categoryCount = new Set(lessons.map((l) => l.category)).size;

  return (
    <main className="space-y-6 px-4 py-6 sm:px-8 sm:py-10 lg:px-16">
      <LessonsHeader />
      {error && (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-4 text-red-300">
          Couldn&apos;t load your lessons: {error}
        </p>
      )}
      <ReflectionPrompt totalLessons={lessons.length} categoryCount={categoryCount} />
      <LessonList initialLessons={lessons} />
    </main>
  );
}
