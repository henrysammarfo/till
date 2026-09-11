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

## Agent identity (verified 2026-09-09)

| Claim | Verdict | Evidence |
|---|---|---|
| Agent wallet `0x2879FBd50aBefb979270D2FFFD34d9ce1CecfF59` funded on mainnet | **VERIFIED** | Forno `eth_getBalance` ≈ 1.96 CELO; nonce 1 |
| ERC-8004 Identity agentId `9825` on registry `0x8004A169FB4a3325136EB29fA0ceB6D2e539a432` | **VERIFIED** | Mint tx + Celoscan NFT URL in env / registration.json |
| Env private key matches agent wallet | **VERIFIED** | `viem` `privateKeyToAccount` derivation |
| Contest attribution tag `celo_f30ff80110c6` | **VERIFIED** | `PUT /submissions/me` draft response for agents-at-work |
| Submission status draft (not published) | **VERIFIED** | Same API response `status: draft`, `publishedAt: null` |

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

## Supabase tenant (verified 2026-09-09)

| Claim | Verdict | Evidence |
|---|---|---|
| Multitenant tables exist on project `goxtltzqwtluiqhpwupw` | **VERIFIED** | REST select on tenants/agent_config/till_* |
| Tenant slug `till` bootstrapped with tag `celo_f30ff80110c6` | **VERIFIED** | bootstrap:tenant + register:agent JSON |

## Tokens (verified 2026-09-11)

| Claim | Verdict | Evidence |
|---|---|---|
| Official ASC cNGN on Celo mainnet `0xF6829D7393dAe24509eb1E52eE8e572e2E271a4f` | **VERIFIED** | docs.cngn.co/guides/contract-addresses.md + on-chain name/symbol `cNGN` / 6 decimals |
| Mento NGNm `0xE2702Bd97ee33c88c8f6f92DA3B733608aa76F71` is not ASC cNGN | **VERIFIED** | on-chain symbol `NGNm` / name `Mento Nigerian Naira`; Celo token-contracts docs |
| Telegram bot `@TillPay_bot` | **VERIFIED** | Bot API `getMe` ok |


## Verified 2026-09-11
- Attribution tag in UI = `.env` `CELO_ATTRIBUTION_TAG` = `celo_f30ff80110c6`
- Agent wallet short form matches `CELO_AGENT_WALLET`
- GitHub links point to `henrysammarfo/till`
- Telegram bot `@TillPay_bot` from env username
- Build passes with new privacy/terms routes

## Verified 2026-09-11 (partial)
- GitHub `henrysammarfo/till` is **public**
- Production `/api/ready` reports `tavilyKey: true` after Vercel env sync
- Live MiniPay settle: job created, **signature pending** — attribution not yet verified on-chain
- `x402ApiKey` still false until operator pastes key

## Verified 2026-09-11
- Live tagged mainnet tx `0x7d0221dfe80738d5ea59067e0904e599cbbedd1d9573fd2cc372aaabb7ad9b7b` includes `celo_f30ff80110c6` via `@celo/attribution-tags` verifyTx
- Celoscan: https://celoscan.io/tx/0x7d0221dfe80738d5ea59067e0904e599cbbedd1d9573fd2cc372aaabb7ad9b7b
- Residual: this settle was agent-wallet CELO (not MiniPay EIP-3009 / cNGN). Product MiniPay loop still unproven end-to-end.
- `tavilyKey: true` on production ready; `x402ApiKey: false`
