import type { Address } from "viem";
import { FEE_ADAPTERS } from "./client";

/**
 * Resolve Celo feeCurrency adapter for stablecoin gas (CIP-64).
 * USDC/USDT must use adapter addresses, not token addresses.
 */
export function feeCurrencyForAsset(
  asset: "USDC" | "USDT" | "CELO" | "cNGN" | "USAT",
): Address | undefined {
  if (asset === "USDC") return FEE_ADAPTERS.USDC;
  if (asset === "USDT") return FEE_ADAPTERS.USDT;
  // cNGN / USA₮ adapters must be verified before use — fail closed.
  if (asset === "cNGN" || asset === "USAT") {
    throw new Error(
      `feeCurrency adapter for ${asset} not verified in FACT_CHECK — refuse to guess.`,
    );
  }
  return undefined;
}
