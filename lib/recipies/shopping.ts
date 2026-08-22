"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ShoppingItem } from "@/types/Recipies/shopping";

const supabase = createClient();

export type ShoppingItemInput = {
  name: string;
  quantity?: string;
  category?: string;
};

function toItem(r: any): ShoppingItem {
  return {
    id: r.id,
    name: r.name,
    quantity: r.quantity ?? "",
    category: r.category ?? "",
    completed: r.completed,
    createdAt: r.created_at,
  };
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    const { data, error } = await supabase
      .from("shopping_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setItems(data.map(toItem));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const addItem = useCallback(async (input: ShoppingItemInput) => {
    if (!input.name.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const tempId = crypto.randomUUID();
    const optimistic: ShoppingItem = {
      id: tempId,
      name: input.name.trim(),
      quantity: input.quantity?.trim() ?? "",
      category: input.category?.trim() ?? "",
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setItems((prev) => [optimistic, ...prev]);

    const { data, error } = await supabase
      .from("shopping_items")
      .insert({
        user_id: user.id,
        name: optimistic.name,
        quantity: optimistic.quantity,
        category: optimistic.category,
      })
      .select()
      .single();

    if (error || !data) {
      setItems((prev) => prev.filter((i) => i.id !== tempId));
      return;
    }

    setItems((prev) =>
      prev.map((i) => (i.id === tempId ? { ...i, id: data.id, createdAt: data.created_at } : i))
    );
  }, []);

  const toggleItem = useCallback(async (id: string) => {
    let nextCompleted = false;

    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        nextCompleted = !i.completed;
        return { ...i, completed: nextCompleted };
      })
    );

    const { error } = await supabase
      .from("shopping_items")
      .update({ completed: nextCompleted })
      .eq("id", id);

    if (error) {
      // revert on failure
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, completed: !nextCompleted } : i))
      );
    }
  }, []);

  const removeItem = useCallback(async (id: string) => {
    let removed: ShoppingItem | undefined;
    let originalIndex = -1;

    setItems((prev) => {
      originalIndex = prev.findIndex((i) => i.id === id);
      removed = prev[originalIndex];
      return prev.filter((i) => i.id !== id);
    });

    const { error } = await supabase.from("shopping_items").delete().eq("id", id);
    if (error) {
      setItems((prev) => {
        if (!removed) return prev;
        const restored = [...prev];
        restored.splice(originalIndex, 0, removed);
        return restored;
      });
      console.error("Failed to delete shopping item:", error);
    }
  }, []);

  return { items, loading, addItem, toggleItem, removeItem };
}