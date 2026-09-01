# ADR-0002: Portfolio layout — channels, design-system, radar as a shared core

- Status: Accepted
- Date: 2026-09-01
- Supersedes: the folder-layout portion of ADR-0001 (`catalog/` and `packages/schemas/`). The technology choices in ADR-0001 (pnpm workspaces, Next.js, Node worker, SQLite, no Docker) are unchanged.

## Context

The portfolio grew from a single channel to 11 current and planned brands, plus a distinct future subsystem (source monitoring) that must serve every channel rather than being built per channel. The original `catalog/channels/<id>/` and `packages/schemas/` layout did not name a home for that shared subsystem, for the dashboard/worker apps, or for local operational data, and its logo-manifest asset prefix (`tob`) was a channel-specific abbreviation rather than the full slug the naming convention requires.

## Decision

- Rename `catalog/channels/` to a top-level `channels/`. Each onboarded brand keeps a Channel Pack at `channels/<slug>/`, with `channel.json` at its root and brand identity (colors, logo manifest, logo assets, proofs) under `channels/<slug>/brand/`.
- Introduce `channels/registry.json` (schema: `design-system/schemas/src/channel-registry.schema.json`) as the central index of every current and planned brand, independent of whether that brand has been onboarded yet.
- Rename `packages/schemas/` to `design-system/schemas/`, and move the other cross-channel, channel-independent design catalogs there too: `design-system/layouts/`, `design-system/safe-zones/` (formerly `catalog/formats/`), `design-system/typography/` (the future central typography library), `design-system/modules/`, `design-system/fixtures/`. `design-system/*` is added to the pnpm workspace globs.
- Introduce `radar/` (`adapters/`, `pipelines/`, `tests/`) as a shared source-monitoring core that serves every channel. Radar is not scoped to one channel; each channel keeps its own source list within its own Channel Pack once monitoring is onboarded for it (Phase 6).
- Introduce `data/` for local operational state (e.g. a future SQLite database) that is not Git-tracked design data.
- Rename `apps/web` to `apps/dashboard` to match its actual role (the local onboarding/inbox/review/preview/publication UI). `apps/worker` is unchanged.
- Channel asset filenames use the full channel slug as their prefix, never an abbreviation (`tip-ogrencileri-platformu-circular-original.png`, not `tob_circular_original.png`).

## Consequences

Every path reference across `AGENTS.md`, `docs/`, `ROADMAP.md`, `TASKS.md`, schemas, and the registry was updated to match. The already-passed `tip-ogrencileri-platformu` logo set was moved and renamed in place (asset bytes unchanged, only path and filename); its manifest and registry entry were updated to match. `radar/`, `apps/dashboard`'s onboarding UI, and `design-system/typography/`'s central library remain unimplemented scaffolding until their respective phases (6 and 4) begin — this ADR fixes their location, not their implementation.
