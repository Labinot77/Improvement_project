"use client"

import { Button } from "@/components/ui/button";
import { useModal } from "../../providers/Modalprovider"

const No_access = () => {
  const { open } = useModal();
  return (
     <div className="absolute flex flex-col items-center justify-center gap-3 h-full w-full">
          <p className="text-sm font-medium text-zinc-300">You are not logged in</p>
          <Button
            onClick={() => open("login")}
            className="rounded-lg px-4 py-1.5 text-sm font-semibold transition-all"
            style={{
              background: "rgba(99,102,241,0.2)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "#818cf8",
            }}
          >
            Log in
          </Button>
        </div>
  )
}

export default No_access