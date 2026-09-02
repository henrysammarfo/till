import { createFileRoute } from "@tanstack/react-router";
import { Circle, CircleCheck } from "lucide-react";

export const Route = createFileRoute("/dashboard/checklist")({
  head: () => ({
    meta: [
      { title: "Build checklist — shipping the till to submission | TILL®" },
      {
        name: "description",
        content:
          "The TILL build checklist: registration, tagged smoke transaction, cNGN path, fee abstraction, x402 microservice and publication.",
      },
      { property: "og:title", content: "TILL build checklist" },
      { property: "og:description", content: "What is shipped and what is left before submission." },
    ],
  }),
  component: Checklist,
});

const today = [
  ["Public GitHub repository", true],
  ["ERC-8004 identity + agent wallet", true],
  ["Register on celobuilders and save tag", true],
  ["First tagged smoke transaction", true],
];

const toSubmission = [
  ["Telegram till + cNGN settlement path", true],
  ["Fee abstraction + MiniPay authorisers", true],
  ["USA₮ / USDC x402 microservice", false],
  ["AskBots round 1 and round 2", false],
  ["cPay opt-in feedback loop", false],
  ["Publish and announce", false],
];

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
  const done = [...today, ...toSubmission].filter((i) => i[1]).length;
  const total = today.length + toSubmission.length;

  return (
    <>
      <header className="dash-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            Delivery
          </p>
          <h1 className="h3" style={{ margin: "6px 0 0", fontSize: 22 }}>
            Build checklist
          </h1>
        </div>
        <span className="badge badge-dark">
          {done} / {total} shipped
        </span>
      </header>

      <div className="dash-body">
        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <Group title="Day zero" items={today} />
          <Group title="To 14 Sep 2026" items={toSubmission} />
        </div>

        <div className="card" style={{ background: "var(--text)", borderColor: "var(--text)" }}>
          <h2 className="h3" style={{ color: "#fff" }}>
            Demo beat · 60 seconds
          </h2>
          <ol
            className="body-sm"
            style={{ color: "rgba(255,255,255,0.66)", paddingLeft: 18, margin: "10px 0 0", lineHeight: 2 }}
          >
            <li>Dune shows the tagged wallet non-zero.</li>
            <li>A pre-Aug-28 MiniPay user pays through the TILL chat.</li>
            <li>Celoscan shows the attribution suffix on that transaction.</li>
            <li>Fee abstraction and the x402 receipt flash on screen.</li>
            <li>The same user returns on day two.</li>
          </ol>
        </div>
      </div>
    </>
  );
}
