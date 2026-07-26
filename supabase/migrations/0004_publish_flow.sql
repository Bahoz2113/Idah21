-- =====================================================================
-- 0004_publish_flow.sql — Faz 3: onay/yayin akisi icin ek sema
--
-- app_settings: acil durdurma anahtari (master prompt md.16 "Acil durdurma
-- anahtari tum otomatik yayin islerini durdurmali"). Tek satir/kullanici —
-- mevcut "her satir user_id ile sahiplenir" desenine uyar (0001_init.sql).
-- Mevcut hicbir kolon/satir degismez veya silinmez.
-- =====================================================================

create table app_settings (
  user_id               uuid primary key references users(id) on delete cascade,
  emergency_stop        boolean not null default false,
  emergency_stop_reason text,
  updated_at            timestamptz not null default now()
);

alter table app_settings enable row level security;
alter table app_settings force row level security;

create policy app_settings_owner on app_settings
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- publish job'inin "zamani gelen ve henuz denenmemis" sorgusunu hizlandirir.
create index publications_due_idx on publications (status, scheduled_at)
  where status = 'pending';
