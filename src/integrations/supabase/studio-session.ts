import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { writeAuthCookies } from "./auth-cookies";

const hydrateSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

/**
 * After browser sign-in, mirror tokens into HttpOnly cookies and ensure default tenant.
 */
export const completeStudioSignIn = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => hydrateSchema.parse(data))
  .handler(async ({ data }) => {
    writeAuthCookies(data);

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Missing Supabase env for session hydrate");

    const client = createClient(url, key, {
      global: { headers: { Authorization: `Bearer ${data.access_token}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: userData, error } = await client.auth.getUser(data.access_token);
    if (error || !userData.user) throw new Error(error?.message ?? "Invalid session");

    const slug = process.env.TILL_DEFAULT_TENANT_SLUG || "till";
    const { data: tenantId, error: tenantError } = await client.rpc("ensure_default_till_tenant", {
      _user_id: userData.user.id,
      _slug: slug,
      _name: "TILL",
    });
    if (tenantError) {
      throw new Error(`Tenant bootstrap failed: ${tenantError.message}`);
    }

    return { ok: true as const, userId: userData.user.id, tenantId };
  });
