# Sorun tespit listesi

Kullanıcının bildirdiği her sorun burada. Sistem sorunsuz olana kadar listeyi tekrar çalıştırırız:
`python channels/tip-ogrencileri-platformu/scripts/hekimler_issue_check.py` (salt okunur; PASS / FAIL / MANUAL).
Yeni bir sorun bildirildiğinde buraya yeni bir satır (ve mümkünse betiğe kontrol) eklenir. Bir madde ancak kontrolü PASS olunca kapanır.

Durum: KAPALI = kontrol PASS; AÇIK = kontrol FAIL veya doğrulanmadı; DIŞ = dış koşul bekliyor.

| # | Bildirilen sorun | Kök neden | Yapılan | Kontrol | Durum |
|---|---|---|---|---|---|
| S01 | Hekimler haber akışı kullanıcıya görünmüyor | Tarayıcı son sekmeyi (Beklemede) hatırlıyor, boş liste ipucu yok; rozet 190, liste 189 | Deep link `?route=hekimler&view=inbox`, yükleniyor/boş ipucu, rozet = görünen filtre | S01, S01b, S01c | KAPALI (2026-09-21) |
| S02 | Kaduse feed hataları (32/60 haber, 16/42 araştırma) | Eski cron "Too many subrequests" (bayat) + Google News 503, 403 bot koruması, 404 | Bayatlar yeniden çekildi, NEJM AI URL düzeltildi, `feedIds` yeniden çekme; kalan 13+14 hata dış kaynaklı | S11 (manuel D1) | DIŞ / kısmi |
| S03 | AA "Sağlık only" feed'inde politika/dünya haberleri | Sayfadaki her link haber sayılıyor (menüler) | `/tr/saglik/` kapsamı, 276 alakasız kayıt silindi | S03 | KAPALI (2026-09-21) |
| S04 | "Title Pending 927" gibi başlıksız araştırma kayıtları, alakasız dergiler | Crossref bulanık sorgu, yer tutucu başlık, 2027-2036 tarihleri | `research-quality.ts` kapıları, 69 kayıt silindi | S04, S04b | KAPALI (2026-09-21) |
| S05 | "MCP Server", "Explorer API", "BigQuery" gibi işe yaramaz içerik; akış kalitesi | HTML tarayıcı menü/navigasyon linklerini haber sanıyor | `link-quality.ts` kapısı, 603 kayıt silindi | S05 | AÇIK: `Crossmark - Crossref` (doküman sayfası) hâlâ var; feed kapatılmalı |
| S05b | Başlıklarda `&#x27;` gibi HTML kodları | RSS/API yolunda başlık kodları çözülmüyor (yalnız tarayıcı yolunda çözüldü) | Kısmi (tarayıcı yolu) | S05b | AÇIK: 8 kayıt |
| S06 | "Kaynakları çek" dedim ama güncellenmiyor | Liste eskiden yeniye + 200 sınırı: yeni kayıtlar görünmüyordu | En yeni üstte, "en yeni N / toplam", toast'ta yeni kayıt sayısı | S06 | KAPALI (2026-09-21) |
| S07 | Hekimler 46 kaynak, 42/46 operasyonel | 4 kaynak engelli | Doğru sayı korunuyor | S07, S07b | KAPALI (sayı doğru); hedef 46/46 |
| S08 | HSGM canlı akışa alınmalı | GitHub çıkışı engelli; Türkiye çıkışlı makine + ingest token yok | Freshness alarmı, TR runner takvimi, Windows görev betiği (kurulmadı) | S08 | DIŞ: `~/.hekimler_token` dosyası (mevcut `TIP_RADAR_INGEST_TOKEN`) |
| S09 | GMC, ECFMG/Intealth, Make it in Germany tam kapsam | Cloudflare/Radware bot koruması (aşılmadı) | Rota taraması, kapsam matrisi | S09 | DIŞ: kaynak tarafından erişime izin |
| S10 | Cloudflare e-postası: Workers CPU sınırı 1000+ kez | Dakikalık cron her işi birden çalıştırıyordu | Tick başına tek iş (`7439f76`) | S10, S12 (manuel) | Doğrulama bekliyor: sürüm 4ed2b498 sonrası 0 hata, 24 saat penceresi 2026-09-22 ~17:14Z |
| S11 | D1 yazma kotası riski | Koşulsuz yazmalar, feed istatistiği yazmaları | Değişmeyen kayıt yazmama, feed stat kapısı | S13 (manuel) | Doğrulama bekliyor: 24 saatlik ölçüm 2026-09-22 ~17:13Z sonrası |
| S12 | channel-content-os MCP HTTP 401 | Üretim Cloudflare Access OAuth, istemci statik Bearer gönderiyor | Teşhis | S14 (manuel) | DIŞ: kullanıcı yetkilendirmesi |
| S13 | Kaduse minute cron Workers Free sınırında başarısız | Aynı S10 | Aynı S10 | S12 | Bkz. S10 |
| S14 | Zayıf kaynaklar: `research-altmetric-api`, `research-crossmark` (doküman sayfaları), `research-gdelt-doc-api` (sağlıkla ilgisiz genel haber) | Feed konfigürasyonu | Henüz yapılmadı | S05 (kısmen) | AÇIK: kapat / GDELT'e sağlık filtresi ekle |
| S15 | Eski/tarihsiz içerik "taze" görünüyor: 2024 atama kurası, 2021 Meme Tarama Rehberi, Sağlık Bakanlığı 115-129. dönem kura arşivi (hangisi güncel belli değil) | Liste sayfasında tarih yok; sistem tarihsizi "İnceleme gerek" olarak alıyor ve çekilme zamanını yayın tarihi gibi gösteriyor ("1 gün") | Kural: tarihi doğrulanamayan kayıt haber değildir, alınmaz (Python + Worker); 32 kayıt silindi. Sonraki zamanlanmış çalıştırma yeni kuralla çalışır | S15, S15b | KAPALI (mevcut veri); yeni kural ilk zamanlanmış çalıştırmada doğrulanacak |

## Çalıştırma geçmişi
- 2026-09-21 ~21:00 UTC (Worker 215ba08): PASS 11, FAIL 6, MANUAL 4. FAIL: S05 (1 kayıt), S05b (8 kayıt), S08 (HSGM), S09 (GMC, ECFMG, MiG).
- 2026-09-21 ~22:00 UTC (Worker 7ee37f6, S15 sonrası): S15/S15b PASS; kalan FAIL: S05 (1), S05b (8), S08 (HSGM), S09 (GMC, ECFMG, MiG). Not: bazı kayıtlarda yayın tarihi ISO değil ("2026 Sep 7"); yalnız görünümü etkiler.
