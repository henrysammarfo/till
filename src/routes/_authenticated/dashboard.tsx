import { Link, Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bot,
  Briefcase,
  CalendarClock,
  Contact,
  LayoutDashboard,
  ListChecks,
  LogOut,
  Receipt,
  Settings,
  Users,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

const nav = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/bookings", label: "Bookings", icon: CalendarClock, exact: false },
  { to: "/dashboard/clients", label: "Clients", icon: Contact, exact: false },
  { to: "/dashboard/projects", label: "Projects", icon: Briefcase, exact: false },
  { to: "/dashboard/transactions", label: "Transactions", icon: Receipt, exact: false },
  { to: "/dashboard/users", label: "Users", icon: Users, exact: false },
  { to: "/dashboard/agent", label: "Agent", icon: Bot, exact: false },
  { to: "/dashboard/checklist", label: "Checklist", icon: ListChecks, exact: false },
  { to: "/dashboard/settings", label: "Settings", icon: Settings, exact: false },
] as const;

function DashboardLayout() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  useEffect(() => {
    // The first signed-in teammate becomes the studio admin.
    void supabase.rpc("claim_first_admin");
  }, []);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

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
        <button type="button" className="side-link" onClick={signOut}>
          <LogOut size={16} strokeWidth={1.9} />
          Sign out
        </button>
      </aside>
      <div className="dash-main">
        <Outlet />
      </div>
    </div>
  );
}
