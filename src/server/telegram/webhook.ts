import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireEnv } from "@/server/env";
import { parseTillIntent } from "@/server/till/intent";
import { checkCounterpartyIndependence } from "@/server/till/counterparty";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const telegramUpdateSchema = z.object({
  update_id: z.number(),
  message: z
    .object({
      message_id: z.number(),
      text: z.string().optional(),
      chat: z.object({ id: z.number() }),
      from: z.object({ id: z.number(), username: z.string().optional() }).optional(),
    })
    .optional(),
});

async function resolveDefaultTenantId(): Promise<string> {
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

/**
 * Telegram webhook entry. Secret header required when TELEGRAM_WEBHOOK_SECRET set.
 */
export const handleTelegramWebhook = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => telegramUpdateSchema.parse(data))
  .handler(async ({ data }) => {
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    if (secret) {
      const hdr = getRequestHeader("x-telegram-bot-api-secret-token");
      if (hdr !== secret) {
        throw new Error("Invalid Telegram webhook secret");
      }
    }

    const msg = data.message;
    if (!msg?.text || !msg.chat) {
      return { ok: true as const, ignored: true };
    }

    const chatId = msg.chat.id;
    try {
      if (msg.text.startsWith("/start")) {
        await telegramReply(
          chatId,
          "TILL — chat till for MiniPay/Celo.\nSend: send 5 cNGN to 0xYourCounterparty\nMainnet only. User-authorized. Attribution-tagged.",
        );
        return { ok: true as const };
      }

      const intent = await parseTillIntent(msg.text);
      const independence = await checkCounterpartyIndependence(intent.to);
      if (independence.status === "fail") {
        await telegramReply(
          chatId,
          `Counterparty rejected (${independence.reasons.join(", ")}). Use an independent MiniPay wallet.`,
        );
        return { ok: true as const, rejected: true };
      }

      const tenantId = await resolveDefaultTenantId();
      const { data: job, error } = await supabaseAdmin
        .from("till_jobs")
        .insert({
          tenant_id: tenantId,
          telegram_chat_id: String(chatId),
          telegram_user_id: msg.from ? String(msg.from.id) : null,
          counterparty_wallet: independence.wallet,
          asset: intent.asset,
          amount_atomic: intent.amount,
          amount_display: `${intent.amount} ${intent.asset}`,
          status: "awaiting_signature",
          intent_raw: msg.text,
        })
        .select("id")
        .single();
      if (error) throw new Error(error.message);

      const signUrl = `${process.env.VITE_PUBLIC_APP_URL || "https://till.local"}/book?job=${job.id}`;
      await telegramReply(
        chatId,
        `Till job ${job.id.slice(0, 8)} ready.\nPay ${intent.amount} ${intent.asset} → ${independence.wallet}\nIndependence: ${independence.status}\nAuthorize in MiniPay: ${signUrl}`,
      );
      return { ok: true as const, jobId: job.id };
    } catch (e) {
      const err = e instanceof Error ? e.message : "Unknown error";
      await telegramReply(chatId, `TILL could not process that: ${err}`);
      return { ok: false as const, error: err };
    }
  });
