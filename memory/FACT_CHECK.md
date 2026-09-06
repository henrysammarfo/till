# FACT_CHECK

Only verified or explicitly marked **UNVERIFIED** claims live here. Update when live checks change.

## Contest (verified 2026-09-04)

| Claim | Verdict | Evidence |
|---|---|---|
| Deadline Sep 14 2026 09:00 GMT | **VERIFIED** | UpSkill Africa / Celo posts; TradingView Coindar kickoff note |
| Kickoff Aug 28 2026 | **VERIFIED** | Same posts |
| Registration via `npx skills add https://celobuilders.xyz` then agent register | **VERIFIED** | Live skill.md + UpSkill Africa posts; slug `agents-at-work` |
| Registration site agentscooking.xyz | **REJECTED** | Wrong site — official is celobuilders.xyz agent-native flow |
| Attribution tags for leaderboard | **VERIFIED** | docs.celo.org/build-on-celo/attribution-tags; `@celo/attribution-tags` |
| Attribution standard = ERC-8021 | **VERIFIED** | Celo attribution docs |
| ERC-8004 = agent identity/reputation registries | **VERIFIED** | docs.celo.org/build-on-celo/build-with-ai/8004 |
| Mainnet-only scoring | **VERIFIED** (contest doctrine + Bible) | Contest communications; re-confirm via Dune kickoff queries |

## x402 / tokens

| Claim | Verdict | Evidence |
|---|---|---|
| Facilitator API = `https://api.x402.celo.org` | **VERIFIED** | docs.celo.org x402 (dashboard SPA is x402.celo.org — do not point servers there) |
| Facilitator settles USDC + USDT via EIP-3009 | **VERIFIED** | Official Celo x402 docs |
| USDC Celo mainnet `0xcEBA9300f2b948710d2653dD7B07f33A8B32118C` | **VERIFIED** | Official x402 docs |
| USDT Celo mainnet `0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e` | **VERIFIED** | Official x402 docs |
| USA₮ settled by Celo x402 facilitator | **NOT listed in /supported (2026-09-04 smoke)** | Live `GET https://api.x402.celo.org/supported` — kinds exact/celo only; no USA₮ mention. Gate in code. |
| USDC fee adapter mainnet `0x2F25deB3848C207fc8E0c34035B3Ba7fC157602B` | **VERIFIED** | docs.celo.org fee-abstraction guide |
| USDT fee adapter mainnet `0x0e2a3e05bc9a16f5292a6170456a710cb89c6f72` | **VERIFIED** | docs.celo.org fee-abstraction celocli example |
| cNGN / USA₮ fee adapters | **UNVERIFIED** — fail closed in code until listed | — |

## Security language

| Claim | Verdict |
|---|---|
| Product is “unhackable” / NK-proof | **REJECTED** — document residual risk only |

## API tooling (this environment)

| Tool | Verdict |
|---|---|
| Tavily search | Works with provided key (rotate after chat exposure) |
| TinyFish Agent API | Auth OK; **0 credits** on prior key — need new key/credits |
| AgentRouter `/v1/chat/completions` from this Cloud Agent host | **BLOCKED (Aliyun WAF HTML, 2026-09-04)** | Live probe returns captcha HTML despite fingerprint headers. Structured till intents still work without NL. No LLM fallback. |
