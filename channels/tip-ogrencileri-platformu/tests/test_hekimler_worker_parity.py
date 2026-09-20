"""Python <-> Worker(TypeScript) parity on one shared fixture set (product rules, not echoes)."""
import json
import shutil
import subprocess
import unittest
from datetime import date
from pathlib import Path

from radar.hekimler_activation import all_sources
from radar.hekimler_dates import date_verdict
from radar.hekimler_fetch import classify_with_congress_gate
from radar.hekimler_integrity import resolve_effective_registry

FIX = Path(__file__).resolve().parent / "fixtures" / "hekimler_parity.json"
HUB = Path(__file__).resolve().parents[3].parent / "global-content-os"


def python_decision(profile, case, today):
    d = classify_with_congress_gate(profile, title=case["title"], body="")
    if d.decision == "DISCARD":
        return "DISCARD"
    v, _ = date_verdict(case["source_id"], published_at=case.get("published_at"), title=case["title"], url=case.get("url", ""), today=today)
    return "DISCARD" if v == "STALE" else "ACCEPT"


class WorkerParityTests(unittest.TestCase):
    def test_product_expectations_hold_in_python(self):
        fx = json.loads(FIX.read_text(encoding="utf-8"))
        today = date.fromisoformat(fx["today"])
        eff = {s["source_id"]: s for s in all_sources(resolve_effective_registry())}
        for c in fx["cases"]:
            self.assertEqual(python_decision(eff[c["source_id"]], c, today), c["expect"], c["id"])

    @unittest.skipUnless(shutil.which("node") and (HUB / "node_modules" / "esbuild").exists(), "node/esbuild not available")
    def test_worker_typescript_matches_python(self):
        fx = json.loads(FIX.read_text(encoding="utf-8"))
        today = date.fromisoformat(fx["today"])
        eff = {s["source_id"]: s for s in all_sources(resolve_effective_registry())}
        import os
        import tempfile

        from radar.hekimler_continuous_runner import export_automation_ready_profiles

        with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as fh:
            json.dump({"profiles": export_automation_ready_profiles()}, fh, ensure_ascii=False)
        proc = subprocess.run(
            ["node", "scripts/hekimler-parity.mjs", str(FIX)],
            cwd=HUB, capture_output=True, text=True, encoding="utf-8", timeout=120,
            env={**os.environ, "HEKIMLER_PARITY_PROFILES": fh.name},
        )
        self.assertEqual(proc.returncode, 0, proc.stderr[-800:])
        worker = {r["id"]: r for r in json.loads(proc.stdout.strip().splitlines()[-1])}
        for c in fx["cases"]:
            py = python_decision(eff[c["source_id"]], c, today)
            self.assertEqual(worker[c["id"]]["decision"], py, f"{c['id']}: worker={worker[c['id']]} python={py}")


if __name__ == "__main__":
    unittest.main()


class WorkerParseParityTests(unittest.TestCase):
    """Worker parseHtmlAnchors must agree with Python parse_raw_items on the shared fixtures."""

    @unittest.skipUnless(shutil.which("node") and (HUB / "node_modules" / "esbuild").exists(), "node/esbuild not available")
    def test_worker_parse_matches_python_parse(self):
        from radar.phase1_ingestion_canary import parse_raw_items

        fixtures = FIX.parent
        proc = subprocess.run(
            ["node", "scripts/hekimler-parse-parity.mjs", str(fixtures)],
            cwd=HUB, capture_output=True, text=True, encoding="utf-8", timeout=120,
        )
        self.assertEqual(proc.returncode, 0, proc.stderr[-800:])
        worker = json.loads(proc.stdout.strip().splitlines()[-1])
        self.assertTrue(worker)
        for name, w_items in worker.items():
            body = (fixtures / name).read_text(encoding="utf-8")
            py = parse_raw_items(source_id="x", source_url="https://example.org/list", body=body, fetch_method="list-page", fetched_at="t")
            py_items = [(i.title, i.canonical_item_url, i.published_at) for i in py]
            w_pairs = [(i["title"], i["url"], i["published_at"]) for i in w_items]
            self.assertEqual(w_pairs, py_items, name)


class WorkerListingAllowlistTests(unittest.TestCase):
    """The Worker's own host/path allowlist must accept every ready source's listing URL."""

    @unittest.skipUnless(shutil.which("node") and (HUB / "node_modules" / "esbuild").exists(), "node/esbuild not available")
    def test_every_ready_profile_listing_passes_worker_allowlist(self):
        proc = subprocess.run(
            ["node", "scripts/hekimler-listing-check.mjs"],
            cwd=HUB, capture_output=True, text=True, encoding="utf-8", timeout=120,
        )
        self.assertEqual(proc.returncode, 0, proc.stderr[-800:])
        rows = json.loads(proc.stdout.strip().splitlines()[-1])
        self.assertGreater(len(rows), 8)
        blocked = [(r["source_id"], r["listing"]) for r in rows if not r["allowed"]]
        self.assertEqual(blocked, [])
