# Futboscope: scope boundaries

This channel spans two things that must not be confused, plus a shared layer this repository provides to every channel. Written 2026-09-01 to keep that boundary explicit going forward.

## 1. Existing, working video pipeline -- outside this repo, do not touch

Futboscope already has a running production system (its own project folder, not this repo): YouTube subscription sync across 86 channels, a three-state content filter (`processable=False` / `processable=True, ses_analizi=False` / fully processed), a per-video transcript archive (`.md` + `segments.jsonl`), speaker-identity resolution (code-first, name only on confirmed evidence, voice-fingerprint matching), a digest/mail system, and a locked caption-writing protocol.

This repository:
- Does **not** reimplement, refactor, or restructure that pipeline.
- Does **not** move or duplicate its transcript archive. If that archive is ever reorganized, its own stated rule applies: files are moved, never deleted and re-fetched.
- Treats its documented rules, thresholds, and hard-won lessons (e.g. title-only filtering, whole-word matching, explicit scan-group allowlists, the three-state content filter) as authoritative and unmodified by anything in this repo.

Nothing here currently reads from or writes to that pipeline. If an integration is built later, it is additive (the pipeline keeps running standalone regardless).

## 2. Proposed: a non-video news column -- NOT YET IMPLEMENTED

Idea, not a built feature: selected football news items that don't need to become a Reel could instead become a single image or carousel through this repo's shared design system (channel colors, logo, layout selection). A news item would not be required to produce a video; items needing video would route to the existing pipeline above instead.

None of the following exists yet:
- A news-candidate intake or scoring mechanism specific to Futboscope.
- Any localhost inbox UI showing candidates with brand name, date, day, and channel colors.
- An `INCOMING -> ACCEPT/DECLINE -> queue -> PUBLISHED` workflow for Futboscope content. `docs/CONTENT-MONITORING.md` describes this state flow as the general system design; it has not been built for any channel yet, Futboscope included.
- Any connection between declining a news candidate and the video pipeline's transcript archive (and none is planned -- declining a news item must never touch or delete transcripts).

Do not read any of the above as implemented. It is scoped here so the eventual build has a clear target, not so it can be assumed done.

## 3. Shared layer this repo actually provides today

What exists right now, for every channel including Futboscope:
- `channels/registry.json` -- the portfolio index.
- `channels/futboscope/channel.json` -- identity (purpose, audience, language).
- `channels/futboscope/brand/colors.json` -- approved palette and contrast-checked roles.
- `channels/futboscope/brand/logo-manifest.json` + `brand/logos/` -- 7 of 12 logo slots PASS (icon-only x3, vertical/stacked-wordmark x3, one circular avatar mark). Horizontal and circular-white/black slots are `PENDING` -- this brand kit genuinely has no horizontal (icon-beside-wordmark) lockup or pre-composed circular badge, so those slots stay open rather than being invented.
- Typography and monitoring sources: deliberately not started for any channel yet (portfolio-level sequencing, see `ROADMAP.md` Phase 2 and `docs/ONBOARDING-ORCHESTRATION.md`).

This is identity and design-asset management. It is not a publishing pipeline, and it does not currently orchestrate any part of Futboscope's video production.

## Smallest safe next step

Do not migrate or rebuild anything. The smallest integration that does not touch the existing pipeline: finish this Channel Pack's own gaps first (a horizontal lockup and circular white/black treatments, if Futboscope wants them designed), then -- only when actually requested -- prototype the news-candidate inbox as a read-only view that lists candidates with channel branding, with no write path into the transcript archive at all in its first version.

**Next concrete action:** none of the above requires a decision right now. Futboscope's Channel Pack is at `COLORS_PASS` with 7/12 logo slots; the next step in the existing onboarding sequence is simply the next `PLANNED` channel in `channels/registry.json`, unless Futboscope's missing logo slots or the news-column prototype are explicitly requested first.
