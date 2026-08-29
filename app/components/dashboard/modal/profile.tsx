"use client";

import { useState } from "react";
import { LogOut, User, BarChart2, Eye, EyeOff, Key } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/use_user";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DefaultButton from "../../DefaultButton";

// TODO: Users are able to add their API key for GEMINI, to as of current get up-to-date prices on food from recipies tile.


const supabase = createClient();

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProfileModal({ open, onOpenChange }: Props) {
  const { user } = useUser();
  const [signingOut, setSigningOut] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [savingKey, setSavingKey] = useState(false);

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

  async function handleSaveApiKey() {
    setSavingKey(true);
    try {
      // await supabase.from("profiles").update({ api_key: apiKey }).eq("id", user?.id);
    } finally {
      setSavingKey(false);
    }
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

        <div className="rounded-xl border border-white/[0.06] bg-[#131313] p-4">
          <div className="flex items-center gap-2 mb-3">
            <Key className="size-3.5 text-zinc-500" />
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">
              API Key
            </span>
          </div>

          <div className="relative">
            <Input
              type={showApiKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
              spellCheck={false}
              className="border-white/[0.08] bg-[#0f0f0f] pr-10 text-sm text-zinc-200 placeholder:text-zinc-600"
            />
            <button
              type="button"
              onClick={() => setShowApiKey((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              tabIndex={-1}
            >
              {showApiKey ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>

          <DefaultButton
            onClick={handleSaveApiKey}
            disabled={savingKey || !apiKey.trim()}
            className="mt-3 w-full rounded-lg bg-white/[0.06] py-4 text-sm font-medium text-zinc-200
              hover:bg-white/[0.1] disabled:opacity-50"
          >
            {savingKey ? "Saving…" : "Save API Key"}
          </DefaultButton>
        </div>

        <DefaultButton
          onClick={handleSignOut}
          disabled={signingOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20
            bg-red-500/10 px-4 py-5 text-sm font-medium text-red-400 transition-all
            hover:bg-red-500/20 hover:border-red-500/30 disabled:opacity-50"
        >
          <LogOut className="size-4" />
          {signingOut ? "Signing out…" : "Sign out"}
        </DefaultButton>
      </DialogContent>
    </Dialog>
  );
}