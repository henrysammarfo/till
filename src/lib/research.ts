import { z } from "zod";
import { requireEnv } from "@/server/env";

const tavilyResultSchema = z.object({
  results: z.array(
    z.object({
      title: z.string(),
      url: z.string(),
      content: z.string(),
      score: z.number().optional(),
    }),
  ),
  answer: z.string().nullable().optional(),
});

export type TavilyHit = z.infer<typeof tavilyResultSchema>["results"][number];

export async function tavilySearch(
  query: string,
  opts?: { maxResults?: number; includeAnswer?: boolean },
): Promise<{ answer: string | null; results: TavilyHit[] }> {
  const { TAVILY_API_KEY } = requireEnv(["TAVILY_API_KEY"]);
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: "advanced",
      include_answer: opts?.includeAnswer ?? true,
      max_results: opts?.maxResults ?? 5,
    }),
  });
  if (!res.ok) {
    throw new Error(`Tavily search failed: ${res.status} ${await res.text()}`);
  }
  const parsed = tavilyResultSchema.parse(await res.json());
  return { answer: parsed.answer ?? null, results: parsed.results };
}

export async function tinyfishRun(input: { url: string; goal: string }): Promise<unknown> {
  const { TINYFISH_API_KEY } = requireEnv(["TINYFISH_API_KEY"]);
  const res = await fetch("https://agent.tinyfish.ai/v1/automation/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": TINYFISH_API_KEY,
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    throw new Error(`TinyFish run failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}
