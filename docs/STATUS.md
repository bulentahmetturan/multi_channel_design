# Project Status

## Current phase

Phase 2 — in progress

## Completed

- Private GitHub repository confirmed: `bulentahmetturan/multi_channel_design`.
- Local repository initialized on `main` and connected to `origin`.
- Environment inspected: Git, Node.js 24, npm, pnpm, and Python 3.11 are available.
- Docker and Yarn are not required.
- Technical foundation approved and recorded in ADR-0001.
- Portfolio layout approved and recorded in ADR-0002: `channels/`, `design-system/`, `apps/dashboard`, `apps/worker`, `radar/` (shared core, not channel-specific), `data/`.
- Concise cross-agent instructions and selective context routing established.
- Workspace boundaries and the initial repository skeleton established.
- Initial channel, layout, format, content-item, and typography-pair schemas validated.
- Canonical lint, type-check, test, and build commands pass.

## Next

Phase 2 — Channel Registry & Brand Foundations: onboard the next `PLANNED` channel in registry order (identity first). Typography is deferred for every channel until all 11 registry entries reach `LOGOS_PASS`; see `ROADMAP.md` Phase 2 sub-sequence and `docs/ONBOARDING-ORCHESTRATION.md`.

## Channel Registry

`channels/registry.json` holds all 12 current and planned brands (schema: `design-system/schemas/src/channel-registry.schema.json`).

- `tip-ogrencileri-platformu`: `ACTIVE`, logo `PASS`, color `PASS`.
- `kaduse-medikal`: `ACTIVE`, logo `PASS`, color `PASS`, language `tr`.
- `iyilesme-kanali`: `ACTIVE`, logo `PASS`, color `PASS`, language `tr`.
- `turkiye-scholarships`: `ACTIVE`, logo `PASS`, color `PASS`, language `en` (+7 secondary).
- `futboscope`: `ACTIVE`, logo `IN_PROGRESS` (7/12 slots PASS), color `PASS`, language `tr`.
- Remaining 7 channels: `PLANNED`, all foundation fields `UNSET`.

## tip-ogrencileri-platformu progress

- Channel identity: PASS
- Palette values: PASS (`#FFF9FB` corrected to `#FFFFFF` by user request)
- Color proof and contrast report: PASS
- Global Color Combination and Reversal Policy: adopted
- Color Combination Registry: generated as `PROPOSED` with an anti-repetition window of six posts
- Logo manifest: 12/12 PNG slots PASS, stored under `channels/tip-ogrencileri-platformu/brand/logos/` with the full channel-slug filename prefix. Source submissions had opaque backgrounds (embedded checkerboard or flat near-white); background was removed programmatically (connected-component background classification for the checkerboard/gradient cases, silhouette masks borrowed from the geometrically-aligned black sibling for the white treatments), true RGBA alpha applied, and every asset tightly cropped to its own content bounds. Slot 8 was additionally re-cropped to match the aspect ratio of slots 7 and 9.
- Channel status: `LOGOS_PASS` (channel.json bumped to `0.3.0`)
- Typography: deliberately deferred (portfolio-level rule, not a blocker for this channel).

## kaduse-medikal progress

- Channel identity: PASS. Purpose, audience, and primary language (`tr`) drawn faithfully from the brand's own source docs (`00_KADUSE_BIBLE.md` / `00_KADUSE_MASTER.md`) supplied alongside the logo pack.
- Palette: PASS. Taken verbatim from the brand bible's stated palette (Ana Mavi `#1178BB`, Turkuaz `#35BCD1`, Lacivert `#0B3654`, Mercan `#F2765C`, Notr `#F7F5F2`), not derived from logo-pixel sampling (the source logos are glossy 3D renders with per-pixel lighting variation, unsuitable for exact color extraction). Role mapping and WCAG contrast ratios recorded in `channels/kaduse-medikal/brand/colors.json`.
- Logo manifest: 12/12 PNG slots PASS, stored under `channels/kaduse-medikal/brand/logos/`. Source files (a complete 12-slot pack from the user, zip already extracted to a local folder) were opaque RGB, glossy 3D-rendered marks on a studio-gradient background with a soft drop shadow -- a different, harder asset type than tip-ogrencileri-platformu's flat vector marks. Background and shadow removed programmatically (same connected-component technique, generalized successfully), true RGBA alpha applied, tightly cropped. Two slots (4 horizontal-original, 7 icon-only-original) retain a visually negligible low-alpha shadow trace, noted in the manifest as a future refinement, not a blocking defect.
- Channel status: `LOGOS_PASS`.
- Typography: deliberately deferred (portfolio-level rule, not a blocker for this channel).

## iyilesme-kanali progress

- Channel identity: PASS. Purpose, audience, and primary language (`tr`) drawn from the brand's own source deck (`iyilesme_kanali_brandkit.png`): four pillars (balance, consciousness, biology, transformation), brand keywords and personality.
- Palette: PASS. Taken verbatim from the brandkit's stated palette (Healing Red `#A61E2B`, Warm Ivory `#F4F0E8`, Deep Plum `#472742`, Sage Accent `#A5B39B`, Graphite `#1E1E1E` -- explicitly labeled as the text color in the source deck). WCAG contrast ratios recorded in `channels/iyilesme-kanali/brand/colors.json`; Sage Accent is decorative/border-only (fails contrast as text against every other palette color).
- Logo manifest: 12/12 PNG slots PASS, stored under `channels/iyilesme-kanali/brand/logos/`. Unlike the first two channels, all 12 source files arrived as genuine RGBA PNGs with real transparency and tight crops already -- no background-removal processing was needed, only validation and renaming (numeric prefixes stripped) to the canonical filename convention.
- Channel status: `LOGOS_PASS`.
- Typography: deliberately deferred (portfolio-level rule). Note for later: the source brandkit already specifies a 3-font system (Ofelia Text Semibold / Placard Next Condensed / Cormorant Garamond) for reference when the central typography phase begins.

## turkiye-scholarships progress

- Channel identity: PASS. Purpose, audience, and languages (primary `en`, secondary `tr/ar/fa/ur/ru/fr/es`) drawn from the project's own existing website (`website/docs/05_BRAND_AND_DESIGN.md`, `website/i18n/routing.ts` defaultLocale, `website/data/languages.ts`) and `instagram-post-automation/renderer/brand-constants.json`. Unlike the first three channels, this project already has a mature, in-production codebase (marketing website + Next.js Instagram-post renderer).
- Palette: PASS. Taken verbatim from `instagram-post-automation/renderer/colors.json`, the project's own canonical Instagram-render color token file. **Discrepancy noted, not resolved:** the separate marketing-website brand doc states a visibly different palette (Turkiye Red `#B30015` vs. crimson-primary `#9D1B35`, etc.) for its own UI; the Instagram renderer's tokens were used as authoritative here since they are the purpose-matched source for Instagram design and this repo does not own the website.
- Logo manifest: 12/12 PNG slots PASS, stored under `channels/turkiye-scholarships/brand/logos/`. The source `instagram-post-automation/assets/1. logos/` folder had 4 variants per form (not always fitting the original/white/black model) -- unused fixed-background variants (e.g. white-on-solid-red tiles) are documented per-slot in the manifest's `reason` fields rather than silently dropped. Slot 10 (vertical original) had no usable transparent-background red source; it was rebuilt from the working vertical-black silhouette, recolored to the brand's crimson-primary.
- Channel status: `LOGOS_PASS`.
- Typography: deliberately deferred (portfolio-level rule). Note: the website already runs a locked, documented typography system (IBM Plex Sans) for its own UI -- unrelated to this channel's future Instagram font pool, kept separate.

## futboscope progress

- Channel identity: PASS. Purpose, audience, and language (`tr`) drawn from the project's own existing handover doc (a separate, already-running YouTube-transcript/filtering/captioning pipeline).
- Palette: PASS. Brand blue `#0044FF` taken verbatim from the project's own locked design decision (`brand/FORMAT1-DIRECTION.md` -- a documented, tested brand-color decision, not a guess). Two-tone identity (blue + black/white); no second brand color is documented anywhere in the source project.
- Logo manifest: 7/12 PNG slots PASS (icon-only x3, a stacked two-line wordmark mapped to VERTICAL x3, one circular avatar mark). 5 slots `PENDING`: horizontal (this brand has no icon-beside-wordmark lockup) and circular white/black (no pre-composed circular badge exists, only one avatar-style mark). Not invented to fill the gap.
- Channel status: `COLORS_PASS` (not yet `LOGOS_PASS` -- manifest is incomplete, honestly).
- **Scope note:** Futboscope also has an existing, separate, working video-production pipeline (YouTube sync, transcript archive, speaker ID, captioning) that lives outside this repo and is explicitly out of scope here. A proposed (not built) non-video "news column" using this repo's shared design/approval layer is documented, clearly marked not-implemented, at `channels/futboscope/SCOPE.md`.

## Blockers

None.

## Radar (source monitoring)

A working, tested source-monitoring implementation for `tip-ogrencileri-platformu` (scan pipeline, faculty-source discovery scripts, official source inventory, 77 passing tests) arrived from a separate session and was integrated at `channels/tip-ogrencileri-platformu/{radar,scripts,sources,tests,database}/`. It is still channel-embedded, not yet generalized into the shared top-level `radar/` core defined in ADR-0002 — see that ADR's follow-up section and `TASKS.md` for the deferred generalization work.

## Last updated

2026-09-01 (portfolio restructuring: channels/ + design-system/ + radar/ + data/; tip-ogrencileri-platformu radar implementation integrated; kaduse-medikal, iyilesme-kanali, and turkiye-scholarships onboarded to LOGOS_PASS; futboscope onboarded to COLORS_PASS with 7/12 logo slots and a documented pipeline/scope boundary)
