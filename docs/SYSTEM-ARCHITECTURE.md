# System Architecture

## Boundaries

- `apps/dashboard`: local review, onboarding, preview, and publication interface.
- `apps/worker`: monitoring, deduplication, rendering, and validation jobs.
- `packages/core`: domain workflows and ports.
- `packages/renderer`: deterministic composition and export.
- `packages/ranking`: layout and content preference scoring.
- `packages/shared`: small cross-package utilities.
- `design-system`: versioned schemas, layouts, safe zones, and the central typography library, shared by every channel.
- `channels`: the Channel Registry (`channels/registry.json`) plus one Git-versioned Channel Pack per brand (identity, brand colors, logo assets, and — once onboarded — its own monitoring sources).
- `radar`: shared source-monitoring core (adapters, pipelines, tests) serving every channel; not tied to any single channel.
- `data`: local operational state (e.g. SQLite) that is not Git-tracked design data.

Dependencies point inward toward `design-system` schemas and domain contracts. External providers sit behind replaceable adapters. SQLite stores operational state; `design-system` and `channels` JSON remain the design source of truth.
