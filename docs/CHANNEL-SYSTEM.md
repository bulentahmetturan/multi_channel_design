# Channel System

Every current and planned brand is indexed in `channels/registry.json` (schema: `design-system/schemas/src/channel-registry.schema.json`). Each onboarded channel lives in `channels/<channel-id>/` and owns brand identity, not layouts. Radar (source monitoring) is a shared core under `radar/`, not part of any single Channel Pack; once a channel is onboarded it lists its own sources within its Channel Pack.

Required onboarding progression:

`DRAFT → COLORS_PASS → LOGOS_PASS → TYPOGRAPHY_PASS → BRAND_PROOF_PASS → READY`

Typography is deferred at the portfolio level — see `docs/ONBOARDING-ORCHESTRATION.md` and `ROADMAP.md` Phase 2. No channel proceeds to `TYPOGRAPHY_PASS` until every registry entry has reached `LOGOS_PASS` and the central typography library exists.

A Channel Pack contains channel identity (`channel.json`), and a `brand/` directory with functional color roles, a Color Combination Registry, logo manifest and logo assets, proofs, typography pool and pairs (once unlocked), copy style, and image direction. New channels must not require core ranking changes. Name channel asset files with the full channel slug, never an abbreviation.
