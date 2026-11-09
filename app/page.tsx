import { redirect } from "next/navigation";
import DashboardGrid from "./components/dashboard/Grid";
import DashboardHeader from "./components/dashboard/Header";

export default function Home() {
  redirect("/main");

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl">
        <DashboardHeader />
        <DashboardGrid />
      </div>
    </div>
  );
}