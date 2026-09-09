import { z } from "zod";
import { getEnv, requireEnv } from "@/server/env";

const supportedSchema = z
  .object({
    kinds: z.array(z.unknown()).optional(),
  })
  .passthrough();

export type X402Supported = z.infer<typeof supportedSchema>;

export async function fetchX402Supported(): Promise<X402Supported> {
  const { X402_FACILITATOR_URL } = getEnv();
  const res = await fetch(`${X402_FACILITATOR_URL}/supported`);
  if (!res.ok) {
    throw new Error(`x402 /supported failed: ${res.status} ${await res.text()}`);
  }
  return supportedSchema.parse(await res.json());
}

/** USA₮ only if facilitator advertises it — never claim otherwise. */
export function usatSupportedIn(payload: unknown): boolean {
  const raw = JSON.stringify(payload).toLowerCase();
  return raw.includes("usat") || raw.includes("usa₮") || raw.includes("tether usd a");
}

export async function settleX402Payment(payment: unknown): Promise<unknown> {
  const { X402_API_KEY, X402_FACILITATOR_URL } = requireEnv([
    "X402_API_KEY",
    "X402_FACILITATOR_URL",
  ]);
  const res = await fetch(`${X402_FACILITATOR_URL}/settle`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": X402_API_KEY,
    },
    body: JSON.stringify({ payment, network: "celo" }),
  });
  if (!res.ok) {
    throw new Error(`x402 /settle failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function verifyX402Payment(payment: unknown): Promise<unknown> {
  const { X402_FACILITATOR_URL } = getEnv();
  const res = await fetch(`${X402_FACILITATOR_URL}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payment, network: "celo" }),
  });
  if (!res.ok) {
    throw new Error(`x402 /verify failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
