"""Scheduled Hekimler Python source runner (GitHub Actions entry point).

* one subprocess per source (hard per-source timeout, failure isolation);
* bounded retry with exponential backoff for transient fetch/network failures only;
* writes a non-secret JSON + Markdown report and appends the table to the GitHub job summary;
* exit code is 1 when ANY source failed (partial failure turns the workflow red; the report/summary/artifact are
  written first, and upload steps run with if: always()); 2 when the ingest token is missing.

Usage:
  python scripts/hekimler_scheduled_run.py --sources all-python|all|tr-runner|id1,id2 [--timeout 240] [--retries 2]
                                            [--report-dir report] [--dry-run]
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

QUOTA_MARKERS = ("d1_quota_exceeded", "row write limit", "free tier daily")


def is_quota_error(text: object) -> bool:
    t = str(text or "").lower()
    return any(m in t for m in QUOTA_MARKERS)


TRANSIENT_MARKERS = ("timed out", "timeout", "temporarily", "connection", "reset", "502", "503", "504", "429", "degraded")


def select_sources(spec: str) -> list[str]:
    os.environ.setdefault("HEKIMLER_CONTINUOUS_INGESTION_ENABLED", "true")
    from radar.hekimler_activation import ACTIVATION_AUTOMATION_READY, all_sources, compute_activation_state
    from radar.hekimler_integrity import resolve_effective_registry

    ready = [
        s for s in all_sources(resolve_effective_registry())
        if compute_activation_state(s) == ACTIVATION_AUTOMATION_READY
    ]
    # Sources tagged runner_region=TR only work from a Turkish network; the GitHub-hosted runner skips them and an
    # operator-run job selects them with --sources tr-runner (same adapter, same authenticated ingest contract).
    hosted = [s for s in ready if not s.get("runner_region")]
    if spec == "all":
        return [s["source_id"] for s in hosted]
    if spec == "all-python":
        return [s["source_id"] for s in hosted if s.get("execution") == "python_runner"]
    if spec == "tr-runner":
        return [s["source_id"] for s in ready if s.get("runner_region") == "TR"]
    wanted = [x.strip() for x in spec.split(",") if x.strip()]
    known = {s["source_id"] for s in ready}
    unknown = [w for w in wanted if w not in known]
    if unknown:
        print(f"::warning::not AUTOMATION_READY / unknown: {', '.join(unknown)}")
    return [w for w in wanted if w in known]


def run_once(source_id: str, timeout: int, dry_run: bool) -> tuple[dict | None, str]:
    cmd = [sys.executable, str(ROOT / "scripts" / "hekimler_run_one.py"), source_id]
    if dry_run:
        cmd.append("--dry-run")
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout, cwd=str(ROOT))
    except subprocess.TimeoutExpired:
        return None, f"source timeout after {timeout}s"
    text = (proc.stdout or "") + "\n" + (proc.stderr or "")
    for line in (proc.stdout or "").splitlines():
        if line.startswith("RESULT_JSON "):
            return json.loads(line[len("RESULT_JSON "):]), ""
    tail = " | ".join(x for x in text.strip().splitlines()[-4:])[:400]
    return None, f"exit {proc.returncode}: {tail}"


def run_source(source_id: str, timeout: int, retries: int, dry_run: bool) -> dict:
    attempts = 0
    last_err = ""
    row: dict = {"source_id": source_id}
    while attempts <= retries:
        attempts += 1
        data, err = run_once(source_id, timeout, dry_run)
        if data and data.get("results"):
            r = data["results"][0]
            row.update(
                operator_status=r.get("operator_status"),
                fetch_result=r.get("fetch_result"),
                parsed=r.get("item_count", 0),
                rejected_date=r.get("rejected_date", 0),
                rejected_audience=r.get("rejected_audience", 0),
                rejected_keyword=r.get("rejected_keyword", 0),
                rejected_shape=r.get("rejected_shape", 0),
                eligible=r.get("accepted_count", 0) + r.get("duplicate_count", 0),
                new_rows=r.get("accepted_count", 0),
                duplicates=r.get("duplicate_count", 0),
                hub_failures=r.get("hub_delivery_failures", 0),
                newest_record_date=r.get("newest_record_date"),
                error=r.get("error_reason"),
                seconds=data.get("seconds"),
            )
            transient = row["fetch_result"] not in ("ok", "no_change") and any(
                m in str(row.get("error") or row.get("operator_status") or "").lower() for m in TRANSIENT_MARKERS
            )
            if not transient and not row["hub_failures"]:
                break
            last_err = str(row.get("error") or row.get("operator_status"))
            if is_quota_error(last_err):
                # Retrying only burns more of the exhausted quota; surface it and stop retrying this source.
                row["d1_quota"] = True
                row["error"] = "D1_QUOTA_EXCEEDED: " + str(last_err)[:200]
                break
        else:
            last_err = err
            row.update(operator_status="run_failed", error=err)
            if not any(m in err.lower() for m in TRANSIENT_MARKERS) and "exit" not in err.lower():
                break
        if attempts <= retries:
            time.sleep(min(60, 5 * 2 ** (attempts - 1)))
    row["attempts"] = attempts
    row["ok"] = bool(row.get("fetch_result") in ("ok", "no_change") and not row.get("hub_failures"))
    if not row["ok"] and not row.get("error"):
        row["error"] = last_err
    return row


def markdown(rows: list[dict]) -> str:
    head = (
        "| Source | Status | Parsed | Date rej. | Audience rej. | Keyword rej. | Shape rej. | Eligible | New rows | Dup | Newest record | OK | Note |\n"
        "|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|---|\n"
    )
    body = ""
    for r in rows:
        body += (
            f"| `{r['source_id']}` | {r.get('operator_status')} | {r.get('parsed', 0)} | {r.get('rejected_date', 0)} | "
            f"{r.get('rejected_audience', 0)} | {r.get('rejected_keyword', 0)} | {r.get('rejected_shape', 0)} | "
            f"{r.get('eligible', 0)} | {r.get('new_rows', 0)} | {r.get('duplicates', 0)} | {r.get('newest_record_date') or ''} | "
            f"{'yes' if r.get('ok') else 'NO'} | {str(r.get('error') or '')[:90].replace('|', '/')} |\n"
        )
    return head + body


def quota_banner(rows: list[dict]) -> str:
    hit = [r["source_id"] for r in rows if r.get("d1_quota")]
    if not hit:
        return ""
    return (
        "> **D1 DAILY WRITE QUOTA EXCEEDED** - Cloudflare D1 (Free plan) rejected writes. "
        f"Affected sources: {', '.join(hit)}. Nothing was ingested for them; ingestion resumes after 00:00 UTC "
        "or on a paid plan. This run is intentionally red.\n\n"
    )


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--sources", default="all-python")
    ap.add_argument("--timeout", type=int, default=240)
    ap.add_argument("--retries", type=int, default=2)
    ap.add_argument("--report-dir", default="report")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    sources = select_sources(args.sources)
    if not sources:
        print("no sources selected")
        return 0
    if not args.dry_run and not os.environ.get("TIP_RADAR_INGEST_TOKEN"):
        print("::error::TIP_RADAR_INGEST_TOKEN is not set")
        return 2

    rows = []
    for sid in sources:
        print(f"::group::{sid}")
        row = run_source(sid, args.timeout, args.retries, args.dry_run)
        rows.append(row)
        print(f"{sid}: {row.get('operator_status')} parsed={row.get('parsed', 0)} eligible={row.get('eligible', 0)} "
              f"new={row.get('new_rows', 0)} dup={row.get('duplicates', 0)} ok={row['ok']} attempts={row['attempts']}")
        print("::endgroup::")

    out = Path(args.report_dir)
    out.mkdir(parents=True, exist_ok=True)
    stamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    (out / "run-report.json").write_text(json.dumps({"generated_at": stamp, "dry_run": args.dry_run, "rows": rows}, ensure_ascii=False, indent=2), encoding="utf-8")
    md = f"## Hekimler Python runner — {stamp}\n\n" + quota_banner(rows) + markdown(rows)
    (out / "run-report.md").write_text(md, encoding="utf-8")
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as fh:
            fh.write(md)
    print(md)
    failed = [r for r in rows if not r["ok"]]
    print(f"sources={len(rows)} ok={len(rows) - len(failed)} failed={len(failed)}")
    if any(r.get("d1_quota") for r in rows):
        print("::error title=D1 quota exceeded::Cloudflare D1 daily write quota is exhausted; ingest rejected for "
              + ", ".join(r["source_id"] for r in rows if r.get("d1_quota")))
    if failed:
        print(f"::error::{len(failed)} of {len(rows)} sources failed: {', '.join(r['source_id'] for r in failed)}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
