import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getEnv } from "@/server/env";
import {
  fetchX402Supported,
  settleX402Payment,
  usatSupportedIn,
  verifyX402Payment,
} from "./facilitator";

/**
 * Agent quote/resolve microservice surface gated by x402.
 * Uses api.x402.celo.org — never the dashboard SPA.
 */
export const getX402Capabilities = createServerFn({ method: "GET" }).handler(async () => {
  const supported = await fetchX402Supported();
  const env = getEnv();
  return {
    facilitator: env.X402_FACILITATOR_URL,
    usdc: env.USDC_TOKEN_ADDRESS,
    usdt: env.USDT_TOKEN_ADDRESS,
    usatConfigured: Boolean(env.USAT_TOKEN_ADDRESS),
    usatSupportedByFacilitator: usatSupportedIn(supported),
    supported,
  };
});

const settleSchema = z.object({
  payment: z.unknown(),
  action: z.enum(["verify", "settle"]),
});

export const processX402Payment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => settleSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.action === "verify") {
      return { ok: true as const, result: await verifyX402Payment(data.payment) };
    }
    return { ok: true as const, result: await settleX402Payment(data.payment) };
  });
