import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Github, MapPin, MessageCircle, Send } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";
import { AGENT_IDENTITY } from "@/lib/agent-identity";

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
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    handle: "",
    topic: "merchant",
    message: "",
  });

  const set =
    (k: keyof typeof form) => (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const body = [
      form.handle ? `Telegram: ${form.handle}` : null,
      form.message || null,
    ]
      .filter(Boolean)
      .join("\n\n");
    const { error: insertError } = await supabase.from("bookings").insert({
      name: form.name,
      email: form.email,
      company: null,
      topic: `contact:${form.topic}`,
      preferred_at: new Date().toISOString(),
      message: body || null,
    });
    if (insertError) setError("We could not send that. Try again or ping Telegram.");
    else setSent(true);
    setBusy(false);
  }

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
            {sent ? (
              <div className="card">
                <h3 className="h3">Message received</h3>
                <p className="body-sm">
                  Thanks {form.name.split(" ")[0]} — we will reply to {form.email}
                  {form.handle ? ` or ${form.handle}` : ""}. For anything urgent, ping{" "}
                  <a href={AGENT_IDENTITY.telegramUrl} target="_blank" rel="noreferrer">
                    {AGENT_IDENTITY.telegramBot}
                  </a>
                  .
                </p>
                <Link to="/book" className="btn-secondary" style={{ marginTop: 20 }}>
                  Prefer a live call? Book 15 minutes
                </Link>
              </div>
            ) : (
              <form
                className="card"
                onSubmit={submit}
                style={{ display: "flex", flexDirection: "column", gap: 18 }}
              >
                <div className="field">
                  <label className="label" htmlFor="name">
                    Name
                  </label>
                  <input
                    className="input"
                    id="name"
                    name="name"
                    required
                    placeholder="Ama Mensah"
                    value={form.name}
                    onChange={set("name")}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="input"
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="ama@example.com"
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="handle">
                    Telegram handle
                  </label>
                  <input
                    className="input"
                    id="handle"
                    name="handle"
                    placeholder="@yourhandle"
                    value={form.handle}
                    onChange={set("handle")}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="topic">
                    What do you need?
                  </label>
                  <select
                    className="select"
                    id="topic"
                    name="topic"
                    value={form.topic}
                    onChange={set("topic")}
                  >
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
                    value={form.message}
                    onChange={set("message")}
                  />
                </div>
                {error && <p className="form-error">{error}</p>}
                <button className="btn-primary" type="submit" disabled={busy}>
                  {busy ? "Sending…" : "Send message"}
                  <Send size={16} />
                </button>
              </form>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {[
                {
                  icon: MessageCircle,
                  t: "Telegram",
                  b: `${AGENT_IDENTITY.telegramBot} — the fastest way to reach a human or the bot.`,
                  href: AGENT_IDENTITY.telegramUrl,
                },
                {
                  icon: Github,
                  t: "GitHub",
                  b: `${AGENT_IDENTITY.githubShort} — public repository, open issues.`,
                  href: AGENT_IDENTITY.githubUrl,
                },
                {
                  icon: MapPin,
                  t: "Accra, Ghana",
                  b: "Built where MiniPay is already daily infrastructure.",
                  href: null as string | null,
                },
              ].map((c) => (
                <div className="card" key={c.t} style={{ display: "flex", gap: 16 }}>
                  <div className="card-icon" style={{ marginBottom: 0, flex: "none" }}>
                    <c.icon size={18} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="h3" style={{ margin: 0 }}>
                      {c.href ? (
                        <a href={c.href} target="_blank" rel="noreferrer">
                          {c.t}
                        </a>
                      ) : (
                        c.t
                      )}
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
