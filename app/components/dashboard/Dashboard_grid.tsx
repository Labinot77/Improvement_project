"use client"

import { cards } from "@/constants/main";
import DashboardCard from "./Dashboard_card";
import { motion } from "framer-motion";

export default function DashboardGrid() {
  return (
    <motion.div
      className="grid gap-3"
      style={{
        gridTemplateColumns: "5fr 3fr 3fr",
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