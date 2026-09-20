"""Tests for the 12-source onboarding pass: python-runner split, dated rows, TLS fallback stays fail-closed."""
import json
import unittest
from pathlib import Path
from unittest import mock

from radar.hekimler_continuous_runner import export_automation_ready_profiles
from radar.phase1_ingestion_canary import _os_trust_get, parse_raw_items

FIX = Path(__file__).parent / "fixtures"


class Batch12Tests(unittest.TestCase):
    def test_python_runner_sources_are_not_in_worker_bundle(self):
        all_ids = {p["source_id"] for p in export_automation_ready_profiles()}
        worker_ids = {p["source_id"] for p in export_automation_ready_profiles(worker_only=True)}
        heavy = all_ids - worker_ids
        for sid in ("tihud_internal_medicine", "abroad_ie_medical_council", "abroad_es_mir_fse"):
            self.assertIn(sid, heavy)
        self.assertTrue(worker_ids)

    def test_dated_rows_parser_reads_title_and_date_without_links(self):
        body = (FIX / "pyrows_tihud.html").read_text(encoding="utf-8")
        items = parse_raw_items(source_id="tihud_internal_medicine", source_url="https://www.tihud.org.tr/HaberlerveDuyurular?sayfa=1&menu=1", body=body, fetch_method="list-page", fetched_at="t")
        self.assertTrue(items)
        self.assertTrue(all(i.published_at and i.published_at.startswith("20") for i in items))
        self.assertEqual(len({i.canonical_item_url for i in items}), len(items))

    def test_os_trust_fallback_stays_fail_closed_when_curl_fails(self):
        class P:  # curl exit 60 = certificate verification failed
            returncode = 60
            stdout = b""

        with mock.patch("subprocess.run", return_value=P()):
            self.assertIsNone(_os_trust_get("https://example.invalid/", 5))

    def test_manual_sources_carry_written_evidence(self):
        reg = json.loads((Path(__file__).parents[1] / "content" / "source-registry-abroad-career-v1.json").read_text(encoding="utf-8"))
        by = {s["source_id"]: s for s in reg["sources"]}
        for sid in ("abroad_us_ecfmg_intealth", "abroad_uk_gmc", "abroad_de_make_it_in_germany"):
            self.assertTrue(by[sid].get("manual_intake_reason"), sid)
            self.assertFalse(by[sid].get("fetch_enabled"), sid)

    def test_recency_probe_runs_even_when_no_item_is_eligible(self):
        """Regression: with zero eligible items the newest-date probe must still read detail pages."""
        from radar.config import settings
        from radar.database import Database
        from radar.hekimler_activation import all_sources
        from radar.hekimler_integrity import resolve_effective_registry
        from radar.phase1_ingestion_canary import TransportResult, ingest_one_source

        profile = dict([s for s in all_sources(resolve_effective_registry()) if s["source_id"] == "abroad_us_aamc_eras"][0])
        listing = '<a href="https://www.aamc.org/news/some-long-news-slug-about-something">A long enough news headline text</a>'
        detail = '<script type="application/ld+json">{"datePublished":"2026-09-02T10:00:00Z"}</script>'

        def transport(url):
            return TransportResult(200, detail if "some-long-news-slug" in url else listing, True, url)

        import os
        from unittest import mock

        with mock.patch.dict(os.environ, {"HEKIMLER_CONTINUOUS_INGESTION_ENABLED": "true"}):
            db = Database(settings.db_path)
            db.init()
            res = ingest_one_source(profile, db=db, dry_run=True, transport=transport, force_due=True)
        self.assertEqual(res.newest_record_date, "2026-09-02")

    def test_trovanorme_parser_uses_official_act_metadata(self):
        body = (FIX / "pyrows_trovanorme.html").read_text(encoding="utf-8")
        items = parse_raw_items(source_id="abroad_it_salute_foreign_qual", source_url="https://www.trovanorme.salute.gov.it/norme/archivioNewsletter", body=body, fetch_method="list-page", fetched_at="t")
        self.assertGreater(len(items), 5)
        self.assertTrue(all("dettaglioAtto.spring?id=" in i.canonical_item_url for i in items))
        titles = " | ".join(i.title for i in items)
        self.assertIn("Professioni sanitarie", titles)  # normalized from decree metadata, not "In G.U. ... pubblicato il decreto"
        self.assertFalse(any(i.title.startswith("In G.U.") for i in items))
        self.assertTrue(all(i.published_at and i.published_at.startswith("2026") for i in items))

    def test_italy_gate_rejects_medicinal_products_but_keeps_health_professions(self):
        from radar.hekimler_activation import all_sources
        from radar.hekimler_fetch import classify_with_congress_gate
        from radar.hekimler_integrity import resolve_effective_registry

        p = [s for s in all_sources(resolve_effective_registry()) if s["source_id"] == "abroad_it_salute_foreign_qual"][0]
        bad = classify_with_congress_gate(p, title="Monitoraggio confezioni medicinali", body="Istituzione Banca dati centrale dei medicinali")
        ok = classify_with_congress_gate(p, title="Professioni sanitarie — assegnazione borse di studio", body="specialisti da formare per odontoiatra, medico veterinario")
        self.assertEqual(bad.decision, "DISCARD")
        self.assertEqual(ok.decision, "ACCEPT")


if __name__ == "__main__":
    unittest.main()
