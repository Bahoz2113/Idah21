-- =====================================================================
-- 0002_harden_audit_function_search_path.sql
-- Supabase security advisor bulgusu: prevent_audit_mutation() search_path
-- sabitlenmemisti (function_search_path_mutable, WARN). Fonksiyonu
-- sabit/bos search_path ile yeniden tanimlar, davranis degismez.
-- =====================================================================

create or replace function prevent_audit_mutation() returns trigger
language plpgsql
set search_path = ''
as $$
begin
  raise exception 'audit_logs degistirilemez veya silinemez';
end;
$$;
