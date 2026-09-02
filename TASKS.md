# Tasks

## Current

- [x] Phase 2: collect and validate the primary logo for `tip-ogrencileri-platformu`. All 12 logo slots PASS. Channel status advanced to `LOGOS_PASS`.
- [x] Phase 2: create the central Channel Registry (`channels/registry.json`) with all 11 current/planned brands.
- [x] Phase 2: migrate the repository to the portfolio layout (`channels/`, `design-system/`, `apps/dashboard`, `apps/worker`, `radar/`, `data/`), recorded in ADR-0002.
- [x] Phase 2: onboard `kaduse-medikal` to `LOGOS_PASS` (identity, palette, all 12 logo slots) from the user-submitted logo pack and brand bible.
- [x] Phase 2: onboard `iyilesme-kanali` (registry's 12th entry) to `LOGOS_PASS` (identity, palette, all 12 logo slots -- submitted already as clean transparent PNGs) from the user-submitted logo pack and brandkit deck.
- [x] Phase 2: onboard `turkiye-scholarships` to `LOGOS_PASS`, selecting the best-fitting 12 of that project's existing logo assets and using its own existing Instagram-renderer color tokens as the palette (discrepancy vs. the website's separate brand doc noted, not resolved).
- [x] Phase 2: onboard `futboscope` to `COLORS_PASS` (identity, palette) with 7/12 logo slots PASS (5 genuinely unavailable in the source brand kit, not invented). Documented the existing-pipeline/proposed-news-column/shared-layer scope boundary at `channels/futboscope/SCOPE.md`.
- [ ] Futboscope: horizontal lockup + circular white/black logo treatments, if/when designed -- not yet requested.
- [ ] Futboscope: news-column prototype (read-only candidate inbox, no transcript-archive write path) -- proposed only, not yet requested.
- [x] Phase 2: onboard `context-turkish` to `COLORS_PASS` with 9/12 logo slots PASS (3 horizontal slots genuinely unavailable); palette fetched from logo pixel data (no color doc existed). Low-resolution source assets flagged, not blocking.
- [x] Phase 2: onboard `dua-mecmuasi` to `COLORS_PASS` with 9/12 logo slots PASS (icon-only genuinely unavailable); palette fetched from logo pixel data.
- yeni-nesil-romanci: stays `PLANNED` for now by explicit user instruction; already holds its registry place.
- [ ] Phase 2: onboard the remaining 5 `PLANNED` channels one at a time, in registry order. Typography stays deferred for every channel until the whole registry reaches `LOGOS_PASS`.
- [x] Integrate the `tip-ogrencileri-platformu` radar implementation (scan pipeline, faculty-source discovery, 77 tests) into its Channel Pack at `channels/tip-ogrencileri-platformu/{radar,scripts,sources,tests,database}/`.
- [ ] Phase 6 (future): generalize the channel-embedded `radar` engine into the shared top-level `radar/` core (parameterize its config/root, re-verify all tests) so other channels can reuse it, per ADR-0002.

## Later

Later work is tracked by phase in `ROADMAP.md` and promoted here only when it becomes actionable.
