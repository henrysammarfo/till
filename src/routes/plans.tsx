import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/plans")({
  head: () => ({
    meta: [
      { title: "Plans — run a TILL till for your group, shop or agent | TILL®" },
      {
        name: "description",
        content:
          "Three ways to run TILL: a free personal till in Telegram, a merchant till with settlement reporting, and an agent till with x402 quoting and ERC-8004 identity.",
      },
      { property: "og:title", content: "TILL plans" },
      {
        property: "og:description",
        content: "Personal, merchant and agent tills — all settling in cNGN or USA₮ on Celo.",
      },
    ],
  }),
  component: PlansPage,
});

const plans = [
  {
    name: "Personal",
    price: "Free",
    note: "For traders, students and groups",
    features: [
      "Telegram till for one wallet",
      "cNGN sends with fee abstraction",
      "Attribution-tagged transactions",
      "Celoscan receipt in chat",
      "Day-two return reminders",
    ],
    cta: "Start in Telegram",
    featured: false,
  },
  {
    name: "Merchant",
    price: "1%",
    note: "Take-rate on settled quotes",
    features: [
      "Multi-operator till with roles",
      "cNGN + USA₮ settlement paths",
      "Independence policy enforcement",
      "Dashboard with verified-user metrics",
      "CSV and Dune-ready exports",
      "Priority RPC via Chainstack",
    ],
    cta: "Open a merchant till",
    featured: true,
  },
  {
    name: "Agent",
    price: "Custom",
    note: "For agent builders and protocols",
    features: [
      "x402 quote/resolve microservice",
      "ERC-8004 identity provisioning",
      "Your own attribution tag",
      "Sponsored relay + EIP-3009 signing",
      "Self proof-of-personhood hooks",
      "Direct engineering support",
    ],
    cta: "Talk to us",
    featured: false,
  },
];

function PlansPage() {
  return (
    <PageShell
      eyebrow="Plans"
      title={
        <>
          Pick a till. Start <span className="serif italic">today</span>.
        </>
      }
      lede="No seat licences, no setup fees. You pay only when value actually settles — and every plan runs on Celo mainnet with attribution from the first transaction."
    >
      <section className="section">
        <div className="wrap">
          <div className="grid grid-3">
            {plans.map((p) => (
              <div className={`plan${p.featured ? " plan-featured" : ""}`} key={p.name}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h3 className="h3" style={{ margin: 0 }}>
                    {p.name}
                  </h3>
                  {p.featured && <span className="tag tag-solid">Most used</span>}
                </div>
                <div className="price">{p.price}</div>
                <p className="body-sm">{p.note}</p>
                <hr className="divider" />
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>
                      <Check size={15} strokeWidth={2} style={{ marginTop: 2, flex: "none" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={p.featured ? "btn-primary" : "btn-secondary"}
                  style={{ marginTop: "auto" }}
                >
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <p className="eyebrow">Included everywhere</p>
          <h2 className="h2">The non-negotiables.</h2>
          <div className="grid grid-4" style={{ marginTop: 36 }}>
            {[
              ["Mainnet only", "Nothing is scored or settled on testnet."],
              ["Tagged transactions", "@celo/attribution-tags on every user-facing send."],
              ["Gasless users", "Fee abstraction means no CELO required."],
              ["Honest disclosure", "Operator wallets and contracts declared publicly."],
            ].map(([t, b]) => (
              <div className="card" key={t} style={{ background: "#fff" }}>
                <h3 className="h3">{t}</h3>
                <p className="body-sm">{b}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 32 }}>
            <Link to="/faq" className="btn-secondary">
              Read the FAQs <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
