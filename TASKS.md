# Tasks

## Current

- [x] Phase 2: collect and validate the primary logo for `tip-ogrencileri-platformu`. All 12 logo slots PASS. Channel status advanced to `LOGOS_PASS`.
- [x] Phase 2: create the central Channel Registry (`channels/registry.json`) with all 11 current/planned brands.
- [x] Phase 2: migrate the repository to the portfolio layout (`channels/`, `design-system/`, `apps/dashboard`, `apps/worker`, `radar/`, `data/`), recorded in ADR-0002.
- [x] Phase 2: onboard `kaduse-medikal` to `LOGOS_PASS` (identity, palette, all 12 logo slots) from the user-submitted logo pack and brand bible.
- [ ] Phase 2: onboard the remaining 9 `PLANNED` channels one at a time, in registry order. Typography stays deferred for every channel until the whole registry reaches `LOGOS_PASS`.
- [x] Integrate the `tip-ogrencileri-platformu` radar implementation (scan pipeline, faculty-source discovery, 77 tests) into its Channel Pack at `channels/tip-ogrencileri-platformu/{radar,scripts,sources,tests,database}/`.
- [ ] Phase 6 (future): generalize the channel-embedded `radar` engine into the shared top-level `radar/` core (parameterize its config/root, re-verify all tests) so other channels can reuse it, per ADR-0002.

## Later

Later work is tracked by phase in `ROADMAP.md` and promoted here only when it becomes actionable.
