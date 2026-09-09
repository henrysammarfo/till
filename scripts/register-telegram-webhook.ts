/**
 * Registers the live Telegram webhook for TILL.
 *
 * Requires:
 *   TELEGRAM_BOT_TOKEN
 *   TELEGRAM_WEBHOOK_SECRET
 *   PUBLIC_APP_URL  (e.g. https://till.example.com)
 *
 * Usage:
 *   bun run scripts/register-telegram-webhook.ts
 */
import { requireEnv } from "../src/server/env";

async function main() {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, PUBLIC_APP_URL } = requireEnv([
    "TELEGRAM_BOT_TOKEN",
    "TELEGRAM_WEBHOOK_SECRET",
    "PUBLIC_APP_URL",
  ]);

  const webhookUrl = `${PUBLIC_APP_URL.replace(/\/$/, "")}/api/telegram/webhook`;
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      url: webhookUrl,
      secret_token: TELEGRAM_WEBHOOK_SECRET,
      drop_pending_updates: true,
      allowed_updates: ["message"],
    }),
  });

  const body = (await res.json()) as {
    ok: boolean;
    description?: string;
    result?: unknown;
  };

  if (!body.ok) {
    throw new Error(`setWebhook failed: ${body.description ?? res.status}`);
  }

  const infoRes = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`,
  );
  const info = await infoRes.json();
  console.log(JSON.stringify({ set: body, info }, null, 2));
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
