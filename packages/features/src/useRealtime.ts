"use client";
import { useEffect } from "react";
import { createBrowserClient } from "@cezeri/auth";
import { trpc } from "@cezeri/trpc";

type Table = "students" | "classes" | "attendance" | "notifications" | "lessons" | "student_evaluations";

/**
 * Supabase Realtime ile verilen tabloyu dinler.
 * Değişiklik olduğunda ilgili tRPC query cache'lerini invalidate eder.
 * Böylece aynı Wi-Fi'daki/internetteki farklı cihazlar anında güncellenir.
 */
export function useRealtime(tables: Table[]) {
  const utils = trpc.useUtils();

  useEffect(() => {
    const sb = createBrowserClient();
    const invalidators: Record<Table, () => void> = {
      students:            () => utils.students.list.invalidate(),
      classes:             () => utils.classes.list.invalidate(),
      attendance:          () => utils.attendance.byLesson.invalidate(),
      notifications:       () => { utils.notifications.list.invalidate(); utils.notifications.unreadCount.invalidate(); },
      lessons:             () => utils.lessons.listByClass.invalidate(),
      student_evaluations: () => utils.evaluations.studentGraph.invalidate(),
    };

    let channel: ReturnType<typeof sb.channel> | null = null;
    let cancelled = false;

    // Realtime, RLS politikaları auth.jwt() okuduğu için kendi oturumumuza
    // uyumlu kısa ömürlü bir Supabase JWT'si ister (SUPABASE_JWT_SECRET
    // yapılandırılmamışsa token=null döner, kanal yine de açılır ama RLS
    // hiçbir satır göndermez — sessiz, kırılmayan bir "pasif" durum).
    fetch("/api/auth/realtime-token", { credentials: "include" })
      .then((r) => r.json())
      .then(({ token }) => {
        if (cancelled) return;
        if (token) sb.realtime.setAuth(token);
        channel = sb.channel("cezeri-realtime-" + tables.join("-"))
          .on("postgres_changes", { event: "*", schema: "public" }, (payload) => {
            const tbl = payload.table as Table;
            if (tables.includes(tbl)) invalidators[tbl]?.();
          })
          .subscribe();
      })
      .catch(() => {});

    return () => { cancelled = true; if (channel) sb.removeChannel(channel); };
  }, [tables.join(",")]); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Tüm tabloları dinleyen tek hook — admin/eğitmen gibi geniş görünümlü paneller için */
export function useRealtimeAll() {
  useRealtime(["students", "classes", "attendance", "notifications", "lessons", "student_evaluations"]);
}
