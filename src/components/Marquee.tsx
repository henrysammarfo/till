import type { ReactNode } from "react";

export function Marquee({
  children,
  className = "",
  copies = 4,
}: {
  children: ReactNode;
  className?: string;
  copies?: number;
}) {
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track">
        {Array.from({ length: copies }).map((_, i) => (
          <div className="marquee-group" key={i} aria-hidden={i > 0}>
            {children}
          </div>
        ))}
      </div>
    </div>
  );
}
