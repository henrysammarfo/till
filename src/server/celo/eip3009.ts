import { encodeFunctionData, type Address, type Hex, type WalletClient } from "viem";
import { withAttribution } from "./attribution";

/** Minimal EIP-3009 ABI for transferWithAuthorization. */
export const eip3009Abi = [
  {
    type: "function",
    name: "transferWithAuthorization",
    stateMutability: "nonpayable",
    inputs: [
      { name: "from", type: "address" },
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
      { name: "validAfter", type: "uint256" },
      { name: "validBefore", type: "uint256" },
      { name: "nonce", type: "bytes32" },
      { name: "v", type: "uint8" },
      { name: "r", type: "bytes32" },
      { name: "s", type: "bytes32" },
    ],
    outputs: [],
  },
] as const;

export type TransferWithAuthorizationArgs = {
  token: Address;
  from: Address;
  to: Address;
  value: bigint;
  validAfter: bigint;
  validBefore: bigint;
  nonce: Hex;
  v: number;
  r: Hex;
  s: Hex;
  feeCurrency?: Address;
};

/**
 * Submit EIP-3009 transferWithAuthorization with ERC-8021 attribution suffix.
 * Optional feeCurrency enables Celo fee abstraction (CIP-64).
 */
export async function submitTransferWithAuthorization(
  wallet: WalletClient,
  args: TransferWithAuthorizationArgs,
): Promise<Hex> {
  if (!wallet.account) throw new Error("Wallet client missing account");

  const callData = encodeFunctionData({
    abi: eip3009Abi,
    functionName: "transferWithAuthorization",
    args: [
      args.from,
      args.to,
      args.value,
      args.validAfter,
      args.validBefore,
      args.nonce,
      args.v,
      args.r,
      args.s,
    ],
  });

  const data = withAttribution(callData);

  const hash = await wallet.sendTransaction({
    account: wallet.account,
    chain: wallet.chain,
    to: args.token,
    data,
    ...(args.feeCurrency ? { feeCurrency: args.feeCurrency } : {}),
  });

  return hash;
}
