# TILL — Extreme Win Bible (Celo Agents at Work)

> **Doctrine:** Win Real World / Stablecoin Adoption as if ~2,000 tagged projects. Prize → finish MiniPay chat till company. Residencies parked.
> **Submit:** **Sep 14 2026, 09:00 GMT** · Counting from **Aug 28 00:00 GMT** · **mainnet only**
> **Slug:** `agents-at-work` · https://celobuilders.xyz · Dune: https://dune.com/celo/agents-at-work-hackathon
> **Sources:** [`NOTES.md`](memory/research-raw/hackathons/celo-agents/NOTES.md) · [`LOCKED.md`](memory/research-raw/hackathons/celo-agents/LOCKED.md) · [`DEEP_PASS.md`](memory/research-raw/hackathons/celo-agents/DEEP_PASS.md) · [`FACT_CHECK.md`](memory/FACT_CHECK.md)

---

## 0. Mission

**Primary track:** `real-world-adoption` · chase **Best Stablecoin Adoption** (cNGN and/or USA₮ + x402).
Not Value-Moved float. Not RemitRoute/Ajo/Monipay clones.

---

## 1. One sentence

**TILL** is a Telegram payment till: one chat job → user-authorized **cNGN / USA₮** send to an **independent** MiniPay/Celo wallet — every tx **ERC-8021 attribution-tagged**, agent on **ERC-8004**, gas via **fee abstraction**.

---

## 2. Verified contest laws

| Law | Fact | Source |
|---|---|---|
| Deadline | Sep 14 09:00 GMT all tracks | Live posts + TradingView (Aug 2026) |
| Network | **celo-mainnet** only for scoring | Hackathon rules / Dune |
| Independence | Not your wallets · not first-funded by you/dominant funder · prefer pre-Aug-28 Celo activity | FAQ/rules |
| Attribution | Register → `attributionTag` (`celo_`+…) · `@celo/attribution-tags` · **ERC-8021** | docs.celo.org/build-on-celo/attribution-tags |
| Agent identity | **ERC-8004** registries + 8004scan URL | docs.celo.org/build-on-celo/build-with-ai/8004 |
| x402 attribution | Facilitator can’t carry tag → attributed by **agentWalletAddress** | Contest metadata |
| Users counted | EIP-3009 authorisers + sponsored-relay signers (not only gas payers) | Track desc |
| Stablecoin bounty | cNGN / Ripio wFIAT / USA₮ or x402 settle; highest: USA₮+x402; cNGN=direct | Bounty API |
| x402 facilitator tokens | Official docs: **USDC + USDT** via EIP-3009; confirm USA₮ via `GET /supported` before claiming | docs.celo.org x402 |
| Register fields | public GitHub · telegram · primaryTrack · erc8004Url · agentWallet | Submission fields |

Leaderboard only counts tagged txs — **register day-0**.

**Security doctrine:** Harden + threat-model + residual risk. **Never claim unhackable.**

---

## 3. Wow angle

**TILL wow:** **counter job** (pay *this* person *now*) on MiniPay rails; **fee abstraction** + EIP-3009 so gasless users still count; **cNGN + USA₮/x402** for stablecoin subtrack.

---

## 4. Architecture

```
Telegram bot ← user intent ("send 5 cNGN to 0x…/contact")
  → resolve counterparty (independent check policy)
  → user signs EIP-3009 / MiniPay
  → transfer + toDataSuffix(attributionTag)  # ERC-8021
  → optional agent x402 quote/resolve microservice (USDC/USDT; USA₮ if /supported)
  → fee abstraction for gas in ERC-20
ERC-8004 agent identity · wallet hygiene
```

---

## 5. SDK / ecosystem exceed

- [ ] `@celo/attribution-tags` on **every** user-facing tx
- [ ] `verifyTx` after first tagged tx
- [ ] ERC-8004 + 8004scan URL at registration
- [ ] Fee abstraction
- [ ] MiniPay / EIP-3009 authoriser path
- [ ] `api.x402.celo.org` agent microservice leg
- [ ] AskBots rounds · cPay opt-in feedback
- [ ] Declare otherWallets / ownContracts honestly

---

## 6–13

See original doctrine: demo beat, Dune metrics (verified+returning), nine frameworks, differentiate from RemitRoute/Ajo/Monipay, no farming, pitch, post-win Mini App / WhatsApp.
