import { type Address, getAddress, isAddress } from "viem";
import { getPublicClient } from "@/server/celo/client";

export type IndependenceResult = {
  wallet: Address;
  status: "pass" | "fail" | "unknown";
  reasons: string[];
  firstActivityTs: number | null;
};

const HACK_EPOCH_MS = Date.parse("2026-08-28T00:00:00.000Z");

/**
 * Independence policy: reject builder-controlled wallets when listed;
 * prefer pre-Aug-28 activity. Fail closed on invalid address.
 */
export async function checkCounterpartyIndependence(
  wallet: string,
  opts?: { builderWallets?: string[]; firstFundedByBuilder?: boolean },
): Promise<IndependenceResult> {
  if (!isAddress(wallet)) {
    throw new Error("Counterparty wallet is not a valid address");
  }
  const addr = getAddress(wallet);
  const reasons: string[] = [];
  const builders = new Set((opts?.builderWallets ?? []).map((w) => getAddress(w)));

  if (builders.has(addr)) {
    reasons.push("wallet_is_builder_declared");
  }
  if (opts?.firstFundedByBuilder) {
    reasons.push("first_funded_by_builder");
  }

  let firstActivityTs: number | null = null;
  try {
    const client = getPublicClient();
    const txCount = await client.getTransactionCount({ address: addr });
    if (txCount === 0) {
      reasons.push("no_onchain_activity");
    } else {
      // Heuristic: presence of history; exact first-tx requires indexer.
      // Prefer pre-hack activity when known via DB; here mark unknown if not supplied.
      firstActivityTs = null;
    }
  } catch (e) {
    reasons.push(`rpc_error:${e instanceof Error ? e.message : "unknown"}`);
  }

  if (reasons.some((r) => r.startsWith("wallet_is") || r.startsWith("first_funded"))) {
    return { wallet: addr, status: "fail", reasons, firstActivityTs };
  }

  if (firstActivityTs != null && firstActivityTs < HACK_EPOCH_MS) {
    return { wallet: addr, status: "pass", reasons: ["pre_aug28_activity"], firstActivityTs };
  }

  return {
    wallet: addr,
    status: reasons.includes("no_onchain_activity") ? "fail" : "unknown",
    reasons: reasons.length ? reasons : ["activity_unverified_prefer_pre_aug28"],
    firstActivityTs,
  };
}
