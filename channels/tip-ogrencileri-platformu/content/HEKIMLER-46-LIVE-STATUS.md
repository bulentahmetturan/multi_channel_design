# Hekimler 46-source live status (checkpoint)

Updated: 2026-09-20 (phase: all-sources run #1 dispatched)
Commits: multi_channel_design fcb933a; global-content-os a832b94. Worker deploy a4723b94-eea1-4d4c-b3b4-04c0a5867b9f (bundle: 0 Worker profiles, 44 python_runner ids).
Runs: 35532846118 (network diagnosis), 35533614475 (sources=all, run 1).

Completed: scheduler workflow live; all 44 ready sources on python_runner; D1 pass3 cleanup (17 rows REJECTED_LEGACY, reversible, undo SQL kept); zero duplicate canonical URLs in active hekimler rows.
Unresolved: HSGM (BLOCKED_EXTERNAL: TCP blackhole from GitHub/Cloudflare egress; needs Türkiye-based runner); ECFMG/GMC/Make it in Germany (manual, externally blocked); TDB not implemented; parity fixture set; TLS pin regression test; mixed-batch failure-isolation run; Hub view checks.
Next: read run 35533614475, dispatch run 2, verify zero new rows.
NOT claiming 46/46.

## Update (phase: full runs 1-2 + retry)
Runs: 35533614475 (all, 40/44 ok, tvhb +6 new), 35534274274 (all, 41/44 ok, 0 new rows), 35535057385 (retry after TLS pins: resmi_gazete, ttb, pubmed, tvhb all ok, 0 new).
Fixes: host-scoped pinned intermediates (GeoTrust G1 -> resmigazete.gov.tr, Sectigo DV R36 -> ttb.org.tr, FNMT -> universidades.gob.es) + tests/test_hekimler_tls_pins.py; 429 treated as transient.
Result: 43/44 python_runner sources operational (incl. TVHB as extra); HSGM BLOCKED_EXTERNAL. ECFMG/GMC/Make it in Germany remain manual/blocked. TDB not implemented.
Not done: systematic parity fixture set, mixed-batch failure-isolation run, Hub UI verification, per-source empty/limited classification table, pip pin.
Test suite: 1 pre-existing failure (test_hekimler_opportunity_pack, depends on unrelated club-source yaml rewrite in working tree).

## Final (2026-09-21)
Runs: 35537808504 and 35538245330 (sources=all, 45 sources, 45/45 ok, 0 new rows in both), 35537104072/35537339342 (TDB/GMC, mixed-batch on temp branch, branch deleted), 35537648610 (tests workflow green incl. TLS pins).
Totals (canonical 46): PIPELINE_OK 27, EMPTY 13, LIMITED 2 (es_universidades, pubmed), PARTIALLY_COVERED 3 (gmc, ecfmg, make-it-in-germany), BLOCKED_EXTERNAL_RUNNER_REQUIRED 1 (hsgm), FAILED 0, NOT_RUN 0.
Extras: tvhb_veterinary and tdb_dental operational (separate from the 46). Coverage matrices: HEKIMLER-COVERAGE-MATRIX.md. Per-source rows: legacy-cleanup/final_run_rows.json; D1 telemetry: legacy-cleanup/telemetry_snapshot_2026-09-21.json.
Worker: de55d676 then d149b0ad (Hub labels). D1 active duplicate canonical URLs: 0.
