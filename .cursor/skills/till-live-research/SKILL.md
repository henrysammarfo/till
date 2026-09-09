---
name: till-live-research
description: Live fact-checking and web automation via Tavily and TinyFish plus AgentRouter LLM metering. Use when verifying contest claims, token addresses, or external docs — never hallucinate.
---

# TILL Live Research

## Tools

- **Tavily:** `TAVILY_API_KEY` → `src/lib/research.ts` `tavilySearch`
- **TinyFish:** `TINYFISH_API_KEY` → Agent API `https://agent.tinyfish.ai/v1/automation/...` (needs credits)
- **LLM:** AgentRouter only — `src/lib/llm.ts` (`AGENTROUTER_API_KEY`, base `https://agentrouter.org/v1`)

## Discipline

1. Prefer primary docs (docs.celo.org, Celoscan) over search snippets.
2. Write results into `memory/FACT_CHECK.md` with VERIFIED/UNVERIFIED.
3. No silent fallback if a provider fails — surface the error.
4. Never log API keys.
