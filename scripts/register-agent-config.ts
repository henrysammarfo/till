/**
 * Register / refresh agent_config from env after contest registration.
 * Requires SUPABASE_SERVICE_ROLE_KEY + tenant migration applied.
 */
import { createClient } from "@supabase/supabase-js";

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");

  const tag = process.env.CELO_ATTRIBUTION_TAG;
  const wallet = process.env.CELO_AGENT_WALLET;
  const erc8004 =
    process.env.CELO_ERC8004_URL ||
    "https://github.com/henrysammarfo/till/blob/main/public/agent/registration.json";
  if (!tag || !wallet) {
    throw new Error(
      "Set CELO_ATTRIBUTION_TAG and CELO_AGENT_WALLET after hackathon registration — no placeholders.",
    );
  }

  const sb = createClient(url, key, { auth: { persistSession: false } });
  const slug = process.env.TILL_DEFAULT_TENANT_SLUG || "till";
  let { data: tenant } = await sb.from("tenants").select("id").eq("slug", slug).maybeSingle();
  if (!tenant) {
    const inserted = await sb.from("tenants").insert({ slug, name: "TILL" }).select("id").single();
    if (inserted.error) throw new Error(inserted.error.message);
    tenant = inserted.data;
    await sb.from("agent_config").insert({ tenant_id: tenant.id });
  }

  const { error } = await sb
    .from("agent_config")
    .update({
      attribution_tag: tag,
      agent_wallet: wallet,
      erc8004_url: erc8004,
      primary_track: "real-world-adoption",
    })
    .eq("tenant_id", tenant.id);
  if (error) throw new Error(error.message);

  console.log(JSON.stringify({ ok: true, tenantId: tenant.id, tag, wallet, erc8004 }, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
