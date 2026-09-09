import { z } from "zod";
import { isAddress } from "viem";
import { chatCompletion } from "@/lib/llm";

export const tillIntentSchema = z.object({
  asset: z.enum(["cNGN", "USDC", "USDT", "USAT"]),
  amount: z.string().regex(/^\d+(\.\d+)?$/),
  to: z.string().refine((v) => isAddress(v), "Invalid counterparty address"),
  memo: z.string().max(280).optional(),
});

export type TillIntent = z.infer<typeof tillIntentSchema>;

const STRUCTURED =
  /send\s+(\d+(?:\.\d+)?)\s+(cngn|usdc|usdt|usa[t₮]|usat)\s+to\s+(0x[a-fA-F0-9]{40})/i;

/**
 * Deterministic parser first; AgentRouter only when NL is required.
 * No mock intents.
 */
export async function parseTillIntent(raw: string): Promise<TillIntent> {
  const structured = raw.trim().match(STRUCTURED);
  if (structured) {
    const amount = structured[1]!;
    const assetRaw = structured[2]!.toLowerCase();
    const asset =
      assetRaw === "cngn"
        ? "cNGN"
        : assetRaw.startsWith("usa")
          ? "USAT"
          : (assetRaw.toUpperCase() as "USDC" | "USDT");
    return tillIntentSchema.parse({ asset, amount, to: structured[3]! });
  }

  const { text } = await chatCompletion(
    [
      {
        role: "system",
        content:
          'Extract a TILL payment intent. Reply JSON only: {"asset":"cNGN|USDC|USDT|USAT","amount":"string","to":"0x...","memo":"optional"}. Refuse unrelated messages with {"error":"..."} .',
      },
      { role: "user", content: raw },
    ],
    { temperature: 0 },
  );

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Intent LLM returned non-JSON: ${text.slice(0, 200)}`);
  }
  if (json && typeof json === "object" && "error" in json) {
    throw new Error(String((json as { error: unknown }).error));
  }
  return tillIntentSchema.parse(json);
}
