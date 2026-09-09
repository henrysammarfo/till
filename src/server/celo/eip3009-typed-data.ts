/** Re-export shared EIP-3009 typed-data helpers for server modules. */
export {
  EIP3009_TOKEN_META,
  eip3009Domain,
  splitSig,
  transferWithAuthorizationTypes,
  type Eip3009TokenMeta,
} from "@/lib/eip3009-typed-data";
