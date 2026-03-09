# Skill: strict-null-fix

## Purpose
Re-enable `strictNullChecks` and `strictPropertyInitialization` in a TypeScript project, surface all latent null/undefined bugs, and fix them systematically.

## When to Use
- A project has `strict: true` but explicitly disables `strictNullChecks` and/or `strictPropertyInitialization`
- Starting a code quality improvement initiative on a TypeScript repo
- Part of the code-quality-scan remediation workflow

## Prerequisites
- Node ≥ 20 (use `nvm use 22` if needed)
- Dependencies installed (`npm install`)

## Steps

### 1. Setup
```bash
# Check node version
node --version

# Switch to Node 22 if needed
source ~/.nvm/nvm.sh && nvm use 22

# Install dependencies
npm install
```

### 2. Create a branch
```bash
git checkout -b fix/strict-null-checks
```

### 3. Enable strict flags in tsconfig.json
Change:
```json
"strictNullChecks": false,
"strictPropertyInitialization": false,
```
To:
```json
"strictNullChecks": true,
"strictPropertyInitialization": true,
```

### 4. Surface all errors
```bash
npx tsc --noEmit 2>&1
```

Get a breakdown by error code and file:
```bash
# By error code
npx tsc --noEmit 2>&1 | grep "error TS" | sed 's/.*error TS/TS/' | cut -d: -f1 | sort | uniq -c | sort -rn

# By file
npx tsc --noEmit 2>&1 | grep "error TS" | sed 's|src/||' | cut -d'(' -f1 | sort | uniq -c | sort -rn
```

### 5. Fix errors — by pattern

| Error Code | Meaning | Fix |
|---|---|---|
| TS2345 / TS2322 | `T \| undefined` not assignable to `T` | Add null guard or `!` if clearly safe |
| TS18048 / TS2532 | Possibly `undefined` | Add `if (x == null)` guard or `!` in test files |
| TS2454 | Variable used before assigned | Initialize with a default value |
| TS2722 | Cannot invoke possibly undefined | Add null check before invocation |
| TS2366 | Function lacks return | Add return for all branches |
| TS2564 | Property not initialized | Add `!` or constructor init |

**Fix priority order:**
1. Production source files (`src/` excluding `__tests__/`) — fix with proper null guards
2. Test files (`src/__tests__/`) — `!` non-null assertions are acceptable where value is clearly set (e.g., in `beforeEach`)

**Preferred patterns:**
```typescript
// Null guard (preferred in production)
if (signer == null) throw new Error("signer is required");

// Early return
if (!value) return;

// Non-null assertion (test files / clearly safe contexts)
const name = result.data!.name;

// Error narrowing in catch blocks
catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
}
```

### 6. Verify
```bash
npx tsc --noEmit
# Should exit 0 with no output
```

### 7. Commit
```bash
git add -A
git commit -m "fix: re-enable strictNullChecks and strictPropertyInitialization

Re-enables two TypeScript strict sub-flags and fixes all surfaced
null/undefined errors across production and test files."
```

## Expected Outcome
- `tsconfig.json` has both flags set to `true`
- `npx tsc --noEmit` exits 0
- All null/undefined handling is explicit and intentional
- Commit on a dedicated branch, ready for PR

## Notes from TrustVC Run (2026-03-09)
- 216 errors surfaced across 37 files after enabling both flags
- Most common: TS2345 (54), TS2454 (33), TS2322 (33), TS18048 (28)
- Heaviest files: `transfer.ts` (36 errors), `returnToken.ts` (25), `rejectTransfers.ts` (12)
- All fixed — 0 errors after remediation
- Pre-commit hook ran eslint + prettier automatically on commit
