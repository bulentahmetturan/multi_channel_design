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

## Kaduse Medikal — KAD-PP-SPHF-01 (2026-09-16, same day as, later than, the visual system reset)

The first FormatSpec under the new architecture is implemented and registered: `KAD-PP-SPHF-01` v1.0.0 ("Single Product Hero Feature" / "Tek Ürün Hero + Özellik"), `kaduse-medikal`/`product-promotion`, one SKU / one dominant product image / one feature block per slide only. Executable source of truth is `channel-content-os`'s `format-spec/formats/kad-pp-sphf-01.ts`; declarative mirror is this repo's `channels/kaduse-medikal/formats/KAD-PP-SPHF-01.json` and `product-catalog/product-families/littmann-classic-iii-56.json`. Full record, including two disclosed real gaps, is `channel-content-os/KAD-PP-SPHF-01.md`:

1. None of the format's custom typefaces (Cyntho Next, Spectral, Zilla Slab, Titillium Web, Saira, Raphiola) are registered as available fonts anywhere in the system yet — a real resolution attempt with the real availability check halts at `FONT_RESOLUTION_FAILED`.
2. Fitting the real, verified SKU 5620 product asset into its declared zone with the format's approved optical-offset exception produces a genuine `PRODUCT_TEXT_COLLISION` against `feature_text` (0.0px clearance) — caught by QA, not worked around, since no aesthetic relocation is authorized without a spec change.

37 new tests (covering all 25 numbered tests the specification required) plus the existing suite: 90 files / 1163 tests, all green in `channel-content-os`. No render was executed, nothing was pushed or deployed — local implementation only, per explicit instruction. Not yet started: font registration, resolving the disclosed collision, Comparison/Detail formats for this same product family.

## Kaduse Medikal — Visual Quality P2 (2026-09-14) — SUPERSEDED by the 2026-09-16 visual system reset

**Superseded (2026-09-16):** after this programme's first real A/B/C calibration render (channel-content-os) still produced structural defects (an unfixable icon/eyebrow collision, among others) and an aesthetically unsatisfactory result, the user authorized a global visual system reset rather than continuing to tune the P2 architecture. `channels/kaduse-medikal/VISUAL-SYSTEM.md`, `brand/feed-grammar.json`, `brand/typography-roles.json`, and `content/visual-directions/*.json` (all referenced below as "done" in this programme) have been **removed**. See `channel-content-os/VISUAL_SYSTEM_RESET.md` for the full rationale, inventory, and the new FORMAT SPEC architecture that replaces this programme's approach. The entries below are kept as historical record of what P2 built, not as current state.

Bounded programme to make the production Kaduse Medikal pipeline (`channel-content-os`) capable of premium, modern, minimal, visually coherent Product Promotion posts, after the most recent A/B/C canonical run was aesthetically rejected by the user in full (the three rejected renders were not patched).

**Production/GitHub drift audit (step 1-2 of the programme):** the production Worker deploys from `channel-content-os`'s `integration/ana-hat` branch, not GitHub `main` (`main` is 48 commits behind and does not reflect production). Best-evidence correlation (deploy timestamps vs. commit timestamps -- wrangler deploys carry no git SHA, no CI/CD exists) places the last known production deploy (`35abbd7d`, 2026-09-13T19:50:11Z) at or immediately after `origin/integration/ana-hat` HEAD (`e14d610`). Tagged locally as `v2-production-baseline` in `channel-content-os` (not pushed). The session's MCP connector to the production Worker returns HTTP 401 -- commits on 2026-09-13 added a Cloudflare Access + `MCP_AUTH_TOKEN` auth gate for a ChatGPT MCP integration, and the configured token does not satisfy it. Live tool calls (rendering, Visual Diagnosis, `get_project_context` writes) are blocked until the user refreshes that connector/token; repo-scoped work proceeded in the meantime per explicit user decision.

**Done, tested, typechecked (channel-content-os, `integration/ana-hat`, uncommitted):**
- Fixed a real safe-zone admission gap: `render.qa.safeZone.allCriticalInside === false` (legacy `qa/safe-zone-map.ts` usable/recommended check) could previously reach `admitted: true` because `evaluateProductionAdmission` never consulted it, only a separate ADVISORY-by-design registry. Now wired through `static-execution.ts` -> `instagram-production-admission.ts` as a real blocking input (`legacySafeZoneFit`), with `recommendedZoneWarnings` surfaced non-blockingly. New tests in `instagram-production-admission.test.ts` and `static-execution.test.ts` reproduce the exact reported bug and prove the fix.
- Fixed a real Visual Diagnosis gap: `creative-qa/visual-critic.ts` always leaves 8 named categories unmeasured (`checksSkipped`) -- including editorial quality, image treatment, motif purpose, and text-image relationship, the exact categories the user reported as skipped -- but `deriveOverallResult` never consulted that list, so a clean-on-paper render could report `PASS` regardless. Added `INCOMPLETE_REVIEW` to `OVERALL_RESULTS` and `REQUIRED_AESTHETIC_REVIEW_CODES`; `deriveOverallResult` now demotes a would-be PASS to `INCOMPLETE_REVIEW` when a required category was skipped (never demotes a real FAIL/UNCERTAIN). Wired into `visual-diagnosis/diagnose.ts`. New tests in `visual-defect-report.test.ts` and `diagnose.test.ts`.
- Full suite: 80 test files / 1101 tests passing, `tsc --noEmit` clean, after both fixes.
- Resolved a real merge conflict from fast-forwarding local `integration/ana-hat` to `origin/integration/ana-hat` (pre-existing uncommitted `huggingface.ts`/`.test.ts` work from a separate session duplicated an already-upstream `probeTokenValidity` implementation almost verbatim -- resolved to the upstream version, confirmed byte-identical to HEAD afterward, no unique content lost).

**Done (multi_channel_design, this repo):**
- Persistent Claude/Codex/GPT Work routing: `AGENTS.md` route to `channels/kaduse-medikal/AGENTS.md`; `docs/INDEX.md` route; `channels/kaduse-medikal/AGENTS.md` (canonical, scoped instructions -- technical PASS != aesthetic approval, no publish without explicit user approval); `channels/kaduse-medikal/CLAUDE.md` (points to the same files, no parallel Claude-only spec).
- `channels/kaduse-medikal/VISUAL-SYSTEM.md`: canonical visual system covering typography roles, product-image treatment, background/frame/footer families, layout/composition principles, brand expression, feed grammar, art-direction route seeds (A/B/C), QA/Visual-Diagnosis separation (`TECHNICAL_QA`/`AESTHETIC_REVIEW`/`USER_AESTHETIC_APPROVAL`), and the §0 negative-evidence record of the rejected renders.
- `channels/kaduse-medikal/brand/typography-roles.json`: 10 typography roles (brand/product family, product model, SKU/variant, hero headline, supporting line, feature/fact, annotation, CTA, footer, rare accent) mapped to Font Pool v5's two real Kaduse combinations, with preferred size/weight ranges (not fixed pixels) and a hard floor for fact text.
- `channels/kaduse-medikal/brand/feed-grammar.json`: rolling-9-post feed rhythm model (surface/frame/footer/accent/typography/crop rotation, neighboring-grid-tile relationship, feed-context-input contract, individual + 3x3 preview requirement).
- Real product-image analysis: `channels/kaduse-medikal/scripts/analyze_product_image.py` (real PIL/numpy/scipy computation -- alpha mask, tight bbox, PCA dominant axis, distance-transform chestpiece candidate, border-flood-fill open-loop/hole detection, suggested crops) run against the two real product cutouts now in `product-catalog/assets/`; output stored as compact retrievable metadata (`*.metadata.json`) per the repo's own "analyze once, retrieve narrowly" rule. New schema `design-system/schemas/src/product-image-geometry.schema.json` + `product-image-geometry.test.mjs` (5 tests, passing) validates both real analyses.
- Pre-existing, unrelated test drift noticed (not fixed, not caused by this work): `design-system/schemas/src/content-policy.test.mjs` test 28-area asserts only 4 canonical archetype ids; `post-archetypes.json` (already uncommitted before this session) has 7. Flagging for whoever picks that file back up.

**Not yet done (blocked on live MCP access, or not yet reached):** rules ingestion into `get_project_context` (real gap confirmed: no MCP tool writes `project_rules`/`decisions` for any channel today), frame/footer as first-class composable modules (today only `backgroundIntent.framed_solid` and a `BOTTOM_INFORMATION_BAND` grammar constraint exist), a channel-content-os-side consumer of the new product-image-geometry metadata, render-level (not just structural-box) visual-language diversity comparison, 3x3 feed preview compositing, and the three new Product Promotion renders themselves (needs live `render_html_to_image`/Visual Diagnosis).

## Blockers

None outside the Kaduse Visual Quality P2 programme above.

## Radar (source monitoring) / Global News Hub

A working, tested source-monitoring implementation for `tip-ogrencileri-platformu` (scan pipeline, faculty-source discovery scripts, official source inventory, 77 passing tests) arrived from a separate session and was integrated at `channels/tip-ogrencileri-platformu/{radar,scripts,sources,tests,database}/`. It remains channel-embedded and untouched.

**2026-09-19 — Hekimler Topluluğu Source Policy Map:** declarative routing policy at `channels/tip-ogrencileri-platformu/content/policies/hekimler-source-policy-map.json` (routes FEED/PROFESSIONAL_BRIEF/OPPORTUNITY/CONGRESS_CALENDAR/ABROAD_CAREER/TREND_INBOX/DISCARD; per-source include/exclude/evidence/transform controls). Schemas + 14 tests in `design-system/schemas/src/hekimler-source-policy-map.*`. Faculty/IG remain opportunity retention, not growth engine. Runtime fetcher not yet wired.

**2026-09-19 — Source Registry Phase 1:** six medically scoped primary profiles in `content/source-registry-phase1.json` (ÖSYM exams, YÖK medical education, YÖKAK medical accreditation, TUK, Resmî Gazete medical regulation, TÜİK health stats) + keyword gate in `radar/hekimler_registry.py` + 16 accept/discard fixture tests green. No Ministry/association/congress/faculty/social/trend sources in this phase.

**2026-09-19 — Phase 1 fetch harden + AA secondary + Registry v1.1:** every Phase 1 primary has a structured `fetch_plan` (`tls_verification_required: true`, source_health, surfaces). `radar/hekimler_fetch.py` fail-closes on TLS failure (DEGRADED), distinguishes NO_CHANGE vs parser DEGRADED, congress discard, route-aware virality. Anadolu Ajansı `anadolu_ajansi_medical_radar` added as `SECONDARY_NEWSWIRE` discovery-only (`NEEDS_REVIEW` / `DISCARD`, never auto-publish; `MANUAL_REVIEW_REQUIRED` pending public RSS/robots). v1.1 approved scope in `source-registry-v1.1.json` (23 primaries + AA; MoH/societies/TTB etc. manual_review). Queue wiring still disabled. **48** Hekimler tests green (`phase1` + `fetch_harden` + `v11`). TLS verification was never disabled on this path.

**2026-09-19 — Research/AI/consumer policy + Opportunity pack + Integrity audit:** `hekimler-research-medical-ai-policy.json` (Kaduse evidence bundle by ID reference, PubMed EVIDENCE_INDEX, Healthline/WebMD/MNT discovery-only); `hekimler-opportunity-pack.json` maps existing `faculty_announcement` inventory without duplication; integrity overlay corrects tiers (8 OFFICIAL_PRIMARY / 3 PROFESSIONAL_BODY / 12 PROFESSIONAL_GUIDANCE / 1 SECONDARY_NEWSWIRE), statement treatments, and `fetch_enabled=false` for all MANUAL_REVIEW sources. No fetcher/queue/publishing added. **80** Hekimler tests green.

**2026-09-19 — Abroad Career Registry v1:** additive `source-registry-abroad-career-v1.json` + `hekimler-abroad-career-policy.json` (US/UK/DE/CA/AU core; IE/NL/ES/IT dossiers; Saudi SCFHS watch-only). Reuses `ecfmg_*` / `gmc_plab` / `mcc_mccqe` / `germany_approbation` via `upstream_source_id`. Spain MIR left inactive pending sanidad URL verification; other Gulf regulators not invented. Merge order now phase1 → v1.1 → abroad. Effective tiers: OFFICIAL_PRIMARY 27 (8+19), PROFESSIONAL_BODY 3, PROFESSIONAL_GUIDANCE 12, SECONDARY_NEWSWIRE 1. **94** Hekimler tests green. Still registry-only.

**2026-09-19 — Trusted Trend + Question Demand policy:** `hekimler-trusted-trend-question-demand-policy.json` separates `TREND_CANDIDATE` (trusted sources + independent primary_url only) from `QUESTION_BRIEF` / Question Demand Signals (Reddit, forums, search trends, social, consumer media). Evidence File / Brief / Answer Card require primary evidence; AI must not invent answers from demand. Source policy map `trend-radar` aligned. **107** Hekimler unit tests + 14 policy-map schema tests green.

**2026-09-19 — Phase 1 Ingestion Canary:** `radar/phase1_ingestion_canary.py` wires the six Phase 1 official profiles into the existing tip-radar SQLite candidate/review queue (`status=review` only). Feature flag `HEKIMLER_PHASE1_INGESTION_ENABLED` defaults false; dry-run by default; TLS fail-closed; medical gates; dedupe via `UNIQUE(source_id, content_hash)`; run log in `hekimler_ingestion_runs`. No production schedule, no auto-publish, no AA/professional/abroad/trend/congress. **123** Hekimler-related unit tests green.

**2026-09-19 — Phase 1 Live Canary & Runtime Audit:** runtime/storage audit concluded **BLOCKED_BY_RUNTIME_ALIGNMENT** before any live HTTP. tip-radar SQLite is local channel-pack DB only (not confirmed as deployed Candidate/Review store / Hub inbox); `channelId` / `editorialBrand` live in `raw_analysis` JSON — queryable family partition is `category='hekimler_phase1'` only; no Hub worker invokes the canary against a shared persistent store. Safety regressions added (`--force`/`--force-due` never bypass feature flag, TLS, host/path allowlist, medical gate, or MANUAL_REVIEW exclusion; dry-run persists nothing; `--commit` never approves/publishes). Live dry-runs intentionally not executed. **132** Hekimler-related unit tests green.

**2026-09-19 — Hekimler Hub Ingestion Bridge v1:** resolves runtime-alignment blocker. Canonical Candidate/Review destination is Global Content OS Hub (`POST /api/ingress/tip`). Hub migration `0009_hekimler_channel_partition.sql` adds queryable `editorial_brand`, `content_family`, `source_id`, `decision_route`, `intake_meta_json` (+ indexes); seeds `hekimler-phase1-canary` feed with `channel_id=hekimler-toplulugu`. Bridge module `radar/hekimler_hub_bridge.py`; canary commit mode targets Hub (refuses silent local SQLite as SoT). Idempotency `hekimler:{channel_id}:{source_id}:{content_hash}`. Live-eligible later: five Phase 1 sources; TÜİK remains MANUAL_REVIEW blocked. No live fetch, no scheduler, no publish. **144** Hekimler-related unit tests green.

**2026-09-19 — Hekimler Continuous Ingestion Fast Activation v1:** one registry-driven runner (`hekimler_activation` + `hekimler_continuous_runner` + Worker `hekimler-continuous.ts`). Activation states AUTOMATION_READY / MANUAL_INTAKE / BLOCKED. Five Phase 1 sources AUTOMATION_READY with per-source intervals (360–1440m). Worker due-check every 15 minutes (`scheduled()` + `HEKIMLER_CONTINUOUS_INGESTION_ENABLED`). Hub migrations 0009+0010 applied local+remote. Live dry-run: ÖSYM 29 / TUK 12 accepted (review-only); YÖK/YÖKAK/RG discarded-by-policy on listing noise (HEALTHY). Publishing remains disabled. **154** Hekimler-related unit tests green.
**2026-09-20 — Hekimler Audience Scope Gate + Batch 2/3 additions:** strict audience-only gate (physicians/dentists/vets, students, abroad pathways; KPSS-type items discarded), health-system indirect layer for official sources, nav-noise gates, +5 live sources (AUTOMATION_READY 18→23), Hub "Hekimler" view coded. Production deploy blocked by permission classifier (pending). Open problems and undefined decisions are tracked in `channels/tip-ogrencileri-platformu/content/PIPELINE-ISSUES.md`; to be solved one by one.

**2026-09-19 — Hekimler Live Flow Hardening + Batch 2 Activation v1:** Production cron was silently aborting before Hekimler (missing `runEnrichmentBatch` import). After fix: first completed Hub runs wrote telemetry + **28** review inbox candidates (ÖSYM 21, TUK 7). YÖK/YÖKAK/RG: HEALTHY transport, zero accepts (coverage streak started). Per-source `initial_backfill`, coverage health (`LOW_COVERAGE` after 3 zero-accept successes), ingress fail-closed auth + D1 run locks (`0011`). Batch 2: MoH/HSGM/PubMed all **MANUAL_INTAKE** (PubMed pack ready but Worker eutilities DEGRADED). Publishing/approve/render still disabled.

**2026-09-19 — Hekimler MANUAL pass 2:** From remaining MANUAL, activated 6 after dry-run HEALTHY: `hasuder_public_health` (11/106 via `/listele/duyurular-hasuder-cat`), `turk_pediatri_kurumu` (13/308), `abroad_us_usmle` announcements (69/154), `abroad_us_nrmp` news (46/109), `abroad_ca_carms` news (13/60), `abroad_ca_mcc_img_pathways` news (23/100). Abroad loader now allows per-source AUTOMATION_READY while registry-level `pipeline_wiring_enabled` stays false and `publication_eligible` stays false. Kept MANUAL with reasons: TATD JS-only, AA RSS-not-wired, ECFMG/GMC Cloudflare 403, TEPDAD/TEGED/TPD/TÜİK/…. Live **18** AUTOMATION_READY / **26** MANUAL.

**2026-09-19 — Hekimler domestic MANUAL pass:** From 37 MANUAL, activated 5 with verified list indexes + dry-run HEALTHY: `turkmsic_medical_students` (2/61), `ttb_national` (5/72), `hsgm_public_health` basin-odası (5/79), `klimık_infectious_diseases` (3/82), `trd_radiology` (5/71). `tpd_psychiatry` stays MANUAL (haber-duyuru emits 3000+ anchors). Abroad `not_wired`, TÜİK SPA, HASUDER 500, TEPDAD/TEGED/TKD/TTD/… keep written MANUAL reasons. Live AUTOMATION_READY **12**. Publishing still off.

**2026-09-19 — Hekimler Batch 2 Source Surface Activation:** Pass-and-activate. `moh_physician_workforce` → YHGM exact kura/atama list indexes (not `www.saglik.gov.tr` homepage) **AUTOMATION_READY** (720m). `pubmed_biomedical_evidence` → hardened E-utilities (tool/email/timeout/retry, PMID required) **AUTOMATION_READY** (1440m). `hsgm_public_health` remains **MANUAL_INTAKE** (duyuru/haber 404; homepage forbidden). Live dry-run: MoH items 187/acc 98 HEALTHY; PubMed items 18/acc 12 HEALTHY. Phase1 five stay live. Worker deployed `9205e2cf`. Publishing disabled.

**2026-09-18 — curated tip-student club Instagram shortlist:** 24 IG-primary sources now in `official_sources.yaml` (22 new `ig_*` + retargeted `antbat_ankara` + existing `ivsa_ankara`), mirrored in `global-content-os/config/feeds.json` with `meta.curatedClubIg`. Scope: TurkMSIC / TOB / *BAT / IVSA (+ a few faculty tip specialty clubs with page-cited handles). Not yet ingesting posts — HTML login-wall; needs Instagram Graph / social adapter.

**Superseded (ADR-0003, 2026-09-04):** the shared, channel-agnostic engine this implementation was meant to eventually generalize into is no longer a top-level `radar/` directory in this repo -- it is the **Global News Hub**, owned by the sibling `channel-content-os` repo (contract: that repo's `docs/global-news-hub-contract.md`). This repo's empty `radar/` scaffold has been retired. `kaduse-medikal` is the first channel with a news archetype/policy persisted against this model: `channels/kaduse-medikal/content/policies/kaduse-news.json`, with an empty `channels/kaduse-medikal/content/news-sources.json` source-pack placeholder (actual source selection deferred to its own batch).

## Last updated

2026-09-19 (Hekimler MANUAL pass 2; AUTOMATION_READY=18)

2026-09-19 (Hekimler domestic MANUAL pass; AUTOMATION_READY=12)

2026-09-19 (Hekimler Batch 2 Source Surface Activation; MoH+PubMed live, HSGM MANUAL)

2026-09-19 (Hekimler Live Flow Pre-Expansion Hardening)

2026-09-19 (Hekimler Live Flow Hardening + Batch 2; production Hub candidates)

2026-09-19 (Hekimler Continuous Fast Activation v1; 154 tests)

2026-09-19 (Hekimler Hub Ingestion Bridge v1; 144 tests)

2026-09-19 (Phase 1 Live Canary & Runtime Audit → BLOCKED_BY_RUNTIME_ALIGNMENT; 132 tests)

2026-09-19 (Phase 1 Ingestion Canary; 123 tests)

2026-09-19 (Trusted Trend + Question Demand policy; 107+14 tests)

2026-09-19 (Hekimler Abroad Career Registry v1; 94 tests)

2026-09-19 (Hekimler research/AI/opportunity policies + integrity audit; 80 tests)

2026-09-19 (Hekimler Phase1 fetch harden + AA secondary + Registry v1.1; 48 tests)

2026-09-19 (Hekimler Source Registry Phase 1 + Source Policy Map schemas/tests)

2026-09-18 (tip-ogrencileri-platformu: curated club IG shortlist added to sources + Hub feeds; social adapter still pending)

2026-09-02 (10 of 12 registry channels onboarded to LOGOS_PASS + COLORS_PASS; 12-slot logo requirement relaxed per explicit user instruction; central font-pool data collection started; `.claude/instructions.txt` decision guide added -- commit/pull pre-authorized, push requires confirmation)
**2026-09-20 (later) — Hekimler pipeline pass:** 35 sources AUTOMATION_READY (27 LOCAL_VERIFIED with real candidates, 8 verified-empty), 12 manual with written evidence (ECFMG/GMC 403 = MANUAL_BLOCKED; TÜİK JS shell; TLS chain failures in Python only). AA RSS frozen at 2026-04-26 → official news sitemap used (RSS_STALE_FALLBACK). Worker mirrors gates (parity tests). Hub "Hekimler" view verified in browser locally. Live deploy + smoke pending. Table: `channels/tip-ogrencileri-platformu/content/PIPELINE-STATUS-46.md`.
