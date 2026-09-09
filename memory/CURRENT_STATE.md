# TILL — Current State

**Updated:** 2026-09-09  
**Branch:** `cursor/till-full-stack-8d41`  
**Plan:** Option A full stack

## Live contest identity

- Agent wallet: `0x2879FBd50aBefb979270D2FFFD34d9ce1CecfF59`
- ERC-8004 agentId: `9825`
- Attribution tag: `celo_f30ff80110c6` (draft submission)
- Primary track: `real-world-adoption`

## Supabase

- Project: `goxtltzqwtluiqhpwupw` (URL + service role in `.env`)
- **Blocked:** apply `supabase/migrations/20260904140000_till_multitenant.sql` in SQL Editor
- Then: `bun run bootstrap:tenant` + `bun run register:agent`

## Security

Residual risk only — **not unhackable**. See `memory/THREAT_MODEL.md`.
