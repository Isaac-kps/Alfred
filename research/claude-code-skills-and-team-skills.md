# Research Report: Claude Code Skills & Team Skills

**Date:** 2026-03-11
**Prepared by:** Alfred

---

## Overview

Claude Code Skills are specialised instruction sets that extend Claude's capabilities for domain-specific tasks, organisations, or workflows. Skills can range from simple Markdown instructions to multi-file packages with executable scripts, templates, and reference documentation. They follow the Agent Skills open standard and enable both individual developers and teams to create reusable workflows that Claude can apply automatically or invoke directly.

## Key Findings

- Claude ships with **5 bundled skills** by default: `/simplify`, `/batch`, `/debug`, `/loop`, and `/claude-api` ([Claude Code Docs](https://code.claude.com/docs/en/skills))
- **No official Anthropic skill marketplace exists**, but Anthropic maintains a public repository ([anthropics/skills](https://github.com/anthropics/skills)) with 90k+ stars, and community registries like SkillsMP aggregate 400,000+ community-contributed skills
- **Direct peer-to-peer skill sharing is not natively supported** — Team/Enterprise plan owners can provision skills org-wide; otherwise distribution is via version control ([Claude Help Center](https://support.claude.com/en/articles/12512180-use-skills-in-claude))
- Best practice: **limit active skills to 20–30 high-quality, task-specific ones** to avoid performance degradation from context overload ([Morph](https://www.morphllm.com/claude-code-best-practices))
- Skills follow **progressive disclosure** — only name and description load at startup (~100 tokens); full content loads on-demand when Claude uses the skill ([Anthropic Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices))

## Deep Dive

### What Are Claude Code Skills?

Claude Code Skills are folders containing a required `SKILL.md` file with YAML frontmatter and Markdown instructions. Skills teach Claude how to complete specific tasks repeatably and consistently.

**Capabilities:**
- **Progressive disclosure**: Only metadata loads at startup; full content loads on-demand
- **Supporting files**: Reference docs, examples, templates, and scripts in the skill directory
- **Invocation control**: Frontmatter fields control whether Claude auto-invokes, whether only users can invoke, or tool access restrictions
- **Subagent execution**: Skills can run in isolated forked contexts with their own tools and model
- **Dynamic context injection**: Shell command output can be injected into skill content before Claude sees it

**How they work**: Claude reads skill descriptions as part of its system prompt at startup. When your request matches a skill's description, Claude loads and uses it. If you invoke directly with `/skill-name`, Claude loads it immediately.

---

### How to Create a Custom Skill

**Core structure** — every skill requires a `SKILL.md` with:
1. **YAML frontmatter** (`---` markers) with:
   - `name`: lowercase letters, numbers, hyphens only (max 64 characters)
   - `description`: what it does and when to use it (max 1024 characters, third person)
2. **Markdown body**: step-by-step instructions Claude follows

**Step-by-step** ([Claude Help Center](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills)):
1. Create folder: `~/.claude/skills/your-skill-name/` (personal) or `.claude/skills/` (project)
2. Write `SKILL.md` with frontmatter and instructions
3. Add supporting files optionally: templates, examples, scripts
4. Invoke with `/skill-name` or let Claude auto-detect

**Example minimal skill:**
```yaml
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works.
---

When explaining code:
1. Start with an analogy
2. Draw a diagram
3. Walk through the code
4. Highlight a gotcha
```

**Advanced frontmatter options:**
- `disable-model-invocation: true` — Only you can invoke it (e.g. `/deploy`)
- `user-invocable: false` — Only Claude auto-invokes it (background knowledge)
- `allowed-tools: Read, Grep` — Restrict tool access
- `context: fork` — Run in isolated subagent
- `$ARGUMENTS`, `$0`, `$1` — Parameterisation
- `${CLAUDE_SESSION_ID}`, `${CLAUDE_SKILL_DIR}` — Dynamic substitutions

**Alternative**: Describe what you want to Claude with the `skill-creator` skill enabled and Claude will format it into a proper `SKILL.md` ([Help Center](https://support.claude.com/en/articles/12599426-how-to-create-a-skill-with-claude-through-conversation)).

---

### Sharing Skills Across a Team

**Current limitations:**
- No native peer-to-peer skill sharing — each person must add skills to their own account
- No built-in sync mechanism between teammates

**Team/Enterprise options:**
- **Managed skills**: Organisation owners (Team/Enterprise plans) can provision skills for all users
- **Provisioned skills** appear in individual skill lists with a team indicator; users can toggle on/off

**Community distribution approaches:**
| Method | How |
|---|---|
| **Version control** | Commit `.claude/skills/` to Git repo; teammates clone and use locally |
| **Shared skill repo** | Maintain a private/public GitHub repo of skills |
| **Plugins** | Package skills with hooks, subagents, and MCP servers for bundled distribution |
| **skillshare tool** | CLI tool to sync skills across all AI CLIs with one command ([github.com/runkids/skillshare](https://github.com/runkids/skillshare)) |

---

### Official Skill Marketplace / Registry

**No official Anthropic marketplace** currently. Available options:

| Source | Details |
|---|---|
| **anthropics/skills** (GitHub) | 90k+ stars, 9.6k+ forks. Verified, production-ready skills across creative, dev, enterprise, and document categories. Install via `/plugin install` |
| **anthropics/claude-plugins-official** | Anthropic-managed directory; accepts vetted third-party submissions |
| **SkillsMP** (skillsmp.com) | 400,000+ community skills compatible with Claude Code |
| **awesome-claude-skills** (GitHub) | Curated community list |
| **alirezarezvani/claude-skills** | 180+ production-ready skills library |

---

### Built-in / Pre-packaged Skills

Claude Code ships with these bundled skills:

| Skill | What it does |
|---|---|
| `/simplify` | Reviews recently changed files for code reuse, quality, and efficiency; spawns 3 parallel review agents |
| `/batch <instruction>` | Orchestrates large-scale codebase changes in parallel; decomposes into 5–30 independent units, spawns agents in isolated git worktrees |
| `/debug [description]` | Troubleshoots the current Claude Code session by reading debug logs |
| `/loop [interval] <prompt>` | Runs a prompt repeatedly on a schedule (polling, babysitting PRs) |
| `/claude-api` | Loads Claude API reference material for your project language |

---

### Best Practices for Team Skills

**Skill design** ([Anthropic Docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)):

1. **Conciseness**: Keep `SKILL.md` body under 500 lines; Claude is smart, add only context it doesn't have
2. **Progressive disclosure**: Move reference docs, examples, and scripts to separate files loaded on-demand
3. **Clear descriptions**: Be specific about what the skill does and when; include key trigger terms
4. **Naming conventions**: Use gerund form — `processing-pdfs`, `analysing-spreadsheets`, `managing-databases`
5. **Degree of freedom**: Narrow guardrails for fragile operations (database migrations); high freedom for variable tasks (code reviews)
6. **Structured output**: Provide templates for expected output; use checklists for complex workflows
7. **Feedback loops**: Build validation → error checking → fix cycles into skill workflows
8. **Flat references**: Keep file references one level deep; avoid file → file → file chains
9. **Test across models**: Test with Haiku, Sonnet, and Opus; what works for Opus may need more detail for Haiku
10. **Evaluation-driven development**: Build test scenarios first, establish baseline, write minimal instructions, iterate

**Team governance:**
- Limit active skills to 20–30 to avoid performance degradation
- Version control `.claude/skills/` in Git for team contribution and review
- Separate skills from CLAUDE.md (CLAUDE.md = broad session context; skills = on-demand workflows)

---

### Limitations & Gotchas

| Issue | Detail |
|---|---|
| Vague descriptions | Claude may not auto-invoke if description doesn't match context; test with `/skill-name` directly |
| Context budget | Skill descriptions have a 2% context window budget (~16k tokens); run `/context` to check if overloaded |
| No native peer sharing | Must use version control or enterprise provisioning for team distribution |
| Provisioned skills | Enterprise provisioned skills cannot be easily forked/customised per user |
| Consistency without skills | Without a skill, asking Claude for consistent workflows produces variable results |
| MCP overhead | GitHub MCP eats ~46k tokens across 91 tools; skills avoid this via progressive disclosure |
| File paths | Always use forward slashes (Unix-style), even on Windows |
| Deep references | Deeply nested file references cause Claude to use `head -100` previews instead of full reads |

---

## Recommendations

**For Master Isaac and DEX:**

1. **Build `code-quality-scan` as the first team skill** — Package Alfred's analysis workflow as a proper skill with a separate reference file for DEX code standards. This is the POC deliverable.

2. **Keep the skill count lean** — Start with 5–10 core skills: `code-quality-scan`, `code-quality-report`, `research`, `morning-call`, and one per major workflow. Add more only when justified.

3. **Use progressive disclosure** — Keep `SKILL.md` focused; move DEX coding standards, examples, and templates to separate files loaded on-demand. This keeps Alfred's context lean.

4. **Evaluation-driven development** — Run Alfred on TrustVC without a skill first. Document gaps and inconsistencies. Write the minimal skill to pass those test scenarios. Do not over-engineer upfront.

5. **Version control for team sharing** — Commit `.claude/skills/` to a shared internal repo. When team members are looped in, they clone it and have the same skills immediately. No enterprise plan needed for this approach.

6. **One skill per workflow** — Do not combine code quality + testing + documentation into one skill. Separate skills = independent iteration and cleaner invocation.

7. **Consider the Anthropic skills repo** — Browse [github.com/anthropics/skills](https://github.com/anthropics/skills) before building from scratch; there may be existing skills adaptable to DEX workflows.

8. **Monitor context** — As Alfred grows with more skills, run `/context` periodically to check the skill description budget. Prune and consolidate if approaching limits.

---

## Sources

| # | Title | URL |
|---|---|---|
| 1 | Extend Claude with skills — Claude Code Docs | https://code.claude.com/docs/en/skills |
| 2 | How to create custom Skills — Claude Help Center | https://support.claude.com/en/articles/12512198-how-to-create-custom-skills |
| 3 | Use Skills in Claude — Claude Help Center | https://support.claude.com/en/articles/12512180-use-skills-in-claude |
| 4 | How to create a skill with Claude through conversation | https://support.claude.com/en/articles/12599426-how-to-create-a-skill-with-claude-through-conversation |
| 5 | Skill authoring best practices — Claude API Docs | https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices |
| 6 | Best Practices for Claude Code — Claude Code Docs | https://code.claude.com/docs/en/best-practices |
| 7 | GitHub — anthropics/skills | https://github.com/anthropics/skills |
| 8 | GitHub — anthropics/claude-plugins-official | https://github.com/anthropics/claude-plugins-official |
| 9 | GitHub — travisvn/awesome-claude-skills | https://github.com/travisvn/awesome-claude-skills |
| 10 | GitHub — runkids/skillshare | https://github.com/runkids/skillshare |
| 11 | Agent Skills Marketplace — SkillsMP | https://skillsmp.com/ |
| 12 | GitHub — alirezarezvani/claude-skills | https://github.com/alirezarezvani/claude-skills |
| 13 | Claude Code Best Practices: The 2026 Guide — Morph | https://www.morphllm.com/claude-code-best-practices |

## Confidence

**High** — Sources include official Anthropic documentation (Claude Code docs, Claude API docs, Help Center), Anthropic's own public skills repository (90k+ stars), multiple independent community registries, and recent 2026 best practice guides. Information is current, authoritative, and cross-verified.
