import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Banknote, Coins, Globe2, Repeat, Zap } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/stablecoins")({
  head: () => ({
    meta: [
      { title: "Stablecoin paths — cNGN and USA₮ with x402 settlement | TILL®" },
      {
        name: "description",
        content:
          "TILL settles in cNGN for direct naira payouts and USA₮ over x402 for agent microservice legs, with fee abstraction so users never hold a gas token.",
      },
      { property: "og:title", content: "Stablecoin paths on TILL" },
      {
        property: "og:description",
        content: "cNGN direct payouts, USA₮ + x402 agent settlement, gas paid in stablecoin.",
      },
    ],
  }),
  component: StablecoinsPage,
});

const paths = [
  {
    icon: Banknote,
    tag: "Direct",
    t: "cNGN",
    b: "Naira-denominated settlement straight into an independent MiniPay wallet. The shortest distance between a chat request and money that spends in Accra and Lagos.",
    points: ["EIP-3009 authorised", "Attribution suffix on every transfer", "Gas paid in cNGN"],
  },
  {
    icon: Zap,
    tag: "Agent leg",
    t: "USA₮ + x402",
    b: "The agent microservice quotes and resolves over x402. The facilitator cannot carry a tag, so attribution falls back to the agent wallet address — declared honestly at registration.",
    points: ["x402.celo.org quote/resolve", "Attributed by agentWalletAddress", "Highest bounty weight"],
  },
  {
    icon: Repeat,
    tag: "Bridge",
    t: "USDC / wFIAT",
    b: "Where a counterparty prefers dollars or a Ripio wFIAT rail, TILL quotes the conversion in-thread and settles on the same tagged path.",
    points: ["Quote shown before signing", "Same independence policy", "Single receipt in chat"],
  },
];

function StablecoinsPage() {
  return (
    <PageShell
      eyebrow="Stablecoins"
      title={
        <>
          cNGN for the street. USA₮ for the <span className="serif italic">machines</span>.
        </>
      }
      lede="Two settlement paths, one till. Local currency stablecoin for real payouts, dollar stablecoin over x402 for agent-to-agent work — both tagged, both on Celo mainnet."
    >
      <section className="section">
        <div className="wrap">
          <div className="grid grid-3">
            {paths.map((p) => (
              <div className="card card-hover" key={p.t}>
                <div className="card-icon">
                  <p.icon size={18} strokeWidth={1.8} />
                </div>
                <span className="tag" style={{ marginBottom: 14 }}>
                  {p.tag}
                </span>
                <h3 className="h3" style={{ fontSize: 26, letterSpacing: "-0.05em", marginTop: 12 }}>
                  {p.t}
                </h3>
                <p className="body-sm">{p.b}</p>
                <ul className="checklist" style={{ marginTop: 18 }}>
                  {p.points.map((pt) => (
                    <li key={pt}>
                      <Coins size={15} strokeWidth={1.8} style={{ marginTop: 2, flex: "none" }} />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--surface)" }}>
        <div className="wrap">
          <p className="eyebrow">Who counts as a user</p>
          <h2 className="h2">Authorisers, not gas payers.</h2>
          <p className="lede">
            A person who signs an EIP-3009 authorization or a sponsored relay message is a user —
            even when they never touch a gas token. That is exactly the population MiniPay creates,
            and exactly the population TILL serves.
          </p>
          <div className="grid grid-4" style={{ marginTop: 40 }}>
            {[
              ["EIP-3009", "Transfer authorization signed off-chain"],
              ["Sponsored relay", "Signer counted, relayer pays"],
              ["Fee abstraction", "Gas denominated in the ERC-20"],
              ["Returning", "Active on two or more distinct days"],
            ].map(([t, b]) => (
              <div className="stat" key={t}>
                <div className="stat-label">{t}</div>
                <p className="body-sm">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="grid grid-2" style={{ gap: 44, alignItems: "center" }}>
            <div>
              <div className="card-icon">
                <Globe2 size={18} strokeWidth={1.8} />
              </div>
              <h2 className="h2">Accra first, chat everywhere.</h2>
              <p className="lede">
                Day-zero distribution is Telegram groups and MiniPay wallets in Accra. The same till
                loop generalises to any market where chat is already the payment interface.
              </p>
              <div style={{ marginTop: 26 }}>
                <Link to="/agent" className="btn-primary">
                  Agent identity <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
            <div className="grid grid-2">
              {[
                ["₦5,000", "Median till job"],
                ["< 6s", "Intent to receipt"],
                ["0", "Gas tokens held by users"],
                ["100%", "Mainnet settlement"],
              ].map(([n, l]) => (
                <div className="stat" key={l}>
                  <div className="stat-label">{l}</div>
                  <div className="num">{n}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
