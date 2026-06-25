"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthModal } from "./auth-modal";

interface UserAvatarProps {
  fullName?: string;
  avatarUrl?: string;
  isAuthenticated: boolean;
}

export default function UserAvatar({
  fullName,
  avatarUrl,
  isAuthenticated,
}: UserAvatarProps) {
  const initials =
    fullName
      ?.split(" ")
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "U";

  const avatar = (
    <Avatar className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.08] transition-all duration-200">
      <AvatarImage src={avatarUrl} alt={fullName ?? "User"} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );

  if (!isAuthenticated) {
    return (
      <AuthModal trigger={avatar} />
    );
  }

  return avatar;
}