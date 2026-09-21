"""Sorun tespit listesi - otomatik kontroller (salt okunur, canlı Hub API). Çıktı: PASS / FAIL / MANUAL.
Kullanım: python scripts/hekimler_issue_check.py   (çıkış kodu 1 = en az bir FAIL)
"""
from __future__ import annotations

import json
import re
import sys
import urllib.request
from urllib.parse import urlparse

HUB = "https://global-content-os.channel-content-os-mcp.workers.dev"
EXTRAS = {"tvhb_veterinary", "tdb_dental"}
NAV = re.compile(r"^(about|contact|staff|partners?|overview|home|news|events?|careers?|privacy|terms|sitemap|faq|login|search|resources|publications|documents?|speeches|our |who we|what we|how we|explorer|api|sdk|docs|documentation|pricing|support|help|team|governance|mission|history|jobs|donate|newsletter|press( |$)|media( |$)|accessibility|cookies?)", re.I)


def get(path: str):
    req = urllib.request.Request(HUB + path, headers={"User-Agent": "hekimler-issue-check/1.0"})
    with urllib.request.urlopen(req, timeout=90) as r:
        return json.load(r)


def is_article_link(title: str, url: str) -> bool:
    t = re.sub(r"\s+", " ", title or "").strip()
    words = t.split(" ")
    if len(t) < 25 or len(words) < 4:
        return False
    segs = [s for s in urlparse(url).path.split("/") if s]
    if NAV.match(t) and len(words) <= 6:
        return False
    return not (len(segs) <= 1 and len(words) < 7)


results: list[tuple[str, str, str]] = []


def check(id_: str, ok: bool, detail: str) -> None:
    results.append((id_, "PASS" if ok else "FAIL", detail))


def manual(id_: str, detail: str) -> None:
    results.append((id_, "MANUAL", detail))


def items(route: str, extra: str = "", limit: int = 500):
    return get(f"/api/items?route={route}{extra}&status=inbox&days=14&limit={limit}")


def main() -> int:
    # 1 Hekimler akışı Hub'da görünür; rozet = görünen
    hek = items("tip-ogrencileri", "&channel=hekimler-toplulugu", 500)
    check("S01 Hekimler görünür", len(hek["items"]) > 0, f"görünen {len(hek['items'])}, rozet {hek['counts']['inbox']}")
    check("S01b rozet = görünen", hek["counts"]["inbox"] == len(hek["items"]), f"rozet {hek['counts']['inbox']} / görünen {len(hek['items'])}")
    bad_url = [i for i in hek["items"] if not str(i["canonicalUrl"]).startswith("http")]
    check("S01c resmi URL var", not bad_url, f"URL'siz {len(bad_url)}")

    # 2/3 AA sağlık dışı
    news = items("kaduse-news")
    aa = [i for i in news["items"] if i["feedId"] == "news-aa-saglik-scoped"]
    off = [i for i in aa if "/tr/saglik/" not in i["canonicalUrl"]]
    check("S03 AA yalnızca sağlık", not off, f"AA {len(aa)} kayıt, sağlık dışı {len(off)}")

    research = items("kaduse-research")
    allk = news["items"] + research["items"]

    # 4 Title Pending / yanlış tarih
    tp = [i for i in allk if re.search(r"title pending|^untitled", i["title"], re.I)]
    fut = [i for i in allk if re.match(r"20\d\d-\d\d-\d\d", str(i.get("publishedAt") or "")) and str(i["publishedAt"])[:10] > "2026-09-30"]
    check("S04 yer tutucu başlık yok", not tp, f"{len(tp)} adet")
    check("S04b ileri tarihli kayıt yok", not fut, f"{len(fut)} adet")

    # 5 menü/navigasyon içerik
    scraper = [i for i in allk if not i.get("publishedAt") and (i.get("summary") or "").strip() in ("", (i["title"] or "").strip())]
    nav = [i for i in scraper if not is_article_link(i["title"], i["canonicalUrl"])]
    check("S05 menü/navigasyon kaydı yok", not nav, f"tarayıcı tipi {len(scraper)}, navigasyon {len(nav)}: " + "; ".join(i["title"][:25] for i in nav[:4]))
    ent = [i for i in allk if re.search(r"&#x?[0-9a-f]+;", i["title"], re.I)]
    check("S05b başlıkta HTML kodu yok", not ent, f"{len(ent)} adet")

    # 6 liste en yeni üstte
    for name, d in (("kaduse-news", news), ("kaduse-research", research)):
        f = [i["fetchedAt"] for i in d["items"]]
        check(f"S06 {name} en yeni üstte", bool(f) and f[0] >= f[-1], f"ilk {f[0][:16] if f else '-'} / son {f[-1][:16] if f else '-'}")

    # 7 Hekimler kaynak durumu (42/46) ve HSGM
    src = get("/api/hekimler/sources")["sources"]
    canon = [s for s in src if s["sourceId"] not in EXTRAS]
    strict = sum(1 for s in canon if s["label"] in ("PIPELINE_OK", "PIPELINE_OK_EMPTY", "PIPELINE_OK_LIMITED"))
    check("S07 kanonik 46 kaynak", len(canon) == 46, f"{len(canon)} kaynak")
    check("S07b katı operasyonel >= 42", strict >= 42, f"{strict}/46 (hedef 46/46)")
    hs = next((s for s in src if s["sourceId"] == "hsgm_public_health"), None)
    check("S08 HSGM canlı (PIPELINE_OK)", bool(hs) and hs["label"].startswith("PIPELINE_OK"), f"etiket {hs and hs['label']}, son başarı {hs and (hs.get('telemetry') or {}).get('last_success_at')}")
    for sid in ("abroad_uk_gmc", "abroad_us_ecfmg_intealth", "abroad_de_make_it_in_germany"):
        s = next((x for x in src if x["sourceId"] == sid), None)
        check(f"S09 {sid} tam kapsam", bool(s) and s["label"].startswith("PIPELINE_OK"), f"etiket {s and s['label']}")

    # Sağlık kontrolü
    h = get("/api/health")
    check("S10 Worker sağlık", h.get("ok") is True, f"commit {h.get('commit')}")

    manual("S11 Kaduse feed hataları (D1)", "wrangler d1: SELECT route,count(*),sum(last_error IS NOT NULL) FROM source_feeds WHERE enabled=1 GROUP BY route  (hedef: 0 stale, kalanlar harici engel)")
    manual("S12 Workers CPU sınırı", "Cloudflare workersInvocationsAdaptive: exceededResources = 0 (son 24 saat); uyarı penceresi 2026-09-22 ~17:14Z sonrası temiz olmalı")
    manual("S13 D1 yazma kotası 24 saat", "d1AnalyticsAdaptiveGroups rowsWritten: 2026-09-21 17:13Z -> 2026-09-22 17:13Z ve UTC gün toplamı; kota 100.000/gün")
    manual("S14 MCP channel-content-os 401", "~/.claude.json içindeki statik Bearer başlığı kaldırılıp /mcp ile OAuth yetkilendirme")

    w = max(len(r[0]) for r in results)
    for id_, st, d in results:
        print(f"{st:6} {id_:<{w}}  {d}")
    fails = sum(1 for r in results if r[1] == "FAIL")
    print(f"\nPASS {sum(1 for r in results if r[1]=='PASS')}  FAIL {fails}  MANUAL {sum(1 for r in results if r[1]=='MANUAL')}")
    return 1 if fails else 0


if __name__ == "__main__":
    try:
        sys.stdout.reconfigure(encoding="utf-8")  # type: ignore[attr-defined]
    except Exception:
        pass
    sys.exit(main())
