import { createClient } from "@supabase/supabase-js";

// Sunucu tarafı admin istemcisi (service role) — yalnızca güvenli ortamda kullanılır
export function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

// İstemci tarafı (anon) — web/mobil oturum yönetimi
export function createBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
