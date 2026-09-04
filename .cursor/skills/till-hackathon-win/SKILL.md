---
name: till-hackathon-win
description: Registers and scores for Celo Agents at Work — attribution tags, ERC-8004, Dune metrics, day-0 registration. Use when working on hackathon submission, leaderboard, or contest compliance.
---

# TILL Hackathon Win

## When to use

Contest registration, attribution, scoring metrics, submission fields.

## Checklist

1. `npx skills add https://celobuilders.xyz` → register (GitHub, telegram, primaryTrack, erc8004Url, agentWallet).
2. Persist `CELO_ATTRIBUTION_TAG` + agent wallet in env + `agent_config`.
3. Tag **every** user-facing mainnet tx with `@celo/attribution-tags` (`toDataSuffix`).
4. Run `verifyTx` after first tagged tx; store in `attribution_events`.
5. Optimize verified + returning independent users — not self-funded volume.
6. Declare otherWallets / ownContracts honestly.

## References

- `TILL_BIBLE.md`
- `memory/research-raw/hackathons/celo-agents/LOCKED.md`
- `memory/FACT_CHECK.md`
