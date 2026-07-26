-- =====================================================================
-- 0001_sources.sql — HEP-SEN Batman baslangic kaynak listesi
--
-- Bu bir MIGRATION DEGILDIR — kasitli olarak supabase/migrations/ disinda.
-- `sources.user_id` NOT NULL + `users(id)` referansi (tek yonetici hesabi
-- varsayimi) oldugu icin, gercek yonetici hesabi (Supabase Auth) acilip
-- `users` tablosuna bir satir dusmeden bu script CALISTIRILAMAZ.
--
-- CALISTIRMA SIRASI:
-- 1. Supabase Dashboard -> Authentication -> Users'tan admin hesabini ac
--    (veya supabase.auth.admin.createUser).
-- 2. `users` tablosuna karsilik gelen satirin dustugunu dogrula
--    (auth trigger/uygulama kodu bunu senkronize etmeli; Faz 1'de bu
--    senkronizasyon henuz otomatik degil, gerekirse elle:
--    insert into users (id, email) select id, email from auth.users;).
-- 3. Bu dosyayi Supabase SQL Editor'de veya
--    `mcp__Supabase__execute_sql` ile calistir.
--
-- Idempotent'tir (0003 migration'daki sources_user_url_uidx unique
-- kisiti sayesinde tekrar calistirmak hata vermez, yeni satir eklemez).
--
-- KAYNAKLARIN DOGRULUK DURUMU (bkz. docs/adr/0002-0004):
-- - Resmi Gazete RSS: WebSearch ile gercek/aktif oldugu dogrulandi, AKTIF seed edildi.
-- - Saglik Bakanligi ve HEP-SEN resmi sitesi: URL'lerin GERCEK var oldugu
--   dogrulandi (WebSearch), ANCAK HTML yapisi bu gelistirme ortaminda
--   WebFetch engellendigi icin (403) canli test edilemedi. PASIF (is_active=false)
--   seed edildi — gercek sayfaya karsi lib/sources/official-site.ts adapter'ini
--   test edip calistigini dogruladiktan sonra is_active=true yapin.
-- =====================================================================

insert into sources (user_id, name, type, url_or_query, reliability_level, is_active, category)
select id, 'Resmi Gazete', 'rss', 'https://www.resmigazete.gov.tr/rss', 95, true, 'mevzuat'
from users limit 1
on conflict (user_id, url_or_query) do nothing;

insert into sources (user_id, name, type, url_or_query, reliability_level, is_active, category)
select id, 'Sağlık Bakanlığı - Personel Duyuruları', 'official_site',
       'https://www.saglik.gov.tr/TR,11694/duyurular-personel.html', 80, false, 'resmi_duyuru'
from users limit 1
on conflict (user_id, url_or_query) do nothing;

insert into sources (user_id, name, type, url_or_query, reliability_level, is_active, category)
select id, 'HEP-SEN Resmi Duyurular', 'official_site',
       'https://www.hepsen.org.tr/duyurular', 90, false, 'kurumsal'
from users limit 1
on conflict (user_id, url_or_query) do nothing;
