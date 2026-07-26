-- =====================================================================
-- HEP-SEN Batman — Baskanlik Iletisim OS
-- 0001_init.sql — sema, indeksler, RLS
-- Tek yonetici hesabi varsayimi: tum satirlar user_id ile sahiplenir.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- ENUM'lar
-- ---------------------------------------------------------------------
create type risk_level      as enum ('LOW','MEDIUM','HIGH','BLOCKED');
create type draft_status    as enum ('DRAFT','REVIEW_REQUIRED','APPROVED','SCHEDULED',
                                     'PUBLISHING','PUBLISHED','REJECTED','NEEDS_REVISION',
                                     'BLOCKED_BY_RISK');
create type content_type    as enum ('post','thread','reply','column_derivative');
create type author_type     as enum ('institution','official','news','public_figure','individual');
create type opportunity_status as enum ('open','drafted','dismissed','expired');
create type source_type     as enum ('rss','google_news','official_site','apify_query');
create type provider_type   as enum ('anthropic','apify','x_api');
create type metric_source   as enum ('api','manual_premium');
create type reject_reason   as enum ('too_harsh','too_soft','artificial','not_corporate',
                                     'risky','irrelevant','repetitive','off_tone');

-- ---------------------------------------------------------------------
-- Cekirdek
-- ---------------------------------------------------------------------
create table users (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  display_name  text,
  timezone      text not null default 'Europe/Istanbul',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table x_accounts (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null references users(id) on delete cascade,
  x_user_id               text not null,
  username                text not null,
  access_token_encrypted  bytea not null,
  refresh_token_encrypted bytea not null,
  expires_at              timestamptz not null,
  scopes                  text[] not null,
  connected_at            timestamptz not null default now(),
  revoked_at              timestamptz,
  unique (user_id, x_user_id)
);

-- ---------------------------------------------------------------------
-- Kaynaklar ve toplama
-- ---------------------------------------------------------------------
create table sources (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references users(id) on delete cascade,
  name              text not null,
  type              source_type not null,
  url_or_query      text not null,
  reliability_level smallint not null default 50 check (reliability_level between 0 and 100),
  is_active         boolean not null default true,
  category          text,
  last_checked_at   timestamptz
);

create table collected_items (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references users(id) on delete cascade,
  source_id           uuid not null references sources(id) on delete cascade,
  external_id         text,
  platform            text not null,
  title               text,
  content             text not null,
  url                 text not null,
  author              text,
  author_handle       text,
  published_at        timestamptz not null,
  engagement_snapshot jsonb not null default '{}'::jsonb,
  raw_payload         jsonb,
  content_hash        text not null,
  collected_at        timestamptz not null default now()
);
create unique index collected_items_hash_uidx     on collected_items (user_id, content_hash);
create unique index collected_items_external_uidx on collected_items (platform, external_id)
  where external_id is not null;
create index collected_items_published_idx on collected_items (published_at desc);

-- ---------------------------------------------------------------------
-- Konular
-- ---------------------------------------------------------------------
create table topics (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid not null references users(id) on delete cascade,
  title                    text not null,
  summary                  text not null,
  category                 text,
  health_relevance_score   numeric(5,2),
  source_reliability_score numeric(5,2),
  urgency_score            numeric(5,2),
  batman_relevance_score   numeric(5,2),
  trend_score              numeric(5,2),
  legal_risk_score         numeric(5,2),
  final_score              numeric(5,2),
  status                   text not null default 'new',
  created_at               timestamptz not null default now()
);
create index topics_score_idx on topics (final_score desc, created_at desc);

create table topic_sources (
  topic_id          uuid not null references topics(id) on delete cascade,
  collected_item_id uuid not null references collected_items(id) on delete cascade,
  primary key (topic_id, collected_item_id)
);

-- ---------------------------------------------------------------------
-- Taslaklar
-- ---------------------------------------------------------------------
create table drafts (
  id                        uuid primary key default gen_random_uuid(),
  user_id                   uuid not null references users(id) on delete cascade,
  topic_id                  uuid references topics(id) on delete set null,
  content_type              content_type not null default 'post',
  reply_to_post_id          text,
  reply_to_author_handle    text,
  text                      text not null,
  alt_hooks                 jsonb not null default '[]'::jsonb,
  hashtags                  text[] not null default '{}',
  source_summary            text,
  tone_score                numeric(5,2),
  corporate_alignment_score numeric(5,2),
  human_style_score         numeric(5,2),
  hook_strength             numeric(5,2),
  legal_risk_level          risk_level not null default 'LOW',
  legal_risk_reasons        jsonb not null default '[]'::jsonb,
  blocklist_hits            jsonb not null default '[]'::jsonb,
  recommended_publish_at    timestamptz,
  timing_score              numeric(5,2),
  timing_confidence         numeric(5,2),
  timing_reason             text,
  status                    draft_status not null default 'DRAFT',
  version                   integer not null default 1,
  approved_text_hash        text,
  prompt_version            text,
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now()
);
create index drafts_status_idx on drafts (user_id, status, recommended_publish_at);

-- Yanitlarda hashtag kullanilmaz — veritabani seviyesinde zorla
alter table drafts add constraint drafts_reply_no_hashtags
  check (content_type <> 'reply' or cardinality(hashtags) = 0);

-- Hashtag sayisi 0-2
alter table drafts add constraint drafts_hashtag_limit
  check (cardinality(hashtags) <= 2);

-- HIGH/BLOCKED taslak APPROVED/SCHEDULED/PUBLISHED olamaz
alter table drafts add constraint drafts_risk_blocks_publish
  check (
    legal_risk_level in ('LOW','MEDIUM')
    or status not in ('APPROVED','SCHEDULED','PUBLISHING','PUBLISHED')
  );

create table draft_feedback (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  draft_id      uuid not null references drafts(id) on delete cascade,
  action        text not null,
  reason_code   reject_reason,
  free_text     text,
  original_text text,
  final_text    text,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Yanit firsatlari
-- ---------------------------------------------------------------------
create table reply_opportunities (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references users(id) on delete cascade,
  collected_item_id   uuid references collected_items(id) on delete set null,
  x_post_id           text not null,
  author_handle       text not null,
  author_type         author_type not null,
  engagement_snapshot jsonb not null default '{}'::jsonb,
  relevance_score     numeric(5,2),
  decay_at            timestamptz not null,
  status              opportunity_status not null default 'open',
  created_at          timestamptz not null default now(),
  unique (user_id, x_post_id)
);
-- Bireysel hesaplara firsat olusturulamaz
alter table reply_opportunities add constraint reply_opps_no_individuals
  check (author_type <> 'individual');
create index reply_opps_open_idx on reply_opportunities (user_id, status, decay_at);

-- ---------------------------------------------------------------------
-- Benchmark
-- ---------------------------------------------------------------------
create table benchmark_accounts (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references users(id) on delete cascade,
  username         text not null,
  category         text,
  is_active        boolean not null default true,
  last_analyzed_at timestamptz,
  unique (user_id, username)
);

-- DIKKAT: tweet METNI icin kolon YOKTUR. Analiz sonrasi yalnizca yapisal
-- ozellikler saklanir; metin kalici hale getirilmez (md. 16).
create table benchmark_posts (
  id                   uuid primary key default gen_random_uuid(),
  user_id              uuid not null references users(id) on delete cascade,
  benchmark_account_id uuid not null references benchmark_accounts(id) on delete cascade,
  x_post_id            text not null,
  posted_at            timestamptz not null,
  length_bucket        text not null check (length_bucket in ('short','medium','long')),
  has_media            boolean not null default false,
  is_thread            boolean not null default false,
  hook_type            text,
  topic_cluster        text,
  likes                integer not null default 0,
  replies              integer not null default 0,
  reposts              integer not null default 0,
  engagement_rate      numeric(6,4),
  collected_at         timestamptz not null default now(),
  unique (benchmark_account_id, x_post_id)
);

create table benchmark_insights (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references users(id) on delete cascade,
  week_start      date not null,
  findings        jsonb not null,
  recommendations jsonb not null,
  created_at      timestamptz not null default now(),
  unique (user_id, week_start)
);

-- ---------------------------------------------------------------------
-- Yayin ve metrikler
-- ---------------------------------------------------------------------
create table publications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references users(id) on delete cascade,
  draft_id        uuid not null references drafts(id) on delete cascade,
  x_post_id       text,
  in_reply_to_id  text,
  scheduled_at    timestamptz not null,
  published_at    timestamptz,
  status          text not null default 'pending',
  error_message   text,
  idempotency_key text not null,
  attempt_count   smallint not null default 0,
  unique (idempotency_key)
);

create table post_metrics (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references users(id) on delete cascade,
  publication_id uuid not null references publications(id) on delete cascade,
  captured_at    timestamptz not null default now(),
  source         metric_source not null default 'api',
  impressions    integer,
  likes          integer,
  replies        integer,
  reposts        integer,
  quotes         integer,
  bookmarks      integer,
  profile_clicks integer,
  follower_delta integer
);

create table time_slot_performance (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references users(id) on delete cascade,
  day_of_week         smallint not null check (day_of_week between 0 and 6),
  hour_bucket         smallint not null check (hour_bucket between 0 and 23),
  content_category    text not null default 'all',
  sample_size         integer not null default 0,
  avg_impressions     numeric(10,2),
  avg_engagement_rate numeric(6,4),
  avg_replies         numeric(10,2),
  avg_reposts         numeric(10,2),
  avg_follower_delta  numeric(10,2),
  confidence_score    numeric(5,2) not null default 0,
  updated_at          timestamptz not null default now(),
  unique (user_id, day_of_week, hour_bucket, content_category)
);

-- ---------------------------------------------------------------------
-- Hafiza, kose yazisi, butce, audit
-- ---------------------------------------------------------------------
create table presidential_memory (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references users(id) on delete cascade,
  memory_type      text not null,
  content          text not null,
  tags             text[] not null default '{}',
  category         text,
  source_reference text,
  weight           numeric(4,2) not null default 1.0,
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);
create index memory_lookup_idx on presidential_memory using gin (tags);
create index memory_type_idx   on presidential_memory (user_id, memory_type, is_active);

create table weekly_columns (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references users(id) on delete cascade,
  week_start    date not null,
  title         text not null,
  body          text not null,
  source_pack   jsonb not null default '[]'::jsonb,
  risk_level    risk_level not null default 'LOW',
  status        text not null default 'draft',
  approved_at   timestamptz,
  x_article_url text,
  unique (user_id, week_start)
);

create table budget_usage (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references users(id) on delete cascade,
  provider           provider_type not null,
  operation          text not null,
  model              text,
  units              numeric(12,2),
  input_tokens       integer,
  output_tokens      integer,
  cached_tokens      integer,
  estimated_cost_usd numeric(10,6) not null,
  occurred_at        timestamptz not null default now()
);
create index budget_month_idx on budget_usage (user_id, occurred_at);

create table audit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references users(id) on delete set null,
  action      text not null,
  entity_type text,
  entity_id   uuid,
  metadata    jsonb not null default '{}'::jsonb,
  ip_hash     text,
  created_at  timestamptz not null default now()
);
create index audit_created_idx on audit_logs (created_at desc);

-- Audit log degistirilemez ve silinemez
create or replace function prevent_audit_mutation() returns trigger
language plpgsql as $$
begin
  raise exception 'audit_logs degistirilemez veya silinemez';
end;
$$;
create trigger audit_no_update before update on audit_logs
  for each row execute function prevent_audit_mutation();
create trigger audit_no_delete before delete on audit_logs
  for each row execute function prevent_audit_mutation();

-- ---------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'users','x_accounts','sources','collected_items','topics','topic_sources',
    'drafts','draft_feedback','reply_opportunities','benchmark_accounts',
    'benchmark_posts','benchmark_insights','publications','post_metrics',
    'time_slot_performance','presidential_memory','weekly_columns',
    'budget_usage','audit_logs'
  ] loop
    execute format('alter table %I enable row level security', t);
    execute format('alter table %I force row level security', t);
  end loop;
end $$;

-- user_id tasiyan tablolar icin sahiplik politikasi
do $$
declare t text;
begin
  foreach t in array array[
    'x_accounts','sources','collected_items','topics','drafts','draft_feedback',
    'reply_opportunities','benchmark_accounts','benchmark_posts','benchmark_insights',
    'publications','post_metrics','time_slot_performance','presidential_memory',
    'weekly_columns','budget_usage'
  ] loop
    execute format($f$
      create policy %1$I_owner on %1$I
        for all to authenticated
        using (user_id = auth.uid())
        with check (user_id = auth.uid())
    $f$, t);
  end loop;
end $$;

create policy users_self on users
  for all to authenticated using (id = auth.uid()) with check (id = auth.uid());

create policy topic_sources_owner on topic_sources
  for all to authenticated
  using (exists (select 1 from topics t where t.id = topic_id and t.user_id = auth.uid()))
  with check (exists (select 1 from topics t where t.id = topic_id and t.user_id = auth.uid()));

-- Audit log: kullanici yalnizca OKUYABILIR. Yazma service_role ile yapilir.
create policy audit_read_own on audit_logs
  for select to authenticated using (user_id = auth.uid());

-- TOKEN GUVENLIGI: sifreli token kolonlari authenticated role'e verilmez.
revoke select (access_token_encrypted, refresh_token_encrypted) on x_accounts from authenticated;
