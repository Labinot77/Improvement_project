"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import { useUser } from "@/lib/use_user";
import { useModal } from "@/providers/Modalprovider";

export default function DashboardHeader() {
  const { user, isLoggedIn, loading } = useUser();
  const { open } = useModal();

  const username = user?.user_metadata?.user_name as string | undefined;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
        {username ? `${username}'s Dashboard` : "Dashboard"}
      </h1>

      {loading ? (
        <div className="size-9 rounded-full bg-white/[0.06] animate-pulse" />
      ) : isLoggedIn ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => open("profile")}
          className="relative size-9 rounded-full border border-white/[0.10] overflow-hidden
            hover:border-white/[0.20] transition-colors"
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt={username} className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-[#161616]">
              <User className="size-4 text-zinc-400" />
            </div>
          )}
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => open("login")}
          className="rounded-xl border border-white/[0.08] bg-[#161616] px-4 py-1.5
            text-sm font-medium text-zinc-300 transition-all hover:bg-[#1c1c1c]
            hover:border-white/[0.14] hover:text-zinc-100"
        >
          Sign in
        </motion.button>
      )}
    </header>
  );
}