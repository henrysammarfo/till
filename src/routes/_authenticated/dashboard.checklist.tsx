import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Circle, CircleCheck } from "lucide-react";
import { getStudioAgentRecord } from "@/lib/studio.functions";

export const Route = createFileRoute("/_authenticated/dashboard/checklist")({
  head: () => ({
    meta: [
      { title: "Build checklist — shipping the till to submission | TILL®" },
      {
        name: "description",
        content:
          "The TILL build checklist: registration, tagged smoke transaction, cNGN path, fee abstraction, x402 microservice and publication.",
      },
      { property: "og:title", content: "TILL build checklist" },
      {
        property: "og:description",
        content: "What is shipped and what is left before submission.",
      },
    ],
  }),
  component: Checklist,
});

function Group({ title, items }: { title: string; items: (string | boolean)[][] }) {
  return (
    <div className="card">
      <h2 className="h3">{title}</h2>
      <ul className="checklist" style={{ marginTop: 8 }}>
        {items.map(([label, done]) => (
          <li key={String(label)} style={{ color: done ? "var(--text)" : "var(--muted)" }}>
            {done ? (
              <CircleCheck size={16} strokeWidth={1.9} style={{ marginTop: 2, flex: "none" }} />
            ) : (
              <Circle size={16} strokeWidth={1.9} style={{ marginTop: 2, flex: "none" }} />
            )}
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Checklist() {
  const agent = useQuery({ queryKey: ["till-agent"], queryFn: () => getStudioAgentRecord() });
  const tagSet = Boolean(
    agent.data?.fields.find((f) => f[0] === "Attribution tag")?.[1] &&
    agent.data?.fields.find((f) => f[0] === "Attribution tag")?.[1] !== "unset",
  );
  const walletSet = Boolean(
    agent.data?.fields.find((f) => f[0] === "Agent wallet")?.[1] &&
    agent.data?.fields.find((f) => f[0] === "Agent wallet")?.[1] !== "unset",
  );
  const verified = (agent.data?.attributionVerifiedCount ?? 0) > 0;

  const today: (string | boolean)[][] = [
    ["Public GitHub repository", true],
    ["ERC-8004 registration file published", true],
    ["Agent wallet + attribution tag in env/agent_config", tagSet && walletSet],
    ["First tagged smoke verifyTx", verified],
  ];

  const toSubmission: (string | boolean)[][] = [
    ["Telegram till webhook + structured intent", true],
    ["EIP-3009 settle + ERC-8021 attribution module", true],
    ["Fee abstraction adapters (USDC/USDT)", true],
    ["x402 facilitator probe (USA₮ gated by /supported)", true],
    ["Apply multitenant migration + service role", false],
    ["Contest register day-0 + AskBots / cPay", false],
  ];

  const done = [...today, ...toSubmission].filter((i) => i[1]).length;
  const total = today.length + toSubmission.length;

  return (
    <>
      <header className="dash-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            Shipping
          </p>
          <h1 className="h3" style={{ margin: "6px 0 0", fontSize: 22 }}>
            Build checklist
          </h1>
        </div>
        <span className="badge">
          {done}/{total} complete
        </span>
      </header>

      <div className="dash-body grid grid-2">
        <Group title="Foundation" items={today} />
        <Group title="To submission" items={toSubmission} />
      </div>
    </>
  );
}
