import type { Address, Hex } from "viem";

export type Eip3009TokenMeta = {
  addressEnv:
    | "CNGN_TOKEN_ADDRESS"
    | "USDC_TOKEN_ADDRESS"
    | "USDT_TOKEN_ADDRESS"
    | "USAT_TOKEN_ADDRESS";
  symbol: "cNGN" | "USDC" | "USDT" | "USAT";
  name: string;
  version: string;
  decimals: number;
};

/** On-chain EIP-712 domain metadata — must match token contracts. */
export const EIP3009_TOKEN_META: Record<"cNGN" | "USDC" | "USDT" | "USAT", Eip3009TokenMeta> = {
  USDC: {
    addressEnv: "USDC_TOKEN_ADDRESS",
    symbol: "USDC",
    name: "USD Coin",
    version: "2",
    decimals: 6,
  },
  USDT: {
    addressEnv: "USDT_TOKEN_ADDRESS",
    symbol: "USDT",
    name: "Tether USD",
    version: "1",
    decimals: 6,
  },
  cNGN: {
    addressEnv: "CNGN_TOKEN_ADDRESS",
    symbol: "cNGN",
    name: "cNGN",
    version: "1",
    decimals: 18,
  },
  USAT: {
    addressEnv: "USAT_TOKEN_ADDRESS",
    symbol: "USAT",
    name: "USAT",
    version: "1",
    decimals: 6,
  },
};

export const transferWithAuthorizationTypes = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const;

export function eip3009Domain(params: {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: Address;
}) {
  return {
    name: params.name,
    version: params.version,
    chainId: params.chainId,
    verifyingContract: params.verifyingContract,
  };
}

export function splitSig(signature: Hex): { v: number; r: Hex; s: Hex } {
  const hex = signature.slice(2);
  if (hex.length !== 130) {
    throw new Error(`Invalid EIP-712 signature length: expected 65 bytes, got ${signature.length}`);
  }
  const r = `0x${hex.slice(0, 64)}` as Hex;
  const s = `0x${hex.slice(64, 128)}` as Hex;
  let v = Number.parseInt(hex.slice(128, 130), 16);
  if (v < 27) v += 27;
  return { v, r, s };
}
