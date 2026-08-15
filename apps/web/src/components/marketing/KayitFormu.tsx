"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import { kayitStrings } from "@/lib/i18n/kayit";
import { ui } from "@/lib/i18n/ui";
import { programAdi, programSecenekleri } from "@/lib/kayit/programlar";
import {
  BOS_BASVURU,
  validate,
  type HataAnahtari,
  type Hatalar,
  type KayitBasvurusu,
} from "@/lib/kayit/schema";
import { channels, contact } from "@/lib/seo/site";
import { Reveal } from "./Reveal";

/**
 * KAYIT VE KABUL FORMU — çevrimiçi hâli.
 *
 * Kâğıt formun birebir karşılığı: aynı bölümler, aynı sıra, aynı sözleşme
 * maddeleri. Gönderildiğinde sunucu PDF'i üretip merkeze e-postayla
 * gönderir; aynı PDF veliye de iner.
 *
 * DOĞRULAMA TEK KAYNAKTAN. Kurallar `lib/kayit/schema` içinde; burası ve
 * uç nokta aynı `validate()` çağrısını kullanır. İki yerde ayrı yazılsaydı
 * tarayıcının geçirdiği bir formu sunucu reddeder ya da tersi olurdu.
 *
 * WHATSAPP DOSYA EKLEYEMEZ. Bir web sayfası `wa.me` bağlantısıyla yalnızca
 * METİN geçirebilir; dosya iliştiremez (`mailto:` için de aynısı geçerli).
 * Bu yüzden PDF e-postayla gider, WhatsApp düğmesi ise özet metni açar ve
 * veli isterse indirdiği PDF'i sohbete kendi ekler. Bunu gizlemek yerine
 * arayüzde açıkça yazıyoruz.
 *
 * SUNUCU SESSİZ KALIRSA. E-posta gönderilemezse başarı ekranı GÖSTERİLMEZ;
 * veli WhatsApp ve telefon seçenekleriyle karşılanır. "Gönderildi" deyip
 * hiçbir şey iletmemek, bu formda yapılabilecek en pahalı hatadır.
 */

type Durum =
  | { tip: "form" }
  | { tip: "gonderiliyor" }
  | { tip: "basarili"; no: string; pdf: string }
  | { tip: "hata" };

const HATA_METNI: Record<HataAnahtari, keyof ReturnType<typeof kayitStrings>> = {
  zorunlu: "hataZorunlu",
  telefonGecersiz: "hataTelefon",
  epostaGecersiz: "hataEposta",
  tarihGecersiz: "hataTarih",
  programSecilmedi: "hataProgram",
  detayGerekli: "hataDetay",
  onayGerekli: "hataOnay",
  cokUzun: "hataUzun",
};

const GIRDI =
  "w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-[15px] text-white " +
  "placeholder:text-czr-ice/35 transition focus:border-czr-orange/60 focus:bg-white/[0.07] " +
  "focus:outline-none focus:ring-2 focus:ring-czr-orange/25";
const GIRDI_HATA = "border-red-400/70 bg-red-400/[0.06]";
const ETIKET = "block text-[13px] font-semibold text-czr-ice/85";

/**
 * ALAN BİLEŞENLERİ MODÜL SEVİYESİNDE — bileşenin İÇİNDE TANIMLANAMAZLAR.
 *
 * Önceki sürümde `Alan`, `Metin` vb. `KayitFormu`'nun gövdesinde
 * tanımlıydı. Her tuş vuruşu state'i değiştirir, bileşen yeniden çalışır
 * ve bu iç tanımlar her seferinde YENİ birer fonksiyon nesnesi olur.
 * React, tip kimliği değişen bir öğeyi güncellemez; söküp yeniden kurar —
 * input DOM'dan kalkıp geri gelir ve odak düşer. Kullanıcı bunu "bir harf
 * yazınca kutu kapanıyor, tekrar tıklamak gerekiyor" diye yaşadı
 * (kurucunun birebir raporu). Modül seviyesindeki tipler kararlıdır;
 * React aynı input'u yerinde günceller ve odak korunur.
 *
 * Bu yüzden bu bileşenler durum TAŞIMAZ: değer, hata ve değişim işleyicisi
 * dışarıdan gelir. Form içindeki kısa `alan()/metin()/...` kurucuları
 * çağrı yerlerini sade tutar — onlar bileşen değil düz fonksiyondur,
 * render sırasında çağrılır ve tip sınırı oluşturmazlar.
 */

function AlanUI({
  id,
  etiket,
  ipucu,
  tip = "text",
  genis = false,
  deger,
  hata,
  onDegis,
  ...rest
}: {
  id: string;
  etiket: string;
  ipucu?: string;
  tip?: "text" | "tel" | "email" | "date";
  genis?: boolean;
  deger: string;
  hata: string | null;
  onDegis: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "type" | "value" | "onChange">) {
  return (
    <div className={genis ? "sm:col-span-2" : ""}>
      <label htmlFor={id} className={ETIKET}>
        {etiket}
      </label>
      <input
        {...rest}
        id={id}
        type={tip}
        value={deger}
        onChange={(e) => onDegis(e.target.value)}
        aria-invalid={hata ? true : undefined}
        aria-describedby={hata ? `${id}-hata` : ipucu ? `${id}-ipucu` : undefined}
        // Telefon ve e-posta latin/rakamdır; sağdan sola akışta kendi
        // yönlerini korumaları gerekir.
        dir={tip === "tel" || tip === "email" || tip === "date" ? "ltr" : undefined}
        className={`mt-2 ${GIRDI} ${hata ? GIRDI_HATA : ""}`}
      />
      {hata ? (
        <p id={`${id}-hata`} className="mt-1.5 text-[12.5px] font-medium text-red-300">
          {hata}
        </p>
      ) : ipucu ? (
        <p id={`${id}-ipucu`} className="mt-1.5 text-[12px] text-czr-ice/50">
          {ipucu}
        </p>
      ) : null}
    </div>
  );
}

function MetinUI({
  id,
  etiket,
  satir = 3,
  deger,
  hata,
  onDegis,
}: {
  id: string;
  etiket: string;
  satir?: number;
  deger: string;
  hata: string | null;
  onDegis: (v: string) => void;
}) {
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className={ETIKET}>
        {etiket}
      </label>
      <textarea
        id={id}
        rows={satir}
        value={deger}
        onChange={(e) => onDegis(e.target.value)}
        aria-invalid={hata ? true : undefined}
        aria-describedby={hata ? `${id}-hata` : undefined}
        className={`mt-2 resize-y ${GIRDI} ${hata ? GIRDI_HATA : ""}`}
      />
      {hata ? (
        <p id={`${id}-hata`} className="mt-1.5 text-[12.5px] font-medium text-red-300">
          {hata}
        </p>
      ) : null}
    </div>
  );
}

/** Evet/Hayır ikilisi; açılan detay alanı `children` ile gelir. */
function EvetHayirUI({
  ad,
  soru,
  deger,
  evet,
  hayir,
  onSec,
  children,
}: {
  ad: string;
  soru: string;
  deger: boolean;
  evet: string;
  hayir: string;
  onSec: (v: boolean) => void;
  children?: React.ReactNode;
}) {
  return (
    <div className="sm:col-span-2">
      <fieldset>
        <legend className={ETIKET}>{soru}</legend>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {[
            { v: true, l: evet },
            { v: false, l: hayir },
          ].map((o) => (
            <label
              key={String(o.v)}
              className={`cursor-pointer rounded-xl border px-5 py-2.5 text-[14px] font-semibold transition ${
                deger === o.v
                  ? "border-czr-orange bg-czr-orange/15 text-white"
                  : "border-white/15 text-czr-ice/70 hover:border-white/30"
              }`}
            >
              <input
                type="radio"
                name={ad}
                className="sr-only"
                checked={deger === o.v}
                onChange={() => onSec(o.v)}
              />
              {o.l}
            </label>
          ))}
        </div>
      </fieldset>
      {children}
    </div>
  );
}

function OnayUI({
  id,
  metin,
  not,
  deger,
  hata,
  onDegis,
}: {
  id: string;
  metin: string;
  not?: string;
  deger: boolean;
  hata: string | null;
  onDegis: (v: boolean) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition ${
          hata ? "border-red-400/70 bg-red-400/[0.06]" : "border-white/12 hover:border-white/25"
        }`}
      >
        <input
          id={id}
          type="checkbox"
          checked={deger}
          onChange={(e) => onDegis(e.target.checked)}
          aria-describedby={hata ? `${id}-hata` : undefined}
          className="mt-0.5 h-5 w-5 shrink-0 accent-[#ff8c00]"
        />
        <span className="text-[14px] leading-relaxed text-czr-ice/85">{metin}</span>
      </label>
      {not ? <p className="mt-2 ps-1 text-[12px] leading-relaxed text-czr-ice/50">{not}</p> : null}
      {hata ? (
        <p id={`${id}-hata`} className="mt-1.5 text-[12.5px] font-medium text-red-300">
          {hata}
        </p>
      ) : null}
    </div>
  );
}

function BolumUI({
  no,
  baslik,
  children,
}: {
  no: string;
  baslik: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-white/8 pt-10">
      <Reveal>
        <h3 className="flex items-baseline gap-3 text-[18px] font-bold text-white sm:text-[20px]">
          <span className="czr-mono text-[12px] tabular-nums text-czr-orange">{no}</span>
          {baslik}
        </h3>
      </Reveal>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function KayitFormu({ locale }: { locale: Locale }) {
  const t = kayitStrings(locale);
  const chrome = ui(locale);
  const [f, setF] = useState<KayitBasvurusu>(BOS_BASVURU);
  const [hatalar, setHatalar] = useState<Hatalar>({});
  const [durum, setDurum] = useState<Durum>({ tip: "form" });
  const ozetRef = useRef<HTMLParagraphElement>(null);
  const kokId = useId();

  const set = <K extends keyof KayitBasvurusu>(k: K, v: KayitBasvurusu[K]) => {
    setF((o) => ({ ...o, [k]: v }));
    // Kullanıcı düzeltmeye başlar başlamaz hata işareti kalkar; yazarken
    // kırmızı bir kutuya bakmaya devam etmek caydırıcıdır.
    setHatalar((h) => (h[k] ? { ...h, [k]: undefined } : h));
  };

  const hataMetni = (k: keyof KayitBasvurusu) => {
    const kod = hatalar[k];
    return kod ? (t[HATA_METNI[kod]] as string) : null;
  };

  const secenekler = useMemo(
    () =>
      programSecenekleri.map((p) => ({ ...p, ad: programAdi(p.id, locale) })),
    [locale],
  );

  /** WhatsApp'a geçirilecek özet — dosya değil, düz metin. */
  const whatsappMetni = () => {
    // Program satırı yok: liste artık bilgilendirme amaçlı, veli seçmiyor.
    const satirlar = [
      `${t.eyebrow} — ${t.titleLead} ${t.titleAccent}`.trim(),
      `${t.ogrenciAd}: ${f.ogrenciAd}`,
      `${t.dogumTarihi}: ${f.dogumTarihi}`,
      `${t.veliAd}: ${f.veliAd}`,
      `${t.telefon}: ${f.telefon}`,
      f.eposta ? `${t.eposta}: ${f.eposta}` : "",
      `${t.adres}: ${f.adres}`,
      f.baslangicTarihi ? `${t.baslangicTarihi}: ${f.baslangicTarihi}` : "",
      `${t.odemeTuru}: ${f.odemeTuru === "pesin" ? t.pesin : t.taksitli}`,
      f.odemeGunu ? `${t.odemeGunu}: ${f.odemeGunu}` : "",
      f.toplamTutar ? `${t.toplamTutar}: ${f.toplamTutar}` : "",
      f.alerjiVar ? `${t.alerjiDetay}: ${f.alerjiDetay}` : "",
      f.hastalikVar ? `${t.hastalikDetay}: ${f.hastalikDetay}` : "",
      f.fobiVar ? `${t.fobiDetay}: ${f.fobiDetay}` : "",
    ].filter(Boolean);
    return satirlar.join("\n");
  };

  const pdfIndir = (b64: string, no: string) => {
    const ikili = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const url = URL.createObjectURL(new Blob([ikili], { type: "application/pdf" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `cezeri-robotech-kayit-${no}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Sekme kapanmadan serbest bırakılmazsa blob bellekte kalır.
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    const h = validate(f);
    setHatalar(h);
    if (Object.keys(h).length > 0) {
      // Odak özete taşınır: ekran okuyucu hatayı duyurur, uzun formda
      // kullanıcı hangi alanların kaldığını görmek için yukarı döner.
      ozetRef.current?.focus();
      return;
    }

    setDurum({ tip: "gonderiliyor" });
    try {
      const r = await fetch("/api/kayit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...f, locale }),
      });
      const veri = (await r.json()) as {
        ok: boolean;
        no?: string;
        pdf?: string;
        hatalar?: Hatalar;
      };

      if (!r.ok || !veri.ok) {
        if (veri.hatalar) {
          setHatalar(veri.hatalar);
          setDurum({ tip: "form" });
          ozetRef.current?.focus();
          return;
        }
        setDurum({ tip: "hata" });
        return;
      }

      const no = veri.no ?? "";
      if (veri.pdf) pdfIndir(veri.pdf, no);
      setDurum({ tip: "basarili", no, pdf: veri.pdf ?? "" });
    } catch {
      setDurum({ tip: "hata" });
    }
  };

  // ── Başarı ekranı
  if (durum.tip === "basarili") {
    return (
      <Reveal>
        <div className="czr-glass-panel czr-rim mt-14 rounded-3xl border border-czr-emerald/30 p-8 text-center sm:p-12">
          <h3 className="text-[22px] font-bold text-white sm:text-[26px]">{t.basariliBaslik}</h3>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-czr-ice/75">
            {t.basariliGovde}
          </p>
          <p className="czr-mono mt-4 text-[18px] font-bold tracking-[0.14em] text-czr-orange">
            {durum.no}
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => pdfIndir(durum.pdf, durum.no)}
              className="rounded-2xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-czr-orange/50 hover:bg-white/5"
            >
              {t.pdfIndir}
            </button>
            <a
              href={`${channels.whatsapp.url}?text=${encodeURIComponent(`${durum.no}\n${whatsappMetni()}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-czr-base transition hover:-translate-y-0.5"
            >
              {t.whatsappGonder}
            </a>
          </div>
          <p className="mx-auto mt-5 max-w-xl text-[12.5px] leading-relaxed text-czr-ice/55">
            {t.whatsappNot}
          </p>

          <button
            type="button"
            onClick={() => {
              setF(BOS_BASVURU);
              setHatalar({});
              setDurum({ tip: "form" });
            }}
            className="mt-8 text-[13px] font-semibold text-czr-ice/60 underline underline-offset-4 transition hover:text-czr-orange"
          >
            {t.yeniForm}
          </button>
        </div>
      </Reveal>
    );
  }

  // ── Hata ekranı — form verisi korunur, veli tekrar yazmak zorunda kalmaz.
  if (durum.tip === "hata") {
    return (
      <Reveal>
        <div className="czr-glass-panel czr-rim mt-14 rounded-3xl border border-red-400/35 p-8 text-center sm:p-12">
          <h3 className="text-[22px] font-bold text-white sm:text-[26px]">{t.hataBaslik}</h3>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-czr-ice/75">
            {t.hataGovde}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={`${channels.whatsapp.url}?text=${encodeURIComponent(whatsappMetni())}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-czr-base transition hover:-translate-y-0.5"
            >
              {t.whatsappGonder}
            </a>
            <a
              href={`tel:${contact.phoneE164}`}
              dir="ltr"
              className="rounded-2xl border border-white/20 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-czr-orange/50"
            >
              {contact.phoneDisplay}
            </a>
          </div>
          <button
            type="button"
            onClick={() => setDurum({ tip: "form" })}
            className="mt-8 text-[13px] font-semibold text-czr-ice/60 underline underline-offset-4 transition hover:text-czr-orange"
          >
            {chrome.mediaClose}
          </button>
        </div>
      </Reveal>
    );
  }

  const gonderiliyor = durum.tip === "gonderiliyor";
  const hataVar = Object.values(hatalar).some(Boolean);

  // ── Kısa kurucular. Bunlar BİLEŞEN DEĞİL, render sırasında çağrılan düz
  // fonksiyonlar: döndürdükleri öğelerin tipi modül seviyesindeki kararlı
  // AlanUI/MetinUI/...'dır, bu yüzden tuş vuruşunda odak düşmez (üstteki
  // modül yorumuna bakın). Amaçları yalnızca çağrı yerlerini sade tutmak.
  const alan = (
    k: keyof KayitBasvurusu,
    etiket: string,
    ekstra?: Partial<React.ComponentProps<typeof AlanUI>>,
  ) => (
    <AlanUI
      id={`${kokId}-${String(k)}`}
      etiket={etiket}
      deger={String(f[k] ?? "")}
      hata={hataMetni(k)}
      onDegis={(v) => set(k, v as KayitBasvurusu[typeof k])}
      {...ekstra}
    />
  );

  const metin = (k: keyof KayitBasvurusu, etiket: string, satir = 3) => (
    <MetinUI
      id={`${kokId}-${String(k)}`}
      etiket={etiket}
      satir={satir}
      deger={String(f[k] ?? "")}
      hata={hataMetni(k)}
      onDegis={(v) => set(k, v as KayitBasvurusu[typeof k])}
    />
  );

  const evetHayir = (
    soruK: "alerjiVar" | "hastalikVar" | "fobiVar",
    detayK: "alerjiDetay" | "hastalikDetay" | "fobiDetay",
    soru: string,
    detayEtiket: string,
  ) => (
    <EvetHayirUI
      ad={`${kokId}-${soruK}`}
      soru={soru}
      deger={f[soruK]}
      evet={t.evet}
      hayir={t.hayir}
      onSec={(v) => set(soruK, v)}
    >
      {f[soruK] ? <div className="mt-4">{metin(detayK, detayEtiket, 2)}</div> : null}
    </EvetHayirUI>
  );

  const onay = (k: "sartlarOnay" | "saglikRiza" | "medyaItiraz", metinStr: string, not?: string) => (
    <OnayUI
      id={`${kokId}-${k}`}
      metin={metinStr}
      not={not}
      deger={Boolean(f[k])}
      hata={hataMetni(k)}
      onDegis={(v) => set(k, v)}
    />
  );

  return (
    <form onSubmit={gonder} noValidate className="mt-14 space-y-10">
      {/* Bot tuzağı — ekranda ve ekran okuyucuda görünmez. */}
      <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
        <label htmlFor={`${kokId}-website`}>Website</label>
        <input
          id={`${kokId}-website`}
          name="website"
          tabIndex={-1}
          autoComplete="off"
          value={f.website ?? ""}
          onChange={(e) => set("website", e.target.value)}
        />
      </div>

      <p
        ref={ozetRef}
        tabIndex={-1}
        role="alert"
        className={`rounded-2xl border border-red-400/50 bg-red-400/[0.08] px-5 py-4 text-[14px] font-semibold text-red-200 outline-none ${
          hataVar ? "" : "hidden"
        }`}
      >
        {t.hataOzet}
      </p>

      <BolumUI no="1" baslik={t.s1}>
        {alan("ogrenciAd", t.ogrenciAd, { autoComplete: "off", required: true })}
        {alan("dogumTarihi", t.dogumTarihi, { tip: "date", required: true })}
        {alan("veliAd", t.veliAd, { autoComplete: "name", required: true })}
        {alan("telefon", t.telefon, { tip: "tel", autoComplete: "tel", required: true })}
        {alan("eposta", t.eposta, { tip: "email", ipucu: t.epostaHint, autoComplete: "email" })}
        {metin("adres", t.adres, 2)}
      </BolumUI>

      <BolumUI no="2" baslik={t.s2}>
        {/* Program listesi SALT BİLGİLENDİRME — kurucunun kararı: veli
            işaretlemez; liste, çocuğun neler görüp öğreneceğini göstermek
            için durur. Programlar kayıt sırasında merkezde birlikte
            belirlenir ve PDF'te alan elle doldurulmak üzere boş basılır.
            `ul` bilinçli: form kontrolü değil içerik listesi. */}
        <div className="sm:col-span-2">
          <p className={ETIKET}>{t.programlar}</p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-czr-ice/55">
            {t.programlarNot}
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {secenekler.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-xl border border-white/12 px-4 py-3 text-[14px] text-czr-ice/75"
              >
                <span
                  aria-hidden="true"
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-czr-orange"
                />
                {p.ad}
              </li>
            ))}
          </ul>
        </div>

        {alan("baslangicTarihi", t.baslangicTarihi, { tip: "date", ipucu: t.tarihHint })}
        {alan("bitisTarihi", t.bitisTarihi, { tip: "date", ipucu: t.tarihHint })}
      </BolumUI>

      <BolumUI no="3" baslik={t.s3}>
        <fieldset className="sm:col-span-2">
          <legend className={ETIKET}>{t.odemeTuru}</legend>
          <div className="mt-2.5 flex flex-wrap gap-2">
            {(
              [
                { v: "pesin", l: t.pesin },
                { v: "taksitli", l: t.taksitli },
              ] as const
            ).map((o) => (
              <label
                key={o.v}
                className={`cursor-pointer rounded-xl border px-5 py-2.5 text-[14px] font-semibold transition ${
                  f.odemeTuru === o.v
                    ? "border-czr-orange bg-czr-orange/15 text-white"
                    : "border-white/15 text-czr-ice/70 hover:border-white/30"
                }`}
              >
                <input
                  type="radio"
                  name={`${kokId}-odeme`}
                  className="sr-only"
                  checked={f.odemeTuru === o.v}
                  onChange={() => set("odemeTuru", o.v)}
                />
                {o.l}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Ödeme günü: `type="date"` — tıklanınca tarayıcının takvimi
            açılır, veli günü oradan seçer (kurucunun isteği). */}
        {alan("odemeGunu", t.odemeGunu, { tip: "date", ipucu: t.odemeGunuHint, required: true })}
        {alan("toplamTutar", t.toplamTutar, { ipucu: t.tutarHint, inputMode: "decimal" })}
        {f.odemeTuru === "taksitli" ? metin("taksitPlani", t.taksitPlani, 2) : null}
      </BolumUI>

      <BolumUI no="4" baslik={t.s4}>
        {evetHayir("alerjiVar", "alerjiDetay", t.alerjiSoru, t.alerjiDetay)}
        {evetHayir("hastalikVar", "hastalikDetay", t.hastalikSoru, t.hastalikDetay)}
        {evetHayir("fobiVar", "fobiDetay", t.fobiSoru, t.fobiDetay)}
      </BolumUI>

      {/* ── Şartlar ve koşullar: okunur metin, düzenlenemez. */}
      <section className="border-t border-white/8 pt-10">
        <Reveal>
          <h3 className="flex items-baseline gap-3 text-[18px] font-bold text-white sm:text-[20px]">
            <span className="czr-mono text-[12px] tabular-nums text-czr-orange">5–10</span>
            {t.sTerms}
          </h3>
          <p className="mt-3 text-[12.5px] text-czr-ice/50">{t.governingNote}</p>
        </Reveal>

        <div className="czr-glass-panel mt-6 max-h-[420px] overflow-y-auto rounded-2xl p-6 sm:p-7">
          {t.terms.map((blok, i) => (
            <div key={blok.title} className={i > 0 ? "mt-6" : ""}>
              <h4 className="text-[15px] font-bold text-white">
                {i + 5}. {blok.title}
              </h4>
              <ul className="mt-2.5 space-y-2">
                {blok.items.map((m) => (
                  <li key={m} className="flex gap-2.5 text-[13.5px] leading-relaxed text-czr-ice/75">
                    <span
                      aria-hidden="true"
                      className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-czr-orange"
                    />
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-5">
          {onay("medyaItiraz", t.medyaItiraz)}
          {f.medyaItiraz ? (
            <div className="mt-4 grid gap-5 sm:grid-cols-2">
              {metin("medyaItirazDetay", t.medyaItirazDetay, 2)}
            </div>
          ) : null}
        </div>
      </section>

      {/* ── 11. Onay ve kabul */}
      <section className="border-t border-white/8 pt-10">
        <Reveal>
          <h3 className="flex items-baseline gap-3 text-[18px] font-bold text-white sm:text-[20px]">
            <span className="czr-mono text-[12px] tabular-nums text-czr-orange">11</span>
            {t.s11}
          </h3>
        </Reveal>

        <div className="mt-6 space-y-4">
          {onay("sartlarOnay", t.sartlarOnay)}
          {/* Açık rıza YALNIZCA sağlık verisi girildiyse sorulur; girilmemişse
              istenmesi gereksiz bir onay yükü olurdu. */}
          {f.alerjiVar || f.hastalikVar || f.fobiVar
            ? onay("saglikRiza", t.saglikRiza, t.saglikRizaNot)
            : null}
        </div>

        <p className="mt-5 text-[12.5px] leading-relaxed text-czr-ice/50">{t.imzaNot}</p>

        <div className="mt-8">
          <button
            type="submit"
            disabled={gonderiliyor}
            className="w-full rounded-2xl bg-czr-launch px-8 py-4 text-sm font-bold uppercase tracking-wide text-czr-base transition duration-300 ease-czr-cine hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(255,140,0,0.42)] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-12"
          >
            {gonderiliyor ? t.gonderiliyor : t.gonder}
          </button>
        </div>
      </section>
    </form>
  );
}
