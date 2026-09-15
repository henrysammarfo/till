import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  Fingerprint,
  Fuel,
  MessagesSquare,
  PenLine,
  Receipt,
  SearchCheck,
  Tags,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "How TILL works — chat intent to signed stablecoin settlement" },
      {
        name: "description",
        content:
          "From a Telegram message to a tagged Celo mainnet transfer: intent parsing, independence checks, EIP-3009 authorization, fee abstraction and x402 settlement.",
      },
      { property: "og:title", content: "How TILL works" },
      {
        property: "og:description",
        content: "Chat intent to signed, attributed stablecoin settlement on Celo mainnet.",
      },
    ],
  }),
  component: ProductPage,
});

const steps = [
  {
    icon: MessagesSquare,
    n: "01",
    t: "Intent capture",
    b: "The user types a normal sentence in Telegram — “send 5 cNGN to 0x… / Ama”. TILL parses amount, asset and counterparty, then reads it back for confirmation.",
  },
  {
    icon: SearchCheck,
    n: "02",
    t: "Independence policy",
    b: "Before quoting, the counterparty is screened: not an operator wallet, not first-funded by us, prefer wallets with pre-Aug-28 Celo activity. Failures are refused, not hidden.",
  },
  {
    icon: PenLine,
    n: "03",
    t: "User authorization",
    b: "The user signs an EIP-3009 transfer authorization or approves in MiniPay. One signature, no seed-phrase gymnastics, no app switching.",
  },
  {
    icon: Tags,
    n: "04",
    t: "Tagged execution",
    b: "The transfer is broadcast with toDataSuffix(attributionTag) so every user-facing transaction is attributable on Celoscan and Dune.",
  },
  {
    icon: Fuel,
    n: "05",
    t: "Fee abstraction",
    b: "Gas is paid in the stablecoin being moved. Sponsored-relay signers still count as users because the authoriser is the human, not the gas payer.",
  },
  {
    icon: Receipt,
    n: "06",
    t: "Receipt + return",
    b: "The chat returns a Celoscan link, the attribution suffix and an x402 receipt where the agent leg was used. Day-two nudges drive returning activity.",
  },
];

function ProductPage() {
  return (
    <PageShell
      eyebrow="Product"
      title={
        <>
          One chat job, one signature, <span className="serif italic">settled</span>.
        </>
      }
      lede="TILL is a payment till that lives in a chat thread. It resolves who gets paid, proves they are independent, and settles in cNGN or USA₮ on Celo mainnet — tagged end to end."
    >
      <section className="section">
        <div className="wrap">
          <div className="grid grid-3">
            {steps.map((s) => (
              <div className="card card-hover" key={s.n}>
                <div className="card-icon">
                  <s.icon size={18} strokeWidth={1.8} />
                </div>
                <div className="step-num">{s.n}</div>
                <h3 className="h3">{s.t}</h3>
                <p className="body-sm">{s.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <p className="eyebrow">Architecture</p>
          <h2 className="h2">What runs under the thread.</h2>
          <div className="grid grid-2" style={{ marginTop: 36, gap: 44, alignItems: "start" }}>
            <div className="card" style={{ background: "#fff" }}>
              <pre
                className="mono"
                style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, fontSize: 12.5 }}
              >{`Telegram bot ← user intent
  → resolve counterparty (independence policy)
  → user signs EIP-3009 / MiniPay
  → transfer + toDataSuffix(attributionTag)
  → optional x402 quote/resolve leg (USA₮ / USDC)
  → fee abstraction: gas in ERC-20
ERC-8004 agent identity · Para wallet hygiene`}</pre>
            </div>
            <div>
              <h3 className="h3">A conversation, not a form</h3>
              <p className="body-sm" style={{ marginBottom: 20 }}>
                The interface is the sentence people already send each other. Everything else —
                policy, signing, tagging, gas — is infrastructure the user never sees.
              </p>
              <div className="chat">
                <div className="bubble bubble-user">send 5 cNGN to Ama</div>
                <div className="bubble">
                  Ama · 0x7f2…c41 · independent ✓ · active on Celo since Jun 2026. Send ₦5,000 cNGN?
                </div>
                <div className="bubble bubble-user">yes</div>
                <div className="bubble">
                  Signed &amp; settled. Gas paid in cNGN. Tag celo_f30ff80110c6 · view on Celoscan.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid-3">
            {[
              {
                icon: Fingerprint,
                t: "Optional Self PoP",
                b: "High-value sends can require proof-of-personhood before the till releases the quote.",
              },
              {
                icon: Tags,
                t: "verifyTx after first send",
                b: "The first tagged transaction is verified against the registry so attribution is never silently broken.",
              },
              {
                icon: Fuel,
                t: "Forno + Chainstack RPC",
                b: "Free public RPC as the baseline, dedicated endpoints when throughput matters.",
              },
            ].map((f) => (
              <div className="card" key={f.t}>
                <div className="card-icon">
                  <f.icon size={18} strokeWidth={1.8} />
                </div>
                <h3 className="h3">{f.t}</h3>
                <p className="body-sm">{f.b}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <Link to="/stablecoins" className="btn-primary">
              Stablecoin paths <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
