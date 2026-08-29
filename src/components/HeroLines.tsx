export function HeroLines() {
  const lines = Array.from({ length: 20 });

  return (
    <div className="lines" aria-hidden="true">
      {lines.map((_, i) => (
        <span
          key={`l-${i}`}
          className="line line-left"
          style={{ width: `${60 + i * 10}px`, animationDelay: `${i * 0.25}s` }}
        />
      ))}
      {lines.map((_, i) => (
        <span
          key={`r-${i}`}
          className="line line-right"
          style={{ width: `${60 + i * 10}px`, animationDelay: `${i * 0.25}s` }}
        />
      ))}
      {lines.map((_, i) => (
        <span
          key={`t-${i}`}
          className="line line-top"
          style={{ height: `${60 + i * 10}px`, animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </div>
  );
}
