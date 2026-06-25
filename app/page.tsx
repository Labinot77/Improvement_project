"use client"

import DashboardGrid from "./components/dashboard/Grid";
import DashboardHeader from "./components/dashboard/Header";
import { useUser } from "@/lib/use_user";

export default function Home() {
  const { user, isLoggedIn, loading } = useUser()


  return (
    <div className="min-h-screen px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader user={user!} />
        <DashboardGrid />
      </div>
    </div>
  );
}