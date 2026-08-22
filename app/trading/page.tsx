"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "../components/header/Header";
import { container, fadeIn, fadeUp } from "@/constants/animations";
import { MacroScorePanel } from "./components/MacroScorePanel";
import { SignalPanel } from "./components/SignalPanel";
import { useMacroSnapshot } from "@/lib/use_trading";

export default function TradingPage() {
  const [symbol, setSymbol] = useState("GOLD");
  const { data: snapshot, loading } = useMacroSnapshot(symbol);

  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
      <div className="mx-auto max-w-7xl flex flex-col gap-5">
        <motion.div initial="hidden" animate="show" variants={fadeIn}>
          <PageHeader
            emoji="📊"
            title="Trading"
            subtitle="Macro signals & market bias"
            backHref="/"
          />
        </motion.div>

        {loading || !snapshot ? (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
            <div className="lg:col-span-4 h-96 animate-pulse rounded-2xl border border-white/[0.06] bg-[#0f0f0f]" />
            <div className="lg:col-span-8 h-96 animate-pulse rounded-2xl border border-white/[0.06] bg-[#0f0f0f]" />
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start"
            initial="hidden"
            animate="show"
            variants={container}
          >
            <motion.div variants={fadeUp} className="lg:col-span-4">
              <MacroScorePanel
                snapshot={snapshot}
                symbol={symbol}
                onSymbolChange={setSymbol}
              />
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-8">
              <SignalPanel snapshot={snapshot} />
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
}