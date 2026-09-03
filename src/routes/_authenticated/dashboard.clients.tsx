import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Copy, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/clients")({
  component: ClientsPage,
});

const empty = { name: "", company: "", email: "", phone: "", notes: "" };

function ClientsPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState(empty);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*, projects(id, name, status, progress)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("clients").insert({
        name: form.name,
        company: form.company || null,
        email: form.email,
        phone: form.phone || null,
        notes: form.notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setForm(empty);
      setOpen(false);
      qc.invalidateQueries({ queryKey: ["clients"] });
    },
  });

  const set = (k: keyof typeof empty) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const rows = data ?? [];

  return (
    <>
      <div className="dash-head">
        <div>
          <p className="eyebrow">Clients</p>
          <h1 className="h2">Accounts &amp; portal codes</h1>
        </div>
        <button className="btn-primary btn-sm" onClick={() => setOpen((o) => !o)}>
          <Plus size={15} strokeWidth={2} />
          New client
        </button>
      </div>

      <div className="dash-body">
        {open && (
          <div className="card" style={{ marginBottom: 24 }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                create.mutate();
              }}
            >
              <div className="grid grid-2" style={{ gap: 16 }}>
                <div className="field">
                  <label className="label" htmlFor="cn">
                    Contact name
                  </label>
                  <input id="cn" className="input" required value={form.name} onChange={set("name")} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="cc">
                    Company
                  </label>
                  <input id="cc" className="input" value={form.company} onChange={set("company")} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="ce">
                    Email
                  </label>
                  <input id="ce" type="email" className="input" required value={form.email} onChange={set("email")} />
                </div>
                <div className="field">
                  <label className="label" htmlFor="cp">
                    Phone
                  </label>
                  <input id="cp" className="input" value={form.phone} onChange={set("phone")} />
                </div>
              </div>
              <div className="field">
                <label className="label" htmlFor="cnotes">
                  Notes
                </label>
                <textarea id="cnotes" className="textarea" value={form.notes} onChange={set("notes")} />
              </div>
              <button className="btn-primary" disabled={create.isPending}>
                {create.isPending ? "Saving…" : "Add client"}
              </button>
            </form>
          </div>
        )}

        <div className="card">
          {isLoading && <p className="body-sm">Loading clients…</p>}
          {!isLoading && rows.length === 0 && (
            <p className="body-sm">No clients yet. Add one to generate a portal code.</p>
          )}
          {rows.length > 0 && (
            <div className="scroll-x">
              <table className="table">
                <thead>
                  <tr>
                    <th>Client</th>
                    <th>Contact</th>
                    <th>Projects</th>
                    <th>Status</th>
                    <th>Portal code</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <strong>{c.company ?? c.name}</strong>
                        <br />
                        <span className="body-sm">{c.name}</span>
                      </td>
                      <td className="body-sm">
                        {c.email}
                        {c.phone ? <br /> : null}
                        {c.phone}
                      </td>
                      <td className="body-sm">{c.projects?.length ?? 0} active</td>
                      <td>
                        <span className="badge badge-ok">{c.status}</span>
                      </td>
                      <td>
                        <button
                          className="code-copy mono"
                          onClick={() => {
                            navigator.clipboard.writeText(c.portal_code);
                            setCopied(c.id);
                          }}
                        >
                          {c.portal_code}
                          <Copy size={13} strokeWidth={1.9} />
                          {copied === c.id && <span className="body-sm">copied</span>}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
