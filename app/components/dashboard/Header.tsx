"use client"

import UserAvatar from "../auth/user-avatar";
import { useUser } from "@/lib/use_user";


export default function DashboardHeader() {
  const { user, isLoggedIn, loading } = useUser();

  const username = user?.user_metadata.user_name as string;

  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
        {loading ?? "Sick"}
        {username ? `${username}'s Dashboard` : "Dashboard"}
      </h1>

      <UserAvatar
        user={user!}
        isLoggedIn={isLoggedIn}
        loading={loading}
      />
    </header>
  );
}