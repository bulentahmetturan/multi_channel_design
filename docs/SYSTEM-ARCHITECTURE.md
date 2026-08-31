# System Architecture

## Boundaries

- `apps/web`: local review, onboarding, preview, and publication interface.
- `apps/worker`: monitoring, deduplication, rendering, and validation jobs.
- `packages/core`: domain workflows and ports.
- `packages/schemas`: versioned data contracts.
- `packages/renderer`: deterministic composition and export.
- `packages/ranking`: layout and content preference scoring.
- `packages/shared`: small cross-package utilities.
- `catalog`: Git-versioned Channel Packs, layouts, typography, modules, fixtures, and format profiles.

Dependencies point inward toward schemas and domain contracts. External providers sit behind replaceable adapters. SQLite stores operational state; catalog JSON remains the design source of truth.
