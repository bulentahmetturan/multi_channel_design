# ADR-0002: Portfolio layout — channels, design-system, radar as a shared core

- Status: Accepted (partially superseded -- see note below)
- Date: 2026-09-01
- Supersedes: the folder-layout portion of ADR-0001 (`catalog/` and `packages/schemas/`). The technology choices in ADR-0001 (pnpm workspaces, Next.js, Node worker, SQLite, no Docker) are unchanged.
- **Superseded in part by ADR-0003 (2026-09-04):** the decision below to home the shared source-monitoring core at a top-level `radar/` directory in this repo is superseded -- that shared engine is now the Global News Hub, owned by the sibling `channel-content-os` repo. This repo's `radar/` scaffold (never implemented beyond `.gitkeep` placeholders) has been retired. Every other decision in this ADR (the `channels/`, `design-system/`, `apps/dashboard`, `data/` layout; `channels/registry.json`; asset-filename convention) remains in force. See ADR-0003 for the current model.

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

## Follow-up: existing channel-embedded radar implementation

A separate session pushed a working, tested source-monitoring implementation (Python: `radar/` engine, `scripts/` faculty-source discovery, `sources/` official source inventory, `tests/`, 77 passing tests) directly under `tip-ogrencileri-platformu`'s Channel Pack, ahead of this ADR. It was moved intact to `channels/tip-ogrencileri-platformu/{radar,scripts,sources,tests,database}/` (all 77 tests still pass at the new path; committed `__pycache__`/`.pyc` files were removed and gitignored) rather than being merged into the shared top-level `radar/` right away, because:

- Its `config.py` computes paths relative to its own parent directory and its tests import it as a local `radar` package; generalizing it into a channel-agnostic shared core requires parameterizing that root and re-verifying every test, which is real engineering work, not a rename.
- `sources/` (official faculty/source inventory) and `scripts/` (faculty-discovery/verification) are genuinely `tip-ogrencileri-platformu`-specific data and tooling and belong in its Channel Pack regardless of where the engine ends up, per this ADR's own principle that each channel keeps its own sources.

Generalizing the engine into the shared `radar/` core so other channels can reuse it remains open work for Phase 6, tracked in `TASKS.md`.
