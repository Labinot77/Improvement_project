import DashboardGrid from "./components/dashboard/Dashboard_grid";
import DashboardHeader from "./components/dashboard/Dashboard_header";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#080808] px-4 py-6 sm:px-8 sm:py-8">
      <div className="mx-auto max-w-6xl">
        <DashboardHeader name="Rowan" />
        <DashboardGrid />
      </div>
    </div>
  );
}