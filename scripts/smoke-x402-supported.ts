/**
 * Smoke: probe Celo x402 facilitator /supported (no API key required).
 */
async function main() {
  const base = process.env.X402_FACILITATOR_URL || "https://api.x402.celo.org";
  const res = await fetch(`${base}/supported`);
  const text = await res.text();
  if (!res.ok) throw new Error(`/supported ${res.status}: ${text}`);
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON /supported body: ${text.slice(0, 200)}`);
  }
  const raw = text.toLowerCase();
  const usat = raw.includes("usat") || raw.includes("usa₮");
  console.log(
    JSON.stringify(
      {
        ok: true,
        facilitator: base,
        usatMentionedInSupported: usat,
        bodyPreview: json,
      },
      null,
      2,
    ),
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
