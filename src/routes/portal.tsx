import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound, MessageSquare } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { getClientPortal, type PortalResult } from "@/lib/portal.functions";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Client portal — TILL" },
      {
        name: "description",
        content: "Enter your portal code to track project stage, progress and the latest studio updates.",
      },
      { property: "og:title", content: "Client portal — TILL" },
      { property: "og:description", content: "Track your project stage, progress and updates." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PortalPage,
});

const stageLabel: Record<string, string> = {
  discovery: "Discovery",
  design: "Design",
  build: "Build",
  review: "Review",
  live: "Live",
};

function PortalPage() {
  const lookup = useServerFn(getClientPortal);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<PortalResult | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      setResult(await lookup({ data: { code } }));
    } catch {
      setResult({ ok: false });
    }
    setBusy(false);
  }

  return (
    <PageShell
      eyebrow="Client portal"
      title="Track your work"
      lede="Your portal code came with the kickoff email. It shows live stage, progress and every update we publish."
    >
      <div className="section-tight">
        <div className="card" style={{ maxWidth: 520 }}>
          <form onSubmit={submit}>
            <div className="field">
              <label className="label" htmlFor="code">
                Portal code
              </label>
              <input
                id="code"
                className="input mono"
                placeholder="A1B2C3D4"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                required
                minLength={4}
              />
            </div>
            <button className="btn-primary" style={{ width: "100%" }} disabled={busy}>
              <KeyRound size={16} strokeWidth={1.9} />
              {busy ? "Checking…" : "Open my portal"}
            </button>
          </form>
          {result && !result.ok && (
            <p className="form-error" style={{ marginTop: 16 }}>
              That code did not match a client. Check the kickoff email or ask your producer.
            </p>
          )}
        </div>

        {result?.ok && (
          <div style={{ marginTop: 48 }}>
            <div className="dash-head" style={{ padding: 0, border: "none" }}>
              <div>
                <p className="eyebrow">{result.client.company ?? "Client"}</p>
                <h2 className="h2">{result.client.name}</h2>
              </div>
              <span className="badge badge-ok">{result.client.status}</span>
            </div>

            {result.projects.length === 0 && (
              <p className="body-sm" style={{ marginTop: 24 }}>
                No projects are open yet. Your producer will add one after kickoff.
              </p>
            )}

            <div className="grid" style={{ gap: 20, marginTop: 28 }}>
              {result.projects.map((p) => (
                <div className="card" key={p.id}>
                  <div className="proj-head">
                    <div>
                      <h3 className="h3">{p.name}</h3>
                      <p className="body-sm">{p.summary}</p>
                    </div>
                    <span className={`badge ${p.status === "on_track" ? "badge-ok" : ""}`}>
                      {p.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="proj-meta">
                    <span className="tag">{stageLabel[p.stage] ?? p.stage}</span>
                    <span className="body-sm">
                      {p.due_date ? `Due ${new Date(p.due_date).toLocaleDateString()}` : "No due date"}
                    </span>
                  </div>

                  <div className="progress" aria-label={`${p.progress}% complete`}>
                    <div className="progress-bar" style={{ width: `${p.progress}%` }} />
                  </div>
                  <p className="body-sm">{p.progress}% complete</p>

                  {p.updates.length > 0 && (
                    <ul className="timeline">
                      {p.updates.map((u) => (
                        <li key={u.id}>
                          <MessageSquare size={14} strokeWidth={1.9} />
                          <div>
                            <strong>{u.title}</strong>
                            <p className="body-sm">{u.body}</p>
                            <span className="mono">{new Date(u.created_at).toLocaleDateString()}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
