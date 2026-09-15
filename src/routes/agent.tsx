import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CircleCheck, FileCode2, KeyRound, ScanLine, ShieldCheck } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { AGENT_IDENTITY } from "@/lib/agent-identity";

export const Route = createFileRoute("/agent")({
  head: () => ({
    meta: [
      { title: "Agent identity — ERC-8004, attribution tags and honest disclosure | TILL®" },
      {
        name: "description",
        content:
          "TILL registers an ERC-8004 agent identity, tags every user-facing transaction, verifies the first tagged send, and declares its own wallets and contracts.",
      },
      { property: "og:title", content: "TILL agent identity" },
      {
        property: "og:description",
        content: "ERC-8004 registration, attribution tags, verifyTx and honest wallet disclosure.",
      },
    ],
  }),
  component: AgentPage,
});

const registry = [
  ["Primary track", AGENT_IDENTITY.primaryTrack],
  ["Network", AGENT_IDENTITY.network],
  ["Attribution tag", AGENT_IDENTITY.attributionTag],
  ["Agent wallet", AGENT_IDENTITY.walletShort],
  ["ERC-8004", AGENT_IDENTITY.erc8004Url.replace("https://", "")],
  ["Repository", AGENT_IDENTITY.githubShort],
];

const commitments = [
  "@celo/attribution-tags on every user-facing transaction",
  "verifyTx run immediately after the first tagged send",
  "ERC-8004 identity and 8004scan URL published at registration",
  "Fee abstraction enabled for every settlement path",
  "MiniPay / EIP-3009 authoriser path as the default",
  "x402.celo.org used for the agent microservice leg",
  "otherWallets and ownContracts declared honestly",
  "Optional Self proof-of-personhood on high-value sends",
];

const refusals = [
  "General-purpose “money agent” with no till loop",
  "Value-moved float farming between our own wallets",
  "First-funding wallets and calling them users",
  "Testnet activity presented as scoring traction",
];

function AgentPage() {
  return (
    <PageShell
      eyebrow="Agent"
      title={
        <>
          An agent with a name, a wallet, and a <span className="serif italic">receipt</span>.
        </>
      }
      lede="TILL is registered on-chain before it moves a single unit of value. Identity, attribution and disclosure are part of the product, not paperwork bolted on at submission."
    >
      <section className="section">
        <div className="wrap">
          <div className="grid grid-2" style={{ gap: 44, alignItems: "start" }}>
            <div className="card">
              <div className="card-icon">
                <KeyRound size={18} strokeWidth={1.8} />
              </div>
              <h3 className="h3">Registry record</h3>
              <table className="table" style={{ marginTop: 14 }}>
                <tbody>
                  {registry.map(([k, v]) => (
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
            <div>
              <div className="card-icon">
                <ShieldCheck size={18} strokeWidth={1.8} />
              </div>
              <h2 className="h2">What we commit to.</h2>
              <ul className="checklist" style={{ marginTop: 16 }}>
                {commitments.map((c) => (
                  <li key={c}>
                    <CircleCheck size={16} strokeWidth={1.8} style={{ marginTop: 2, flex: "none" }} />
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <div className="grid grid-2" style={{ gap: 44 }}>
            <div>
              <div className="card-icon">
                <ScanLine size={18} strokeWidth={1.8} />
              </div>
              <h2 className="h2">What we will not ship.</h2>
              <ul className="checklist" style={{ marginTop: 16 }}>
                {refusals.map((r) => (
                  <li key={r} style={{ color: "var(--muted)" }}>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 999,
                        border: "1px solid var(--border-hard)",
                        flex: "none",
                        marginTop: 2,
                      }}
                    />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card" style={{ background: "#fff" }}>
              <div className="card-icon">
                <FileCode2 size={18} strokeWidth={1.8} />
              </div>
              <h3 className="h3">Tagging, in one call</h3>
              <pre
                className="mono"
                style={{ whiteSpace: "pre-wrap", lineHeight: 1.75, margin: "10px 0 0" }}
              >{`import { toDataSuffix } from "@celo/attribution-tags";

const suffix = toDataSuffix({ tag: ATTRIBUTION_TAG });

await wallet.writeContract({
  address: CNGN,
  functionName: "transferWithAuthorization",
  args: [from, to, value, validAfter, validBefore, nonce, v, r, s],
  dataSuffix: suffix,
});`}</pre>
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            <Link to="/dashboard" className="btn-primary">
              See live attribution <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
