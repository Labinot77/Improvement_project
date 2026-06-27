"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AuthModal } from "./auth-modal";
import { SignOutModal } from "./SignoutModal";
import { User } from "@supabase/supabase-js";

interface UserAvatarProps {
  user: User;
  isLoggedIn: boolean;
  loading: boolean;
}

export default function UserAvatar({
  user,
  isLoggedIn,
  loading
}: UserAvatarProps) {
  const avatarUrl = user?.user_metadata.avatar_url;
  const username = user?.user_metadata.user_name as string
  const initial = username?.charAt(0)
  
  const avatar = (
    <Avatar className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.04] text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.08] transition-all duration-200">
      <AvatarImage src={avatarUrl} alt={username} />
      <AvatarFallback>{initial}</AvatarFallback>
    </Avatar>
  );

  if (!isLoggedIn) {
    return (
      <AuthModal trigger={avatar} />
    );
  }

  return <SignOutModal trigger={avatar} />;

}