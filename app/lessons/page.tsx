"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useLessons } from "@/lib/use_lessons";
import { LessonForm } from "./components/Form";
import { LessonList } from "./components/List";
import PageHeader from "@/app/components/header/Header";
import SectionCard from "@/app/components/SectionCard";
import { ACCENT } from "@/constants/mental";
import { formatDate } from "@/lib/mics/date";
import { CalendarView } from "./components/Calendar";
import { container, fadeIn, fadeUp } from "@/constants/animations";

export default function LessonsClient() {
  const { lessons, addLesson, updateLesson, deleteLesson, pendingLessonIds, loading } =
    useLessons();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const listExpanded = searchParams.get("expanded") === "1";

  const setListExpanded = useCallback(
    (expanded: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (expanded) {
        params.set("expanded", "1");
      } else {
        params.delete("expanded");
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  const dateKey = formatDate(selectedDate);
  const selectedLabel = selectedDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <PageHeader
            emoji="📖"
            title="Lessons"
            subtitle="Mistakes, insights & growth"
            backHref="/"
          />
        </motion.div>

        <motion.div
          className="flex flex-col gap-5"
          initial="hidden"
          animate="show"
          variants={container}
        >
          {/* Main grid — layout animates the reflow when columns change */}
          <motion.div layout className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            <AnimatePresence initial={false} mode="popLayout">
              {!listExpanded && (
                <motion.div
                  key="calendar"
                  layout
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="lg:col-span-3"
                >
                  <CalendarView
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    lessons={lessons}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              layout
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className={
                listExpanded
                  ? "lg:col-span-12 flex flex-col gap-5"
                  : "lg:col-span-9 flex flex-col gap-5"
              }
            >
              <AnimatePresence initial={false} mode="popLayout">
                {!listExpanded && (
                  <motion.div
                    key="new-lesson"
                    layout
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                  >
                    <SectionCard
                      title="New lesson"
                      subtitle={selectedLabel}
                      accentGlow={ACCENT}
                    >
                      <LessonForm selectedDate={dateKey} onSave={addLesson} />
                    </SectionCard>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div layout transition={{ duration: 0.35, ease: "easeInOut" }}>
                <SectionCard
                  subtitle={`${lessons.length} recorded lessons`}
                  accentGlow={ACCENT}
                >
                  <LessonList
                    loading={loading}
                    lessons={lessons}
                    pendingLessonIds={pendingLessonIds}
                    onUpdate={updateLesson}
                    onDelete={deleteLesson}
                    expanded={listExpanded}
                    onExpandedChange={setListExpanded}
                  />
                </SectionCard>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}