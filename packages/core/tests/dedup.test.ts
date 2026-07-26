import { describe, it, expect } from "vitest";
import { contentHash, similarity, trLower, normalizeForHash } from "../src/dedup/content-hash.js";

describe("dedup", () => {
  it("Turkce buyuk I'yi dogru kucultur", () => {
    expect(trLower("İSTANBUL")).toBe("istanbul");
    expect(trLower("IRAK")).toBe("ırak");
  });

  it("URL ve etiket farkini yok sayar", () => {
    const a = "Nöbet ücreti ödenmiyor! https://ornek.com/1 #sağlık";
    const b = "Nöbet ücreti ödenmiyor";
    expect(contentHash(a)).toBe(contentHash(b));
  });

  it("farkli icerigi ayirir", () => {
    expect(contentHash("Nöbet ücreti")).not.toBe(contentHash("Ek ödeme"));
  });

  it("yakin kopyayi yuksek benzerlikle isaretler", () => {
    const s = similarity(
      "Nöbet ücretleri üç aydır ödenmiyor",
      "Nöbet ücretleri üç aydır ödenmemektedir",
    );
    expect(s).toBeGreaterThan(0.5);
  });

  it("normalize bosluklari sadelestirir", () => {
    expect(normalizeForHash("  Ek   ödeme!!  ")).toBe("ek ödeme");
  });
});
