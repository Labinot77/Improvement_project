"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, AlertTriangle, type LucideIcon } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;

  title?: string;
  description?: string;
  itemName?: string;
  confirmLabel?: string;
  cancelLabel?: string;

  /**
   * Controls the confirm button's color treatment and the default icon.
   * "destructive" = red (delete/remove-style actions)
   * "default" = indigo (replace/confirm/neutral actions)
   */
  variant?: "destructive" | "default";

  /** Icon shown in the header badge. Defaults to AlertTriangle (destructive) or the same AlertTriangle (default) if not provided. */
  icon?: LucideIcon;

  /** Icon shown inside the confirm button, next to confirmLabel. Defaults to Trash2 for destructive, hidden for default unless provided. */
  confirmIcon?: LucideIcon;

  /** Loading label shown on the confirm button while onConfirm is pending. Defaults to `${confirmLabel}…`. */
  loadingLabel?: string;
}

/**
 * CONTENT ONLY — no Dialog/Drawer wrapper here anymore.
 * ModalProvider wraps this in <ResponsiveModal>, which renders it inside
 * a Dialog on desktop and a Drawer on mobile automatically.
 *
 * Generic confirmation modal — use for delete, replace, discard, or any
 * "are you sure?" action. Customize icon, copy, labels, and color via props
 * rather than creating a new modal per action.
 *
 * Examples:
 *   open("confirm", { title: "Delete item", itemName: "Recipe", onConfirm })
 *   open("confirm", {
 *     title: "Replace journal entry",
 *     description: "This will overwrite your current entry.",
 *     confirmLabel: "Replace",
 *     variant: "default",
 *     icon: FileTextIcon,
 *     onConfirm,
 *   })
 */
export function ConfirmModal({
  onOpenChange,
  onConfirm,
  title = "Are you sure?",
  description,
  itemName,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "destructive",
  icon,
  confirmIcon,
  loadingLabel,
}: Props) {
  const [loading, setLoading] = useState(false);
  const destructive = variant === "destructive";

  const HeaderIcon = icon ?? AlertTriangle;
  const ConfirmIcon = confirmIcon ?? (destructive ? Trash2 : undefined);

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
        <span
          className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${
            destructive ? "bg-red-500/10" : "bg-indigo-500/10"
          }`}
        >
          <HeaderIcon className={`size-4 ${destructive ? "text-red-400" : "text-indigo-400"}`} />
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
          {!loading && ConfirmIcon && <ConfirmIcon className="size-4" />}
          {loading ? loadingLabel ?? `${confirmLabel}…` : confirmLabel}
        </motion.button>
      </div>
    </div>
  );
}