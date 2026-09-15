import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy — TILL" },
      {
        name: "description",
        content:
          "How TILL handles Telegram handles, wallet addresses, booking details and portal codes. Residual risk documented — we do not claim unhackable.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy"
      title="What we hold, and why."
      lede="TILL is a payment till. We store only what is required to settle a job, run the client portal, or reply to a booking — nothing more."
    >
      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          <div className="grid" style={{ gap: 28 }}>
            <div>
              <h2 className="h3">Data we process</h2>
              <p className="body-sm">
                Telegram user ids and chat context for till jobs; wallet addresses you authorise;
                booking name/email/slot; client portal codes and project updates you are entitled to
                see; and operational logs needed to settle and attribute transactions on Celo
                mainnet.
              </p>
            </div>
            <div>
              <h2 className="h3">What we do not do</h2>
              <p className="body-sm">
                We do not sell personal data. We do not store seed phrases or private keys for user
                MiniPay wallets. Agent keys used to submit tagged settlements are held as host
                secrets, not in the browser.
              </p>
            </div>
            <div>
              <h2 className="h3">On-chain transparency</h2>
              <p className="body-sm">
                Settlements are public on Celo. Attribution tags and ERC-8004 identity are designed
                to be verifiable. Residual risk remains — we document it and do not claim the system
                is unhackable.
              </p>
            </div>
            <div>
              <h2 className="h3">Contact</h2>
              <p className="body-sm">
                Privacy questions: <Link to="/contact">/contact</Link> or Telegram{" "}
                <a href="https://t.me/TillPay_bot" target="_blank" rel="noreferrer">
                  @TillPay_bot
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
