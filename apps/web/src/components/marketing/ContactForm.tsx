"use client";

import { useState, type FormEvent } from "react";
import { contact, disciplines } from "@/lib/seo/site";

type Status = "idle" | "sending" | "ok" | "error";

const FIELD =
  "w-full rounded-xl border border-white/12 bg-czr-base/60 px-4 py-3 text-[15px] text-white placeholder:text-czr-ice/35 transition focus:border-czr-orange";
const LABEL = "block text-[13px] font-semibold text-czr-ice/80";

/**
 * "Aday Mühendis Uçuş İzin Formu"
 *
 * Doğrulama hem burada hem `/api/contact` içinde yapılır. İstemci tarafı
 * doğrulama yalnızca kullanıcı deneyimi içindir — atlanabilir olduğu için
 * güvenlik sınırı sunucudur.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };

      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error ?? "Başvuru gönderilemedi. Lütfen tekrar deneyin.");
        return;
      }

      setStatus("ok");
      setMessage("Başvurunuz alındı. Ekibimiz en kısa sürede sizinle iletişime geçecek.");
      e.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage(
        `Bağlantı kurulamadı. Lütfen ${contact.phoneDisplay} numarasından bize ulaşın.`,
      );
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Bal küpü — ekran okuyucudan ve gözden gizli, botlar doldurur */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label htmlFor="website">Bu alanı boş bırakın</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <label className={LABEL} htmlFor="parentName">
            Veli adı soyadı <span className="text-czr-orange">*</span>
          </label>
          <input
            id="parentName"
            name="parentName"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Ad Soyad"
            className={FIELD}
          />
        </div>

        <div className="space-y-2">
          <label className={LABEL} htmlFor="phone">
            Telefon <span className="text-czr-orange">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            placeholder="05XX XXX XX XX"
            className={FIELD}
          />
        </div>

        <div className="space-y-2">
          <label className={LABEL} htmlFor="email">
            E-posta
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={120}
            autoComplete="email"
            placeholder="ornek@eposta.com"
            className={FIELD}
          />
        </div>

        <div className="space-y-2">
          <label className={LABEL} htmlFor="studentAge">
            Öğrenci yaşı <span className="text-czr-orange">*</span>
          </label>
          <input
            id="studentAge"
            name="studentAge"
            type="number"
            required
            min={5}
            max={18}
            inputMode="numeric"
            placeholder="6-16"
            className={FIELD}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className={LABEL} htmlFor="interest">
          İlgilendiği hangar <span className="text-czr-orange">*</span>
        </label>
        <select id="interest" name="interest" required defaultValue="" className={FIELD}>
          <option value="" disabled>
            Seçiniz
          </option>
          {disciplines.map((d) => (
            <option key={d.id} value={d.title}>
              {d.title}
            </option>
          ))}
          <option value="Henüz emin değilim">Henüz emin değilim</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className={LABEL} htmlFor="message">
          Eklemek istedikleriniz
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1000}
          placeholder="Öğrencinin ilgi alanları, uygun gün/saatler…"
          className={`${FIELD} resize-y`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="w-full rounded-full bg-czr-launch px-8 py-4 text-sm font-bold uppercase tracking-wide text-czr-base transition duration-300 ease-czr-cine hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(255,140,0,0.42)] disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
      >
        {status === "sending" ? "Gönderiliyor…" : "Uçuş İznini Gönder"}
      </button>

      {/* role="status" — ekran okuyucu, odak kaybetmeden sonucu duyurur */}
      {message ? (
        <p
          role="status"
          className={`rounded-xl border px-4 py-3 text-[14px] leading-relaxed ${
            status === "ok"
              ? "border-czr-emerald/35 bg-czr-emerald/10 text-czr-emerald"
              : "border-red-400/35 bg-red-400/10 text-red-300"
          }`}
        >
          {message}
        </p>
      ) : null}

      <p className="text-[12px] leading-relaxed text-czr-ice/40">
        Gönderdiğiniz bilgiler yalnızca başvurunuzu değerlendirmek ve sizinle
        iletişime geçmek için kullanılır, üçüncü taraflarla paylaşılmaz.
      </p>
    </form>
  );
}
