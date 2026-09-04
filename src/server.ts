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

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
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

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const url = new URL(request.url);
      if (request.method === "POST" && url.pathname === "/api/telegram/webhook") {
        const { processTelegramUpdate } = await import("./server/telegram/process-update");
        const body = await request.json();
        return processTelegramUpdate(body, request.headers.get("x-telegram-bot-api-secret-token"));
      }
      if (request.method === "GET" && url.pathname === "/api/x402/supported") {
        const { fetchX402Supported, usatSupportedIn } = await import("./server/x402/facilitator");
        const { getEnv } = await import("./server/env");
        const env = getEnv();
        const supported = await fetchX402Supported();
        return Response.json({
          facilitator: env.X402_FACILITATOR_URL,
          usdc: env.USDC_TOKEN_ADDRESS,
          usdt: env.USDT_TOKEN_ADDRESS,
          usatConfigured: Boolean(env.USAT_TOKEN_ADDRESS),
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
