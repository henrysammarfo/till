/**
 * Live mainnet smoke: verify ERC-8021 attribution on a mined tx.
 *
 * Requires:
 *   CELO_ATTRIBUTION_TAG
 *   CELO_RPC_URL (defaults via env schema to forno)
 *   --tx 0x...
 *
 * Usage:
 *   bun run smoke:verify-tx -- --tx 0x...
 */
import { verifyTx } from "@celo/attribution-tags";
import { createPublicClient, http, type Hex } from "viem";
import { celo } from "viem/chains";
import { requireEnv, getEnv } from "../src/server/env";

function arg(name: string): string | undefined {
  const idx = process.argv.indexOf(`--${name}`);
  if (idx === -1) return undefined;
  return process.argv[idx + 1];
}

async function main() {
  const { CELO_ATTRIBUTION_TAG } = requireEnv(["CELO_ATTRIBUTION_TAG"]);
  const tx = arg("tx");
  if (!tx || !/^0x[a-fA-F0-9]{64}$/.test(tx)) {
    throw new Error("Pass --tx 0x…64 hex of a mined Celo mainnet transaction");
  }

  const { CELO_RPC_URL } = getEnv();
  const client = createPublicClient({
    chain: celo,
    transport: http(CELO_RPC_URL),
  });

  const receipt = await client.getTransactionReceipt({ hash: tx as Hex });
  if (!receipt) throw new Error(`No receipt for ${tx} — wait for mainnet confirmation`);

  const result = await verifyTx({ client, hash: tx as Hex });
  if (!result) {
    throw new Error(`verifyTx returned empty for ${tx} — attribution missing`);
  }

  const verified = (result.codes ?? []).includes(CELO_ATTRIBUTION_TAG);
  const out = {
    ok: verified,
    tx,
    blockNumber: receipt.blockNumber.toString(),
    codes: result.codes,
    schemaId: result.schemaId,
    expectedTag: CELO_ATTRIBUTION_TAG,
    celoscan: `https://celoscan.io/tx/${tx}`,
  };

  console.log(JSON.stringify(out, null, 2));
  if (!verified) process.exit(1);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
