import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Briefcase,
  CalendarClock,
  Coins,
  Contact,
  Fuel,
  Repeat,
  TrendingUp,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getStudioOverview } from "@/lib/studio.functions";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  head: () => ({
    meta: [
      { title: "Till overview — verified users, tagged volume and returning activity | TILL®" },
      {
        name: "description",
        content:
          "Live overview of the TILL till: verified users, distinct authorisers, tagged transactions and returning activity across Celo mainnet.",
      },
      { property: "og:title", content: "TILL dashboard overview" },
      {
        property: "og:description",
        content: "Verified users, tagged transactions and returning activity at a glance.",
      },
    ],
  }),
  component: Overview,
});

function Overview() {
  const till = useQuery({
    queryKey: ["till-overview"],
    queryFn: () => getStudioOverview(),
  });

  const studio = useQuery({
    queryKey: ["studio-overview"],
    queryFn: async () => {
      const [bookings, pending, clients, projects] = await Promise.all([
        supabase.from("bookings").select("id", { count: "exact", head: true }),
        supabase
          .from("bookings")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase.from("clients").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id, status, progress"),
      ]);
      const rows = projects.data ?? [];
      return {
        bookings: bookings.count ?? 0,
        pending: pending.count ?? 0,
        clients: clients.count ?? 0,
        projects: rows.length,
        atRisk: rows.filter((p) => p.status !== "on_track" && p.status !== "done").length,
        avgProgress: rows.length
          ? Math.round(rows.reduce((a, p) => a + p.progress, 0) / rows.length)
          : 0,
      };
    },
  });

  const t = till.data;
  const s = studio.data;
  const stats = [
    {
      label: "Verified users",
      value: t ? String(t.verifiedUsers) : "—",
      delta: t?.tenantReady ? "live till ledger" : "tenant not bootstrapped",
      icon: Users,
    },
    {
      label: "Distinct authorisers",
      value: t ? String(t.authorisers) : "—",
      delta: "EIP-3009 / MiniPay",
      icon: Coins,
    },
    {
      label: "Tagged transactions",
      value: t ? String(t.taggedTxs) : "—",
      delta: "ERC-8021 verified",
      icon: Repeat,
    },
    {
      label: "Returning day 2+",
      value: t ? `${t.returningPct}%` : "—",
      delta: "distinct calendar days",
      icon: TrendingUp,
    },
  ];

  return (
    <>
      <header className="dash-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            Overview
          </p>
          <h1 className="h3" style={{ margin: "6px 0 0", fontSize: 22 }}>
            Till pulse
          </h1>
        </div>
        <Link to="/dashboard/transactions" className="pill">
          Open ledger <ArrowUpRight size={15} />
        </Link>
      </header>

      <div className="dash-body">
        {till.isError ? (
          <p className="body-sm" style={{ color: "crimson" }}>
            {till.error instanceof Error ? till.error.message : "Failed to load till overview"}
          </p>
        ) : null}

        <div className="grid grid-4">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-label">
                <s.icon size={14} strokeWidth={1.9} />
                {s.label}
              </div>
              <div className="num" style={{ fontSize: 28 }}>
                {s.value}
              </div>
              <div className="delta delta-flat">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-2" style={{ alignItems: "start", marginTop: 24 }}>
          <div className="card">
            <h2 className="h3">Recent settlements</h2>
            <table className="table" style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Payer</th>
                  <th>Amount</th>
                  <th>Path</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(t?.recent ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={5} className="body-sm">
                      No live till transactions yet. First tagged mainnet settle will appear here.
                    </td>
                  </tr>
                ) : (
                  (t?.recent ?? []).map((r) => (
                    <tr key={r.hash}>
                      <td>{r.time}</td>
                      <td>{r.wallet}</td>
                      <td>{r.amount}</td>
                      <td>{r.path}</td>
                      <td>{r.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2 className="h3">Studio CRM</h2>
            <ul className="body-sm" style={{ marginTop: 12, lineHeight: 1.8 }}>
              <li>
                <CalendarClock size={14} style={{ display: "inline", marginRight: 6 }} />
                Bookings: {s?.bookings ?? "—"} ({s?.pending ?? 0} pending)
              </li>
              <li>
                <Contact size={14} style={{ display: "inline", marginRight: 6 }} />
                Clients: {s?.clients ?? "—"}
              </li>
              <li>
                <Briefcase size={14} style={{ display: "inline", marginRight: 6 }} />
                Projects: {s?.projects ?? "—"} · avg progress {s?.avgProgress ?? 0}%
              </li>
              <li>
                <Fuel size={14} style={{ display: "inline", marginRight: 6 }} />
                At risk: {s?.atRisk ?? 0}
              </li>
            </ul>
            <p className="body-sm" style={{ marginTop: 16, opacity: 0.7 }}>
              Residual risk documented — we do not claim unhackable.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
