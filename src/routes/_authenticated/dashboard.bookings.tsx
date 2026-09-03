import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/dashboard/bookings")({
  component: BookingsPage,
});

const statuses = ["pending", "confirmed", "completed", "declined"] as const;

function BookingsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("preferred_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bookings"] }),
  });

  const rows = data ?? [];
  const pending = rows.filter((r) => r.status === "pending").length;

  return (
    <>
      <div className="dash-head">
        <div>
          <p className="eyebrow">Bookings</p>
          <h1 className="h2">15-minute calls</h1>
        </div>
        <span className="badge badge-dark">{pending} awaiting reply</span>
      </div>

      <div className="dash-body">
        <div className="card">
          {isLoading && <p className="body-sm">Loading requests…</p>}
          {!isLoading && rows.length === 0 && (
            <div className="empty">
              <CalendarClock size={18} strokeWidth={1.9} />
              <p className="body-sm">No requests yet. Every booking from the site lands here.</p>
            </div>
          )}
          {rows.length > 0 && (
            <div className="scroll-x">
              <table className="table">
                <thead>
                  <tr>
                    <th>Requested slot</th>
                    <th>Who</th>
                    <th>Topic</th>
                    <th>Message</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b) => (
                    <tr key={b.id}>
                      <td className="mono">{new Date(b.preferred_at).toLocaleString()}</td>
                      <td>
                        <strong>{b.name}</strong>
                        <br />
                        <span className="body-sm">
                          {b.email}
                          {b.company ? ` · ${b.company}` : ""}
                        </span>
                      </td>
                      <td>
                        <span className="tag">{b.topic}</span>
                      </td>
                      <td className="body-sm" style={{ maxWidth: 280 }}>
                        {b.message ?? "—"}
                      </td>
                      <td>
                        <select
                          className="select select-sm"
                          value={b.status}
                          onChange={(e) => update.mutate({ id: b.id, status: e.target.value })}
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
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
