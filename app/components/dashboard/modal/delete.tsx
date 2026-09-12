"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle } from "lucide-react";

// TODO: Make the component reusable, from Delete to just a confirmation modal, with customizable icon, title, description, and buttons.

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;

  title?: string;
  description?: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
}

/**
 * CONTENT ONLY — no Dialog/Drawer wrapper here anymore.
 * ModalProvider wraps this in <ResponsiveModal>, which renders it inside
 * a Dialog on desktop and a Drawer on mobile automatically.
 */
export function DeleteModal({
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
    try {
      setLoading(true);
      await onConfirm();
      
      setLoading(false);
      onOpenChange(false);
    } catch (error) {
      setLoading(false);
    }
  }

  const resolvedDescription =
    description ??
    (itemName
      ? `Are you sure you want to delete ${itemName}? This action cannot be undone.`
      : "Are you sure? This action cannot be undone.");

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
          <AlertTriangle className="size-4 text-red-400" />
        </span>
        <h2 className="text-base font-semibold text-zinc-100">{title}</h2>
      </div>

      <p className="text-sm text-zinc-500">{resolvedDescription}</p>

      <div className="flex gap-2">
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
    </div>
  );
}