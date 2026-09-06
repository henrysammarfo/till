/**
 * Bootstraps a live tenant + agent_config for Studio / Telegram till.
 * Schema: tenants(slug,name) + agent_config(tenant_id, …) — no invented columns.
 *
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY and applied multitenant migration.
 *
 * Usage:
 *   bun run scripts/bootstrap-tenant.ts \
 *     --slug till \
 *     --name "TILL" \
 *     --telegram-username YourTillBot \
 *     --agent-wallet 0x...
 */
import { createClient } from "@supabase/supabase-js";
import { isAddress, getAddress } from "viem";

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

function requireArg(name: string): string {
  const v = arg(name);
  if (!v) throw new Error(`Missing --${name}`);
  return v;
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required — no fallbacks");
  }

  const slug = requireArg("slug");
  const name = requireArg("name");
  const telegramUsername = requireArg("telegram-username").replace(/^@/, "");
  const agentWalletRaw = requireArg("agent-wallet");
  if (!isAddress(agentWalletRaw)) throw new Error("Invalid --agent-wallet");
  const agentWallet = getAddress(agentWalletRaw);

  const tag = process.env.CELO_ATTRIBUTION_TAG ?? null;
  const erc8004 = process.env.CELO_ERC8004_URL ?? null;

  const admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: tenant, error: tenantError } = await admin
    .from("tenants")
    .upsert({ slug, name }, { onConflict: "slug" })
    .select("*")
    .single();

  if (tenantError || !tenant) {
    throw new Error(tenantError?.message ?? "tenant upsert failed");
  }

  const { data: existing } = await admin
    .from("agent_config")
    .select("id")
    .eq("tenant_id", tenant.id)
    .maybeSingle();

  const payload = {
    tenant_id: tenant.id,
    agent_wallet: agentWallet,
    telegram_bot_username: telegramUsername,
    attribution_tag: tag,
    erc8004_url: erc8004,
    primary_track: "real-world-adoption",
  };

  const { data: agent, error: agentError } = existing
    ? await admin
        .from("agent_config")
        .update(payload)
        .eq("tenant_id", tenant.id)
        .select("*")
        .single()
    : await admin.from("agent_config").insert(payload).select("*").single();

  if (agentError || !agent) {
    throw new Error(agentError?.message ?? "agent_config write failed");
  }

  console.log(
    JSON.stringify(
      {
        tenant,
        agent,
        next: [
          "Set PUBLIC_APP_URL to your deployed HTTPS origin",
          "bun run register:telegram",
          "Register via npx skills add https://celobuilders.xyz — then set CELO_ATTRIBUTION_TAG + CELO_AGENT_WALLET",
          "bun run register:agent",
          "Telegram: send 5 cNGN to 0xIndependentCounterparty",
        ],
        note: "Residual risk remains — see memory/THREAT_MODEL.md. Not unhackable.",
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
