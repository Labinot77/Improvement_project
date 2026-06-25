import { User } from "@supabase/supabase-js";
import UserAvatar from "../Auth/user-avatar";

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  if (!user) return;
  const username = user.user_metadata.user_name as string;
  const avatarUrl = user.user_metadata.avatar_url as string | undefined;

  // console.log(user)

  return (
    <header className="flex items-center justify-between mb-8">
      <h1 className="text-xl font-semibold text-zinc-100 tracking-tight">
        {username ? `${username}'s Dashboard` : "Dashboard"}
      </h1>

      <UserAvatar
        fullName={username}
        avatarUrl={avatarUrl}
        isAuthenticated={!!user}
      />
    </header>
  );
}