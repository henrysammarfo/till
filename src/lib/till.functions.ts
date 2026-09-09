/**
 * Client-callable till RPCs. Lives under src/lib so MiniPay routes can import
 * without tripping TanStack import-protection on **/server/**.
 */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { parseUnits, type Hex } from "viem";
import { EIP3009_TOKEN_META } from "@/lib/eip3009-typed-data";
import { CELO_MAINNET_ID } from "@/server/celo/client";

const jobIdSchema = z.object({ jobId: z.string().uuid() });

const settleSchema = z.object({
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

/** Load a till job for MiniPay authorize. Job UUID is the capability. */
export const getTillJob = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => jobIdSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: job, error } = await supabaseAdmin
      .from("till_jobs")
      .select(
        "id, tenant_id, counterparty_wallet, asset, amount_atomic, amount_display, status, intent_raw, created_at, payer_wallet, error_message",
      )
      .eq("id", data.jobId)
      .single();
    if (error || !job) throw new Error(error?.message ?? "Till job not found");

    const asset = job.asset as keyof typeof EIP3009_TOKEN_META;
    const meta = EIP3009_TOKEN_META[asset];
    if (!meta) throw new Error(`Unsupported asset on job: ${String(job.asset)}`);

    const tokenAddr = process.env[meta.addressEnv];
    if (!tokenAddr) {
      throw new Error(
        `Token address env ${meta.addressEnv} missing for ${asset} — cannot authorize. No placeholders.`,
      );
    }

    return {
      id: job.id as string,
      tenantId: job.tenant_id as string,
      counterpartyWallet: job.counterparty_wallet as string,
      asset,
      amountAtomic: String(job.amount_atomic),
      amountDisplay: (job.amount_display as string | null) ?? `${job.amount_atomic} ${asset}`,
      status: job.status as string,
      intentRaw: job.intent_raw as string | null,
      createdAt: job.created_at as string,
      payerWallet: job.payer_wallet as string | null,
      errorMessage: job.error_message as string | null,
      tokenAddress: tokenAddr,
      tokenName: meta.name,
      tokenVersion: meta.version,
      decimals: meta.decimals,
      chainId: CELO_MAINNET_ID,
    };
  });

/**
 * Submit a user-signed EIP-3009 authorization with attribution + optional fee abstraction.
 * Fail closed if attribution verifyTx does not confirm the contest tag.
 */
export const settleTillJob = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => settleSchema.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { getAgentWalletClient, getPublicClient, tokenAddress } = await import(
      "@/server/celo/client",
    );
    const { submitTransferWithAuthorization } = await import("@/server/celo/eip3009");
    const { verifyAttribution } = await import("@/server/celo/attribution");
    const { feeCurrencyForAsset } = await import("@/server/celo/fee-abstraction");

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

    // Attribution verifyTx needs a mined receipt — wait on mainnet, no soft-skip.
    const publicClient = getPublicClient();
    const receipt = await publicClient.waitForTransactionReceipt({
      hash: txHash,
      confirmations: 1,
      timeout: 120_000,
    });
    if (receipt.status !== "success") {
      await supabaseAdmin
        .from("till_jobs")
        .update({ status: "failed", error_message: "tx_reverted" })
        .eq("id", data.jobId);
      throw new Error(`Settlement tx reverted: ${txHash}`);
    }

    const attribution = await verifyAttribution(txHash);
    const celoscanUrl = `https://celoscan.io/tx/${txHash}`;
    const tenantId = job.tenant_id as string;

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
      block_number: Number(receipt.blockNumber),
      confirmed_at: new Date().toISOString(),
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
