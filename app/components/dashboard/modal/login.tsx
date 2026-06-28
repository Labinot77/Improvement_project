"use client";

import { useState } from "react";
import { GitBranch, Goal, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const supabase = createClient();

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginModal({ open, onOpenChange }: Props) {
  const [loading, setLoading] = useState<"github" | "google" | null>(null);

  async function signIn(provider: "github" | "google") {
    setLoading(provider);
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10">
              <TrendingUp className="size-4 text-emerald-400" />
            </div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Life Tracker
            </span>
          </div>
          <DialogTitle className="text-lg font-semibold text-zinc-100">
            Sign in to your dashboard
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500">
            Track every dimension of your life — sleep, finance, fitness, and
            progress.
          </DialogDescription>
        </DialogHeader>

        {/* Stats teaser */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Modules", value: "7" },
            { label: "Charts", value: "12+" },
            { label: "Insights", value: "∞" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-white/[0.06] bg-[#131313] px-3 py-2 text-center"
            >
              <p className="text-base font-semibold text-zinc-100">{s.value}</p>
              <p className="text-xs text-zinc-600">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={() => signIn("github")}
            disabled={!!loading}
            className="flex items-center justify-center gap-3 rounded-xl border border-white/[0.08]
              bg-[#161616] px-4 py-5 text-sm font-medium text-zinc-100 transition-all
              hover:bg-[#1c1c1c] hover:border-white/[0.14] disabled:opacity-50"
          >
            {loading === "github" ? (
              <p>Redirecting...</p>
            ) : (
              <>
                <GitBranch className="size-4" />
                <p>Continue with Github</p>
              </>
            )}
          </Button>

          <Button
            onClick={() => signIn("google")}
            disabled={!!loading}
            className="flex items-center justify-center gap-3 rounded-xl border border-white/[0.08]
              bg-[#161616] px-4 py-5 text-sm font-medium text-zinc-100 transition-all
              hover:bg-[#1c1c1c] hover:border-white/[0.14] disabled:opacity-50"
          >
            {loading === "google" ? (
              <p>Redirecting...</p>
            ) : (
              <>
                <Goal className="size-4" />
                Continue with Google
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-xs text-zinc-600">
          Your data is private and only visible to you.
        </p>
      </DialogContent>
    </Dialog>
  );
}
