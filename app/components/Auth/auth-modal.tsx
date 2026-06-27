"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
  trigger?: ReactNode;
}

export function AuthModal({ trigger }: AuthModalProps) {
      const supabase = createClient()

      async function handleOAuthLogin(provider: "github" | "google") {
        await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    })
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? <Button>Sign In</Button>}
      </DialogTrigger>

      <DialogContent>
        <h2 className="text-xl font-semibold">
          Welcome
        </h2>

        <Button onClick={() => handleOAuthLogin("github")}>
          Continue with Github
        </Button>
        <Button onClick={() => handleOAuthLogin("google")}>
          Continue with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}