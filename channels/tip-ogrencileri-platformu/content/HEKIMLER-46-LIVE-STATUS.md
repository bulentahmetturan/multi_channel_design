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
