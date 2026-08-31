# Agent Instructions

## Purpose

Build a portable, local-first operating system for multi-channel Instagram design, monitoring, and publication. Git and versioned repository files are the persistent source of truth.

## Architecture

- Keep layouts channel-independent; Channel Packs live under `catalog/channels/<channel-id>/`.
- Compose posts as content-based layout + Channel Pack + typography pair + assets + format profile.
- Keep catalogs as versioned JSON; keep mutable workflow state in SQLite behind adapters.
- Keep external integrations optional. Do not use MCP for local repository access.
- Analyze binary references once, store compact metadata, and retrieve narrowly.

## Hard rules

- Select layouts from content morphology before applying channel identity.
- Treat safe zones, contrast, minimum type size, overflow, and logo cropping as hard gates.
- Never invent factual claims, dates, deadlines, prices, eligibility, statistics, quotes, or sources.
- Preserve historical versions needed to reproduce published work.

## Commands

Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before declaring implementation work complete. During the foundation stage, these may report that no workspace packages expose a command.

## Definition of done

Requested behavior is implemented, relevant deterministic validation passes, documentation and schemas match behavior, and `docs/STATUS.md` plus `TASKS.md` are updated. Commit only scoped changes; do not overwrite unrelated work.

## Context

Read `docs/INDEX.md`, then only the task-specific files it routes to. Do not load the entire documentation set by default.
