import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import mark from "@/assets/till-mark.png";

export const Route = createFileRoute("/brand")({
  head: () => ({
    meta: [
      { title: "Brand system — the TILL® mark, wordmark and palette" },
      {
        name: "description",
        content:
          "The TILL brand: an italic serif wordmark, a four-bar till mark, black and white only, Inter and Source Serif 4, tight negative tracking.",
      },
      { property: "og:title", content: "TILL® brand system" },
      {
        property: "og:description",
        content: "Wordmark, mark, palette and type rules for TILL — built for print and merch.",
      },
    ],
  }),
  component: BrandPage,
});

function BrandPage() {
  return (
    <PageShell
      eyebrow="Brand"
      title={
        <>
          One mark, two typefaces, <span className="serif italic">no colour</span>.
        </>
      }
      lede="TILL reads the same on a chat receipt, a Celoscan link and an embroidered chest. The system is deliberately narrow so it survives every surface it lands on."
    >
      <section className="section">
        <div className="wrap">
          <div className="grid grid-3">
            <div className="lockup">
              <span className="logo" style={{ fontSize: 46 }}>
                Till<sup style={{ fontSize: 18 }}>®</sup>
              </span>
            </div>
            <div className="lockup lockup-dark">
              <img
                src={mark}
                alt="TILL mark"
                width={110}
                height={110}
                loading="lazy"
                style={{ filter: "invert(1)" }}
              />
            </div>
            <div className="lockup">
              <div style={{ textAlign: "center" }}>
                <img src={mark} alt="" width={54} height={54} loading="lazy" />
                <div className="logo" style={{ fontSize: 34, justifyContent: "center" }}>
                  Till<sup>®</sup>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-2" style={{ marginTop: 44, gap: 44 }}>
            <div>
              <h2 className="h2">Typography</h2>
              <p className="body-sm" style={{ marginBottom: 22 }}>
                Inter for everything functional. Source Serif 4 italic for the wordmark and for the
                one word per headline that deserves emphasis. Tracking stays negative — -0.04em for
                UI, -0.07em for display.
              </p>
              <div className="card">
                <p style={{ fontSize: 44, letterSpacing: "-0.07em", fontWeight: 600, margin: 0 }}>
                  Aa <span className="serif italic">Aa</span>
                </p>
                <p className="body-sm" style={{ marginTop: 14 }}>
                  Inter 400/500/600/700 · Source Serif 4 400/600, roman and italic
                </p>
              </div>
            </div>
            <div>
              <h2 className="h2">Palette</h2>
              <p className="body-sm" style={{ marginBottom: 22 }}>
                Ink, paper and two greys. A single green is reserved for live status only — never
                decoration.
              </p>
              <div className="grid grid-4">
                {[
                  ["#0A0A0A", "Ink"],
                  ["#FFFFFF", "Paper"],
                  ["#6B6B6B", "Muted"],
                  ["#17C964", "Live"],
                ].map(([hex, name]) => (
                  <div key={name}>
                    <div className="swatch" style={{ background: hex }} />
                    <p className="body-sm" style={{ marginTop: 8 }}>
                      {name}
                      <br />
                      <span className="mono">{hex}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-3" style={{ marginTop: 44 }}>
            {[
              ["Do", "Give the mark clear space equal to one bar width on every side."],
              ["Do", "Use the italic serif wordmark for the logo, never for body copy."],
              ["Don't", "Recolour, rotate, outline or add effects to the mark."],
            ].map(([k, v], i) => (
              <div className="card" key={i}>
                <span className={`tag${k === "Do" ? " tag-solid" : ""}`}>{k}</span>
                <p className="body-sm" style={{ marginTop: 14 }}>
                  {v}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
