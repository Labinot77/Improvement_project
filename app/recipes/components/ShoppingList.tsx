"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useShoppingList } from "@/lib/recipies/shopping";
import { Input } from "@/components/ui/input";
import DefaultButton from "@/app/components/DefaultButton";
import { useModal } from "@/providers/Modalprovider";

const ShoppingList = () => {
  const { items, loading, addItem, toggleItem, removeItem } = useShoppingList();
  const { open: openModal } = useModal();

  const [quickValue, setQuickValue] = useState("");

  const active = items.filter((i) => !i.completed);
  const completed = items.filter((i) => i.completed);
  const ordered = [...active, ...completed];

  function handleQuickAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!quickValue.trim()) return;
    addItem({ name: quickValue });
    setQuickValue("");
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Quick add */}
      <form onSubmit={handleQuickAdd} className="flex gap-2">
        <Input
          value={quickValue}
          onChange={(e) => setQuickValue(e.target.value)}
          placeholder="Add an item…"
          className="flex-1 border border-white/[0.08] px-3 py-2 text-sm text-zinc-100
            placeholder-zinc-600 focus:outline-none focus:border-amber-500/50
            focus:ring-1 focus:ring-amber-500/20 transition-all"
        />
        <DefaultButton
          type="submit"
          disabled={!quickValue.trim()}
          className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10
            px-3 text-amber-500 transition-all hover:bg-amber-500/20 disabled:opacity-30"
        >
          <Plus className="size-4" />
        </DefaultButton>
      </form>

      {/* Items */}
      <div className="flex flex-col gap-2 max-h-76 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-zinc-600 py-6 text-center">Loading…</p>
        ) : ordered.length === 0 ? (
          <p className="text-sm text-zinc-600 py-6 text-center">
            No items yet — add your first one.
          </p>
        ) : (
          <AnimatePresence initial={false} mode="popLayout">
            {ordered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: 25, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 transition-colors ${
                  item.completed
                    ? "border-white/[0.04] bg-[#0f0f0f]/50"
                    : "border-white/[0.06] bg-[#0f0f0f] hover:border-white/[0.10]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => toggleItem(item.id)}
                  className="size-4 shrink-0 accent-amber-500 cursor-pointer"
                />
                <label className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleItem(item.id)}>
                  <p
                    className={`text-sm truncate ${
                      item.completed ? "text-zinc-600 line-through" : "text-zinc-100"
                    }`}
                  >
                    {item.name}
                  </p>
                  {(item.quantity || item.category) && (
                    <p
                      className={`text-xs truncate ${
                        item.completed ? "text-zinc-700 line-through" : "text-zinc-600"
                      }`}
                    >
                      {[item.quantity, item.category].filter(Boolean).join(" · ")}
                    </p>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() =>
                    openModal("delete", {
                      title: "Delete item",
                      description: `Remove "${item.name}" from your shopping list?`,
                      itemName: `"${item.name}"`,
                      onConfirm: () => removeItem(item.id),
                    })
                  }
                  className="shrink-0 text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="size-3.5" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default ShoppingList;