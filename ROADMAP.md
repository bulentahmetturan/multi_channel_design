# Roadmap

This roadmap keeps implementation incremental. Only the current phase is active.

| Phase | Outcome | Status |
| --- | --- | --- |
| 0 | Repository, environment, plan, and technical decisions | Complete |
| 1 | Agent-compatible repository foundation and schemas | Complete |
| 2 | Channel Registry & Brand Foundations: identity, palette, and logo assets for every channel | In progress |
| 3 | One-time layout ingestion and representative validation | Planned |
| 4 | Central typography library, renderer, typography fitting, and verified safe zones | Planned |
| 5 | Content morphology, local ranking, and preview selection | Planned |
| 6 | Monitoring inbox, deduplication, and review workflow | Planned |
| 7 | User-selected publishing workflow | Planned |
| 8 | Token, ranking, batching, and hosting optimization | Planned |

Phase transitions require their quality gates to pass and `docs/STATUS.md` to be updated.

## Phase 2 sub-sequence

1. Populate `channels/registry.json` with every current and planned brand/channel (see `design-system/schemas/src/channel-registry.schema.json`).
2. Bring each channel to its `LOGOS_PASS` gate one at a time, in registry order: identity (name, purpose, audience, language), color palette and approved color-role combinations, then the 12-asset logo manifest. Do not request logos or palettes for multiple channels at once — a channel handing over a complete asset package unprompted may still be processed in one pass.
3. Typography is deferred for every channel until step 2 is complete for the whole registry. Only then is a central typography library built under `design-system/typography/` (feeding Phase 4), from which each channel selects a compatible font pool and pair. Do not begin typography onboarding for any channel before this.
4. Source monitoring is the Global News Hub, a shared engine serving every channel owned by the sibling `channel-content-os` repo (see ADR-0003) — not onboarded per channel and not a directory in this repo. Each channel's own source pack and news/content policy lives in its Channel Pack once monitoring begins for it.
