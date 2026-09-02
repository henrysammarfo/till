import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Save } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  head: () => ({
    meta: [
      { title: "Till settings — policy, assets and limits | TILL®" },
      {
        name: "description",
        content:
          "Configure the till: default settlement asset, independence policy strictness, proof-of-personhood threshold and RPC endpoint.",
      },
      { property: "og:title", content: "TILL settings" },
      { property: "og:description", content: "Policy, assets, limits and RPC configuration." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [saved, setSaved] = useState(false);

  return (
    <>
      <header className="dash-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>
            Configuration
          </p>
          <h1 className="h3" style={{ margin: "6px 0 0", fontSize: 22 }}>
            Till settings
          </h1>
        </div>
        <button
          className="pill"
          onClick={() => {
            setSaved(true);
            window.setTimeout(() => setSaved(false), 2000);
          }}
        >
          {saved ? "Saved" : "Save changes"} <Save size={15} />
        </button>
      </header>

      <div className="dash-body">
        <div className="grid grid-2" style={{ alignItems: "start" }}>
          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h2 className="h3" style={{ margin: 0 }}>
              Settlement
            </h2>
            <div className="field">
              <label className="label" htmlFor="asset">
                Default asset
              </label>
              <select className="select" id="asset" defaultValue="cngn">
                <option value="cngn">cNGN — direct naira payout</option>
                <option value="usat">USA₮ — x402 agent leg</option>
                <option value="usdc">USDC — bridge</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="limit">
                Single-job limit
              </label>
              <input className="input" id="limit" defaultValue="₦250,000" />
            </div>
            <div className="field">
              <label className="label" htmlFor="pop">
                Proof-of-personhood threshold
              </label>
              <input className="input" id="pop" defaultValue="₦100,000" />
            </div>
          </div>

          <div className="card" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <h2 className="h3" style={{ margin: 0 }}>
              Policy &amp; infrastructure
            </h2>
            <div className="field">
              <label className="label" htmlFor="policy">
                Independence policy
              </label>
              <select className="select" id="policy" defaultValue="strict">
                <option value="strict">Strict — require pre-Aug-28 Celo activity</option>
                <option value="standard">Standard — refuse first-funded wallets only</option>
              </select>
            </div>
            <div className="field">
              <label className="label" htmlFor="rpc">
                RPC endpoint
              </label>
              <input className="input" id="rpc" defaultValue="https://forno.celo.org" />
            </div>
            <div className="field">
              <label className="label" htmlFor="tag">
                Attribution tag
              </label>
              <input className="input mono" id="tag" defaultValue="celo_9f31ab77c204" readOnly />
            </div>
            <p className="body-sm">
              The attribution tag is fixed at registration. Changing it would orphan every prior
              transaction on the leaderboard.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
