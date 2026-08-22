// ! On phone use carrousel for templates, on desktop use grid with 2 columns. On desktop, the create form should be fixed width and the list of templates should take up the rest of the space. On mobile, the create form should be at the top and the list of templates should be below it. The modal should be scrollable if there are too many templates to fit on the screen.

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
import type { ProgressTemplate } from "@/types/Progress/progress";
import { useProgressTemplates } from "@/lib/progress/use_templates";
import { inputClass } from "@/constants/misc";
import { useModal } from "@/providers/Modalprovider";
import TemplateSkeleton from "./components/Skeleton";


type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyTemplate: (template: ProgressTemplate) => void;
};

export function TemplateModal({ open, onOpenChange, onApplyTemplate }: Props) {
  const { templates, addTemplate, removeTemplate, loading } = useProgressTemplates();
  const { open: openModal } = useModal();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isReady = useMemo(() => title.trim().length > 0, [title]);

  function handleCreate() {
    if (!title.trim()) return;

    addTemplate({ title: title.trim(), description: description.trim()});
    setTitle("");
    setDescription("");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex flex-col border-white/[0.08] bg-[#0f0f0f] p-0 shadow-2xl
          w-[calc(100vw-1.5rem)] sm:w-[calc(100vw-3rem)]
          max-w-[calc(100vw-1.5rem)] sm:max-w-2xl lg:max-w-4xl
          h-[calc(100dvh-3rem)] sm:h-auto sm:max-h-[85dvh]"
      >
        <div className="flex flex-1 flex-col overflow-hidden p-4 sm:p-6">
          <DialogHeader className="mb-4 shrink-0">
            <DialogTitle className="text-lg font-semibold text-zinc-100 sm:text-xl">
              Progress templates
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500">
              Save recurring tasks as shortcuts and add them instantly to any day.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-1 flex-col gap-4 overflow-hidden lg:flex-row">
            <div className="shrink-0 rounded-2xl border border-white/[0.08] bg-[#121212] p-4 lg:w-72">
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
                  rows={7}
                  className={`${inputClass} resize-none`}
                />
                <DefaultButton
                  onClick={handleCreate}
                  disabled={!isReady}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all disabled:opacity-30 "
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

            <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#121212] p-4">
              <div className="flex items-center justify-between shrink-0">
                <p className="text-sm font-semibold text-zinc-100">Your shortcuts</p>
                <span className="text-xs text-zinc-500">{templates.length}/12</span>
              </div>

              <div className="mt-3 flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
                {loading ? (
                  <>
                  <TemplateSkeleton/>
                  <TemplateSkeleton/>
                  <TemplateSkeleton/>
                  </>
                ) : templates.length === 0 ? (
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
                          className="flex-1 justify-start text-left"
                          onClick={() => {
                            onApplyTemplate(template)
                            onOpenChange(false)
                          }}
                        >
                          <p className="text-sm font-medium text-zinc-100">{template.title}</p>
                          {template.description ?? (
                            <p className="mt-1 text-xs text-zinc-500">{template.description}</p>
                          )}
                        </button>
                        <DefaultButton
                          variant="ghost"
                          onClick={() => openModal('delete', {
                            title: "Delete shortcut",
                            description: `Are you sure you want to delete "${template.title}"? This action cannot be undone.`,
                            itemName: `"${template.title}"`,
                            onConfirm: () => removeTemplate(template.id),
                          })}
                          className="text-zinc-500 transition-colors  hover:text-red-400"
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
        </div>
      </DialogContent>
    </Dialog>
  );
}