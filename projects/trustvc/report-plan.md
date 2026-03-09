# Code Quality Report Plan — trustvc
**Scanned:** 2026-03-07
**Repo:** https://github.com/TrustVC/trustvc
**Stack:** TypeScript 5.8 · Node.js ≥20 · Vitest · tsup · ESLint 9 (flat config) · Prettier · Hardhat (e2e) · semantic-release

---

## Summary

TrustVC is a mature, well-structured library with solid tooling in place — conventional commits, lint-staged, CI pipelines, and a coverage reporter. The biggest risks are around **type safety gaps** (strict mode partially disabled, widespread `any` usage), **missing coverage enforcement** (no thresholds set), and **inconsistent error handling** across the codebase. A few source files are significantly oversized and should be decomposed. These are actionable, addressable issues that don't require architectural overhauls.

---

## Findings

### Critical

- **`strictNullChecks` and `strictPropertyInitialization` are disabled** (`tsconfig.json:25-26`)
  - `strict: true` is set but two of its most important sub-flags are explicitly turned off
  - This silently allows null/undefined dereference bugs that TypeScript would otherwise catch
  - Affects the entire codebase — re-enabling will surface latent bugs

- **No coverage thresholds defined** (`vitest.config.ts:35-43`)
  - Coverage is collected and reported but no `thresholds` block is configured
  - Tests can drop to 0% coverage on any module without CI failing
  - E2e tests are excluded from standard test runs and require a manual hardhat node

### High

- **159 explicit `: any` usages across 26 source files** (production + test)
  - Notable production occurrences: `documentBuilder.ts:332`, `fetchEscrowTransfer.ts` (10 hits), `useEndorsementChain.ts` (8 hits), `transfer.ts` (8 hits)
  - ESLint correctly disables `@typescript-eslint/no-explicit-any` for test files (`eslint.config.js:72`) — but production `any` usages are suppressed via 65 inline `eslint-disable` comments across 28 files
  - These mask real type gaps in the domain model

- **Inconsistent error handling across token-registry and document-store functions**
  - 4 different patterns in use: `catch (e)`, `catch (error)`, `catch (error: any)`, `catch (e: unknown)`, `catch (error: unknown)`
  - No standardized error wrapping or typed error hierarchy
  - Most catch blocks in `transfer.ts`, `rejectTransfers.ts`, `returnToken.ts`, `document-store/*.ts` use bare `catch(e)` without narrowing the type before use

- **No `type-check` step in CI** (`.github/workflows/`)
  - `lint` and `tests` workflows run in CI, but `npm run type-check` (which runs `tsc --noEmit`) is not included
  - TypeScript errors would only surface in local dev or builds, not as a blocking CI check

### Medium

- **Oversized source files** — several files are well beyond a readable single-responsibility size:
  - `transfer.ts` — 529 lines, 4 separate catch blocks, handles v4/v5 registry logic in one file
  - `returnToken.ts` — 317 lines, 3 catch blocks
  - `rejectTransfers.ts` — 262 lines, 3 catch blocks
  - `documentBuilder.ts` — 354 lines (acceptable but borderline; mixes building, validation, and signing responsibilities)
  - Refactoring these into smaller, focused modules would improve testability

- **Dual ethers versions as dependencies** (`package.json:131`)
  - `ethers` v5 is the peer dependency; `ethersV6` is aliased to `npm:ethers@^6.14.4`
  - The `overrides` field forces all sub-dependencies to v5 — this can mask compatibility issues in downstream consumers
  - If v6 migration is in progress, it should be tracked and completed; if not, the v6 alias adds unnecessary bundle weight

- **`jsdoc/require-jsdoc` is disabled** (`eslint.config.js:32`)
  - The jsdoc plugin is enforced in recommended-error mode but public API documentation is not required
  - `documentBuilder.ts` has good JSDoc coverage as a positive example, but it's not consistently applied across the rest of the public API surface

### Low

- **Commented-out ESLint rule blocks in config** (`eslint.config.js:43-54`)
  - Three commented-out rule blocks left in the config — either apply them or remove them

- **Vitest config references a `dts` plugin** (`vitest.config.ts:15-19`) that is typically a build-time plugin
  - `vite-plugin-dts` is a build plugin (used by tsup/vite) — its presence in the test config is unusual and may be a leftover

- **`commitlint.config.js` installs `@commitlint/config-conventional@v17` via `--force`** (`.github/workflows/linters.yml:44`)
  - `--force` overrides dependency resolution and can cause inconsistent installs
  - Version `v17` is pinned in CI while `^19.x` is in `devDependencies` — version mismatch

---

## Recommended Actions

| Priority | Action | Impact |
|---|---|---|
| 1 | Re-enable `strictNullChecks` and fix surfaced errors | Eliminates a class of null-dereference bugs |
| 2 | Add coverage thresholds (`branches`, `functions`, `lines`) to `vitest.config.ts` | Makes CI enforce minimum coverage |
| 3 | Add `type-check` step to CI (`.github/workflows/tests.yml` or a new workflow) | Catches TS errors before merge |
| 4 | Standardize error handling pattern — adopt typed error narrowing (`instanceof Error`) across all catch blocks | Consistency + type safety |
| 5 | Reduce `: any` usage in production code — replace with typed error narrowing, `unknown`, or proper interfaces | Closes type safety gaps |
| 6 | Decompose `transfer.ts` into v4/v5 specific modules | Improves readability and testability |
| 7 | Require JSDoc on public API exports | Improves DX for consumers |
| 8 | Fix commitlint version mismatch in CI (`--force` + v17 vs v19 in devDeps) | Avoids silent version drift |
| 9 | Remove commented-out ESLint rule blocks | Clean config |

---

## Scan Notes

- E2e tests (`src/__tests__/e2e/`) require a running Hardhat node and are excluded from `npm run test` — not assessed for coverage
- Dependency audit (`npm audit`) was not run — recommended as a follow-up
- No `.env` files found in the cloned repo; `dotenv` is used in `vitest.config.ts` but the env file is gitignored as expected
- `@ts-ignore` and `@ts-nocheck` — none found; all suppression is done via inline `eslint-disable`, which is the correct approach
