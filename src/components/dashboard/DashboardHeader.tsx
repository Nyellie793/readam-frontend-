import DashboardGreeting from "./DashboardGreeting";
import DashboardSearch from "./DashboardSearch";
import DashboardActions from "./DashboardActions";

export default function DashboardHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4">

      <DashboardGreeting />

      <div className="ml-auto flex items-center gap-4 lg:w-auto lg:flex-row lg:items-center lg:justify-end">

        <DashboardSearch />

        <DashboardActions />

      </div>

    </header>
  );
}