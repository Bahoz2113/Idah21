-- =====================================================================
-- 0003_extend_topics_and_sources.sql
-- Faz 2 icin iki additive (geriye donuk uyumlu) sema eklemesi:
--
-- 1) topics: scoring/topic.ts'nin TopicSignals'i rightsImpact ve
--    discussionPotential bekliyor ama 0001_init.sql'de bu iki kolon yoktu
--    (master prompt'un kendi sema listesi de icermiyor - orijinal bir
--    eksiklik). final_score'u etkileyen bu iki alt-skor da kalici ve
--    denetlenebilir olsun diye eklendi.
-- 2) sources: (user_id, url_or_query) unique kisiti - ayni kaynagin
--    yanlislikla birden fazla kez seed edilmesini/eklenmesini onler,
--    idempotent seed script'lerine izin verir.
--
-- Mevcut hicbir kolon/satir degismez veya silinmez.
-- =====================================================================

alter table topics
  add column rights_impact_score numeric(5,2),
  add column discussion_potential_score numeric(5,2);

alter table sources
  add constraint sources_user_url_uidx unique (user_id, url_or_query);
