"use client";
import { createBrowserClient } from "@supabase/ssr";

/** Tarayici (client component) icin Supabase client — yalnizca anon key. */
export function getBrowserSupabase() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
