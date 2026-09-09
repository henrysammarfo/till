/**
 * Production MiniPay authorize page for a till job.
 * Live EIP-3009 sign → agent settle on Celo mainnet. No mocks.
 */
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import { createWalletClient, custom, parseUnits, type Address, type Hex } from "viem";
import { celo } from "viem/chains";
import { CheckCircle2, Loader2, ShieldAlert, Wallet } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { getTillJob, settleTillJob } from "@/lib/till.functions";
import {
  eip3009Domain,
  splitSig,
  transferWithAuthorizationTypes,
} from "@/lib/eip3009-typed-data";

export const Route = createFileRoute("/pay")({
  validateSearch: (search: Record<string, unknown>) => ({
    job: typeof search.job === "string" ? search.job : "",
  }),
  head: () => ({
    meta: [
      { title: "Authorize payment — TILL" },
      {
        name: "description",
        content:
          "Authorize a TILL till job with EIP-3009 in MiniPay. Mainnet settlement with ERC-8021 attribution.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PayPage,
});

function randomNonce(): Hex {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return `0x${Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")}` as Hex;
}

function PayPage() {
  const { job: jobId } = Route.useSearch();
  const jobQuery = useQuery({
    queryKey: ["till-job", jobId],
    enabled: Boolean(jobId),
    queryFn: () => getTillJob({ data: { jobId } }),
    retry: 1,
  });

  const [account, setAccount] = useState<Address | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ txHash: string; celoscanUrl: string } | null>(null);
  const [useFeeAbstraction, setUseFeeAbstraction] = useState(false);

  const job = jobQuery.data;
  const canSign = useMemo(
    () => Boolean(job && account && job.status === "awaiting_signature"),
    [job, account],
  );

  const onConnect = useCallback(async () => {
    setError(null);
    const eth = window.ethereum;
    if (!eth) {
      setError(
        "No injected wallet. Open this page inside MiniPay or install a Celo-compatible wallet.",
      );
      return;
    }
    const accounts = (await eth.request({ method: "eth_requestAccounts" })) as string[];
    if (!accounts[0]) {
      setError("Wallet returned no accounts.");
      return;
    }
    const chainIdHex = (await eth.request({ method: "eth_chainId" })) as string;
    const chainId = Number.parseInt(chainIdHex, 16);
    if (chainId !== 42220) {
      try {
        await eth.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xa4ec" }],
        });
      } catch {
        setError(`Wrong network (${chainId}). Switch to Celo mainnet (42220).`);
        return;
      }
    }
    setAccount(accounts[0] as Address);
  }, []);

  const onAuthorize = useCallback(async () => {
    if (!job || !account) return;
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const eth = window.ethereum;
      if (!eth) throw new Error("Injected provider disappeared.");

      const wallet = createWalletClient({
        account,
        chain: celo,
        transport: custom(eth),
      });

      const amountHuman = job.amountDisplay.split(" ")[0] ?? job.amountAtomic;
      const value = parseUnits(amountHuman, job.decimals);
      const validAfter = 0n;
      const validBefore = BigInt(Math.floor(Date.now() / 1000) + 60 * 30);
      const nonce = randomNonce();

      const signature = await wallet.signTypedData({
        account,
        domain: eip3009Domain({
          name: job.tokenName,
          version: job.tokenVersion,
          chainId: job.chainId,
          verifyingContract: job.tokenAddress as Address,
        }),
        types: transferWithAuthorizationTypes,
        primaryType: "TransferWithAuthorization",
        message: {
          from: account,
          to: job.counterpartyWallet as Address,
          value,
          validAfter,
          validBefore,
          nonce,
        },
      });

      const { v, r, s } = splitSig(signature);
      const settled = await settleTillJob({
        data: {
          jobId: job.id,
          from: account,
          to: job.counterpartyWallet,
          asset: job.asset,
          amount: amountHuman,
          decimals: job.decimals,
          validAfter: validAfter.toString(),
          validBefore: validBefore.toString(),
          nonce,
          v,
          r,
          s,
          useFeeAbstraction,
          feeAsset: useFeeAbstraction ? "USDC" : undefined,
        },
      });

      setResult({ txHash: settled.txHash, celoscanUrl: settled.celoscanUrl });
      await jobQuery.refetch();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }, [job, account, useFeeAbstraction, jobQuery]);

  if (!jobId) {
    return (
      <PageShell
        eyebrow="Pay"
        title="Missing till job"
        lede="Open the authorize link from Telegram (/pay?job=<uuid>)."
      >
        <div className="wrap section-tight">
          <p className="body-sm">No job id in the URL — nothing to authorize.</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Authorize"
      title="Sign this till job"
      lede="EIP-3009 authorization in MiniPay, then TILL submits the tagged mainnet settlement. No demo mode."
    >
      <div className="wrap section-tight">
        <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
          {jobQuery.isLoading ? (
            <p className="body-sm">
              <Loader2 size={16} className="spin" style={{ display: "inline" }} /> Loading live
              job…
            </p>
          ) : null}
          {jobQuery.isError ? (
            <p className="form-error">
              {jobQuery.error instanceof Error ? jobQuery.error.message : "Failed to load job"}
            </p>
          ) : null}

          {job ? (
            <>
              <dl className="body-sm" style={{ display: "grid", gap: 10 }}>
                <div>
                  <dt style={{ opacity: 0.6 }}>Job</dt>
                  <dd>
                    <code>{job.id}</code>
                  </dd>
                </div>
                <div>
                  <dt style={{ opacity: 0.6 }}>Amount</dt>
                  <dd style={{ fontSize: 22, fontWeight: 600 }}>{job.amountDisplay}</dd>
                </div>
                <div>
                  <dt style={{ opacity: 0.6 }}>Counterparty</dt>
                  <dd>
                    <code>{job.counterpartyWallet}</code>
                  </dd>
                </div>
                <div>
                  <dt style={{ opacity: 0.6 }}>Status</dt>
                  <dd>{job.status}</dd>
                </div>
                <div>
                  <dt style={{ opacity: 0.6 }}>Token</dt>
                  <dd>
                    {job.asset} · <code>{job.tokenAddress}</code>
                  </dd>
                </div>
              </dl>

              {job.status !== "awaiting_signature" && !result ? (
                <p className="body-sm" style={{ marginTop: 16 }}>
                  <ShieldAlert size={16} style={{ display: "inline", marginRight: 6 }} />
                  Job is <strong>{job.status}</strong>
                  {job.errorMessage ? ` — ${job.errorMessage}` : ""}. Fresh authorize only when
                  status is awaiting_signature.
                </p>
              ) : null}

              <label
                className="body-sm"
                style={{ display: "flex", gap: 8, marginTop: 20, alignItems: "center" }}
              >
                <input
                  type="checkbox"
                  checked={useFeeAbstraction}
                  onChange={(e) => setUseFeeAbstraction(e.target.checked)}
                />
                Pay gas in USDC via Celo fee abstraction (CIP-64)
              </label>

              <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
                {!account ? (
                  <button type="button" className="btn-primary" onClick={() => void onConnect()}>
                    <Wallet size={16} /> Connect MiniPay / wallet
                  </button>
                ) : (
                  <button type="button" className="btn-secondary" disabled>
                    Connected {account.slice(0, 6)}…{account.slice(-4)}
                  </button>
                )}
                <button
                  type="button"
                  className="btn-primary"
                  disabled={!canSign || busy}
                  onClick={() => void onAuthorize()}
                >
                  {busy ? (
                    <>
                      <Loader2 size={16} className="spin" /> Submitting…
                    </>
                  ) : (
                    "Sign & settle on Celo mainnet"
                  )}
                </button>
              </div>

              {error ? (
                <p className="form-error" style={{ marginTop: 16 }}>
                  {error}
                </p>
              ) : null}
              {result ? (
                <p className="body-sm" style={{ marginTop: 16 }}>
                  <CheckCircle2 size={16} style={{ display: "inline", marginRight: 6 }} />
                  Settled.{" "}
                  <a href={result.celoscanUrl} target="_blank" rel="noreferrer">
                    View on Celoscan
                  </a>
                </p>
              ) : null}

              <p className="body-sm" style={{ marginTop: 24, opacity: 0.65 }}>
                Residual risk applies — we do not claim unhackable. Attribution is verified on-chain
                after submit.
              </p>
            </>
          ) : null}
        </div>
      </div>
    </PageShell>
  );
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}
