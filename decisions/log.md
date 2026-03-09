# Decision Log

Append-only. When a meaningful decision is made, log it here.

Format: [YYYY-MM-DD] DECISION: ... | REASONING: ... | CONTEXT: ...

---

[2026-03-09] DECISION: Re-enable strictNullChecks and strictPropertyInitialization in TrustVC | REASONING: Both flags were disabled despite strict: true being set, silently allowing null/undefined bugs. Re-enabling surfaces latent issues and makes the type system a reliable safety net. | CONTEXT: Code quality POC initiative — item 1 from the TrustVC report. 216 errors surfaced and fixed across 37 files. Node 22 required (project needs ≥20).

[2026-03-09] DECISION: Created strict-null-fix skill in Alfred | REASONING: The workflow for re-enabling strict null checks is repeatable — same pattern applies to TradeTrust and OpenCerts. Templatized as a skill so it can be applied without re-explaining the steps. | CONTEXT: .claude/skills/strict-null-fix/SKILL.md

---
