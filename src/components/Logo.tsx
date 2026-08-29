import { Link } from "@tanstack/react-router";
import mark from "@/assets/till-mark.png";

export function Logo({ withMark = true, to = "/" }: { withMark?: boolean; to?: "/" | "/dashboard" }) {
  return (
    <Link to={to} className="logo" aria-label="TILL home">
      {withMark && (
        <img className="logo-mark" src={mark} alt="" width={22} height={22} />
      )}
      <span>Till</span>
      <sup>®</sup>
    </Link>
  );
}
