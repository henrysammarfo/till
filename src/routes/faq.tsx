import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus } from "lucide-react";
import { PageShell } from "@/components/PageShell";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQs — independence, attribution, gas and settlement | TILL®" },
      {
        name: "description",
        content:
          "Answers on counterparty independence, attribution tags, who counts as a user, fee abstraction, x402 settlement and why TILL never farms self-funded volume.",
      },
      { property: "og:title", content: "TILL FAQs" },
      {
        property: "og:description",
        content: "How independence, attribution, gas and settlement actually work on TILL.",
      },
    ],
  }),
  component: FaqPage,
});

const faqs = [
  {
    q: "What exactly is a “till job”?",
    a: "One instruction that moves money to one person: pay this counterparty, this amount, now. TILL deliberately does not try to be a general assistant — the narrow loop is what makes it reliable and auditable.",
  },
  {
    q: "How do you decide a counterparty is independent?",
    a: "The wallet must not be an operator wallet, must not have been first-funded by us or by a dominant funder, and ideally shows Celo activity from before 28 Aug 2026. If it fails, the till refuses and says why.",
  },
  {
    q: "Who counts as a user if gas is sponsored?",
    a: "The authoriser. EIP-3009 signers and sponsored-relay signers are users even when a relayer pays gas. That is the whole point of fee abstraction — the human never needs a gas token.",
  },
  {
    q: "How is attribution handled on the x402 leg?",
    a: "The facilitator cannot carry an attribution tag, so that leg is attributed by agentWalletAddress instead. The wallet is declared at registration so the mapping is public and checkable.",
  },
  {
    q: "Which stablecoins can I settle in?",
    a: "cNGN for direct naira payouts, USA₮ over x402 for the agent microservice leg, and USDC or Ripio wFIAT where a counterparty prefers it. All paths run on Celo mainnet.",
  },
  {
    q: "Do you optimise for total value moved?",
    a: "No. Self-funded float is easy to farm and worth nothing. TILL is measured on verified users, distinct authorisers and returning activity across two or more distinct days.",
  },
  {
    q: "Is any of this on testnet?",
    a: "No. Celo mainnet only, from the first smoke transaction onward.",
  },
  {
    q: "Where can I verify the numbers?",
    a: "Every transaction carries the attribution suffix, so it is visible on Celoscan and in the public Dune dashboard. The agent identity is on 8004scan and the repository is public.",
  },
];

function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <PageShell
      eyebrow="FAQs"
      title={
        <>
          The questions people <span className="serif italic">actually</span> ask.
        </>
      }
      lede="Short answers about independence, attribution, gas and settlement — the four things that decide whether a till is real or theatre."
    >
      <section className="section">
        <div className="wrap" style={{ maxWidth: 900 }}>
          {faqs.map((f, i) => (
            <div className="faq-item" key={f.q}>
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {f.q}
                {open === i ? <Minus size={18} /> : <Plus size={18} />}
              </button>
              {open === i && <p className="faq-a">{f.a}</p>}
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
