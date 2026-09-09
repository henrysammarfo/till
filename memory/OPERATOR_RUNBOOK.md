# TILL Operator Runbook — live mainnet launch

**Security:** Residual risk only. Never claim unhackable. See `memory/THREAT_MODEL.md`.

Do these steps **in order**. Do not skip probes. Do not invent token addresses.

---

## 0. Keys to paste into env (then rotate anything previously shared in chat)

Put only in `.env` / host secrets — **never** commit.

| # | Key | When |
|---|-----|------|
| 1 | `SUPABASE_URL` | Now |
| 2 | `SUPABASE_SERVICE_ROLE_KEY` | Now |
| 3 | `SUPABASE_PUBLISHABLE_KEY` + matching `VITE_SUPABASE_*` | Now (Studio auth) |
| 4 | `TELEGRAM_BOT_TOKEN` | Now (@BotFather) |
| 5 | `TELEGRAM_WEBHOOK_SECRET` | Now (long random string you generate) |
| 6 | `PUBLIC_APP_URL` | After deploy (HTTPS origin, no trailing slash) |
| 7 | `CELO_AGENT_PRIVATE_KEY` | Now (relayer key — fund with CELO or USDC for gas) |
| 8 | `CNGN_TOKEN_ADDRESS` | Now — **only after Celoscan/official verify** |
| 9 | `X402_API_KEY` | When claiming x402 settle |
| 10 | `CELO_ATTRIBUTION_TAG` | **After** agent-native register via https://celobuilders.xyz |
| 11 | `CELO_AGENT_WALLET` | **After** contest register (must match declared wallet) |
| 12 | `CELO_ERC8004_URL` | Optional; defaults to repo registration.json |
| 13 | `AGENTROUTER_API_KEY` | Optional (structured Telegram cmds work without NL) |

Already defaulted (do not invent replacements unless verified):

- `CELO_RPC_URL=https://forno.celo.org`
- `USDC_TOKEN_ADDRESS` / `USDT_TOKEN_ADDRESS` (see `.env.example`)
- Fee adapters: USDC/USDT only (cNGN/USAT fee path fail-closed)

---

## 1. Apply multitenant migration

In Supabase SQL editor (or CLI), run:

`supabase/migrations/20260904140000_till_multitenant.sql`

Confirm tables exist: `tenants`, `agent_config`, `till_jobs`, `till_transactions`, `attribution_events`.

---

## 2. Bootstrap default tenant

With `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` set:

```bash
bun run bootstrap:tenant -- \
  --slug till \
  --name "TILL" \
  --telegram-username YourTillBot \
  --agent-wallet 0xYourAgentWallet
```

Use the **same** agent wallet you will declare when registering via celobuilders.xyz.

---

## 3. Deploy app + set `PUBLIC_APP_URL`

Deploy the app on Vercel (or your HTTPS host). Then set:

```bash
PUBLIC_APP_URL=https://your-real-https-domain.example
VITE_PUBLIC_APP_URL=https://your-real-https-domain.example
```

No trailing slash. Must be HTTPS reachable from Telegram.

---

## 4. Health + ready probes (must pass before webhook)

```bash
curl -sS "$PUBLIC_APP_URL/api/health"
curl -sS "$PUBLIC_APP_URL/api/ready"
```

- `/api/health` → `ok: true`
- `/api/ready` → `ready: true` and **empty** `missing`

If `ready` is false, fix listed missing keys / RPC / Supabase before continuing. No soft skip.

---

## 5. Register Telegram webhook

```bash
bun run register:telegram
```

Requires: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `PUBLIC_APP_URL`.

Registers: `$PUBLIC_APP_URL/api/telegram/webhook` with your secret header.

Confirm `getWebhookInfo` URL matches.

---

## 6. Contest register (attribution + wallet)

Official path (no Google Form / not agentscooking.xyz):

1. Install Celo Builders skill: `npx skills add https://celobuilders.xyz`
2. Ask your coding agent to register you for **Celo Agents at Work**
3. Save the issued **attribution tag** + declared **agent wallet**
4. Set env:
   - `CELO_ATTRIBUTION_TAG=<your contest tag>`
   - `CELO_AGENT_WALLET=0x…` (same as bootstrap)
5. Persist into DB:

```bash
bun run register:agent
```

ERC-8004 card is already at `public/agent/registration.json` — publish/point `CELO_ERC8004_URL` if required.

Refs: https://celobuilders.xyz · Dune: https://dune.com/celo/agents-at-work-hackathon

---

## 7. First live till (mainnet)

In Telegram to your bot (structured — no NL required):

```text
send 5 cNGN to 0xIndependentCounterparty
```

Rules:

- Counterparty must be an **independent** MiniPay wallet (not your builder wallet)
- Bot replies with MiniPay link: `/pay?job=<uuid>`
- Open link **inside MiniPay** → Connect → Sign & settle
- Settlement waits for receipt and **fails closed** if attribution `verifyTx` does not include your tag

---

## 8. Verify the mined tx

```bash
bun run smoke:verify-tx -- --tx 0xYourMinedTxHash
```

Expect `ok: true` and your tag in `codes`. Celoscan link is printed.

---

## Fail-closed rules (do not bypass)

- No mocks, simulators, or demo settlements
- Missing env → hard error
- USA₮ x402 path blocked until facilitator `/supported` lists it
- cNGN/USAT **fee adapters** refused until FACT_CHECK verified (USDC/USDT fee abstraction OK)
- Residual risk only — not unhackable

## Smokes anytime

```bash
bun run test
bun run smoke:attribution
bun run smoke:x402
bun run smoke:verify-tx -- --tx 0x…
```
