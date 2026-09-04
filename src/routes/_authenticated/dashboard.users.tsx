import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ShieldCheck, UserCheck, UserPlus } from "lucide-react";
import { getStudioOverview, getStudioTransactions } from "@/lib/studio.functions";

export const Route = createFileRoute("/_authenticated/dashboard/users")({
  head: () => ({
    meta: [
      { title: "Users — verified authorisers and returning activity | TILL®" },
      {
        name: "description",
        content:
          "Who counts: authorisers with pre-Aug-28 Celo history, independence status, active days and preferred settlement asset.",
      },
      { property: "og:title", content: "TILL users" },
      {
        property: "og:description",
        content: "Verified authorisers, independence and return rate.",
      },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  const overview = useQuery({ queryKey: ["till-overview"], queryFn: () => getStudioOverview() });
  const txs = useQuery({ queryKey: ["till-transactions"], queryFn: () => getStudioTransactions() });

  const byWallet = new Map<string, { count: number; asset: string }>();
  for (const r of txs.data?.rows ?? []) {
    const cur = byWallet.get(r.wallet) ?? { count: 0, asset: r.asset };
    cur.count += 1;
    cur.asset = r.asset;
    byWallet.set(r.wallet, cur);
  }
  const users = [...byWallet.entries()].map(([wallet, meta]) => ({
    wallet,
    days: String(meta.count),
    asset: meta.asset,
  }));

  return (
    <>
      <header className="dash-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            People
          </p>
          <h1 className="h3" style={{ margin: "6px 0 0", fontSize: 22 }}>
            Users &amp; authorisers
          </h1>
        </div>
        <span className="badge badge-ok">
          <ShieldCheck size={12} /> Independence policy enforced
        </span>
      </header>

      <div className="dash-body">
        <div className="grid grid-3">
          {[
            {
              icon: UserCheck,
              l: "Verified users",
              v: String(overview.data?.verifiedUsers ?? 0),
              d: "Distinct EIP-3009 authorisers",
            },
            {
              icon: UserPlus,
              l: "Tagged txs",
              v: String(overview.data?.taggedTxs ?? 0),
              d: "ERC-8021 verified",
            },
            {
              icon: ShieldCheck,
              l: "Returning",
              v: `${overview.data?.returningPct ?? 0}%`,
              d: "2+ distinct days",
            },
          ].map((s) => (
            <div className="stat" key={s.l}>
              <div className="stat-label">
                <s.icon size={14} strokeWidth={1.9} />
                {s.l}
              </div>
              <div className="num" style={{ fontSize: 28 }}>
                {s.v}
              </div>
              <div className="delta delta-flat">{s.d}</div>
            </div>
          ))}
        </div>

        <div className="card scroll-x" style={{ marginTop: 16 }}>
          <table className="table">
            <thead>
              <tr>
                <th>Wallet</th>
                <th>Settlements</th>
                <th>Last asset</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={3} className="body-sm">
                    No live authorisers yet. Mocks removed.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.wallet}>
                    <td>
                      {u.wallet.slice(0, 6)}…{u.wallet.slice(-4)}
                    </td>
                    <td>{u.days}</td>
                    <td>{u.asset}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
