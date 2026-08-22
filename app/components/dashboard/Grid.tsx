"use client";

import { cards } from "@/constants/main";
import DashboardCard from "./Card";
import { motion } from "framer-motion";

export default function DashboardGrid() {
  return (
    <motion.div
      className="grid gap-3 grid-cols-1 lg:grid-cols-[5fr_3fr_3fr]"
      style={{
        gridTemplateRows: "repeat(3, minmax(150px, 1fr))",
      }}
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
        },
      }}
    >
      {cards.map((card, index) => (
        <DashboardCard
          key={index}
          index={index + 1}
          title={card.title}
          subtitle={card.subtitle}
          emoji={card.emoji}
          href={card.href}
          accentGlow={card.accentGlow}
          size={card.size}
          className={card.className}
        />
      ))}
    </motion.div>
  );
}