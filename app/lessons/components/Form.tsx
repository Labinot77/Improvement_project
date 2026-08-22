"use client";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import type { Lesson, LessonCategory, LessonImpact } from "@/types/lessons";
import { ALL_CATEGORIES, ALL_IMPACTS, CATEGORY_META, IMPACT_META } from "@/constants/mental";
import { formatDate } from "@/lib/mics/date";
import { useUser } from "@/lib/use_user";
import No_access from "@/app/components/NoAccess";
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import DefaultButton from "@/app/components/DefaultButton";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-[#161616] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 transition-all";

export type LessonFormValues = {
  title: string;
  body: string;
  category: LessonCategory;
  impact: LessonImpact;
  date: string;
};

interface Props {
  initial?: Lesson;
  selectedDate?: string;
  onSave: (values: LessonFormValues) => void;
  onCancel?: () => void;
}

export function LessonForm({ initial, selectedDate, onSave, onCancel }: Props) {
  const [title, setTitle]       = useState(initial?.title ?? "");
  const [body, setBody]         = useState(initial?.body ?? "");
  const [category, setCategory] = useState<LessonCategory>(initial?.category ?? "Life");
  const [impact, setImpact]     = useState<LessonImpact>(initial?.impact ?? "medium");
  const [saved, setSaved]       = useState(false);
  const { isLoggedIn } = useUser();

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title);
    setBody(initial.body);
    setCategory(initial.category);
    setImpact(initial.impact);
  }, [initial?.id]);

  const date = initial?.date ?? selectedDate ?? formatDate(new Date());

  function handleSave() {
    if (!title.trim()) return;
    onSave({ title: title.trim(), body: body.trim(), category, impact, date });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    if (!initial) {
      setTitle(""); setBody(""); setCategory("Life"); setImpact("medium");
    }
  }

  return (
    <div className="relative">
      <div className={!isLoggedIn ? "blur-sm pointer-events-none select-none" : ""}>

        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-5">
            <Input
              type="text"
              placeholder="What did you learn?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSave()}
              className={inputClass}
            />
          </div>

          <div className="col-span-4">
            <Select value={category} onValueChange={(v) => setCategory(v as LessonCategory)}>
              <SelectTrigger className="rounded-xl border border-white/[0.08] bg-[#161616] text-sm text-zinc-100 focus:ring-yellow-500/20 focus:border-yellow-500/50 w-full">
                <SelectValue>
                  <span className="flex items-center gap-2">
                    <span>{CATEGORY_META[category].icon}</span>
                    <span>{category}</span>
                  </span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#161616] text-zinc-100">
                {ALL_CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat} className="focus:bg-white/[0.06] focus:text-zinc-100">
                    <span className="flex items-center gap-2">
                      <span>{CATEGORY_META[cat].icon}</span>
                      <span style={{ color: CATEGORY_META[cat].color }}>{cat}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="col-span-3 flex gap-1">
            {ALL_IMPACTS.map((imp) => (
              <DefaultButton
                key={imp}
                onClick={() => setImpact(imp)}
                className="flex-1 rounded-xl text-xs font-medium transition-all"
                style={{
                  borderColor: impact === imp ? IMPACT_META[imp].color : "rgba(255,255,255,0.06)",
                  background:  impact === imp ? `${IMPACT_META[imp].color}20` : "transparent",
                  color:       impact === imp ? IMPACT_META[imp].color : "#71717a",
                }}
              >
                {IMPACT_META[imp].label}
              </DefaultButton>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-3">
          <Textarea
            placeholder="Describe the lesson, context, what happened…"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            className={`${inputClass} resize-none flex-1`}
          />

          <div className="flex flex-col justify-between gap-2 shrink-0">
            <DefaultButton
              onClick={handleSave}
              disabled={!title.trim()}
              className="h-full transition-all disabled:opacity-30 flex items-center gap-2"
              style={{
                background: saved ? "rgba(34,197,94,0.15)" : "rgba(234,179,8,0.15)",
                border:     `1px solid ${saved ? "rgba(34,197,94,0.3)" : "rgba(234,179,8,0.3)"}`,
                color:      saved ? "#86efac" : "#fbbf24",
              }}
            >
              <Save className="size-4 shrink-0" />
            </DefaultButton>
          </div>
        </div>
      </div>

      {!isLoggedIn && <No_access />}
    </div>
  );
}