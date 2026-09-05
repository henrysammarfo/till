# TILL Operator Runbook — live mainnet launch

**Security:** Residual risk only. Never claim unhackable. See `memory/THREAT_MODEL.md`.

## Prerequisites (you supply keys — no placeholders)

| Key | Purpose |
|-----|---------|
| `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Multitenant ledger |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_WEBHOOK_SECRET` | Live till webhook |
| `PUBLIC_APP_URL` | HTTPS origin for `/pay` + webhook |
| `CELO_AGENT_PRIVATE_KEY` | Relayer for EIP-3009 submit |
| `CELO_ATTRIBUTION_TAG` | Contest ERC-8021 tag (after agentscooking.xyz register) |
| `CELO_AGENT_WALLET` | Declared agent wallet |
| `CNGN_TOKEN_ADDRESS` | Verified cNGN contract on Celo mainnet |
| `X402_API_KEY` | Facilitator settle (USDC/USDT; USA₮ gated) |
| `AGENTROUTER_API_KEY` | NL intents only (structured cmds work without) |

## Bootstrap sequence

1. Apply `supabase/migrations/20260904140000_till_multitenant.sql` via Supabase SQL editor or CLI.
2. `bun run bootstrap:tenant -- --slug till --name TILL --telegram-username YourBot --agent-wallet 0x…`
3. Deploy app with env set; confirm `GET /api/health` → 200.
4. `GET /api/ready` → `ready: true` (live Celo RPC + Supabase probes).
5. `bun run register:telegram`
6. Register agent + tag at https://agentscooking.xyz → set `CELO_ATTRIBUTION_TAG` / `CELO_AGENT_WALLET` → `bun run register:agent`
7. Telegram: `send 5 cNGN to 0xIndependentCounterparty`
8. Open MiniPay link `/pay?job=<uuid>` → connect → Sign & settle
9. `bun run smoke:verify-tx -- --tx 0x…` against the mined hash

## Fail-closed rules

- No mocks, simulators, or demo settlements
- Missing env → hard error (not soft defaults)
- Attribution `verifyTx` must include contest tag or job fails
- USA₮ x402 path blocked until facilitator `/supported` lists it
- cNGN/USAT fee adapters refused until FACT_CHECK verified

## Smokes

```bash
bun run test
bun run smoke:attribution
bun run smoke:x402
bun run smoke:verify-tx -- --tx 0x…
```
