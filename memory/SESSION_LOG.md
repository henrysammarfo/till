# Session Log

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
