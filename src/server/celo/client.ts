import {
  createPublicClient,
  createWalletClient,
  http,
  type Address,
  type Hex,
  type PublicClient,
  type WalletClient,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { celo } from "viem/chains";
import { getEnv, requireEnv } from "@/server/env";

export const CELO_MAINNET_ID = 42220;

/** Fee abstraction adapters (CIP-64) — verified docs.celo.org fee-abstraction 2026-09-04. */
export const FEE_ADAPTERS = {
  USDC: "0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B" as Address,
  USDT: "0x0e2a3e05bc9a16f5292a6170456a710cb89c6f72" as Address,
} as const;

export function getPublicClient(): PublicClient {
  const { CELO_RPC_URL } = getEnv();
  return createPublicClient({
    chain: celo,
    transport: http(CELO_RPC_URL),
  });
}

export function getAgentWalletClient(): {
  account: ReturnType<typeof privateKeyToAccount>;
  wallet: WalletClient;
  address: Address;
} {
  const { CELO_AGENT_PRIVATE_KEY, CELO_RPC_URL } = requireEnv([
    "CELO_AGENT_PRIVATE_KEY",
    "CELO_RPC_URL",
  ]);
  const key = CELO_AGENT_PRIVATE_KEY.startsWith("0x")
    ? (CELO_AGENT_PRIVATE_KEY as Hex)
    : (`0x${CELO_AGENT_PRIVATE_KEY}` as Hex);
  const account = privateKeyToAccount(key);
  const wallet = createWalletClient({
    account,
    chain: celo,
    transport: http(CELO_RPC_URL),
  });
  return { account, wallet, address: account.address };
}

export function tokenAddress(asset: "cNGN" | "USDC" | "USDT" | "USAT"): Address {
  const env = getEnv();
  const map: Record<string, string | undefined> = {
    cNGN: env.CNGN_TOKEN_ADDRESS,
    USDC: env.USDC_TOKEN_ADDRESS,
    USDT: env.USDT_TOKEN_ADDRESS,
    USAT: env.USAT_TOKEN_ADDRESS,
  };
  const addr = map[asset];
  if (!addr) {
    throw new Error(
      `Token address for ${asset} not configured. Set env and verify in memory/FACT_CHECK.md — no fallbacks.`,
    );
  }
  return addr as Address;
}
