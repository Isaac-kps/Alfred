# Research Report: Claude Code Skills — Enterprise Level & Team Sharing

**Date:** 2026-03-16
**Prepared by:** Alfred

---

## Overview

Claude Code skills at the enterprise level enable organisations to codify and distribute AI workflows across teams through organisation-wide provisioning, plugin marketplaces, and version-controlled Git-based sharing. Enterprise and Team plan owners can provision skills and plugins for all users, with plugins serving as the primary distribution mechanism for packaged expertise — combining skills, agents, hooks, and MCP servers into cohesive, shareable units. Skills eliminate knowledge silos by making fragile ad-hoc workflows repeatable and organisational.

---

## Key Findings

- **Organisation-wide provisioning** is available on Team and Enterprise plans — Owners upload skills via Organisation settings > Skills, and they automatically appear for all users with a team indicator ([Anthropic Support](https://support.claude.com/en/articles/11845131-use-claude-code-with-your-team-or-enterprise-plan))
- **Private plugin marketplaces** (released February 2026) allow admins to curate, customise, and distribute plugins across teams with versioned releases ([Anthropic Announcement](https://www.anthropic.com/news/claude-code-on-team-and-enterprise))
- **Dual-legibility advantage**: SKILL.md files are simultaneously human-readable documentation and machine-executable specifications — the documentation and the implementation cannot drift apart ([Zack Proser](https://zackproser.com/blog/claude-skills-internal-training))
- **Git-based sharing** uses GitHub repositories as the distribution mechanism — teammates clone the repo, copy skills to `~/.claude/skills/`, and improvements flow through PR reviews ([Claude Code Docs](https://code.claude.com/docs/en/skills))
- **No native peer-to-peer sharing** — individuals cannot share skills directly with specific colleagues; requires either org-level provisioning (admin) or manual Git distribution ([Support Docs](https://support.claude.com/en/articles/12512180-use-skills-in-claude))
- **Plugin namespacing prevents conflicts** — plugins use namespaced skills (e.g., `/plugin-name:skill-name`) so multiple plugins coexist without name collisions ([Claude Code Docs: Plugins](https://code.claude.com/docs/en/plugins))

---

## Deep Dive

### Enterprise Skill Provisioning (Team & Enterprise Plans)

**Org-Wide Deployment Workflow:**
1. Owner navigates to **Organisation settings > Capabilities** — enable Code execution
2. Owner navigates to **Organisation settings > Skills**
3. Owner uploads skills — they automatically appear for all org users with a team indicator
4. Users can toggle team-provided skills on/off based on personal preference

**Admin Controls:**
- Granular spend caps and per-user provisioning
- OpenTelemetry support for tracking tool activity, usage patterns, and code acceptance rates
- Real-time compliance API for programmatic access to usage data (Enterprise only)
- Private plugin marketplace for curating and distributing approved plugins

---

### Creating Shareable Skills

**Skill Structure:**

Every skill requires a `SKILL.md` with:
- **YAML frontmatter** (`---` markers): `name`, `description`, and optional flags
- **Markdown body**: Step-by-step instructions Claude follows

Optional supporting files:
- `template.md` — Template for Claude to populate
- `examples/` — Sample outputs showing expected format
- `scripts/` — Utility scripts Claude can execute
- Reference docs — API specs, coding standards, style guides

**Skill Locations & Scope:**

| Location | Path | Available to |
|---|---|---|
| **Enterprise** | Organisation settings > Skills | All users in organisation |
| **Personal** | `~/.claude/skills/skill-name/` | All your projects |
| **Project** | `.claude/skills/skill-name/` | This repository only |
| **Plugin** | `plugin-name/skills/skill-name/` | Where plugin is installed |

Priority when names collide: Enterprise > Personal > Project. Plugin skills are namespaced and cannot conflict.

**Key Frontmatter Options:**

| Option | Effect |
|---|---|
| `disable-model-invocation: true` | Only the user can invoke — prevents unintended automation |
| `user-invocable: false` | Only Claude auto-invokes — for background knowledge |
| `allowed-tools: Read, Grep` | Restrict tools Claude can use (e.g., read-only mode) |
| `context: fork` | Run in isolated subagent with custom system prompt |
| `model` | Override model for this skill |

---

### Git-Based Team Sharing

The most practical approach for teams without an Enterprise plan today.

**Pattern:**
1. Commit skills to the shared repository at `.claude/skills/skill-name/SKILL.md`
2. Teammates clone the repo — skills are immediately available at project scope
3. For personal scope, copy to `~/.claude/skills/skill-name/`
4. Improvements go through PR review before merging

**Benefits:**
- Full git history and audit trail for every skill iteration
- Code review enforces quality and team agreement on patterns
- CI/CD can validate skill syntax and test prompt logic
- Onboarding is frictionless — clone once, get all skills

**Shared CLAUDE.md:**
- Check in `CLAUDE.md` to version control so all team members share the same project context
- Updates are merged like any other code change
- Claude automatically loads context from nested directories in monorepos

---

### Plugins as the Distribution Mechanism

When a skill is mature enough to be shared broadly across multiple projects or teams, package it as a **plugin**.

**Skills vs. Plugins:**

| | Standalone Skills | Plugins |
|---|---|---|
| **Scope** | Single project | Multiple projects, teams, or public |
| **Skill names** | `/hello` | `/plugin-name:hello` (namespaced) |
| **Distribution** | Manual Git copy | Marketplace install |
| **Versioning** | Ad-hoc | Semantic versioning in manifest |
| **Best for** | Personal workflows, experiments | Team standardisation, broad reuse |

**Plugin Manifest (`.claude-plugin/plugin.json`):**
```json
{
  "name": "dex-code-quality",
  "description": "DEX code quality scanning and reporting workflows",
  "version": "1.0.0",
  "author": {
    "name": "DEX Engineering"
  }
}
```

**Plugin Components (can bundle all of these):**

| Component | Location | Purpose |
|---|---|---|
| Skills | `skills/` | Prompt-based workflows |
| Agents | `agents/` | Custom subagents |
| Hooks | `hooks.json` | Event handlers (e.g., post-commit) |
| MCP servers | `.mcp.json` | External tool integrations |
| Settings | `settings.json` | Default configuration |

**Private Plugin Marketplaces (Feb 2026 — Team/Enterprise):**
- Admins create private marketplaces (in-org repo or GitHub)
- Auto-install plugins to user accounts via managed settings
- Control versioning and roll out updates globally
- Claude guides admins through setup interactively

---

### Notable Articles & Resources

| Source | Type | Key Insight |
|---|---|---|
| [Extend Claude with Skills](https://code.claude.com/docs/en/skills) | Official docs | Complete skill authoring reference |
| [Create Plugins](https://code.claude.com/docs/en/plugins) | Official docs | Plugin creation, structure, and distribution |
| [Claude Code on Team and Enterprise](https://www.anthropic.com/news/claude-code-on-team-and-enterprise) | Anthropic announcement (Feb 2026) | Private marketplaces, admin controls, compliance API |
| [Cowork & Plugins Across the Enterprise](https://claude.com/blog/cowork-plugins-across-enterprise) | Anthropic blog | Plugin marketplaces, org-wide distribution, integration examples |
| [Skills as Self-Documenting Runbooks](https://zackproser.com/blog/claude-skills-internal-training) | Community (Zack Proser) | Skills as team runbooks, dual-legibility advantage, adoption patterns |
| [Use Claude Code with Team/Enterprise Plans](https://support.claude.com/en/articles/11845131-use-claude-code-with-your-team-or-enterprise-plan) | Anthropic support | Setup, provisioning, usage limits |
| [Best Practices for Claude Code](https://code.claude.com/docs/en/best-practices) | Official docs | Recommended patterns and pitfalls |

---

### Real-World Examples

**Animated-Image Workflow (Zack Proser)**
Built a skill combining two AI models for motion generation. Teammates adopted it by:
1. Cloning the shared Git repository
2. Copying the skill to local `~/.claude/skills/`
3. Using `/animated-image` immediately for demo videos

The skill became a repeatable capability rather than one person's tribal knowledge.

**Supply Chain Platform (Altana)**
Deployed Claude Code across multiple projects, reporting "2–10x accelerated development velocity." Used plugin-based skill distribution to enforce consistent architecture patterns across projects.

**Security Company**
Leveraged enterprise seat bundles for engineering teams with standardised plugins for security-focused code review and compliance checking. Plugin marketplace enabled automated roll-out without manual distribution.

---

## Recommendations

**For Master Isaac — Sharing Skills with DEX Coworkers**

### Step 1 — Today: Git-Based Sharing (No Plan Upgrade Needed)

1. Commit Alfred's skills to the TrustVC repository at `.claude/skills/`
2. Create a `README` in that folder explaining how coworkers install and use the skills
3. Share the repository link with coworkers — they clone once and have all skills

```
# How to install DEX Claude skills
cp -r .claude/skills/skill-name ~/.claude/skills/skill-name
```

### Step 2 — Short Term: Package as a Plugin

1. Create a `dex-code-quality` plugin repo with `.claude-plugin/plugin.json`
2. Bundle: `code-quality-scan`, `code-quality-report`, `research`, `morning-call`
3. Coworkers install with: `/plugin install dex-code-quality`
4. Namespaced as `/dex-code-quality:scan` — no conflicts with their personal skills

### Step 3 — Medium Term: Private Marketplace (Team/Enterprise Plan)

1. Upgrade to Team or Enterprise plan if not already
2. Set up a private plugin marketplace in DEX's internal GitHub
3. Push DEX plugin to the marketplace
4. As Organisation Owner, auto-provision to all users via managed settings
5. Roll out updates globally without asking anyone to manually reinstall

### Skills Governance
- All new/modified skills go through PR review before merging to main
- Log significant skill decisions in `decisions/log.md`
- Keep skills lean — 20–30 max across the org before pruning

---

## Sources

| # | Title | URL |
|---|---|---|
| 1 | Extend Claude with Skills — Claude Code Docs | https://code.claude.com/docs/en/skills |
| 2 | Create Plugins — Claude Code Docs | https://code.claude.com/docs/en/plugins |
| 3 | Claude Code on Team and Enterprise — Anthropic | https://www.anthropic.com/news/claude-code-on-team-and-enterprise |
| 4 | Use Claude Code with Team/Enterprise Plans | https://support.claude.com/en/articles/11845131-use-claude-code-with-your-team-or-enterprise-plan |
| 5 | Cowork and Plugins Across the Enterprise — Claude Blog | https://claude.com/blog/cowork-plugins-across-enterprise |
| 6 | Use Skills in Claude — Support | https://support.claude.com/en/articles/12512180-use-skills-in-claude |
| 7 | Claude Code for Enterprise | https://claude.com/product/claude-code/enterprise |
| 8 | Claude Skills as Self-Documenting Runbooks — Zack Proser | https://zackproser.com/blog/claude-skills-internal-training |
| 9 | Best Practices for Claude Code | https://code.claude.com/docs/en/best-practices |
| 10 | Team Plan Pricing | https://claude.com/pricing/team |

## Confidence

**High** — All sources are official Anthropic documentation, recent (Feb–Mar 2026) product announcements, or cited community practitioners with direct experience. The private plugin marketplace and enterprise provisioning features are officially released as of February 2026. One limitation: peer-to-peer skill sharing between individuals is still not native — requires admin provisioning or manual Git distribution.
