import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Download, ExternalLink, Search } from "lucide-react";

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

const rows = [
  ["29 Aug 09:41", "0x7f2c…c41d", "cNGN", "5,000", "EIP-3009", "0x91ac…22f1"],
  ["29 Aug 09:22", "0x18ab…9f04", "cNGN", "12,500", "MiniPay", "0x4d0e…88ca"],
  ["29 Aug 08:57", "0x44de…21bb", "USA₮", "40.00", "x402", "0xbb71…04e9"],
  ["29 Aug 08:31", "0x9c10…7a3f", "cNGN", "2,000", "Relay", "0x2f66…7d3a"],
  ["29 Aug 08:04", "0xa2f8…5512", "cNGN", "8,750", "EIP-3009", "0x77c2…9910"],
  ["28 Aug 21:12", "0x3ba9…ee71", "USDC", "25.00", "x402", "0x5a48…31bd"],
  ["28 Aug 19:48", "0xd41c…0092", "cNGN", "3,300", "MiniPay", "0xc019…4f7e"],
  ["28 Aug 18:05", "0x6e77…ba13", "cNGN", "15,000", "EIP-3009", "0x8ee3…60a2"],
];

function Transactions() {
  const [q, setQ] = useState("");
  const filtered = rows.filter((r) => r.join(" ").toLowerCase().includes(q.toLowerCase()));

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
        <button className="pill">
          Export CSV <Download size={15} />
        </button>
      </header>

      <div className="dash-body">
        <div className="card" style={{ padding: 16, display: "flex", gap: 10, alignItems: "center" }}>
          <Search size={16} strokeWidth={1.9} />
          <input
            className="input"
            style={{ border: 0, padding: 0 }}
            placeholder="Filter by wallet, asset, path or hash"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="badge">{filtered.length} results</span>
        </div>

        <div className="card scroll-x">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Counterparty</th>
                <th>Asset</th>
                <th>Amount</th>
                <th>Path</th>
                <th>Tx hash</th>
                <th>Tag</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r[5]}>
                  <td className="mono">{r[0]}</td>
                  <td className="mono">{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td>
                    <span className="badge">{r[4]}</span>
                  </td>
                  <td className="mono">{r[5]}</td>
                  <td>
                    <span className="badge badge-dark mono">celo_9f31ab77c204</span>
                  </td>
                  <td>
                    <a
                      href="https://celoscan.io"
                      target="_blank"
                      rel="noreferrer"
                      className="badge"
                      style={{ gap: 5 }}
                    >
                      Celoscan <ExternalLink size={11} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
