"use client"

import LeftDotGrid from "./backgorudm";
import DashboardGrid from "./components/dashboard/Grid";
import DashboardHeader from "./components/dashboard/Header";
import { useUser } from "@/lib/use_user";

export default function Home() {
  const { user, isLoggedIn, loading } = useUser();

  return (
    <div className="relative min-h-screen px-4 py-6 sm:px-8 sm:py-8">
      <LeftDotGrid />

      <div className="relative mx-auto max-w-6xl">
        <DashboardHeader user={user!} />
        <DashboardGrid />
      </div>
    </div>
  );
}