# Applications

- `dashboard` (renamed from `web` per ADR-0002): localhost Content Operations
  UI -- the primary human review surface (Batch P1, 2026-09-04). See
  `dashboard/README.md`.
- `worker`: source ingestion, deduplication, rendering, and validation jobs.

Applications orchestrate package APIs; reusable domain logic belongs in `packages/`.

**Batch P1 (2026-09-04):** the localhost Content Operations UI supersedes an
earlier assumption that Global Mail would be the primary review surface.
Global Mail, if ever built, is an optional downstream notification/delivery
surface only -- it must never own candidate/review/channel state.
