"use client";

import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { MOCK_SYMBOLS } from "@/lib/use_trading";

interface Props {
  value: string;
  onChange: (symbol: string) => void;
}

export function SymbolSelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="rounded-xl border border-white/[0.08] bg-[#161616] text-sm font-medium text-zinc-100">
        <SelectValue />
      </SelectTrigger>
      <SelectContent className="border-white/[0.08] bg-[#161616] text-zinc-100">
        {MOCK_SYMBOLS.map((s) => (
          <SelectItem key={s} value={s} className="focus:bg-white/[0.06] focus:text-zinc-100">
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
