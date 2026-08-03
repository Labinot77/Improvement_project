"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;

  // Customization
  title?: string;
  description?: string;
  itemName?: string;       // e.g. "this lesson" or "Deadlift session"
  confirmLabel?: string;   // defaults to "Delete"
  cancelLabel?: string;    // defaults to "Cancel"
  destructive?: boolean;   // defaults to true — red confirm button
}

export function DeleteModal({
  open,
  onOpenChange,
  onConfirm,
  title = "Delete item",
  description,
  itemName,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  destructive = true,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    onOpenChange(false);
  }

  const resolvedDescription =
    description ??
    (itemName
      ? `Are you sure you want to delete ${itemName}? This action cannot be undone.`
      : "Are you sure? This action cannot be undone.");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl">
        <DialogHeader>
          {/* Icon */}
          <div className="flex size-10 items-center justify-center rounded-xl bg-red-500/10 mb-3">
            <AlertTriangle className="size-5 text-red-400" />
          </div>

          <DialogTitle className="text-base font-semibold text-zinc-100">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 mt-1">
            {resolvedDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2 mt-4">
          {/* Cancel */}
          <button
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="flex-1 rounded-xl border border-white/[0.08] bg-transparent py-2.5 text-sm
              font-medium text-zinc-400 hover:text-zinc-100 hover:border-white/[0.14]
              transition-all disabled:opacity-50"
          >
            {cancelLabel}
          </button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirm}
            disabled={loading}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5
              text-sm font-semibold transition-all disabled:opacity-50"
            style={
              destructive
                ? {
                    background: "rgba(239,68,68,0.15)",
                    border: "1px solid rgba(239,68,68,0.3)",
                    color: "#f87171",
                  }
                : {
                    background: "rgba(99,102,241,0.15)",
                    border: "1px solid rgba(99,102,241,0.3)",
                    color: "#818cf8",
                  }
            }
          >
            {!loading && <Trash2 className="size-4" />}
            {loading ? "Deleting…" : confirmLabel}
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
}