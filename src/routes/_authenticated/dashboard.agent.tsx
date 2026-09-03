import { createFileRoute } from "@tanstack/react-router";
import { Activity, CircleCheck, ExternalLink, KeyRound, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard/agent")({
  head: () => ({
    meta: [
      { title: "Agent record — ERC-8004 identity and attribution status | TILL®" },
      {
        name: "description",
        content:
          "The live agent record: ERC-8004 identity, attribution tag, verifyTx status, x402 microservice health and declared operator wallets.",
      },
      { property: "og:title", content: "TILL agent record" },
      { property: "og:description", content: "ERC-8004 identity, attribution and x402 health." },
    ],
  }),
  component: AgentRecord,
});

const record = [
  ["Agent name", "till"],
  ["Primary track", "real-world-adoption"],
  ["Network", "celo-mainnet"],
  ["Attribution tag", "celo_9f31ab77c204"],
  ["Agent wallet", "0x7f2c9a41bd0e5512aa77c3410099ee21bb44dec1"],
  ["ERC-8004 record", "8004scan.io/agent/till"],
  ["Repository", "github.com/till-agent/till"],
  ["Telegram", "@tillagent"],
];

const declared = [
  ["Operator hot wallet", "0x51aa…9c02", "Excluded from user counts"],
  ["Relayer", "0xbe14…7731", "Pays gas, never an authoriser"],
  ["Till contract", "0x0cd7…41a8", "Own contract, declared"],
];

function AgentRecord() {
  return (
    <>
      <header className="dash-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            Identity
          </p>
          <h1 className="h3" style={{ margin: "6px 0 0", fontSize: 22 }}>
            Agent record
          </h1>
        </div>
        <a href="https://8004scan.io" target="_blank" rel="noreferrer" className="pill">
          View on 8004scan <ExternalLink size={14} />
        </a>
      </header>

      <div className="dash-body">
        <div className="grid grid-3">
          {[
            { icon: KeyRound, l: "Registration", v: "Complete", d: "Registered day 0" },
            { icon: CircleCheck, l: "verifyTx", v: "Passed", d: "First tagged send verified" },
            { icon: Zap, l: "x402 service", v: "Healthy", d: "Quote p95 · 340ms" },
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

        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <div className="card scroll-x">
            <h2 className="h3">Registry fields</h2>
            <table className="table" style={{ marginTop: 12 }}>
              <tbody>
                {record.map(([k, v]) => (
                  <tr key={k}>
                    <td style={{ color: "var(--muted)" }}>{k}</td>
                    <td className="mono" style={{ textAlign: "right" }}>
                      {v}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card scroll-x">
            <h2 className="h3">Declared wallets &amp; contracts</h2>
            <p className="body-sm">
              Published so nobody has to guess which addresses are ours. None of these are counted
              as users.
            </p>
            <table className="table" style={{ marginTop: 12 }}>
              <thead>
                <tr>
                  <th>Role</th>
                  <th>Address</th>
                  <th>Treatment</th>
                </tr>
              </thead>
              <tbody>
                {declared.map((d) => (
                  <tr key={d[1]}>
                    <td>{d[0]}</td>
                    <td className="mono">{d[1]}</td>
                    <td style={{ color: "var(--muted)" }}>{d[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-icon">
            <Activity size={18} strokeWidth={1.8} />
          </div>
          <h2 className="h3">Recent agent events</h2>
          <ul className="checklist" style={{ marginTop: 8 }}>
            {[
              "09:41 · transferWithAuthorization settled with attribution suffix",
              "09:38 · x402 quote resolved for 40 USA₮ agent leg",
              "08:12 · fee abstraction paid gas in cNGN for 14 sends",
              "07:55 · independence check refused a first-funded wallet",
            ].map((e) => (
              <li key={e} className="mono" style={{ letterSpacing: 0 }}>
                {e}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
