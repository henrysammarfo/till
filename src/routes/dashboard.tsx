import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bot,
  LayoutDashboard,
  ListChecks,
  Receipt,
  Settings,
  Users,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/dashboard")({
  component: DashboardLayout,
});

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/transactions", label: "Transactions", icon: Receipt, exact: false },
  { to: "/dashboard/users", label: "Users", icon: Users, exact: false },
  { to: "/dashboard/agent", label: "Agent", icon: Bot, exact: false },
  { to: "/dashboard/checklist", label: "Checklist", icon: ListChecks, exact: false },
  { to: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function DashboardLayout() {
  return (
    <div className="dash">
      <aside className="dash-side">
        <Logo to="/dashboard" />
        {nav.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="side-link"
            activeOptions={{ exact: n.exact }}
            activeProps={{ className: "side-link active" }}
          >
            <n.icon size={16} strokeWidth={1.9} />
            {n.label}
          </Link>
        ))}
        <Link to="/" className="side-link" style={{ marginTop: "auto" }}>
          <ArrowLeft size={16} strokeWidth={1.9} />
          Back to site
        </Link>
      </aside>
      <div className="dash-main">
        <Outlet />
      </div>
    </div>
  );
}
