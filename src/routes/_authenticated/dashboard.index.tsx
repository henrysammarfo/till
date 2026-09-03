import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Coins, Fuel, Repeat, TrendingUp, Users } from "lucide-react";

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

const stats = [
  { label: "Verified users", value: "412", delta: "+38 this week", icon: Users },
  { label: "Distinct authorisers", value: "389", delta: "+31 this week", icon: Coins },
  { label: "Tagged transactions", value: "1,206", delta: "+147 this week", icon: Repeat },
  { label: "Returning day 2+", value: "58%", delta: "+4.2 pts", icon: TrendingUp },
];

const recent = [
  ["09:41", "0x7f2c…c41d", "5,000 cNGN", "EIP-3009", "Settled"],
  ["09:22", "0x18ab…9f04", "12,500 cNGN", "MiniPay", "Settled"],
  ["08:57", "0x44de…21bb", "40 USA₮", "x402", "Settled"],
  ["08:31", "0x9c10…7a3f", "2,000 cNGN", "Relay", "Settled"],
  ["08:04", "0xa2f8…5512", "8,750 cNGN", "EIP-3009", "Settled"],
];

function Overview() {
  return (
    <>
      <header className="dash-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            Till overview
          </p>
          <h1 className="h3" style={{ margin: "6px 0 0", fontSize: 22 }}>
            Accra counter · celo-mainnet
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span className="badge badge-ok">
            <span className="dot-green" /> Live
          </span>
          <span className="badge mono">celo_9f31ab77c204</span>
        </div>
      </header>

      <div className="dash-body">
        <div className="grid grid-4">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-label">
                <s.icon size={14} strokeWidth={1.9} />
                {s.label}
              </div>
              <div className="num">{s.value}</div>
              <div className="delta">{s.delta}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 className="h3" style={{ margin: 0 }}>
                Recent till jobs
              </h2>
              <Link to="/dashboard/transactions" className="tag">
                View all <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="scroll-x" style={{ marginTop: 14 }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Counterparty</th>
                    <th>Amount</th>
                    <th>Path</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r[0]}>
                      <td className="mono">{r[0]}</td>
                      <td className="mono">{r[1]}</td>
                      <td>{r[2]}</td>
                      <td>
                        <span className="badge">{r[3]}</span>
                      </td>
                      <td>
                        <span className="badge badge-ok">{r[4]}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="card">
              <div className="card-icon">
                <Fuel size={18} strokeWidth={1.8} />
              </div>
              <h2 className="h3">Gas abstraction</h2>
              <p className="body-sm">
                100% of settlements this week paid gas in the transferred stablecoin. No user held
                CELO.
              </p>
              <div className="grid grid-2" style={{ marginTop: 18 }}>
                <div>
                  <div className="stat-label">cNGN gas</div>
                  <div className="num" style={{ fontSize: 24 }}>
                    ₦4,182
                  </div>
                </div>
                <div>
                  <div className="stat-label">USA₮ gas</div>
                  <div className="num" style={{ fontSize: 24 }}>
                    $2.14
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ background: "var(--text)", borderColor: "var(--text)" }}>
              <h2 className="h3" style={{ color: "#fff" }}>
                Attribution health
              </h2>
              <p className="body-sm" style={{ color: "rgba(255,255,255,0.62)" }}>
                1,206 of 1,206 user-facing transactions carry the suffix. verifyTx passed on the
                first tagged send.
              </p>
              <Link to="/dashboard/agent" className="btn-secondary" style={{ marginTop: 18 }}>
                Agent record <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
