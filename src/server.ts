import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function present(key: string): boolean {
  const v = process.env[key];
  return typeof v === "string" && v.trim().length > 0;
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);

      if (request.method === "POST" && url.pathname === "/api/telegram/webhook") {
        const { processTelegramUpdate } = await import("./server/telegram/process-update");
        const body = await request.json();
        return processTelegramUpdate(
          body,
          request.headers.get("x-telegram-bot-api-secret-token"),
        );
      }

      if (request.method === "GET" && url.pathname === "/api/x402/supported") {
        const { fetchX402Supported, usatSupportedIn } = await import("./server/x402/facilitator");
        const { getEnv } = await import("./server/env");
        const cfg = getEnv();
        const supported = await fetchX402Supported();
        return Response.json({
          facilitator: cfg.X402_FACILITATOR_URL,
          usdc: cfg.USDC_TOKEN_ADDRESS,
          usdt: cfg.USDT_TOKEN_ADDRESS,
          usatConfigured: Boolean(cfg.USAT_TOKEN_ADDRESS),
          usatSupportedByFacilitator: usatSupportedIn(supported),
          supported,
        });
      }

      if (request.method === "GET" && url.pathname === "/api/health") {
        return Response.json({
          ok: true,
          service: "till",
          network: "celo-mainnet",
          residualRiskDoc: "/memory/THREAT_MODEL.md",
        });
      }

      if (request.method === "GET" && url.pathname === "/api/ready") {
        const checks: Record<string, boolean | string> = {
          supabaseUrl: present("SUPABASE_URL"),
          supabasePublishable: present("SUPABASE_PUBLISHABLE_KEY"),
          supabaseServiceRole: present("SUPABASE_SERVICE_ROLE_KEY"),
          telegramBotToken: present("TELEGRAM_BOT_TOKEN"),
          telegramWebhookSecret: present("TELEGRAM_WEBHOOK_SECRET"),
          celoAgentKey: present("CELO_AGENT_PRIVATE_KEY"),
          celoAttributionTag: present("CELO_ATTRIBUTION_TAG"),
          cngnToken: present("CNGN_TOKEN_ADDRESS"),
          publicAppUrl: present("PUBLIC_APP_URL"),
          agentRouterKey: present("AGENTROUTER_API_KEY"),
          tavilyKey: present("TAVILY_API_KEY"),
          x402ApiKey: present("X402_API_KEY"),
        };

        try {
          const { getPublicClient } = await import("./server/celo/client");
          const block = await getPublicClient().getBlockNumber();
          checks.celoRpcLive = true;
          checks.celoBlock = block.toString();
        } catch (e) {
          checks.celoRpcLive = false;
          checks.celoRpcError = e instanceof Error ? e.message : "rpc failed";
        }

        try {
          const { supabaseAdmin } = await import("./integrations/supabase/client.server");
          const { error } = await supabaseAdmin.from("tenants").select("id").limit(1);
          checks.supabaseLive = !error;
          if (error) checks.supabaseError = error.message;
        } catch (e) {
          checks.supabaseLive = false;
          checks.supabaseError = e instanceof Error ? e.message : "supabase failed";
        }

        const requiredForTill = [
          "supabaseUrl",
          "supabaseServiceRole",
          "telegramBotToken",
          "telegramWebhookSecret",
          "celoAgentKey",
          "celoAttributionTag",
          "cngnToken",
          "publicAppUrl",
          "celoRpcLive",
          "supabaseLive",
        ] as const;
        const missing = requiredForTill.filter((k) => !checks[k]);
        const ready = missing.length === 0;
        return Response.json(
          {
            ready,
            missing,
            checks,
            note: "Presence + live probes only — secrets never returned. Residual risk remains.",
          },
          { status: ready ? 200 : 503 },
        );
      }

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
