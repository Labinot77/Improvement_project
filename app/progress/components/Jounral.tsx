"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { FileTextIcon } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function JournalSection({ value, onChange }: Props) {
//   const [showConfirm, setShowConfirm] = useState(false);

//   function applyTemplate() {
//     if (value.trim()) {
//       setShowConfirm(true);
//     } else {
//       onChange(TEMPLATE);
//     }
//   }

//   function confirmApply() {
//     onChange(TEMPLATE);
//     setShowConfirm(false);
//   }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut", delay: 0.35 }}
      className="flex flex-col flex-1 min-h-0 rounded-2xl bg-card border border-border shadow-sm p-4 gap-3"
    >
      <div className="flex items-start justify-between gap-2 shrink-0">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            Daily Journal
          </p>
        </div>

        <div className="relative">
          <Button
            variant="outline"
            size="sm"
            // onClick={applyTemplate}
            className="shrink-0 text-xs h-7 gap-1.5"
          >
            <FileTextIcon className="size-3"/>
            Use template
          </Button>

          {/* <ConfirmPopup
            open={showConfirm}
            title="Replace journal?"
            description="This will replace your current journal entry. Continue?"
            confirmText="Replace"
            onConfirm={confirmApply}
            onClose={() => setShowConfirm(false)}
          /> */}
        </div>
      </div>

      <Textarea
        className="flex-1 min-h-0 resize-none bg-background/60 leading-relaxed text-sm font-mono"
        placeholder="Reflect on your day here."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </motion.div>
  );
}
