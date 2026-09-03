import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const codeSchema = z.object({ code: z.string().trim().min(4).max(32) });

export type PortalProject = {
  id: string;
  name: string;
  stage: string;
  status: string;
  progress: number;
  due_date: string | null;
  summary: string | null;
  updates: { id: string; title: string; body: string | null; created_at: string }[];
};

export type PortalResult =
  | { ok: false }
  | {
      ok: true;
      client: { name: string; company: string | null; status: string };
      projects: PortalProject[];
    };

export const getClientPortal = createServerFn({ method: "POST" })
  .inputValidator((data) => codeSchema.parse(data))
  .handler(async ({ data }): Promise<PortalResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: client } = await supabaseAdmin
      .from("clients")
      .select("id, name, company, status")
      .eq("portal_code", data.code.toUpperCase())
      .maybeSingle();

    if (!client) return { ok: false };

    const { data: projects } = await supabaseAdmin
      .from("projects")
      .select("id, name, stage, status, progress, due_date, summary")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false });

    const ids = (projects ?? []).map((p) => p.id);
    const { data: updates } = ids.length
      ? await supabaseAdmin
          .from("project_updates")
          .select("id, project_id, title, body, created_at")
          .in("project_id", ids)
          .eq("client_visible", true)
          .order("created_at", { ascending: false })
      : { data: [] };

    return {
      ok: true,
      client: { name: client.name, company: client.company, status: client.status },
      projects: (projects ?? []).map((p) => ({
        ...p,
        updates: (updates ?? [])
          .filter((u) => u.project_id === p.id)
          .map(({ id, title, body, created_at }) => ({ id, title, body, created_at })),
      })),
    };
  });
