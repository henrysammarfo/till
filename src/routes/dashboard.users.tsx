import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, UserCheck, UserPlus } from "lucide-react";

export const Route = createFileRoute("/dashboard/users")({
  head: () => ({
    meta: [
      { title: "Users — verified authorisers and returning activity | TILL®" },
      {
        name: "description",
        content:
          "Who counts: authorisers with pre-Aug-28 Celo history, independence status, active days and preferred settlement asset.",
      },
      { property: "og:title", content: "TILL users" },
      { property: "og:description", content: "Verified authorisers, independence and return rate." },
    ],
  }),
  component: UsersPage,
});

const users = [
  ["0x7f2c…c41d", "Jun 2026", "Independent", "6", "cNGN"],
  ["0x18ab…9f04", "Mar 2026", "Independent", "4", "cNGN"],
  ["0x44de…21bb", "Jan 2026", "Independent", "3", "USA₮"],
  ["0x9c10…7a3f", "Aug 2026", "Pending check", "1", "cNGN"],
  ["0xa2f8…5512", "Feb 2026", "Independent", "5", "cNGN"],
  ["0x3ba9…ee71", "Nov 2025", "Independent", "2", "USDC"],
];

function UsersPage() {
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
          <ShieldCheck size={12} /> No first-funded wallets
        </span>
      </header>

      <div className="dash-body">
        <div className="grid grid-3">
          {[
            { icon: UserCheck, l: "Verified users", v: "412", d: "Pre-Aug-28 Celo history" },
            { icon: UserPlus, l: "New this week", v: "38", d: "Seeded via Telegram groups" },
            { icon: ShieldCheck, l: "Returning day 2+", v: "239", d: "58% of verified users" },
          ].map((s) => (
            <div className="stat" key={s.l}>
              <div className="stat-label">
                <s.icon size={14} strokeWidth={1.9} />
                {s.l}
              </div>
              <div className="num">{s.v}</div>
              <div className="delta delta-flat">{s.d}</div>
            </div>
          ))}
        </div>

        <div className="card scroll-x">
          <table className="table">
            <thead>
              <tr>
                <th>Wallet</th>
                <th>First Celo activity</th>
                <th>Independence</th>
                <th>Active days</th>
                <th>Preferred asset</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u[0]}>
                  <td className="mono">{u[0]}</td>
                  <td>{u[1]}</td>
                  <td>
                    <span className={`badge${u[2] === "Independent" ? " badge-ok" : ""}`}>{u[2]}</span>
                  </td>
                  <td>{u[3]}</td>
                  <td>{u[4]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
