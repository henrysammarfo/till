import { toDataSuffix, verifyTx } from "@celo/attribution-tags";
import { concat, type Hex } from "viem";
import { requireEnv } from "@/server/env";
import { getPublicClient } from "./client";

export function attributionSuffix(extraCodes: string[] = []): Hex {
  const { CELO_ATTRIBUTION_TAG } = requireEnv(["CELO_ATTRIBUTION_TAG"]);
  const codes = [CELO_ATTRIBUTION_TAG, ...extraCodes].filter(Boolean);
  return toDataSuffix(codes.length === 1 ? codes[0]! : codes) as Hex;
}

export function withAttribution(callData: Hex, extraCodes: string[] = []): Hex {
  return concat([callData, attributionSuffix(extraCodes)]);
}

export async function verifyAttribution(txHash: Hex): Promise<{
  verified: boolean;
  codes: string[];
  schemaId: number | null;
}> {
  const { CELO_ATTRIBUTION_TAG } = requireEnv(["CELO_ATTRIBUTION_TAG"]);
  const client = getPublicClient();
  const result = await verifyTx({ client, hash: txHash });
  if (!result) {
    return { verified: false, codes: [], schemaId: null };
  }
  const codes = result.codes ?? [];
  return {
    verified: codes.includes(CELO_ATTRIBUTION_TAG),
    codes,
    schemaId: result.schemaId ?? null,
  };
}
