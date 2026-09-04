import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, ExternalLink, Search } from "lucide-react";
import { getStudioTransactions } from "@/lib/studio.functions";

export const Route = createFileRoute("/_authenticated/dashboard/transactions")({
  head: () => ({
    meta: [
      { title: "Transactions — tagged Celo mainnet settlements | TILL®" },
      {
        name: "description",
        content:
          "Every till job with its counterparty, asset, authorisation path, attribution suffix and Celoscan receipt.",
      },
      { property: "og:title", content: "TILL transactions" },
      { property: "og:description", content: "Tagged settlements with Celoscan receipts." },
    ],
  }),
  component: Transactions,
});

function Transactions() {
  const [q, setQ] = useState("");
  const list = useQuery({
    queryKey: ["till-transactions"],
    queryFn: () => getStudioTransactions(),
  });

  const filtered = (list.data?.rows ?? []).filter((r) =>
    Object.values(r).join(" ").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <>
      <header className="dash-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            Ledger
          </p>
          <h1 className="h3" style={{ margin: "6px 0 0", fontSize: 22 }}>
            Transactions
          </h1>
        </div>
        <button className="pill" type="button" disabled>
          Export CSV <Download size={15} />
        </button>
      </header>

      <div className="dash-body">
        <div
          className="card"
          style={{ padding: 16, display: "flex", gap: 10, alignItems: "center" }}
        >
          <Search size={16} strokeWidth={1.9} />
          <input
            className="input"
            style={{ border: 0, padding: 0 }}
            placeholder="Filter by wallet, asset, path or hash"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        {list.isError ? (
          <p className="body-sm" style={{ color: "crimson", marginTop: 12 }}>
            {list.error instanceof Error ? list.error.message : "Failed to load transactions"}
          </p>
        ) : null}

        <div className="card scroll-x" style={{ marginTop: 16 }}>
          <table className="table">
            <thead>
              <tr>
                <th>When</th>
                <th>Payer</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Path</th>
                <th>Verified</th>
                <th>Tx</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="body-sm">
                    No live settlements yet. Mocks removed — rows appear after tagged mainnet txs.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.hash}>
                    <td>{r.when}</td>
                    <td>
                      {r.wallet.slice(0, 6)}…{r.wallet.slice(-4)}
                    </td>
                    <td>{r.asset}</td>
                    <td>{r.amount}</td>
                    <td>{r.path}</td>
                    <td>{r.verified}</td>
                    <td>
                      <a href={r.celoscan} target="_blank" rel="noreferrer">
                        Celoscan <ExternalLink size={12} style={{ display: "inline" }} />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
