# Project Status

## Current phase

Phase 2 — in progress

## Completed

- Private GitHub repository confirmed: `bulentahmetturan/multi_channel_design`.
- Local repository initialized on `main` and connected to `origin`.
- Environment inspected: Git, Node.js 24, npm, pnpm, and Python 3.11 are available.
- Docker and Yarn are not required.
- Technical foundation approved and recorded in ADR-0001.
- Portfolio layout approved and recorded in ADR-0002: `channels/`, `design-system/`, `apps/dashboard`, `apps/worker`, `data/`. (ADR-0002's separate `radar/` shared-core-location decision is superseded by ADR-0003, 2026-09-04 -- see "Radar (source monitoring)" below.)
- Concise cross-agent instructions and selective context routing established.
- Workspace boundaries and the initial repository skeleton established.
- Initial channel, layout, format, content-item, and typography-pair schemas validated.
- Canonical lint, type-check, test, and build commands pass.
- **Relaxed rule (explicit user instruction):** a channel's logo manifest does not need all 12 slots filled to reach `LOGOS_PASS`. Every *provided* slot must still pass its own validation; genuinely unavailable slots stay `PENDING` rather than being invented. Recorded in `docs/CHANNEL-SYSTEM.md`.

## Next

Phase 2 — onboard the remaining `PLANNED` channels (`dunya-burslari`; `yeni-nesil-romanci` intentionally held). Typography stays deferred for every channel until the whole registry reaches `LOGOS_PASS`; see `ROADMAP.md` Phase 2 sub-sequence and `docs/ONBOARDING-ORCHESTRATION.md`.

## Channel Registry

`channels/registry.json` holds all 12 current and planned brands (schema: `design-system/schemas/src/channel-registry.schema.json`).

| Slug | Status | Logo | Color | Language |
| --- | --- | --- | --- | --- |
| tip-ogrencileri-platformu | ACTIVE | PASS (12/12) | PASS | tr |
| kaduse-medikal | ACTIVE | PASS (12/12) | PASS | tr |
| iyilesme-kanali | ACTIVE | PASS (12/12) | PASS | tr |
| turkiye-scholarships | ACTIVE | PASS (12/12) | PASS | en (+7) |
| futboscope | ACTIVE | PASS (7/12) | PASS | tr |
| turkish-context | ACTIVE | PASS (9/12) | PASS | en (+tr) |
| dua-mecmuasi | ACTIVE | PASS (9/12) | PASS | tr |
| macaristan-rehberi | ACTIVE | PASS (3/12) | PASS | tr |
| folk-saying | ACTIVE | PASS (4/12) | PASS | en (+tr) |
| scope-turkiye | ACTIVE | PASS (3/12) | PASS | en (+tr) |
| yeni-nesil-romanci | PLANNED | UNSET | UNSET | — |
| dunya-burslari | PLANNED | UNSET | UNSET | — |

`yeni-nesil-romanci` stays `PLANNED` by explicit user instruction (holds its registry place, no material provided yet). All other `ACTIVE` channels are at `LOGOS_PASS`.

## Per-channel progress notes

Full validation detail lives in each channel's own `brand/logo-manifest.json` and `brand/colors.json`. Summary of what's notable per channel:

- **tip-ogrencileri-platformu**: 12/12 logos. Original submissions had opaque/checkerboard backgrounds; extracted programmatically (connected-component background classification, white treatments derived from black-sibling silhouette masks).
- **kaduse-medikal**: 12/12 logos, glossy 3D-rendered source art (harder case than flat vector) -- same extraction technique generalized successfully. Palette taken verbatim from the brand's own Bible doc, not pixel-sampled (renders have per-pixel lighting variation).
- **iyilesme-kanali**: 12/12 logos, all submitted already as clean transparent PNGs -- validation only, no extraction needed. Palette + identity from the brand's own brandkit deck.
- **turkiye-scholarships**: 12/12 logos selected from the project's own existing (larger) asset set, not user-submitted. Palette taken from the project's own Instagram-renderer color tokens; a discrepancy against the separate website's different brand doc is documented, not resolved.
- **futboscope**: 7/12 logos (no horizontal lockup or composed circular badge exist in the source kit). Palette from the project's own locked, tested color-decision doc. Existing separate video-production pipeline documented as out of scope at `channels/futboscope/SCOPE.md`.
- **turkish-context**: 9/12 logos (no horizontal lockup). Palette fetched from logo pixel data (no color doc existed). Source assets are low resolution (72-318px) -- flagged, not blocking.
- **dua-mecmuasi**: 9/12 logos (no standalone icon in source kit). Palette fetched from logo pixel data.
- **macaristan-rehberi**: 3/12 logos (circular only; source kit's actual brand is "Barlovics Türkiye"). Palette fetched from logo pixel data.
- **folk-saying**: 4/12 logos (icon-only + horizontal, black/white only -- no transparent color original exists yet). Palette fetched from an opaque reference render in the source kit (not a proper logo asset itself).
- **scope-turkiye**: 3/12 logos (circular only). Palette fetched from logo pixel data.

Every channel: typography deliberately deferred (portfolio-level rule, not a per-channel blocker).

## Central typography pool (data collection only)

Per explicit user instruction, fonts already documented or licensed by individual channel projects have been cataloged at `design-system/typography/font-pool.json`: Söhne and Tungsten (licensed commercial faces, actual font files found in futboscope's own project folder -- **not copied into this repo**, licensing unverified), Ofelia Text Semibold / Placard Next Condensed / Cormorant Garamond (iyilesme-kanali's brandkit), IBM Plex Sans / IBM Plex Sans Arabic (turkiye-scholarships' existing website runtime). This is cataloging only -- no channel has moved to `TYPOGRAPHY_PASS`, and the portfolio-level deferral rule is unchanged.

## Blockers

None.

## Radar (source monitoring) / Global News Hub

A working, tested source-monitoring implementation for `tip-ogrencileri-platformu` (scan pipeline, faculty-source discovery scripts, official source inventory, 77 passing tests) arrived from a separate session and was integrated at `channels/tip-ogrencileri-platformu/{radar,scripts,sources,tests,database}/`. It remains channel-embedded and untouched.

**Superseded (ADR-0003, 2026-09-04):** the shared, channel-agnostic engine this implementation was meant to eventually generalize into is no longer a top-level `radar/` directory in this repo -- it is the **Global News Hub**, owned by the sibling `channel-content-os` repo (contract: that repo's `docs/global-news-hub-contract.md`). This repo's empty `radar/` scaffold has been retired. `kaduse-medikal` is the first channel with a news archetype/policy persisted against this model: `channels/kaduse-medikal/content/policies/kaduse-news.json`, with an empty `channels/kaduse-medikal/content/news-sources.json` source-pack placeholder (actual source selection deferred to its own batch).

## Last updated

2026-09-02 (10 of 12 registry channels onboarded to LOGOS_PASS + COLORS_PASS; 12-slot logo requirement relaxed per explicit user instruction; central font-pool data collection started; `.claude/instructions.txt` decision guide added -- commit/pull pre-authorized, push requires confirmation)
