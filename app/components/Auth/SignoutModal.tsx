"use client";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface SignOutModalProps {
  trigger?: ReactNode;
}

export function SignOutModal({ trigger }: SignOutModalProps) {
  const supabase = createClient();

  async function handleSignOut() {
    await supabase.auth.signOut();
    window.location.reload(); // or router.refresh() if you're using Next router
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="destructive">Sign out</Button>}
      </DialogTrigger>

      <DialogContent>
        <h2 className="text-xl font-semibold">Sign out</h2>

        <p className="text-sm text-muted-foreground">
          Are you sure you want to sign out?
        </p>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" onClick={() => (document as any).activeElement?.click()}>
            Cancel
          </Button>

          <Button variant="destructive" onClick={handleSignOut}>
            Sign out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}