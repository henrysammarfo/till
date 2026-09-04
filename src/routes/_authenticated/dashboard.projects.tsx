import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Plus, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/projects")({
  component: ProjectsPage,
});

const stages = ["discovery", "design", "build", "review", "live"] as const;
const statuses = ["on_track", "at_risk", "blocked", "done"] as const;

const emptyProject = {
  client_id: "",
  name: "",
  stage: "discovery",
  status: "on_track",
  progress: 0,
  due_date: "",
  budget: "",
  summary: "",
};

function ProjectsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyProject);
  const [updateFor, setUpdateFor] = useState<string | null>(null);
  const [note, setNote] = useState({ title: "", body: "" });

  const clients = useQuery({
    queryKey: ["clients", "min"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("id, name, company").order("name");
      if (error) throw error;
      return data;
    },
  });

  const projects = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*, clients(name, company), project_updates(id, title, body, created_at)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createProject = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("projects").insert({
        client_id: form.client_id,
        name: form.name,
        stage: form.stage,
        status: form.status,
        progress: Number(form.progress),
        due_date: form.due_date || null,
        budget: form.budget ? Number(form.budget) : null,
        summary: form.summary || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setForm(emptyProject);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const patch = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: Record<string, unknown> }) => {
      const { error } = await supabase.from("projects").update(values).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["projects"] }),
  });

  const addUpdate = useMutation({
    mutationFn: async (projectId: string) => {
      const { error } = await supabase
        .from("project_updates")
        .insert({ project_id: projectId, title: note.title, body: note.body || null });
      if (error) throw error;
    },
    onSuccess: () => {
      setNote({ title: "", body: "" });
      setUpdateFor(null);
      qc.invalidateQueries({ queryKey: ["projects"] });
    },
  });

  const set = (k: keyof typeof emptyProject) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const rows = projects.data ?? [];

  return (
    <>
      <div className="dash-head">
        <div>
          <p className="eyebrow">Delivery</p>
          <h1 className="h2">Projects</h1>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setOpen((o) => !o)}>
          <Plus size={15} strokeWidth={2} />
          New project
        </button>
      </div>

      <div className="dash-body">
        {open && (
          <div className="card" style={{ marginBottom: 24 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createProject.mutate();
              }}
            >
              <div className="grid grid-2" style={{ gap: 16 }}>
                <div className="field">
                  <label className="label" htmlFor="pc">
                    Client
                  </label>
                  <select id="pc" className="select" required value={form.client_id} onChange={set("client_id")}>
                    <option value="">Select a client…</option>
                    {(clients.data ?? []).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.company ?? c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label" htmlFor="pn">
                    Project name
                  </label>
                  <input id="pn" className="input" required value={form.name} onChange={set("name")} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="ps">
                    Stage
                  </label>
                  <select id="ps" className="select" value={form.stage} onChange={set("stage")}>
                    {stages.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label className="label" htmlFor="pd">
                    Due date
                  </label>
                  <input id="pd" type="date" className="input" value={form.due_date} onChange={set("due_date")} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="pb">
                    Budget
                  </label>
                  <input id="pb" type="number" className="input" value={form.budget} onChange={set("budget")} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="pp">
                    Progress %
                  </label>
                  <input
                    id="pp"
                    type="number"
                    min={0}
                    max={100}
                    className="input"
                    value={form.progress}
                    onChange={set("progress")}
                  />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="psum">
                  Summary shown to the client
                </label>
                <textarea id="psum" className="textarea" value={form.summary} onChange={set("summary")} />
              </div>
              <button className="btn-primary" disabled={createProject.isPending}>
                {createProject.isPending ? "Saving…" : "Create project"}
              </button>
            </form>
          </div>
        )}

        {projects.isLoading && <p className="body-sm">Loading projects…</p>}
        {!projects.isLoading && rows.length === 0 && (
          <div className="card">
            <p className="body-sm">No projects yet. Add a client first, then open a project against them.</p>
          </div>
        )}

        <div className="grid" style={{ gap: 20 }}>
          {rows.map((p) => (
            <div className="card" key={p.id}>
              <div className="proj-head">
                <div>
                  <p className="eyebrow">{p.clients?.company ?? p.clients?.name}</p>
                  <h3 className="h3">{p.name}</h3>
                  <p className="body-sm">{p.summary}</p>
                </div>
                <span className={`badge ${p.status === "on_track" ? "badge-ok" : "badge-dark"}`}>
                  {p.status.replace("_", " ")}
                </span>
              </div>

              <div className="proj-meta">
                <select
                  className="select select-sm"
                  value={p.stage}
                  onChange={(e) => patch.mutate({ id: p.id, values: { stage: e.target.value } })}
                >
                  {stages.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <select
                  className="select select-sm"
                  value={p.status}
                  onChange={(e) => patch.mutate({ id: p.id, values: { status: e.target.value } })}
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s.replace("_", " ")}
                    </option>
                  ))}
                </select>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  defaultValue={p.progress}
                  onMouseUp={(e) =>
                    patch.mutate({ id: p.id, values: { progress: Number(e.currentTarget.value) } })
                  }
                  onTouchEnd={(e) =>
                    patch.mutate({ id: p.id, values: { progress: Number(e.currentTarget.value) } })
                  }
                />
                <span className="body-sm">{p.progress}%</span>
                <span className="body-sm">
                  {p.due_date ? `Due ${new Date(p.due_date).toLocaleDateString()}` : "No due date"}
                </span>
              </div>

              <div className="progress">
                <div className="progress-bar" style={{ width: `${p.progress}%` }} />
              </div>

              <ul className="timeline">
                {(p.project_updates ?? [])
                  .slice()
                  .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
                  .map((u) => (
                    <li key={u.id}>
                      <span className="dot-green" />
                      <div>
                        <strong>{u.title}</strong>
                        <p className="body-sm">{u.body}</p>
                        <span className="mono">{new Date(u.created_at).toLocaleDateString()}</span>
                      </div>
                    </li>
                  ))}
              </ul>

              {updateFor === p.id ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addUpdate.mutate(p.id);
                  }}
                >
                  <div className="field">
                    <label className="label" htmlFor={`ut-${p.id}`}>
                      Update title
                    </label>
                    <input
                      id={`ut-${p.id}`}
                      className="input"
                      required
                      value={note.title}
                      onChange={(e) => setNote((n) => ({ ...n, title: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label className="label" htmlFor={`ub-${p.id}`}>
                      Detail
                    </label>
                    <textarea
                      id={`ub-${p.id}`}
                      className="textarea"
                      value={note.body}
                      onChange={(e) => setNote((n) => ({ ...n, body: e.target.value }))}
                    />
                  </div>
                  <button className="btn-primary btn-sm" disabled={addUpdate.isPending}>
                    <Send size={14} strokeWidth={2} />
                    Publish to client
                  </button>
                </form>
              ) : (
                <button className="btn-secondary btn-sm" onClick={() => setUpdateFor(p.id)}>
                  Post an update
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
