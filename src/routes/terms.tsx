import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms — TILL" },
      {
        name: "description",
        content:
          "Terms for using the TILL chat till, MiniPay authorization, client portal and booking flows on Celo mainnet.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <PageShell
      eyebrow="Terms"
      title="Use the till carefully."
      lede="TILL settles stablecoins on Celo mainnet. You authorise transfers; we submit tagged settlement where the product path requires it. Residual risk is documented — we do not claim unhackable."
    >
      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="grid" style={{ gap: 28 }}>
            <div>
              <h2 className="h3">Service</h2>
              <p className="body-sm">
                TILL provides chat-based payment till software, a MiniPay authorize page, a client
                portal, and related studio tooling. Features may change during the contest window
                and after.
              </p>
            </div>
            <div>
              <h2 className="h3">Your responsibility</h2>
              <p className="body-sm">
                You are responsible for wallet access, counterparty addresses, and amounts you
                confirm. Double-check every authorize screen before signing. Independence policy
                failures are refusals, not soft warnings.
              </p>
            </div>
            <div>
              <h2 className="h3">No financial advice</h2>
              <p className="body-sm">
                Nothing on this site is investment, legal or tax advice. Stablecoin settlement
                carries market, smart-contract and operational risk.
              </p>
            </div>
            <div>
              <h2 className="h3">Questions</h2>
              <p className="body-sm">
                <Link to="/contact">Contact</Link> · <Link to="/privacy">Privacy</Link> ·{" "}
                <Link to="/faq">FAQs</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
