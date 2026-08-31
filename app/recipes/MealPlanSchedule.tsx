"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ChevronDown, Trash2, ImageIcon } from "lucide-react";
import type { Recipe } from "@/types/Recipies/main";
import { MEAL_META } from "@/constants/recipes";
import { formatCurrency } from "@/lib/mics/helpers";
import { useModal } from "@/providers/Modalprovider";
import DefaultButton from "@/app/components/DefaultButton";
import { MealPlan } from "@/types/Recipies/Plan";

interface Props {
  plan: MealPlan;
  recipesById: Map<string, Recipe>;
  onDelete: () => void;
}

function dayLabel(date: string): { weekday: string; dayNum: string } {
  const d = new Date(date + "T12:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    dayNum: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

export function MealPlanSchedule({ plan, recipesById, onDelete }: Props) {
  const { open } = useModal();
  const [collapsed, setCollapsed] = useState(false);

  const days = useMemo(() => {
    const map = new Map<string, typeof plan.entries>();
    for (const entry of plan.entries) {
      const list = map.get(entry.date) ?? [];
      list.push(entry);
      map.set(entry.date, list);
    }
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, entries]) => ({
        date,
        entries: [...entries].sort((a, b) => a.slotIndex - b.slotIndex),
      }));
  }, [plan.entries]);

  const budgetPct = plan.budget > 0 ? Math.min((plan.totalCost / plan.budget) * 100, 100) : 0;
  const overBudget = plan.totalCost > plan.budget;

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0f0f0f] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-zinc-100">
            Week of{" "}
            {new Date(plan.weekStart + "T12:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span
              className="text-xs font-medium tabular-nums"
              style={{ color: overBudget ? "#f87171" : "#f59e0b" }}
            >
              {formatCurrency(plan.totalCost, plan.currency)}
            </span>
            <span className="text-xs text-zinc-600">
              of {formatCurrency(plan.budget, plan.currency)} budget
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {plan.warnings.length > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-500">
              <AlertTriangle className="size-3" />
              {plan.warnings.length}
            </span>
          )}
          <DefaultButton
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              open("delete", {
                title: "Delete meal plan",
                description: "This will remove the whole week's schedule. This can't be undone.",
                onConfirm: onDelete,
              });
            }}
            className="text-zinc-600 hover:text-red-400"
          >
            <Trash2 className="size-3.5" />
          </DefaultButton>
          <motion.span
            animate={{ rotate: collapsed ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            className="text-zinc-600"
          >
            <ChevronDown className="size-4" />
          </motion.span>
        </div>
      </button>

      {/* Budget bar */}
      <div className="px-4">
        <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${budgetPct}%`,
              background: overBudget ? "#ef4444" : "#f59e0b",
            }}
          />
        </div>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pt-4 pb-4">
              {/* Warnings */}
              {plan.warnings.length > 0 && (
                <div className="mb-4 flex flex-col gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/[0.06] px-3 py-2.5">
                  {plan.warnings.map((w, i) => (
                    <p key={i} className="flex items-start gap-1.5 text-xs text-amber-400">
                      <AlertTriangle className="size-3 shrink-0 mt-0.5" />
                      {w}
                    </p>
                  ))}
                </div>
              )}

              {/* Day grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
                {days.map(({ date, entries }) => {
                  const { weekday, dayNum } = dayLabel(date);
                  return (
                    <div
                      key={date}
                      className="rounded-xl border border-white/[0.06] bg-[#131313] p-3 flex flex-col gap-2 min-w-0"
                    >
                      <div>
                        <p className="text-xs font-semibold text-zinc-200">{weekday}</p>
                        <p className="text-[11px] text-zinc-600">{dayNum}</p>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        {entries.map((entry) => {
                          const recipe = recipesById.get(entry.recipeId);
                          const meta = MEAL_META[entry.mealType];
                          return (
                            <div
                              key={entry.id}
                              className="flex items-center gap-2 rounded-lg bg-white/[0.03] px-2 py-1.5 min-w-0"
                            >
                              <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-white/[0.04] overflow-hidden">
                                {recipe?.imageUrl?.[0] ? (
                                  <img
                                    src={recipe.imageUrl[0]}
                                    alt=""
                                    className="size-full object-cover"
                                  />
                                ) : (
                                  <span className="text-xs">{meta.icon}</span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-zinc-200 truncate">
                                  {recipe?.title ?? "Deleted recipe"}
                                </p>
                                {recipe?.estimatedCost != null && (
                                  <p className="text-[10px] text-zinc-600 tabular-nums">
                                    {formatCurrency(recipe.estimatedCost, recipe.costCurrency)}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}