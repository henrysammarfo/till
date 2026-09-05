import { z } from "zod";

/** Treat missing or blank env values as undefined so optional keys work. */
function emptyToUndef(v: unknown): unknown {
  if (typeof v === "string" && v.trim() === "") return undefined;
  return v;
}

const optStr = z.preprocess(emptyToUndef, z.string().min(1).optional());
const optUrl = z.preprocess(emptyToUndef, z.string().url().optional());

const envSchema = z.object({
  SUPABASE_URL: optUrl,
  SUPABASE_PUBLISHABLE_KEY: optStr,
  SUPABASE_SERVICE_ROLE_KEY: optStr,
  TELEGRAM_BOT_TOKEN: optStr,
  TELEGRAM_WEBHOOK_SECRET: optStr,
  CELO_RPC_URL: z.preprocess(emptyToUndef, z.string().url().default("https://forno.celo.org")),
  CELO_AGENT_PRIVATE_KEY: optStr,
  CELO_ATTRIBUTION_TAG: optStr,
  CELO_AGENT_WALLET: optStr,
  CELO_ERC8004_URL: optUrl,
  CNGN_TOKEN_ADDRESS: optStr,
  USAT_TOKEN_ADDRESS: optStr,
  USDC_TOKEN_ADDRESS: z.preprocess(
    emptyToUndef,
    z.string().default("0xcEBA9300f2b948710d2653dD7B07f33A8B32118C"),
  ),
  USDT_TOKEN_ADDRESS: z.preprocess(
    emptyToUndef,
    z.string().default("0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e"),
  ),
  X402_API_KEY: optStr,
  X402_FACILITATOR_URL: z.preprocess(
    emptyToUndef,
    z.string().url().default("https://api.x402.celo.org"),
  ),
  X402_PAY_TO: optStr,
  AGENTROUTER_API_KEY: optStr,
  AGENTROUTER_BASE_URL: z.preprocess(
    emptyToUndef,
    z.string().url().default("https://agentrouter.org/v1"),
  ),
  AGENTROUTER_MODEL: z.preprocess(emptyToUndef, z.string().default("claude-sonnet-4-5-20250929")),
  TAVILY_API_KEY: optStr,
  TINYFISH_API_KEY: optStr,
  TILL_DEFAULT_TENANT_SLUG: z.preprocess(emptyToUndef, z.string().default("till")),
  PUBLIC_APP_URL: optUrl,
  VITE_PUBLIC_APP_URL: optUrl,
});

export type TillEnv = z.infer<typeof envSchema>;

let cached: TillEnv | null = null;

export function getEnv(): TillEnv {
  if (cached) return cached;
  cached = envSchema.parse(process.env);
  return cached;
}

/** Clear cache between tests / smoke scripts if env changes. */
export function resetEnvCache(): void {
  cached = null;
}

export function requireEnv<K extends keyof TillEnv>(keys: K[]): Pick<TillEnv, K> {
  const env = getEnv();
  const missing = keys.filter((k) => !env[k]);
  if (missing.length) {
    throw new Error(`Missing required env: ${missing.join(", ")}. No fallbacks.`);
  }
  return env as Pick<TillEnv, K>;
}
