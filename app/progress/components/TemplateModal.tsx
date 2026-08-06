"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { PlusIcon, SparklesIcon, Trash2Icon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DefaultButton from "@/app/components/DefaultButton";
import type { ProgressTemplate } from "@/types/progress";

const inputClass =
  "w-full rounded-xl border border-white/[0.08] bg-[#161616] px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: ProgressTemplate[];
  onAddTemplate: (template: ProgressTemplate) => void;
  onRemoveTemplate: (templateId: string) => void;
  onApplyTemplate: (template: ProgressTemplate) => void;
};

export function TemplateModal({
  open,
  onOpenChange,
  templates,
  onAddTemplate,
  onRemoveTemplate,
  onApplyTemplate,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isReady = useMemo(() => title.trim().length > 0, [title]);

  function handleCreate() {
    if (!title.trim()) return;

    const template: ProgressTemplate = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: description.trim(),
      createdAt: new Date().toISOString(),
    };

    onAddTemplate(template);
    setTitle("");
    setDescription("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-white/[0.08] bg-[#0f0f0f] p-0 shadow-2xl">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-lg font-semibold text-zinc-100">
              Progress templates
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              Save recurring tasks as shortcuts and add them instantly to any day.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-2xl border border-white/[0.08] bg-[#121212] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-zinc-100">
                <SparklesIcon className="size-4 text-indigo-400" />
                Create a new shortcut
              </div>
              <div className="mt-3 flex flex-col gap-2">
                <Input
                  placeholder="Shortcut name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputClass}
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
                  <PlusIcon className="size-4" />
                  Save shortcut
                </DefaultButton>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#121212] p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-100">Your shortcuts</p>
                <span className="text-xs text-zinc-500">{templates.length}/12</span>
              </div>

              <div className="mt-3 flex max-h-72 flex-col gap-2 overflow-y-auto pr-1">
                {templates.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/[0.08] bg-[#0b0b0b] px-3 py-6 text-center text-sm text-zinc-500">
                    No templates yet. Save one to speed up daily tasks.
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
                          className="flex-1 text-left"
                          onClick={() => onApplyTemplate(template)}
                        >
                          <p className="text-sm font-medium text-zinc-100">{template.title}</p>
                          {template.description ? (
                            <p className="mt-1 text-xs text-zinc-500">{template.description}</p>
                          ) : null}
                        </button>
                        <button
                          onClick={() => onRemoveTemplate(template.id)}
                          className="rounded-lg p-1.5 text-zinc-500 transition-colors hover:bg-white/[0.06] hover:text-red-400"
                          title="Delete shortcut"
                        >
                          <Trash2Icon className="size-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
