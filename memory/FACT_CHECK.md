# FACT_CHECK

Only verified or explicitly marked **UNVERIFIED** claims live here. Update when live checks change.

## Contest (verified 2026-09-04)

| Claim | Verdict | Evidence |
|---|---|---|
| Deadline Sep 14 2026 09:00 GMT | **VERIFIED** | UpSkill Africa / Celo posts; TradingView Coindar kickoff note |
| Kickoff Aug 28 2026 | **VERIFIED** | Same posts |
| Registration via `npx skills add https://celobuilders.xyz` | **VERIFIED** | Hackathon posts |
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
| USA₮ settled by Celo x402 facilitator | **UNVERIFIED until `/supported`** | Marketing page mentions USA₮; official docs emphasize USDC/USDT. Gate in code. |
| cNGN mainnet contract address | **UNVERIFIED — resolve before transfers** | Do not trust unverified search snippets; confirm Celoscan + official cNGN/Celo docs |

## Security language

| Claim | Verdict |
|---|---|
| Product is “unhackable” / NK-proof | **REJECTED** — document residual risk only |

## API tooling (this environment)

| Tool | Verdict |
|---|---|
| Tavily search | Works with provided key (rotate after chat exposure) |
| TinyFish Agent API | Auth OK; **0 credits** on prior key — need new key/credits |
| AgentRouter `/v1/models` from this host | Hit Aliyun WAF captcha HTML — use chat/completions + fingerprint headers; smoke-test before NL |
