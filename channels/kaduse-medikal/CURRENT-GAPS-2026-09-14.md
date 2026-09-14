# Kaduse Visual Quality P2 — Dated Gap Appendix

**Snapshot date:** 2026-09-14  
**Status:** implementation evidence only; not permanent visual truth.  
**Authority:** `VISUAL-SYSTEM.md` and the latest explicit user decision supersede this snapshot.

## Confirmed negative evidence

The previously admitted Product Promotion A/B/C set was aesthetically rejected in full. Shared observations: pasted-PNG feeling; disconnected product and typography; empty or weakly split surfaces; facts appended after composition; fragmented logo/CTA/footer behaviour; weak balance; small fact text; weak brand character; and three corporate-template variations rather than three visual languages. Do not patch those renders; preserve them as negative evidence.

## Runtime gaps observed in this snapshot

- Production `get_project_context("kaduse-medikal")` returned an intact project profile but empty `current_rules` and `current_decisions`.
- Repository-side rule, decision, and calibration ingestion is under active local development and is not production evidence.
- Safe-zone fail-closed handling and `INCOMPLETE_REVIEW` are implemented in local uncommitted runtime work but are not yet a deployed-production claim.
- The deterministic visual critic still skips actual-pixel editorial quality, image treatment, motif purpose, and text–image relationship; those omissions correctly require `INCOMPLETE_REVIEW`.
- Product alpha-mask metadata exists for two cutouts. Both currently report empty automatic `openLoopRegions`; a controlled geometry-assisted fallback from the real mask remains necessary for Sculptural Loop.
- Frame/footer schemas and emitter support are under active local development. The canonical Product Promotion pilot does not yet exercise the approved Precision Instrument, Clinical Editorial, and Sculptural Loop topologies.
- No runtime feed-context consumer or final 3x3 preview compositor was observed.
- Final fonts have verified local asset metadata, but D1 registration and production deployment remain false in the runtime manifest.

## Historical defects already targeted locally

- A render with `allCriticalInside: false` could previously be admitted.
- A visual diagnosis could report PASS while required aesthetic categories were skipped.

These are implementation defects, not visual-system rules. Their final status must be re-established from the stable working tree after the active implementation stops changing.
