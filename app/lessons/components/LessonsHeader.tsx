"use server";

export async function LessonsHeader() {
  return (
    <header
      className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
    >
      <div>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
          Wisdom archive
        </p>

        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          Lessons learned
        </h1>

        <p className="mt-4 text-lg text-muted-foreground">
          Capture the ideas life teaches you, while they are still fresh.
        </p>
      </div>
    </header>
  );
}