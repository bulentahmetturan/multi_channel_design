# Tasks

## Current

- [x] Phase 2: collect and validate the primary logo for `tip-ogrencileri-platformu`. All 12 logo slots PASS. Channel status advanced to `LOGOS_PASS`.
- [x] Phase 2: create the central Channel Registry (`channels/registry.json`) with all 11 current/planned brands.
- [x] Phase 2: migrate the repository to the portfolio layout (`channels/`, `design-system/`, `apps/dashboard`, `apps/worker`, `radar/`, `data/`), recorded in ADR-0002.
- [x] Phase 2: onboard `kaduse-medikal` to `LOGOS_PASS` (identity, palette, all 12 logo slots) from the user-submitted logo pack and brand bible.
- [x] Phase 2: onboard `iyilesme-kanali` (registry's 12th entry) to `LOGOS_PASS` (identity, palette, all 12 logo slots -- submitted already as clean transparent PNGs) from the user-submitted logo pack and brandkit deck.
- [x] Phase 2: onboard `turkiye-scholarships` to `LOGOS_PASS`, selecting the best-fitting 12 of that project's existing logo assets and using its own existing Instagram-renderer color tokens as the palette (discrepancy vs. the website's separate brand doc noted, not resolved).
- [x] Phase 2: onboard `futboscope` to `LOGOS_PASS` (identity, palette) with 7/12 logo slots PASS (5 genuinely unavailable in the source brand kit, not invented). Documented the existing-pipeline/proposed-news-column/shared-layer scope boundary at `channels/futboscope/SCOPE.md`.
- [ ] Futboscope: horizontal lockup + circular white/black logo treatments, if/when designed -- not yet requested.
- [ ] Futboscope: news-column prototype (read-only candidate inbox, no transcript-archive write path) -- proposed only, not yet requested.
- [x] Phase 2: onboard `turkish-context` to `LOGOS_PASS` with 9/12 logo slots PASS (3 horizontal slots genuinely unavailable); palette fetched from logo pixel data (no color doc existed). Low-resolution source assets flagged, not blocking.
- [x] Phase 2: onboard `dua-mecmuasi` to `LOGOS_PASS` with 9/12 logo slots PASS (icon-only genuinely unavailable); palette fetched from logo pixel data.
- [x] Phase 2: onboard `macaristan-rehberi` to `LOGOS_PASS` with 3/12 logo slots PASS (circular only; source kit's brand reads "Barlovics Türkiye"); palette fetched from logo pixel data.
- [x] Phase 2: onboard `folk-saying` to `LOGOS_PASS` with 4/12 logo slots PASS (icon-only + horizontal, black/white only); palette fetched from an opaque reference render in the source kit.
- [x] Phase 2: onboard `scope-turkiye` to `LOGOS_PASS` with 3/12 logo slots PASS (circular only); palette fetched from logo pixel data.
- [x] Relax the 12-slot logo requirement portfolio-wide per explicit user instruction; documented in `docs/CHANNEL-SYSTEM.md`. Retroactively bumped futboscope/turkish-context/dua-mecmuasi/folk-saying from `COLORS_PASS` to `LOGOS_PASS` for consistency.
- [x] Start central typography data collection (`design-system/typography/font-pool.json`) from channel brand kits already documenting or licensing fonts (futboscope, iyilesme-kanali, turkiye-scholarships), per explicit user instruction. Not a TYPOGRAPHY_PASS for any channel -- portfolio-level deferral unchanged.
- yeni-nesil-romanci: stays `PLANNED` for now by explicit user instruction; already holds its registry place.
- [ ] Phase 2: onboard `dunya-burslari` (last remaining `PLANNED` channel with no material yet). Typography stays deferred for every channel until the whole registry reaches `LOGOS_PASS`.
- [x] Integrate the `tip-ogrencileri-platformu` radar implementation (scan pipeline, faculty-source discovery, 77 tests) into its Channel Pack at `channels/tip-ogrencileri-platformu/{radar,scripts,sources,tests,database}/`.
- [ ] Phase 6 (future): if the channel-embedded `tip-ogrencileri-platformu` `radar` engine's logic is reused as part of the shared engine, the target is the Global News Hub in `channel-content-os` (parameterize/port as needed, re-verify all tests) -- not this repo's top-level `radar/`, which is retired per ADR-0003.
- [x] Batch N1 (2026-09-04): lock Global News Hub architecture (ownership, sync model, cross-channel article model) in `channel-content-os`'s `docs/global-news-hub-contract.md`; retire this repo's empty `radar/` scaffold per ADR-0003; persist `kaduse-news` as a USER_APPROVED channel archetype/policy with a `news-sources.json` source-pack placeholder.
- [ ] Kaduse News source pack: select and trust-tier actual sources (deferred to its own batch, per Batch N1).

## Later

Later work is tracked by phase in `ROADMAP.md` and promoted here only when it becomes actionable.
