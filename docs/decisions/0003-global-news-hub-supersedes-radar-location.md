# ADR-0003: Global News Hub supersedes the top-level `radar/` shared-core location

- Status: Accepted
- Date: 2026-09-04
- Supersedes: the shared-source-monitoring-core *location* decision in
  ADR-0002 (the introduction of a top-level `radar/` directory in this repo
  as the home of the shared, channel-agnostic engine). ADR-0002's other
  decisions (the `channels/`, `design-system/`, `apps/dashboard`, `data/`
  layout; `channels/registry.json`; asset-filename convention) are
  unaffected and remain in force.

## Context

ADR-0002 reserved a top-level `radar/` directory in this repo as the future
home of a shared source-monitoring engine serving every channel, but that
directory was never implemented beyond `.gitkeep` placeholders under
`adapters/`, `pipelines/`, `tests/`. Batch N1 (2026-09-04) introduces a new,
explicit, user-approved architecture decision: the shared engine is the
**Global News Hub**, owned by the sibling repo `channel-content-os`, not by
a directory in this repo. See that repo's
`docs/global-news-hub-contract.md` for the full contract (ownership,
sync model, cross-channel article model, delivery-surface model).

## Decision

- The shared, channel-agnostic news/content-monitoring engine is the
  **Global News Hub**, owned by `channel-content-os`. It is not, and will
  not be, a directory in this repo.
- This repo (`multi_channel_design`) remains authoritative for
  channel-owned editorial/source configuration: post-archetype/policy
  files, source packs, topic/relevance preferences, and source
  trust/priority preferences, under `channels/<slug>/content/`.
  `channel-content-os` synchronizes/loads this configuration into a runtime
  index; it does not become a second independently editable copy, and
  runtime/operational state computed by the Hub (fetched articles,
  relevance scores, duplicate clusters, source health, delivery state) is
  never written back into this repo as if it were editable canonical
  channel policy.
- The empty top-level `radar/` scaffold (`adapters/`, `pipelines/`,
  `tests/`, all unimplemented `.gitkeep` placeholders) is retired. Since it
  held no implementation, retiring it is a documentation/scaffolding
  cleanup, not a migration.
- `docs/CONTENT-MONITORING.md`'s behavioral contract (canonicalize URLs,
  fingerprint content, merge duplicates while preserving provenance,
  immutable published records, `INCOMING -> WILL_PUBLISH -> PUBLISHED`) is
  **unaffected** by this decision -- it describes ingestion/publication
  *behavior*, not *location*, and continues to describe the Global News
  Hub's intended behavior.
- The existing, working, channel-embedded source-monitoring implementation
  at `channels/tip-ogrencileri-platformu/{radar,scripts,sources,tests,database}/`
  is **untouched** by this decision -- it remains real, tested,
  channel-specific tooling. Its previously-planned generalization target
  (this repo's shared top-level `radar/` core, per ADR-0002 and `TASKS.md`
  item 24) is superseded: if that engine's logic is later reused as part of
  the Global News Hub, the target is `channel-content-os`, not a `radar/`
  directory here. No such migration is performed by this ADR.

## Consequences

- `AGENTS.md`, `ROADMAP.md`, `TASKS.md`, `docs/CHANNEL-SYSTEM.md`, and
  `docs/STATUS.md` are updated so their "Radar is a shared core under
  `radar/`" statements point to this ADR instead of describing the retired
  location as active architecture.
- `radar/adapters/.gitkeep`, `radar/pipelines/.gitkeep`,
  `radar/tests/.gitkeep` are removed (the directory held no other content).
- Kaduse News (Batch N1) is the first channel archetype/policy built against
  this new ownership model: `channels/kaduse-medikal/content/policies/kaduse-news.json`
  plus a `channels/kaduse-medikal/content/news-sources.json` placeholder
  (empty source pack, per Batch N1 -- source-by-source selection is
  deferred to its own batch).
