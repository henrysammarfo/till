---
name: till-memory-ops
description: Maintains TILL memory files CURRENT_STATE, SESSION_LOG, FACT_CHECK, and THREAT_MODEL. Use after material code, contest, or security changes.
---

# TILL Memory Ops

After material changes:

1. Update `memory/CURRENT_STATE.md` (what is true now).
2. Append dated entry to `memory/SESSION_LOG.md`.
3. Add/correct rows in `memory/FACT_CHECK.md`.
4. Adjust `memory/THREAT_MODEL.md` if attack surface changed.
5. Keep `TILL_BIBLE.md` aligned with verified laws (ERC-8021 vs ERC-8004).

Do not invent facts. If unverified, mark **UNVERIFIED**.
