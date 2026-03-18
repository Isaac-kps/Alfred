# Research Report: Ruflo — Multi-Agent AI Orchestration for Claude Code

**Date:** 2026-03-17
**Prepared by:** Alfred

---

## Overview

Ruflo (formerly Claude Flow) is an open-source enterprise-grade multi-agent AI orchestration platform built on top of Claude Code. It coordinates 60+ specialised agents in a "queen-led swarm" architecture to tackle complex software engineering tasks. After 10 months and 5,800+ commits, it reached its first production-stable release (v3.5.0) on 27 February 2026.

---

## Key Findings

- Ruflo extends Claude Code with 215 MCP tools, 60+ specialised agents, and a self-learning neural layer (Source: [GitHub — ruvnet/ruflo](https://github.com/ruvnet/ruflo))
- Claims 84.8% SWE-Bench solve rate and 30–50% token cost savings through intelligent routing and WASM-based task optimisation (Source: [GitHub — ruvnet/ruflo](https://github.com/ruvnet/ruflo))
- v3.5.0 marks the first non-alpha release; prior 55 alpha iterations were branded "claude-flow" (Source: [v3.5.0 Release Overview](https://github.com/ruvnet/ruflo/issues/1240))
- Community adoption is cautious — mixed reactions and a documented concern about maintainability of LLM-generated codebases (Source: [Issue #945](https://github.com/ruvnet/ruflo/issues/945))
- Prior alpha versions had significant known bugs: memory system crashes, MCP server launch failures, and hook handler hangs

---

## Deep Dive

### Architecture

Ruflo is structured in 7 layers:

| Layer | Components |
|---|---|
| User | Claude Code CLI / MCP Server |
| Entry | CLI interface, AIDefence security module |
| Routing | Q-Learning router, Mixture-of-Experts (8 experts), 42+ skills, 17 hooks |
| Swarm Coordination | Mesh / hierarchical / ring / star topologies; Raft, Byzantine, Gossip, CRDT consensus |
| Agents | 60+ specialised workers (coder, tester, reviewer, architect, security, etc.) |
| Resources | Persistent memory, multi-LLM providers, 12 background workers |
| Intelligence | RuVector — SONA self-optimisation, EWC++ anti-forgetting, HNSW search, RL algorithms |

### Tech Stack

| Component | Technology |
|---|---|
| Runtime | Node.js 20+ / TypeScript |
| Performance layer | WebAssembly (Rust-compiled WASM kernels) |
| Vector DB | PostgreSQL + RuVector extension |
| Local DB | SQLite with WAL mode |
| Embeddings | ONNX Runtime + MiniLM (local, no API calls) |
| LLM providers | Anthropic Claude (primary), OpenAI, Google, Cohere, Ollama |
| Integration | Model Context Protocol (MCP) for Claude Code |

### Performance Claims

| Metric | Claimed Improvement |
|---|---|
| HNSW vector search | 150x–12,500x faster retrieval |
| Embedding generation | 75x faster vs API calls |
| Agent Booster (WASM) | 352x faster than LLM for simple transforms |
| Token cost savings | 30–50% reduction |
| Flash Attention speedup | 2.49–7.47x |
| Effective Claude subscription capacity | ~250% extension |

### How to Run It Locally

**Step 1 — Install Claude Code (prerequisite)**
```bash
npm install -g @anthropic-ai/claude-code
```

**Step 2 — Install Ruflo (choose one)**

Option A — Interactive wizard (recommended for first-time setup):
```bash
npx ruflo@latest init --wizard
```

Option B — One-line installer:
```bash
curl -fsSL https://cdn.jsdelivr.net/gh/ruvnet/claude-flow@main/scripts/install.sh | bash
```

Option C — Full install with MCP + diagnostics:
```bash
curl -fsSL https://cdn.jsdelivr.net/gh/ruvnet/claude-flow@main/scripts/install.sh | bash -s -- --full
```

**Step 3 — Set environment variables**

| Variable | Purpose |
|---|---|
| `ANTHROPIC_API_KEY` | Required — Claude models |
| `OPENAI_API_KEY` | Optional — GPT fallback |
| `GOOGLE_API_KEY` | Optional — Gemini fallback |
| `GITHUB_TOKEN` | Optional — PR/repo workflows |

**Step 4 — Verify installation**
```bash
npx ruflo@latest --doctor
```

**Install flags reference**

| Flag | Effect |
|---|---|
| `--global` | Install globally via npm |
| `--minimal` | Skip optional dependencies |
| `--setup-mcp` | Auto-configure MCP for Claude Code |
| `--doctor` | Run diagnostics after install |
| `--full` | Complete setup with all components |

### Known Issues (from alpha / community reports)

| Issue | Detail |
|---|---|
| Memory system crash | `ControllerRegistry` not properly exported in `@claude-flow/memory` |
| MCP server launch failure | Storage path resolved from `process.cwd()` — fails from root directory |
| Hook handler hang | `stdin.pause()` in `hook-handler.cjs` causes process hangs when hooks are chained |
| Post-bash hook junk files | Brace-containing output creates spurious files |
| Daemon metric updates | Scheduler loop fails to trigger metric file updates |
| Feature gaps | Multiple GitHub issues (e.g. #1326) report advertised core features are unimplemented |
| Server name mismatch | `.mcp.json` uses `ruflo` but doctor checks for `claude-flow` |

### Community Sentiment

- Overall reception is cautiously optimistic — v3.5.0 is the first stable release after a long alpha
- Mixed reactions on the V3 rebuild issue (#945): 2 downvotes, 2 "hooray" reactions, 5 comments
- A community member raised a sustainability concern: *"Is the need to rebuild everything due to the fact that it's not possible to maintain and upgrade software developed entirely with Claude Code?"*
- One Medium article praises Ruflo positively but the author appears to be an early adopter/promoter

---

## Recommendations

| Action | Priority | Notes |
|---|---|---|
| Try the wizard install in the workspace | Low–Medium | Use `npx ruflo@latest init --wizard` — lowest friction entry point |
| Do not use in production yet | — | v3.5.0 is the first non-alpha release; known bugs exist |
| Monitor GitHub issues | Ongoing | Watch for fixes to MCP server launch and memory system crashes |
| Evaluate against plain Claude Code | Before adopting | Overhead of running Ruflo may not justify gains for a solo/small-team setup |
| Consider for Code Quality POC | Future | The `code-reviewer` and `security` agent types could be useful — evaluate once stable |

---

## Sources

| # | Title | URL |
|---|---|---|
| 1 | GitHub — ruvnet/ruflo | https://github.com/ruvnet/ruflo |
| 2 | v3.5.0 Release Overview (Issue #1240) | https://github.com/ruvnet/ruflo/issues/1240 |
| 3 | Claude Flow V3 Rebuild (Issue #945) | https://github.com/ruvnet/ruflo/issues/945 |
| 4 | Getting Started Guide | https://github.com/ruvnet/ruflo/blob/main/v3/@claude-flow/guidance/docs/guides/getting-started.md |
| 5 | Medium — Ruflo user experience | https://medium.com/@ishank.iandroid/ruflo-the-orchestrator-that-changed-how-i-build-multi-agent-ai-for-claude-f9d210aca1aa |

---

## Confidence

**Medium.** The GitHub repository and release notes are primary sources and well-documented. Performance claims are taken directly from project documentation and have not been independently verified. Community feedback is limited given the recent v3.5.0 release. The Medium article could not be fetched (403). Known issue data is sourced from earlier alpha-era bug reports — some may have been fixed in v3.5.0.
