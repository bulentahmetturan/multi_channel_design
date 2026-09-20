# tip-ogrencileri-platformu / content

Editorial brand for this channel's news/content policy: **Hekimler Topluluğu**.

## Source Policy Map

- [`policies/hekimler-source-policy-map.json`](policies/hekimler-source-policy-map.json) — declarative per-source routing (broader map)
- Schema: `design-system/schemas/src/hekimler-source-policy-map.schema.json`
- Candidate decision record: `design-system/schemas/src/hekimler-candidate-decision.schema.json`

## Registry layering (load order)

1. **Base:** [`source-registry-phase1.json`](source-registry-phase1.json) — six hardened official profiles + AA secondary (`fetch_plan`, TLS required).
2. **Overlay:** [`source-registry-v1.1.json`](source-registry-v1.1.json) — additive MoH / professional / specialty scope; authoritative `source_tier` + `statement_treatment`.
3. **Abroad Career (additive):** [`source-registry-abroad-career-v1.json`](source-registry-abroad-career-v1.json) — `abroad_*` official pathway sources only; never overrides phase1/v1.1.
4. **Batch 2 (additive):** [`source-registry-batch2.json`](source-registry-batch2.json) — PubMed pack + domestic pass review notes (TurkMSIC/TTB/HSGM/Klimik/TRD READY; TPD MANUAL).
5. **Resolve:** `radar/hekimler_integrity.py` → one effective profile per `source_id`.

Continuous Fast Activation runs for AUTOMATION_READY sources only; publication/approve/render remain **off**.

### Tier counts (effective, after Abroad Career v1)

| Tier | Count |
|---|---|
| OFFICIAL_PRIMARY | 27 (8 domestic + 19 abroad) |
| PROFESSIONAL_BODY | 3 |
| PROFESSIONAL_GUIDANCE | 12 |
| SECONDARY_NEWSWIRE (AA) | 1 |

Do not call all domestic scoped sources “primaries.” Domestic OFFICIAL_PRIMARY remains 8.

## Phase 1 Ingestion Canary / Continuous Fast Activation v1

- Continuous runner: `radar/hekimler_continuous_runner.py` + Worker `hekimler-continuous.ts`
- Activation: `radar/hekimler_activation.py` → `AUTOMATION_READY` | `MANUAL_INTAKE` | `BLOCKED`
- Hub bridge: `radar/hekimler_hub_bridge.py` → Global Content OS Hub
- Canonical store: Hub `source_items` (`channel_id=hekimler-toplulugu`, `editorial_brand=Hekimler Topluluğu`, `content_family=hekimler_phase1`)
- CLI: `python -m radar hekimler-continuous [--force-due] [--commit] [--activation-report] [--sync-worker-profiles]`
- Flags: `HEKIMLER_CONTINUOUS_INGESTION_ENABLED` (Worker + runner); Phase 1 canary flag still supported
- Live AUTOMATION_READY (**18**): phase1 five + MoH + PubMed + HSGM + TurkMSIC + TTB + Klimik + TRD + HASUDER + Pediatri + USMLE + NRMP + CaRMS + MCC news
- Still MANUAL (26): TPD flood, TÜİK SPA, TATD JS-only, AA RSS-not-wired, ECFMG/GMC Cloudflare, most other abroad dossiers
- Review only — `publication_eligible=false`

### Canonical Hekimler test command

```bash
cd channels/tip-ogrencileri-platformu
python scripts/run_hekimler_tests.py
```

Runs `test_hekimler*.py` **and** `test_phase1_ingestion_canary.py`.  
**154 vs 148:** Continuous Fast Activation’s “154 Hekimler-related” counted hekimler modules + phase1 canary. A later report’s “148” ran only `test_hekimler*.py` (selection gap — no tests removed). Current canonical count is printed by the script above.

## Abroad Career

- Registry: [`source-registry-abroad-career-v1.json`](source-registry-abroad-career-v1.json)
- Policy: [`policies/hekimler-abroad-career-policy.json`](policies/hekimler-abroad-career-policy.json)
- Module: `radar/hekimler_abroad_career.py`
- Coverage: CORE (US/UK/DE/CA/AU), OFFICIAL dossier (IE/NL/ES/IT), WATCH_ONLY (Saudi + Gulf policy class)
- Objects: `OFFICIAL_PATHWAY_DOSSIER` | `OFFICIAL_CHANGE` | `OFFICIAL_OPPORTUNITY`
- Routes: `ABROAD_CAREER` | `ABROAD_OPPORTUNITY_WATCH` | `ABROAD_WATCH_ONLY` | `NEEDS_REVIEW` | `DISCARD`
- Reuses upstream inventory IDs where present (`ecfmg_announcements`, `gmc_plab`, `mcc_mccqe`, `germany_approbation`) via `upstream_source_id` — no row copy
- Spain FSE/MIR left **inactive** pending verified `sanidad.gob.es` URLs; other Gulf regulators not invented

## Trusted Trend + Question Demand

- Policy: [`policies/hekimler-trusted-trend-question-demand-policy.json`](policies/hekimler-trusted-trend-question-demand-policy.json)
- Module: `radar/hekimler_trend_demand_policy.py`
- **Trusted Trend Radar:** only pre-approved official / scientific / professional / high-quality editorial sources may create a `TREND_CANDIDATE` (still requires independent `primary_url`; never auto-publish)
- **Question Demand Radar:** Reddit, forums, Turkish search trends, social comments, DMs, popular health media → `QUESTION_BRIEF` only; never prove truth or create a Trend Candidate
- **Outputs:** `VERIFIED_ANSWER_CARD` | `EVIDENCE_BRIEF` | `EVIDENCE_FILE` only after independent primary evidence; otherwise discard or keep as question brief
- Source policy map `trend-radar` class points at this policy

## Research / Medical AI / Consumer media

- Policy: [`policies/hekimler-research-medical-ai-policy.json`](policies/hekimler-research-medical-ai-policy.json)
- Bundle: `kaduse_research_evidence_bundle` — **references** Kaduse/`channel-content-os` research IDs (no row copy)
- PubMed profile: `pubmed_biomedical_evidence` (`EVIDENCE_INDEX`, not wired)
- Discovery-only: Healthline, WebMD, Medical News Today → demand/discovery only (not Trend Candidates alone)
- Module: `radar/hekimler_research_policy.py`

## Opportunity pack (faculty + curator)

- Mapping: [`policies/hekimler-opportunity-pack.json`](policies/hekimler-opportunity-pack.json)
- References `sources/official_sources.yaml` (`category: faculty_announcement`) — does **not** recreate the faculty list
- Module: `radar/hekimler_opportunity_pack.py`
- Congress signals → `handoff_target: CONGRESS_REGISTRY` (registry not implemented; not published here)

## Tests

```text
python -m unittest tests.test_hekimler_registry_phase1 tests.test_hekimler_fetch_harden tests.test_hekimler_registry_v11 tests.test_hekimler_integrity_audit tests.test_hekimler_research_policy tests.test_hekimler_opportunity_pack tests.test_hekimler_abroad_career tests.test_hekimler_trend_demand_policy tests.test_phase1_ingestion_canary tests.test_hekimler_hub_bridge tests.test_hekimler_continuous
```

AI may classify/extract/summarize and normalize demand questions; AI must not invent dates, eligibility, legal effect, causal claims, or answers from demand signals alone.
