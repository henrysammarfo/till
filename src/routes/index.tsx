import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BadgeCheck, Fuel, MessagesSquare, ShieldCheck, Tags } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Marquee } from "@/components/Marquee";
import { HeroLines } from "@/components/HeroLines";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TILL® — The chat till for MiniPay stablecoin payments on Celo" },
      {
        name: "description",
        content:
          "TILL is a Telegram payment till: one chat job, one signature, cNGN or USA₮ settles on Celo mainnet — attribution-tagged, ERC-8004 identity, gas paid in stablecoin.",
      },
      { property: "og:title", content: "TILL® — The chat till for MiniPay" },
      {
        property: "og:description",
        content:
          "Say who and how much, sign once — cNGN or USA₮ lands with an independent party on Celo mainnet.",
      },
    ],
  }),
  component: Index,
});

const tickerItems = [
  "cNGN Payouts",
  "USA₮ x402",
  "Attribution Tags",
  "Fee Abstraction",
  "ERC-8004 Identity",
];

const partners = [
  { name: "MiniPay", font: "system-ui", weight: 800 },
  { name: "Celo", font: "Inter", weight: 600 },
  { name: "cNGN", font: "Georgia", weight: 500 },
  { name: "Tether", font: "system-ui", weight: 600 },
  { name: "Opera", font: "Inter", weight: 700 },
  { name: "x402", font: "Source Serif 4", weight: 600 },
  { name: "Chainstack", font: "Inter", weight: 600 },
  { name: "Ripio", font: "Georgia", weight: 700 },
  { name: "Para", font: "system-ui", weight: 800 },
  { name: "Forno", font: "Inter", weight: 600 },
];

function Index() {
  return (
    <>
      <Navbar />
      <main>
        <section className="hero">
          <HeroLines />

          <div className="ticker">
            <Marquee>
              {tickerItems.map((t) => (
                <span className="chip" key={t}>
                  {t}
                </span>
              ))}
            </Marquee>
          </div>

          <h1 className="hero-title">
            The chat till, <span className="serif italic">alwayzz</span>
            <sup className="reg">®</sup> settled.
          </h1>

          <p className="hero-sub">
            One chat job → a user-authorized cNGN or USA₮ send to an independent MiniPay wallet.
            Every transaction tagged, every agent on-chain, gas paid in stablecoin.
          </p>

          <div className="cta-row">
            <Link to="/plans" className="btn-primary">
              View Plans
            </Link>
            <a className="book-btn" href="https://t.me" target="_blank" rel="noreferrer">
              <img
                src="https://framerusercontent.com/images/hfneFL6CHBi5BnNvCeOaqU9HqE4.png"
                alt=""
                width={40}
                height={40}
              />
              <span>
                <span className="book-primary" style={{ display: "block" }}>
                  Chat for 15 minutes
                </span>
                <span className="book-secondary">
                  <span className="dot-green" /> Pick a slot
                </span>
              </span>
            </a>
          </div>

          <div className="hero-blur" />
        </section>

        {/* Trusted by */}
        <section className="trusted">
          <p className="trusted-label">Built on rails people already use daily</p>
          <Marquee>
            {partners.map((p) => (
              <span
                className="logo-item"
                key={p.name}
                style={{ fontFamily: p.font, fontWeight: p.weight }}
              >
                {p.name}
              </span>
            ))}
          </Marquee>
        </section>

        <hr className="divider" />

        {/* Value props */}
        <section className="section">
          <div className="wrap">
            <p className="eyebrow">Why TILL</p>
            <h2 className="h2">
              A cash register that lives <span className="serif italic">inside</span> the chat.
            </h2>
            <p className="lede">
              People already ask for money in chat. TILL turns that sentence into a signed,
              attributed stablecoin transfer on Celo mainnet — no app switch, no gas token.
            </p>

            <div className="grid grid-4" style={{ marginTop: 44 }}>
              {[
                {
                  icon: MessagesSquare,
                  title: "Counter job",
                  body: "Pay this person, this amount, now. Intent resolved from one chat message.",
                },
                {
                  icon: Fuel,
                  title: "Fee abstraction",
                  body: "Gas paid in ERC-20. Users never hold CELO to move stablecoins.",
                },
                {
                  icon: Tags,
                  title: "Attribution tags",
                  body: "Every user-facing tx carries celo_ + 12 hex via @celo/attribution-tags.",
                },
                {
                  icon: BadgeCheck,
                  title: "ERC-8004 identity",
                  body: "The agent is registered on-chain with a verifiable 8004scan record.",
                },
              ].map((f) => (
                <div className="card card-hover" key={f.title}>
                  <div className="card-icon">
                    <f.icon size={18} strokeWidth={1.8} />
                  </div>
                  <h3 className="h3">{f.title}</h3>
                  <p className="body-sm">{f.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Flow */}
        <section className="section" style={{ background: "var(--surface)" }}>
          <div className="wrap">
            <p className="eyebrow">The till loop</p>
            <h2 className="h2">Four beats, one signature.</h2>
            <div className="grid grid-4" style={{ marginTop: 40 }}>
              {[
                ["01", "Intent", "“Send 5 cNGN to Ama” arrives in the Telegram till."],
                ["02", "Independence", "Counterparty checked: not our wallet, not first-funded by us."],
                ["03", "Authorization", "User signs EIP-3009 or authorizes in MiniPay. One tap."],
                ["04", "Settlement", "Transfer + attribution suffix lands on Celo mainnet."],
              ].map(([n, t, b]) => (
                <div className="card" key={n} style={{ background: "transparent" }}>
                  <div className="step-num">{n}</div>
                  <h3 className="h3">{t}</h3>
                  <p className="body-sm">{b}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 32 }}>
              <Link to="/product" className="btn-secondary">
                See the full flow <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
        </section>

        {/* Metrics */}
        <section className="section">
          <div className="wrap">
            <div className="grid grid-2" style={{ alignItems: "center", gap: 56 }}>
              <div>
                <p className="eyebrow">Signals that count</p>
                <h2 className="h2">Verified users, not vanity volume.</h2>
                <p className="lede">
                  TILL optimizes for the metrics the leaderboard actually reads: distinct
                  authorisers, users with pre-Aug-28 Celo history, and people who come back on a
                  second day. No self-funded float.
                </p>
                <div style={{ display: "flex", gap: 10, marginTop: 24, flexWrap: "wrap" }}>
                  <span className="tag tag-solid">
                    <ShieldCheck size={12} /> Mainnet only
                  </span>
                  <span className="tag">No first-funding</span>
                  <span className="tag">Declared wallets</span>
                </div>
              </div>
              <div className="grid grid-2">
                {[
                  ["412", "Verified users"],
                  ["58%", "Returning day 2+"],
                  ["1,206", "Tagged transactions"],
                  ["100%", "Gasless authorisers"],
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

        {/* CTA */}
        <section className="section-tight">
          <div className="wrap">
            <div
              className="card"
              style={{
                background: "var(--text)",
                borderColor: "var(--text)",
                padding: "56px 44px",
                textAlign: "center",
              }}
            >
              <h2 className="h2" style={{ color: "#fff" }}>
                Open your till <span className="serif italic">today</span>.
              </h2>
              <p
                className="body-sm"
                style={{ color: "rgba(255,255,255,0.65)", margin: "0 auto", maxWidth: 460 }}
              >
                Start with the Telegram bot, settle in cNGN, and watch every tagged transaction land
                in your dashboard.
              </p>
              <div className="cta-row" style={{ justifyContent: "center" }}>
                <Link to="/contact" className="btn-secondary">
                  Get in touch
                </Link>
                <Link to="/dashboard" className="btn-secondary">
                  Open dashboard <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
