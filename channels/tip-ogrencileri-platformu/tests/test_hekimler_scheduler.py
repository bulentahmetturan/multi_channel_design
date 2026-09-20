"""Scheduler script: source selection, report rendering, failure isolation."""
import sys
import unittest
from pathlib import Path
from unittest import mock

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import hekimler_scheduled_run as sched  # noqa: E402


class SchedulerTests(unittest.TestCase):
    def test_all_python_selects_only_python_runner_sources(self):
        ids = sched.select_sources("all-python")
        self.assertIn("abroad_ie_medical_council", ids)
        self.assertIn("moh_physician_workforce", ids)  # every ready source now runs through the Python path
        self.assertIn("abroad_uk_gmc", ids)  # official gov.uk feed substitute (partial)
        self.assertNotIn("hsgm_public_health", ids)  # runner_region=TR: needs a Türkiye-based runner
        self.assertIn("tdb_dental", ids)

    def test_explicit_selection_ignores_unknown_and_manual_sources(self):
        ids = sched.select_sources("abroad_us_ecfmg_intealth,abroad_uk_oriel,nope")
        self.assertEqual(ids, ["abroad_uk_oriel"])

    def test_tr_runner_selection(self):
        self.assertEqual(sched.select_sources("tr-runner"), ["hsgm_public_health"])
        self.assertNotIn("hsgm_public_health", sched.select_sources("all"))

    def test_one_failing_source_does_not_stop_the_batch_and_is_reported(self):
        def fake_once(sid, timeout, dry_run):
            if sid == "bad":
                return None, "source timeout after 5s"
            return {"results": [{"operator_status": "candidates_emitted", "fetch_result": "ok", "item_count": 3, "accepted_count": 1,
                                 "duplicate_count": 0, "hub_delivery_failures": 0}], "seconds": 1}, ""

        with mock.patch.object(sched, "run_once", side_effect=fake_once), mock.patch.object(sched.time, "sleep"):
            good = sched.run_source("good", 5, 1, True)
            bad = sched.run_source("bad", 5, 1, True)
        self.assertTrue(good["ok"])
        self.assertFalse(bad["ok"])
        self.assertEqual(bad["attempts"], 2)  # bounded retry on transient timeout
        md = sched.markdown([good, bad])
        self.assertIn("`good`", md)
        self.assertIn("NO", md)

    def test_report_never_contains_the_token(self):
        with mock.patch.dict("os.environ", {"TIP_RADAR_INGEST_TOKEN": "s3cr3t-token-value"}):
            row = {"source_id": "x", "operator_status": "ok", "ok": True, "error": ""}
            self.assertNotIn("s3cr3t-token-value", sched.markdown([row]))


if __name__ == "__main__":
    unittest.main()
