"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, SparklesIcon, Trash2Icon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DefaultButton from "@/app/components/DefaultButton";
import { useProgressTemplates } from "@/lib/progress/use_templates";
import { inputClass } from "@/constants/misc";
import { useModal } from "@/providers/Modalprovider";
import TemplateSkeleton from "./components/Skeleton";
import { ProgressTemplate } from "@/types/Progress/templates";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyTemplate: (template: ProgressTemplate) => void;
};

/**
 * CONTENT ONLY — no Dialog/Drawer wrapper. ModalProvider wraps this in
 * <ResponsiveModal>, which handles Dialog-on-desktop / Drawer-on-mobile.
 *
 * Layout: saved templates list first (the common case — applying a
 * template to today), with a "+" that reveals the create form inline.
 * Same structure on both desktop and mobile, so there's one layout to
 * maintain rather than two divergent ones.
 */
export function TemplateModal({ onOpenChange, onApplyTemplate }: Props) {
  const { templates, addTemplate, removeTemplate, loading } = useProgressTemplates();
  const { open: openModal } = useModal();

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isReady = useMemo(() => title.trim().length > 0, [title]);

  function handleCreate() {
    if (!title.trim()) return;
    addTemplate({ title: title.trim(), description: description.trim() });
    setTitle("");
    setDescription("");
    setCreating(false);
  }

  return (
    <div className="flex flex-col gap-4 max-h-[75dvh] sm:max-h-[70vh]">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-base font-semibold text-zinc-100 sm:text-lg">
            Progress templates
          </h2>
          <p className="text-xs text-zinc-500 mt-0.5">
            {creating
              ? "Save a recurring task as a shortcut"
              : "Add a saved shortcut to today, or create a new one"}
          </p>
        </div>

        {!creating && (
          <DefaultButton
            onClick={() => setCreating(true)}
            className="flex items-center gap-1.5 rounded-xl border border-indigo-400/30 bg-indigo-400/10 px-3 py-2 text-xs font-semibold text-indigo-400 hover:bg-indigo-400/20 shrink-0"
          >
            <Plus className="size-3.5" />
            New
          </DefaultButton>
        )}
      </div>

      <AnimatePresence initial={false}>
        {creating && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden shrink-0"
          >
            <div className="rounded-2xl border border-white/[0.08] bg-[#121212] p-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                  <SparklesIcon className="size-4 text-indigo-400" />
                  New shortcut
                </div>
                <button
                  onClick={() => {
                    setCreating(false);
                    setTitle("");
                    setDescription("");
                  }}
                  className="rounded-lg p-1 text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.06] transition-colors"
                >
                  <X className="size-3.5" />
                </button>
              </div>

              <Input
                placeholder="Shortcut name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                autoFocus
              />
              <Textarea
                placeholder="Optional description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={`${inputClass} resize-none`}
              />
              <DefaultButton
                onClick={handleCreate}
                disabled={!isReady}
                className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-30"
                style={{
                  background: "rgba(99,102,241,0.18)",
                  border: "1px solid rgba(99,102,241,0.28)",
                  color: "#818cf8",
                }}
              >
                <PlusIconInline />
                Save shortcut
              </DefaultButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Saved templates list */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212] p-4 min-h-0">
        <div className="flex items-center justify-between shrink-0">
          <p className="text-sm font-semibold text-zinc-100">Your shortcuts</p>
          <span className="text-xs text-zinc-500">{templates.length}/12</span>
        </div>

        <div className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto pr-1 min-h-0">
          {loading ? (
            <>
              <TemplateSkeleton />
              <TemplateSkeleton />
              <TemplateSkeleton />
            </>
          ) : templates.length === 0 ? (
            <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#0b0b0b] px-3 py-6 text-center text-sm text-zinc-500">
              No templates yet. Tap "New" to save one.
            </div>
          ) : (
            templates.map((template) => (
              <motion.div
                key={template.id}
                layout
                className="rounded-xl border border-white/[0.06] bg-[#161616] p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <button
                    className="flex-1 justify-start text-left"
                    onClick={() => {
                      onApplyTemplate(template);
                      onOpenChange(false);
                    }}
                  >
                    <p className="text-sm font-medium text-zinc-100">{template.title}</p>
                    {template.description && (
                      <p className="mt-1 text-xs text-zinc-500">{template.description}</p>
                    )}
                  </button>
                  <DefaultButton
                    variant="ghost"
                    onClick={() =>
                      openModal("delete", {
                        title: "Delete shortcut",
                        description: `Are you sure you want to delete "${template.title}"? This action cannot be undone.`,
                        itemName: `"${template.title}"`,
                        onConfirm: () => removeTemplate(template.id),
                      })
                    }
                    className="text-zinc-500 transition-colors hover:text-red-400"
                    title="Delete shortcut"
                  >
                    <Trash2Icon className="size-3.5" />
                  </DefaultButton>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Small local alias so the button doesn't re-import Plus with a clashing name above.
function PlusIconInline() {
  return <Plus className="size-4" />;
}