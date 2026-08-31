# ADR-0001: Local-first technical foundation

- Status: Accepted
- Date: 2026-09-01

## Context

The system must be portable across coding agents, keep Git as its persistent source of truth, run locally without Docker, and avoid repeatedly sending structured assets to an LLM.

## Decision

- Use a TypeScript monorepo managed with pnpm workspaces.
- Use Next.js App Router for the local web interface.
- Use a Node.js worker for monitoring, processing, and rendering jobs.
- Store versioned Channel Packs, Layout Profiles, templates, and safe-zone profiles as JSON in Git.
- Use SQLite for local operational state such as inbox items, decisions, and publication status.
- Keep external integrations optional and replaceable.
- Do not require Docker for local development.

## Consequences

Catalog data remains reviewable and portable, while mutable workflow state stays queryable without an external database. A future hosted deployment may add another database through an adapter without changing the catalog formats.
