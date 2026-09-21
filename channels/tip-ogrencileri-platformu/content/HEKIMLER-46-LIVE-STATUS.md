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

## Final acceptance (2026-09-21)
Runs: 35606771585 (sources=all, 45/45 ok, 1 new = real new TVHB item), 35607740649 (sources=all, 45/45 ok, 0 new, no errors); mixed batch 35608569046 (temp branch, 3 ok + 1 controlled failure, workflow red as designed, branch deleted). Scheduled run 35585968893 (09:55 UTC, GitHub delayed) failed only on PubMed HTTP 429 -> fixed with paced/backoff calls.
Deploy: Worker version 1b7f9f90, commit 2e24236 (clean worktree; /api/health reports commit). Per-source rows: legacy-cleanup/final_run_rows_2.json.
Hub acceptance on item_acc_* rows: single hold OK, undo OK, single delete OK, bulk hold OK (2), bulk delete OK (2), counters updated, promote of undated row -> HTTP 422 (after guard fix: promote needs published_at for hekimler channel). Test rows removed (0 remain). Active duplicate canonical URLs 0. D1 active = API = Hub counter = 190.
Distribution (canonical 46): PIPELINE_OK 27, PIPELINE_OK_EMPTY 13, PIPELINE_OK_LIMITED 2, PARTIALLY_COVERED 3, RUNNER_REQUIRED 1, BLOCKED_EXTERNAL 0, FAILED_INTERNAL 0. Strict operational 42. Computed from run 35607740649 rows (eligible=0 -> EMPTY; ttd_thoracic had 0 eligible in that run). 27+13+2+3+1=46.
Extras (outside 46): tvhb_veterinary, tdb_dental operational. Proposal only: denominator 47/48.
