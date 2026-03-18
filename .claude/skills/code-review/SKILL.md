# Skill: Code Review

Triggers the official `code-review` plugin to perform an automated, multi-agent pull request review and post findings as a GitHub comment.

> **Model:** Always switch to `claude-opus-4-6` before running this skill. Use the `/model` command or Config tool to set the model, then restore the previous model when done.

## When to invoke

- When Master Isaac asks to review a PR
- Before merging any pull request with meaningful changes
- When checking a PR for bugs, CLAUDE.md compliance, or historical regressions

## Prerequisites

- Must be on a branch with an open GitHub pull request
- GitHub CLI (`gh`) must be authenticated (`gh auth login`)
- Repository must have a GitHub remote

## What it does

The plugin launches multiple parallel agents to independently review the PR from different angles:

| Agent | Focus |
|---|---|
| Agent 1 | CLAUDE.md compliance audit |
| Agent 2 | CLAUDE.md compliance (second pass for redundancy) |
| Agent 3 | Obvious bug detection in changed lines only |
| Agent 4 | Git blame / history context for regression risk |
| Agent 5 | Code comments compliance |

Each issue is then independently scored 0–100 for confidence. Only issues scoring **≥ 80** are posted as a GitHub comment on the PR. False positives, pre-existing issues, nitpicks, and linter-catchable issues are filtered out.

## How to invoke

**Step 1 — Switch to Opus:**
```
/model claude-opus-4-6
```

**Step 2 — Run the review:**
```
/code-review
```

Run this from within the target repository, on the PR branch.

**Step 3 — Switch back to Sonnet:**
```
/model claude-sonnet-4-6
```

## Output format

Posted as a GitHub PR comment:

```
### Code review

Found N issues:

1. <description> (CLAUDE.md says "...")
   https://github.com/owner/repo/blob/<full-sha>/path/file.ext#L10-L15

2. <description> (bug due to ...)
   https://github.com/owner/repo/blob/<full-sha>/path/file.ext#L42-L48
```

If no issues meet the ≥80 threshold, no comment is posted.

## Notes

- Skips closed, draft, trivial, and already-reviewed PRs automatically
- Does not run build, lint, or typecheck steps — CI handles those separately
- Always uses full SHA in code links (abbreviated SHAs will break GitHub Markdown rendering)
- Keep CLAUDE.md files specific and up to date — they directly improve review quality

## Recommended workflow

1. Push branch and open PR on GitHub
2. Run `/code-review`
3. Review the posted comment
4. Address any flagged issues
5. Merge when ready
