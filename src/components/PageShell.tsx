import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { SiteFooter } from "./SiteFooter";

export function PageShell({
  eyebrow,
  title,
  lede,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede: string;
  children: ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>
        <section className="section page-top" style={{ paddingBottom: 48 }}>
          <div className="wrap">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="h1">{title}</h1>
            <p className="lede">{lede}</p>
          </div>
        </section>
        <hr className="divider" />
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
