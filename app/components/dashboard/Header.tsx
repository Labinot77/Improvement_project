// "use client";

// import { User } from "lucide-react";
// import { useUser } from "@/lib/use_user";
// import { useModal } from "@/providers/Modalprovider";
// import DefaultButton from "../DefaultButton";

// export default function DashboardHeader() {
//   const { user, isLoggedIn, loading } = useUser();
//   const { open } = useModal();

//   const username = user?.user_metadata?.user_name as string | undefined;
//   const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

//   return (
//     <header className="flex items-center justify-between mb-8">
//       <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
//         {username ? `${username}'s Dashboard` : "Dashboard"}
//       </h1>

//       {loading ? (
//         <div className="size-9 rounded-full bg-white/[0.06] animate-pulse" />
//       ) : isLoggedIn ? (
//         <DefaultButton
//           onClick={() => open("profile", {})}
//           className="relative size-9 rounded-full border border-white/[0.10] overflow-hidden
//             hover:border-white/[0.20] transition-colors p-0" // p-0 to override the default shadCN padding
//         >
//           {avatarUrl ? (
//             <img src={avatarUrl} alt={username} className="size-full object-cover" />
//           ) : (
//             <div className="flex size-full items-center justify-center bg-[#161616]">
//               <User className="size-4 text-zinc-400" />
//             </div>
//           )}
//         </DefaultButton>
//       ) : (
//         <>
//         <DefaultButton variant={"outline"} onClick={() => open("login", {})} className="rounded-xl border border-white/[0.08] bg-[#161616] px-4 py-4
//             text-sm font-medium text-zinc-300 transition-all hover:bg-[#1c1c1c]
//             hover:border-white/[0.14] hover:text-zinc-100">
//               Sign in
//         </DefaultButton>
//         </>
//       )}
//     </header>
//   );
// }

"use client";

import { useEffect, useState } from "react";

const PROGRESS = 72;
const RADIUS = 26;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function DashboardHeader() {
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening");
  }, []);

  return (
    <header className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
          Daily overview
        </p>
        <h1 className="text-5xl font-semibold tracking-tight sm:text-6xl">
          {greeting}, Alex.
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          A little progress every day adds up to big results.
        </p>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4">
        <div className="relative size-16 shrink-0">
          <svg viewBox="0 0 64 64" className="size-16 -rotate-90" aria-hidden>
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              className="stroke-muted"
            />
            <circle
              cx="32"
              cy="32"
              r={RADIUS}
              fill="none"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - PROGRESS / 100)}
              className="stroke-emerald-400"
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-sm font-semibold">
            {PROGRESS}%
          </span>
        </div>
        <div>
          <p className="text-lg font-medium leading-tight">Daily progress</p>
          <p className="text-muted-foreground">4 of 6 goals on track</p>
        </div>
      </div>
    </header>
  );
}