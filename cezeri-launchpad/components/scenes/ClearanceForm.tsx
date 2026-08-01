"use client";

import { useState } from "react";
import { AGE_GROUPS, MISSIONS } from "@/lib/content";

type Status = "idle" | "sending" | "sent" | "error";

/**
 * UÇUŞ İZİN FORMU
 *
 * Sihirbaz değil, konsol: dört bölümün TAMAMI DOM'da bulunur. Adım adım
 * gizlenen bir form hem crawler'a eksik görünür hem de JS olmadan çalışmaz.
 * Bölümler dolduruldukça "CLEARANCE ... GRANTED" satırı yanar.
 *
 * Not: `"use client"` hidrasyonu belirtir, SSR'ı kapatmaz — bu işaretlemenin
 * tamamı sunucu HTML'inde bulunur (GEO kuralı K1).
 */
export function ClearanceForm() {
  const [granted, setGranted] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const mark = (key: string, ok: boolean) =>
    setGranted((g) => (g[key] === ok ? g : { ...g, [key]: ok }));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json: { ok?: boolean; error?: string } = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.error ?? "Gönderilemedi");
      setStatus("sent");
      setMessage(
        "FLIGHT PLAN RECEIVED. Uçuş ekibi 24 saat içinde iletişime geçecek.",
      );
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "Beklenmeyen bir hata oluştu.",
      );
    }
  }

  const Clearance = ({ no, ok }: { no: string; ok: boolean }) => (
    <p className={`t-mono mt-3 ${ok ? "text-ignition" : "text-ash/40"}`}>
      Clearance {no} ......... {ok ? "GRANTED ✓" : "PENDING"}
    </p>
  );

  if (status === "sent") {
    return (
      <div
        role="status"
        className="border border-ignition bg-ignition/10 p-8 md:p-12"
      >
        <p className="t-mono mb-3 text-ignition">Transmission complete</p>
        <p className="font-body text-lg text-cyber">{message}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="border border-[var(--hairline)] bg-navy/10 p-6 md:p-10"
    >
      {/* Bal küpü — botlar doldurur, insanlar görmez */}
      <div aria-hidden="true" className="absolute left-[-9999px]">
        <label htmlFor="sirket">Şirket</label>
        <input id="sirket" name="sirket" tabIndex={-1} autoComplete="off" />
      </div>

      <fieldset className="border-b border-[var(--hairline)] pb-7">
        <legend className="t-mono text-ignition">Step 01 — Aday Kimliği</legend>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field
            label="Aday adı soyadı"
            name="adaySoyad"
            required
            onValid={(ok) => mark("01a", ok)}
          />
          <Field
            label="Veli adı soyadı"
            name="veliSoyad"
            required
            onValid={(ok) => mark("01b", ok)}
          />
        </div>
        <Clearance no="01" ok={Boolean(granted["01a"] && granted["01b"])} />
      </fieldset>

      <fieldset className="border-b border-[var(--hairline)] py-7">
        <legend className="t-mono text-ignition">Step 02 — Yaş Grubu</legend>
        <div className="mt-5 flex flex-wrap gap-3">
          {AGE_GROUPS.map((g) => (
            <label
              key={g}
              className="t-mono cursor-pointer border border-[var(--hairline)] px-4 py-2 text-ash transition-colors has-[:checked]:border-ignition has-[:checked]:text-ignition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ignition"
            >
              <input
                type="radio"
                name="yasGrubu"
                value={g}
                required
                className="sr-only"
                onChange={() => mark("02", true)}
              />
              {g} yaş
            </label>
          ))}
        </div>
        <Clearance no="02" ok={Boolean(granted["02"])} />
      </fieldset>

      <fieldset className="border-b border-[var(--hairline)] py-7">
        <legend className="t-mono text-ignition">Step 03 — Görev Seçimi</legend>
        <div className="mt-5 flex flex-wrap gap-3">
          {MISSIONS.map((m) => (
            <label
              key={m.value}
              className="t-mono cursor-pointer border border-[var(--hairline)] px-4 py-2 text-ash transition-colors has-[:checked]:border-ignition has-[:checked]:text-ignition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ignition"
            >
              <input
                type="radio"
                name="gorev"
                value={m.value}
                required
                className="sr-only"
                onChange={() => mark("03", true)}
              />
              {m.label}
            </label>
          ))}
        </div>
        <Clearance no="03" ok={Boolean(granted["03"])} />
      </fieldset>

      <fieldset className="py-7">
        <legend className="t-mono text-ignition">Step 04 — İletişim Kanalı</legend>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <Field
            label="Telefon"
            name="telefon"
            type="tel"
            required
            onValid={(ok) => mark("04", ok)}
          />
          <Field label="E-posta (opsiyonel)" name="eposta" type="email" />
        </div>
        <Clearance no="04" ok={Boolean(granted["04"])} />
      </fieldset>

      {status === "error" && (
        <p role="alert" className="t-mono mb-5 text-ignition">
          HATA — {message}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="t-mono w-full border border-ignition bg-ignition px-6 py-4 text-void transition-colors hover:bg-transparent hover:text-ignition disabled:opacity-50"
      >
        {status === "sending" ? "Gönderiliyor…" : "[ Submit Flight Plan ]"}
      </button>

      <p aria-live="polite" className="sr-only">
        {status === "sending" ? "Uçuş planı gönderiliyor" : ""}
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  onValid,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  onValid?: (ok: boolean) => void;
}) {
  return (
    <label className="block">
      <span className="t-mono mb-2 block text-ash">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        minLength={type === "text" ? 2 : undefined}
        autoComplete="off"
        onChange={(e) => onValid?.(e.currentTarget.checkValidity())}
        className="w-full border border-[var(--hairline)] bg-void px-4 py-3 font-body text-cyber outline-none transition-colors focus:border-ignition"
      />
    </label>
  );
}
