import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Activity, CircleCheck, ExternalLink, KeyRound, Zap } from "lucide-react";
import { getStudioAgentRecord } from "@/lib/studio.functions";

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

function AgentRecord() {
  const agent = useQuery({
    queryKey: ["till-agent"],
    queryFn: () => getStudioAgentRecord(),
  });
  const x402 = useQuery({
    queryKey: ["x402-caps"],
    queryFn: async () => {
      const res = await fetch("/api/x402/supported");
      if (!res.ok) throw new Error(`x402 probe failed: ${res.status}`);
      return res.json() as Promise<{
        facilitator: string;
        usatSupportedByFacilitator: boolean;
        usdc: string;
        usdt: string;
      }>;
    },
    retry: 1,
  });

  const fields = agent.data?.fields ?? [];
  const verifyCount = agent.data?.attributionVerifiedCount ?? 0;

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
        <a
          href={fields.find((f) => f[0] === "ERC-8004 record")?.[1] || "https://8004scan.io"}
          target="_blank"
          rel="noreferrer"
          className="pill"
        >
          View on 8004scan <ExternalLink size={14} />
        </a>
      </header>

      <div className="dash-body">
        <div className="grid grid-3">
          {[
            {
              icon: KeyRound,
              l: "Registration",
              v: agent.data?.ready ? "Configured" : "Pending",
              d: "agent_config + env",
            },
            {
              icon: CircleCheck,
              l: "verifyTx events",
              v: String(verifyCount),
              d: "ERC-8021 verified settlements",
            },
            {
              icon: Zap,
              l: "x402 service",
              v: x402.isError ? "Error" : x402.data ? "Reachable" : "…",
              d: x402.data
                ? `USA₮ facilitator support: ${x402.data.usatSupportedByFacilitator ? "yes" : "no"}`
                : x402.isError
                  ? "Check X402 facilitator"
                  : "probing api.x402.celo.org",
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

        <div className="grid grid-2" style={{ alignItems: "start", marginTop: 24 }}>
          <div className="card scroll-x">
            <h2 className="h3">Registry fields</h2>
            <table className="table" style={{ marginTop: 12 }}>
              <tbody>
                {fields.length === 0 ? (
                  <tr>
                    <td className="body-sm">
                      No agent_config row yet — complete studio sign-in after migration.
                    </td>
                  </tr>
                ) : (
                  fields.map(([k, v]) => (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>
                        <code>{v}</code>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="card">
            <h2 className="h3">
              <Activity size={16} style={{ display: "inline", marginRight: 6 }} />
              Live signals
            </h2>
            <p className="body-sm" style={{ marginTop: 12 }}>
              Attribution uses <strong>ERC-8021</strong> (`@celo/attribution-tags`). Agent identity
              uses <strong>ERC-8004</strong>. Security posture: residual risk only — never
              unhackable.
            </p>
            {x402.data ? (
              <pre className="body-sm" style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
                {JSON.stringify(
                  {
                    facilitator: x402.data.facilitator,
                    usatSupportedByFacilitator: x402.data.usatSupportedByFacilitator,
                    usdc: x402.data.usdc,
                    usdt: x402.data.usdt,
                  },
                  null,
                  2,
                )}
              </pre>
            ) : null}
          </div>
        </div>
      </div>
    </>
  );
}
