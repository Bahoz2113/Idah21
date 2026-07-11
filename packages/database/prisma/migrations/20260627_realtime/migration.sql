-- Supabase Realtime: ilgili tabloları yayınla
-- Bu migration'ı prisma migrate ile değil, Supabase SQL editörüne doğrudan uygula.
-- Ya da: Supabase Dashboard → Database → Replication → Tables bölümünden işaretle.

alter publication supabase_realtime add table students;
alter publication supabase_realtime add table classes;
alter publication supabase_realtime add table attendance;
alter publication supabase_realtime add table notifications;
alter publication supabase_realtime add table lessons;
alter publication supabase_realtime add table student_evaluations;
