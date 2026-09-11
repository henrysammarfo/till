import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Check, Clock, Video } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/book")({
  head: () => ({
    meta: [
      { title: "Book a 15-minute call — TILL" },
      {
        name: "description",
        content:
          "Pick a slot for a 15-minute intro call with the TILL team. Tell us what you are shipping and we reply with a confirmed time.",
      },
      { property: "og:title", content: "Book a 15-minute call — TILL" },
      {
        property: "og:description",
        content: "Fifteen focused minutes on your payment, product or brand work.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookPage,
});

const topics = [
  { value: "intro", label: "Intro call" },
  { value: "payments", label: "Payments / stablecoin build" },
  { value: "product", label: "Product & design sprint" },
  { value: "brand", label: "Brand & merch" },
  { value: "support", label: "Existing project support" },
];

function BookPage() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    topic: "intro",
    date: "",
    time: "10:00",
    message: "",
  });

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const preferred = new Date(`${form.date}T${form.time}:00`);
    const { error } = await supabase.from("bookings").insert({
      name: form.name,
      email: form.email,
      company: form.company || null,
      topic: form.topic,
      preferred_at: preferred.toISOString(),
      message: form.message || null,
    });
    if (error) setError("We could not save that slot. Please try again.");
    else setSent(true);
    setBusy(false);
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <PageShell
      eyebrow="Booking"
      title="Chat for 15 minutes"
      lede="Pick a slot that suits you. We confirm by email within one working day, and the request lands straight in our studio dashboard."
    >
      <div className="section-tight">
        <div className="wrap">
        <div className="grid grid-2">
          <div className="card">
            {sent ? (
              <div className="booked">
                <div className="card-icon">
                  <Check size={18} strokeWidth={1.9} />
                </div>
                <h2 className="h3">Slot requested</h2>
                <p className="body-sm">
                  Thanks {form.name.split(" ")[0]} — we have your request for{" "}
                  {new Date(`${form.date}T${form.time}`).toLocaleString()}. A confirmation lands at{" "}
                  {form.email}.
                </p>
                <Link to="/portal" className="btn-secondary" style={{ marginTop: 20 }}>
                  Already a client? Open the portal
                </Link>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="field">
                  <label className="label" htmlFor="bname">
                    Your name
                  </label>
                  <input id="bname" className="input" required value={form.name} onChange={set("name")} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="bemail">
                    Email
                  </label>
                  <input
                    id="bemail"
                    type="email"
                    className="input"
                    required
                    value={form.email}
                    onChange={set("email")}
                  />
                </div>
                <div className="field">
                  <label className="label" htmlFor="bcompany">
                    Company (optional)
                  </label>
                  <input id="bcompany" className="input" value={form.company} onChange={set("company")} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="btopic">
                    What is it about?
                  </label>
                  <select id="btopic" className="select" value={form.topic} onChange={set("topic")}>
                    {topics.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-2" style={{ gap: 16 }}>
                  <div className="field">
                    <label className="label" htmlFor="bdate">
                      Preferred date
                    </label>
                    <input
                      id="bdate"
                      type="date"
                      min={today}
                      className="input"
                      required
                      value={form.date}
                      onChange={set("date")}
                    />
                  </div>
                  <div className="field">
                    <label className="label" htmlFor="btime">
                      Time (GMT)
                    </label>
                    <input
                      id="btime"
                      type="time"
                      className="input"
                      required
                      value={form.time}
                      onChange={set("time")}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor="bmsg">
                    Anything we should read first?
                  </label>
                  <textarea id="bmsg" className="textarea" value={form.message} onChange={set("message")} />
                </div>
                {error && <p className="form-error">{error}</p>}
                <button className="btn-primary" style={{ width: "100%" }} disabled={busy}>
                  <CalendarClock size={16} strokeWidth={1.9} />
                  {busy ? "Saving…" : "Request this slot"}
                </button>
              </form>
            )}
          </div>

          <div className="grid" style={{ gap: 16, alignContent: "start" }}>
            <div className="card">
              <div className="card-icon">
                <Clock size={18} strokeWidth={1.9} />
              </div>
              <h3 className="h3">Fifteen minutes, no deck</h3>
              <p className="body-sm">
                One call, one decision: whether we are the right studio for the work. No pitch theatre.
              </p>
            </div>
            <div className="card">
              <div className="card-icon">
                <Video size={18} strokeWidth={1.9} />
              </div>
              <h3 className="h3">Wherever you are</h3>
              <p className="body-sm">
                Google Meet, Telegram or a plain phone call. Accra hours, flexible for other timezones.
              </p>
            </div>
            <div className="card">
              <h3 className="h3">What happens next</h3>
              <ol className="checklist" style={{ marginTop: 14 }}>
                <li>Your request appears in our studio dashboard instantly.</li>
                <li>We confirm or propose the nearest slot by email.</li>
                <li>Win the work and you get a client portal code to track it.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
      </div>
    </PageShell>
  );
}
