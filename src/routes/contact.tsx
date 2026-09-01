import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Github, MapPin, MessageCircle, Send } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Get in touch — open a TILL® till or partner with us" },
      {
        name: "description",
        content:
          "Talk to the TILL team about opening a merchant till, integrating the agent path, or joining the merch drop. Based in Accra, settling on Celo mainnet.",
      },
      { property: "og:title", content: "Get in touch with TILL®" },
      {
        property: "og:description",
        content: "Open a till, integrate the agent path, or join the drop list.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <PageShell
      eyebrow="Contact"
      title={
        <>
          Say who, and how <span className="serif italic">much</span>.
        </>
      }
      lede="Tell us what you want the till to do. We reply in the same medium we build in — chat, fast."
    >
      <section className="section">
        <div className="wrap">
          <div className="grid grid-2" style={{ gap: 56, alignItems: "start" }}>
            <form
              className="card"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <div className="field">
                <label className="label" htmlFor="name">
                  Name
                </label>
                <input className="input" id="name" name="name" required placeholder="Ama Mensah" />
              </div>
              <div className="field">
                <label className="label" htmlFor="handle">
                  Telegram handle
                </label>
                <input className="input" id="handle" name="handle" placeholder="@yourhandle" />
              </div>
              <div className="field">
                <label className="label" htmlFor="topic">
                  What do you need?
                </label>
                <select className="select" id="topic" name="topic" defaultValue="merchant">
                  <option value="personal">A personal till</option>
                  <option value="merchant">A merchant till</option>
                  <option value="agent">Agent / x402 integration</option>
                  <option value="merch">Merch drop list</option>
                </select>
              </div>
              <div className="field">
                <label className="label" htmlFor="message">
                  Message
                </label>
                <textarea
                  className="textarea"
                  id="message"
                  name="message"
                  placeholder="We run a trading group in Accra and settle in cNGN…"
                />
              </div>
              <button className="btn-primary" type="submit">
                {sent ? "Thanks — we'll reply in chat" : "Send message"}
                <Send size={16} />
              </button>
              {sent && (
                <p className="body-sm">
                  Message queued. For anything urgent, ping the till directly on Telegram.
                </p>
              )}
            </form>

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                {
                  icon: MessageCircle,
                  t: "Telegram",
                  b: "@tillagent — the fastest way to reach a human or the bot.",
                },
                {
                  icon: Github,
                  t: "GitHub",
                  b: "github.com/till-agent/till — public repository, open issues.",
                },
                {
                  icon: MapPin,
                  t: "Accra, Ghana",
                  b: "Built where MiniPay is already daily infrastructure.",
                },
              ].map((c) => (
                <div className="card" key={c.t} style={{ display: "flex", gap: 16 }}>
                  <div className="card-icon" style={{ marginBottom: 0, flex: "none" }}>
                    <c.icon size={18} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="h3" style={{ margin: 0 }}>
                      {c.t}
                    </h3>
                    <p className="body-sm">{c.b}</p>
                  </div>
                </div>
              ))}
              <div className="card" style={{ background: "var(--text)", borderColor: "var(--text)" }}>
                <h3 className="h3" style={{ color: "#fff" }}>
                  Submission window
                </h3>
                <p className="body-sm" style={{ color: "rgba(255,255,255,0.62)" }}>
                  Counting from 28 Aug 2026 · submission 14 Sep 2026, 09:00 GMT · Celo mainnet only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
