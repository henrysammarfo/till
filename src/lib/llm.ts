import OpenAI from "openai";
import { requireEnv, getEnv } from "@/server/env";

export type LlmMessage = { role: "system" | "user" | "assistant"; content: string };

export type LlmUsage = {
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  ms: number;
};

export type LlmResult = {
  text: string;
  usage: LlmUsage;
};

const FINGERPRINT_HEADERS: Record<string, string> = {
  Originator: "codex_cli_rs",
  "User-Agent": "codex_cli_rs/0.114.0 (Linux; x86_64)",
  "HTTP-Referer": "https://github.com/henrysammarfo/till",
  "X-Title": "TILL",
};

/**
 * AgentRouter OpenAI-compatible client. No silent fallback to other providers.
 */
export function createAgentRouterClient(): OpenAI {
  const { AGENTROUTER_API_KEY, AGENTROUTER_BASE_URL } = requireEnv([
    "AGENTROUTER_API_KEY",
    "AGENTROUTER_BASE_URL",
  ]);

  return new OpenAI({
    apiKey: AGENTROUTER_API_KEY,
    baseURL: AGENTROUTER_BASE_URL,
    defaultHeaders: FINGERPRINT_HEADERS,
  });
}

function assertJsonCompletion(raw: string): void {
  const trimmed = raw.trim();
  if (
    trimmed.startsWith("<!doctype") ||
    trimmed.startsWith("<html") ||
    trimmed.includes("aliyun_waf")
  ) {
    throw new Error(
      "AgentRouter returned WAF/HTML instead of JSON. Egress from this host is blocked — no LLM fallback. Use structured till commands (send N ASSET to 0x…) or run AgentRouter from an allowlisted network.",
    );
  }
}

/**
 * Direct fetch path so WAF HTML is detected before the OpenAI SDK mis-parses it.
 */
export async function chatCompletion(
  messages: LlmMessage[],
  opts?: { model?: string; temperature?: number; maxTokens?: number },
): Promise<LlmResult> {
  const { AGENTROUTER_API_KEY, AGENTROUTER_BASE_URL, AGENTROUTER_MODEL } = requireEnv([
    "AGENTROUTER_API_KEY",
    "AGENTROUTER_BASE_URL",
    "AGENTROUTER_MODEL",
  ]);
  const model = opts?.model ?? AGENTROUTER_MODEL;
  const started = Date.now();

  const res = await fetch(`${AGENTROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${AGENTROUTER_API_KEY}`,
      ...FINGERPRINT_HEADERS,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts?.temperature ?? 0.2,
      max_tokens: opts?.maxTokens ?? 800,
    }),
  });

  const raw = await res.text();
  assertJsonCompletion(raw);

  if (!res.ok) {
    throw new Error(`AgentRouter HTTP ${res.status}: ${raw.slice(0, 400)}`);
  }

  let completion: {
    choices?: Array<{ message?: { content?: string | null } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };
  try {
    completion = JSON.parse(raw);
  } catch {
    throw new Error(`AgentRouter returned non-JSON: ${raw.slice(0, 200)}`);
  }

  const text = completion.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error("AgentRouter returned empty completion — no fallback.");
  }

  return {
    text,
    usage: {
      model,
      promptTokens: completion.usage?.prompt_tokens ?? 0,
      completionTokens: completion.usage?.completion_tokens ?? 0,
      totalTokens: completion.usage?.total_tokens ?? 0,
      ms: Date.now() - started,
    },
  };
}

/** Health probe used by smoke scripts — returns ok:false on WAF without throwing for CI logging. */
export async function probeAgentRouter(): Promise<{ ok: boolean; detail: string }> {
  try {
    const env = getEnv();
    if (!env.AGENTROUTER_API_KEY) return { ok: false, detail: "AGENTROUTER_API_KEY missing" };
    await chatCompletion(
      [
        { role: "system", content: "Reply with exactly: TILL_OK" },
        { role: "user", content: "ping" },
      ],
      { maxTokens: 16 },
    );
    return { ok: true, detail: "chat.completions reachable" };
  } catch (e) {
    return { ok: false, detail: e instanceof Error ? e.message : String(e) };
  }
}
