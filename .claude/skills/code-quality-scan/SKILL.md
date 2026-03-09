# Skill: code-quality-scan

Scan a repository for code quality issues and produce a structured report plan.

## Trigger
Use this skill when the user asks to scan a repository for code quality, run a code quality check, or audit a project.

## Inputs
- `repo_url` — Git URL of the repository to scan (e.g. `https://github.com/org/repo.git`)
- `repo_name` — Short name for the repo (used as folder name). Infer from the URL if not provided.

## Steps

### 1. Set up workspace
- Create `workspace/<repo_name>/` in the Alfred project root if it doesn't exist
- If the folder already exists, run `git pull` inside it to update
- If it doesn't exist, run `git clone <repo_url> workspace/<repo_name>/`

### 2. Explore the repository structure
- List top-level folders and files
- Identify the tech stack (language, framework, build tools, test runner, linter config)
- Note key config files: `package.json`, `tsconfig.json`, `.eslintrc`, `jest.config`, `README.md`, CI configs, etc.

### 3. Scan for code quality issues
Assess across these dimensions:

| Dimension | What to look for |
|---|---|
| **Type safety** | TypeScript strictness, `any` usage, missing types |
| **Test coverage** | Presence of tests, coverage config, untested modules |
| **Linting & formatting** | ESLint/Prettier config, ignored rules, inconsistencies |
| **Dependencies** | Outdated packages, unused deps, security flags |
| **Code structure** | Large files, deeply nested logic, god objects, dead code |
| **Documentation** | Missing README sections, undocumented public APIs |
| **CI/CD** | Pipeline presence, missing checks (lint, test, type-check) |
| **Error handling** | Unhandled promises, broad catch blocks, silent failures |

### 4. Produce the report plan
- Create `projects/<repo_name>/` folder if it doesn't exist
- Write `projects/<repo_name>/report-plan.md` with the following structure:

```
# Code Quality Report Plan — <repo_name>
**Scanned:** <date>
**Repo:** <repo_url>
**Stack:** <detected stack>

## Summary
Short paragraph: overall health, biggest risks, recommended focus areas.

## Findings

### Critical
- Issues that block reliability or correctness

### High
- Significant quality gaps that should be addressed soon

### Medium
- Code smell, maintainability concerns

### Low
- Minor style or documentation gaps

## Recommended Actions
Prioritized list of concrete next steps with expected impact.

## Scan Notes
Any caveats, skipped areas, or assumptions made during the scan.
```

## Output
- `workspace/<repo_name>/` — cloned/updated repository (not committed to Alfred)
- `projects/<repo_name>/report-plan.md` — structured findings and recommendations
