"use client";

import { useState } from "react";
import { LogOut, User, BarChart2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/use_user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const supabase = createClient();

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: Props) {
  const { user } = useUser();
  const [signingOut, setSigningOut] = useState(false);

  const username = user?.user_metadata?.user_name as string | undefined;
  const email = user?.email;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  async function handleSignOut() {
    setSigningOut(true);
    await supabase.auth.signOut({
      scope: "global",
    });
    window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm border-white/[0.08] bg-[#0f0f0f] p-6 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">Profile</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-4">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={username}
              className="size-14 rounded-full border border-white/[0.08]"
            />
          ) : (
            <div className="flex size-14 items-center justify-center rounded-full border border-white/[0.08] bg-[#161616]">
              <User className="size-6 text-zinc-500" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-base font-semibold text-zinc-100 truncate">
              {username ?? "User"}
            </p>
            <p className="text-sm text-zinc-500 truncate">{email}</p>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.06] bg-[#131313] p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart2 className="size-3.5 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              Account
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs text-zinc-600">Provider</p>
              <p className="text-sm font-medium text-zinc-200 capitalize mt-0.5">
                {user?.app_metadata?.provider ?? "—"}
              </p>
            </div>
            <div>
              <p className="text-xs text-zinc-600">Member since</p>
              <p className="text-sm font-medium text-zinc-200 mt-0.5">
                {user?.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "—"}
              </p>
            </div>
          </div>
        </div>

        <Button
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20
            bg-red-500/10 px-4 py-5 text-sm font-medium text-red-400 transition-all
            hover:bg-red-500/20 hover:border-red-500/30 disabled:opacity-50"
        >
          <LogOut className="size-4" />
          {signingOut ? "Signing out…" : "Sign out"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}