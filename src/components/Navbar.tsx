import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronUp, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { to: "/product", label: "Product" },
  { to: "/stablecoins", label: "Stablecoins" },
  { to: "/agent", label: "Agent" },
  { to: "/plans", label: "Plans" },
  { to: "/merch", label: "Merch" },
] as const;

const drawerLinks = [
  { to: "/product", label: "Product" },
  { to: "/stablecoins", label: "Stablecoins" },
  { to: "/agent", label: "Agent" },
  { to: "/plans", label: "Plans" },
  { to: "/merch", label: "Merch" },
  { to: "/brand", label: "Brand" },
  { to: "/faq", label: "FAQs" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/contact", label: "Get in Touch" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header className={`nav${scrolled ? " scrolled" : ""}`}>
        <div className="nav-inner">
          <Logo />
          <nav className="nav-links">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="nav-link"
                activeProps={{ className: "nav-link active" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <button className="pill" onClick={() => setOpen(true)} aria-label="Open menu">
            Menu
            <ChevronUp size={16} strokeWidth={2.2} />
          </button>
        </div>
      </header>

      <div className={`drawer${open ? " open" : ""}`} role="dialog" aria-modal="true">
        <div className="nav-inner">
          <Logo />
          <button className="pill" onClick={() => setOpen(false)} aria-label="Close menu">
            Close
            <X size={16} strokeWidth={2.2} />
          </button>
        </div>
        <div className="drawer-links">
          {drawerLinks.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
        </div>
        <div className="drawer-foot">
          <span>© {new Date().getFullYear()} TILL</span>
          <span>Accra · Celo mainnet</span>
        </div>
      </div>
    </>
  );
}
