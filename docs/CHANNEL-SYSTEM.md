# Channel System

Every current and planned brand is indexed in `channels/registry.json` (schema: `design-system/schemas/src/channel-registry.schema.json`). Each onboarded channel lives in `channels/<channel-id>/` and owns brand identity, not layouts. Source monitoring is the Global News Hub, a shared engine owned by the sibling `channel-content-os` repo (see `docs/decisions/0003-global-news-hub-supersedes-radar-location.md`), not a top-level directory in this repo; once a channel is onboarded it lists its own source pack and news/content policy within its Channel Pack.

Required onboarding progression:

`DRAFT → COLORS_PASS → LOGOS_PASS → TYPOGRAPHY_PASS → BRAND_PROOF_PASS → READY`

Typography is deferred at the portfolio level — see `docs/ONBOARDING-ORCHESTRATION.md` and `ROADMAP.md` Phase 2. No channel proceeds to `TYPOGRAPHY_PASS` until every registry entry has reached `LOGOS_PASS` and the central typography library exists.

A Channel Pack contains channel identity (`channel.json`), and a `brand/` directory with functional color roles, a Color Combination Registry, logo manifest and logo assets, proofs, typography pool and pairs (once unlocked), copy style, and image direction. New channels must not require core ranking changes. Name channel asset files with the full channel slug, never an abbreviation.

Not every logo manifest needs all 12 slots filled to reach `LOGOS_PASS`. The 12-slot grid (4 forms x 3 treatments) is the target shape, not a hard requirement -- some brand kits genuinely only have a subset (e.g. circular only, or no standalone icon). A channel may advance to `LOGOS_PASS` with a partial manifest as long as every *provided* slot passes its own validation; unavailable slots stay `PENDING` honestly rather than blocking the channel or being invented to fill the count.
