# Session Log

## 2026-09-15 — celobuilders submission PUBLISHED

- Set `socialLink` to https://x.com/henrysammarfo_2/status/2099721368849768591
- `POST /submissions/me/publish` → status **published** (`publishedAt` 2026-09-15T04:56:39.916Z)
- Tag `celo_f30ff80110c6` · demo https://till-topaz.vercel.app · repo public
- Residual risk only — not unhackable. Rotate secrets after hack.


## 2026-09-15 — celobuilders publish blocked on socialLink

- Filled draft: demo, celo-mainnet, bounties, agent notes, stablecoins, app domain.
- Publish API returns 400: `socialLink` (Twitter/X Submission Link) required.
- Awaiting operator X post URL tagging @CeloDevs + @Celo; then `POST /submissions/me/publish` with `confirm: true`.
- Residual risk only — not unhackable.


## 2026-09-14 — x402 live on Vercel production

- Fresh team-scoped `VERCEL_TOKEN` unblocked `teamtitanlink`.
- Upserted `X402_API_KEY` / `X402_FACILITATOR_URL` / `X402_PAY_TO`; redeployed production.
- Confirmed https://till-topaz.vercel.app/api/ready → `x402ApiKey: true`.
- Residual risk only — rotate x402 key + Vercel token after hack (pasted in chat).


## 2026-09-14 — x402 API key received; Vercel sync blocked on SAML

- Operator created `X402_API_KEY` on https://x402.celo.org (20 free mainnet settlements).
- Key written to local `.env` (gitignored); not echoed back in chat.
- Facilitator check: good key accepted (dummy settle → 400 `unsupported_scheme`); bad key → 401.
- `VERCEL_TOKEN` in env is `vcp_…` and returns 403 for scope `teamtitanlink` (SAML re-auth). MCP can read the project but has no env-upsert tool.
- Production still `x402ApiKey: false` until dashboard upsert or fresh team-scoped token + `scripts/sync-vercel-env.sh` + redeploy.
- Residual risk only — rotate key after hack (pasted in chat).


## 2026-09-11 — Telegram + cNGN pushed to Vercel; production redeployed

- Fresh Vercel token used to upsert Telegram bot/secret + official ASC cNGN address and redeploy.
- Webhook already pointed at production; `/api/ready` rechecked after deploy.
- Next: first independent MiniPay tagged settle.
- Residual risk only — do not claim unhackable.

## 2026-09-10 — Vercel env synced + production redeploy

- Upserted 23 runtime secrets to Vercel project `till` (production + preview) via API; skipped empty Telegram/cNGN/x402.
- Redeployed production → https://till-topaz.vercel.app READY.
- `/api/health` ok; `/api/ready` missing: `telegramBotToken`, `telegramWebhookSecret`, `cngnToken`.
- Celo RPC + Supabase live probes green; attribution tag + agent key present.
- Residual risk only — do not claim unhackable.

## 2026-09-09 — Vercel production + brand cleanup

- Merged `cursor/till-full-stack-8d41` → `main`.
- Removed Lovable auth/preview/telemetry; Nitro `vercel` preset; TILL favicon/OG/meta/manifest.
- Created Vercel project `till`; production https://till-topaz.vercel.app READY; SSO protection off.
- Local `.env` restored after merge wiped tracked secrets; `PUBLIC_APP_URL` set to production origin.
- Env sync still needs operator `VERCEL_TOKEN` (`scripts/sync-vercel-env.sh`).
- Residual risk only — do not claim unhackable.

## 2026-09-09 — Supabase migration applied; tenant + agent_config live

- Confirmed tables on `goxtltzqwtluiqhpwupw`.
- `bun run bootstrap:tenant` created tenant `till` (`9ac9bbbc-…`) with attribution `celo_f30ff80110c6` and agent wallet.
- `bun run register:agent` OK; set `erc8004_agent_id=9825`.
- Next: deploy URL, Telegram bot token/webhook secret, verified cNGN address, first tagged settle.
- Residual risk only — do not claim unhackable.

## 2026-09-09 — Supabase project switched; awaiting migration

- Operator provided new Supabase project `goxtltzqwtluiqhpwupw` (service role + publishable saved only in `.env`).
- REST probe OK; multitenant tables not present yet (`PGRST205`).
- Cannot apply SQL with service role alone — need SQL Editor run of `20260904140000_till_multitenant.sql`.
- Previous project id `ojyxkoxuamkocuwyvnjj` superseded in env + `supabase/config.toml`.
- Secrets were pasted in chat — rotate service_role after go-live when practical.
- Residual risk only — do not claim unhackable.

## 2026-09-09 — Contest draft registered (attribution tag locked)

- Google claim completed for jasonneil4040@gmail.com; connection credential stored only in `.env` (not committed).
- Draft submission saved on celobuilders.xyz: project **TILL**, track `real-world-adoption`, wallet `0x2879FBd50aBefb979270D2FFFD34d9ce1CecfF59`, ERC-8004 Celoscan NFT for agent **9825**.
- Attribution tag issued and locked: `celo_f30ff80110c6` → `CELO_ATTRIBUTION_TAG` in `.env`.
- `bun run register:agent` still blocked on missing `SUPABASE_SERVICE_ROLE_KEY`.
- Optional perk noted: Chainstack Growth coupon `AGENTSATWORK` (ends with hackathon); Forno remains fine.
- Residual risk only — do not claim unhackable.

## 2026-09-09 — Agent wallet funded + ERC-8004 on file

- Confirmed dedicated agent wallet `0x2879FBd50aBefb979270D2FFFD34d9ce1CecfF59` funded on Celo mainnet (~1.96 CELO; nonce 1 after Identity mint).
- Private key in `.env` derives to that address (match verified; key never pasted in chat).
- ERC-8004 agentId `9825` already minted; `public/agent/registration.json` updated with registry + Celoscan/8004scan URLs.
- Still blocked on Google claim (`CELO-…`) for celobuilders.xyz → attribution tag → `register:agent`.
- Residual risk only — do not claim unhackable.

## 2026-09-04 — Full-stack Option A kickoff

- Locked plan Option A: marketing + multi-tenant Studio + live Telegram till + cNGN EIP-3009 + attribution + ERC-8004 + fee abstraction + x402.
- Confirmed: never claim unhackable; residual risk only.
- Live research: contest deadline Sep 14 2026 09:00 GMT confirmed; attribution = ERC-8021; ERC-8004 = agent identity; x402 official facilitator docs list USDC/USDT (USA₮ gated by `/supported`).
- TinyFish prior key authenticated but 0 credits — awaiting new key.
- AgentRouter: OpenAI-compatible at `https://agentrouter.org/v1`; WAF may require client fingerprint headers.
- Started branch `cursor/till-full-stack-8d41`.
- Phase 0: secrets hygiene, memory pack, Cursor rules/skills, corrected TILL_BIBLE.md.

## 2026-09-05 — Live MiniPay authorize + production ops

- Shipped `/pay` MiniPay EIP-3009 authorize → `settleTillJob` (wait receipt + attribution `verifyTx`, fail closed).
- Telegram webhook fail-closed on missing secret; deep-links `/pay?job=` via required `PUBLIC_APP_URL`.
- `/api/ready` probes live Celo RPC + Supabase (presence + connectivity).
- Operator scripts: `bootstrap:tenant`, `register:telegram`, `smoke:verify-tx`.
- Studio overview no longer swallows ledger errors into fake zeros.
- `bun run test` + `smoke:attribution` + `bun run build` green.
- Still blocked on user keys for first live tagged mainnet settle.
- Residual risk only — do not claim unhackable.

## 2026-09-05 — Live MiniPay authorize + production ops

- Shipped `/pay` MiniPay EIP-3009 authorize → settleTillJob (wait receipt + attribution verifyTx, fail closed).
- Telegram webhook fail-closed on missing secret; deep-links `/pay?job=` via required PUBLIC_APP_URL.
- `/api/ready` probes live Celo RPC + Supabase.
- Operator scripts: bootstrap:tenant, register:telegram, smoke:verify-tx.
- Studio overview no longer swallows ledger errors into fake zeros.
- bun run test + smoke:attribution + bun run build green.
- Still blocked on user keys for first live tagged mainnet settle.
- Residual risk only — do not claim unhackable.

## 2026-09-11 — sitewide links & portal bugs
- Fixed sparse portal/book layout (missing `.wrap`)
- Wired contact form to Supabase `bookings`
- Corrected agent/contact/product/settings identity strings to live tag/wallet/repo
- Added privacy, terms, how-it-works redirect, sitemap.xml
- Regenerated favicons/OG; IBM Plex Sans; Navbar ChevronDown; footer links complete

## 2026-09-11 18:31 UTC — public repo + first live settle job + Tavily
- Confirmed GitHub repo public
- Synced `TAVILY_API_KEY` to Vercel production and redeployed (`tavilyKey: true`)
- Requested `X402_API_KEY` from operator (not in env yet)
- Created till job `44708a3c-8ce6-4377-be63-3cd7e1bbc54f` for 1 cNGN → `0x13b239a267b061c60c9dcaF0071C305b47E4AcBa`; pay URL ready for MiniPay signature
- Secret rotation postponed until after hackathon

## 2026-09-11 21:03 UTC — first tagged mainnet settle verified
- Sent 0.05 CELO from agent wallet with attribution suffix `celo_f30ff80110c6`
- Tx 0x7d0221dfe80738d5ea59067e0904e599cbbedd1d9573fd2cc372aaabb7ad9b7b — verifyTx OK
- MiniPay user-sign not required for this attribution proof; used CELO balance as requested
- x402 key still outstanding; Tavily already live
