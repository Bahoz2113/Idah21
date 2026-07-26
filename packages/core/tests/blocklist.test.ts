import { describe, it, expect } from "vitest";
import { runBlocklist, combineRisk, canPublish } from "../src/legal-guard/blocklist.js";

describe("blocklist — BLOCKED kategorileri", () => {
  it("kufuru yakalar", () => {
    const r = runBlocklist("Bu şerefsiz yönetim çalışanı hiçe sayıyor.");
    expect(r.blocked).toBe(true);
    expect(r.hits.some((h) => h.category === "profanity")).toBe(true);
  });

  it("kesin suc isnadini yakalar", () => {
    const r = runBlocklist("Yöneticiler döner sermayeden çaldı.");
    expect(r.level).toBe("BLOCKED");
    expect(r.hits.some((h) => h.category === "crime_accusation")).toBe(true);
  });

  it("gorevi kotuye kullanma isnadini yakalar", () => {
    const r = runBlocklist("İl müdürlüğü görevini kötüye kullanmıştır.");
    expect(r.blocked).toBe(true);
  });

  it("tehdidi yakalar", () => {
    const r = runBlocklist("Bu kararın hesabını sorarız yoksa gününü görecekler.");
    expect(r.blocked).toBe(true);
  });

  it("saglik verisini yakalar", () => {
    const r = runBlocklist("Personelin kanser teşhisi sonrası izni verilmedi.");
    expect(r.hits.some((h) => h.category === "health_data")).toBe(true);
    expect(r.blocked).toBe(true);
  });
});

describe("blocklist — HIGH ve MEDIUM", () => {
  it("kisi adini HIGH yapar", () => {
    const r = runBlocklist("Sayın Ahmet Yılmaz'ın açıklaması sahayla örtüşmüyor.");
    expect(r.level).toBe("HIGH");
    expect(canPublish(r.level)).toBe(false);
  });

  it("kesinlik iddiasini HIGH yapar", () => {
    const r = runBlocklist("Bu gecikme bilerek ve isteyerek yapılmıştır.");
    expect(r.level).toBe("HIGH");
  });

  it("sert kelimeyi MEDIUM yapar ama engellemez", () => {
    const r = runBlocklist("Nöbet ücretlerindeki bu gecikme bir rezalettir, düzeltilmelidir.");
    expect(r.level).toBe("MEDIUM");
    expect(canPublish(r.level)).toBe(true);
  });
});

describe("blocklist — temiz metin ve LLM onceligi", () => {
  it("mesru elestiriyi LOW birakir", () => {
    const r = runBlocklist(
      "Nöbet ücreti ödemeleri üç aydır gecikiyor. Sağlık Bakanlığı'ndan takvim açıklaması bekliyoruz.",
    );
    expect(r.level).toBe("LOW");
    expect(r.hits).toHaveLength(0);
  });

  it("blocklist LLM'i ezer — LLM LOW dese bile BLOCKED kalir", () => {
    const r = runBlocklist("Bu şerefsizlik böyle sürmez.");
    expect(combineRisk(r, "LOW")).toBe("BLOCKED");
  });

  it("LLM daha yuksek risk gorurse o kazanir", () => {
    const r = runBlocklist("Temiz bir metin.");
    expect(combineRisk(r, "HIGH")).toBe("HIGH");
  });
});
