#!/usr/bin/env python3
"""Lazy design-reference selector for the VoltAgent/awesome-design-md catalog.

Never bulk-fetches. Fetches exactly one DESIGN.md -- the one selected for the
current production request -- and caches a condensed "applied brief" keyed by
slug, with source URL + commit SHA (version), so later requests for the same
guide reuse the cached brief instead of re-fetching.

Usage:
    python select_reference.py list
    python select_reference.py fetch <slug>          # fetch + cache, print brief
    python select_reference.py brief <slug>           # cached brief only, no network

This extracts STRUCTURAL patterns only (typography scale, spacing scale,
corner-radius scale, layout ratios). It deliberately drops the reference
brand's own colors and font families -- those never override a channel's own
brand identity (colors.json / logo-manifest.json / font-pool.json), per the
project's own rule: reference brand identity is never authoritative here.
"""
import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).parent
INDEX_PATH = HERE / "index.json"
CACHE_DIR = HERE / "cache"
API_BASE = "https://api.github.com/repos/VoltAgent/awesome-design-md"
RAW_BASE = "https://raw.githubusercontent.com/VoltAgent/awesome-design-md/main"


def load_index() -> dict:
    return json.loads(INDEX_PATH.read_text(encoding="utf-8"))


def _http_get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={"User-Agent": "channel-content-os-design-ref/0.1"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        return resp.read()


def get_latest_commit_sha(slug: str) -> str | None:
    url = f"{API_BASE}/commits?path=design-md/{slug}/DESIGN.md&per_page=1"
    try:
        data = json.loads(_http_get(url))
        return data[0]["sha"] if data else None
    except Exception:
        return None


def parse_yaml_frontmatter_block(text: str, block_name: str) -> dict:
    """Minimal, dependency-free parser for the flat 'key: value' blocks these
    DESIGN.md files use (no external yaml lib -- keeps this a stdlib-only
    script, matching 'fewest justified dependencies')."""
    lines = text.splitlines()
    try:
        start = next(i for i, l in enumerate(lines) if l.strip() == f"{block_name}:")
    except StopIteration:
        return {}
    result: dict = {}
    current_key = None
    i = start + 1
    while i < len(lines):
        line = lines[i]
        if line.strip() == "" or line.startswith("  ") is False:
            if line.strip() and not line.startswith(" "):
                break
            if line.strip() == "":
                i += 1
                continue
        indent = len(line) - len(line.lstrip(" "))
        stripped = line.strip()
        if indent == 2 and ":" in stripped:
            key, _, val = stripped.partition(":")
            val = val.strip().strip('"')
            if val:
                result[key.strip()] = val
                current_key = None
            else:
                current_key = key.strip()
                result[current_key] = {}
        elif indent == 4 and current_key and ":" in stripped:
            k, _, v = stripped.partition(":")
            result[current_key][k.strip()] = v.strip().strip('"')
        elif indent < 2:
            break
        i += 1
    return result


def fetch_and_cache(slug: str) -> dict:
    index = load_index()
    match = next((g for g in index["guides"] if g["slug"] == slug), None)
    if not match:
        raise SystemExit(f"'{slug}' is not in index.json -- run 'list' to see the 74 real catalog entries.")

    raw_url = match["raw_url"]
    text = _http_get(raw_url).decode("utf-8")
    sha = get_latest_commit_sha(slug)

    typography = parse_yaml_frontmatter_block(text, "typography")
    spacing = parse_yaml_frontmatter_block(text, "spacing")
    rounded = parse_yaml_frontmatter_block(text, "rounded")

    desc_match = re.search(r"description:\s*(.+)", text)
    description = desc_match.group(1).strip() if desc_match else None

    brief = {
        "slug": slug,
        "source_url": match["source_url"],
        "version_commit_sha": sha,
        "fetched_at": datetime.now(timezone.utc).isoformat(),
        "source_description": description,
        # Structural pattern only -- no colors, no font family names copied in,
        # per the "reference brand identity never overrides ours" rule.
        "structural_pattern": {
            "typography_scale": typography,
            "spacing_scale": spacing,
            "corner_radius_scale": rounded,
        },
        "usage_note": (
            "Apply typography_scale's size/weight/line-height RATIOS and spacing_scale's "
            "rhythm to the target channel's own brand colors/fonts/logo. Do not carry over "
            "this guide's own color values or font family."
        ),
    }

    CACHE_DIR.mkdir(exist_ok=True)
    cache_path = CACHE_DIR / f"{slug}.json"
    cache_path.write_text(json.dumps(brief, indent=2, ensure_ascii=False), encoding="utf-8")

    # Mark the index entry as fetched so future runs know a cached brief exists.
    match["fetched"] = True
    match["style_description"] = description
    INDEX_PATH.write_text(json.dumps(index, indent=2, ensure_ascii=False), encoding="utf-8")

    return brief


def cached_brief(slug: str) -> dict | None:
    cache_path = CACHE_DIR / f"{slug}.json"
    if not cache_path.exists():
        return None
    return json.loads(cache_path.read_text(encoding="utf-8"))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    cmd = sys.argv[1]
    if cmd == "list":
        idx = load_index()
        for g in idx["guides"]:
            flag = "cached" if g["fetched"] else "not fetched"
            print(f"{g['slug']:<20} {flag}")
    elif cmd == "fetch" and len(sys.argv) == 3:
        b = fetch_and_cache(sys.argv[2])
        print(json.dumps(b, indent=2, ensure_ascii=False))
    elif cmd == "brief" and len(sys.argv) == 3:
        b = cached_brief(sys.argv[2])
        if b is None:
            print(f"No cached brief for '{sys.argv[2]}' yet -- run 'fetch {sys.argv[2]}' first.")
            sys.exit(1)
        print(json.dumps(b, indent=2, ensure_ascii=False))
    else:
        print(__doc__)
        sys.exit(1)
