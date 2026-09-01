import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Package } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import hoodie from "@/assets/merch-hoodie.jpg";
import tee from "@/assets/merch-tee.jpg";
import cap from "@/assets/merch-cap.jpg";

export const Route = createFileRoute("/merch")({
  head: () => ({
    meta: [
      { title: "Merch — TILL® hoodies, tees and caps" },
      {
        name: "description",
        content:
          "TILL merch: heavyweight black hoodie, white heavyweight tee and embroidered corduroy cap, all carrying the TILL mark. Drops ship from Accra.",
      },
      { property: "og:title", content: "TILL® merch" },
      {
        property: "og:description",
        content: "Heavyweight hoodie, tee and cap carrying the TILL mark. Drop 001, Accra.",
      },
    ],
  }),
  component: MerchPage,
});

const items = [
  { img: hoodie, name: "Counter Hoodie", price: "₦48,000", note: "Heavyweight fleece · black" },
  { img: tee, name: "Authoriser Tee", price: "₦22,000", note: "260gsm cotton · white" },
  { img: cap, name: "Suffix Cap", price: "₦18,000", note: "Embroidered corduroy · black" },
];

function MerchPage() {
  return (
    <PageShell
      eyebrow="Merch — Drop 001"
      title={
        <>
          Wear the <span className="serif italic">till</span>.
        </>
      }
      lede="Small, quiet pieces built on the same rules as the product: black, white, one mark, no noise. Pay in cNGN through the till, of course."
    >
      <section className="section">
        <div className="wrap">
          <div className="grid grid-3">
            {items.map((it) => (
              <article className="merch-card" key={it.name}>
                <img
                  className="merch-img"
                  src={it.img}
                  alt={it.name}
                  loading="lazy"
                  width={1024}
                  height={1280}
                />
                <div className="merch-meta">
                  <div>
                    <h3 className="h3" style={{ margin: 0 }}>
                      {it.name}
                    </h3>
                    <p className="body-sm">{it.note}</p>
                  </div>
                  <span className="tag tag-solid">{it.price}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="card" style={{ marginTop: 34, display: "flex", gap: 18, alignItems: "center" }}>
            <div className="card-icon" style={{ marginBottom: 0 }}>
              <Package size={18} strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="h3" style={{ margin: 0 }}>
                Drop 001 ships from Accra
              </h3>
              <p className="body-sm">
                Limited run. Join the till to get the drop link before it goes public.
              </p>
            </div>
            <Link to="/contact" className="btn-primary" style={{ marginLeft: "auto" }}>
              Join the list <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
