# Skill: Research

Researches a given topic thoroughly using web search and web fetch, then produces a structured markdown report saved to the `research/` folder.

## When to invoke

- When Master Isaac asks to research a topic
- When background information is needed before making a decision
- When a structured summary of a subject is required

## What to do

1. **Search** — Use `WebSearch` to find 5–10 authoritative sources on the topic
2. **Fetch** — Use `WebFetch` on the most relevant URLs to extract detailed content
3. **Synthesise** — Combine findings into a coherent, structured report
4. **Save** — Write the report as a markdown file to `research/<slugified-topic>.md`
5. **Confirm** — Inform Master Isaac the report is ready and state the file path

## Report Format

```markdown
# Research Report: <Topic>

**Date:** <YYYY-MM-DD>
**Prepared by:** Alfred

---

## Overview
2–3 sentence summary of the topic.

## Key Findings
- Finding 1 (Source: [name](url))
- Finding 2 (Source: [name](url))
- ...

## Deep Dive
### <Subtopic 1>
...

### <Subtopic 2>
...

## Recommendations
Actionable takeaways or next steps for Master Isaac.

## Sources
| # | Title | URL |
|---|---|---|
| 1 | ... | ... |

## Confidence
Rate overall confidence in findings: High / Medium / Low, and note any gaps.
```

## Notes

- Always cite sources inline and in the Sources table
- Flag conflicting information if found
- Keep the Overview concise — Master Isaac reads the top first
- File naming: lowercase, hyphens for spaces (e.g. `playwright-e2e-testing.md`)
- If Tavily or Perplexity MCP is connected in future, prefer those over raw WebSearch for higher quality synthesis
