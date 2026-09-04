/**
 * Smoke: decode attribution suffix round-trip (no chain key required).
 */
import { toDataSuffix, fromDataSuffix } from "@celo/attribution-tags";

const tag = process.env.CELO_ATTRIBUTION_TAG || "celo_smoke_test01";
const suffix = toDataSuffix(tag);
const decoded = fromDataSuffix(suffix);

if (!decoded || !decoded.codes.includes(tag)) {
  throw new Error(`Attribution round-trip failed for ${tag}: ${JSON.stringify(decoded)}`);
}

console.log(
  JSON.stringify({ ok: true, tag, codes: decoded.codes, schemaId: decoded.schemaId }, null, 2),
);
