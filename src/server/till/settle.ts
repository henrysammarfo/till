import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { parseUnits, type Hex } from "viem";
import { getAgentWalletClient, tokenAddress } from "@/server/celo/client";
import { submitTransferWithAuthorization } from "@/server/celo/eip3009";
import { verifyAttribution } from "@/server/celo/attribution";
import { feeCurrencyForAsset } from "@/server/celo/fee-abstraction";

const authSchema = z.object({
  jobId: z.string().uuid(),
  from: z.string(),
  to: z.string(),
  asset: z.enum(["cNGN", "USDC", "USDT", "USAT"]),
  amount: z.string(),
  decimals: z.number().int().min(0).max(18).default(18),
  validAfter: z.string(),
  validBefore: z.string(),
  nonce: z.string(),
  v: z.number().int(),
  r: z.string(),
  s: z.string(),
  useFeeAbstraction: z.boolean().default(false),
  feeAsset: z.enum(["USDC", "USDT"]).optional(),
});

/**
 * Submit a user-signed EIP-3009 authorization with attribution + optional fee abstraction.
 */
export const settleTillJob = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => authSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: job, error: jobErr } = await supabaseAdmin
      .from("till_jobs")
      .select("*")
      .eq("id", data.jobId)
      .single();
    if (jobErr || !job) throw new Error(jobErr?.message ?? "Job not found");

    await supabaseAdmin
      .from("till_jobs")
      .update({ status: "submitting", payer_wallet: data.from })
      .eq("id", data.jobId);

    const { wallet, address: agentAddress } = getAgentWalletClient();
    const token = tokenAddress(data.asset);
    const value = parseUnits(data.amount, data.decimals);
    const feeCurrency =
      data.useFeeAbstraction && data.feeAsset ? feeCurrencyForAsset(data.feeAsset) : undefined;

    const txHash = await submitTransferWithAuthorization(wallet, {
      token,
      from: data.from as `0x${string}`,
      to: data.to as `0x${string}`,
      value,
      validAfter: BigInt(data.validAfter),
      validBefore: BigInt(data.validBefore),
      nonce: data.nonce as Hex,
      v: data.v,
      r: data.r as Hex,
      s: data.s as Hex,
      feeCurrency,
    });

    const attribution = await verifyAttribution(txHash);
    const celoscanUrl = `https://celoscan.io/tx/${txHash}`;

    const tenantId = job.tenant_id;
    const { error: txErr } = await supabaseAdmin.from("till_transactions").insert({
      tenant_id: tenantId,
      job_id: data.jobId,
      tx_hash: txHash,
      asset: data.asset,
      amount_atomic: value.toString(),
      amount_display: `${data.amount} ${data.asset}`,
      from_wallet: data.from,
      to_wallet: data.to,
      path: "eip3009",
      attribution_tag: process.env.CELO_ATTRIBUTION_TAG ?? null,
      attribution_verified: attribution.verified,
      fee_currency: feeCurrency ?? null,
      celoscan_url: celoscanUrl,
      raw: { agentAddress, attribution },
    });
    if (txErr) throw new Error(txErr.message);

    await supabaseAdmin.from("attribution_events").insert({
      tenant_id: tenantId,
      tx_hash: txHash,
      codes: attribution.codes,
      schema_id: attribution.schemaId,
      verified: attribution.verified,
      verified_at: attribution.verified ? new Date().toISOString() : null,
    });

    await supabaseAdmin
      .from("till_jobs")
      .update({
        status: attribution.verified ? "confirmed" : "failed",
        error_message: attribution.verified ? null : "attribution_not_verified",
      })
      .eq("id", data.jobId);

    if (!attribution.verified) {
      throw new Error(
        `Settlement mined (${txHash}) but attribution verifyTx failed — no silent pass.`,
      );
    }

    return { ok: true as const, txHash, celoscanUrl, attribution };
  });
