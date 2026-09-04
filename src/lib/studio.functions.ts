import { createServerFn } from "@tanstack/react-start";

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function defaultTenantId() {
  const sb = await admin();
  const slug = process.env.TILL_DEFAULT_TENANT_SLUG || "till";
  const { data, error } = await sb.from("tenants").select("id").eq("slug", slug).maybeSingle();
  if (error) throw new Error(error.message);
  return (data?.id as string | undefined) ?? null;
}

export const getStudioOverview = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const sb = await admin();
    const tenantId = await defaultTenantId();
    if (!tenantId) {
      return {
        tenantReady: false as const,
        verifiedUsers: 0,
        authorisers: 0,
        taggedTxs: 0,
        returningPct: 0,
        recent: [] as Array<Record<string, string>>,
      };
    }

    const { data: txs, error } = await sb
      .from("till_transactions")
      .select(
        "created_at, from_wallet, to_wallet, amount_display, path, tx_hash, attribution_verified",
      )
      .eq("tenant_id", tenantId)
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw new Error(error.message);

    const rows = txs ?? [];
    const authorisers = new Set(rows.map((r) => r.from_wallet as string));
    const daysByUser = new Map<string, Set<string>>();
    for (const r of rows) {
      const day = String(r.created_at).slice(0, 10);
      const set = daysByUser.get(r.from_wallet as string) ?? new Set();
      set.add(day);
      daysByUser.set(r.from_wallet as string, set);
    }
    const returning = [...daysByUser.values()].filter((d) => d.size >= 2).length;
    const returningPct = authorisers.size
      ? Math.round((returning / authorisers.size) * 1000) / 10
      : 0;

    return {
      tenantReady: true as const,
      verifiedUsers: authorisers.size,
      authorisers: authorisers.size,
      taggedTxs: rows.filter((r) => r.attribution_verified).length,
      returningPct,
      recent: rows.slice(0, 8).map((r) => ({
        time: String(r.created_at).slice(11, 16),
        wallet: `${String(r.from_wallet).slice(0, 6)}…${String(r.from_wallet).slice(-4)}`,
        amount: String(r.amount_display ?? ""),
        path: String(r.path),
        hash: String(r.tx_hash),
        status: r.attribution_verified ? "Settled" : "Unverified",
      })),
    };
  } catch (e) {
    return {
      tenantReady: false as const,
      verifiedUsers: 0,
      authorisers: 0,
      taggedTxs: 0,
      returningPct: 0,
      recent: [] as Array<Record<string, string>>,
      error: e instanceof Error ? e.message : String(e),
    };
  }
});

export const getStudioTransactions = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const tenantId = await defaultTenantId();
  if (!tenantId) return { rows: [] as Array<Record<string, string>> };
  const { data, error } = await sb
    .from("till_transactions")
    .select(
      "created_at, from_wallet, asset, amount_display, path, tx_hash, attribution_verified, celoscan_url",
    )
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return {
    rows: (data ?? []).map((r) => ({
      when: String(r.created_at),
      wallet: String(r.from_wallet),
      asset: String(r.asset),
      amount: String(r.amount_display ?? ""),
      path: String(r.path),
      hash: String(r.tx_hash),
      verified: r.attribution_verified ? "yes" : "no",
      celoscan: String(r.celoscan_url ?? `https://celoscan.io/tx/${r.tx_hash}`),
    })),
  };
});

export const getStudioAgentRecord = createServerFn({ method: "GET" }).handler(async () => {
  const sb = await admin();
  const tenantId = await defaultTenantId();
  if (!tenantId) {
    return {
      ready: false as const,
      fields: [] as Array<[string, string]>,
      attributionVerifiedCount: 0,
    };
  }
  const { data: cfg, error } = await sb
    .from("agent_config")
    .select("*")
    .eq("tenant_id", tenantId)
    .maybeSingle();
  if (error) throw new Error(error.message);

  const { count } = await sb
    .from("attribution_events")
    .select("id", { count: "exact", head: true })
    .eq("tenant_id", tenantId)
    .eq("verified", true);

  const c = (cfg ?? {}) as Record<string, unknown>;
  return {
    ready: true as const,
    fields: [
      ["Agent name", "till"],
      ["Primary track", String(c.primary_track ?? "real-world-adoption")],
      ["Network", "celo-mainnet"],
      ["Attribution tag", String(c.attribution_tag ?? process.env.CELO_ATTRIBUTION_TAG ?? "unset")],
      ["Agent wallet", String(c.agent_wallet ?? process.env.CELO_AGENT_WALLET ?? "unset")],
      ["ERC-8004 record", String(c.erc8004_url ?? process.env.CELO_ERC8004_URL ?? "unset")],
      ["Telegram", String(c.telegram_bot_username ?? "unset")],
    ] as Array<[string, string]>,
    otherWallets: (c.other_wallets as unknown[]) ?? [],
    ownContracts: (c.own_contracts as unknown[]) ?? [],
    attributionVerifiedCount: count ?? 0,
  };
});
