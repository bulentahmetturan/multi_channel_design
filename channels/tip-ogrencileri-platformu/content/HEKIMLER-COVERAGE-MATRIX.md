# Coverage matrices for the four non-standard canonical sources (2026-09-21)

Evidence: GitHub-hosted probe runs 35536453639 and the follow-up probe (same day); local probes from Türkiye. All probes are plain GETs with TLS verification on and the runner User-Agent; no challenge/CAPTCHA bypass.

## hsgm_public_health — BLOCKED_EXTERNAL_RUNNER_REQUIRED
- Local (Türkiye) success: `hsgm.saglik.gov.tr` news list HTTP 200 in ~3 s; adapter dry run: 58 parsed, 3 date-rejected, 53 policy-rejected, 2 eligible, newest 2026-07-25.
- GitHub/Cloudflare: TCP connect to 80/443 blackholed (network diagnosis run 35532846118, egress 135.232.208.149).
- Alternatives tried: hsgm sitemap/rss/feed (404 everywhere), saglik.gov.tr news + archive (reachable from GitHub, does not republish HSGM notices; the only HSGM mentions are generic), no other official HSGM host.
- Contract delivered: registry tag `runner_region: TR`, `--sources tr-runner`, `hekimler-tr-runner.yml` (self-hosted runner labels `self-hosted, tr`), same adapter/ingest/telemetry.
- Minimum user action: provide a Türkiye-located self-hosted GitHub runner (any PC/VPS in Türkiye, free if own hardware) or run `python scripts/hekimler_scheduled_run.py --sources tr-runner` daily there with `TIP_RADAR_INGEST_TOKEN` set.

## abroad_uk_gmc — PARTIALLY_COVERED (limited automated substitute live)
| Required topic | Candidate official source | Covered? | Evidence |
|---|---|---|---|
| GMC registration | gmc-uk.org | No | Cloudflare challenge (403) from GitHub; not bypassed |
| Licensing / rules | gmc-uk.org | No | same |
| PLAB | gmc-uk.org | No | same |
| IMG requirements | gmc-uk.org | No | same |
| Visa / immigration changes for overseas doctors | gov.uk UKVI Atom | Yes (filtered) | 40 entries parsed, newest 2026-09-18, 0 eligible today |
| Health-policy/regulation changes affecting overseas doctors | gov.uk DHSC Atom | Yes (filtered) | same run |
| Major professional regulatory updates by GMC | gov.uk (GMC is not a gov.uk publisher) | No | GMC atom feed empty |
| NHS employer international recruitment | NHS Employers RSS | Rejected | feed links malformed (theme-debug HTML in `<link>`) |
| NHS England | england.nhs.uk/feed | Rejected | domestic employment noise, no IMG focus |
Limitation: GMC's own registration/PLAB pages and news are unmonitored. Missing scope needs GMC to allow automated access or a non-datacenter runner (Cloudflare challenge applies to any automated client, so a TR runner would not help).

## abroad_us_ecfmg_intealth — PARTIALLY_COVERED (no direct ECFMG route)
| Required topic | Candidate | Covered? | Evidence |
|---|---|---|---|
| ECFMG certification | ecfmg.org / intealth.org | No | Cloudflare "Just a moment" 403 from GitHub (also /news, /certification-pathways) |
| Intealth pathways | intealth.org, faimer.org | No | same challenge |
| IMG application/eligibility changes | ecfmg.org | No | same |
| Exam-related eligibility | usmle.org/announcements, /bulletin-information | Yes | 200 from GitHub; source `abroad_us_usmle` operational |
| Match/ERAS deadlines and procedures | NRMP, AAMC | Yes (adjacent) | `abroad_us_nrmp`, `abroad_us_aamc_eras` operational |
| Certification/pathways notices | none accessible | No | — |
USMLE/NRMP/AAMC do not substitute for ECFMG certification and pathways; classified PARTIALLY_COVERED, not COVERED.

## abroad_de_make_it_in_germany — PARTIALLY_COVERED
| Required topic | Candidate official source | Covered? | Evidence |
|---|---|---|---|
| Physician qualification recognition | anerkennung-in-deutschland.de | Yes | `abroad_de_anerkennung` operational (87 parsed, 0 eligible) |
| Visa & residence | make-it-in-germany.com; auswaertiges-amt.de/en/visa-service; bamf.de work page | No automatable dated feed | MiG = Radware bot page; AA/BAMF pages are static guidance without dated lists (200 but no publication dates) |
| German-language requirements | goethe.de | No | 403 |
| Physician employment/shortage | make-it-in-germany.com, arbeitsagentur.de | No | Radware / 404 |
| Relocation guidance | make-it-in-germany.com | No | Radware |
| Federal Medical Association | bundesaerztekammer.de/en | Not usable | reachable (200) but no news list URL; home page only |
Static guidance pages cannot be monitored as dated feeds; adding them would create undated review noise. Recognition (the physician-critical part) is covered by Anerkennung.
