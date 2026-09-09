/**
 * Smoke: AgentRouter chat completion (requires AGENTROUTER_API_KEY).
 * Fail closed — no mock response.
 */
import { probeAgentRouter } from "../src/lib/llm";

async function main() {
  const result = await probeAgentRouter();
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) {
    // Non-zero so CI notices; structured commands still work without NL LLM.
    process.exit(2);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
