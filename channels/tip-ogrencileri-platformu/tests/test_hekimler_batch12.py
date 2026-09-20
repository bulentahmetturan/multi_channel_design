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
        for sid in ("abroad_us_ecfmg_intealth", "abroad_uk_gmc", "abroad_uk_oriel", "abroad_de_make_it_in_germany", "abroad_it_salute_foreign_qual"):
            self.assertTrue(by[sid].get("manual_intake_reason"), sid)
            self.assertFalse(by[sid].get("fetch_enabled"), sid)


if __name__ == "__main__":
    unittest.main()
