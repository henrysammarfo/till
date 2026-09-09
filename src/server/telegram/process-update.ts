import { requireEnv } from "@/server/env";
import { parseTillIntent } from "@/server/till/intent";
import { checkCounterpartyIndependence } from "@/server/till/counterparty";
import { parseUnits } from "viem";
import { EIP3009_TOKEN_META } from "@/server/celo/eip3009-typed-data";

async function resolveDefaultTenantId(): Promise<string> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const slug = process.env.TILL_DEFAULT_TENANT_SLUG || "till";
  const { data, error } = await supabaseAdmin
    .from("tenants")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Default tenant '${slug}' missing — apply multitenant migration.`);
  return data.id as string;
}

async function telegramReply(chatId: number, text: string) {
  const { TELEGRAM_BOT_TOKEN } = requireEnv(["TELEGRAM_BOT_TOKEN"]);
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  if (!res.ok) {
    throw new Error(`Telegram sendMessage failed: ${res.status} ${await res.text()}`);
  }
}

export async function processTelegramUpdate(
  update: unknown,
  secretHeader: string | null,
): Promise<Response> {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret) {
    return Response.json(
      { ok: false, error: "TELEGRAM_WEBHOOK_SECRET not configured — refuse webhook" },
      { status: 503 },
    );
  }
  if (secretHeader !== secret) {
    return Response.json({ ok: false, error: "invalid secret" }, { status: 401 });
  }

  const data = update as {
    message?: {
      text?: string;
      chat?: { id: number };
      from?: { id: number };
    };
  };
  const msg = data.message;
  if (!msg?.text || !msg.chat) {
    return Response.json({ ok: true, ignored: true });
  }

  const chatId = msg.chat.id;
  try {
    if (msg.text.startsWith("/start")) {
      await telegramReply(
        chatId,
        "TILL — chat till for MiniPay/Celo.\nSend: send 5 cNGN to 0xYourCounterparty\nMainnet only. User-authorized. Attribution-tagged.",
      );
      return Response.json({ ok: true });
    }

    const intent = await parseTillIntent(msg.text);
    const independence = await checkCounterpartyIndependence(intent.to);
    if (independence.status === "fail") {
      await telegramReply(
        chatId,
        `Counterparty rejected (${independence.reasons.join(", ")}). Use an independent MiniPay wallet.`,
      );
      return Response.json({ ok: true, rejected: true });
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const tenantId = await resolveDefaultTenantId();
    const meta = EIP3009_TOKEN_META[intent.asset];
    const amountAtomic = parseUnits(intent.amount, meta.decimals).toString();
    const { data: job, error } = await supabaseAdmin
      .from("till_jobs")
      .insert({
        tenant_id: tenantId,
        telegram_chat_id: String(chatId),
        telegram_user_id: msg.from ? String(msg.from.id) : null,
        counterparty_wallet: independence.wallet,
        asset: intent.asset,
        amount_atomic: amountAtomic,
        amount_display: `${intent.amount} ${intent.asset}`,
        status: "awaiting_signature",
        intent_raw: msg.text,
      })
      .select("id")
      .single();
    if (error) throw new Error(error.message);

    const { PUBLIC_APP_URL } = requireEnv(["PUBLIC_APP_URL"]);
    const signUrl = `${PUBLIC_APP_URL.replace(/\/$/, "")}/pay?job=${job.id}`;
    await telegramReply(
      chatId,
      `Till job ${String(job.id).slice(0, 8)} ready.\nPay ${intent.amount} ${intent.asset} → ${independence.wallet}\nIndependence: ${independence.status}\nAuthorize in MiniPay: ${signUrl}`,
    );
    return Response.json({ ok: true, jobId: job.id });
  } catch (e) {
    const err = e instanceof Error ? e.message : "Unknown error";
    try {
      await telegramReply(chatId, `TILL could not process that: ${err}`);
    } catch {
      /* reply best-effort */
    }
    return Response.json({ ok: false, error: err }, { status: 200 });
  }
}
