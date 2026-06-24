import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface DashboardHeaderProps {
  name?: string;
}

export default function DashboardHeader({ name }: DashboardHeaderProps) {
  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
        {name ? `${name}'s Dashboard` : "Dashboard"}
      </h1>
      <Avatar className="flex items-center justify-center w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.08] transition-all duration-200">
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>USER</AvatarFallback>
      </Avatar>
    </header>
  );
}
