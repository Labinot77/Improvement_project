"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createTask } from "@/app/progress/actions/actions";
import { formatDate, today } from "@/lib/mics/date";
import { capitalizeFirstLetter } from "@/lib/mics/helpers";
import { CATEGORIES, DEFAULT_CATEGORY, DUE_DAYS } from "@/constants/progress/template";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** First day offered in the "Due" dropdown (YYYY-MM-DD). Defaults to today. */
  date?: string;
}

const fieldClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 text-sm text-zinc-100 placeholder-zinc-600 transition-colors focus:border-white/25 focus:outline-none focus:ring-2 focus:ring-white/10";
const triggerClass =
  "h-11 w-full rounded-2xl border-white/10 bg-white/[0.04] px-4 text-sm text-zinc-100 data-[size=default]:h-11";
const labelClass = "mb-2 block text-xs font-medium text-zinc-500";

// Today + the next few days, keyed by YYYY-MM-DD
function dueOptions(base: string) {
  return Array.from({ length: DUE_DAYS }, (_, i) => {
    const d = new Date(`${base}T12:00:00`);
    d.setDate(d.getDate() + i);
    const label =
      i === 0
        ? "Today"
        : i === 1
          ? "Tomorrow"
          : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    return { value: formatDate(d), label };
  });
}

export function TaskModal({ onOpenChange, date }: Props) {
  // Only trust a YYYY-MM-DD string; anything else falls back to today
  const base = date && /^\d{4}-\d{2}-\d{2}$/.test(date) ? date : today();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORY);
  const [due, setDue] = useState(base);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const options = dueOptions(base);

  function save() {
    const clean = title.trim();
    if (!clean || pending) return;
    setError(null);

    startTransition(async () => {
      try {
        await createTask({
          date: due,
          title: capitalizeFirstLetter(clean),
          description,
          category,
        });
        onOpenChange(false);
      } catch {
        setError("Couldn't save the task. Please try again.");
      }
    });
  }

  return (
    <div className="relative overflow-hidden">
      {/* Green glow */}
      <div className="pointer-events-none absolute -right-16 -top-20 size-44 rounded-full bg-[#55c487]/15 blur-3xl" />

      {/* Header (pr-16 leaves room for the shell's close button) */}
      <div className="relative flex items-center gap-3 border-b border-white/[0.07] p-5 pr-16">
        <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#55c487]/10 text-[#72d9a0]">
          <Plus className="size-4" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">New task</h2>
          <p className="mt-0.5 text-xs text-white/40">
            Add the details now—you can always refine them later.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="relative space-y-4 p-6">
        <div>
          <label htmlFor="task-title" className={labelClass}>
            Task
          </label>
          <input
            id="task-title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && save()}
            placeholder="What needs doing?"
            className={`${fieldClass} h-11`}
          />
        </div>

        <div>
          <label htmlFor="task-description" className={labelClass}>
            Description <span className="text-zinc-600">(optional)</span>
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Add any notes or context…"
            className={`${fieldClass} resize-none py-3`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="task-category" className={labelClass}>
              Category
            </label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="task-category" className={triggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#1d1e24] text-zinc-100">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="task-due" className={labelClass}>
              Due
            </label>
            <Select value={due} onValueChange={setDue}>
              <SelectTrigger id="task-due" className={triggerClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="border-white/10 bg-[#1d1e24] text-zinc-100">
                {options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-2">
          {error && (
            <p role="alert" className="mr-auto text-sm text-red-400">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={save}
            disabled={!title.trim() || pending}
            className="h-10 rounded-full bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
          >
            {pending ? "Saving…" : "Save task"}
          </button>
        </div>
      </div>
    </div>
  );
}