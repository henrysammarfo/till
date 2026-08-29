import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Logo />
            <p className="body-sm" style={{ marginTop: 14, maxWidth: 280 }}>
              The chat till for MiniPay. Say who and how much, sign once — cNGN or USA₮ lands with
              an independent party on Celo mainnet.
            </p>
          </div>
          <div>
            <h4>Product</h4>
            <Link to="/product">How it works</Link>
            <Link to="/stablecoins">Stablecoins</Link>
            <Link to="/agent">Agent identity</Link>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/plans">Plans</Link>
            <Link to="/brand">Brand</Link>
            <Link to="/merch">Merch</Link>
            <Link to="/faq">FAQs</Link>
          </div>
          <div>
            <h4>Connect</h4>
            <Link to="/contact">Get in touch</Link>
            <a href="https://celoscan.io" target="_blank" rel="noreferrer">
              Celoscan
            </a>
            <a href="https://dune.com/celo/agents-at-work-hackathon" target="_blank" rel="noreferrer">
              Dune leaderboard
            </a>
            <a href="https://celobuilders.xyz" target="_blank" rel="noreferrer">
              Celo Builders
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} TILL®. All rights reserved.</span>
          <span>Built in Accra · Celo mainnet only</span>
        </div>
      </div>
    </footer>
  );
}
